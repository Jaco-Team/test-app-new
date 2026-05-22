'use client';

import type { ReactNode } from 'react';
import { ClientRuntime } from '@src/app/runtime/ClientRuntime';
import { DesignSystemProvider } from '@ui/foundation/DesignSystemProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <DesignSystemProvider>
      <ClientRuntime>{children}</ClientRuntime>
    </DesignSystemProvider>
  );
}
