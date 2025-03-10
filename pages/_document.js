import { Html, Head, Main, NextScript } from 'next/document'

import { roboto } from '@/ui/Font.js';

//import Document from "next/document";
//import { ServerStyleSheet } from "styled-components";

/*export default class MyDocument extends Document {
  static async getInitialProps( ctx ) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: [initialProps.styles, sheet.getStyleElement()],
      };
    } finally {
      sheet.seal();
    }
  }
}*/

/*export default class MyDocument extends Document {
  static async getInitialProps( ctx ) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage
 
    try {
      // Run the React rendering logic synchronously
      ctx.renderPage = () =>
        originalRenderPage({
          // Useful for wrapping the whole react tree
          enhanceApp: (App) => App,
          // Useful for wrapping in a per-page basis
          enhanceComponent: (Component) => Component,
        })
  
      // Run the parent `getInitialProps`, it now includes the custom `renderPage`
      const initialProps = await Document.getInitialProps(ctx)
  
      return {
        ...initialProps,
        styles: [initialProps.styles, sheet.getStyleElement()],
      };
    } finally {
      sheet.seal();
    }
  }
 
  render() {
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
}*/

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