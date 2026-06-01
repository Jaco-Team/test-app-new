import { useCityStore } from '@src/entities/city';
import { useHeaderStore } from '@src/entities/header';
import { useProfileStore } from '@src/entities/profile';

/** Legacy nav bars poll `zakazy` / `get_my_count_orders_promos` every 30s. */
export const ZAKAZY_COUNT_POLL_INTERVAL_MS = 30_000;

let intervalId: ReturnType<typeof setInterval> | null = null;

export function refreshZakazyCounts(): void {
  const city = useCityStore.getState().slug;
  const token = useHeaderStore.getState().token;

  if (!city || !token) {
    return;
  }

  void useProfileStore.getState().getCountPromosOrders(city, token);
}

export function startZakazyCountPolling(): void {
  if (typeof window === 'undefined') {
    return;
  }

  stopZakazyCountPolling();
  refreshZakazyCounts();
  intervalId = window.setInterval(
    refreshZakazyCounts,
    ZAKAZY_COUNT_POLL_INTERVAL_MS
  );
}

export function stopZakazyCountPolling(): void {
  if (intervalId !== null) {
    window.clearInterval(intervalId);
    intervalId = null;
  }
}
