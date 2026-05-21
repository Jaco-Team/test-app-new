import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../foundation/classNames';
import './QuantityControl.scss';

export type QuantityControlSize = 'sm' | 'md' | 'lg';
export interface QuantityControlProps extends Omit<
  ButtonHTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  value: number;
  min?: number;
  max?: number;
  size?: QuantityControlSize;
  disabled?: boolean;
  onChange?: (value: number) => void;
}

export function QuantityControl({
  value,
  min = 0,
  max = 99,
  size = 'md',
  disabled = false,
  onChange,
  className,
  ...props
}: QuantityControlProps) {
  const next = (delta: number) =>
    onChange?.(Math.max(min, Math.min(max, value + delta)));
  return (
    <div
      className={cn(
        'ui-quantity-control',
        'ui-quantity-control--size-' + size,
        disabled && 'ui-quantity-control--disabled',
        className
      )}
      role="group"
      aria-label="Количество"
      {...props}
    >
      <button
        type="button"
        aria-label="Уменьшить"
        disabled={disabled || value <= min}
        onClick={() => next(-1)}
      >
        –
      </button>
      <span>{value}</span>
      <button
        type="button"
        aria-label="Увеличить"
        disabled={disabled || value >= max}
        onClick={() => next(1)}
      >
        +
      </button>
    </div>
  );
}
