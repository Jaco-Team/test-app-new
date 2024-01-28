import FormOrder from '@/modules/cartForm/formOrder';
import PayForm from '@/modules/cart/payForm';
import DataTimePicker from '@/modules/cartForm/dataTimePicker';

import { useCartStore } from '@/components/store.js';

import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';

import { roboto } from '@/ui/Font.js';
import { IconClose } from '@/ui/Icons.js';

export default function BasketModalPC() {
  const [setActiveModalBasket, openModalBasket] = useCartStore((state) => [state.setActiveModalBasket, state.openModalBasket]);

  return (
    <>
      <Dialog
        onClose={() => setActiveModalBasket(false)}
        className={'modalBasketMainPC ' + roboto.variable}
        open={openModalBasket}
        slots={Backdrop}
        slotProps={{ timeout: 500 }}
        scroll="body"
      >
        <DialogContent>
          <Box component="div" className="modalBasketPC">

            <IconButton className="closeButtonBasketPC" onClick={() => setActiveModalBasket(false)}>
              <IconClose />
            </IconButton>

            <FormOrder />


          </Box>
        </DialogContent>
      </Dialog>

      <DataTimePicker />
      <PayForm />
    </>
  );
}
