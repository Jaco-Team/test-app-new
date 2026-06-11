'use client';

import type { StoreBootstrapProps } from '@src/features/bootstrap';
import { CabinetPageShell } from '@src/widgets/cabinet';
import { PromosPage } from './PromosPage';

export type PromosClientProps = {
  storeSeed: StoreBootstrapProps;
};

export function PromosClient({ storeSeed }: PromosClientProps) {
  return (
    <CabinetPageShell
      storeSeed={storeSeed}
      activePage="promokody"
      title="Мои промокоды"
      description="Здесь собираются действующие промокоды и подарки."
    >
      <PromosPage />
    </CabinetPageShell>
  );
}
