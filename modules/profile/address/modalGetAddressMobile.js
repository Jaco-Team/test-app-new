import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import MyAutocomplete_test from '@/ui/MyAutocomplete_test';

import { roboto } from '@/ui/Font.js';
import { useProfileStore, useHeaderStore } from '@/components/store.js';

const debounce = (func, delay) => {
    let timeoutId;
  
    return (...args) => {
      clearTimeout(timeoutId);
  
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

export default function GetAddressMobile() {

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

  return (
      <SwipeableDrawer
        anchor={'bottom'}
        open={openModalGetAddress}
        onClose={() => setActiveGetAddressModal(false)}
        onOpen={() => setActiveGetAddressModal(true)}
        id="addressGetModalmodile"
        className={roboto.variable}
        disableSwipeToOpen
      >
        <div className="ContainerGetAddressModal">
          <div className="Line"/>
          <span className='login'>Адрес доставки</span>

          <div className='address'>
            <MyAutocomplete_test 
              placeholder={'Улица и номер дома'} 
              data={street_list} 
              func={event => debouncedSearch(event)} 
              setStreet={chooseStreet}
              matches={matches}
              value={choose_street}
            />
          </div>

        </div>
      </SwipeableDrawer>
  );
}
