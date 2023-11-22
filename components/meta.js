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

        { description.length > 0 ?
          <>
            <meta name="description" content={description} />
            <meta name="og:title" content={title} />
            <meta name="og:description" content={description} />
          </>
            :
          <meta name="robots" content="noindex, nofollow" />
        }
      </Head>

      {children}
    </>
  )
}
