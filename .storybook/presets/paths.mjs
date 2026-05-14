import path from 'node:path';
import { fileURLToPath } from 'node:url';

const presetsDir = path.dirname(fileURLToPath(import.meta.url));

/** Корень `.storybook/` (родитель каталога `presets/`). */
export const storybookDir = path.join(presetsDir, '..');

/** Исходники FSD-сторис и компонентов. */
export const storiesSrcDir = path.resolve(storybookDir, '../stories');

/** Статика Next (картинки и т.п. для сторис). */
export const publicDir = path.resolve(storybookDir, '../public');
