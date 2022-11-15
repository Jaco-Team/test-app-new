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
  subsets: ['sans-serif'],
  variable: '--inter-font',
})

//pm2 delete test-app-new && rm -rf test-app-new && git clone https://github.com/vito3315/test-app-new.git && cd test-app-new
//npm install && npm run build && pm2 start npm --name "test-app-new" -- start

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} className={roboto.variable} />
}

export default MyApp
