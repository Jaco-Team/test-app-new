import Button from '@mui/material/Button';

import { useCartStore, useHeaderStore } from '@/components/store';

export default function PromoCardMobile({ item }) {

  const [ getInfoPromo ] = useCartStore( state => [ state.getInfoPromo ] )
  const [setActiveModalAlert] = useHeaderStore((state) => [state.setActiveModalAlert]);

  const activePromo = (item) => {
    setActiveModalAlert(true, 'Промокод активирован', true);
    getInfoPromo(item.promo_name, item.city_id);
  }

  return (
    <div className="promoCardMobile">
      
      <div className="promokodyName">
        <span>{item.promo_action_text}</span>
        <span>{item.promo_text}</span>
        <span style={{ background: 'rgba(233, 71, 35, 0.5)' }}></span>
      </div>

      <span className='dates'>{'Срок действия:'} {item.diff_days_text}</span>
      <Button
        className="promokodyBTN"
        variant={'contained'}
        style={{ backgroundColor: 'rgba(233, 71, 35, 0.5)', border: 'none' }}
        onClick={ () => activePromo(item) }
      >
        <span style={{ textTransform: 'uppercase', color: 'rgba(0, 0, 0, 0.8)' }}>
          {item.promo_name}
        </span>
      </Button>
    </div>
  );
}
