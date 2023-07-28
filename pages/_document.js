import { Html, Head, Main, NextScript } from 'next/document'

import { roboto } from '@/ui/Font.js';

export default function Document() {
  return (
    <Html lang="ru" data-scroll="0">
      <Head />
      <body className={roboto.variable}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}