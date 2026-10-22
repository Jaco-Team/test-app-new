import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_BASE_URL = 'https://mainimg.jacofood.ru';
const DEFAULT_WIDTHS = [366, 466, 585, 732, 875, 1168, 1420];
const DEFAULT_FORMATS = ['webp', 'jpg'];

const parseArguments = (argumentsList) => {
  const options = {};

  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    if (!argument.startsWith('--')) continue;

    const [key, inlineValue] = argument.slice(2).split('=', 2);
    const value = inlineValue ?? argumentsList[index + 1];
    if (inlineValue === undefined) index += 1;
    options[key] = value;
  }

  return options;
};

const parseList = (value, fallback) =>
  value
    ? value
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean)
    : fallback;

const inspectObject = async ({ baseUrl, imageId, width, format }) => {
  const url = `${baseUrl.replace(/\/$/, '')}/${imageId}_${width}x${width}.${format}`;
  const startedAt = performance.now();

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(10_000),
    });
    const contentType = response.headers.get('content-type');

    return {
      url,
      width,
      format,
      status: response.status,
      ok: response.ok,
      durationMs: Number((performance.now() - startedAt).toFixed(2)),
      bytes: Number(response.headers.get('content-length')) || null,
      contentType,
      cacheControl: response.headers.get('cache-control'),
      etag: response.headers.get('etag'),
      lastModified: response.headers.get('last-modified'),
      warnings: [
        !contentType?.startsWith('image/') &&
          `Некорректный Content-Type: ${contentType ?? 'отсутствует'}`,
        !response.headers.get('cache-control') && 'Отсутствует Cache-Control',
      ].filter(Boolean),
    };
  } catch (error) {
    return {
      url,
      width,
      format,
      status: null,
      ok: false,
      durationMs: Number((performance.now() - startedAt).toFixed(2)),
      error: error instanceof Error ? error.message : String(error),
      warnings: ['Запрос не выполнен'],
    };
  }
};

const options = parseArguments(process.argv.slice(2));
const imageIds = parseList(options.ids ?? options.id, []);

if (imageIds.length === 0) {
  throw new Error('Укажите идентификатор изображения: --id <image_id>');
}

const widths = parseList(options.widths, DEFAULT_WIDTHS).map(Number);
const formats = parseList(options.formats, DEFAULT_FORMATS);
const baseUrl = options['base-url'] ?? DEFAULT_BASE_URL;
const rows = [];

for (const imageId of imageIds) {
  for (const width of widths) {
    for (const format of formats) {
      rows.push(await inspectObject({ baseUrl, imageId, width, format }));
    }
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  mode: 'read-only HEAD',
  baseUrl,
  imageIds,
  rows,
  summary: {
    total: rows.length,
    successful: rows.filter((row) => row.ok).length,
    failed: rows.filter((row) => !row.ok).length,
    warnings: rows.reduce((total, row) => total + row.warnings.length, 0),
  },
};
const serializedReport = JSON.stringify(report, null, 2);

if (options.output) {
  const outputPath = path.resolve(options.output);
  await writeFile(outputPath, serializedReport);
  console.log(`Отчёт сохранён: ${outputPath}`);
} else {
  console.log(serializedReport);
}

if (options.strict === 'true' && report.summary.failed > 0) {
  process.exitCode = 1;
}
