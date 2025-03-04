import Link from 'next/link';

import { useHeaderStoreNew, useCitiesStore, useProfileStore } from '@/components/store.js';

import { ProfileIconNew } from '@/ui/Icons.js';

function ProfileIconHeaderPCNew() {
  const [ colorAccount, shortName, count_promo, count_orders ] = useProfileStore( state => [state.colorAccount, state.shortName, state.count_promo, state.count_orders]);

  return (
    <div className="accountLogin accountMain" style={{ background: colorAccount.login }}>
      { count_promo > 0 || count_orders > 0 ? <div className="count_promo_order" /> : false }
      {shortName ? <span>{shortName}</span> : <ProfileIconNew className='profile_svg' />}
    </div>
  );
}

export default function ProfileIconHeaderPC({activeProfile}) {
  const [setActiveModalAuth, isAuth] = useHeaderStoreNew((state) => [state?.setActiveModalAuth, state?.isAuth]);
  const [thisCity] = useCitiesStore((state) => [state.thisCity]);
  
  return (
    <div className={'profileHeaderPC '+(activeProfile ? 'active' : '')} >
      {isAuth === 'auth' ? 
        <Link href={'/' + thisCity + '/zakazy'}><ProfileIconHeaderPCNew /></Link> 
          : 
        <ProfileIconNew className='profile_svg' onClick={ () => setActiveModalAuth(true) } style={{ cursor: 'pointer' }}/> 
      }
    </div>
  );
}
