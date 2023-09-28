import { useCartStore, useHeaderStore } from '@/components/store.js';

import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Backdrop from '@mui/material/Backdrop';

import { IconClose } from '@/ui/Icons';
import { roboto } from '@/ui/Font.js';

export default function ModalError() {
  const [matches] = useHeaderStore((state) => [state.matches]);

  const [openModalErorr, setActiveModalError, textError] = useCartStore((state) => [state.openModalErorr, state.setActiveModalError, state.textError]);

  return (
    <Dialog 
      onClose={() => setActiveModalError(false, '')}
      className={matches ? 'modalErrorMobile ' + roboto.variable : 'modalErrorPC ' + roboto.variable}
      open={openModalErorr}
      slots={Backdrop}
      slotProps={{ timeout: 500 }}
      fullWidth
    >
      <DialogContent>
        <div className="containerError">
          <IconButton className="closeError" onClick={() => setActiveModalError(false, '')}>
            <IconClose />
          </IconButton>
          <span>{textError}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
