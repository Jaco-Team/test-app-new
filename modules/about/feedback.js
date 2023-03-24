import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Divider from '@mui/material/Divider';

export default function Feedback({handleChangeExpanded}) {
  console.log('render Feedback');

  return (
    <Grid item xs={12} style={{ paddingTop: 0, paddingBottom: 1 }}>
      <Accordion onClick={handleChangeExpanded}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h2">Обратная связь</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <p>
            <span>

            Мы всегда открыты к диалогу. Нас интересует мнение по вкусу и
            качеству блюд, обслуживанию в кафе, доставке. < br />
            </span>
            < br />
            <span>

            Для связи с вами мы
            создали группы в социальных сетях и Telegram-канал.  < br />
            </span>
            < br />
            <span> Жако в Тольятти Вконтакте </span>< br />
            <span>Жако в Самаре Вконтакте</span>< br />

            <span> Жако в Телеграм</span>< br />
            <span>   Жако в
            Одноклассниках < br /></span>< br />
          
            <span>

            В группах Вконтакте на открытой стене вы можете
            поделиться отзывом о блюдах и нашей работе. Если у вас возникли
            вопросы по качеству, напишите в сообщения группы, и вам ответят
            сотрудники отдела поддержки.< br />
            </span>
            < br />
            <span>

            Знаете, как улучшить блюда? Заполните анкету.
            </span>
          </p>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
}
