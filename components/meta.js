import React from 'react';

import Head from 'next/head'

export default function Meta({ title, description, children }) {
  const safeTitle = title ?? 'Жако роллы и пицца'
  const safeDesc = description ?? ''

  const hasDesc = typeof safeDesc === 'string' && safeDesc.length > 0

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

        { hasDesc ?
          <>
            <meta name="description" content={safeDesc} />
            <meta name="og:title" content={safeTitle} />
            <meta name="og:description" content={safeDesc} />
            <meta name="og:site_name" content="Жако роллы и пицца" />
            <meta name="og:type" content="website" />
          </>
            :
          <meta name="robots" content="noindex, nofollow" />
        }
      </Head>

      {children}
    </>
  )
}
