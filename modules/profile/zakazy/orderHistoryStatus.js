import Button from '@mui/material/Button';
import { useProfileStore, useHeaderStoreNew } from '@/components/store';

export default function OrderHistoryStatus({ city, this_module }) {
  const [state, error, list, load] = useProfileStore((store) => [store.orderListState, store.orderListError, store.orderList, store.getOrderList]);
  const token = useHeaderStoreNew((store) => store.token);
  if (state === 'idle') return null;
  return (
    <div aria-live="polite" role={state === 'error' ? 'alert' : 'status'} style={{ fontSize: 14, lineHeight: 1.45, padding: '12px 0', overflowWrap: 'anywhere' }}>
      {state === 'loading' && !list.length ? 'Загружаем заказы…' : null}
      {state === 'error' ? <>{error} <Button sx={{ fontSize: 14, minHeight: 40 }} onClick={() => { void load(this_module, city, token, { force: true }); }}>Повторить</Button></> : null}
      {state === 'ready' && !list.length ? 'У вас пока нет оформленных заказов.' : null}
    </div>
  );
}
