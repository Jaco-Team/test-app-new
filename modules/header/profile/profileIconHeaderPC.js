import Link from 'next/link';

import { useHeaderStore, useCitiesStore } from '@/components/store.js';

import { ProfileIcon, ProfileIconNew } from '@/ui/Icons.js';

export default function ProfileIconHeaderPC({activeProfile}) {
  const [userName, setActiveModalAuth, isAuth] = useHeaderStore((state) => [state.userName, state.setActiveModalAuth, state.isAuth]);
  const [thisCity] = useCitiesStore((state) => [state.thisCity]);
  
  return (
    <div className={'profileHeaderPC '+(activeProfile ? 'active' : '')} >
      {isAuth === 'auth' ? 
        <Link href={'/' + thisCity + '/zakazy'}><ProfileIconNew /></Link> 
          : 
        <ProfileIconNew onClick={ () => setActiveModalAuth(true) } style={{ cursor: 'pointer' }}/> 
      }
    </div>
  );
}
