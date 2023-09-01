import { useState } from 'react';

import Link from 'next/link';

import { useProfileStore } from '@/components/store.js';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';

import { ArrowLeftMobile, EditPencilMobile, HomeCartMobile } from '@/ui/Icons.js';

const adrrList = [
  { name: 'Дом', id: 1, addr: 'ул. Новопесчанная, д. 82к2, кв. 328', main: true },
  { name: 'Работа', id: 2, addr: 'Дзержинского 321, оф. 2388' },
  { name: 'Родители', id: 3, addr: 'Приморский б-р, д. 358, кв. 999' },
  { addr: 'ул. Гая д. 357к3, кв. 133', id: 4 },
  { addr: 'ул. Жилина, д. 8, кв. 13', id: 5 },
  { addr: 'ул. Автостроителей, д. 357к3, кв. 133', id: 6 },
  { addr: 'Московский пр-т, д. 25, к. 5, кв. 71', id: 7 },
];

export default function AddressMobile({ city }) {
  //console.log('render AddressMobile');

  const [setActiveAddressModal] = useProfileStore((state) => [state.setActiveAddressModal]);

  const [list, setList] = useState(adrrList);

  return (
    <Box sx={{ display: { xs: 'flex', md: 'flex', lg: 'none' } }} className="AddressMobile">
      <div className="addressLogin">
        <Link href={'/' + city + '/account'}>
          <ArrowLeftMobile />
        </Link>
        <span>Мои адреса</span>
      </div>

      <List>
        {list.map((item, key) => (
          <ListItem key={key}
            style={{ background: item?.main ? 'rgba(0, 0, 0, 0.05)' : null,
              borderTop: key === 0 ? '0.25641025641026vw solid rgba(0, 0, 0, 0.2)' : 'none',
              height: item?.name ? '13.931623931624vw' : item.addr.length > 30 ? '18.803418803419vw' : '13.931623931624vw',
            }}
          >
            <div className="containerSpan">
              <span style={{width: item?.name ? '100%' : item.addr.length > 30 ? '42.735042735043vw' : '100%', textTransform: item?.name ? 'uppercase' : 'unset'}}>
                {item?.name ? item.name : item.addr}
              </span>

              {item?.name ? (
                <span className={item.name?.length + item?.addr?.length > 32 ? 'shadowSpan' : null}
                  style={{width: item.name?.length + item?.addr?.length > 32 ? '41.452991452991vw' : '100%'}}
                >
                  {item.addr}
                </span>
              ) : null}
            </div>

            <div className="containerSVG">
              {item?.main ? (
                <div className="circleDiv">
                  <HomeCartMobile />
                </div>
              ) : null}

              {/* 'edit' для тестирования */}
              <EditPencilMobile onClick={() => setActiveAddressModal(true, 0, city, 'edit')} />
            </div>
          </ListItem>
        ))}
      </List>

      {/* 'new' для тестирования */}
      <Button className="buttonAddress" variant="contained" onClick={() => setActiveAddressModal(true, 0, city, 'new')}>
        <span style={{ textTransform: 'capitalize' }}>Добавить</span>
        <span>&nbsp;адрес</span>
      </Button>
    </Box>
  );
}
