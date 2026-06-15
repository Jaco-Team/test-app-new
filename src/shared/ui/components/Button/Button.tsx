import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../foundation/classNames';
import './Button.scss';

export type ButtonTone = 'primary' | 'secondary' | 'neutral' | 'muted' | 'cart';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonRange = 'compact' | 'regular' | 'expanded' | 'responsive';
export type ButtonDensity = ButtonRange;

export type ButtonProps = {
  children: ReactNode;
  tone?: ButtonTone;
  size?: ButtonSize;
  range?: ButtonRange;
  density?: ButtonDensity;
  active?: boolean;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  tone = 'primary',
  size = 'md',
  range,
  density,
  active = false,
  fullWidth = false,
  leadingIcon,
  trailingIcon,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  const resolvedRange = range ?? density ?? 'responsive';

  return (
    <button
      type={type}
      className={cn(
        'ui-button',
        'ui-button--tone-' + (tone === 'secondary' ? 'primary' : tone),
        'ui-button--size-' + size,
        'ui-button--range-' + resolvedRange,
        active && 'ui-button--active',
        fullWidth && 'ui-button--full',
        className
      )}
      {...props}
    >
      {leadingIcon ? (
        <span className="ui-button__icon">{leadingIcon}</span>
      ) : null}
      <span className="ui-button__label">{children}</span>
      {trailingIcon ? (
        <span className="ui-button__icon">{trailingIcon}</span>
      ) : null}
    </button>
  );
}
