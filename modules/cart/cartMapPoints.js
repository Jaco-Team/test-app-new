import SwipeableDrawer from '@mui/material/SwipeableDrawer';

import { useCartStore, useCitiesStore } from '@/components/store.js';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { roboto } from '@/ui/Font.js';
import { LocationCartMobile } from '@/ui/Icons.js';

export default function CartMapPoints() {
  //console.log('render CartMapPoints');

  const [openMapPoints, setActiveCartMap, orderPic] = useCartStore((state) => [state.openMapPoints, state.setActiveCartMap, state.orderPic]);
  const [thisCityRu] = useCitiesStore((state) => [state.thisCityRu]);

  return (
    <SwipeableDrawer
      anchor={'bottom'}
      open={openMapPoints}
      onClose={() => setActiveCartMap(false)}
      onOpen={() => setActiveCartMap(true)}
      id="CartMapPoints"
      className={roboto.variable}
      disableSwipeToOpen
    >
      <div className="ContainerCartMap">
        <div className="Line"></div>
        <div className="loginHeader">
          <Typography component="span">Кафе в городе {thisCityRu}</Typography>
        </div>

        <Grid item xs={12} id="ForMapCart">
          <div style={{ width: '100%', height: '100%', backgroundColor: '#e5e5e5' }}/>
        </Grid>

        <div className="CartPoint">
          <Typography component="span"><LocationCartMobile /></Typography>
          <Typography component="span">{orderPic?.name}</Typography>
        </div>

        <Button className="CartButton" variant="contained"
          onClick={() => setActiveCartMap(false)}
        >
          <span>Заберу здесь</span>
        </Button>
      </div>
    </SwipeableDrawer>
  );
}
