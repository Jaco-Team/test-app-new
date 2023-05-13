import { memo } from 'react';

import Image from 'next/image';
import ButtonGroup from '@mui/material/ButtonGroup';

export default memo(function RowPC({ item, count, plus, minus }) {
  console.log('render Basket RowPC');

  return (
    <tr>
      <td className="CellPic">
        <Image alt={item?.name} src={'https://cdnimg.jacofood.ru/' + item?.img_app + '_1420x1420.jpg'} width={1420} height={1420} priority={true}/>
      </td>
      <td className="TableMiniName CellName">
        <span style={{ height: 40, width: '100%', display: 'flex', alignItems: 'center' }}>{item?.name}</span>
      </td>
      <td className="CellButton">
        <ButtonGroup disableElevation={true} disableRipple={true} variant="contained" className="MiniActionsCartButton">
          <div variant="contained">
            <button className="minus" onClick={() => minus(item?.id)}>–</button>
            <span>{count}</span>
            <button className="plus" onClick={() => plus(item?.id)}>+</button>
          </div>
        </ButtonGroup>
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
