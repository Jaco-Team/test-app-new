import { createTheme } from '@mui/material';

/** Тема MUI для превью Storybook (без затрагивания основного Next-приложения). */
export const storybookMuiTheme = createTheme({
  palette: {
    primary: { main: '#CC0033' },
  },
  components: {
    MuiButtonBase: {
      defaultProps: { disableRipple: true },
    },
  },
});
