import Typography from '@mui/material/Typography';

const arrColor = {
  new: { color: '#f68d02', text: 'новинка' },
  hit: { color: '#a63dd3', text: 'хит' },
  sale: { color: '#DB0021', text: 'скидка' },
  updated: { color: '#23b4b1', text: 'Обновлено' },
  hot: { color: '#ff292d', text: 'Остро' },
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
