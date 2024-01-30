import { useRef, useEffect } from 'react';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';

import { useCartStore, useCitiesStore } from '@/components/store.js';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { roboto } from '@/ui/Font.js';

import Dialog from '@mui/material/Dialog';

export default function PayForm() {
  //console.log('render CartMapPoints');

  const ref = useRef();

  const [openPayForm, setActiveCartMap, orderPic, center_map, zones, changePointClick] = useCartStore((state) => [state.openPayForm, state.setActiveCartMap, state.orderPic, state.center_map, state.zones, state.changePointClick]);
  const [thisCityRu] = useCitiesStore((state) => [state.thisCityRu]);

  useEffect(() => {
    if(ref.current && center_map?.center){
      ref.current.setCenter([zones[0].xy_center_map['latitude'], zones[0].xy_center_map['longitude']]);
    }
  }, [zones]);

  return (
    <Dialog
      anchor={'bottom'}
      open={openPayForm}
      onClose={() => {}}
      onOpen={() => {}}
      id="CartMapPoints"
      className={roboto.variable}
      disableSwipeToOpen
    >
      <div className="ContainerCartMap">
        <div className="Line"></div>
        

        <div style={{ minHeight: '80.34188034188vw', width: '100%', marginBottom: '6.8376068376068vw' }} id="payment-form">
          
        </div>
      
      </div>
    </Dialog>
  );
}
