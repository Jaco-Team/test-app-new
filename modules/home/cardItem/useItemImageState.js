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

  // Сбрасываем результат до отрисовки новой картинки, включая повторное открытие.
  if (!isCurrentAttempt) {
    setResult({
      src,
      shouldLoad,
      itemReady,
      attempt: result.attempt + 1,
      status: null,
    });
  }

  const status = isCurrentAttempt ? result.status : null;
  const settle = (status) =>
    setResult((current) =>
      current.attempt === result.attempt && current.status !== status
        ? { ...current, status }
        : current
    );

  return {
    isLoading: !itemReady || (shouldLoad && status === null),
    hasError: shouldLoad && status === 'error',
    onLoad: () => settle('loaded'),
    onError: () => settle('error'),
  };
}
