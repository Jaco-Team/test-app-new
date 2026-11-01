import { Html, Head, Main, NextScript } from 'next/document';
import { roboto } from '@/ui/Font.js';
import { earlyCategoryClickScript } from '@/utils/earlyCategoryClick';
import {
  UMAMI_BEFORE_SEND,
  UMAMI_PATH,
  umamiBeforeSendScript,
} from '@/utils/umami';

export default function Document() {
  // Runtime env фронта (OpenBao frontend-runtime): без него трекер не подключается.
  const umamiWebsiteId = process.env.UMAMI_WEBSITE_ID;
  const umamiDomains = process.env.UMAMI_DOMAINS;

  return (
    <Html lang="ru" data-scroll="0">
      <Head>
        <script
          id="early-category-click-guard"
          dangerouslySetInnerHTML={{ __html: earlyCategoryClickScript }}
        />
        {/* datalayer должен быть в head ДО ym-init */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || []; window.ymDataLayer = window.dataLayer;`,
          }}
        />

        {/* VK openapi в head + init по onload */}
        <script
          id="vk-openapi"
          async
          src="https://vk.com/js/api/openapi.js?162"
        ></script>
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
        {umamiWebsiteId ? (
          <>
            {/* хук до трекера: vid как distinct id и без чувствительных query */}
            <script
              id="umami-before-send"
              dangerouslySetInnerHTML={{ __html: umamiBeforeSendScript }}
            />
            <script
              defer
              src={`${UMAMI_PATH}/script.js`}
              data-website-id={umamiWebsiteId}
              data-host-url={UMAMI_PATH}
              data-before-send={UMAMI_BEFORE_SEND}
              {...(umamiDomains ? { 'data-domains': umamiDomains } : {})}
            />
          </>
        ) : null}
      </Head>

      <body className={roboto.variable}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
