'use client';

import {
  StoreBootstrap,
  type StoreBootstrapProps,
} from '@src/features/bootstrap/StoreBootstrap';
import { AppShell } from '@src/widgets/shell/AppShell';
import type { AboutPageViewModel } from '../model/types';
import { AboutPage } from '@src/pages/about/ui/AboutPage';

export type AboutClientProps = {
  model: AboutPageViewModel;
  storeSeed: StoreBootstrapProps;
};

export function AboutClient({ model, storeSeed }: AboutClientProps) {
  return (
    <>
      <StoreBootstrap {...storeSeed} />
      <AppShell city={storeSeed.city} />
      <AboutPage model={model} useConnectedHeader />
    </>
  );
}
