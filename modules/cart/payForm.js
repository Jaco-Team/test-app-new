import { useCartStore, useHeaderStore } from '@/components/store.js';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Backdrop from '@mui/material/Backdrop';

import { IconClose } from '@/ui/Icons';
import { roboto } from '@/ui/Font.js';

export default function PayForm() {
  console.log('render PayForm');

  const [matches] = useHeaderStore((state) => [state.matches]);
  const [openPayForm, setPayForm] = useCartStore((state) => [state.openPayForm, state.setPayForm]);

  return (
    <>
      {matches ? (
        <Dialog
          onClose={() => setPayForm(false)}
          className={'cartPayFromMobile ' + roboto.variable}
          open={openPayForm}
          slots={Backdrop}
          slotProps={{ timeout: 500 }}
          fullWidth
        >
          <DialogContent>
            <div className="ContainerCart">
              <div className="Line"></div>
              <div id="payment-form" />
            </div>
          </DialogContent>
        </Dialog>
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
