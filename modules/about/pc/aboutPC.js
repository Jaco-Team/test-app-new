import dynamic from 'next/dynamic';

const AboutUs = dynamic(() => import('./aboutUs'), { ssr: false });
const ExcellentDishes = dynamic(() => import('./excellentDishes'), { ssr: false });
const AffordablePrices = dynamic(() => import('./affordablePrices'), { ssr: false });
const CafeLooks = dynamic(() => import('./cafeLooks'), { ssr: false });
const OrderTime = dynamic(() => import('./orderTime'), { ssr: false });
const WeOptimism = dynamic(() => import('./weOptimism'), { ssr: false });
const Responsibility = dynamic(() => import('./responsibility'), { ssr: false });
const Feedback = dynamic(() => import('./feedback'), { ssr: false });
const Cooperation = dynamic(() => import('./cooperation'), { ssr: false });

const AboutBreadcrumbs = dynamic(() => import('./aboutBreadcrumbs'));

import Grid from '@mui/material/Grid';

export default function AboutPagePC() {
  return (
    <Grid container spacing={3} style={{ width: '100%', margin: 0 }}>
      <Grid item className="PAGEabout" style={{ paddingBottom: 15 }}>
        <AboutUs />
        <ExcellentDishes />
        <AffordablePrices />
        <CafeLooks />
        <OrderTime />
        <WeOptimism />
        <Responsibility />
        <Feedback />
        <Cooperation />

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
  );
}
