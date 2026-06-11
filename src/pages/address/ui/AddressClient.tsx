'use client';

import type { StoreBootstrapProps } from '@src/features/bootstrap';
import { AppPageShell } from '@src/widgets/layout';
import { AddressPage } from './AddressPage';

export type AddressClientProps = {
  storeSeed: StoreBootstrapProps;
};

export function AddressClient({ storeSeed }: AddressClientProps) {
  return (
    <AppPageShell storeSeed={storeSeed}>
      <AddressPage />
    </AppPageShell>
  );
}
