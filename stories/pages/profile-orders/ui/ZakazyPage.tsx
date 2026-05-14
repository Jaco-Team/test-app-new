import { TableOrders } from '@stories/widgets/orders/ui/orders-table/TableOrders';
import { BreadCrumbs } from '@stories/shared/ui/breadcrumbs/BreadCrumbs';

import './ZakazyPage.scss';

interface ZakazyPageProps {
  header?: unknown;
  orders: {
    order: {
      order: Record<string, unknown>;
    };
  };
  footer?: unknown;
  data: Record<string, unknown>;
}

export const ZakazyPage = ({
  header,
  orders,
  footer,
  data,
}: ZakazyPageProps) => {
  return (
    <>
      {header ? null : null}
      <div className="zakazyPC">
        <div className="zakazyTablePC">
          <div className="title">История заказов</div>
          <TableOrders {...orders} />
        </div>
        <div>
          <BreadCrumbs {...data} />
        </div>
      </div>
      {footer ? null : null}
    </>
  );
};
