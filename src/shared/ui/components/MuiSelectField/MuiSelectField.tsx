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
  InputProps,
  SelectProps,
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
      InputProps={{
        ...InputProps,
        startAdornment:
          InputProps?.startAdornment ?? createStartAdornment(startAdornment),
      }}
      SelectProps={{
        ...SelectProps,
        MenuProps: {
          ...SelectProps?.MenuProps,
          slotProps: {
            ...SelectProps?.MenuProps?.slotProps,
            paper: {
              ...SelectProps?.MenuProps?.slotProps?.paper,
              className: 'ui-mui-field__paper',
            },
            list: {
              ...SelectProps?.MenuProps?.slotProps?.list,
              className: 'ui-mui-field__listbox',
            },
          },
        },
      }}
      slotProps={{
        ...slotProps,
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
