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
import { getImageProps } from 'next/image';
import { DEFAULT_ITEM_IMAGE_SRC } from '@/utils/itemImage';
import {
  chooseCdnRoute,
  confirmCdnDirect,
  confirmCdnFallback,
  getCdnHostname,
  isCdnFallbackPreferred,
  releaseCdnProbe,
  reportCdnFallback,
} from '@/utils/cdnImageRoute';

const DIRECT_TIMEOUT = 4000;
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

function optimizerSource(node, host, identity, children) {
  // При ошибке img может сжаться до ширины alt, а карточка ещё анимирует scale.
  const picture = node.closest('picture');
  const slot = picture?.clientWidth || (picture || node).parentElement?.clientWidth || node.clientWidth;
  const declaredWidth = Number(node.getAttribute('width'));
  const width = Math.min(slot || declaredWidth || 384, declaredWidth || Infinity);
  let src = node.currentSrc;
  if (getCdnHostname(src) !== host) {
    // При запомненном сбое браузер ещё не выбирал исходник из srcset.
    const source = Children.toArray(children).find(child =>
      child?.type === 'source' && child.props.srcSet &&
      (!child.props.media || window.matchMedia(child.props.media).matches)
    );
    const candidates = (source?.props.srcSet || '').split(',').map(entry => {
      const [url, descriptor] = entry.trim().split(/\s+/);
      return { url, width: Number.parseInt(descriptor, 10) || 0 };
    }).filter(candidate => getCdnHostname(candidate.url) === host);
    const targetWidth = width * Math.min(window.devicePixelRatio || 1, 2);
    src = candidates.find(candidate => candidate.width >= targetWidth)?.url
      || candidates[candidates.length - 1]?.url || identity;
  }
  const { props } = getImageProps({
    src,
    width,
    height: width,
    alt: '',
  });
  return { src: props.src, srcSet: props.srcSet };
}

function ManagedImage({ image, host, children, pictureProps }) {
  const identity = image.props.src;
  const clientRender = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const [request, setRequest] = useState(() => ({
    // Прямые ссылки в серверной разметке остаются рабочими до гидрации.
    kind: clientRender && isCdnFallbackPreferred(host) ? 'deferred' : 'direct',
  }));
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
  const optimizedSourceFor = useEffectEvent(node => optimizerSource(node, host, identity, children));

  const abandonProbe = useCallback(() => {
    if (route.current === 'probe') {
      releaseCdnProbe(host, identity);
      route.current = null;
    }
  }, [host, identity]);
  useEffect(() => abandonProbe, [abandonProbe]);

  useEffect(() => {
    const node = nodeRef.current;
    if (request.kind === 'placeholder') return;
    let inViewport = null;
    let failed = false;
    let transitioning = false;
    let timer;

    function loaded(event) {
      if (transitioning || !node.naturalWidth || lastLoaded.current === node.currentSrc) return;
      clearTimeout(timer);
      failed = false;
      lastLoaded.current = node.currentSrc;
      if (request.kind === 'direct') {
        confirmCdnDirect(host, identity, route.current ?? 'direct');
      } else if (request.kind === 'fallback' && route.current && route.current !== 'fallback') {
        confirmCdnFallback(host, identity, route.current);
      }
      if (route.current === 'probe') route.current = null;
      notifyLoad(event);
    }

    function startFallback(reason) {
      transitioning = true;
      clearTimeout(timer);
      reportCdnFallback(host, reason);
      setRequest({ kind: 'fallback', ...optimizedSourceFor(node) });
    }

    function showPlaceholder(event) {
      transitioning = true;
      clearTimeout(timer);
      abandonProbe();
      setRequest({ kind: 'placeholder', src: DEFAULT_ITEM_IMAGE_SRC });
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
      if (request.kind !== 'deferred' && node.complete && node.naturalWidth > 0) {
        if (lastLoaded.current !== node.currentSrc) node.dispatchEvent(new Event('load'));
        return;
      }
      // Резервная загрузка может быть медленной. Ждём ответа или сетевой ошибки.
      if (request.kind === 'fallback') return;
      route.current ??= chooseCdnRoute(host, identity);
      if (route.current === 'fallback') {
        startFallback('remembered');
      } else if (request.kind === 'deferred') {
        transitioning = true;
        setRequest({ kind: 'direct' });
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
      if (request.kind === 'fallback') {
        showPlaceholder(event);
      } else if (request.kind === 'direct') {
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
    } else if (request.kind === 'fallback' && node.complete && node.currentSrc && !node.naturalWidth) {
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
  }, [request, host, identity, abandonProbe]);

  const direct = request.kind === 'direct';
  const displayedImage = cloneElement(image, {
    key: request.kind,
    ref: attach,
    onLoad: undefined,
    onError: undefined,
    ...(!direct && { src: request.src, srcSet: request.srcSet, sizes: undefined }),
  });
  if (!pictureProps) return displayedImage;
  return (
    <picture {...pictureProps}>
      {Children.map(children, (child) => {
        if (child?.type === 'img') return displayedImage;
        if (child?.type === 'source' && !direct) return null;
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
