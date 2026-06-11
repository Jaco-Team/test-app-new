'use client';

import type { StoreBootstrapProps } from '@src/features/bootstrap';
import { CabinetPageShell } from '@src/widgets/cabinet';
import { OrdersPage } from './OrdersPage';

export type OrdersClientProps = {
  storeSeed: StoreBootstrapProps;
};

export function OrdersClient({ storeSeed }: OrdersClientProps) {
  return (
    <CabinetPageShell
      storeSeed={storeSeed}
      activePage="zakazy"
      title="История заказов"
      description="Все оформленные заказы собраны в одном месте."
    >
      <OrdersPage />
    </CabinetPageShell>
  );
}
