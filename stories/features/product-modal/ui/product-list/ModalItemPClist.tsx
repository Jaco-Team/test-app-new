// @ts-nocheck
import Link from 'next/link';
import { ModalItemPCset } from '../../../../entities/product/ui/set-item/ModalItemPCset';
import { ModalItemPCvalue } from '../../../../entities/product/ui/nutrition/ModalItemPCvalue';
import './ModalItemPClist.scss';

export const ModalItemPClist = ({ set, type, value, link_allergens }) => {
  const arrayItem = Array.from(Array(8).keys()).fill(type === 'set' ? set : value);

  return (
    <div className="table">
      <div className="title">{type === 'set' ? `Сет состоит из ${arrayItem.length} роллов:` : 'Таблица пищевой ценности (на 100 г):'}</div>

      <div className="list" style={{ paddingLeft: type === 'set' ? '3.2490974729242vw' : '1.8050541516245vw' }}>
        {type === 'set' ? null : <span className="valueTitle">Полное описание состава блюд, калорийности и возможных аллергенов можно{' '}<Link href={link_allergens} target="_blank">скачать в формате PDF</Link></span>}
        {arrayItem.map((item, key) => <>{type === 'set' ? <ModalItemPCset key={key} {...item} number={key + 1} /> : <ModalItemPCvalue key={key} {...item} number={key + 1} />}</>)}
      </div>
    </div>
  );
};

