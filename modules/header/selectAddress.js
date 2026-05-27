import { useHeaderStoreNew, useProfileStore } from '@/components/store.js';
import useMediaQuery from '@mui/material/useMediaQuery';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Backdrop from '@mui/material/Backdrop';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

import { IconClose } from '@/ui/Icons';
import { roboto } from '@/ui/Font.js';
import { BREAKPOINTS } from '@/utils/breakpoints';

export default function SelectAddress() {
  const isMobileSelectAddress = useMediaQuery(
    `screen and (max-width: ${BREAKPOINTS.mobileMax}px)`
  );
  const [
    openModalSelectAddress,
    setActiveModalSelectAddress,
    chooseAddrStreet,
  ] = useHeaderStoreNew((state) => [
    state?.openModalSelectAddress,
    state?.setActiveModalSelectAddress,
    state?.chooseAddrStreet,
  ]);
  const [setAddress] = useProfileStore((state) => [state.setAddress]);

  const handleAddress = (addr) => {
    setAddress(addr);
    setActiveModalSelectAddress(false);
  };

  return (
    <>
      {isMobileSelectAddress ? (
        <SwipeableDrawer
          anchor={'bottom'}
          open={openModalSelectAddress}
          onClose={() => setActiveModalSelectAddress(false)}
          onOpen={() => setActiveModalSelectAddress(true)}
          id="modalSelectMobile"
          className={roboto.variable}
          disableSwipeToOpen
        >
          <div className="ContainerList">
            <div className="Line"></div>
            <div className="loginHeader">
              <Typography component="span">Выбор адреса</Typography>
            </div>
            <List>
              {chooseAddrStreet?.map((addr, key) => (
                <ListItem onClick={() => handleAddress(addr)} key={key}>
                  <span>{addr.addressLine}</span>
                </ListItem>
              ))}
            </List>
          </div>
        </SwipeableDrawer>
      ) : (
        <Dialog
          onClose={() => setActiveModalSelectAddress(false)}
          className={'modalSelectPC ' + roboto.variable}
          open={openModalSelectAddress}
          slots={Backdrop}
          slotProps={{ timeout: 500 }}
          fullWidth
        >
          <DialogContent>
            <IconButton
              className="iconBTN"
              onClick={() => setActiveModalSelectAddress(false)}
            >
              <IconClose />
            </IconButton>
            <div className="container">
              <span>Выбор адреса</span>
              <List>
                {chooseAddrStreet?.map((addr, key) => (
                  <ListItem onClick={() => handleAddress(addr)} key={key}>
                    {addr.addressLine}
                  </ListItem>
                ))}
              </List>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
