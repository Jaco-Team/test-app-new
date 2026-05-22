'use client';

import { StoreBootstrap } from '@src/features/bootstrap/StoreBootstrap';
import type { StoreBootstrapProps } from '@src/features/bootstrap/StoreBootstrap';
import { AppShell } from '@src/widgets/shell/AppShell';
import { HomeHeaderConnected } from '@src/features/header/ui/HomeHeaderConnected';
import { CartPage } from './CartPage';

export type CartClientProps = {
  storeSeed: StoreBootstrapProps;
};

export function CartClient({ storeSeed }: CartClientProps) {
  return (
    <>
      <StoreBootstrap {...storeSeed} activePage="cart" />
      <AppShell city={storeSeed.city} loadMap />
      <HomeHeaderConnected
        fallbackCitySlug={storeSeed.city}
        fallbackCityLabel={storeSeed.city}
      />
      <CartPage />
    </>
  );
}
