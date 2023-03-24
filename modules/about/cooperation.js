import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Divider from '@mui/material/Divider';

export default function Cooperation({handleChangeExpanded}) {
  console.log('render Cooperation');

  return (
    <Grid item xs={12} style={{ paddingTop: 0, paddingBottom: 0 }}>
      <Accordion style={{ width: "100%" }} onClick={handleChangeExpanded}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h2">Сотрудничество</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <p>
            

          <span> Работа — в кафе и Управляющей компании </span><br />
            <span>  Бизнес — стать франчайзи</span><br />
            <span>   Отдел маркетинга — event.jaco@gmail.com +7 (906) 129-98-33</span><br />
            <span> Отдел
            закупок — zacupci.jaco@gmail.com +7 (903) 333-74-85</span>
          </p>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
}
