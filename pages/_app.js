/* eslint-disable @next/next/no-img-element */

import "@fontsource/roboto/100.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/roboto/900.css";

import "../styles/globals.scss";

import "../styles/akcii/akciiPC.scss";
import "../styles/akcii/akciiMobile.scss";

import "../styles/cart/cartMobile.scss";
import "../styles/cart/cartMenuMobile.scss";
import "../styles/cart/cartDataTimePicker.scss";
import "../styles/cart/cartMapPoints.scss";
import "../styles/cart/cartPayForm.scss";
import "../styles/cart/cartDopsForm.scss";

import "../styles/about/aboutPC.scss";
import "../styles/about/aboutMobile.scss";
import "../styles/about/documentMobile.scss";

import "../styles/pageText/pageTextMobile.scss";
import "../styles/pageText/pageTextPC.scss";

import "../styles/legal.scss";
import "../styles/jobs.scss";

import "../styles/contacts/contactsMobile.scss";
import "../styles/contacts/contactsPC.scss";

import "../styles/home/cardItemPC.scss";
import "../styles/home/cardItemMobile.scss";

import "../styles/home/bannersPC.scss";
import "../styles/home/bannersMobile.scss";

import "../styles/home/menuCatMobile.scss";

import "../styles/header/loginFormPC.scss";
import "../styles/header/loginFormMobile.scss";

import "../styles/header/cityFormPC.scss";
import "../styles/header/cityFormMobile.scss";

import "../styles/header/headerPC.scss";
import "../styles/header/headerMobile.scss";

import "../styles/header/basketPC.scss";
import "../styles/header/basketModalPC.scss";
import "../styles/header/basketDataTimePicker.scss";

import "../styles/profile/accountMobile.scss";
import "../styles/profile/addressMobile.scss";

import "../styles/profile/profilePC.scss";
import "../styles/profile/profileMobile.scss";
import "../styles/profile/profile_modalMobile.scss";

import "../styles/profile/promokodyPC.scss";
import "../styles/profile/promokodyMobile.scss";
import "../styles/profile/profile_modalAddr.scss";

import "../styles/profile/zakazyPC.scss";
import "../styles/profile/zakazy_modalOrder.scss";
import "../styles/profile/zakazy_modalOrderDelete.scss";

import "../styles/profile/zakazyMobile.scss";

import "../styles/docsBreadcrumbs.scss";

import "../styles/footer/footerPC.scss";
import "../styles/footer/footerMobile.scss";

import "../styles/header/modalAlert.scss";
import "../styles/header/modalSelect.scss";

import "../styles/header.scss";
import "../styles/badge_item.scss";

import "../styles/home/filter.scss";

import "../styles/cart/cartConfirmForm.scss";
import "../styles/cart/cartMailForm.scss";

import "../styles/sitemap.scss";

import { useEffect, useRef, useState } from "react";
import * as Sentry from "@sentry/nextjs";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/router";
import Script from "next/script";
import { MetricaExperimentsContext, MetricaExperimentsProvider } from "yandex-metrica-ab-react";

import Header from "@/components/header";
import { useProfileStore } from "@/components/store";
import {
  INTERNET_ISSUE_EVENT_NAME,
  getClientNetworkContext,
  isChunkLoadError,
  maybeReloadAfterChunkError,
} from "@/utils/clientMonitoring";
import { hitAll, reachGoal } from "@/utils/metrika";

const INTERNET_ISSUE_CUSTOM_EVENT = "internet_issue";
const INTERNET_ISSUE_SAVE_ACTION_DEDUP_MS = 20000;

function buildInternetIssueTrackingPayload(detail = {}) {
  const network = detail?.network || {};

  return {
    type: String(detail?.type || "internet_issue").slice(0, 64),
    source: String(detail?.source || "unknown").slice(0, 64),
    module: detail?.module ? String(detail.module).slice(0, 64) : undefined,
    requestType: detail?.requestType ? String(detail.requestType).slice(0, 64) : undefined,
    status: detail?.status != null ? String(detail.status).slice(0, 32) : undefined,
    code: detail?.code ? String(detail.code).slice(0, 64) : undefined,
    resourceTag: detail?.tagName ? String(detail.tagName).slice(0, 32) : undefined,
    connection: network?.effectiveType ? String(network.effectiveType).slice(0, 32) : undefined,
    online: network?.online === false ? "0" : "1",
  };
}

function buildInternetIssueSignature(detail = {}) {
  return [
    detail?.type || "",
    detail?.source || "",
    detail?.module || "",
    detail?.requestType || "",
    detail?.status || "",
    detail?.code || "",
    detail?.resourceUrl || "",
    detail?.tagName || "",
  ].join("|");
}

function buildInternetIssueCustomData(detail = {}) {
  const network = detail?.network || {};
  const safeEncode = (value, maxLen = 120) => {
    if (value === null || typeof value === "undefined") {
      return "";
    }

    const normalized = String(value).replace(/\s+/g, " ").trim().slice(0, maxLen);
    return encodeURIComponent(normalized);
  };

  const parts = [
    `type=${safeEncode(detail?.type || "internet_issue", 64)}`,
    `source=${safeEncode(detail?.source || "unknown", 64)}`,
    `module=${safeEncode(detail?.module || "", 64)}`,
    `requestType=${safeEncode(detail?.requestType || "", 64)}`,
    `status=${safeEncode(detail?.status ?? "", 32)}`,
    `code=${safeEncode(detail?.code || "", 64)}`,
    `url=${safeEncode(detail?.resourceUrl || detail?.url || "", 140)}`,
    `pageUrl=${safeEncode(detail?.pageUrl || "", 140)}`,
    `retryable=${safeEncode(typeof detail?.retryable === "boolean" ? String(detail.retryable) : "", 8)}`,
    `attempt=${safeEncode(detail?.attempt || "", 8)}`,
    `online=${safeEncode(network?.online === false ? "0" : "1", 1)}`,
    `effectiveType=${safeEncode(network?.effectiveType || "", 16)}`,
    `downlink=${safeEncode(network?.downlinkMbps ?? "", 12)}`,
    `rtt=${safeEncode(network?.rttMs ?? "", 12)}`,
    `saveData=${safeEncode(network?.saveData === true ? "1" : "0", 1)}`,
  ];

  return parts.join("|").slice(0, 480);
}

const theme = createTheme({
  palette: { primary: { main: "#CC0033" } },
  components: {
    MuiButtonBase: { defaultProps: { disableRipple: true } },
  },
});

function ClientMetricaProvider({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <MetricaExperimentsContext.Provider value={{ flags: {}, ready: false }}>
        {children}
      </MetricaExperimentsContext.Provider>
    );
  }

  return (
    <MetricaExperimentsProvider clientId="metrika.47085879">
      {children}
    </MetricaExperimentsProvider>
  );
}

function MetricaTLT() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            var _tmr = window._tmr || (window._tmr = []);
            _tmr.push({id: "3321706", type: "pageView", start: (new Date()).getTime()});
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
    </>
  );
}

function MetricaTLT2() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            var _tmr = window._tmr || (window._tmr = []);
            _tmr.push({id: "3637103", type: "pageView", start: (new Date()).getTime()});
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
    </>
  );
}

function MetricaTLT3() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            var _tmr = window._tmr || (window._tmr = []);
            _tmr.push({id: "3646239", type: "pageView", start: (new Date()).getTime()});
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
    </>
  );
}

function MetricaSMR() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            var _tmr = window._tmr || (window._tmr = []);
            _tmr.push({id: "3588691", type: "pageView", start: (new Date()).getTime()});
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
    </>
  );
}

function MetricaSMR2() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            var _tmr = window._tmr || (window._tmr = []);
            _tmr.push({id: "3621394", type: "pageView", start: (new Date()).getTime()});
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
    </>
  );
}

function AppErrorFallback({ city, resetError }) {
  const homeHref = city ? `/${city}` : "/";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background:
          "radial-gradient(1200px 600px at 10% -10%, rgba(204, 0, 51, 0.08), transparent 60%), #f7f7f8",
      }}
    >
      <div
        style={{
          maxWidth: "560px",
          width: "100%",
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "20px",
          boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
          padding: "28px 24px",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: "0 0 12px", fontSize: "28px" }}>Страница загрузилась с ошибкой</h1>
        <p style={{ margin: "0 0 20px", color: "#6b7280", lineHeight: 1.5 }}>
          Похоже, часть скриптов или данных не успела загрузиться из-за нестабильного соединения.
          Попробуйте обновить страницу.
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={() => {
              resetError();
              if (typeof window !== "undefined") {
                window.location.reload();
              }
            }}
            style={{
              border: "none",
              borderRadius: "999px",
              background: "#cc0033",
              color: "#ffffff",
              padding: "12px 18px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Обновить страницу
          </button>

          <a
            href={homeHref}
            style={{
              borderRadius: "999px",
              border: "1px solid #d1d5db",
              color: "#111827",
              padding: "12px 18px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            На главную
          </a>
        </div>
      </div>
    </div>
  );
}

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const previousPageUrlRef = useRef("");
  const internetIssueTrackerRef = useRef({});
  const city = (pageProps)?.data1?.city;
  const cityCounterId = city === "samara" ? 100325084 : city === "togliatti" ? 100601350 : null;
  const isOnlyPayPage = city === "only-pay-page";

  useEffect(() => {
    const handleRouteChangeError = (error, url) => {
      if (!isChunkLoadError(error)) {
        return;
      }

      Sentry.withScope((scope) => {
        scope.setTag("kind", "chunk_load_error");
        scope.setTag("source", "routeChangeError");
        scope.setContext("connectivity", getClientNetworkContext());
        scope.setExtra("failedRoute", url);
        Sentry.captureException(error);
      });

      maybeReloadAfterChunkError({
        source: "routeChangeError",
        failedRoute: url,
      });
    };

    router.events.on("routeChangeError", handleRouteChangeError);

    return () => {
      router.events.off("routeChangeError", handleRouteChangeError);
    };
  }, [router.events]);

  useEffect(() => {
    if (isOnlyPayPage || typeof window === "undefined") {
      return undefined;
    }

    const initialUrl = window.location.href;
    previousPageUrlRef.current = initialUrl;

    hitAll(initialUrl, {
      title: document.title,
      referer: document.referrer || undefined,
    });

    const handleRouteChangeComplete = (url) => {
      const nextUrl = new URL(url, window.location.origin).toString();
      const referer = previousPageUrlRef.current || document.referrer || undefined;

      window.setTimeout(() => {
        hitAll(nextUrl, {
          title: document.title,
          referer,
        });
      }, 0);

      previousPageUrlRef.current = nextUrl;
    };

    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [isOnlyPayPage, router.events]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const onInternetIssue = (event) => {
      const detail = event?.detail || {};
      const signature = buildInternetIssueSignature(detail);
      const now = Date.now();
      const previousTs = internetIssueTrackerRef.current[signature] || 0;

      if (now - previousTs < INTERNET_ISSUE_SAVE_ACTION_DEDUP_MS) {
        return;
      }

      internetIssueTrackerRef.current[signature] = now;

      const ymPayload = buildInternetIssueTrackingPayload(detail);
      reachGoal(INTERNET_ISSUE_CUSTOM_EVENT, ymPayload);

      useProfileStore
        .getState()
        .saveUserActions(INTERNET_ISSUE_CUSTOM_EVENT, buildInternetIssueCustomData(detail));
    };

    window.addEventListener(INTERNET_ISSUE_EVENT_NAME, onInternetIssue);

    return () => {
      window.removeEventListener(INTERNET_ISSUE_EVENT_NAME, onInternetIssue);
    };
  }, []);

  const appContent = isOnlyPayPage ? (
    <ClientMetricaProvider>
      <Component {...pageProps} />
    </ClientMetricaProvider>
  ) : (
    <>
      <Script
        id="varioqub"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(v,a,r,i,o,q,u,b){
              v[o]=v[o]||function(){(v[o].a=v[o].a||[]).push(arguments)};
              q=a.createElement(r);
              q.async=true;
              q.src=i;
              u=a.getElementsByTagName(r)[0];
              u && u.parentNode && u.parentNode.insertBefore(q,u);
              q.addEventListener('error', function(){
                function fn(args){
                  b=args[args.length - 1];
                  if(typeof b === 'function'){
                    b({ flags: {} });
                  }
                }
                (v[o].a || []).forEach(fn);
                v[o] = function(){
                  fn(arguments);
                };
              });
            })(window, document, 'script', 'https://abt.s3.yandex.net/expjs/latest/exp.js', 'ymab');
          `,
        }}
      />

      {/* YM init (после интерактива) */}
      <Script id="ym-init" strategy="afterInteractive">
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

          ${cityCounterId ? `
            ym(${cityCounterId}, 'init', {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true,
              defer:true,
              ecommerce:"dataLayer"
            });
          ` : ''}
        `}
      </Script>

      {/* карты */}
      <Script
        id="ymaps"
        strategy="afterInteractive"
        src={`https://api-maps.yandex.ru/2.1/?apikey=${process.env.NEXT_PUBLIC_YANDEX_TOKEN_MAP}&lang=ru_RU`}
        onLoad={() => {
          if (typeof window !== "undefined") {
            window.__JACO_YMAPS_FAILED = false;
          }
        }}
        onError={() => {
          if (typeof window !== "undefined") {
            window.__JACO_YMAPS_FAILED = true;
          }
        }}
      />

      {/* Top.Mail по городу */}
      {city === "togliatti" ? <MetricaTLT /> : null}
      {city === "togliatti" ? <MetricaTLT2 /> : null}
      {city === "togliatti" ? <MetricaTLT3 /> : null}

      {city === "samara" ? <MetricaSMR /> : null}
      {city === "samara" ? <MetricaSMR2 /> : null}

      {/* Header */}
      {!pageProps ||
      (pageProps)?.statusCode === 404 ||
      (pageProps)?.statusCode === 500 ||
      typeof (pageProps)?.data1?.city === "undefined" ||
      !(pageProps)?.data1?.page ? null : (
        <Header
          city={(pageProps)?.data1?.city}
          cats={(pageProps)?.data1?.cats}
          city_list={(pageProps)?.data1?.cities}
        />
      )}

      <ClientMetricaProvider>
        <Component {...pageProps} />
      </ClientMetricaProvider>
    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <Sentry.ErrorBoundary
        fallback={({ resetError }) => <AppErrorFallback city={city} resetError={resetError} />}
        beforeCapture={(scope) => {
          scope.setTag("surface", "app-root");
          scope.setContext("connectivity", getClientNetworkContext());
          scope.setExtra("city", city || null);
          scope.setExtra("pageUrl", typeof window !== "undefined" ? window.location.href : null);
        }}
      >
        {appContent}
      </Sentry.ErrorBoundary>
    </ThemeProvider>
  );
}
