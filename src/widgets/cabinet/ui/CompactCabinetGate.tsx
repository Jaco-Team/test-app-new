'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export type CompactCabinetGateProps = {
  ready: boolean;
  compact: boolean;
  fallbackHref: string;
  children: ReactNode;
};

export function CompactCabinetGate({
  ready,
  compact,
  fallbackHref,
  children,
}: CompactCabinetGateProps) {
  const router = useRouter();

  useEffect(() => {
    if (ready && !compact) {
      router.replace(fallbackHref);
    }
  }, [compact, fallbackHref, ready, router]);

  if (!ready || !compact) {
    return null;
  }

  return <>{children}</>;
}
