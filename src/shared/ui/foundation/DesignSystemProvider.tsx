'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { ru } from 'date-fns/locale';
import { uiTheme } from './theme';
import './base.scss';

export type DesignSystemProviderProps = {
  children: ReactNode;
};

export function DesignSystemProvider({ children }: DesignSystemProviderProps) {
  return (
    <ThemeProvider theme={uiTheme}>
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={ru}
        localeText={{
          cancelButtonLabel: 'Отмена',
          okButtonLabel: 'Выбрать',
          todayButtonLabel: 'Сегодня',
          datePickerToolbarTitle: 'Выбрать дату',
        }}
      >
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  );
}
