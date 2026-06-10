'use client';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Script from 'next/script';
import { useHeaderStore } from '@src/entities/header';
import { AddressPickerModal } from '@src/features/address-picker';
import { AuthModal } from './AuthModal';
import { BasketPanel } from './BasketPanel';
import { CityModal } from './CityModal';
import { StickyCartWidget } from './StickyCartWidget';

export type AppShellProps = {
  city: string;
};

export function AppShell({ city }: AppShellProps) {
  const isShowLoad = useHeaderStore((state) => state.isShowLoad);

  return (
    <>
      <Script
        src="https://yookassa.ru/checkout-widget/v1/checkout-widget.js"
        strategy="lazyOnload"
      />

      <Backdrop sx={{ color: '#fff', zIndex: 5000 }} open={isShowLoad}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <AuthModal city={city} />
      <CityModal />
      <AddressPickerModal />
      <BasketPanel city={city} />
      <StickyCartWidget />
    </>
  );
}
