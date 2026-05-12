/** @type { import('@storybook/nextjs').Preview } */
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { withThemeFromJSXProvider } from '@storybook/addon-themes';

import '@fontsource/roboto/100.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/900.css';

const viewports = {
  mobileMin: {
    name: 'Mobile min (320)',
    styles: {
      width: '320px',
      height: '667px',
    },
    type: 'mobile',
  },
  mobileMax: {
    name: 'Mobile max (667)',
    styles: {
      width: '667px',
      height: '900px',
    },
    type: 'mobile',
  },
  tabletMin: {
    name: 'Tablet min (668)',
    styles: {
      width: '668px',
      height: '900px',
    },
    type: 'tablet',
  },
  tabletMax: {
    name: 'Tablet max (990)',
    styles: {
      width: '990px',
      height: '900px',
    },
    type: 'tablet',
  },
  desktopMin: {
    name: 'Desktop min (991+)',
    styles: {
      width: '991px',
      height: '900px',
    },
    type: 'desktop',
  },
};

// import '@fontsource/material-icons';

const theme = createTheme({
  palette: {
    primary: {
      main: '#CC0033',
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

const preview = {
  parameters: {
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      story: {
        inline: false,
        height: '75vh',
        iframeHeight: '75vh',
      },
    },
    viewport: {
      options: viewports,
    },
    //layout: 'centered',
  },

  initialGlobals: {
    viewport: {
      value: 'desktopMin',
      isRotated: false,
    },
  },

  decorators: [
    (Story) => (
      <div>
        <Story />
      </div>
    ),
    withThemeFromJSXProvider({
      GlobalStyles: CssBaseline,
      Provider: ThemeProvider,
      themes: {
        theme,
      },
    }),
  ],

  tags: ['autodocs']
};

export default preview;
