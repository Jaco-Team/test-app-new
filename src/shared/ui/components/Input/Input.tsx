import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../foundation/classNames';
import './Input.scss';

export type InputTone = 'default' | 'error' | 'success';
export type InputDensity = 'compact' | 'regular' | 'expanded';
export type InputProps = {
  label?: string;
  helperText?: string;
  tone?: InputTone;
  density?: InputDensity;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export function Input({
  label,
  helperText,
  tone = 'default',
  density = 'regular',
  startAdornment,
  endAdornment,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;
  return (
    <label
      className={cn(
        'ui-input',
        'ui-input--tone-' + tone,
        'ui-input--density-' + density,
        className
      )}
      htmlFor={inputId}
    >
      {label ? <span className="ui-input__label">{label}</span> : null}
      <span className="ui-input__control">
        {startAdornment ? (
          <span className="ui-input__adornment">{startAdornment}</span>
        ) : null}
        <input id={inputId} className="ui-input__field" {...props} />
        {endAdornment ? (
          <span className="ui-input__adornment">{endAdornment}</span>
        ) : null}
      </span>
      {helperText ? (
        <span className="ui-input__helper">{helperText}</span>
      ) : null}
    </label>
  );
}
