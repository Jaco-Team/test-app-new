'use client';

import {
  MobileDatePicker,
  type MobileDatePickerProps,
} from '@mui/x-date-pickers/MobileDatePicker';
import type { PickersActionBarAction } from '@mui/x-date-pickers/PickersActionBar';
import type { TextFieldProps } from '@mui/material/TextField';
import {
  createMuiControlSx,
  getMuiControlClassName,
  mergeTextFieldSlotProps,
  type MuiControlRange,
  type MuiControlSurface,
} from '../internal/muiControl/shared';
import { MuiMobileDatePickerActionBar } from './MuiMobileDatePickerActionBar';
import './MuiMobileDatePickerField.scss';

const DEFAULT_ACTIONS: PickersActionBarAction[] = ['cancel', 'accept'];
const DEFAULT_PLACEHOLDER = 'Выберите дату';

export type MuiMobileDatePickerFieldProps<TDate extends Date = Date> = Omit<
  MobileDatePickerProps<TDate>,
  'slots' | 'slotProps'
> & {
  range?: MuiControlRange;
  surface?: MuiControlSurface;
  className?: string;
  /** Input placeholder before a date is chosen. */
  placeholder?: string;
  slotProps?: MobileDatePickerProps<TDate>['slotProps'];
};

export function MuiMobileDatePickerField<TDate extends Date = Date>({
  range = 'responsive',
  surface = 'outlined',
  className,
  placeholder = DEFAULT_PLACEHOLDER,
  slotProps,
  slots,
  views = ['year', 'month', 'day'],
  ...props
}: MuiMobileDatePickerFieldProps<TDate>) {
  const textFieldSlotProps = (slotProps?.textField ?? {}) as TextFieldProps;
  const textFieldSlotPropsNested = textFieldSlotProps.slotProps ?? {};

  return (
    <div className="ui-mui-mobile-date-picker-field">
      <MobileDatePicker
        {...props}
        views={views}
        slots={{
          actionBar: MuiMobileDatePickerActionBar,
          ...slots,
        }}
        slotProps={
          {
            ...slotProps,
            actionBar: {
              actions: DEFAULT_ACTIONS,
              ...slotProps?.actionBar,
            },
            toolbar: {
              toolbarFormat: 'd MMMM yyyy',
              ...slotProps?.toolbar,
              sx: {
                '& span, & h4': {
                  textAlign: 'center',
                  width: '100%',
                },
                ...(slotProps?.toolbar &&
                typeof slotProps.toolbar === 'object' &&
                'sx' in slotProps.toolbar
                  ? slotProps.toolbar.sx
                  : {}),
              },
            },
            mobilePaper: {
              ...slotProps?.mobilePaper,
              className: [
                'ui-mui-field__paper',
                slotProps?.mobilePaper?.className,
              ]
                .filter(Boolean)
                .join(' '),
            },
            textField: {
              ...textFieldSlotProps,
              placeholder: textFieldSlotProps.placeholder ?? placeholder,
              className: getMuiControlClassName(range, className, { surface }),
              fullWidth: true,
              variant: 'outlined',
              sx: createMuiControlSx(),
              slotProps: mergeTextFieldSlotProps(
                textFieldSlotPropsNested,
                undefined,
                undefined
              ),
            },
            day: {
              ...slotProps?.day,
            },
          } as NonNullable<MobileDatePickerProps<TDate>['slotProps']>
        }
      />
    </div>
  );
}
