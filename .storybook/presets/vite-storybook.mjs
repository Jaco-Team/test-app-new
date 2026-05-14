/**
 * Дополнения к конфигу Vite внутри Storybook (алиасы и т.д.).
 * @param {import('vite').UserConfig} config
 * @param {string} storiesSrcDir — абсолютный путь к `stories/`
 */
export function applyStorybookViteResolve(config, storiesSrcDir) {
  const prev = config.resolve?.alias;
  const alias =
    prev && typeof prev === 'object' && !Array.isArray(prev)
      ? { ...prev, '@stories': storiesSrcDir }
      : { '@stories': storiesSrcDir };

  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias,
    },
  };
}
