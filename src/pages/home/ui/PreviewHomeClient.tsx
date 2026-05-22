'use client';

import type { HomePageViewModel } from '../model/types';
import {
  PreviewBootstrap,
  type PreviewBootstrapProps,
} from '@src/features/preview-bootstrap/PreviewBootstrap';
import { HomePage } from './HomePage';

export type PreviewHomeClientProps = {
  model: HomePageViewModel;
  storeSeed: PreviewBootstrapProps;
};

export function PreviewHomeClient({
  model,
  storeSeed,
}: PreviewHomeClientProps) {
  return (
    <>
      <PreviewBootstrap {...storeSeed} />
      <HomePage model={model} useConnectedHeader />
    </>
  );
}
