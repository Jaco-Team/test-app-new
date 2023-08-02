import { useHeaderStore, useCitiesStore } from '@/components/store';

import Image from 'next/image';
import Link from 'next/link';
import { IconClose } from '@/ui/Icons';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

export default function Finish() {
  console.log('render Finish');

  const [closeModalAuth] = useHeaderStore((state) => [state.closeModalAuth]);
  const [thisCity] = useCitiesStore((state) => [state.thisCity]);

  return (
    <div className="modalLoginFinish">
      <IconButton style={{ position: 'absolute', top: '-3.2vw', left: -8, backgroundColor: 'transparent' }} onClick={closeModalAuth}>
        <IconClose style={{ width: '2.166vw', height: '2.166vw', overflow: 'visible', borderRadius: 50, background: 'rgba(0, 0, 0, 0.5)' }}/>
      </IconButton>

      <div className="loginIMG">
        <Image alt="Аккаунт" src="/check.png" width={180} height={180} />
      </div>

      <div className="loginHeader">
        <Typography component="h2">Добро пожаловать</Typography>
      </div>

      <div className="loginSubHeader1">
        <Typography component="span">Теперь вы можете легко оформить онлайн-заказ с доставкой или забрать его самостоятельно из любого нашего кафе.</Typography>
      </div>

      <div className="loginSubHeader2">
        <Typography component="span">
          <Link href={'/samara/profile'} passHref onClick={closeModalAuth}>Укажите в профиле</Link> день рождения и мы заренее пришлём вам промокод на приятный подарок.
        </Typography>
      </div>

      <Link href={`/${thisCity}/`} passHref className="loginLogin" onClick={closeModalAuth}>
        <Typography component="span">Перейти в меню</Typography>
      </Link>

      <Link href={`/${thisCity}/cart`} passHref className="loginCreate" onClick={closeModalAuth}>
        <Typography component="span">Открыть корзину</Typography>
      </Link>
    </div>
  );
}
