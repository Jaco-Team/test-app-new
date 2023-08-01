import { useEffect } from 'react';

import Link from 'next/link';

import { useSession } from 'next-auth/react';

import { useHeaderStore } from '@/components/store.js';
import { shallow } from 'zustand/shallow';

import { ProfileIconMobile } from '@/ui/Icons.js';

import ListItem from '@mui/material/ListItem';

export default function ProfileIconHeaderMobile({ setActiveMenu, city, active_page }) {
  //console.log('render ProfileIconHeaderMobile');

  const session = useSession();

  const [userName, setActiveUser, setActiveModalAuth] = useHeaderStore((state) => [state.userName, state.setActiveUser, state.setActiveModalAuth], shallow);

  useEffect(() => {
    if(session?.status === "authenticated") {
      setActiveUser(session.data.user.name ?? session.data.user.display_name);
    }
  }, [session]);

  return (
    <>
    {!userName ? (
      <ListItem onClick={() => { setActiveMenu(false); setActiveModalAuth(true) }}>
        <a>
          <div>
            <div>
              <ProfileIconMobile />
            </div>
            <span>Профиль</span>
          </div>
        </a>
      </ListItem>
    ) : (
      <ListItem onClick={() => setActiveMenu(false)}>
        <Link href={'/' + city + '/zakazy'} style={{background: active_page === 'zakazy' ? 'rgba(0, 0, 0, 0.05)' : null}}>
          <div>
            <div>
              <ProfileIconMobile />
            </div>
            <span style={{color: active_page === 'zakazy' ? ' #dd1a32' : null}}>Профиль</span>
            <div className="count_profile" style={{ background: '#6FBEF8' }}><span>{userName}</span></div>
          </div>
        </Link>
      </ListItem>
    )}
    </>
  );
}
