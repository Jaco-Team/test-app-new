// Explicit CI smoke check. This file is not run by test:core and never calls the order API.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { isSiteSentryDsn } from '../../utils/sentryEndpoint.mjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const release = process.env.SENTRY_RELEASE;
if (!process.env.CI || !isSiteSentryDsn(dsn) || !/^jacofood-web@[a-f0-9]{40}$/.test(release || '')) {
  throw new Error('SENTRY_VALIDATION_CONTEXT_REQUIRED');
}
const files = await readdir('.next/static/chunks', { recursive: true });
let frame;
for (const name of files.filter(name => name.endsWith('.js'))) {
  const source = await readFile(join('.next/static/chunks', name), 'utf8');
  const offset = source.indexOf('myUndefinedFunction(');
  const debugId = source.match(/(?:debugId=|_sentryDebugIdIdentifier="sentry-dbid-)([a-f0-9-]{36})/i)?.[1];
  if (offset < 0 || !debugId) continue;
  const preceding = source.slice(0, offset).split('\n');
  frame = {
    url: `http://localhost:3001/_next/static/chunks/${name.replaceAll('\\', '/')}`,
    debugId,
    lineno: preceding.length,
    colno: preceding.at(-1).length + 1,
  };
  break;
}
if (!frame) throw new Error('SENTRY_VALIDATION_FRAME_NOT_FOUND');
const eventId = randomUUID().replaceAll('-', '');
const event = {
  event_id: eventId,
  timestamp: Date.now() / 1000,
  platform: 'javascript',
  level: 'error',
  release,
  environment: 'validation',
  tags: { app: 'jacofood-web', runtime: 'browser', monitoring_check: 'true' },
  exception: { values: [{
    type: 'SentrySourcemapValidation', value: 'Synthetic CI source map validation',
    stacktrace: { frames: [{ filename: frame.url, abs_path: frame.url, lineno: frame.lineno, colno: frame.colno, in_app: true }] },
  }] },
  debug_meta: { images: [{ type: 'sourcemap', code_file: frame.url, debug_id: frame.debugId }] },
};
const parsed = new URL(dsn);
const endpoint = `${parsed.origin}/api/4/envelope/?sentry_key=${parsed.username}&sentry_version=7`;
const response = await fetch(endpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-sentry-envelope', Origin: 'http://localhost:3001' },
  body: `${JSON.stringify({ event_id: eventId, dsn })}\n${JSON.stringify({ type: 'event' })}\n${JSON.stringify(event)}\n`,
  signal: AbortSignal.timeout(30_000),
});
if (!response.ok) throw new Error(`SENTRY_VALIDATION_INGESTION_${response.status}`);
console.log(JSON.stringify({ eventId, release, debugId: frame.debugId, accepted: true }));
