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
      slotProps={{
        ...slotProps,
        input: {
          ...slotProps?.input,
          startAdornment:
            slotProps?.input?.startAdornment ??
            createStartAdornment(startAdornment),
        },
      }}
      sx={[createMuiControlSx(multiline), ...(Array.isArray(sx) ? sx : [sx])]}
    />
  );
}
