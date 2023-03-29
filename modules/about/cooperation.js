import Link from 'next/link';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Cooperation({ handleChangeExpanded }) {

  return (
    <Accordion className={'MyAccordion'}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={handleChangeExpanded}>
        <Typography variant="h2">Сотрудничество</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <p>
          <span>Работа — в <Link href={'https://vk.com/@jaco_blog-pismo-71-soiskatelyam-o-rabote-v-kafe-zhako'} passHref>кафе</Link> и <Link href={'https://vk.com/@jaco_blog-pismo-68-soiskatelyam-o-rabote-v-upravlyauschei-kompanii-zha'} passHref>Управляющей компании</Link></span>
          <br />
          <span>Бизнес — <Link href={'https://vk.com/@jaco_blog-ischem-franchaizi-dlya-rasshireniya-seti-kafe'} passHref>стать франчайзи</Link></span>
          <br />
          <span >Отдел маркетинга — <Link href={'mailto:event.jaco@gmail.com'} passHref>event.jaco@gmail.com</Link> +7 (906) 129-98-33</span>
          <br />
          <span>Отдел закупок — <Link href={'mailto:zacupci.jaco@gmail.com'} passHref>zacupci.jaco@gmail.com</Link> +7 (903) 333-74-85</span>
        </p>
      </AccordionDetails>
    </Accordion>
  );
}
