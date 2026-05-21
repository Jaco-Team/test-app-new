import type { ReactNode } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { uiTheme } from './theme';
import './base.scss';

export type DesignSystemProviderProps = {
  children: ReactNode;
};

export function DesignSystemProvider({ children }: DesignSystemProviderProps) {
  return (
    <ThemeProvider theme={uiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
