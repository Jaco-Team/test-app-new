'use client';

import { useState } from 'react';
import { Header } from '@ui/widgets';
import type { HeaderNavItem } from '@ui/widgets/Header/Header';

export type HomeHeaderShellProps = {
  navItems: HeaderNavItem[];
  cityLabel: string;
};

export function HomeHeaderShell({ navItems, cityLabel }: HomeHeaderShellProps) {
  const [compactMenuOpen, setCompactMenuOpen] = useState(false);

  return (
    <Header
      navItems={navItems}
      city={cityLabel}
      compactMenuOpen={compactMenuOpen}
      onMenuClick={() => setCompactMenuOpen((open) => !open)}
    />
  );
}
