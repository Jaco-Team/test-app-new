'use client';

import type { ReactNode } from 'react';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import {
  createMuiControlSx,
  getMuiControlClassName,
  mergeTextFieldSlotProps,
  type MuiControlLayout,
  type MuiControlRange,
  type MuiControlSurface,
} from '../internal/muiControl/shared';

export type MuiTextFieldProps = Omit<TextFieldProps, 'variant'> & {
  range?: MuiControlRange;
  surface?: MuiControlSurface;
  layout?: MuiControlLayout;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
};

export function MuiTextField({
  range = 'responsive',
  surface = 'plain',
  layout = 'default',
  startAdornment,
  endAdornment,
  className,
  multiline = false,
  slotProps,
  sx,
  ...props
}: MuiTextFieldProps) {
  return (
    <TextField
      {...props}
      className={getMuiControlClassName(range, className, {
        multiline,
        layout,
        surface,
      })}
      multiline={multiline}
      variant="outlined"
      fullWidth
      slotProps={mergeTextFieldSlotProps(
        slotProps,
        startAdornment,
        endAdornment
      )}
      sx={[createMuiControlSx(), ...(Array.isArray(sx) ? sx : [sx])]}
    />
  );
}
