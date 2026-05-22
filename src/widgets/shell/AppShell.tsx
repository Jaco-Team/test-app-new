'use client';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Script from 'next/script';
import { useHeaderStore } from '@src/entities/header';
import { AuthModal } from './AuthModal';
import { BasketPanel } from './BasketPanel';
import { MapLoader } from './MapLoader';

export type AppShellProps = {
  city: string;
  loadMap?: boolean;
};

export function AppShell({ city, loadMap = false }: AppShellProps) {
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
      <BasketPanel city={city} />
      {loadMap ? <MapLoader city={city} /> : null}
    </>
  );
}
