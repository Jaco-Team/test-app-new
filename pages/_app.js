import '../styles/globals.scss'

import '../styles/akcii.scss'
import '../styles/contacts.scss'

import '../styles/cityForm.scss'
import '../styles/loginForm.scss'
import '../styles/header.scss'
import '../styles/footer.scss'

import { Roboto } from '@next/font/google'

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['sans-serif']
})

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} className={roboto.className} />
}

export default MyApp
