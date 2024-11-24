import { useCartStore, useHeaderStoreNew } from '@/components/store.js';

import Script from 'next/script';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Backdrop from '@mui/material/Backdrop';

import { IconClose } from '@/ui/Icons';
import { roboto } from '@/ui/Font.js';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';

export default function PayForm() {
  const [matches] = useHeaderStoreNew((state) => [state?.matches]);
  const [openPayForm, setPayForm] = useCartStore((state) => [state.openPayForm, state.setPayForm]);

  return (
    <>
      {matches ? (
        <SwipeableDrawer
          anchor={'bottom'}
          open={openPayForm}
          onClose={() => setPayForm(false)}
          onOpen={() => setPayForm(true)}
          className={'cartPayFromMobile ' + roboto.variable}
          disableSwipeToOpen
        >
          <DialogContent>
            <div className="ContainerCart">
              <div className="Line"></div>
              <div id="payment-form" />
            </div>
          </DialogContent>
        </SwipeableDrawer>
      ) : (
        <Dialog
          onClose={() => setPayForm(false)}
          className={'cartPayFromPC ' + roboto.variable}
          open={openPayForm}
          slots={Backdrop}
          slotProps={{ timeout: 500 }}
          fullWidth
        >
          <DialogContent>
            <IconButton className="iconBTN" onClick={() => setPayForm(false)}>
              <IconClose />
            </IconButton>
            <div className="ContainerCart">
              <div id="payment-form" />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
