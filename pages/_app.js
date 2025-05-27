import '../styles/globals.scss'

import '../styles/akcii/akciiPC.scss'
import '../styles/akcii/akciiMobile.scss'

import '../styles/cart/cartMobile.scss'
import '../styles/cart/cartMenuMobile.scss'
import '../styles/cart/cartDataTimePicker.scss'
import '../styles/cart/cartMapPoints.scss'
import '../styles/cart/cartPayForm.scss'

import '../styles/about/aboutPC.scss'
import '../styles/about/aboutMobile.scss'
import '../styles/about/documentMobile.scss'

import '../styles/pageText/pageTextMobile.scss'
import '../styles/pageText/pageTextPC.scss'

import '../styles/legal.scss'
import '../styles/jobs.scss'

import '../styles/contacts/contactsMobile.scss'
import '../styles/contacts/contactsPC.scss'

import '../styles/home/cardItemPC.scss'
import '../styles/home/cardItemMobile.scss'

import '../styles/home/bannersPC.scss'
import '../styles/home/bannersMobile.scss'

import '../styles/home/menuCatMobile.scss'

import '../styles/header/loginFormPC.scss'
import '../styles/header/loginFormMobile.scss'

import '../styles/header/cityFormPC.scss'
import '../styles/header/cityFormMobile.scss'

import '../styles/header/headerPC.scss'
import '../styles/header/headerMobile.scss'

import '../styles/header/basketPC.scss'
import '../styles/header/basketModalPC.scss'
import '../styles/header/basketDataTimePicker.scss'

import '../styles/profile/accountMobile.scss'
import '../styles/profile/addressMobile.scss'

import '../styles/profile/profilePC.scss'
import '../styles/profile/profileMobile.scss'
import '../styles/profile/profile_modalMobile.scss'

import '../styles/profile/promokodyPC.scss'
import '../styles/profile/promokodyMobile.scss'
import '../styles/profile/profile_modalAddr.scss'

import '../styles/profile/zakazyPC.scss'
import '../styles/profile/zakazy_modalOrder.scss'
import '../styles/profile/zakazy_modalOrderDelete.scss'

import '../styles/profile/zakazyMobile.scss'

import '../styles/docsBreadcrumbs.scss'

import '../styles/footer/footerPC.scss'
import '../styles/footer/footerMobile.scss'

import '../styles/header/modalAlert.scss'
import '../styles/header/modalSelect.scss'

import '../styles/header.scss' // этот нужен??
import '../styles/badge_item.scss'

import '../styles/home/filter.scss'

import '../styles/cart/cartConfirmForm.scss'
import '../styles/cart/cartMailForm.scss'

//pm2 delete test-app-new && rm -rf test-app-new && git clone https://github.com/vito3315/test-app-new.git && cd test-app-new
//npm install && npm run build && pm2 start npm --name "test-app-new" -- start
import { useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Script from 'next/script';

import YandexMetrika from '@/components/YandexMetrika';
//import { GoogleTagManager } from '@next/third-parties/google'

//import * as Sentry from "@sentry/browser";

import Header from '@/components/header';

const theme = createTheme({
  palette: {
    primary: {
      main: '#CC0033',
    },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
})

// Sentry.init({
//   dsn: "https://7ce2cfe591e41713764963222cf849f4@sentry.jacochef.ru/5",

//   // Alternatively, use `process.env.npm_package_version` for a dynamic release version
//   // if your build tool supports it.
//   release: "site_new@1.1.28",
//   //traces_sample_rate: 1,
//   //profiles_sample_rate: 1,
//   allowUrls: [/https?:\/\/((cdn|www)\.)?jacofood\.ru/],
//   integrations: [
//     Sentry.browserTracingIntegration(),
//     //Sentry.replayIntegration(),
//   ],

//   // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
//   //tracePropagationTargets: [/^https:\/\/new\.jacofood\.ru/],

// });

/*export function reportWebVitals(metric) {
  console.log(metric)
}*/

function MetricaTLT(){
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
      <noscript><div><img src="https://top-fwz1.mail.ru/counter?id=3321706;js=na" style={{position: 'fixed', left: '-9999px'}} alt="Top.Mail.Ru" /></div></noscript>
    </>
  )
}

function MetricaTLT2(){
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
      <noscript><div><img src="https://top-fwz1.mail.ru/counter?id=3637103;js=na" style={{position: 'fixed', left: '-9999px'}} alt="Top.Mail.Ru" /></div></noscript>
    </>
  )
}

function MetricaTLT3(){
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
      <noscript><div><img src="https://top-fwz1.mail.ru/counter?id=3646239;js=na" style={{position: 'fixed', left: '-9999px'}} alt="Top.Mail.Ru" /></div></noscript>
    </>
  )
}

function MetricaSMR(){
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
      <noscript><div><img src="https://top-fwz1.mail.ru/counter?id=3588691;js=na" style={{position: 'fixed', left: '-9999px'}} alt="Top.Mail.Ru" /></div></noscript>
    </>
  )
}

function MetricaSMR2(){
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
      <noscript><div><img src="https://top-fwz1.mail.ru/counter?id=3621394;js=na" style={{position: 'absolute', left: '-9999px'}} alt="Top.Mail.Ru" /></div></noscript>
    </>
  )
}

function MetricaRoistat(){
  return ( 
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function(w, d, s, h, id) {
              w.roistatProjectId = id; w.roistatHost = h;
              var p = d.location.protocol == "https:" ? "https://" : "http://";
              var u = /^.*roistat_visit=[^;]+(.*)?$/.test(d.cookie) ? "/dist/module.js" : "/api/site/1.0/"+id+"/init?referrer="+encodeURIComponent(d.location.href);
              var js = d.createElement(s); js.charset="UTF-8"; js.async = 1; js.src = p+h+u; var js2 = d.getElementsByTagName(s)[0]; js2.parentNode.insertBefore(js, js2);
            })(window, document, 'script', 'cloud.roistat.com', 'fc957532ccc06d91de3b0c8c86e8a749');
          `,
        }}
      />
    </>
  )
}

function MyApp({ Component, pageProps: { ...pageProps } }) {

  useEffect( () => {
    if( typeof window !== "undefined" ){
      try{
        !function(){
          var t=document.createElement("script");
          t.type="text/javascript",
          t.async=!0,
          t.src="https://vk.com/js/api/openapi.js?162",
          t.onload=function(){
            VK?.Retargeting?.Init("VK-RTRG-409134-7MvqQ"),
            VK?.Retargeting?.Hit()
          },
          document.head.appendChild(t)
        }();
      }catch(err){
        console.log( err )
      }

      window.dataLayer = window.dataLayer || [];
    }
  }, [] )
  

  /*return (
    <ThemeProvider theme={theme}>
      
      

      { !pageProps || pageProps?.statusCode == 404 || pageProps?.statusCode == 500 || typeof pageProps?.data1?.city === 'undefined' ? false :
        <Header
          city={pageProps?.data1?.city}
          cats={pageProps?.data1?.cats}
          city_list={pageProps?.data1?.cities}
          //active_page={'other'}
        />
      }

      <Component {...pageProps} />
    </ThemeProvider>
  )*/
    

  if( pageProps?.data1?.city == 'only-pay-page' ){
    return (
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    )

  }
  //<GoogleTagManager gtmId="UA-148366601-1" />
  return (
    <ThemeProvider theme={theme}>

      <Script 
        src={"https://api-maps.yandex.ru/2.1/?apikey="+process.env.NEXT_PUBLIC_YANDEX_TOKEN_MAP+"&lang=ru_RU"}
      />

      <YandexMetrika 
        yid={47085879}
        clickmap={true}
        trackLinks={true}
        accurateTrackBounce={true}
        webvisor={false}
        ecommerce={false}
      />
      <YandexMetrika 
        yid={95918584}
        clickmap={true}
        trackLinks={true}
        accurateTrackBounce={true}
        webvisor={false}
        ecommerce={false}
      />
      <YandexMetrika 
        yid={97508970}
        clickmap={true}
        trackLinks={true}
        accurateTrackBounce={true}
        webvisor={false}
        ecommerce={false}
      />
      
      
      { pageProps?.data1?.city == 'samara' ?
        <YandexMetrika 
          yid={100325084}
          clickmap={true}
          trackLinks={true}
          accurateTrackBounce={true}
          webvisor={true}
          ecommerce={true}
        />
          :
        null
      }
          

      { pageProps?.data1?.city == 'togliatti' ?
        <YandexMetrika 
          yid={100601350}
          clickmap={true}
          trackLinks={true}
          accurateTrackBounce={true}
          webvisor={true}
          ecommerce={true}
        />
          :
        null
      }
      
      <noscript><img src="https://vk.com/rtrg?p=VK-RTRG-409134-7MvqQ" style={{position: 'fixed', left: '-999px'}} alt=""/></noscript>

      { pageProps?.data1?.city == 'togliatti' ? <MetricaTLT /> : null }
      { pageProps?.data1?.city == 'togliatti' ? <MetricaTLT2 /> : null }
      { pageProps?.data1?.city == 'togliatti' ? <MetricaTLT3 /> : null }
      
      { pageProps?.data1?.city == 'samara' ? <MetricaSMR /> : null }
      { pageProps?.data1?.city == 'samara' ? <MetricaSMR2 /> : null }

      

      { !pageProps || pageProps?.statusCode == 404 || pageProps?.statusCode == 500 || typeof pageProps?.data1?.city === 'undefined' || !pageProps?.data1?.page ? false :
        <Header
          city={pageProps?.data1?.city}
          cats={pageProps?.data1?.cats}
          city_list={pageProps?.data1?.cities}
          //active_page={'other'}
        />
      }

      <Component {...pageProps} />

      <MetricaRoistat />

      <input
        type="hidden"
        name="roistat_visit"
        value={typeof window !== "undefined" ? window.roistat?.getVisit?.() || "" : ""}
      />
    </ThemeProvider>
  )
}

export default MyApp
