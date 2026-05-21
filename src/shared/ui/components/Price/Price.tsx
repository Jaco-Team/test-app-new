import type { HTMLAttributes } from 'react';
import { cn } from '../../foundation/classNames';
import './Price.scss';

export type PriceSize = 'sm' | 'md' | 'lg';
export interface PriceProps extends HTMLAttributes<HTMLSpanElement> {
  value: number;
  oldValue?: number;
  size?: PriceSize;
  suffix?: string;
}

const formatPrice = (value: number, suffix: string) =>
  new Intl.NumberFormat('ru-RU').format(value) + ' ' + suffix;

export function Price({
  value,
  oldValue,
  size = 'md',
  suffix = '₽',
  className,
  ...props
}: PriceProps) {
  return (
    <span
      className={cn('ui-price', 'ui-price--size-' + size, className)}
      {...props}
    >
      <span className="ui-price__current">{formatPrice(value, suffix)}</span>
      {oldValue ? (
        <span className="ui-price__old">{formatPrice(oldValue, suffix)}</span>
      ) : null}
    </span>
  );
}
