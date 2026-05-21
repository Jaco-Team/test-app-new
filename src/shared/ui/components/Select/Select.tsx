import type { ChangeEvent } from 'react';
import { cn } from '../../foundation/classNames';
import './Select.scss';
export type SelectOption = { value: string; label: string };
export type SelectDensity = 'compact' | 'regular' | 'expanded';
export type SelectProps = {
  label?: string;
  value?: string;
  placeholder?: string;
  options: SelectOption[];
  density?: SelectDensity;
  disabled?: boolean;
  helperText?: string;
  onChange?: (value: string, event: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  name?: string;
};
export function Select({
  label,
  value,
  placeholder,
  options,
  density = 'regular',
  disabled = false,
  helperText,
  onChange,
  className,
  name,
}: SelectProps) {
  return (
    <label
      className={cn('ui-select', 'ui-select--density-' + density, className)}
    >
      {label ? <span className="ui-select__label">{label}</span> : null}
      <select
        className="ui-select__control"
        name={name}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.value, event)}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helperText ? (
        <span className="ui-select__helper">{helperText}</span>
      ) : null}
    </label>
  );
}
