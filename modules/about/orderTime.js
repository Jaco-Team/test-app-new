import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';

export default function OrderTime({ handleChangeExpanded }) {

  return (
    <Grid item xs={12} id={'tag4'}>
      <Typography variant="h2">Время приготовления заказа</Typography>
      <p>
        <span>
          Скорость приготовления блюда почти так же важна, как и его
          качество. 
        </span>
        <br />
        <br />
        <span>
          Наша информационная система “Жако Шеф” учитывает загруженность
          кафе по многим показателям и показывает примерное время
          приготовления заказа.
        </span>
        <br />
        <br />
        <span>
          Узнать статус заказа и примерное время его готовности вы можете в
          личном кабинете на сайте.
        </span>
      </p>
    </Grid>
  );

  return (
    <Accordion className={'MyAccordion'}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={handleChangeExpanded}>
        <Typography variant="h2">Время приготовления заказа</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <p>
          <span>
            Скорость приготовления блюда почти так же важна, как и его
            качество. <br />
          </span>
          <br />
          <span>
            Наша информационная система “Жако Шеф” учитывает загруженность
            кафе по многим показателям и показывает примерное время
            приготовления заказа. <br />
          </span>
          <br />
          <span>
            Узнать статус заказа и примерное время его готовности вы можете в
            личном кабинете на сайте.
          </span>
        </p>
      </AccordionDetails>
    </Accordion>
  );
}
