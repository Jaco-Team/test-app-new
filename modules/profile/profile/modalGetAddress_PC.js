import { useEffect } from 'react';

import { useProfileStore, useHeaderStore } from '@/components/store.js';

import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Backdrop from '@mui/material/Backdrop';

import { roboto } from '@/ui/Font.js';
import { IconClose } from '@/ui/Icons.js';

import MyAutocomplete_test from '@/ui/MyAutocomplete_test';

const debounce = (func, delay) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

export default function GetAddress() {

  const [matches] = useHeaderStore((state) => [state.matches]);

  const [openModalGetAddress, setActiveGetAddressModal, getAddrList, street_list, chooseStreet, choose_street] = useProfileStore(state => [state.openModalGetAddress, state.setActiveGetAddressModal, state.getAddrList, state.street_list, state.chooseStreet, state.choose_street]);

  const fetchSearchResults = async (term) => {
    try {
      getAddrList(term);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      //setLoading(false);
    }
  };

  const debouncedSearch = debounce(fetchSearchResults, 700);

  useEffect(() => {
    if(!openModalGetAddress){
      getAddrList('');
    }
  }, [openModalGetAddress]);

  return (
    <Dialog
    onClose={() => setActiveGetAddressModal(false)}
    className={'modalGetAddrPC ' + roboto.variable}
    open={openModalGetAddress}
    slots={Backdrop}
    slotProps={{ timeout: 500 }}
  >
    <DialogContent>
      <div className="container">

        <IconButton className="closeButton" onClick={() => setActiveGetAddressModal(false)}>
          <IconClose />
        </IconButton>

        <span>Адрес доставки</span>
           
        <div className='street'>
          <MyAutocomplete_test 
            placeholder={'Улица и номер дома'} 
            data={street_list} 
            func={event => debouncedSearch(event)} 
            variant={'standard'} 
            setStreet={chooseStreet}
            matches={matches}
            value={choose_street}
          />
        </div>

      </div>
    </DialogContent>
  </Dialog>
  );
}
