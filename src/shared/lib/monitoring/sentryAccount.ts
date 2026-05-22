import * as Sentry from '@sentry/nextjs';
import { getClientNetworkContext } from '@/utils/clientMonitoring';

export type SentryAccountUser = {
  id?: number | string;
  mail?: string;
  date_bir_full?: string;
  date_bir_d?: string;
  date_bir_m?: string;
  spam?: number | string;
};

export function syncSentryUser(
  user: SentryAccountUser | null | undefined,
  city: string | null = null
): void {
  if (!user?.id) {
    Sentry.setUser(null);
    Sentry.setTag('auth_state', 'guest');
    Sentry.setContext('account', { authState: 'guest' });

    if (city != null) {
      Sentry.setTag('city_id', String(city));
    }

    return;
  }

  Sentry.setUser({ id: String(user.id) });
  Sentry.setTag('auth_state', 'authorized');

  if (city != null) {
    Sentry.setTag('city_id', String(city));
  }

  Sentry.setContext('account', {
    authState: 'authorized',
    hasEmail: Boolean(user.mail),
    hasBirthday: Boolean(
      user.date_bir_full || (user.date_bir_d && user.date_bir_m)
    ),
    marketingOptIn: Number(user.spam) === 1,
  });
}

export function captureMapStateIssue(
  message: string,
  extra: Record<string, unknown> = {}
): void {
  Sentry.captureMessage(message, {
    level: 'error',
    tags: { kind: 'maps_state_error' },
    extra: {
      ...extra,
      ...getClientNetworkContext(),
    },
  });
}
