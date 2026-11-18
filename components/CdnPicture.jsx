import React, {
  Children,
  cloneElement,
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { DEFAULT_ITEM_IMAGE_SRC } from '@/utils/itemImage';
import {
  chooseCdnRoute,
  confirmCdnDirect,
  confirmCdnFallback,
  getCdnHostname,
  getStorageImageUrl,
  isCdnFallbackPreferred,
  releaseCdnProbe,
  reportCdnFallback,
} from '@/utils/cdnImageRoute';

const DIRECT_TIMEOUT = 3000;
const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

// Один наблюдатель обслуживает все карточки и слайды, включая скрытые варианты.
const visibilityCallbacks = new Map();
let observer;
function observeImage(node, callback) {
  observer ??= new IntersectionObserver((entries) => {
    for (const entry of entries) {
      visibilityCallbacks.get(entry.target)?.(entry.isIntersecting);
    }
  });
  visibilityCallbacks.set(node, callback);
  observer.observe(node);
  return () => {
    observer.unobserve(node);
    visibilityCallbacks.delete(node);
  };
}

function storageSrcSet(srcSet) {
  if (!srcSet) return undefined;
  const candidates = [];
  // Внутри URL допустимы запятые. Дескриптор (366w, 2x) заканчивается у разделителя.
  const urls = /[^\s,]\S*/g;
  let match;
  while ((match = urls.exec(srcSet))) {
    const url = match[0].replace(/,+$/, '');
    let descriptor = '';
    if (url === match[0]) {
      const comma = srcSet.indexOf(',', urls.lastIndex);
      const end = comma === -1 ? srcSet.length : comma;
      descriptor = srcSet.slice(urls.lastIndex, end).trim();
      urls.lastIndex = end;
    }
    const src = getStorageImageUrl(url);
    if (src) candidates.push(descriptor ? `${src} ${descriptor}` : src);
  }
  return candidates.join(', ') || undefined;
}

function ManagedImage({ image, host, children, pictureProps }) {
  const identity = image.props.src;
  const clientRender = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const [kind, setKind] = useState(() =>
    // Прямые ссылки в серверной разметке остаются рабочими до гидрации.
    clientRender && isCdnFallbackPreferred(host) ? 'deferred' : 'direct'
  );
  const nodeRef = useRef(null);
  const route = useRef(null);
  const lastLoaded = useRef(null);
  const externalRef = image.props.ref;
  const attach = useCallback((node) => {
    nodeRef.current = node;
    if (typeof externalRef === 'function') return externalRef(node);
    if (externalRef) externalRef.current = node;
  }, [externalRef]);
  const notifyLoad = useEffectEvent((event) => image.props.onLoad?.(event));
  const notifyError = useEffectEvent((event) => image.props.onError?.(event));

  const abandonProbe = useCallback(() => {
    if (route.current === 'probe') {
      releaseCdnProbe(host, identity);
      route.current = null;
    }
  }, [host, identity]);
  useEffect(() => abandonProbe, [abandonProbe]);

  useEffect(() => {
    const node = nodeRef.current;
    if (kind === 'placeholder') return;
    let inViewport = null;
    let failed = false;
    let transitioning = false;
    let timer;

    function loaded(event) {
      if (transitioning || !node.naturalWidth || lastLoaded.current === node.currentSrc) return;
      clearTimeout(timer);
      failed = false;
      lastLoaded.current = node.currentSrc;
      if (kind === 'direct') {
        confirmCdnDirect(host, identity, route.current ?? 'direct');
      } else if (kind === 'fallback' && route.current && route.current !== 'fallback') {
        confirmCdnFallback(host, identity, route.current);
      }
      if (route.current === 'probe') route.current = null;
      notifyLoad(event);
    }

    function startFallback(reason) {
      transitioning = true;
      clearTimeout(timer);
      reportCdnFallback(host, reason);
      setKind('fallback');
    }

    function showPlaceholder(event) {
      transitioning = true;
      clearTimeout(timer);
      abandonProbe();
      setKind('placeholder');
      notifyError(event);
    }

    function update() {
      clearTimeout(timer);
      if (transitioning) return;
      if (!inViewport || document.hidden) {
        // Событие error иногда приходит до первого ответа IntersectionObserver.
        if (inViewport === false || document.hidden) abandonProbe();
        return;
      }
      if (kind !== 'deferred' && node.complete && node.naturalWidth > 0) {
        if (lastLoaded.current !== node.currentSrc) node.dispatchEvent(new Event('load'));
        return;
      }
      // Резервная загрузка может быть медленной. Ждём ответа или сетевой ошибки.
      if (kind === 'fallback') return;
      route.current ??= chooseCdnRoute(host, identity);
      if (route.current === 'fallback') {
        startFallback('remembered');
      } else if (kind === 'deferred') {
        transitioning = true;
        setKind('direct');
      } else if (failed || (node.complete && node.naturalWidth === 0)) {
        startFallback('error');
      } else {
        timer = setTimeout(() => {
          if (!document.hidden && !(node.complete && node.naturalWidth > 0)) {
            startFallback('timeout');
          }
        }, DIRECT_TIMEOUT);
      }
    }

    function errored(event) {
      if (transitioning) return;
      if (kind === 'fallback') {
        showPlaceholder(event);
      } else if (kind === 'direct') {
        lastLoaded.current = null;
        failed = true;
        update();
      }
    }

    node.addEventListener('load', loaded);
    node.addEventListener('error', errored);
    // До гидрации или подключения слушателя загрузка могла уже завершиться.
    if (node.complete && node.naturalWidth > 0 && lastLoaded.current !== node.currentSrc) {
      node.dispatchEvent(new Event('load'));
    } else if (kind === 'fallback' && node.complete && node.currentSrc && !node.naturalWidth) {
      node.dispatchEvent(new Event('error'));
    }
    const unobserve = observeImage(node, (visible) => {
      inViewport = visible && node.getClientRects().length > 0;
      update();
    });
    document.addEventListener('visibilitychange', update);
    return () => {
      transitioning = true;
      clearTimeout(timer);
      unobserve();
      document.removeEventListener('visibilitychange', update);
      node.removeEventListener('load', loaded);
      node.removeEventListener('error', errored);
    };
  }, [kind, host, identity, abandonProbe]);

  let requestProps;
  if (kind === 'fallback') {
    requestProps = { src: getStorageImageUrl(identity), srcSet: storageSrcSet(image.props.srcSet) };
  } else if (kind !== 'direct') {
    requestProps = {
      src: kind === 'placeholder' ? DEFAULT_ITEM_IMAGE_SRC : undefined,
      srcSet: undefined,
      sizes: undefined,
    };
  }
  const displayedImage = cloneElement(image, {
    key: kind,
    ref: attach,
    onLoad: undefined,
    onError: undefined,
    ...requestProps,
  });
  if (!pictureProps) return displayedImage;
  return (
    <picture {...pictureProps} key={kind}>
      {Children.map(children, (child) => {
        if (child?.type === 'img') return displayedImage;
        if (child?.type === 'source' && kind !== 'direct') {
          const srcSet = kind === 'fallback' && storageSrcSet(child.props.srcSet);
          return srcSet ? cloneElement(child, { srcSet }) : null;
        }
        return child;
      })}
    </picture>
  );
}

export default function CdnPicture({ children, ...pictureProps }) {
  const image = Children.toArray(children).find((child) => child?.type === 'img');
  const host = getCdnHostname(image?.props.src);
  if (!host) return <picture {...pictureProps}>{children}</picture>;
  return (
    <ManagedImage key={image.props.src} image={image} host={host} pictureProps={pictureProps}>
      {children}
    </ManagedImage>
  );
}

export function CdnImage(props) {
  const host = getCdnHostname(props.src);
  const image = <img {...props} />;
  return host ? <ManagedImage key={props.src} image={image} host={host} /> : image;
}
