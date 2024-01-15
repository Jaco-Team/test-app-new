import '../styles/globals.scss'

import '../styles/akcii.scss'

import '../styles/cart/cartMobile.scss'
import '../styles/cart/cartMenuMobile.scss'
import '../styles/cart/cartDataTimePicker.scss'
import '../styles/cart/cartMapPoints.scss'

import '../styles/about/aboutPC.scss'
import '../styles/about/aboutMobile.scss'

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

import '../styles/header.scss' // этот нужен??
import '../styles/badge_item.scss'

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
