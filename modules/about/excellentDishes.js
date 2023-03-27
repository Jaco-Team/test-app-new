import Image from 'next/image';
import Link from 'next/link';

import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function ExcellentDishes({ handleChangeExpanded }) {

  return (
    <Grid item xs={12} style={{ paddingTop: 0, paddingBottom: 1 }}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={handleChangeExpanded}>
          <Typography variant="h2">Превосходные блюда</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid item xs={12}>
            <p>
              <span>
                <strong>Большие порции и много начинки.</strong>Мы хотим сытно и
                вкусно кормить, а не просто разжигать аппетит. Массовая доля
                начинки в отдельных роллах достигает 50% и выше (в ролле
                Филадельфия Люкс — 56%, больше половины от веса блюда!). <br />
              </span>
              <br />
              <span>
                <strong>Качество по сети 99,8%</strong>по статистике <Link href={'https://vk.com/@jaco_blog-pismo-66-kak-informacionnaya-sistema-zhako-shef-reshaet-zada'} passHref>информационной системы “Жако Шеф”</Link>. Показатель качества основан на фиксировании обращений клиентов. Каждое кафе стремиться к
                показателю качества 100%. Мы понимаем, над чем нам нужно
                работать и что улучшать. <br />
              </span>
              <br />
              <span>
                <strong>Выбираем натуральность:</strong>В наших блюдах нет ГМО, ЗМЖ, трансжиров и антибиотиков. <Link href={'https://vk.com/@jaco_blog-pismo-54-vybiraem-naturalnost'} passHref>Подробнее тут.</Link>
                <br />
              </span>
              <br />
              <span>Так выглядят наши блюда:</span>
            </p>
          </Grid>
          <Grid item xs={12}>
            <Image
              alt=""
              src="/about/j-pepperoni.jpg"
              width={3700}
              height={1000}
              priority={true}
              style={{ width: '100%', height: 'auto' }}
            />
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="center">
            <p>Пицца Пепперони и сет Атлантида</p>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
}
