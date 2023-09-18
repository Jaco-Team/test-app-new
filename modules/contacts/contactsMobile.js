import { useEffect } from 'react';

import { useContactStore, useCitiesStore } from '@/components/store.js';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { MapContactsMobile, LocationIconMobile, VectorRightMobile, LocationMapMobile } from '@/ui/Icons.js';

import { SwitchContactsMobile as MySwitch } from '@/ui/MySwitch.js';

export default function ContactsPageMobile({ city }) {
  //console.log('render ContactsPageMobile');

  const [thisCityRu] = useCitiesStore((state) => [state.thisCityRu]);

  const [getData, point, phone, disablePointsZoneMobile, disable, setActiveModalChoose] = useContactStore((state) => [
    state.getData, state.point, state.phone, state.disablePointsZoneMobile, state.disable, state.setActiveModalChoose]);

  useEffect(() => {
    getData('contacts', city);
  }, []);

  return (
    <Box sx={{ display: { xs: 'block', md: 'block', lg: 'none' } }} className="ContactsMobile" >
      <Grid item xs={12} id="ForMapContacts">
        <div style={{ width: '100%', height: '100%', backgroundColor: '#e5e5e5' }}/>
      </Grid>

      <div className="ContactsLocation">
        <LocationMapMobile />
      </div>

      <div className="ContactsMobileContainer">
        <div className="ContactPoint" onClick={() => setActiveModalChoose(true, 'city')}>
          <div className="spanContainer">
            <Typography component="span">
              <MapContactsMobile />
            </Typography>
            <Typography component="span">{thisCityRu}</Typography>
          </div>

          <div className="svgContainer">
            <VectorRightMobile />
          </div>
        </div>

        <div className="ContactPoint" style={{ marginBottom: '5.982905982906vw' }} onClick={() => setActiveModalChoose(true, 'point')}>
          <div className="spanContainer">
            <Typography component="span">
              <LocationIconMobile />
            </Typography>
            <Typography component="span">{point}</Typography>
          </div>
          <div className="svgContainer">
            <VectorRightMobile />
          </div>
        </div>

        <div className="ContactsInfo">
          <Typography component="span">Работаем ежедневно с 10:00 до 21:30</Typography>
        </div>

        <div className="ContactsInfo" style={{ marginBottom: '2.5641025641026vw' }}>
          <Typography component="span">Позвонить и заказать:</Typography>
        </div>

        <div className="ContactsPhone">
          <Typography component="span">{phone}</Typography>
        </div>

        <div className="ContactsLine"></div>

        <div className="ContactsSwitch">
          <Typography component="span">Показать зону доставки</Typography>
          <MySwitch checked={disable} onClick={disablePointsZoneMobile} />
        </div>
      </div>
    </Box>
  );
}