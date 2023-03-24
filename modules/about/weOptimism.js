import Image from 'next/image';

import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Divider from '@mui/material/Divider';

export default function WeOptimism({handleChangeExpanded}) {
  console.log('render WeOptimism');

  return (
    <Grid item xs={12} style={{ paddingTop: 0, paddingBottom: 1 }}>
      <Accordion onClick={handleChangeExpanded}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h2">Заряжаем оптимизмом!</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Grid item xs={12}>

          <p>
            <span>

            Сотрудники кафе всегда встретят вас дружелюбно и при необходимости
            помогут с выбором блюд. Мы подбираем жизнерадостных и трудолюбивых
            людей, которые готовят ответственно и с душой. А клиенты за это
            оставляют нам слова благодарности. Получается круговорот хорошего
            настроения и оптимизма! < br />
            </span>
            < br />
            <span>
            Оптимизм — основная ценность нашей компании.
            И это не про шутки и анекдоты. Это про веру в лучшее, про веру в
            себя, про мотивацию и путь к поставленной цели. < br />
            </span>
            < br />
            <span>

             У нас есть цель —
            построить сеть кафе по всей России, мы идём к ней и верим, что всё
            получится. И вы тоже достигнете любой поставленной цели, если будете
            идти к ней шаг за шагом.
            </span>
          </p>
        </Grid>
        <Grid item xs={12}>
            <Image
              alt=""
              src="/about/IMG_5144.jpg"
              width={3700}
              height={1000}
              priority={true}
              style={{ width: '100%', height: 'auto' }}
            />
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="center">
            <p>А это Наталья, менеджер кафе на Цветном (Тольятти). Всех заряжает оптимизмом!</p>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
}
