import { TableOrdersPC } from '@stories/widgets/orders/ui/orders-table/TableOrdersPC';
import { BreadCrumbs } from '@stories/shared/ui/breadcrumbs/BreadСrumbs';

import './ZakazyPagePC.scss';

export const ZakazyPagePC = ({
  header,
  orders,
  footer,
  data,
}: Record<string, any>) => {
  return (
    <>
      {header ? null : null}
      <div className="zakazyPC">
        <div className="zakazyTablePC">
          <div className="title">История заказов</div>
          <TableOrdersPC {...orders} />
        </div>
        <div>
          <BreadCrumbs {...data} />
        </div>
      </div>
      {footer ? null : null}
    </>
  );
};
