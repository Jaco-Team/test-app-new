'use client';

import type { ReactNode } from 'react';
import {
  DatePicker,
  type DatePickerProps,
} from '@mui/x-date-pickers/DatePicker';
import {
  createMuiControlSx,
  createStartAdornment,
  getMuiControlClassName,
  type MuiControlRange,
} from '../internal/muiControl/shared';

export type MuiDatePickerFieldProps<TDate extends Date = Date> = Omit<
  DatePickerProps<TDate>,
  'slots'
> & {
  range?: MuiControlRange;
  className?: string;
  startAdornment?: ReactNode;
};

export function MuiDatePickerField<TDate extends Date = Date>({
  range = 'regular',
  className,
  startAdornment,
  slotProps,
  ...props
}: MuiDatePickerFieldProps<TDate>) {
  return (
    <DatePicker
      {...props}
      slotProps={{
        ...slotProps,
        textField: {
          ...slotProps?.textField,
          className: getMuiControlClassName(range, className),
          fullWidth: true,
          variant: 'outlined',
          sx: createMuiControlSx(false),
          slotProps: {
            ...slotProps?.textField?.slotProps,
            input: {
              ...slotProps?.textField?.slotProps?.input,
              startAdornment:
                slotProps?.textField?.slotProps?.input?.startAdornment ??
                createStartAdornment(startAdornment),
            },
          },
        },
        desktopPaper: {
          ...slotProps?.desktopPaper,
          className: 'ui-mui-field__paper',
        },
        mobilePaper: {
          ...slotProps?.mobilePaper,
          className: 'ui-mui-field__paper',
        },
        popper: {
          ...slotProps?.popper,
          className: 'ui-mui-field__popper',
        },
      }}
    />
  );
}
