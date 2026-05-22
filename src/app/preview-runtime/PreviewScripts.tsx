'use client';

import Script from 'next/script';
import { useCityStore } from '@src/entities/city';

function TopMailRu({ id }: { id: string }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          var _tmr = window._tmr || (window._tmr = []);
          _tmr.push({id: "${id}", type: "pageView", start: (new Date()).getTime()});
          (function (d, w, id) {
            if (d.getElementById(id)) return;
            var ts = d.createElement("script"); ts.type = "text/javascript"; ts.async = true; ts.id = id;
            ts.src = "https://top-fwz1.mail.ru/js/code.js";
            var f = function () {var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ts, s);};
            if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); }
          })(document, window, "tmr-code");
        `,
      }}
    />
  );
}

export function PreviewScripts() {
  const city = useCityStore((state) => state.slug);
  const cityCounterId =
    city === 'samara' ? 100325084 : city === 'togliatti' ? 100601350 : null;

  return (
    <>
      <Script
        id="varioqub-preview"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(v,a,r,i,o,q,u,b){
              v[o]=v[o]||function(){(v[o].a=v[o].a||[]).push(arguments)};
              q=a.createElement(r);q.async=true;q.src=i;
              u=a.getElementsByTagName(r)[0];
              u && u.parentNode && u.parentNode.insertBefore(q,u);
            })(window, document, 'script', 'https://abt.s3.yandex.net/expjs/latest/exp.js', 'ymab');
          `,
        }}
      />

      <Script id="ym-init-preview" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j=0;j<document.scripts.length;j++){ if(document.scripts[j].src===r){ return; } }
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);
          })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

          ym(47085879, 'init', {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:true,
            defer:true,
            ecommerce:"dataLayer"
          });

          ${
            cityCounterId
              ? `ym(${cityCounterId}, 'init', {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            defer:true,
            ecommerce:"dataLayer"
          });`
              : ''
          }
        `}
      </Script>

      <Script id="telegram-pixel-preview" strategy="afterInteractive">
        {`
          (function(t,l,g,r,m){
            t[g] || (
              g = t[g] = function() {
                g.run ? g.run.apply(g, arguments) : g.queue.push(arguments);
              },
              g.queue = [],
              t = l.createElement(r),
              t.async = true,
              t.src = m,
              l = l.getElementsByTagName(r)[0],
              l.parentNode.insertBefore(t, l)
            );
          })(window, document, 'tgp', 'script', 'https://telegram.org/js/pixel.js');
          tgp('init', 'HbWMUPHc');
        `}
      </Script>

      <Script
        id="ymaps-preview"
        strategy="afterInteractive"
        src={`https://api-maps.yandex.ru/2.1/?apikey=${process.env.NEXT_PUBLIC_YANDEX_TOKEN_MAP}&lang=ru_RU`}
        onLoad={() => {
          if (typeof window !== 'undefined') {
            (
              window as typeof window & { __JACO_YMAPS_FAILED?: boolean }
            ).__JACO_YMAPS_FAILED = false;
          }
        }}
        onError={() => {
          if (typeof window !== 'undefined') {
            (
              window as typeof window & { __JACO_YMAPS_FAILED?: boolean }
            ).__JACO_YMAPS_FAILED = true;
          }
        }}
      />

      {city === 'togliatti' ? (
        <>
          <TopMailRu id="3321706" />
          <TopMailRu id="3637103" />
          <TopMailRu id="3646239" />
        </>
      ) : null}
      {city === 'samara' ? (
        <>
          <TopMailRu id="3588691" />
          <TopMailRu id="3621394" />
        </>
      ) : null}
    </>
  );
}
