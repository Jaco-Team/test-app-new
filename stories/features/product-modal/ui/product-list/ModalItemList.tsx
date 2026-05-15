import Link from 'next/link';
import { ModalItemSet } from '@stories/entities/product/ui/set-item/ModalItemSet';
import { ModalItemValue } from '@stories/entities/product/ui/nutrition/ModalItemValue';
import './ModalItemList.scss';

const toList = (items: unknown) => {
  if (Array.isArray(items)) {
    return items;
  }

  if (items && typeof items === 'object' && Object.keys(items).length > 0) {
    return [items];
  }

  return [];
};

export const ModalItemList = ({
  set,
  type,
  value,
  link_allergens,
}: Record<string, any>) => {
  const arrayItem = type === 'set' ? toList(set) : toList(value);

  return (
    <div className="table">
      <div className="title">
        {type === 'set'
          ? `Сет состоит из ${arrayItem.length} роллов:`
          : 'Таблица пищевой ценности (на 100 г):'}
      </div>

      <div className="list">
        {type === 'set' ? null : (
          <span className="valueTitle">
            Полное описание состава блюд, калорийности и возможных аллергенов
            можно{' '}
            <Link href={link_allergens} target="_blank">
              скачать в формате PDF
            </Link>
          </span>
        )}
        {arrayItem.map((item, key) =>
          type === 'set' ? (
            <ModalItemSet key={item.id ?? key} {...item} number={key + 1} />
          ) : (
            <ModalItemValue key={item.id ?? key} {...item} number={key + 1} />
          )
        )}
      </div>
    </div>
  );
};
