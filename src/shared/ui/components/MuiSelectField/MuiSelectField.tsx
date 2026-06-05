'use client';

import type { ReactNode } from 'react';
import MenuItem from '@mui/material/MenuItem';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import { cn } from '../../foundation/classNames';
import {
  createMuiControlSx,
  getMuiControlClassName,
  mergeTextFieldSlotProps,
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
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
};

export function MuiSelectField({
  options,
  range = 'regular',
  surface = 'plain',
  startAdornment,
  endAdornment,
  className,
  slotProps,
  sx,
  ...props
}: MuiSelectFieldProps) {
  const selectSlot = (slotProps?.select ?? {}) as {
    MenuProps?: {
      slotProps?: {
        paper?: { className?: string };
        list?: { className?: string };
      };
    };
  };
  const menuProps = selectSlot.MenuProps ?? {};
  const menuSlotProps = menuProps.slotProps ?? {};

  return (
    <TextField
      {...props}
      className={getMuiControlClassName(range, className, { surface })}
      variant="outlined"
      fullWidth
      select
      slotProps={{
        ...mergeTextFieldSlotProps(slotProps, startAdornment, endAdornment),
        select: {
          ...selectSlot,
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
