import { useCartStore } from '@/components/store.js';
import { shallow } from 'zustand/shallow';

import RowPC from './rowPC';

export default function TablePC() {
  console.log('render Basket TablePC');

  const [items, allPrice] = useCartStore((state) => [state.items, state.allPrice], shallow);

  return (
    <table className="TableMini">
      <tbody>
        {items.map((item, key) => <RowPC key={key} count={item.count} item={item} />)}
      </tbody>
      <tfoot>
        <tr>
          <td>Итого:</td>
          <td>
            <div>{new Intl.NumberFormat('ru-RU').format(allPrice)} ₽</div>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
