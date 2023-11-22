import { useEffect } from 'react';

import { useHeaderStore, useProfileStore } from '@/components/store.js';

import { useSession } from 'next-auth/react';

import Link from 'next/link';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { AccountMobileAddress, AccountMobilePromo, AccountMobilePerson, AccountMobileHistory } from '@/ui/Icons.js';

export default function AccountMobile({ city, this_module }) {

  const session = useSession();

  const [userName] = useHeaderStore((state) => [state.userName]);
  const [setActiveAccountModal, colorAccount, getUserInfo, userInfo, shortName] = useProfileStore((state) => [state.setActiveAccountModal, state.colorAccount, state.getUserInfo, state.userInfo, state.shortName]);

  useEffect(() => {
    if( session.data?.user?.token ){
      getUserInfo(this_module, city, session.data?.user?.token);
    }
  }, [session]);

  return (
    <Box sx={{ display: { xs: 'flex', md: 'flex', lg: 'none' } }} className="AccountMobile">
      <div className="accountLogin accountMain" onClick={() => setActiveAccountModal(true, 'color')} style={{ background: colorAccount.login }}>
        {/* для тестирования */}
        {!shortName || shortName === 'undefined' ? 'ЯБ' : shortName }
      </div>
      <div className="accountName accountMain">
         {/* для тестирования */}
        {userName ? userName : 'Ян Брин'}
      </div>
      <div className="accountPhone accountMain">{userInfo?.login ?? ''}</div>
      <div className="accountData accountMain">
        <Link href={'/' + city + '/address'} style={{ background: colorAccount.item }}>
          <span> Адреса доставки</span>
          <AccountMobileAddress style={{ fill: colorAccount.login }} />
        </Link>
        <Link href={'/' + city + '/profile'} style={{ background: colorAccount.item }}>
          <span>Личные данные</span>
          <AccountMobilePerson style={{ fill: colorAccount.login }} />
        </Link>
        <Link href={'/' + city + '/promokody'} style={{ background: colorAccount.item }}>
          <span>Промокоды и подарки</span>
          <AccountMobilePromo style={{ fill: colorAccount.login }} />
        </Link>
        <Link href={'/' + city + '/zakazy'} style={{ background: colorAccount.item }}>
          <span>История заказов</span>
          <AccountMobileHistory style={{ fill: colorAccount.login }} />
        </Link>
      </div>
      <Button variant="outlined" className="accountButton accountMain" onClick={() => setActiveAccountModal(true, 'exit')}>
        <span>Выйти</span>
      </Button>
    </Box>
  );
}
