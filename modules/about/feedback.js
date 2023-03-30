import Link from 'next/link';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';

export default function Feedback({ handleChangeExpanded }) {

  return (
    <Grid item xs={12} id={'tag7'}>
      <Typography variant="h2">Обратная связь</Typography>
      <p>
        <span>
          Мы всегда открыты к диалогу. Нас интересует мнение по вкусу и
          качеству блюд, обслуживанию в кафе, доставке. <br />
        </span>
        <br />
        <span>
          Для связи с вами мы создали группы в социальных сетях и Telegram-канал. <br />
        </span>
        <br />
        <Link href={'https://vk.com/jacofood_tlt'} target="_blank">Жако в Тольятти Вконтакте</Link>
        <br />
        <Link href={'https://vk.com/jacofood_smr'} target="_blank">Жако в Самаре Вконтакте</Link>
        <br />
        <Link href={'https://t.me/jacofood'} target="_blank">Жако в Телеграм</Link>
        <br />
        
        <Link href={'https://ok.ru/group/54671948841166'} target="_blank">Жако в Одноклассниках</Link>
        <br />
        
        <br />
        <span>
          В группах Вконтакте на открытой стене вы можете поделиться отзывом
          о блюдах и нашей работе. Если у вас возникли вопросы по качеству,
          напишите в сообщения группы, и вам ответят сотрудники отдела
          поддержки.
        </span>
        <br />
        <br />
        <span>Знаете, как улучшить блюда? Заполните <Link href={'https://docs.google.com/forms/d/e/1FAIpQLSc_ohjcoYjY6W5oqaGnoDhlSlyT8Y_LEfbHljjqRAqyvpEv1Q/viewform'} target="_blank">анкету.</Link></span>
      </p>
    </Grid>
  );

  return (
    <Accordion className={'MyAccordion'}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={handleChangeExpanded}>
        <Typography variant="h2">Обратная связь</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <p>
          <span>
            Мы всегда открыты к диалогу. Нас интересует мнение по вкусу и
            качеству блюд, обслуживанию в кафе, доставке. <br />
          </span>
          <br />
          <span>
            Для связи с вами мы создали группы в социальных сетях и Telegram-канал. <br />
          </span>
          <br />
          <Link href={'https://vk.com/jacofood_tlt'} passHref>Жако в Тольятти Вконтакте</Link>
          <br />
          <Link href={'https://vk.com/jacofood_smr'} passHref>Жако в Самаре Вконтакте</Link>
          <br />
          <Link href={'https://t.me/jacofood'} passHref>Жако в Телеграм</Link>
          <br />
          
          <Link href={'https://ok.ru/group/54671948841166'} passHref>Жако в Одноклассниках</Link>
            <br />
          
          <br />
          <span>
            В группах Вконтакте на открытой стене вы можете поделиться отзывом
            о блюдах и нашей работе. Если у вас возникли вопросы по качеству,
            напишите в сообщения группы, и вам ответят сотрудники отдела
            поддержки.
            
          </span>
          <br />
          <br />
          <span>Знаете, как улучшить блюда? Заполните <Link href={'https://docs.google.com/forms/d/e/1FAIpQLSc_ohjcoYjY6W5oqaGnoDhlSlyT8Y_LEfbHljjqRAqyvpEv1Q/viewform'} passHref>анкету.</Link></span>
        </p>
      </AccordionDetails>
    </Accordion>
  );
}
