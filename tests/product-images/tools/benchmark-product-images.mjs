import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { performance } from 'node:perf_hooks';

import sharp from 'sharp';

import {
  calculateMse,
  calculatePsnr,
  formatBenchmarkCsv,
} from './imageMetrics.mjs';

const DEFAULT_WIDTHS = [366, 466, 585, 732, 875, 1168, 1420];
const DEFAULT_VARIANTS = {
  webp: [70, 75, 80, 85, 90],
  jpeg: [75, 82, 90],
  avif: [45, 55, 65],
};
const SUPPORTED_INPUTS = new Set(['.avif', '.jpeg', '.jpg', '.png', '.webp']);

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

const parseWidths = (value) => {
  if (!value) return DEFAULT_WIDTHS;

  const widths = value
    .split(',')
    .map(Number)
    .filter((width) => Number.isInteger(width) && width > 0);

  if (widths.length === 0) {
    throw new Error('Параметр --widths не содержит допустимых значений');
  }

  return [...new Set(widths)].sort((left, right) => left - right);
};

const listInputFiles = async (inputPath) => {
  const absolutePath = path.resolve(inputPath);
  const extension = path.extname(absolutePath).toLowerCase();

  if (SUPPORTED_INPUTS.has(extension)) return [absolutePath];

  const entries = await readdir(absolutePath, { withFileTypes: true });

  return entries
    .filter(
      (entry) =>
        entry.isFile() &&
        SUPPORTED_INPUTS.has(path.extname(entry.name).toLowerCase())
    )
    .map((entry) => path.join(absolutePath, entry.name))
    .sort();
};

const encodeVariant = (pipeline, format, quality) => {
  if (format === 'webp') return pipeline.webp({ quality, effort: 4 });
  if (format === 'jpeg')
    return pipeline.jpeg({ quality, mozjpeg: true, progressive: true });
  if (format === 'avif') return pipeline.avif({ quality, effort: 4 });

  throw new Error(`Неподдерживаемый формат: ${format}`);
};

const decodeRgb = async (input) =>
  sharp(input).removeAlpha().toColourspace('srgb').raw().toBuffer();

const benchmarkVariant = async ({
  source,
  sourceName,
  width,
  format,
  quality,
  outputDirectory,
  reference,
  height,
}) => {
  const outputName = `${sourceName}_${width}x${width}_q${quality}.${format === 'jpeg' ? 'jpg' : format}`;
  const outputPath = path.join(outputDirectory, outputName);
  const startedEncoding = performance.now();
  const encoded = await encodeVariant(
    sharp(source)
      .rotate()
      .resize({ width, height, fit: 'fill', withoutEnlargement: true })
      .removeAlpha()
      .toColourspace('srgb'),
    format,
    quality
  ).toBuffer();
  const encodeMs = performance.now() - startedEncoding;

  const startedDecoding = performance.now();
  const decoded = await decodeRgb(encoded);
  const decodeMs = performance.now() - startedDecoding;
  const mse = calculateMse(reference, decoded);

  await writeFile(outputPath, encoded);

  return {
    source: path.basename(source),
    width,
    format,
    quality,
    bytes: encoded.length,
    bytesPerPixel: Number((encoded.length / (width * height)).toFixed(4)),
    encodeMs: Number(encodeMs.toFixed(2)),
    decodeMs: Number(decodeMs.toFixed(2)),
    mse: Number(mse.toFixed(4)),
    psnr: Number(calculatePsnr(mse).toFixed(4)),
    output: outputPath,
  };
};

export const runBenchmark = async ({ input, output, widths }) => {
  const inputFiles = await listInputFiles(input);

  if (inputFiles.length === 0) {
    throw new Error('В указанной директории нет поддерживаемых изображений');
  }

  const outputDirectory = path.resolve(output);
  await mkdir(outputDirectory, { recursive: true });

  const rows = [];

  for (const source of inputFiles) {
    const metadata = await sharp(source).metadata();
    const sourceName = path.parse(source).name;

    for (const requestedWidth of widths) {
      const width = Math.min(requestedWidth, metadata.width ?? requestedWidth);
      const height = width;
      const reference = await sharp(source)
        .rotate()
        .resize({ width, height, fit: 'fill', withoutEnlargement: true })
        .removeAlpha()
        .toColourspace('srgb')
        .raw()
        .toBuffer();
      const widthRows = [];

      for (const [format, qualities] of Object.entries(DEFAULT_VARIANTS)) {
        for (const quality of qualities) {
          widthRows.push(
            await benchmarkVariant({
              source,
              sourceName,
              width,
              format,
              quality,
              outputDirectory,
              reference,
              height,
            })
          );
        }
      }

      const baseline = widthRows.find(
        (row) => row.format === 'webp' && row.quality === 90
      );

      widthRows.forEach((row) => {
        row.savingPercent = baseline
          ? Number((100 - (row.bytes / baseline.bytes) * 100).toFixed(2))
          : null;
      });
      rows.push(...widthRows);
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    inputFiles,
    widths,
    baseline: 'WebP quality 90 того же размера',
    rows,
  };

  await writeFile(
    path.join(outputDirectory, 'report.json'),
    JSON.stringify(report, null, 2)
  );
  await writeFile(
    path.join(outputDirectory, 'report.csv'),
    formatBenchmarkCsv(rows)
  );

  return report;
};

const isMainModule =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  const options = parseArguments(process.argv.slice(2));

  if (!options.input) {
    throw new Error('Укажите файл или директорию исходников: --input <путь>');
  }

  const output = options.output ?? '/tmp/jaco-product-image-benchmark';
  const report = await runBenchmark({
    input: options.input,
    output,
    widths: parseWidths(options.widths),
  });

  console.log(
    `Готово: ${report.rows.length} вариантов, отчёты сохранены в ${path.resolve(output)}`
  );
}
