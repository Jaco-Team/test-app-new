import { ItemHomePc } from '../ItemHomePc/ItemHomePc';

import PropTypes from 'prop-types';
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

BoxItemHomePC.propTypes = {
  cardItem: PropTypes.object,
};
