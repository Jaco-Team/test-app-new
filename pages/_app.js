import '../styles/globals.scss'

import '../styles/akcii.scss'

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

//pm2 delete test-app-new && rm -rf test-app-new && git clone https://github.com/vito3315/test-app-new.git && cd test-app-new
//npm install && npm run build && pm2 start npm --name "test-app-new" -- start

import { createTheme, ThemeProvider } from '@mui/material/styles';

import YandexMetrika from '@/components/YandexMetrika';
import { GoogleTagManager } from '@next/third-parties/google'

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

export function reportWebVitals(metric) {
  console.log(metric)
}

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

function MetricaSMR(){
  return ( 
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            var _tmr = window._tmr || (window._tmr = []);
            _tmr.push({id: "3321699", type: "pageView", start: (new Date()).getTime()});
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
      <noscript><div><img src="https://top-fwz1.mail.ru/counter?id=3321699;js=na" style={{position: 'fixed', left: '-9999px'}} alt="Top.Mail.Ru" /></div></noscript>
    </>
  )
}

function MyApp({ Component, pageProps: { ...pageProps } }) {

  return (
    <ThemeProvider theme={theme}>
      <YandexMetrika 
        yid={47085879}
        clickmap={true}
        trackLinks={true}
        accurateTrackBounce={true}
        webvisor={true}
      />
      <YandexMetrika 
        yid={95918584}
        clickmap={true}
        trackLinks={true}
        accurateTrackBounce={true}
        webvisor={true}
      />
      <GoogleTagManager gtmId="UA-148366601-1" />
      
      <script
        dangerouslySetInnerHTML={{
          __html: `
            !function(){var t=document.createElement("script");t.type="text/javascript",t.async=!0,t.src="https://vk.com/js/api/openapi.js?162",t.onload=function(){VK.Retargeting.Init("VK-RTRG-409134-7MvqQ"),VK.Retargeting.Hit()},document.head.appendChild(t)}();
          `,
        }}
      />
      <noscript><img src="https://vk.com/rtrg?p=VK-RTRG-409134-7MvqQ" style={{position: 'fixed', left: '-999px'}} alt=""/></noscript>

      { pageProps?.data1?.city == 'togliatti' ? <MetricaTLT /> : null }
      { pageProps?.data1?.city == 'samara' ? <MetricaSMR /> : null }

      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
