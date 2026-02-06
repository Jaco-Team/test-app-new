import Image from 'next/image';
import Link from 'next/link';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import {useHeaderStoreNew} from '@/components/store';
import {ArrowLeftMobile} from '@/ui/Icons.js';

export default function AboutUs({cityName}) {
  const [matches] = useHeaderStoreNew((state) => [state.matches]);

  return (
    <Grid item xs={12} className={'about'}>

      {!matches ? null : <Link href={'/' + cityName + '/document' } className='arrow'><ArrowLeftMobile /></Link>}

      <Typography variant="h1">О нас</Typography>
    
      <p>
        Жако — сеть кафе с доставкой превосходной еды и оптимизма. 
        <br />
        Основа нашего меню — роллы и пицца. Дополняем салатами, пастой, предлагаем закуски, десерты и напитки. 
        <br />
        <br />
        Наши отличия — мы готовим большие порции, кладём много начинки, выбираем ингредиенты без ГМО, ЗМЖ, трансжиров, антибиотиков. 
        <br />
        <br />
        У нас можно пообедать в кафе, заказать доставку или забрать самому (так выгоднее).
      </p>
    
      <Image
        alt="AboutUs"
        src="/about/new_main_min.png"
        width={4606}
        height={3456}
        priority={true}
        style={{ width: '100%', height: 'auto' }}
      />
    
      <p>Добро пожаловать в Жако!</p>
    </Grid>
  );
}
