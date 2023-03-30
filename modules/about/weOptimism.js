import Image from 'next/image';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';

export default function WeOptimism({ handleChangeExpanded }) {

  return (
    <Grid item xs={12} id={'tag5'}>
      <Typography variant="h2">Заряжаем оптимизмом!</Typography>
      <p>
        <span>
          Сотрудники кафе всегда встретят вас дружелюбно и при
          необходимости помогут с выбором блюд. Мы подбираем
          жизнерадостных и трудолюбивых людей, которые готовят
          ответственно и с душой. А клиенты за это оставляют нам слова
          благодарности. Получается круговорот хорошего настроения и
          оптимизма!
        </span>
        <br />
        <br />
        <span>
          Оптимизм — основная ценность нашей компании. И это не про шутки
          и анекдоты. Это про веру в лучшее, про веру в себя, про
          мотивацию и путь к поставленной цели. 
        </span>
        <br />
        <br />
        <span>
          У нас есть цель — построить сеть кафе по всей России, мы идём к
          ней и верим, что всё получится. И вы тоже достигнете любой
          поставленной цели, если будете идти к ней шаг за шагом.
        </span>
      </p>
    
      <Image
        alt=""
        src="/about/IMG_5144.jpg"
        width={4541}
        height={3027}
        priority={true}
        style={{ width: '100%', height: 'auto' }}
      />
    
      <p style={{ textAlign: 'center' }}>А это Наталья, менеджер кафе на Цветном (Тольятти). Всех заряжает оптимизмом!</p>
    </Grid>
  );

  return (
    <Accordion className={'MyAccordion'}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={handleChangeExpanded}>
        <Typography variant="h2">Заряжаем оптимизмом!</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <p>
          <span>
            Сотрудники кафе всегда встретят вас дружелюбно и при
            необходимости помогут с выбором блюд. Мы подбираем
            жизнерадостных и трудолюбивых людей, которые готовят
            ответственно и с душой. А клиенты за это оставляют нам слова
            благодарности. Получается круговорот хорошего настроения и
            оптимизма! <br />
          </span>
          <br />
          <span>
            Оптимизм — основная ценность нашей компании. И это не про шутки
            и анекдоты. Это про веру в лучшее, про веру в себя, про
            мотивацию и путь к поставленной цели. <br />
          </span>
          <br />
          <span>
            У нас есть цель — построить сеть кафе по всей России, мы идём к
            ней и верим, что всё получится. И вы тоже достигнете любой
            поставленной цели, если будете идти к ней шаг за шагом.
          </span>
        </p>
      
        <Image
          alt=""
          src="/about/IMG_5144.jpg"
          width={4541}
          height={3027}
          priority={true}
          style={{ width: '100%', height: 'auto' }}
        />
      
        <p style={{ textAlign: 'center' }}>А это Наталья, менеджер кафе на Цветном (Тольятти). Всех заряжает оптимизмом!</p>
      </AccordionDetails>
    </Accordion>
  );
}
