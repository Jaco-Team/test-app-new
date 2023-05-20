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

import '../styles/header/cityForm.scss'
import '../styles/header/headerPC.scss'
import '../styles/header/basketPC.scss'

//import '../styles/profile.scss'
import '../styles/profile/promokody.scss'
import '../styles/profile/zakazy.scss'
import '../styles/profile/profile.scss'

// import '../styles/loginForm.scss'
import '../styles/header.scss'
import '../styles/footer.scss'
import '../styles/docsBreadcrumbs.scss'

//pm2 delete test-app-new && rm -rf test-app-new && git clone https://github.com/vito3315/test-app-new.git && cd test-app-new
//npm install && npm run build && pm2 start npm --name "test-app-new" -- start

import { createTheme, ThemeProvider } from '@mui/material/styles';

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
  breakpoints: {
    values: {
      xs: 0,
      //sm: 600,
      sm: 680,
      //md: 900,
      md: 1000,
      //lg: 1200,
      lg: 1385,
      //xl: 1536,
    },
  },
})

export function reportWebVitals(metric) {
  console.log(metric)
}

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
