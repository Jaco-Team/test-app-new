import Link from 'next/link';

import { useHeaderStore, useCitiesStore } from '@/components/store.js';

import { ProfileIcon } from '@/ui/Icons.js';

export default function ProfileIconHeaderPC() {
  const [userName, setActiveModalAuth, isAuth] = useHeaderStore((state) => [state.userName, state.setActiveModalAuth, state.isAuth]);
  const [thisCity] = useCitiesStore((state) => [state.thisCity]);
  
  return (
    <div className={userName ? 'activeProfileCat' : 'profileHeaderPC'} >
      {isAuth == 'auth' ? <Link href={'/' + thisCity + '/zakazy'}><span>{userName}</span></Link> : <ProfileIcon onClick={ () => setActiveModalAuth(true) }/>}
    </div>
  );
}
