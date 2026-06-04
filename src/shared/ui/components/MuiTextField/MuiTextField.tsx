'use client';

import type { ReactNode } from 'react';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import {
  createMuiControlSx,
  createStartAdornment,
  getMuiControlClassName,
  type MuiControlRange,
} from '../internal/muiControl/shared';

export type MuiTextFieldProps = Omit<TextFieldProps, 'variant'> & {
  range?: MuiControlRange;
  startAdornment?: ReactNode;
};

export function MuiTextField({
  range = 'regular',
  startAdornment,
  className,
  multiline = false,
  InputProps,
  slotProps,
  sx,
  ...props
}: MuiTextFieldProps) {
  return (
    <TextField
      {...props}
      className={getMuiControlClassName(range, className, multiline)}
      multiline={multiline}
      variant="outlined"
      fullWidth
      InputProps={{
        ...InputProps,
        startAdornment:
          InputProps?.startAdornment ?? createStartAdornment(startAdornment),
      }}
      slotProps={slotProps}
      sx={[createMuiControlSx(multiline), ...(Array.isArray(sx) ? sx : [sx])]}
    />
  );
}
