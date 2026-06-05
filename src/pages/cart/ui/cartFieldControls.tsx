'use client';

import type { ReactNode } from 'react';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

export function CartFieldTrigger({
  label,
  icon,
  value,
  valueClassName,
  note,
  placeholder = false,
  onClick,
}: {
  label?: ReactNode;
  icon: ReactNode;
  value: ReactNode;
  valueClassName?: string;
  note?: ReactNode;
  placeholder?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="cart-page__field cart-page__field--action cart-page__field--readonly cart-page__field--stacked"
      type="button"
      onClick={onClick}
    >
      {label ? <span className="cart-page__field-label">{label}</span> : null}
      <span className="cart-page__field-main cart-page__field-main--action">
        <span className="cart-page__field-icon">{icon}</span>
        <span className="cart-page__field-copy">
          <span
            className={
              'cart-page__field-value' +
              (valueClassName ? ' ' + valueClassName : '') +
              (placeholder ? ' cart-page__field-value--placeholder' : '')
            }
          >
            {value}
          </span>
          {note ? <span className="cart-page__field-note">{note}</span> : null}
        </span>
        <span className="cart-page__field-chevron" aria-hidden="true">
          <KeyboardArrowDownRoundedIcon />
        </span>
      </span>
    </button>
  );
}
