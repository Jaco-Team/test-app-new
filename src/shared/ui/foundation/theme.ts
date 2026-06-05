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
    fontFamily:
      'var(--ui-font-family, var(--inter-font, Roboto, Arial, sans-serif))',
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
    MuiInputBase: {
      styleOverrides: {
        root: {
          '.ui-mui-field &': {
            minHeight: 0,
            boxSizing: 'border-box',
            alignItems: 'center',
            color: 'inherit',
            fontFamily: 'inherit',
            transition: 'border-color 180ms ease, box-shadow 180ms ease',
          },
          '.ui-mui-field--multiline &': {
            alignItems: 'flex-start',
          },
        },
        input: {
          '.ui-mui-field &': {
            minWidth: 0,
            padding: '0 !important',
            color: 'inherit',
            fontFamily: 'inherit',
            fontWeight: 400,
            letterSpacing: 0,
            '&::placeholder': {
              color: colorTokens.textMuted,
              opacity: 1,
            },
            '&::-webkit-input-placeholder': {
              color: colorTokens.textMuted,
              opacity: 1,
            },
          },
        },
        inputMultiline: {
          '.ui-mui-field--multiline &': {
            resize: 'vertical',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          '.ui-mui-field &': {
            border: 0,
          },
        },
        root: ({ theme }) => ({
          '.ui-mui-field &': {
            '&:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline':
              {
                border: 0,
              },
            '&.Mui-disabled': {
              opacity: 0.6,
            },
          },
          '.ui-mui-field--surface-plain &': {
            padding: 0,
            border: 0,
            borderRadius: 0,
            background: 'transparent',
            boxShadow: 'none',
          },
          '.ui-mui-field--surface-outlined &': {
            border: `1px solid ${colorTokens.border}`,
            borderRadius: radiusTokens.pill,
            background: colorTokens.surface,
            boxShadow: 'none',
            '&:hover': {
              borderColor: colorTokens.textMuted,
            },
            '&.Mui-focused': {
              borderColor: colorTokens.textSubtle,
            },
          },
          '.ui-mui-field--surface-outlined.ui-mui-field--range-compact &': {
            minHeight: 'clamp(66px, 5vw, 66px)',
            paddingInline: 'clamp(20px, 4vw, 20px)',
          },
          '.ui-mui-field--surface-outlined.ui-mui-field--range-regular &': {
            minHeight: 'clamp(58px, 4vw, 58px)',
            paddingInline: 'clamp(18px, 3vw, 18px)',
          },
          '.ui-mui-field--surface-outlined.ui-mui-field--range-expanded &': {
            minHeight: 46,
            paddingInline: 16,
          },
          '.ui-mui-field--surface-outlined.ui-mui-field--range-responsive &': {
            minHeight: 'clamp(66px, 5vw, 66px)',
            paddingInline: 'clamp(20px, 4vw, 20px)',
            [theme.breakpoints.between('sm', 'md')]: {
              minHeight: 'clamp(58px, 4vw, 58px)',
              paddingInline: 'clamp(18px, 3vw, 18px)',
            },
            [theme.breakpoints.up('md')]: {
              minHeight: 46,
              paddingInline: 16,
            },
          },
        }),
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        inputRoot: ({ theme }) => ({
          '.ui-mui-field &': {
            minHeight: 0,
            boxSizing: 'border-box',
            alignItems: 'center',
            color: 'inherit',
            fontFamily: 'inherit',
            transition: 'border-color 180ms ease, box-shadow 180ms ease',
          },
          '.ui-mui-field--surface-plain &': {
            padding: 0,
            border: 0,
            borderRadius: 0,
            background: 'transparent',
            boxShadow: 'none',
          },
          '.ui-mui-field--surface-outlined &': {
            border: `1px solid ${colorTokens.border}`,
            borderRadius: radiusTokens.pill,
            background: colorTokens.surface,
            boxShadow: 'none',
            '&:hover': {
              borderColor: colorTokens.textMuted,
            },
          },
          '.ui-mui-field--surface-outlined.ui-mui-field--range-compact &': {
            minHeight: 'clamp(66px, 5vw, 66px)',
            paddingInline: 'clamp(20px, 4vw, 20px)',
          },
          '.ui-mui-field--surface-outlined.ui-mui-field--range-regular &': {
            minHeight: 'clamp(58px, 4vw, 58px)',
            paddingInline: 'clamp(18px, 3vw, 18px)',
          },
          '.ui-mui-field--surface-outlined.ui-mui-field--range-expanded &': {
            minHeight: 46,
            paddingInline: 16,
          },
          '.ui-mui-field--surface-outlined.ui-mui-field--range-responsive &': {
            minHeight: 'clamp(66px, 5vw, 66px)',
            paddingInline: 'clamp(20px, 4vw, 20px)',
            [theme.breakpoints.between('sm', 'md')]: {
              minHeight: 'clamp(58px, 4vw, 58px)',
              paddingInline: 'clamp(18px, 3vw, 18px)',
            },
            [theme.breakpoints.up('md')]: {
              minHeight: 46,
              paddingInline: 16,
            },
          },
        }),
        input: {
          '.ui-mui-field &': {
            minWidth: 0,
            padding: '0 !important',
            color: 'inherit',
            fontFamily: 'inherit',
            fontWeight: 400,
            letterSpacing: 0,
          },
        },
        endAdornment: ({ theme }) => ({
          '.ui-mui-field &': {
            right: 8,
          },
          [theme.breakpoints.between('sm', 'md')]: {
            '.ui-mui-field &': {
              right: 6,
            },
          },
          [theme.breakpoints.up('md')]: {
            '.ui-mui-field &': {
              right: 4,
            },
          },
        }),
        popupIndicator: {
          '.ui-mui-field &': {
            padding: 0,
          },
          '.ui-mui-field & svg': {
            color: colorTokens.textMuted,
          },
        },
        clearIndicator: {
          '.ui-mui-field &': {
            padding: 0,
          },
          '.ui-mui-field & svg': {
            color: colorTokens.textMuted,
          },
        },
        paper: {
          '&.ui-mui-field__paper': {
            border: `1px solid ${colorTokens.disabled}`,
            borderRadius: radiusTokens.md,
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.12)',
          },
        },
        listbox: {
          '&.ui-mui-field__listbox': {
            padding: 6,
          },
        },
        option: {
          '&.ui-mui-field__option': {
            borderRadius: 12,
            color: colorTokens.text,
            fontFamily: 'inherit',
            lineHeight: 1.3,
            '&[aria-selected="true"]': {
              background: 'rgba(221, 26, 50, 0.08)',
            },
            '&.Mui-focused, &.Mui-focusVisible': {
              background: 'rgba(221, 26, 50, 0.12)',
            },
          },
        },
        popper: {
          '&.ui-mui-field__popper': {
            zIndex: zIndexTokens.modal,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          '.ui-mui-field &': {
            display: 'flex',
            alignItems: 'center',
            paddingRight: '2em !important',
            fontWeight: 400,
          },
        },
        icon: {
          '.ui-mui-field &': {
            color: colorTokens.textMuted,
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          '.ui-mui-field &': {
            margin: 0,
            color: colorTokens.textMuted,
            lineHeight: 1.35,
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.ui-mui-field__option': {
            borderRadius: 12,
            color: colorTokens.text,
            fontFamily: 'inherit',
            lineHeight: 1.3,
            '&[aria-selected="true"]': {
              background: 'rgba(221, 26, 50, 0.08)',
            },
            '&.Mui-focused, &.Mui-focusVisible': {
              background: 'rgba(221, 26, 50, 0.12)',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          '&.ui-mui-field__paper': {
            border: `1px solid ${colorTokens.disabled}`,
            borderRadius: radiusTokens.md,
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          '&.ui-mui-field__listbox': {
            padding: 6,
          },
        },
      },
    },
    MuiPopper: {
      styleOverrides: {
        root: {
          '&.ui-mui-field__popper': {
            zIndex: zIndexTokens.modal,
          },
        },
      },
    },
  },
});
