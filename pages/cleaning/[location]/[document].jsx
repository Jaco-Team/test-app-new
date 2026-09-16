import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import Meta from '@/components/meta';
import { roboto } from '@/ui/Font';
import {
  getCleaningSchedule,
  getCleaningSchedulePaths,
} from '@/utils/cleaningSchedules';
import { reachGoalAllCounters } from '@/utils/metrika';

import styles from '../cleaning.module.scss';

const CLEANING_SCHEDULE_GOAL = 'open_cleaning_schedule';
const UNKNOWN_PLACEMENT = 'unknown';

function normalizePlacement(value) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const normalized = String(rawValue ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 64);

  return normalized || UNKNOWN_PLACEMENT;
}

function withViewerVersion(url) {
  const versionedUrl = new URL(url);
  versionedUrl.searchParams.set('viewer_version', String(Date.now()));
  versionedUrl.hash = 'view=FitH';
  return versionedUrl.toString();
}

export default function CleaningSchedulePage({ schedule }) {
  const router = useRouter();
  const trackedRef = useRef(false);
  const canvasRef = useRef(null);
  const [viewerUrl, setViewerUrl] = useState('');
  const [viewerState, setViewerState] = useState('loading');

  useEffect(() => {
    setViewerUrl(withViewerVersion(schedule.url));
  }, [schedule.url]);

  useEffect(() => {
    let cancelled = false;
    let loadingTask;
    let renderTask;

    async function renderDocument() {
      setViewerState('loading');

      try {
        const pdfjs = await import(
          /* webpackIgnore: true */ '/cleaning/pdfjs/pdf.min.mjs'
        );
        pdfjs.GlobalWorkerOptions.workerSrc =
          '/cleaning/pdfjs/pdf.worker.min.mjs';
        const proxyUrl = `/api/cleaning/${encodeURIComponent(
          schedule.location
        )}/${encodeURIComponent(schedule.documentSlug)}?viewer_version=${Date.now()}`;

        loadingTask = pdfjs.getDocument(proxyUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        if (cancelled || !canvasRef.current) return;

        const viewport = page.getViewport({ scale: 2 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d', { alpha: false });

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);

        renderTask = page.render({ canvasContext: context, viewport });
        await renderTask.promise;

        if (!cancelled) setViewerState('ready');
      } catch (error) {
        if (cancelled || error?.name === 'RenderingCancelledException') return;
        setViewerState('error');
      }
    }

    renderDocument();

    return () => {
      cancelled = true;
      renderTask?.cancel();
      loadingTask?.destroy();
    };
  }, [schedule.documentSlug, schedule.location]);

  useEffect(() => {
    if (!router.isReady || trackedRef.current) return;

    trackedRef.current = true;
    const goalParams = {
      location: schedule.location,
      document: schedule.documentSlug,
      placement: normalizePlacement(router.query.placement),
      channel: 'qr',
    };

    reachGoalAllCounters(CLEANING_SCHEDULE_GOAL, goalParams);
    reachGoalAllCounters(schedule.goalId, goalParams);
  }, [router.isReady, router.query.placement, schedule]);

  const pageTitle = `${schedule.title} — кафе Жако, ${schedule.cafeName}`;
  const documentUrl = viewerUrl || schedule.url;

  return (
    <Meta title={pageTitle} robots="noindex, nofollow">
      <main className={`${styles.page} ${roboto.variable}`}>
        <header className={styles.header}>
          <Image
            className={styles.logo}
            src="/Jaco-Logo-PC.png"
            width={250}
            height={60}
            unoptimized
            priority
            alt="Жако"
          />

          <div className={styles.heading}>
            <p className={styles.cafe}>Кафе «{schedule.cafeName}»</p>
            <h1>{schedule.title}</h1>
          </div>

          <a
            className={styles.openLink}
            href={documentUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Открыть PDF
          </a>
        </header>

        <section
          className={styles.viewer}
          aria-busy={viewerState === 'loading'}
          aria-label={schedule.title}
        >
          <canvas
            ref={canvasRef}
            className={styles.canvas}
            aria-label={`${schedule.title}, кафе ${schedule.cafeName}`}
            role="img"
          />

          {viewerState === 'loading' && (
            <p className={styles.loading} role="status">
              Загружаем график…
            </p>
          )}

          {viewerState === 'error' && (
            <p className={styles.loading} role="alert">
              Не удалось показать документ. Откройте PDF по кнопке выше.
            </p>
          )}
        </section>

        <p className={styles.fallback}>
          Если документ не появился,{' '}
          <a href={documentUrl} target="_blank" rel="noopener noreferrer">
            откройте PDF отдельно
          </a>
          .
        </p>
      </main>
    </Meta>
  );
}

export function getStaticPaths() {
  return {
    paths: getCleaningSchedulePaths(),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  const schedule = getCleaningSchedule(params?.location, params?.document);

  if (!schedule) {
    return { notFound: true };
  }

  return {
    props: { schedule },
  };
}
