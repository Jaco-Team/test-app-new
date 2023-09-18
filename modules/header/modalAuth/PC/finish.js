import { useCitiesStore } from '@/components/store';

import Link from 'next/link';
import { CheckAuthMobile } from '@/ui/Icons';
import Typography from '@mui/material/Typography';

export default function FinishPC({closeModal}) {
  //console.log('render FinishPC');

  const [thisCity] = useCitiesStore((state) => [state.thisCity]);

  return (
    <div className="modalLoginFinishPC">

      <div className="loginSVG">
        <CheckAuthMobile />
      </div>

      <div className="loginSubHeader">
        <Typography component="span">Ваш аккаунт зарегистрирован.</Typography>
        <Typography component="span">Теперь вы можете сохранять свои адреса, привязать банковскую карту и повторять прежние заказы.</Typography>
      </div>

      <Link href={`/${thisCity}/`} passHref className="loginLogin" onClick={closeModal}>
        <Typography component="span">Открыть меню</Typography>
      </Link>
    
    </div>
  );
}
