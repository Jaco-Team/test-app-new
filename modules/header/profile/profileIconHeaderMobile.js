import { useEffect } from 'react';

import Link from 'next/link';

import { useSession } from 'next-auth/react';
import { useHeaderStore } from '@/components/store.js';
import { ProfileIconMobile } from '@/ui/Icons.js';
import ListItem from '@mui/material/ListItem';

export default function ProfileIconHeaderMobile({ setActiveMenu, city, active_page }) {
  //console.log('render ProfileIconHeaderMobile');

  const session = useSession();

  const [userName, setActiveUser, setActiveModalAuth] = useHeaderStore((state) => [state.userName, state.setActiveUser, state.setActiveModalAuth]);

  useEffect(() => {
    if(session?.status === "authenticated") {
      setActiveUser(session.data.user.name ?? session.data.user.display_name);
    }
  }, [session]);

  return (
    <>
    {!userName ? (
      <ListItem 
      onClick={() => { setActiveMenu(false); setActiveModalAuth(true) }}
      //onClick={() => setActiveMenu(false)}
      >
        <div style={{background: active_page === 'account' || active_page === 'profile' || active_page === 'address' || active_page === 'promokody' 
             || active_page === 'zakazy'? 'rgba(0, 0, 0, 0.03)' : null}}>
          <ProfileIconMobile />
          <span>Аккаунт</span>
        </div>
      </ListItem>
    ) : (
      <ListItem onClick={() => setActiveMenu(false)}>
        <Link href={'/' + city + '/zakazy'} style={{background: active_page === 'zakazy' ? 'rgba(0, 0, 0, 0.03)' : null}}>
          <ProfileIconMobile />
          <span style={{color: active_page === 'zakazy' ? ' #dd1a32' : null}}>Аккаунт</span>
          <span className="profile">{userName}</span>
        </Link>
      </ListItem>
    )}
    </>
  );
}
