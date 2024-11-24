import { useCitiesStore, useHeaderStoreNew } from '@/components/store';

import Link from 'next/link';
import { CheckAuthMobile } from '@/ui/Icons';
import Typography from '@mui/material/Typography';

export default function Finish({ closeModal }) {
  const [thisCity] = useCitiesStore((state) => [state?.thisCity]);
  const [matches] = useHeaderStoreNew((state) => [state?.matches]);

  return (
    <div className={matches ? 'modalLoginFinishMobile' : 'modalLoginFinishPC'}>
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
