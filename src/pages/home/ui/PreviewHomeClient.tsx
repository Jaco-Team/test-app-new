'use client';

import type { HomePageViewModel } from '../model/types';
import type { PreviewHomeStoreSyncProps } from '@src/features/header/ui/PreviewHomeStoreSync';
import { HomePage } from './HomePage';

export type PreviewHomeClientProps = {
  model: HomePageViewModel;
  storeSeed: PreviewHomeStoreSyncProps;
};

export function PreviewHomeClient({
  model,
  storeSeed,
}: PreviewHomeClientProps) {
  void storeSeed;

  return <HomePage model={model} />;
}
