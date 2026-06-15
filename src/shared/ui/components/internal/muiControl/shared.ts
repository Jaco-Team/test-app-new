'use client';

import { createElement, type ReactNode } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import type { TextFieldProps } from '@mui/material/TextField';
import type { SxProps, Theme } from '@mui/material/styles';
import { cn } from '../../../foundation/classNames';
import './styles.scss';

export type MuiControlRange = 'compact' | 'regular' | 'expanded' | 'responsive';
export type MuiControlSurface = 'plain' | 'outlined';
export type MuiControlLayout = 'default' | 'address-picker' | 'auth-modal';

type MuiControlClassOptions = {
  multiline?: boolean;
  surface?: MuiControlSurface;
  layout?: MuiControlLayout;
};

export function getMuiControlClassName(
  range: MuiControlRange,
  className?: string,
  options: MuiControlClassOptions = {}
) {
  const {
    multiline = false,
    surface = 'outlined',
    layout = 'default',
  } = options;

  return cn(
    'ui-mui-field',
    'ui-mui-field--range-' + range,
    'ui-mui-field--surface-' + surface,
    layout !== 'default' && 'ui-mui-field--layout-' + layout,
    multiline && 'ui-mui-field--multiline',
    className
  );
}

/** Wrapper instances still set width directly; generic chrome lives in the theme. */
export function createMuiControlSx(): SxProps<Theme> {
  return {
    width: '100%',
  };
}

export function createStartAdornment(content?: ReactNode) {
  if (!content) {
    return undefined;
  }

  return createElement(
    InputAdornment,
    { position: 'start', className: 'ui-mui-field__start-adornment' },
    content
  );
}

export function createEndAdornment(content?: ReactNode) {
  if (!content) {
    return undefined;
  }

  return createElement(
    InputAdornment,
    { position: 'end', className: 'ui-mui-field__end-adornment' },
    content
  );
}

export function mergeTextFieldSlotProps(
  slotProps: TextFieldProps['slotProps'] | undefined,
  startAdornment?: ReactNode,
  endAdornment?: ReactNode
): TextFieldProps['slotProps'] {
  const inputSlot =
    slotProps?.input && typeof slotProps.input === 'object'
      ? slotProps.input
      : {};

  return {
    ...slotProps,
    input: {
      ...inputSlot,
      startAdornment:
        ('startAdornment' in inputSlot
          ? inputSlot.startAdornment
          : undefined) ?? createStartAdornment(startAdornment),
      endAdornment:
        ('endAdornment' in inputSlot ? inputSlot.endAdornment : undefined) ??
        createEndAdornment(endAdornment),
    },
  };
}
