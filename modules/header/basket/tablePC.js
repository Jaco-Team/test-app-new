import { useState } from 'react';

import RowPC from './rowPC';

const items = {
  count: '1',
  id: '83',
  name: 'Картофель фри',
  tmp_desc: 'Картофель, соль',
  marc_desc: '',
  marc_desc_full: '',
  size_pizza: '0',
  count_part: '1',
  weight: '100',
  price: '99',
  link: 'Kartofel_fri',
  type: '1',
  img_new: 'Kartofel_fri',
  img_app: 'Kartofel_fri',
  img_new_update: '2022_08_15_12_41_35',
  cat_id: '5',
  protein: '1,5',
  fat: '27,0',
  carbohydrates: '13,1',
  kkal: '298',
  is_new: '0',
  is_hit: '0',
  items: [
    {
      name: 'Картофель фри',
      tmp_desc: 'Картофель, соль',
      protein: '1,5',
      fat: '27,0',
      carbohydrates: '13,1',
      kkal: '298',
    },
  ],
  info_weight: '100 г',
  info_weight_dop: '100 г',
};

const items2 = {
  count: '2',
  id: '84',
  name: 'Картофель фри',
  tmp_desc: 'Картофель, соль',
  marc_desc: '',
  marc_desc_full: '',
  size_pizza: '0',
  count_part: '1',
  weight: '100',
  price: '99',
  link: 'Kartofel_fri',
  type: '1',
  img_new: 'Kartofel_fri',
  img_app: 'Kartofel_fri',
  img_new_update: '2022_08_15_12_41_35',
  cat_id: '5',
  protein: '1,5',
  fat: '27,0',
  carbohydrates: '13,1',
  kkal: '298',
  is_new: '0',
  is_hit: '0',
  items: [
    {
      name: 'Картофель фри',
      tmp_desc: 'Картофель, соль',
      protein: '1,5',
      fat: '27,0',
      carbohydrates: '13,1',
      kkal: '298',
    },
  ],
  info_weight: '100 г',
  info_weight_dop: '100 г',
};

const items3 = {
  count: '3',
  id: '85',
  name: 'Калифорния с креветкой запечённый унаги',
  tmp_desc: 'Картофель, соль',
  marc_desc: '',
  marc_desc_full: '',
  size_pizza: '0',
  count_part: '1',
  weight: '100',
  price: '99',
  link: 'Kartofel_fri',
  type: '1',
  img_new: 'Kartofel_fri',
  img_app: 'Kartofel_fri',
  img_new_update: '2022_08_15_12_41_35',
  cat_id: '5',
  protein: '1,5',
  fat: '27,0',
  carbohydrates: '13,1',
  kkal: '298',
  is_new: '0',
  is_hit: '0',
  items: [
    {
      name: 'Картофель фри',
      tmp_desc: 'Картофель, соль',
      protein: '1,5',
      fat: '27,0',
      carbohydrates: '13,1',
      kkal: '298',
    },
  ],
  info_weight: '100 г',
  info_weight_dop: '100 г',
};

const cartItems = [items, items2, items3];

export default function TablePC() {
  console.log('render Basket TablePC');

  const [items, setItems] = useState(cartItems);
  const [allPrice, setAllPrice] = useState(items.reduce((all, it) => all + it.count * it.price, 0));

  const plus = (id) => {
    items.forEach((item) => {
      if (item.id === id) {
        item.count = Number(item.count) + 1;
        setAllPrice((allPrice) => allPrice + Number(item.price));
      }
    });

    setItems(items);
  };

  const minus = (id) => {
    items.forEach((item) => {
      if (item.id === id) {
        item.count = Number(item.count) - 1;
        setAllPrice((allPrice) => allPrice - Number(item.price));
      }
    });

    setItems(items);
  };

  return (
    <table className="TableMini">
      <tbody>
        {items.map((item, key) => <RowPC key={key} count={item.count} item={item} minus={minus} plus={plus}/>)}
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
