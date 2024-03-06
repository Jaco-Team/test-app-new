import React from 'react';
import { useHeaderStore } from '@/components/store';

import AkciiPC from './PC/akciiPC';
import AkciiMobile from './mobile/akciiMobile';
import Meta from '@/components/meta.js';

export default function AkciiPage({ page }) {
  const [matches] = useHeaderStore((state) => [state.matches]);
  return (
    <Meta title={page.title} description={page.description}>
      {matches ? <AkciiMobile /> : <AkciiPC />}
    </Meta>
  );
}
