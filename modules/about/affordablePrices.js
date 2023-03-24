import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Divider from '@mui/material/Divider';

export default function AffordablePrices({handleChangeExpanded}) {
  console.log('render affordablePrices');

  return (
    <Grid item xs={12} style={{ paddingTop: 0, paddingBottom: 1 }}>
      <Accordion onClick={handleChangeExpanded}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h2">Доступные цены</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <p>
            <span>
              <strong>Низкая наценка.</strong> Держим низкую цену за счёт большого объёма продаж.
              Мы закупаем продукты оптом на всю сеть и получаем максимальные
              скидки от поставщиков. Благодаря этому вы тоже получаете выгоду.
              <br />
            </span>
            <br />
            <span>
              <strong>Прозрачное ценообразование.</strong> Возможно, для вас это станет
              открытием, но бесплатной доставки и бесплатных приправ не
              существует. Расходы на на них распределяются между всеми клиентами
              кафе за счет повышения стоимости блюд.
              <br />У нас вы платите лишь за те приправы, которые действительно
              нужны. А за доставку платит только тот, кто ею пользуется.
              Благодаря этому цены на блюда ниже.
            </span>
          </p>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
}
