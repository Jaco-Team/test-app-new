import { HeaderPC } from '../../widgets/Header/HeaderPC';
import { TableOrdersPC } from '../TableOrdersPC/TableOrdersPC';
import { BreadСrumbsPC } from '../BreadСrumbsPC/BreadСrumbsPC';
import { FooterPC } from '../../widgets/Footer/Footer';

import PropTypes from 'prop-types';
import './ZakazyPagePC.scss';

export const ZakazyPagePC = ({ header, orders, footer, data }) => {
  return (
    <>
      <HeaderPC {...header} />
      <div className="zakazyPC">
        <div className="zakazyTablePC">
          <div className="title">История заказов</div>
          <TableOrdersPC {...orders} />
        </div>
        <div>
          <BreadСrumbsPC {...data} />
        </div>
      </div>
      <FooterPC {...footer} />
    </>
  );
};

ZakazyPagePC.propTypes = {
  header: PropTypes.object,
  orders: PropTypes.object,
  data: PropTypes.object,
  footer: PropTypes.object,
};
