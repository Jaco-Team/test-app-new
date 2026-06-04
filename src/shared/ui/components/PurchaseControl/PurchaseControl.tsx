import type { HTMLAttributes } from 'react';
import { cn } from '../../foundation/classNames';
import { Button } from '../Button/Button';
import type { ButtonRange, ButtonSize, ButtonTone } from '../Button/Button';
import { Price } from '../Price/Price';
import type { PriceSize } from '../Price/Price';
import { QuantityControl } from '../QuantityControl/QuantityControl';
import type { QuantityControlSize } from '../QuantityControl/QuantityControl';
import './PurchaseControl.scss';

const quantitySizeByButtonSize: Record<ButtonSize, QuantityControlSize> = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'lg',
};

export interface PurchaseControlProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  count: number;
  price: number;
  oldPrice?: number;
  onAdd?: () => void;
  onQuantityChange?: (value: number) => void;
  tone?: ButtonTone;
  size?: ButtonSize;
  range?: ButtonRange;
  priceSize?: PriceSize;
  disabled?: boolean;
}

export function PurchaseControl({
  count,
  price,
  oldPrice,
  onAdd,
  onQuantityChange,
  tone = 'muted',
  size = 'md',
  range = 'regular',
  priceSize = 'md',
  disabled = false,
  className,
  ...props
}: PurchaseControlProps) {
  const hasCount = count > 0;
  const quantitySize = quantitySizeByButtonSize[size];

  return (
    <div
      className={cn(
        'ui-purchase-control',
        'ui-purchase-control--tone-' + tone,
        hasCount
          ? 'ui-purchase-control--state-quantity'
          : 'ui-purchase-control--state-button',
        disabled && 'ui-purchase-control--disabled',
        className
      )}
      {...props}
    >
      {hasCount ? (
        <QuantityControl
          value={count}
          size={quantitySize}
          disabled={disabled}
          onChange={onQuantityChange}
        />
      ) : (
        <Button
          tone={tone}
          size={size}
          range={range}
          disabled={disabled}
          onClick={onAdd}
        >
          <Price value={price} oldValue={oldPrice} size={priceSize} />
        </Button>
      )}
    </div>
  );
}
