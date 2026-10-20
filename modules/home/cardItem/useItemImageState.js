import { useState } from 'react';

export default function useItemImageState(src, shouldLoad, itemReady) {
  const [result, setResult] = useState(null);
  const hasResultForCurrentSource = result?.src === src;
  const hasError =
    shouldLoad && hasResultForCurrentSource && result.status === 'error';
  const isLoaded =
    shouldLoad && hasResultForCurrentSource && result.status === 'loaded';

  return {
    isLoading: !itemReady || (shouldLoad && !isLoaded && !hasError),
    hasError,
    onLoad: () => setResult({ src, status: 'loaded' }),
    onError: () => setResult({ src, status: 'error' }),
  };
}
