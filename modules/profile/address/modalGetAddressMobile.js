import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import MyAutocomplete from '@/ui/MyAutocomplete';
import useAddressInput from '@/ui/useAddressInput';

import { roboto } from '@/ui/Font.js';
import { useProfileStore, useHeaderStoreNew } from '@/components/store.js';

export default function GetAddressMobile() {
  const [matches] = useHeaderStoreNew((state) => [state?.matches]);

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
    <SwipeableDrawer
      anchor={'bottom'}
      open={openModalGetAddress}
      onClose={() => {
        cancel();
        setActiveGetAddressModal(false);
      }}
      onOpen={() => setActiveGetAddressModal(true)}
      id="addressGetModalmodile"
      className={roboto.variable}
      disableSwipeToOpen
    >
      <div className="ContainerGetAddressModal">
        <div className="Line" />
        <span className="login">Адрес доставки</span>

        <div className="address">
          <MyAutocomplete
            placeholder={'Улица и номер дома'}
            data={street_list}
            inputValue={addressInput || ''}
            onChange={select}
            onInputValueChange={changeInput}
            onCommit={commit}
            matches={matches}
            name="customAddrChoose"
            className="address"
          />
        </div>
      </div>
    </SwipeableDrawer>
  );
}
