import Image from 'next/image';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default function AboutUs() {
  console.log('render AboutUs');

  return (
    <>
      <Grid item xs={12} style={{ paddingTop: 0 }}>
        <Typography variant="h1">О нас</Typography>
      </Grid>
      <Grid item xs={12} style={{ paddingTop: 0 }}>
        <p >
          <span>
          Жако — сеть кафе с доставкой превосходной еды и оптимизма. <br />
          Основа нашего меню — роллы и пицца. Дополняем салатами, пастой,
          предлагаем закуски, десерты и напитки. <br />
          </span>
          <br />
        <span>

          Наши отличия — мы готовим большие порции, кладём много начинки,
          выбираем ингредиенты без ГМО, ЗМЖ, трансжиров, антибиотиков. <br />
        </span>
        <br />
        <span>

          У нас можно пообедать в кафе, заказать доставку или забрать самому
          (так выгоднее).
        </span>
        </p>
      </Grid>

      <Grid item xs={12} style={{ paddingTop: 0 }}>
        <Image
          alt=""
          src="/about/fasad.jpg"
          width={3700}
          height={1000}
          priority={true}
          style={{ width: '100%', height: 'auto' }}
        />
      </Grid>

      <Grid item xs={12} style={{ paddingTop: 0 }} justifyContent="center">
        <p>Добро пожаловать в Жако!</p>
      </Grid>
    </>
  );
}
