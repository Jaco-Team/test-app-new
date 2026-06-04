'use client';

import type { ReactNode } from 'react';
import {
  DatePicker,
  type DatePickerProps,
} from '@mui/x-date-pickers/DatePicker';
import type { TextFieldProps } from '@mui/material/TextField';
import {
  createMuiControlSx,
  getMuiControlClassName,
  mergeTextFieldSlotProps,
  type MuiControlRange,
  type MuiControlSurface,
} from '../internal/muiControl/shared';

export type MuiDatePickerFieldProps<TDate extends Date = Date> = Omit<
  DatePickerProps<TDate>,
  'slots'
> & {
  range?: MuiControlRange;
  surface?: MuiControlSurface;
  className?: string;
  startAdornment?: ReactNode;
};

export function MuiDatePickerField<TDate extends Date = Date>({
  range = 'regular',
  surface = 'plain',
  className,
  startAdornment,
  slotProps,
  ...props
}: MuiDatePickerFieldProps<TDate>) {
  const textFieldSlotProps = (slotProps?.textField ?? {}) as TextFieldProps;
  const textFieldSlotPropsNested = textFieldSlotProps.slotProps ?? {};

  return (
    <DatePicker
      {...props}
      slotProps={
        {
          ...slotProps,
          textField: {
            ...textFieldSlotProps,
            className: getMuiControlClassName(range, className, { surface }),
            fullWidth: true,
            variant: 'outlined',
            sx: createMuiControlSx(),
            slotProps: mergeTextFieldSlotProps(
              textFieldSlotPropsNested,
              startAdornment
            ),
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
        } as NonNullable<DatePickerProps<TDate>['slotProps']>
      }
    />
  );
}
