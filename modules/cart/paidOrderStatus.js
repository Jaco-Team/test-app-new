import Button from '@mui/material/Button';
import { useCartStore } from '@/components/store';

export default function PaidOrderStatus() {
  const [state, message, pending, retry] = useCartStore((store) => [store.paidConfirmationState, store.paidConfirmationMessage, store.pendingPaidOrder, store.startPaidConfirmation]);
  if (!pending || state === 'idle') return null;
  return (
    <div role="status" aria-live="polite" style={{ fontSize: 14, lineHeight: 1.45, overflowWrap: 'anywhere' }}>
      <div>Заказ №{pending.orderId}. {message}</div>
      {state === 'timeout' && (
        <Button onClick={() => { void retry({ retry: true }); }} sx={{ fontSize: 14, mt: 1, minHeight: 40 }}>
          Проверить ещё раз
        </Button>
      )}
    </div>
  );
}
