import { useEffect } from 'react';

import { useProfileStore, useHeaderStore } from '@/components/store.js';

import Link from 'next/link';

import Box from '@mui/material/Box';

import { ArrowLeftMobile } from '@/ui/Icons.js';

import PromoCardMobile from './promoCardMobile';

export default function PromokodyMobile({ this_module, city }) {

  const [ getPromoList, promoListActive ] = useProfileStore( state => [ state.getPromoList, state.promoListActive ]);
  const [ token ] = useHeaderStore( state => [ state?.token ] )

  useEffect(() => {
    if( token && token.length > 0 ) {
      getPromoList(this_module, city, token);
    }
  }, [token, city]);

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
