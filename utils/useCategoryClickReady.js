import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { clearHomeCategorySelectionOnNavigation } from '@/utils/earlyCategoryClick';

export function useCategoryClickReady() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
    router.events.on(
      'routeChangeStart',
      clearHomeCategorySelectionOnNavigation
    );
    return () =>
      router.events.off(
        'routeChangeStart',
        clearHomeCategorySelectionOnNavigation
      );
  }, [router.events]);
  return ready;
}
