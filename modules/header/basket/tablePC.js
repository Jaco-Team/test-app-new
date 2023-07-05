import { useCartStore } from '@/components/store.js';
import { shallow } from 'zustand/shallow';

import RowPC from './rowPC';

const dopText = {
  text: 'Выберите столько приправ и приборов, сколько необходимо'
}

export default function TablePC() {
  const [items, allPrice, itemsCount] = useCartStore((state) => [state.items, state.allPrice, state.itemsCount], shallow);

  //console.log('TablePC==>', items);

  function getWord(int, array) {
    return (array = array || ['позиция', 'позиции', 'позиций']) && array[(int % 100 > 4 && int % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(int % 10 < 5) ? int % 10 : 5]];
}

  return (
    <table className="TableMini">
      <tbody>
        {items.map((item, key) => <RowPC key={key} count={item.count} item={item} 
        last={item === items.at(-1) ? 'last' : ''}
        />)}
        <tr className='dopText'><td>{dopText.text}</td></tr>
      </tbody>
      <tfoot>
        <tr>
          <td>Итого: {itemsCount} {getWord(itemsCount)}</td>
          <td>
            <div>{new Intl.NumberFormat('ru-RU').format(allPrice)} ₽</div>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
