import { useEffect, useRef } from 'react';
import { useProfileStore } from '@/components/store.js';

// Таймеры принадлежат форме; запрос всегда использует текущий черновик store.
export default function useAddressInput(open, city) {
  const [
    addressInput,
    addressEntrance,
    setAddressInput,
    setAddressEntrance,
    verifyAddressInput,
    getAddrList,
    chooseStreet,
  ] = useProfileStore((state) => [
    state.addressInput,
    state.addressEntrance,
    state.setAddressInput,
    state.setAddressEntrance,
    state.verifyAddressInput,
    state.getAddrList,
    state.chooseStreet,
  ]);
  const searchTimer = useRef();
  const entranceTimer = useRef();
  const cancel = () => {
    clearTimeout(searchTimer.current);
    clearTimeout(entranceTimer.current);
  };
  useEffect(() => {
    cancel();
    return cancel;
  }, [open, city]);

  const commit = () => {
    cancel();
    if (!open || !addressInput?.trim()) return Promise.resolve(false);
    return verifyAddressInput();
  };
  return {
    addressInput,
    pd: addressEntrance,
    changeInput: (value) => {
      cancel();
      setAddressInput(value);
      if (value.trim())
        searchTimer.current = setTimeout(() => getAddrList(value), 350);
    },
    changeEntrance: (event) => {
      cancel();
      setAddressEntrance(event.target.value);
      if (open && addressInput?.trim())
        entranceTimer.current = setTimeout(() => verifyAddressInput(), 350);
    },
    select: (option) => {
      cancel();
      return chooseStreet(option);
    },
    commit,
    cancel,
  };
}
