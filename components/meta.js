import React from 'react';

import Head from 'next/head'

export default function Meta({ title, description, children }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* <link rel="icon" href="/icon.svg" type="image/svg+xml" /> */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />

        <meta name="yandex-verification" content="298ae72b445ff952" />
        <meta name="yandex-verification" content="7e7652cb40b75404" />
        <meta name="yandex-verification" content="d4f3544393d9106d" />

        { description.length > 0 ?
          <>
            <meta name="description" content={description} />
            <meta name="og:title" content={title} />
            <meta name="og:description" content={description} />
            <meta name="og:site_name" content="Жако роллы и пицца" />
            <meta name="og:type" content="website" />
            <meta name="og:url" content="https://jacofood.ru${req.originalUrl}" />
          </>
            :
          <meta name="robots" content="noindex, nofollow" />
        }
      </Head>

      {children}
    </>
  )
}
