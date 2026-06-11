'use client';

import type { StoreBootstrapProps } from '@src/features/bootstrap';
import { AppPageShell } from '@src/widgets/layout';
import { AccountPage } from './AccountPage';

export type AccountClientProps = {
  storeSeed: StoreBootstrapProps;
};

export function AccountClient({ storeSeed }: AccountClientProps) {
  return (
    <AppPageShell storeSeed={storeSeed}>
      <AccountPage />
    </AppPageShell>
  );
}
