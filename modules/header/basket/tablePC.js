import { useState, useEffect } from 'react';

import { useCartStore } from '@/components/store.js';
import { shallow } from 'zustand/shallow';

import RowPC from './rowPC';

export default function TablePC() {
  console.log('render Basket TablePC');

  const [allPrice, setAllPrice] = useState(0);
  const [itemsBasket, setItemsBasket] = useState([]);

  const [items] = useCartStore((state) => [state.items], shallow);

  useEffect(() => {
    setItemsBasket(items);
    
    const allPrice = items.reduce((all, it) => all + it.count * it.price, 0);
    
    setAllPrice(allPrice);
  }, [items]);

  return (
    <table className="TableMini">
      <tbody>
        {itemsBasket.map((item, key) => (
          <RowPC key={key} count={item.count} item={item} />
        ))}
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
