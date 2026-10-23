import { useState } from 'react';

export default function useItemImageState(src, shouldLoad, itemReady) {
  const [result, setResult] = useState({
    src,
    shouldLoad,
    itemReady,
    attempt: 0,
    status: null,
  });
  const isCurrentAttempt =
    result.src === src &&
    result.shouldLoad === shouldLoad &&
    result.itemReady === itemReady;

  // Новое открытие начинает отдельную попытку загрузки, даже при том же URL.
  if (!isCurrentAttempt) {
    setResult({
      src,
      shouldLoad,
      itemReady,
      attempt: result.attempt + 1,
      status: null,
    });
  }

  const currentResult = isCurrentAttempt ? result : { status: null };

  const settle = (status) =>
    setResult((current) =>
      current.attempt === result.attempt &&
      current.status !== 'error' &&
      current.status !== status
        ? { ...current, status }
        : current
    );

  const onLoad = (event) => {
    const image = event?.currentTarget;
    const markLoaded = () => settle('loaded');

    if (typeof image?.decode === 'function') {
      image
        .decode()
        .then(markLoaded)
        .catch(() => {
          settle(image.complete && image.naturalWidth > 0 ? 'loaded' : 'error');
        });
      return;
    }

    markLoaded();
  };

  const status = currentResult.status;
  const hasError = shouldLoad && status === 'error';

  return {
    isLoading: !itemReady || (shouldLoad && status === null),
    hasError,
    isHeroLoaded: shouldLoad && status === 'loaded',
    onLoad,
    onError: () => settle('error'),
  };
}
