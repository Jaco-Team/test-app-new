import { useCartStore } from '@/components/store.js';
import useMediaQuery from '@mui/material/useMediaQuery';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Backdrop from '@mui/material/Backdrop';

import { IconClose } from '@/ui/Icons';
import { roboto } from '@/ui/Font.js';
import { BREAKPOINTS } from '@/utils/breakpoints';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';

export default function PayForm() {
  const isMobilePayForm = useMediaQuery(`screen and (max-width: ${BREAKPOINTS.mobileMax}px)`);
  const [openPayForm, setPayForm, openConfirmForm] = useCartStore((state) => [state.openPayForm, state.setPayForm, state.openConfirmForm]);

  if (!openPayForm || openConfirmForm) {
    return null;
  }

  return (
    <>
      {isMobilePayForm ? (
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
