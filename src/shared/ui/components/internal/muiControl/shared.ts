'use client';

import { createElement, type ReactNode } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import type { SxProps, Theme } from '@mui/material/styles';
import { cn } from '../../../foundation/classNames';
import './styles.scss';

export type MuiControlRange = 'compact' | 'regular' | 'expanded';

export function getMuiControlClassName(
  range: MuiControlRange,
  className?: string,
  multiline = false
) {
  return cn(
    'ui-mui-field',
    'ui-mui-field--range-' + range,
    multiline && 'ui-mui-field--multiline',
    className
  );
}

export function createMuiControlSx(multiline = false): SxProps<Theme> {
  return {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      padding: 0,
      alignItems: multiline ? 'flex-start' : 'center',
      backgroundColor: 'transparent',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 0,
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
      border: 0,
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      border: 0,
    },
    '& .MuiInputBase-input': {
      padding: 0,
    },
    '& .MuiInputBase-inputMultiline': {
      padding: 0,
    },
  };
}

export function createStartAdornment(content?: ReactNode) {
  if (!content) {
    return undefined;
  }

  return createElement(InputAdornment, { position: 'start' }, content);
}
