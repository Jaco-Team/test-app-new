'use client';

import type { ReactNode } from 'react';
import { PreviewClientRuntime } from '@src/app/preview-runtime/PreviewClientRuntime';
import { DesignSystemProvider } from '@ui/foundation/DesignSystemProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <DesignSystemProvider>
      <PreviewClientRuntime>{children}</PreviewClientRuntime>
    </DesignSystemProvider>
  );
}
