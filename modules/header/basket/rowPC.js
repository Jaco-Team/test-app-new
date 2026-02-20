import { memo, useState } from 'react';

//import Image from 'next/image';

import { useCartStore, useCitiesStore, useHomeStore } from '@/components/store.js';

import { useLongPress } from "use-long-press";

import { reachGoalSplit } from '@/utils/metrika';

function findById(array, targetId) {
  for (const item of array) {
    // Сначала проверяем сам объект
    if (parseInt(item.id) === parseInt(targetId)) {
      return item['name'];
    }

    // Если у объекта есть поле category — спускаемся рекурсивно
    if (Array.isArray(item.cats)) {
      const found = findById(item.cats, targetId);
      if (found) {
        return found;
      }
    }
  }
  // Если ничего не найдено, возвращаем null
  return '';
}

export default memo(function RowPC({ item, count, last }) {
  const [click, setClick] = useState(true);

  const [minus, plus, promoInfo] = useCartStore((state) => [state.minus, state.plus, state.promoInfo]);
  const [ thisCityRu ] = useCitiesStore( state => [state.thisCityRu]);

  const [ category ] = useHomeStore((state) => [state.category]);
  
  const cat_name = findById(category, item?.cat_id);

  const metrica_param = {
    city: thisCityRu, 
    tovar: item.name, 
    category: cat_name,
    platform: 'pc',
    view: 'Боковое окно'
  };

  const metrica_param_min = {
    city: thisCityRu, 
    tovar: item.name, 
    category: cat_name,
  };

  const handleClick = (e) => {
    e.preventDefault();

    if(click) {
      minus(item?.item_id); 
      reachGoalSplit('remove_from_cart', metrica_param, metrica_param_min);

      ymDataLayer.push({
        "ecommerce": {
          "currencyCode": "RUB",
          "remove": {
            "products": [
              {
                "id": item?.item_id,
                "name": item.name,
                "category": cat_name,
                "quantity": 1,
                //"list": "Аксессуары",
                "position": 1
              }
            ]
          }
        }
      });

      try{
        // roistat.event.send('remove_from_cart');
      } catch(e){ console.log(e) }
    }
  };

  const bind = useLongPress(() => {

    setClick(false);
    
    minus(item?.item_id, 'zero'); 
    reachGoalSplit('remove_from_cart', metrica_param, metrica_param_min);

    ymDataLayer.push({
      "ecommerce": {
        "currencyCode": "RUB",
        "remove": {
          "products": [
            {
              "id": item?.item_id,
              "name": item.name,
              "category": cat_name,
              "quantity": count,
              //"list": "Аксессуары",
              "position": 1
            }
          ]
        }
      }
    });

    setTimeout(() => {
      setClick(true);
    }, 300)

    try{
      // roistat.event.send('remove_from_cart', {
      //   id: item?.item_id,
      //   name: item?.name,
      //   price: item?.one_price,
      //   quantity: count,
      //   category: {
      //     "level1": cat_name,
      //   },
      // });
    } catch(e){ console.log(e) }
  });

  const add_to_cart = () => {

    plus(item?.item_id); 
    reachGoalSplit('add_to_cart', metrica_param, metrica_param_min);

    ymDataLayer.push({
      "ecommerce": {
        "currencyCode": "RUB",    
        "add": {
          "products": [
            {
              "id": item?.item_id,
              "name": item.name,
              "price": item?.one_price,
              //"brand": "Яндекс / Яndex",
              "category": cat_name,
              "quantity": 1,
              //"list": "Выдача категории",
              "position": 1
            }
          ]
        }
      }
    });

    try{
      // roistat.event.send('add_to_cart', {
      //   id: item?.item_id,
      //   name: item?.name,
      //   price: item?.one_price,
      //   quantity: 1,
      //   category: {
      //     "level1": cat_name,
      //   },
      // });
    } catch(e){ console.log(e) }
  }

//<Image alt={item?.name} src={'https://cdnimg.jacofood.ru/' + item?.img_app + '_584x584.jpg'} width={584} height={584} priority={true}/>
  return (
    <tr style={{ borderBottom: last ? 'none' : '0.072202166064982vw solid rgba(0, 0, 0, 0.1)'}}>
      <td className="CellPic">
        {/* <Image alt={item?.name} src={ process.env.NEXT_PUBLIC_YANDEX_IMG + item?.img_app + '_584x584.jpg'} width={584} height={584} priority={true}/> */}
         <img 
          alt={item?.name} 
          title={item?.name} 
          src={`${process.env.NEXT_PUBLIC_YANDEX_IMG}${item.img_app}_584x584.jpg`} 
          loading="lazy"
        />
      </td>
      <td className="CellName">

        <span className="spanName">{item?.name}</span>

        <div>

          <span className={promoInfo?.status_promo && (item?.new_one_price || item?.disabled) ? 'spanCount promoInfo' : 'spanCount'}>
            {new Intl.NumberFormat('ru-RU').format(parseInt(item?.one_price) * parseInt(count))}{' '}₽
          </span>

          {
            promoInfo?.status_promo && (item?.new_one_price || item?.disabled) ?
              <span className="spanPromo">
                {item?.disabled ? 'По акции за ' : null}{new Intl.NumberFormat('ru-RU').format(item?.all_price)}{' '}₽
              </span>
              : 
            null
          }

        </div>

      </td>
      <td className="CellButton">
        <button 
          className="minus" 
          style={{ backgroundColor: item?.disabled ? '#fff' : 'rgba(0, 0, 0, 0.05)', color: item?.disabled ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.8)'}} 
          onClick={(e) => handleClick(e)} 
          disabled={item?.disabled ? true : false}
          {...bind()}
        >
          –
        </button>
        <span>{count}</span>
        <button className="plus" style={{ backgroundColor: item?.disabled || count > 98 ? '#fff' : 'rgba(0, 0, 0, 0.05)', color: item?.disabled || count > 98 ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.8)'}} onClick={add_to_cart} disabled={item?.disabled || count > 98 ? true : false}>+</button>
      </td>
    </tr>
  );
  
})
