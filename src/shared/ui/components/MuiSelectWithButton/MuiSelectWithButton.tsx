'use client';

import { forwardRef, type ElementType, type ReactNode } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Paper, { type PaperProps } from '@mui/material/Paper';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import { cn } from '../../foundation/classNames';
import {
  createMuiControlSx,
  getMuiControlClassName,
  mergeTextFieldSlotProps,
  type MuiControlRange,
  type MuiControlSurface,
} from '../internal/muiControl/shared';
import './MuiSelectWithButton.scss';

export type MuiSelectWithButtonOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type MuiSelectWithButtonProps = Omit<
  TextFieldProps,
  'variant' | 'select' | 'children'
> & {
  options: MuiSelectWithButtonOption[];
  range?: MuiControlRange;
  surface?: MuiControlSurface;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  placeholder?: ReactNode;
  placeholderClassName?: string;
  menuFooter?: ReactNode;
};

export function MuiSelectWithButton({
  options,
  range = 'regular',
  surface = 'plain',
  startAdornment,
  endAdornment,
  placeholder,
  placeholderClassName,
  menuFooter,
  className,
  slotProps,
  sx,
  ...props
}: MuiSelectWithButtonProps) {
  const selectSlot = (slotProps?.select ?? {}) as {
    displayEmpty?: boolean;
    MenuProps?: {
      slotProps?: {
        paper?: { className?: string; component?: ElementType };
        list?: { className?: string };
      };
    };
    renderValue?: (value: unknown) => ReactNode;
  };
  const menuProps = selectSlot.MenuProps ?? {};
  const menuSlotProps = menuProps.slotProps ?? {};
  const hasPlaceholder = placeholder !== undefined;

  const SelectMenuPaper = forwardRef<HTMLDivElement, PaperProps>(
    function SelectMenuPaper(
      { children, className: paperClassName, ...paperProps },
      ref
    ) {
      return (
        <Paper ref={ref} {...paperProps} className={paperClassName}>
          {children}
          {menuFooter ? (
            <div className="ui-mui-select-with-button__footer">
              {menuFooter}
            </div>
          ) : null}
        </Paper>
      );
    }
  );

  function renderSelectedValue(value: unknown) {
    if (typeof selectSlot.renderValue === 'function') {
      return selectSlot.renderValue(value);
    }

    const normalized = String(value ?? '');
    const matched = options.find((option) => option.value === normalized);

    if (matched) {
      return matched.label;
    }

    if (hasPlaceholder && !normalized.length) {
      return (
        <span className={cn('ui-mui-field__placeholder', placeholderClassName)}>
          {placeholder}
        </span>
      );
    }

    return normalized;
  }

  return (
    <TextField
      {...props}
      className={cn(
        'ui-mui-select-with-button',
        getMuiControlClassName(range, className, { surface })
      )}
      variant="outlined"
      fullWidth
      select
      slotProps={{
        ...mergeTextFieldSlotProps(slotProps, startAdornment, endAdornment),
        select: {
          ...selectSlot,
          displayEmpty: hasPlaceholder || selectSlot.displayEmpty,
          renderValue: renderSelectedValue,
          MenuProps: {
            ...menuProps,
            slotProps: {
              ...menuSlotProps,
              paper: {
                ...menuSlotProps.paper,
                component: menuFooter
                  ? SelectMenuPaper
                  : menuSlotProps.paper?.component,
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
