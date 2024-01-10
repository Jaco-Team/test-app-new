import Typography from '@mui/material/Typography';

const arrColor = {
  new: { color: '#EE7900', text: 'новинка' },
  hit: { color: '#AF00DB', text: 'хит' },
  sale: { color: '#DB0021', text: 'скидка' }, 
}

export default function BadgeItem({size, view, type}) {
  
  return (
    <div style={{ position: 'absolute', top: view == 'mobile' ? 0 : 20, left: view == 'mobile' ? -10 : 20, }}>
      <div style={{ width: size == 'small' ? 84 : 114, height: size == 'small' ? 34 : 44, backgroundColor: 'rgba(255, 255, 255, 0.6)', borderRadius: 30 }} />
      <div style={{ width: size == 'small' ? 80 : 110, height: size == 'small' ? 30 : 40, backgroundColor: arrColor[type].color, borderRadius: 30, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 2, left: 2 }}>
          <Typography component="span" style={{ fontFamily: 'Roboto', fontSize: size == 'small' ? '0.75rem' : '1rem', fontWeight: 400, color: '#fff', textTransform: 'uppercase', lineHeight: 1 }}>{arrColor[type].text}</Typography>
      </div>
    </div>
  );

}
