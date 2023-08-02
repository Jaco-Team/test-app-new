import { useEffect } from 'react';

import Link from 'next/link';

import { useSession } from 'next-auth/react';

import { useHeaderStore, useCitiesStore } from '@/components/store.js';

import { ProfileIcon } from '@/ui/Icons.js';

export default function ProfileIconHeaderPC() {
  const session = useSession();

  const [userName, setActiveUser, setActiveModalAuth] = useHeaderStore((state) => [state.userName, state.setActiveUser, state.setActiveModalAuth]);
  const [thisCity] = useCitiesStore((state) => [state.thisCity]);
  
  useEffect(() => {
    if(session?.status === "authenticated") {
      setActiveUser(session.data.user.name ?? session.data.user.display_name);
    }
  }, [session]);

  return (
    <div className={userName ? 'activeProfileCat' : 'profileHeaderPC'} >
      {userName ? <Link href={'/' + thisCity + '/zakazy'}><span>{userName}</span></Link> : <ProfileIcon onClick={ () => setActiveModalAuth(true) }/>}
    </div>
  );
}
