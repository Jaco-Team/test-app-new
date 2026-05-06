/** @type { import('@storybook/nextjs').StorybookConfig } */
const config = {
  stories: [
    "../stories/{app,pages,widgets,features,entities,shared}/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)",
    "../stories/legacy/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)",
  ],

  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "storybook/viewport",
    "@chromatic-com/storybook",
    "@storybook/addon-docs"
  ],

  framework: {
    name: "@storybook/nextjs",
    options: {},
  },

  docs: {},

  staticDirs: ["../public"],

  typescript: {
    reactDocgen: "react-docgen-typescript"
  }
};
export default config;
