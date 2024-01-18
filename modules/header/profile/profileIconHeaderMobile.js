import Link from 'next/link';

import { useHeaderStore } from '@/components/store.js';
import { ProfileIconMobile } from '@/ui/Icons.js';
import ListItem from '@mui/material/ListItem';

export default function ProfileIconHeaderMobile({ setActiveMenu, city, active_page }) {
  const [userName, setActiveModalAuth, isAuth] = useHeaderStore((state) => [state.userName, state.setActiveModalAuth, isAuth]);

  let bgColor = active_page === 'account' || active_page === 'profile' || active_page === 'address' || active_page === 'promokody' || active_page === 'zakazy';

  if( isAuth !== 'auth' ){
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
      <Link href={'/' + city + '/zakazy'} style={{background: bgColor ? 'rgba(0, 0, 0, 0.03)' : '#fff'}}>
        <ProfileIconMobile />
        <span style={{color: bgColor ? ' #dd1a32' : null}}>Аккаунт</span>
        <span className="profile">{userName}</span>
      </Link>
    </ListItem>
  );
}
