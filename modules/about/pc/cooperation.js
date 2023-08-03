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
        <span>Бизнес — <Link href={'https://vk.com/@jaco_blog-ischem-franchaizi-dlya-rasshireniya-seti-kafe'} target="_blank">стать франчайзи</Link></span>
        <br />
        <span >Отдел маркетинга — <Link href={'mailto:event.jaco@gmail.com'}>event.jaco@gmail.com</Link> +7 (906) 129-98-33</span>
        <br />
        <span>Отдел закупок — <Link href={'mailto:zacupci.jaco@gmail.com'}>zacupci.jaco@gmail.com</Link> +7 (903) 333-74-85</span>
      </p>
    </Grid>
  );
}
