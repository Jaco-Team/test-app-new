import { useEffect } from 'react';

import Link from 'next/link';

import { useProfileStore, useHeaderStoreNew } from '@/components/store.js';

import Box from '@mui/material/Box';

import OrdersItemMobile from './orderItemMobile';

import ModalOrderMobileDelete from './modalOrderMobileDelete';

import { ArrowLeftMobile } from '@/ui/Icons.js';

export default function OrderMobile({ city, this_module }) {

  const [getOrderList, orderList] = useProfileStore((state) => [state.getOrderList, state.orderList]);

  const [ token ] = useHeaderStoreNew( state => [ state.token ] );

  // === DEBUG: временно размножаем список ===
  // const MOCK_ORDERS = [
  //   { order_id: 111111, status_order_: 2, status_order: 'Готовится', date: '2026-02-13', sum: 11161, is_delete: 0, point_id: 1 },
  //   { order_id: 222222, status_order_: 2, status_order: 'На кухне',      date: '2026-02-06', sum: 333, is_delete: 0, point_id: 1 },
  //   { order_id: 333333, status_order_: 2, status_order: 'Везем заказ',    date: '2026-01-22', sum: 2102, is_delete: 0, point_id: 1 },
  //     { order_id: 222222, status_order_: 6, status_order: 'Готов',      date: '2026-02-06', sum: 1333, is_delete: 0, point_id: 1 },
  //   { order_id: 333333, status_order_: 2, status_order: 'Отменён',    date: '2026-01-22', sum: 2102, is_delete: 1, point_id: 1 },
  // ];

  // const DEBUG_USE_MOCK = false;
  // const base = DEBUG_USE_MOCK ? MOCK_ORDERS : (orderList ?? []);
  // const ordersToRender = useMemo(() => {
  //   if (!base.length) return [];
  //   const times = 6;
  //   return Array.from({ length: times }, (_, i) =>
  //     base.map((o) => ({ ...o, __debugKey: `${o?.order_id}-${i}` }))
  //   ).flat();
  // }, [base]);
  // =======================================

  useEffect(() => {
    if (token && token?.length > 0) {
      getOrderList(this_module, city, token);
    }
  }, [token, city, this_module]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (token && token?.length > 0) {
        getOrderList(this_module, city, token);
      }
    }, 30 * 1000);

    return () => clearInterval(timer);
  }, [city, token, this_module]);

  return (
    <Box sx={{ display: { xs: 'flex', md: 'flex', lg: 'none' } }} className="ZakazyMobile">
      <div className="zakazyLogin">
        <Link href={'/' + city + '/account'}>
          <ArrowLeftMobile />
        </Link>
        <div className="loginContainer">
            <span>История заказов</span>
          </div>
      </div>
      <div className="zakazyList" style={{ marginBottom: !orderList?.length ? '85.470085470085vw' : null}}>
        <div className="zakazyHead">
          <span>номер</span>
          <span>статус</span>
          <span>дата</span>
          <span>стоимость</span>
        </div>
        {(orderList ?? [])?.map((order, ykey) => (
          <OrdersItemMobile
            key={order.__debugKey ?? `${order?.order_id}-${ykey}`}
            order={order}
            token={token}
            this_module={this_module}
            city={city}
            last={(orderList ?? [])?.length - 1 === ykey ? 'last' : ''}
          />
        ))}
      </div>

      <ModalOrderMobileDelete />

    </Box>
  );
}
