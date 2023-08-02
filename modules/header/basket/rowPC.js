import { memo } from 'react';

import Image from 'next/image';

import { useCartStore } from '@/components/store.js';

export default memo(function RowPC({ item, count, last }) {
  //('render Basket RowPC');

  const [minus, plus, promoInfo] = useCartStore((state) => [state.minus, state.plus, state.promoInfo]);

  return (
    <tr style={{ borderBottom: last ? 'none' : '0.072202166064982vw solid rgba(0, 0, 0, 0.1)'}}>
      <td className="CellPic">
        <Image alt={item?.name} src={'https://cdnimg.jacofood.ru/' + item?.img_app + '_584x584.jpg'} width={584} height={584} priority={true}/>
      </td>
      <td className="CellName">

        <span className="spanName">{item?.name}</span>
        <div>

        <span className={promoInfo?.status_promo && (item?.new_one_price || item?.disabled) ? 'spanCount promoInfo' : 'spanCount'}>
          {new Intl.NumberFormat('ru-RU').format(parseInt(item?.one_price) * parseInt(count))}{' '}₽
        </span>

        {promoInfo?.status_promo && (item?.new_one_price || item?.disabled) ?
        <span className="spanPromo">
          {item?.disabled ? 'В подарок за ' : null}{new Intl.NumberFormat('ru-RU').format(item?.all_price)}{' '}₽
        </span>
        : null}

        </div>

      </td>
      <td className="CellButton">
        <button className="minus" style={{ backgroundColor: item?.disabled ? '#fff' : 'rgba(0, 0, 0, 0.07)', color: item?.disabled ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.8)'}} onClick={() => minus(item?.item_id)} disabled={item?.disabled ? true : false}>–</button>
        <span>{count}</span>
        <button className="plus" style={{ backgroundColor: item?.disabled || count > 98 ? '#fff' : 'rgba(0, 0, 0, 0.07)', color: item?.disabled || count > 98 ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.8)'}} onClick={() => plus(item?.item_id)} disabled={item?.disabled || count > 98 ? true : false}>+</button>
      </td>
    </tr>
  );
  
})
