import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Divider from '@mui/material/Divider';

export default function OrderTime({handleChangeExpanded}) {
  console.log('render OrderTime');

  return (
    <Grid item xs={12} style={{ paddingTop: 0, paddingBottom: 1 }}>
      <Accordion onClick={handleChangeExpanded}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h2">Время приготовления заказа</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <p>
            <span>

            Скорость приготовления блюда почти так же важна, как и его качество. < br />
            </span>
            < br />
            <span>

            Наша информационная система “Жако Шеф” учитывает загруженность кафе
            по многим показателям и показывает примерное время приготовления
            заказа. < br />
            </span>
            < br />
            <span>

            Узнать статус заказа и примерное время его готовности вы
            можете в личном кабинете на сайте.
            </span>
          </p>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
}
