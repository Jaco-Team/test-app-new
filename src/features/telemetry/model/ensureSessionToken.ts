import {
  getLocalStorageItem,
  setLocalStorageItem,
} from '@/utils/browserStorage';

function formatSessionDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function createSessionToken(date: Date): string {
  const randomPart = Math.random().toString(36).slice(2, 18);
  return `session_${randomPart}_${formatSessionDate(date)}`;
}

/** Anonymous session id sent with save_user_actions (legacy token_tmp). */
export function ensureSessionToken(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const today = formatSessionDate(new Date());
  const stored = getLocalStorageItem('token_tmp');

  if (stored && stored.length > 0) {
    const parts = stored.split('_');
    const storedDate = parts[parts.length - 1] ?? '';

    if (storedDate === today) {
      return stored;
    }
  }

  const nextToken = createSessionToken(new Date());
  setLocalStorageItem('token_tmp', nextToken);
  return nextToken;
}
