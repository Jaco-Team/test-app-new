import { ThemeProvider, CssBaseline } from '@mui/material';
import { withThemeFromJSXProvider } from '@storybook/addon-themes';

import '@fontsource/roboto/100.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/900.css';

import { storybookMuiTheme } from './presets/mui-theme.mjs';
import { defaultViewportId, storybookViewports } from './presets/viewports.mjs';

/** @type { import('@storybook/nextjs').Preview } */
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
      options: storybookViewports,
    },
  },

  initialGlobals: {
    viewport: {
      value: defaultViewportId,
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
        theme: storybookMuiTheme,
      },
    }),
  ],

  tags: ['autodocs'],
};

export default preview;
