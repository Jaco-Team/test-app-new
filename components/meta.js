import React from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

const SITE_ORIGIN = 'https://jacofood.ru';

function normalizeCanonicalPath(value) {
  const rawPath = String(value || '/')
    .split(/[?#]/, 1)[0]
    .trim();
  const pathWithLeadingSlash = `/${rawPath}`.replace(/\/{2,}/g, '/');
  const normalizedPath = pathWithLeadingSlash.toLowerCase();

  return normalizedPath === '/'
    ? normalizedPath
    : normalizedPath.replace(/\/+$/, '');
}

export default function Meta({
  title,
  description,
  robots,
  canonicalPath,
  children,
}) {
  const router = useRouter();
  const safeTitle = title ?? 'Жако роллы и пицца';
  const safeDesc = description ?? '';
  const safeRobots = typeof robots === 'string' ? robots.trim() : '';

  const hasDesc = typeof safeDesc === 'string' && safeDesc.length > 0;
  const isNoindex = /(^|[\s,])noindex([\s,]|$)/i.test(safeRobots);
  const resolvedCanonicalPath = normalizeCanonicalPath(
    canonicalPath ?? router.asPath
  );
  const canonicalUrl = `${SITE_ORIGIN}${resolvedCanonicalPath}`;

  return (
    <>
      <Head>
        <title>{safeTitle}</title>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* <link rel="icon" href="/icon.svg" type="image/svg+xml" /> */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />

        <meta name="yandex-verification" content="298ae72b445ff952" />
        <meta name="yandex-verification" content="7e7652cb40b75404" />
        <meta name="yandex-verification" content="d4f3544393d9106d" />

        {hasDesc && !isNoindex ? (
          <link rel="canonical" href={canonicalUrl} />
        ) : null}

        {hasDesc ? (
          <>
            <meta name="description" content={safeDesc} />
            <meta name="og:title" content={safeTitle} />
            <meta name="og:description" content={safeDesc} />
            <meta name="og:site_name" content="Жако роллы и пицца" />
            <meta name="og:type" content="website" />
          </>
        ) : null}

        {safeRobots ? (
          <meta name="robots" content={safeRobots} />
        ) : !hasDesc ? (
          <meta name="robots" content="noindex, nofollow" />
        ) : null}
      </Head>

      {children}
    </>
  );
}
