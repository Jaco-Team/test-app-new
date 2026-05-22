'use client';

import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Header } from '@ui/widgets/Header/Header';
import { cityBase } from '@src/shared/lib/sitePaths';

export type HeaderShellProps = {
  citySlug: string;
  cityLabel: string;
};

export function HeaderShell({ citySlug, cityLabel }: HeaderShellProps) {
  const [compactMenuOpen, setCompactMenuOpen] = useState(false);
  const [cityAnchor, setCityAnchor] = useState<null | HTMLElement>(null);

  return (
    <>
      <Header
        city={cityLabel}
        cartLabel="Корзина"
        logoSrc="/Jaco-Logo-120.png"
        logoHref={cityBase(citySlug)}
        compactMenuOpen={compactMenuOpen}
        onMenuClick={() => setCompactMenuOpen((value) => !value)}
        onCityClick={(event) => setCityAnchor(event.currentTarget)}
      />

      <Menu
        anchorEl={cityAnchor}
        open={Boolean(cityAnchor)}
        onClose={() => setCityAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MenuItem onClick={() => setCityAnchor(null)}>{cityLabel}</MenuItem>
      </Menu>
    </>
  );
}
