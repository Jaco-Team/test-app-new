import { useEffect } from 'react';

import Link from 'next/link';

import { useSession } from 'next-auth/react';

import { useHeaderStore, useCitiesStore } from '@/components/store.js';
import { shallow } from 'zustand/shallow';

import { ProfileIcon } from '@/ui/Icons.js';

export default function ProfileIconHeaderPC({ active_page }) {
  console.log('render ProfileIconHeaderPC');

  const session = useSession();

  console.log('ProfileIconHeaderPC ===>', session);

  const [userName, setActiveUser, setActiveModalAuth] = useHeaderStore((state) => [state.userName, state.setActiveUser, state.setActiveModalAuth], shallow);
  const [thisCity] = useCitiesStore((state) => [state.thisCity], shallow);
  
  useEffect(() => {
    if(session?.status === "authenticated") {
      setActiveUser(session.data.user.name ?? session.data.user.display_name);
    }
  }, [session]);

  return (
    <div style={{ width: '3.5%' }} className={active_page === 'profile' ? 'headerCat activeCat' : 'headerCat'} >
       {userName ? (
        <Link href={'/' + thisCity + '/zakazy'}  className='activeProfileCat'><span>{userName}</span></Link>
      ) : (
        <ProfileIcon style={{ width: '4vw', height: '4vw' }}  onClick={ () => setActiveModalAuth(true) }/>
      )}
  </div>
  );
}
