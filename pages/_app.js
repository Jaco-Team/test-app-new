import '../styles/globals.scss'

import '../styles/akcii.scss'
import '../styles/about.scss'
import '../styles/publichnaya-oferta.scss'
import '../styles/politika-konfidencialnosti.scss'
import '../styles/legal.scss'
import '../styles/instpayorders.scss'
import '../styles/jobs.scss'

import '../styles/contacts/contacts.scss'
import '../styles/header/loginForm.scss'

import '../styles/home.scss'
import '../styles/home/homePC.scss'
import '../styles/home/bannersPC.scss'
import '../styles/home/bannersMobile.scss'

import '../styles/header/cityFormPC.scss'
import '../styles/header/cityFormMobile.scss'
import '../styles/header/headerPC.scss'
import '../styles/header/headerMobile.scss'
import '../styles/header/basketPC.scss'

import '../styles/profile/promokody.scss'
import '../styles/profile/zakazy.scss'
import '../styles/profile/profile.scss'
import '../styles/profile/zakazy_modalOrder.scss'
import '../styles/profile/zakazy_modalOrderDelete.scss'

import '../styles/header.scss'
import '../styles/footer/footerPC.scss'
import '../styles/footer/footerMobile.scss'
import '../styles/docsBreadcrumbs.scss'





//pm2 delete test-app-new && rm -rf test-app-new && git clone https://github.com/vito3315/test-app-new.git && cd test-app-new
//npm install && npm run build && pm2 start npm --name "test-app-new" -- start

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { SessionProvider } from "next-auth/react";

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

function MyApp({ Component, pageProps: { session, ...pageProps } }) {

  return (
    <ThemeProvider theme={theme}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </ThemeProvider>
  )
}

export default MyApp
