import Image from 'next/image';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';

export default function Responsibility({ handleChangeExpanded }) {

  return (
    <Grid item xs={12} id={'tag6'}>
      <Typography variant="h2">Социальная и экологическая ответственность</Typography>
      <p>
        <span>
          Мы заботимся об окружающей среде, выбирая экологичную упаковку:
          картон и перерабатываемые виды пластика. <br />
        </span>
        <br />
        <span>
          Понимаем, что большая сила — это большая ответственность,
          поэтому помогаем братьям нашим меньшим. Оставшуюся при
          подготовке ингредиентов обрезь отдаём в приюты для животных.
          <br />
        </span>
        <br />
        <span>
          Мы поддерживаем спортивные мероприятия и участвуем в субботниках.
        </span>
      </p>
      
      <Image
        alt=""
        src="/about/субботник.jpg"
        width={2560}
        height={1920}
        priority={true}
        style={{ width: '100%', height: 'auto' }}
      />
      
      <p style={{ textAlign: 'center' }}>Команда Жако на субботнике</p>
    </Grid>
  );

  return (
    <Accordion className={'MyAccordion'}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={handleChangeExpanded}>
        <Typography variant="h2">Социальная и экологическая ответственность</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <p>
          <span>
            Мы заботимся об окружающей среде, выбирая экологичную упаковку:
            картон и перерабатываемые виды пластика. <br />
          </span>
          <br />
          <span>
            Понимаем, что большая сила — это большая ответственность,
            поэтому помогаем братьям нашим меньшим. Оставшуюся при
            подготовке ингредиентов обрезь отдаём в приюты для животных.
            <br />
          </span>
          <br />
          <span>
            Мы поддерживаем спортивные мероприятия и участвуем в субботниках.
          </span>
        </p>
        
        <Image
          alt=""
          src="/about/субботник.jpg"
          width={2560}
          height={1920}
          priority={true}
          style={{ width: '100%', height: 'auto' }}
        />
        
        <p style={{ textAlign: 'center' }}>Команда Жако на субботнике</p>
      </AccordionDetails>
    </Accordion>
  );
}
