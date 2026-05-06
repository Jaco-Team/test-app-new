import { HeaderPC } from '../HeaderPC/HeaderPC';
import { PromokodyPC } from '../PromokodyPC/PromokodyPC';
import { BreadСrumbsPC } from '../BreadСrumbsPC/BreadСrumbsPC';
import { FooterPC } from '../FooterPC/FooterPC';

import PropTypes from 'prop-types';
import './PromokodyPagePC.scss';

export const PromokodyPagePC = ({ header, promokod, footer, data }) => {
  const arrayPromokod = Array.from(Array(8).keys()).fill(promokod);

  return (
    <>
      <HeaderPC {...header} />
      <div className="promokodyPC">
        <div className="promokodyContainerPC">
          <div className="header">Мои промокоды</div>
          <div className="promoListPC">
            {arrayPromokod.map((item, key) => (
              <PromokodyPC key={key} {...item} />
            ))}
          </div>
        </div>
        <div>
          <BreadСrumbsPC {...data} />
        </div>
      </div>
      <FooterPC {...footer} />
    </>
  );
};

PromokodyPagePC.propTypes = {
  header: PropTypes.object,
  orders: PropTypes.object,
  data: PropTypes.object,
  footer: PropTypes.object,
};
