import { useState, useEffect } from 'react';
import { shallow } from 'zustand/shallow';

import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { roboto } from '@/ui/Font.js';
import { useHeaderStore, useCitiesStore } from '@/components/store.js';

export default function ModalCityMobile() {
  const { push } = useRouter();

  const [activeList, setActiveList] = useState(false);

  const [thisCityList, thisCityRu, setThisCityRu] = useCitiesStore((state) => [state.thisCityList, state.thisCityRu, state.setThisCityRu], shallow);

  const [openCityModal, setActiveModalCity] = useHeaderStore((state) => [state.openCityModal, state.setActiveModalCity], shallow);

  useEffect(() => {
    if (localStorage.getItem('setCity') && localStorage.getItem('setCity').length > 0) {
      const city = JSON.parse(localStorage.getItem('setCity'));

      if (city.name !== thisCityRu) {
        setThisCityRu(city.name);

        push(`/${city.link}`);
      }
    } else {
      setActiveModalCity(true);
    }
  }, []);

  const rightCity = () => {
    setActiveModalCity(false);
    const city = thisCityList.find((city) => city.name === thisCityRu);
    localStorage.setItem('setCity', JSON.stringify(city));
    push(`/${city.link}`);
  };

  const chooseCity = (city) => {
    localStorage.setItem('setCity', JSON.stringify(city));
    setActiveList(false);
    setThisCityRu(city.name);
    push(`/${city.link}`);
  };

  // thisCityRu = 'Комсомольск-на-Амуре'

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

          <Button className="buttons choose" onClick={() => { setActiveList(true); setActiveModalCity(false)}}>
            <Typography variant="h5" component="span">
              Нет, выберу город
            </Typography>
          </Button>
        </div>
      </SwipeableDrawer>

      <SwipeableDrawer
        anchor={'bottom'}
        open={activeList}
        onClose={() => setActiveList(false)}
        onOpen={() => setActiveModalCity(true)}
        id="modalCityMobileList"
        className={roboto.variable}
        disableSwipeToOpen
      >
        <div className="ContainerList">
          <div className="Line"></div>
          <div className="loginHeader">
            <Typography component="span">Выберите город</Typography>
          </div>
          <List>
            {thisCityList.map((city, key) => (
              <ListItem onClick={() => chooseCity(city)} key={key} style={{ background: thisCityRu === city.name ? 'rgba(0, 0, 0, 0.05)' : null }}>
                <Link href={`/${city.link}`}>
                  <div>
                    <span>{city.name}</span>
                  </div>
                </Link>
              </ListItem>
            ))}
          </List>
        </div>
      </SwipeableDrawer>
    </>
  );
}
