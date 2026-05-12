import { ItemHomePc } from '@stories/entities/product/ui/product-card/ItemHomePc';

import './BoxItemHomePC.scss';

export const BoxItemHomePC = ({ cardItem }: Record<string, any>) => {
  const arrayCard = Array.from({ length: 16 }, () => cardItem);

  return (
    <div className="containerItemHomePC">
      {arrayCard.map((item, key) => (
        <ItemHomePc key={key} {...item} />
      ))}
    </div>
  );
};

