import { memo } from 'react';

import Image from 'next/image';

import { useCartStore } from '@/components/store.js';
import { shallow } from 'zustand/shallow';

export default memo(function RowPC({ item, count, last }) {
  console.log('render Basket RowPC');

  const [minus, plus] = useCartStore((state) => [state.minus, state.plus], shallow);

  return (
    <tr style={{ borderBottom: last ? 'none' : '0.072202166064982vw solid rgba(0, 0, 0, 0.1)'}}>
      <td className="CellPic">
        <Image alt={item?.name} src={'https://cdnimg.jacofood.ru/' + item?.img_app + '_584x584.jpg'} width={584} height={584} priority={true}/>
      </td>
      <td className="CellName">
        <span className="spanName">{item?.name}</span>
        <span className="spanCount">{new Intl.NumberFormat('ru-RU').format(parseInt(item?.price) * parseInt(count))}{' '}₽
        </span>
      </td>
      <td className="CellButton">
        <button className="minus" onClick={() => minus(item?.id)}>–</button>
        <span>{count}</span>
        <button className="plus" onClick={() => plus(item?.id)}>+</button>
      </td>
    </tr>
  );
});
