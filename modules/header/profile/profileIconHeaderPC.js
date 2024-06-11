import Link from 'next/link';

import { useHeaderStore, useCitiesStore } from '@/components/store.js';

import { ProfileIconNew } from '@/ui/Icons.js';

export default function ProfileIconHeaderPC({activeProfile}) {
  const [setActiveModalAuth, isAuth] = useHeaderStore((state) => [state.setActiveModalAuth, state.isAuth]);
  const [thisCity] = useCitiesStore((state) => [state.thisCity]);
  
  return (
    <div className={'profileHeaderPC '+(activeProfile ? 'active' : '')} >
      {isAuth === 'auth' ? 
        <Link href={'/' + thisCity + '/zakazy'}><ProfileIconNew className='profile_svg' /></Link> 
          : 
        <ProfileIconNew className='profile_svg' onClick={ () => setActiveModalAuth(true) } style={{ cursor: 'pointer' }}/> 
      }
    </div>
  );
}
