'use client';

import type { ReactNode } from 'react';
import { DesignSystemProvider } from '@ui/foundation/DesignSystemProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return <DesignSystemProvider>{children}</DesignSystemProvider>;
}
