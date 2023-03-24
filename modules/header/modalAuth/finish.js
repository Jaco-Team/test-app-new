import { shallow } from 'zustand/shallow';
import { useHeaderStore } from '@/components/store';

import Image from 'next/image';
import Link from 'next/link';
import { IconClose } from '@/ui/Icons';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

export default function Finish() {
  console.log('render Finish');

  const [closeModalAuth] = useHeaderStore((state) => [state.closeModalAuth], shallow);

  return (
    <div className='modalLoginFinish'>
    <IconButton style={{ position: 'absolute', top: -40, left: 15, backgroundColor: 'transparent' }} onClick={closeModalAuth}>
        <IconClose style={{ width: 25, height: 25, fill: '#fff', color: '#fff', overflow: 'visible' }} />
    </IconButton>

    <div className='loginIMG'>
      <Image alt="Аккаунт" src='/like.png' width={180} height={180} />
    </div>

    <div className='loginHeader'>
        <Typography component="h2">Добро пожаловать</Typography>
    </div>
    
    <div className='loginSubHeader1'>
        <Typography component="span">Теперь вы можете легко оформить онлайн-заказ с доставкой или забрать его самостоятельно из любого нашего кафе.</Typography>
    </div>

    <div className='loginSubHeader2'>
        <Typography component="span"><Link href={'/samara/profile'} passHref onClick={closeModalAuth}>Укажите в профиле</Link> день рождения и мы заренее пришлём вам промокод на приятный подарок.</Typography>
    </div>

    <Link href={'/samara/'} passHref className='loginLogin' onClick={closeModalAuth}>
        <Typography component="span">Перейти в меню</Typography>
    </Link>
    
    <Link href={'/samara/cart'} passHref className='loginCreate' onClick={closeModalAuth}>
        <Typography component="span">Открыть корзину</Typography>
    </Link>
</div>
  );
}
