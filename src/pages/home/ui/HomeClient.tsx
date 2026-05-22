'use client';

import { HomePage } from './HomePage';
import {
  StoreBootstrap,
  type StoreBootstrapProps,
} from '@src/features/bootstrap/StoreBootstrap';
import { AppShell } from '@src/widgets/shell/AppShell';
import type { HomePageViewModel } from '../model/types';

export type HomeClientProps = {
  model: HomePageViewModel;
  storeSeed: StoreBootstrapProps;
};

export function HomeClient({ model, storeSeed }: HomeClientProps) {
  return (
    <>
      <StoreBootstrap {...storeSeed} />
      <AppShell city={storeSeed.city} />
      <HomePage model={model} useConnectedHeader />
    </>
  );
}
