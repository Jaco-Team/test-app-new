import { Html, Head, Main, NextScript } from "next/document";
import { roboto } from "@/ui/Font.js";

export default function Document() {
  return (
    <Html lang="ru" data-scroll="0">
      <Head>
        {/* datalayer должен быть в head ДО ym-init */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || []; window.ymDataLayer = window.dataLayer;`,
          }}
        />

        {/* VK openapi в head + init по onload */}
        <script id="vk-openapi" async src="https://vk.com/js/api/openapi.js?162"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                function init(){
                  try {
                    VK?.Retargeting?.Init("VK-RTRG-409134-7MvqQ");
                    VK?.Retargeting?.Hit();
                  } catch(e) {}
                }
                var s = document.getElementById('vk-openapi');
                if (s && s.addEventListener) s.addEventListener('load', init);
                else window.addEventListener('load', init);
              })();
            `,
          }}
        />
      </Head>

      <body className={roboto.variable}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
