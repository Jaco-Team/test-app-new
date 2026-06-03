'use client';

import { useState } from 'react';
import { Header } from '@ui/widgets';
import type { HeaderNavItem } from '@ui/widgets/Header/Header';

export type AboutHeaderShellProps = {
  navItems: HeaderNavItem[];
  cityLabel: string;
};

export function AboutHeaderShell({
  navItems,
  cityLabel,
}: AboutHeaderShellProps) {
  const [compactMenuOpen, setCompactMenuOpen] = useState(false);

  return (
    <Header
      navItems={navItems}
      city={cityLabel}
      compactMenuOpen={compactMenuOpen}
      cartCount={2}
      onCompactMenuClick={() => setCompactMenuOpen((open) => !open)}
    />
  );
}
