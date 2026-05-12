import { ItemHome } from '@stories/entities/product/ui/product-card/ItemHome';

import './BoxItemHome.scss';

export const BoxItemHome = ({ cards }: Record<string, any>) => {
  return (
    <div className="containerItemHomePC">
      {cards.map((item, key) => (
        <ItemHome key={key} {...item} />
      ))}
    </div>
  );
};
