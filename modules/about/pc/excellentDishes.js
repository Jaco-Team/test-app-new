import Image from 'next/image';
import Link from 'next/link';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

export default function ExcellentDishes() {
  return (
    <Grid item xs={12} id={'tag1'}>
      <Typography variant="h2">Превосходные блюда</Typography>
      <p>
        <span>
          <strong>Большие порции и много начинки.</strong> Мы хотим сытно и
          вкусно кормить, а не просто разжигать аппетит. Массовая доля
          начинки в отдельных роллах достигает 50% и выше (в ролле
          Филадельфия Люкс — 56%, больше половины от веса блюда!). <br />
        </span>
        <br />
        <span>
          <strong>Качество по сети 99,8%</strong> по статистике <Link href={'https://vk.com/@jaco_blog-pismo-66-kak-informacionnaya-sistema-zhako-shef-reshaet-zada'} target="_blank">информационной системы “Жако Шеф”</Link>. Показатель качества основан на фиксировании обращений клиентов. Каждое кафе стремиться к
          показателю качества 100%. Мы понимаем, над чем нам нужно работать и что улучшать. <br />
        </span>
        <br />
        <span>
          <strong>Выбираем натуральность:</strong> В наших блюдах нет ГМО, ЗМЖ, трансжиров и антибиотиков. <Link href={'https://vk.com/@jaco_blog-pismo-54-vybiraem-naturalnost'} target="_blank">Подробнее тут.</Link>
          <br />
        </span>
      </p>
    
      <Image
        alt=""
        src="/about/Populyarnye-blyuda1.jpg"
        width={2000}
        height={1540}
        priority={true}
        style={{ width: '100%', height: 'auto' }}
      />

      <p>Сет Атлантида и пицца Пепперони</p>
    </Grid>
  );
}
