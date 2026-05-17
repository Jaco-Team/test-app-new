import Link from 'next/link';
import { ModalItemPCset } from '@stories/entities/product/ui/set-item/ModalItemPCset';
import { ModalItemValue } from '@stories/entities/product/ui/nutrition/ModalItemValue';
import './ModalItemPClist.scss';

export const ModalItemPClist = ({
  set,
  type,
  value,
  link_allergens,
}: Record<string, any>) => {
  const arrayItem = Array.from({ length: 8 }, () =>
    type === 'set' ? set : value
  );

  return (
    <div className="table">
      <div className="title">
        {type === 'set'
          ? `Сет состоит из ${arrayItem.length} роллов:`
          : 'Таблица пищевой ценности (на 100 г):'}
      </div>

      <div
        className="list"
        style={{
          paddingLeft:
            type === 'set' ? '3.2490974729242vw' : '1.8050541516245vw',
        }}
      >
        {type === 'set' ? null : (
          <span className="valueTitle">
            Полное описание состава блюд, калорийности и возможных аллергенов
            можно{' '}
            <Link href={link_allergens} target="_blank">
              скачать в формате PDF
            </Link>
          </span>
        )}
        {arrayItem.map((item, key) => (
          <>
            {type === 'set' ? (
              <ModalItemPCset key={key} {...item} number={key + 1} />
            ) : (
              <ModalItemValue key={key} {...item} number={key + 1} />
            )}
          </>
        ))}
      </div>
    </div>
  );
};
