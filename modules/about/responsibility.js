import Image from 'next/image';

import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Divider from '@mui/material/Divider';

export default function Responsibility({handleChangeExpanded}) {
  console.log('render Responsibility');

  return (
    <Grid item xs={12} style={{ paddingTop: 0, paddingBottom: 1 }}>
      <Accordion onClick={handleChangeExpanded}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h2">
            Социальная и экологическая ответственность
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid item xs={12}>
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
                Мы поддерживаем спортивные мероприятия и участвуем в
                субботниках.
              </span>
            </p>
          </Grid>
          <Grid item xs={12}>
            <Image
              alt=""
              src="/about/субботник.jpg"
              width={3700}
              height={1000}
              priority={true}
              style={{ width: '100%', height: 'auto' }}
            />
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="center">
            <p>Команда Жако на субботнике</p>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
}
