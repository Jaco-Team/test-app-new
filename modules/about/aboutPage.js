import Meta from '@/components/meta.js';

import AboutPagePC from './pc/aboutPC';
import AboutPageMobile from './aboutMobile';

import { useHeaderStore } from '@/components/store';

export default function AboutPage({ page, cityName }) {

  const [matches] = useHeaderStore((state) => [state.matches]);

  return (
    <Meta title={page.title} description={page.description}>
      {matches ? <AboutPageMobile cityName={cityName} /> : <AboutPagePC />}
    </Meta>
  );
}
