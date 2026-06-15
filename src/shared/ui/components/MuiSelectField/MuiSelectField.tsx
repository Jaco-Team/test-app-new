'use client';

import type { ReactNode } from 'react';
import MenuItem from '@mui/material/MenuItem';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import { cn } from '../../foundation/classNames';
import {
  createMuiControlSx,
  getMuiControlClassName,
  mergeTextFieldSlotProps,
  type MuiControlLayout,
  type MuiControlRange,
  type MuiControlSurface,
} from '../internal/muiControl/shared';

export type MuiSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type MuiSelectFieldProps = Omit<
  TextFieldProps,
  'variant' | 'select' | 'children'
> & {
  options: MuiSelectOption[];
  range?: MuiControlRange;
  surface?: MuiControlSurface;
  layout?: MuiControlLayout;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  placeholder?: ReactNode;
  placeholderClassName?: string;
};

export function MuiSelectField({
  options,
  range = 'responsive',
  surface = 'plain',
  layout = 'default',
  startAdornment,
  endAdornment,
  placeholder,
  placeholderClassName,
  className,
  slotProps,
  sx,
  ...props
}: MuiSelectFieldProps) {
  const selectSlot = (slotProps?.select ?? {}) as {
    displayEmpty?: boolean;
    MenuProps?: {
      slotProps?: {
        paper?: { className?: string };
        list?: { className?: string };
      };
    };
    renderValue?: (value: unknown) => ReactNode;
  };
  const menuProps = selectSlot.MenuProps ?? {};
  const menuSlotProps = menuProps.slotProps ?? {};
  const hasPlaceholder = placeholder !== undefined;

  function renderSelectedValue(value: unknown) {
    if (typeof selectSlot.renderValue === 'function') {
      return selectSlot.renderValue(value);
    }

    const normalized = String(value ?? '');
    const matched = options.find((option) => option.value === normalized);

    if (matched) {
      return matched.label;
    }

    if (hasPlaceholder && !normalized.length) {
      return (
        <span className={cn('ui-mui-field__placeholder', placeholderClassName)}>
          {placeholder}
        </span>
      );
    }

    return normalized;
  }

  return (
    <TextField
      {...props}
      className={getMuiControlClassName(range, className, {
        layout,
        surface,
      })}
      variant="outlined"
      fullWidth
      select
      slotProps={{
        ...mergeTextFieldSlotProps(slotProps, startAdornment, endAdornment),
        select: {
          ...selectSlot,
          displayEmpty: hasPlaceholder || selectSlot.displayEmpty,
          renderValue: renderSelectedValue,
          MenuProps: {
            ...menuProps,
            slotProps: {
              ...menuSlotProps,
              paper: {
                ...menuSlotProps.paper,
                className: cn(
                  'ui-mui-field__paper',
                  'ui-mui-field__paper--range-' + range,
                  menuSlotProps.paper?.className
                ),
              },
              list: {
                ...menuSlotProps.list,
                className: cn(
                  'ui-mui-field__listbox',
                  'ui-mui-field__listbox--range-' + range,
                  menuSlotProps.list?.className
                ),
              },
            },
          },
        },
      }}
      sx={[createMuiControlSx(), ...(Array.isArray(sx) ? sx : [sx])]}
    >
      {options.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          className={cn(
            'ui-mui-field__option',
            'ui-mui-field__option--range-' + range
          )}
        >
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
