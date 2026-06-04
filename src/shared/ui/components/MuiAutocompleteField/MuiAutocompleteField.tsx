'use client';

import type { ReactNode } from 'react';
import Autocomplete, {
  type AutocompleteProps,
  type AutocompleteRenderInputParams,
} from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {
  createMuiControlSx,
  createStartAdornment,
  getMuiControlClassName,
  type MuiControlRange,
} from '../internal/muiControl/shared';

export type MuiAutocompleteFieldProps<
  T,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
> = Omit<
  AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
  'renderInput'
> & {
  id?: string;
  name?: string;
  range?: MuiControlRange;
  textFieldClassName?: string;
  placeholder?: string;
  helperText?: ReactNode;
  startAdornment?: ReactNode;
};

export function MuiAutocompleteField<
  T,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
>({
  id,
  name,
  range = 'regular',
  textFieldClassName,
  placeholder,
  helperText,
  startAdornment,
  className,
  slotProps,
  sx,
  ...props
}: MuiAutocompleteFieldProps<T, Multiple, DisableClearable, FreeSolo>) {
  return (
    <Autocomplete
      {...props}
      className={className}
      slotProps={{
        ...slotProps,
        paper: {
          ...slotProps?.paper,
          className: getMuiControlClassName(range, 'ui-mui-field__paper'),
        },
        popper: {
          ...slotProps?.popper,
          className: 'ui-mui-field__popper',
        },
        listbox: {
          ...slotProps?.listbox,
          className: 'ui-mui-field__listbox',
        },
      }}
      sx={sx}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField
          {...params}
          id={id}
          className={getMuiControlClassName(range, textFieldClassName)}
          placeholder={placeholder}
          helperText={helperText}
          variant="outlined"
          fullWidth
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <>
                  {createStartAdornment(startAdornment)}
                  {params.InputProps.startAdornment}
                </>
              ),
            },
            htmlInput: {
              ...params.inputProps,
              id,
              name,
            },
          }}
          sx={createMuiControlSx(false)}
        />
      )}
    />
  );
}
