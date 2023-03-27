import dynamic from 'next/dynamic';

import { useEffect } from 'react';

const AboutUs = dynamic(() => import('./aboutUs'));
const ExcellentDishes = dynamic(() => import('./excellentDishes'));
const AffordablePrices = dynamic(() => import('./affordablePrices'));
const CafeLooks = dynamic(() => import('./cafeLooks'));
const OrderTime = dynamic(() => import('./orderTime'));
const WeOptimism = dynamic(() => import('./weOptimism'));
const Responsibility = dynamic(() => import('./responsibility'));
const Feedback = dynamic(() => import('./feedback'));
const Cooperation = dynamic(() => import('./cooperation'));

import Grid from '@mui/material/Grid';

export default function AboutPage() {
  console.log('render AboutPage');

  useEffect(() => {
    document.title = 'Компания Жако | Франшиза по доставке роллов и пиццы';
  }, []);

  const handleChangeExpanded = () => [...document.querySelectorAll('[aria-expanded = true]')].forEach((element) => element.click());

  return (
    <Grid container spacing={3} className="PAGEabout" style={{ paddingBottom: 15 }}>
      <AboutUs />
      <ExcellentDishes handleChangeExpanded={handleChangeExpanded} />
      <AffordablePrices handleChangeExpanded={handleChangeExpanded} />
      <CafeLooks handleChangeExpanded={handleChangeExpanded} />
      <OrderTime handleChangeExpanded={handleChangeExpanded} />
      <WeOptimism handleChangeExpanded={handleChangeExpanded} />
      <Responsibility handleChangeExpanded={handleChangeExpanded} />
      <Feedback handleChangeExpanded={handleChangeExpanded} />
      <Cooperation handleChangeExpanded={handleChangeExpanded} />

      <Grid item xs={12}>
        <p>
          <strong>
            Мы искренне надеемся, что наше знакомство перерастет в крепкую
            дружбу. С Жако — всегда легко!
          </strong>
        </p>
      </Grid>
    </Grid>
  );
}
