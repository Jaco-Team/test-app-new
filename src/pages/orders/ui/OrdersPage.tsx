'use client';

import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useCabinetAccess } from '@src/features/cabinet-access';
import { useOrdersPage } from '../model/useOrdersPage';
import './OrdersPage.scss';

function formatOrderDate(value: unknown): string {
  const text = String(value ?? '').trim();
  if (!text.length) {
    return '';
  }

  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) {
    return text;
  }

  return format(parsed, 'd MMMM yyyy', { locale: ru });
}

function formatOrderSum(value: unknown): string {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return '0 ₽';
  }

  return `${new Intl.NumberFormat('ru-RU').format(amount)} ₽`;
}

function buildOrderStatus(order: {
  is_delete?: number | string;
  status_order_?: number | string;
  type_status?: number | string;
  status_order?: string;
}): { label: string; tone: 'default' | 'success' | 'danger' } {
  if (parseInt(String(order.is_delete ?? 0), 10) === 1) {
    return { label: 'Отменен', tone: 'danger' };
  }

  if (
    parseInt(String(order.status_order_ ?? order.type_status ?? 0), 10) === 6
  ) {
    return {
      label: String(order.status_order ?? 'Готов'),
      tone: 'success',
    };
  }

  return {
    label: String(order.status_order ?? 'Обрабатывается'),
    tone: 'default',
  };
}

export function OrdersPage() {
  const { citySlug, compact, ready, token } = useCabinetAccess();
  const { orderList } = useOrdersPage(citySlug, token);

  if (!ready) {
    return null;
  }

  return (
    <section className="orders-page">
      {orderList.length === 0 ? (
        <div className="orders-page__empty">
          Пока нет заказов. Когда оформите первый заказ, история появится здесь.
        </div>
      ) : compact ? (
        <div className="orders-page__stack">
          {orderList.map((order) => {
            const status = buildOrderStatus(order);
            return (
              <article
                key={`${order.order_id}-${order.point_id ?? 'point'}`}
                className="orders-page__card"
              >
                <div className="orders-page__card-head">
                  <span className="orders-page__number">
                    Заказ №{order.order_id}
                  </span>
                  <span
                    className={
                      'orders-page__status orders-page__status--' + status.tone
                    }
                  >
                    {status.label}
                  </span>
                </div>
                <dl className="orders-page__meta">
                  <div>
                    <dt>Дата</dt>
                    <dd>{formatOrderDate(order.date)}</dd>
                  </div>
                  <div>
                    <dt>Время</dt>
                    <dd>{String(order.time ?? 'Не указано')}</dd>
                  </div>
                  <div>
                    <dt>Сумма</dt>
                    <dd>{formatOrderSum(order.sum)}</dd>
                  </div>
                </dl>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="orders-page__table-wrap">
          <table className="orders-page__table">
            <thead>
              <tr>
                <th>Статус</th>
                <th>Номер</th>
                <th>Дата</th>
                <th>Время</th>
                <th>Сумма</th>
              </tr>
            </thead>
            <tbody>
              {orderList.map((order) => {
                const status = buildOrderStatus(order);
                return (
                  <tr key={`${order.order_id}-${order.point_id ?? 'point'}`}>
                    <td>
                      <span
                        className={
                          'orders-page__status orders-page__status--' +
                          status.tone
                        }
                      >
                        {status.label}
                      </span>
                    </td>
                    <td>{order.order_id}</td>
                    <td>{formatOrderDate(order.date)}</td>
                    <td>{String(order.time ?? 'Не указано')}</td>
                    <td>{formatOrderSum(order.sum)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
