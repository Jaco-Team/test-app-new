// @ts-nocheck
import { ItemHomePc } from '../../../../entities/product/ui/product-card/ItemHomePc';

import './BoxItemHomePC.scss';

export const BoxItemHomePC = ({ cardItem }) => {
  const arrayCard = Array.from(Array(16).keys()).fill(cardItem);

  return (
    <div className="containerItemHomePC">
      {arrayCard.map((item, key) => (
        <ItemHomePc key={key} {...item} />
      ))}
    </div>
  );
};

