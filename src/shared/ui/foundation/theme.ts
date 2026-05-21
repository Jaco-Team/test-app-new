import { createTheme } from '@mui/material/styles';
import { breakpointValues } from './breakpoints';
import { colorTokens, radiusTokens, zIndexTokens } from './tokens';

export const uiTheme = createTheme({
  breakpoints: {
    values: breakpointValues,
  },
  palette: {
    mode: 'light',
    primary: {
      main: colorTokens.brand,
      dark: colorTokens.brandActive,
      contrastText: '#ffffff',
    },
    text: {
      primary: colorTokens.text,
      secondary: colorTokens.textMuted,
      disabled: colorTokens.textSubtle,
    },
    background: {
      default: '#ffffff',
      paper: colorTokens.surface,
    },
  },
  shape: {
    borderRadius: radiusTokens.sm,
  },
  zIndex: {
    appBar: zIndexTokens.header,
    modal: zIndexTokens.modal,
    snackbar: zIndexTokens.toast,
    tooltip: zIndexTokens.toast,
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 400,
    },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
});
