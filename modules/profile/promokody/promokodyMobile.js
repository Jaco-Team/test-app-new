import { useEffect } from 'react';

import { useProfileStore } from '@/components/store.js';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import Box from '@mui/material/Box';

import { ArrowLeftMobile } from '@/ui/Icons.js';

import PromoCardMobile from './promoCardMobile';

export default function PromokodyMobile({ this_module, city }) {

  const session = useSession();

  const [ getPromoList, promoListActive ] = useProfileStore( state => [ state.getPromoList, state.promoListActive ]);

  useEffect(() => {
    if (session.data?.user?.token) {
      getPromoList(this_module, city, session.data?.user?.token);
    }
  }, [session]);

  return (
    <Box sx={{ display: { xs: 'flex', md: 'flex', lg: 'none' } }} className="PromokodyMobile">
      <div className="promokodyLogin">
        <Link href={'/' + city + '/account'}>
          <ArrowLeftMobile />
        </Link>
        <span>Мои промокоды</span>
      </div>
      <div className="promoList promokodyMain">
        {promoListActive.map((item, key) => (
          <PromoCardMobile key={key} item={item} />
        ))}
      </div>
    </Box>
  );
}
