import { useEffect } from 'react';

import Link from 'next/link';

import { useHeaderStore, useProfileStore } from '@/components/store.js';
import { ProfileIconMobile } from '@/ui/Icons.js';
import ListItem from '@mui/material/ListItem';

export default function ProfileIconHeaderMobile({ setActiveMenu, city, active_page }) {

  const [setActiveModalAuth, isAuth] = useHeaderStore((state) => [state.setActiveModalAuth, state.isAuth]);
  const [shortName, getUserInfo] = useProfileStore((state) => [state.shortName, state.getUserInfo]);
  const [token] = useHeaderStore(state => [state.token])

  useEffect(() => {
    if(token && token.length > 0) {
      getUserInfo('profile', city, token);
    }
  }, [token]);

  let bgColor = active_page === 'account' || active_page === 'profile' || active_page === 'address' || active_page === 'promokody' || active_page === 'zakazy';

  if(isAuth !== 'auth'){
    return (
      <ListItem onClick={() => { setActiveMenu(false); setActiveModalAuth(true) }}>
        <div style={{background: bgColor ? 'rgba(0, 0, 0, 0.03)' : '#fff'}}>
          <ProfileIconMobile />
          <span>Аккаунт</span>
        </div>
      </ListItem>
    );
  }

  return (
    <ListItem onClick={() => setActiveMenu(false)}>
      <Link href={'/' + city + '/account'} style={{background: bgColor ? 'rgba(0, 0, 0, 0.03)' : '#fff'}}>
        <ProfileIconMobile />
        <span style={{color: bgColor ? ' #dd1a32' : null}}>Аккаунт</span>
        <span className="profile">{shortName ? shortName : <ProfileIconMobile />}</span>
      </Link>
    </ListItem>
  );
}
