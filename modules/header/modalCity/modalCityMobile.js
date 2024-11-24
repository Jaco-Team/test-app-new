import { useRouter } from 'next/router';
import Image from 'next/image';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { roboto } from '@/ui/Font.js';
import { useHeaderStoreNew, useCitiesStore, useCartStore, useContactStore, useHomeStore } from '@/components/store.js';

export default function ModalCityMobile() {
  const { push } = useRouter();

  const [thisCityList, thisCityRu, setThisCityRu, setThisCity, thisCity] = useCitiesStore((state) => [state.thisCityList, state.thisCityRu, state.setThisCityRu, state.setThisCity, state.thisCity]);

  const [openCityModal, openCityModalList, setActiveModalCity, setActiveModalCityList, activePage, token] = useHeaderStoreNew((state) => [state?.openCityModal, state?.openCityModalList, state?.setActiveModalCity, state?.setActiveModalCityList, state?.activePage, state?.token]);

  const [getMySavedAddr, setPoint, setAddrDiv, getNewPriceItems, getInfoPromo] = useCartStore((state) => [state.getMySavedAddr, state.setPoint, state.setAddrDiv, state.getNewPriceItems, state.getInfoPromo]);

  const [setActiveFilter] = useHomeStore( state => [state.setActiveFilter] )

  const [getMap] = useContactStore(state => [state.getMap]);

  const rightCity = () => {
    setActiveModalCity(false);
    const city = thisCityList.find((city) => city.name === thisCityRu);
    localStorage.setItem('setCity', JSON.stringify(city));
  };

  const chooseCity = (city) => {
    localStorage.setItem('setCity', JSON.stringify(city));
    setActiveModalCityList(false);
    setThisCityRu(city.name);
    setThisCity(city.link);

    getMap('contacts', city.link);
    setPoint(null);
    setAddrDiv(null);
    getMySavedAddr(thisCity);

    setActiveFilter(false);

    getNewPriceItems(city.link);

    if(activePage && activePage !== 'home') {
      push(`/${city.link}/${activePage}`);
    } else {
      push(`/${city.link}`);
    }

    if(sessionStorage.getItem('promo_name') && sessionStorage.getItem('promo_name').length > 0){
      getInfoPromo(sessionStorage.getItem('promo_name'), city.link)
    }
  };

  return (
    <>
      <SwipeableDrawer
        anchor={'bottom'}
        open={openCityModal}
        onClose={() => setActiveModalCity(false)}
        onOpen={() => setActiveModalCity(true)}
        id="modalCityMobileMain"
        className={roboto.variable}
        disableSwipeToOpen
      >
        <div className="ContainerMain">
          <div className="loginIMG">
            <Image alt="Город" src="/Favikon.png" width={240} height={240} priority={true}/>
          </div>

          <div className="loginHeader">
            <Typography component="span">Вы в городе</Typography>
          </div>

          <div
            className="loginCity"
            style={{ marginBottom: thisCityRu.length > 12 ? '2.991452991453vw' : '13.247863247863vw', height: thisCityRu.length > 12 ? '20.512820512821vw' : '10.25641025641vw'}}
          >
            <Typography component="span">{thisCityRu}</Typography>
          </div>

          <Button className="buttons" onClick={rightCity}>
            <Typography variant="h5" component="span">Да, верно</Typography>
          </Button>

          <Button className="buttons choose" onClick={() => { setActiveModalCityList(true); setActiveModalCity(false)}}>
            <Typography variant="h5" component="span">
              Нет, выберу город
            </Typography>
          </Button>
        </div>
      </SwipeableDrawer>

      <SwipeableDrawer
        anchor={'bottom'}
        open={openCityModalList}
        onClose={() => setActiveModalCityList(false)}
        onOpen={() => setActiveModalCity(true)}
        id="modalCityMobileList"
        className={roboto.variable}
        disableSwipeToOpen
        style={{ zIndex: 3000 }}
      >
        <div className="ContainerList">
          <div className="Line"></div>
          <div className="loginHeader">
            <Typography component="span">Выберите город</Typography>
          </div>
          <List>
            {thisCityList.map((city, key) => (
              <ListItem onClick={() => chooseCity(city)} key={key} style={{ background: thisCityRu === city.name ? 'rgba(0, 0, 0, 0.05)' : null }}>
                <span>{city.name}</span>
              </ListItem>
            ))}
          </List>
        </div>
      </SwipeableDrawer>
    </>
  );
}
