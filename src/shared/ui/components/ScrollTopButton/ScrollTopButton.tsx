import type { ButtonHTMLAttributes } from 'react';
import { ArrowUp } from '../../icons';
import { cn } from '../../foundation/classNames';
import './ScrollTopButton.scss';
export type ScrollTopButtonProps = {
  visible?: boolean;
  label?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;
export function ScrollTopButton({
  visible = false,
  label = 'Наверх',
  className,
  type = 'button',
  ...props
}: ScrollTopButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        'ui-scroll-top',
        visible && 'ui-scroll-top--visible',
        className
      )}
      {...props}
    >
      <ArrowUp />
    </button>
  );
}
