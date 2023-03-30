import dynamic from 'next/dynamic';

import Meta from '@/components/meta.js';

const AboutUs = dynamic(() => import('./aboutUs'));
const ExcellentDishes = dynamic(() => import('./excellentDishes'));
const AffordablePrices = dynamic(() => import('./affordablePrices'));
const CafeLooks = dynamic(() => import('./cafeLooks'));
const OrderTime = dynamic(() => import('./orderTime'));
const WeOptimism = dynamic(() => import('./weOptimism'));
const Responsibility = dynamic(() => import('./responsibility'));
const Feedback = dynamic(() => import('./feedback'));
const Cooperation = dynamic(() => import('./cooperation'));

const AboutBreadcrumbs = dynamic(() => import('./aboutBreadcrumbs'));

import Grid from '@mui/material/Grid';

export default function AboutPage( props ) {
  
  const { page, city } = props;

  const handleChangeExpanded = () => [...document.querySelectorAll('[aria-expanded = true]')].forEach((element) => element.click());

  return (
    <Meta title={page?.title ?? ''} description={page?.description ?? ''}>
      <Grid container spacing={3} style={{ width: '100%', margin: 0 }}>
        <Grid item className="PAGEabout" style={{ paddingBottom: 15 }}>

          <AboutUs />

          <Grid item xs={12} style={{ paddingTop: 0, paddingBottom: 1 }}>
            <ExcellentDishes handleChangeExpanded={handleChangeExpanded} />
            <AffordablePrices handleChangeExpanded={handleChangeExpanded} />
            <CafeLooks handleChangeExpanded={handleChangeExpanded} />
            <OrderTime handleChangeExpanded={handleChangeExpanded} />
            <WeOptimism handleChangeExpanded={handleChangeExpanded} />
            <Responsibility handleChangeExpanded={handleChangeExpanded} />
            <Feedback handleChangeExpanded={handleChangeExpanded} />
            <Cooperation handleChangeExpanded={handleChangeExpanded} />
          </Grid>

          <Grid item xs={12}>
            <p>
              <strong>
                Мы искренне надеемся, что наше знакомство перерастет в крепкую
                дружбу. С Жако — всегда легко!
              </strong>
            </p>
          </Grid>
        </Grid>
        <AboutBreadcrumbs />
      </Grid>
    </Meta>
  );
}
