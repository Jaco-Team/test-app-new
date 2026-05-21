import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../foundation/classNames';
import './Switch.scss';
export type SwitchTone = 'brand' | 'neutral';
export type SwitchSize = 'sm' | 'md' | 'lg';
export type SwitchProps = {
  checked?: boolean;
  label?: string;
  tone?: SwitchTone;
  size?: SwitchSize;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'role'>;
export function Switch({
  checked = false,
  label,
  tone = 'brand',
  size = 'md',
  className,
  type = 'button',
  ...props
}: SwitchProps) {
  return (
    <button
      type={type}
      role="switch"
      aria-checked={checked}
      className={cn(
        'ui-switch',
        'ui-switch--tone-' + tone,
        'ui-switch--size-' + size,
        checked && 'ui-switch--checked',
        className
      )}
      {...props}
    >
      <span className="ui-switch__track">
        <span className="ui-switch__thumb" />
      </span>
      {label ? <span className="ui-switch__label">{label}</span> : null}
    </button>
  );
}
