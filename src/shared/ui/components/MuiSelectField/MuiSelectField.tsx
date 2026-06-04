'use client';

import type { ReactNode } from 'react';
import MenuItem from '@mui/material/MenuItem';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import {
  createMuiControlSx,
  createStartAdornment,
  getMuiControlClassName,
  type MuiControlRange,
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
  startAdornment?: ReactNode;
};

export function MuiSelectField({
  options,
  range = 'regular',
  startAdornment,
  className,
  slotProps,
  sx,
  ...props
}: MuiSelectFieldProps) {
  return (
    <TextField
      {...props}
      className={getMuiControlClassName(range, className)}
      variant="outlined"
      fullWidth
      select
      slotProps={{
        ...slotProps,
        input: {
          ...slotProps?.input,
          startAdornment:
            slotProps?.input?.startAdornment ??
            createStartAdornment(startAdornment),
        },
        select: {
          ...slotProps?.select,
          MenuProps: {
            ...slotProps?.select?.MenuProps,
            slotProps: {
              ...slotProps?.select?.MenuProps?.slotProps,
              paper: {
                ...slotProps?.select?.MenuProps?.slotProps?.paper,
                className: 'ui-mui-field__paper',
              },
              list: {
                ...slotProps?.select?.MenuProps?.slotProps?.list,
                className: 'ui-mui-field__listbox',
              },
            },
          },
        },
      }}
      sx={[createMuiControlSx(false), ...(Array.isArray(sx) ? sx : [sx])]}
    >
      {options.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          className="ui-mui-field__option"
        >
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
