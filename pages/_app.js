import '../styles/globals.scss'

import '../styles/akcii.scss'
import '../styles/contacts.scss'
import '../styles/about.scss'

import '../styles/cityForm.scss'
import '../styles/loginForm.scss'
import '../styles/header.scss'
import '../styles/footer.scss'

//pm2 delete test-app-new && rm -rf test-app-new && git clone https://github.com/vito3315/test-app-new.git && cd test-app-new
//npm install && npm run build && pm2 start npm --name "test-app-new" -- start

function MyApp({ Component, pageProps }) {
  return (
    <Component {...pageProps} />
  )
}

export default MyApp
