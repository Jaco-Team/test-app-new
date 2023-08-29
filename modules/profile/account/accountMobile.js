import { useHeaderStore, useProfileStore } from '@/components/store.js';

import Link from 'next/link';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { AccountMobileAddress, AccountMobilePromo, AccountMobilePerson, AccountMobileHistory } from '@/ui/Icons.js';

export default function AccountMobile({ city }) {
  const [userName] = useHeaderStore((state) => [state.userName]);
  const [setActiveAccountModal, colorAccount] = useProfileStore((state) => [state.setActiveAccountModal, state.colorAccount]);

  return (
    <Box sx={{ display: { xs: 'flex', md: 'flex', lg: 'none' } }} className="AccountMobile">
      <div className="accountLogin accountMain" onClick={() => setActiveAccountModal(true, 'color')} style={{ background: colorAccount.login }}>
        {/* для тестирования */}
        {userName ? userName : 'ЯБ'}
      </div>
      <div className="accountName accountMain">Ян Брин</div>
      <div className="accountPhone accountMain">+7 (925) 485-89-75</div>
      <div className="accountData accountMain">
        <Link href={'/' + city + '/profile'} style={{ background: colorAccount.item }}>
          <span> Адреса доставки</span>
          <AccountMobileAddress style={{ fill: colorAccount.login }} />
        </Link>
        <Link href={'/' + city + '/profile'} style={{ background: colorAccount.item }}>
          <span>Личные данные</span>
          <AccountMobilePerson style={{ fill: colorAccount.login }} />
        </Link>
        <Link href={'/' + city + '/profile'} style={{ background: colorAccount.item }}>
          <span>Промокоды и подарки</span>
          <AccountMobilePromo style={{ fill: colorAccount.login }} />
        </Link>
        <Link href={'/' + city + '/profile'} style={{ background: colorAccount.item }}>
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
