import { getCleaningSchedule } from '@/utils/cleaningSchedules';

const PDF_FETCH_TIMEOUT_MS = 12000;
const MAX_PDF_BYTES = 5 * 1024 * 1024;

async function readPdf(response) {
  if (Number(response.headers.get('content-length')) > MAX_PDF_BYTES) {
    await response.body?.cancel();
    return null;
  }
  if (!response.body) return Buffer.alloc(0);

  let totalBytes = 0;
  const chunks = [];
  for await (const chunk of response.body) {
    totalBytes += chunk.byteLength;
    // При досрочном выходе async-итератор ReadableStream отменяет чтение.
    if (totalBytes > MAX_PDF_BYTES) return null;
    chunks.push(chunk);
  }
  return Buffer.concat(chunks, totalBytes);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const schedule = getCleaningSchedule(
    String(req.query.location || ''),
    String(req.query.document || '')
  );

  if (!schedule) {
    return res.status(404).json({ error: 'Document Not Found' });
  }

  const sourceUrl = new URL(schedule.url);
  sourceUrl.searchParams.set('viewer_version', String(Date.now()));

  try {
    const response = await fetch(sourceUrl, {
      cache: 'no-store',
      signal: AbortSignal.timeout(PDF_FETCH_TIMEOUT_MS),
    });

    if (!response.ok) {
      await response.body?.cancel();
      return res.status(502).json({ error: 'Document Is Unavailable' });
    }

    const contentType = response.headers.get('content-type') || '';

    if (!contentType.toLowerCase().includes('application/pdf')) {
      await response.body?.cancel();
      return res.status(502).json({ error: 'Invalid Document' });
    }

    const pdf = await readPdf(response);
    if (pdf === null) {
      return res.status(502).json({ error: 'Invalid Document' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', String(pdf.length));
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${schedule.location}-${schedule.documentSlug}.pdf"`
    );

    return res.status(200).send(pdf);
  } catch {
    return res.status(502).json({ error: 'Document Is Unavailable' });
  }
}

export const config = {
  api: {
    responseLimit: '5mb',
  },
};
