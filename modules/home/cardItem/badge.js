import Typography from '@mui/material/Typography';

const arrColor = {
  new: { color: 'rgba(246, 141, 2, 1)', text: 'новинка' },
  hit: { color: 'rgba(166, 61, 211, 1)', text: 'хит' },
  sale: { color: '#DB0021', text: 'скидка' },
  updated: { color: 'rgba(35, 180, 177, 1)', text: 'Обновлено' },
  hot: { color: 'rgba(255, 41, 45, 1)', text: 'Остро' },
};

export default function BadgeItem({ size, view, type }) {
  return (
    <div className={'badge container ' + view}>
      <div className={'shadow ' + size} />
      <div
        className={'box ' + size}
        style={{ backgroundColor: arrColor[type].color }}
      >
        <Typography component="span">{arrColor[type].text}</Typography>
      </div>
    </div>
  );
}
