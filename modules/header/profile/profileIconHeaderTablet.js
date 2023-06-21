import { useEffect } from 'react';

import Link from 'next/link';

import { useSession } from 'next-auth/react';

import { useHeaderStore } from '@/components/store.js';
import { shallow } from 'zustand/shallow';

import { ProfileIconTablet } from '@/ui/Icons.js';

import ListItem from '@mui/material/ListItem';

export default function ProfileIconHeaderTablet({ setActiveMenu, city }) {
  console.log('render ProfileIconHeaderTablet');

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
              <ProfileIconTablet />
            </div>
            <span>Профиль</span>
          </div>
        </a>
      </ListItem>
    ) : (
      <ListItem onClick={() => setActiveMenu(false)}>
        <Link href={'/' + city + '/zakazy'}>
          <div>
            <div>
              <ProfileIconTablet />
            </div>
            <span>Профиль</span>
            <div className="count_profile" style={{ background: '#6FBEF8' }}><span>{userName}</span></div>
          </div>
        </Link>
      </ListItem>
    )}
    </>
  );
}
