import Link from 'next/link';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

export default function Cooperation() {
  return (
    <Grid item xs={12} id={'tag8'}>
      <Typography variant="h2">Сотрудничество</Typography>
      <p>
        <span>Работа — в <Link href={'https://vk.com/@jaco_blog-pismo-71-soiskatelyam-o-rabote-v-kafe-zhako'} target="_blank">кафе</Link> и <Link href={'https://vk.com/@jaco_blog-pismo-68-soiskatelyam-o-rabote-v-upravlyauschei-kompanii-zha'} target="_blank">Управляющей компании</Link></span>
        <br />
        <span>Бизнес — <Link href={'https://franchise.jacofood.ru/'} target="_blank">стать франчайзи</Link></span>
        <br />
        <span>Отдел маркетинга — <Link href={'mailto:event.jaco@yandex.ru'}>event.jaco@yandex.ru</Link></span>
        <br />
        <span>Отдел закупок — <Link href={'mailto:Zacupci.jaco@yandex.ru'}>Zacupci.jaco@yandex.ru</Link> +7 (903) 333-74-85</span>
      </p>
    </Grid>
  );
}
