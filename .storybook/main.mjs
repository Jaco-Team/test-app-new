/** @type { import('@storybook/nextjs-vite').StorybookConfig } */
const config = {
  stories: [
    "../stories/{app,pages}/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)",
    "../stories/{widgets,features,entities}/**/ui/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)",
    "../stories/shared/{ui,IconPC,MyMenu,MyTextLink}/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)",
  ],

  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "storybook/viewport",
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-vitest"
  ],

  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },

  docs: {},

  staticDirs: ["../public"],

  typescript: {
    reactDocgen: "react-docgen-typescript"
  }
};
export default config;
