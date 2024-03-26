import Typography from '@mui/material/Typography';

const arrColor = {
  new: { color: '#EE7900', text: 'новинка' },
  hit: { color: '#AF00DB', text: 'хит' },
  sale: { color: '#DB0021', text: 'скидка' }, 
}

import './Badge.scss';

export const Badge = ({size, view, type}) => {
  return (
    <div className={'badge container '+view }>
      <div className={'shadow '+size} />
      <div className={'box '+size} style={{ backgroundColor: arrColor[type].color }}>
        <Typography component="span">{arrColor[type].text}</Typography>
      </div>
    </div>
  );
}
