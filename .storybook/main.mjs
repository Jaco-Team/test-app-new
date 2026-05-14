import { publicDir, storiesSrcDir } from './presets/paths.mjs';
import { applyStorybookViteResolve } from './presets/vite-storybook.mjs';

/** @type { import('@storybook/nextjs-vite').StorybookConfig } */
const config = {
  stories: [
    '../stories/{app,pages,widgets,features,entities,shared}/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)',
  ],

  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    'storybook/viewport',
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-vitest',
  ],

  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },

  docs: {},

  staticDirs: [{ from: publicDir, to: '/' }],

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },

  viteFinal: async (viteConfig) =>
    applyStorybookViteResolve(viteConfig, storiesSrcDir),
};

export default config;
