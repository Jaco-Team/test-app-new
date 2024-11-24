import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import MyAutocomplete from '@/ui/MyAutocomplete';

import { roboto } from '@/ui/Font.js';
import { useProfileStore, useHeaderStoreNew } from '@/components/store.js';

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

    const [matches] = useHeaderStoreNew((state) => [state?.matches]);

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
            <MyAutocomplete 
              placeholder={'Улица и номер дома'} 
              data={street_list} 
              val={choose_street} 
              onChange={event => chooseStreet(event)} 
              func={event => debouncedSearch(event)}
              matches={matches}
              className="address"
            />
          </div>

        </div>
      </SwipeableDrawer>
  );
}
