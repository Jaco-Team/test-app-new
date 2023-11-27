import { Html, Head, Main, NextScript } from 'next/document'

import { roboto } from '@/ui/Font.js';

export default function Document() {
  return (
    <Html lang="ru" data-scroll="0">
      <Head />
      <body className={roboto.variable}>
        <script src="https://api-maps.yandex.ru/2.1/?apikey=ae2bad1f-486e-442b-a9f7-d84fff6296db&lang=ru_RU" type="text/javascript" />

        <Main />
        <NextScript />
      </body>
    </Html>
  )
}