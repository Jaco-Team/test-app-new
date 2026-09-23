import { useRouter } from 'next/router';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { roboto } from '@/ui/Font.js';
import { useHeaderStoreNew, useCitiesStore } from '@/components/store.js';

import Cookies from 'js-cookie';
import { setLocalStorageItem } from '@/utils/browserStorage';
import { switchCity } from '@/utils/switchCity';

export default function ModalCityMobile() {
  const router = useRouter();

  const [thisCityList, thisCityRu] = useCitiesStore((state) => [
    state.thisCityList,
    state.thisCityRu,
  ]);

  const [
    openCityModal,
    openCityModalList,
    setActiveModalCity,
    setActiveModalCityList,
  ] = useHeaderStoreNew((state) => [
    state?.openCityModal,
    state?.openCityModalList,
    state?.setActiveModalCity,
    state?.setActiveModalCityList,
  ]);

  const rightCity = () => {
    setActiveModalCity(false);
    const city = thisCityList.find((city) => city.name === thisCityRu);
    setLocalStorageItem('setCity', JSON.stringify(city));
    Cookies.set('city', city?.link || '', {
      expires: 365,
      path: '/',
      sameSite: 'Lax',
    });
  };

  const chooseCity = async (city) => {
    if (await switchCity(city, router)) {
      setActiveModalCityList(false);
      setActiveModalCity(false);
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
            <img
              alt="Город"
              src="/Favikon.png"
              width={240}
              height={240}
              loading="eager"
              decoding="async"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = '/jaco-logo-mobile.png';
              }}
            />
          </div>

          <div className="loginHeader">
            <Typography component="span">Вы в городе</Typography>
          </div>

          <div
            className="loginCity"
            style={{
              marginBottom:
                thisCityRu.length > 12
                  ? '2.991452991453vw'
                  : '13.247863247863vw',
              height:
                thisCityRu.length > 12
                  ? '20.512820512821vw'
                  : '10.25641025641vw',
            }}
          >
            <Typography component="span">{thisCityRu}</Typography>
          </div>

          <Button className="buttons" onClick={rightCity}>
            <Typography variant="h5" component="span">
              Да, верно
            </Typography>
          </Button>

          <Button
            className="buttons choose"
            onClick={() => {
              setActiveModalCityList(true);
              setActiveModalCity(false);
            }}
          >
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
              <ListItem
                onClick={() => chooseCity(city)}
                key={key}
                style={{
                  background:
                    thisCityRu === city.name ? 'rgba(0, 0, 0, 0.05)' : null,
                }}
              >
                <span>{city.name}</span>
              </ListItem>
            ))}
          </List>
        </div>
      </SwipeableDrawer>
    </>
  );
}
