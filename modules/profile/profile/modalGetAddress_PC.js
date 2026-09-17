import { useProfileStore } from '@/components/store.js';

import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Backdrop from '@mui/material/Backdrop';
import useMediaQuery from '@mui/material/useMediaQuery';

import { roboto } from '@/ui/Font.js';
import { IconClose } from '@/ui/Icons.js';
import { BREAKPOINTS } from '@/utils/breakpoints';

import MyAutocomplete from '@/ui/MyAutocomplete';
import useAddressInput from '@/ui/useAddressInput';

export default function GetAddress() {
  const isMobileAutocomplete = useMediaQuery(
    `screen and (max-width: ${BREAKPOINTS.mobileMax}px)`
  );

  const [openModalGetAddress, setActiveGetAddressModal, street_list] =
    useProfileStore((state) => [
      state.openModalGetAddress,
      state.setActiveGetAddressModal,
      state.street_list,
    ]);

  const [activeCity] = useProfileStore((state) => [state.active_city]);
  const { addressInput, changeInput, select, commit, cancel } = useAddressInput(
    openModalGetAddress,
    activeCity
  );

  return (
    <Dialog
      onClose={() => {
        cancel();
        setActiveGetAddressModal(false);
      }}
      className={'modalGetAddrPC ' + roboto.variable}
      open={openModalGetAddress}
      slots={Backdrop}
      slotProps={{ timeout: 500 }}
    >
      <DialogContent>
        <div className="container">
          <IconButton
            className="closeButton"
            onClick={() => {
              cancel();
              setActiveGetAddressModal(false);
            }}
          >
            <IconClose />
          </IconButton>

          <span>Адрес доставки</span>

          <div className="street">
            <MyAutocomplete
              placeholder={'Улица и номер дома'}
              data={street_list}
              onInputValueChange={changeInput}
              onCommit={commit}
              variant={'standard'}
              onChange={select}
              matches={isMobileAutocomplete}
              inputValue={addressInput || ''}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
