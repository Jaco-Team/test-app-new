import Link from 'next/link';

import { useProfileStore } from '@/components/store.js';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';

import { ArrowLeftMobile, EditPencilMobile, HomeCartMobile } from '@/ui/Icons.js';

export default function AddressMobile({ city }) {
  //console.log('render AddressMobile');

  const [setActiveAddressModal, streets] = useProfileStore((state) => [state.setActiveAddressModal, state.streets]);

  return (
    <Box sx={{ display: { xs: 'flex', md: 'flex', lg: 'none' } }} className="AddressMobile">
      <div className="addressLogin">
        <Link href={'/' + city + '/account'}>
          <ArrowLeftMobile />
        </Link>
        <span>Мои адреса</span>
      </div>

      <List>
        {streets.map((item, key) => (
          <ListItem key={key}
            style={{ background: parseInt(item?.is_main) ? 'rgba(0, 0, 0, 0.05)' : null, borderTop: key === 0 ? '0.25641025641026vw solid rgba(0, 0, 0, 0.2)' : 'none'}}
          >
            <div className="containerSpan">
              <span>
                {item?.addr_name ? (
                  <span style={{ textTransform: 'uppercase' }}>
                    {item.addr_name + ', '}
                  </span>
                ) : null}
                {item?.street + ', ' + item?.home + ', кв. ' + item?.kv}
              </span>

              {parseInt(item?.is_main) ? (
                <span className="circle">
                  <HomeCartMobile />
                </span>
              ) : null}

              <EditPencilMobile onClick={() => setActiveAddressModal(true, item.id, city)} />
            </div>
          </ListItem>
        ))}
      </List>

      <Button className="buttonAddress" variant="contained" onClick={() => setActiveAddressModal(true, 0, city)}>
        <span style={{ textTransform: 'capitalize' }}>Добавить</span>
        <span>&nbsp;адрес</span>
      </Button>
    </Box>
  );
}
