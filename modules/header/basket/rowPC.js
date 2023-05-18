import { memo } from 'react';

import Image from 'next/image';
import ButtonGroup from '@mui/material/ButtonGroup';

export default memo(function RowPC({ item, count, plus, minus }) {
  console.log('render Basket RowPC');

  return (
    <tr>
      <td className="CellPic">
        <Image alt={item?.name} src={'https://cdnimg.jacofood.ru/' + item?.img_app + '_584x584.jpg'} width={584} height={584} priority={true}/>
      </td>
      <td className="TableMiniName CellName">
        <span>{item?.name}</span>
      </td>
      <td className="CellButton">
        <div className="MiniActionsCartButton">
          <button className="minus" onClick={() => minus(item?.id)}>–</button>
          <span>{count}</span>
          <button className="plus" onClick={() => plus(item?.id)}>+</button>
        </div>
      </td>
      <td className="CellPrice">
        <div className="TableMiniPrice">
          {new Intl.NumberFormat('ru-RU').format(parseInt(item?.price) * parseInt(count))}{' '}₽
        </div>
      </td>
    </tr>
  );
}, arePropsEqual);

function arePropsEqual(oldProps, newProps) {
  return oldProps.count === newProps.count;
}
