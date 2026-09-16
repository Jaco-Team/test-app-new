import { getCleaningSchedule } from '@/utils/cleaningSchedules';

const PDF_FETCH_TIMEOUT_MS = 12000;

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
      return res.status(502).json({ error: 'Document Is Unavailable' });
    }

    const contentType = response.headers.get('content-type') || '';

    if (!contentType.toLowerCase().includes('application/pdf')) {
      return res.status(502).json({ error: 'Invalid Document' });
    }

    const pdf = Buffer.from(await response.arrayBuffer());

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
