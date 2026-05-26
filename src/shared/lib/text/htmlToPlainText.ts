const entityMap: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

function decodeEntity(entity: string): string {
  if (entity.startsWith('#x')) {
    const value = Number.parseInt(entity.slice(2), 16);
    return Number.isFinite(value) ? String.fromCodePoint(value) : '';
  }

  if (entity.startsWith('#')) {
    const value = Number.parseInt(entity.slice(1), 10);
    return Number.isFinite(value) ? String.fromCodePoint(value) : '';
  }

  return entityMap[entity] ?? '';
}

export function htmlToPlainText(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  const text = String(value)
    .replace(/<\s*br\s*\/?\s*>/gi, '\n')
    .replace(/<\s*\/\s*(p|div|li|h[1-6])\s*>/gi, '\n')
    .replace(/<\s*(script|style)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&([a-zA-Z]+|#\d+|#x[\da-fA-F]+);/g, (_match, entity: string) =>
      decodeEntity(entity)
    )
    .replace(/[ \t\f\v]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return text || undefined;
}
