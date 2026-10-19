export const calculateMse = (reference, candidate) => {
  if (reference.length !== candidate.length || reference.length === 0) {
    throw new Error('Буферы должны иметь одинаковую ненулевую длину');
  }

  let squaredError = 0;

  for (let index = 0; index < reference.length; index += 1) {
    const difference = reference[index] - candidate[index];
    squaredError += difference * difference;
  }

  return squaredError / reference.length;
};

export const calculatePsnr = (mse) =>
  mse === 0 ? Number.POSITIVE_INFINITY : 10 * Math.log10((255 * 255) / mse);

const escapeCsvCell = (value) => {
  const normalized = String(value ?? '');

  return /[",\n]/.test(normalized)
    ? `"${normalized.replaceAll('"', '""')}"`
    : normalized;
};

export const formatBenchmarkCsv = (rows) => {
  const columns = [
    'source',
    'width',
    'format',
    'quality',
    'bytes',
    'bytesPerPixel',
    'encodeMs',
    'decodeMs',
    'mse',
    'psnr',
    'savingPercent',
    'output',
  ];

  return [
    columns.join(','),
    ...rows.map((row) =>
      columns.map((column) => escapeCsvCell(row[column])).join(',')
    ),
  ].join('\n');
};
