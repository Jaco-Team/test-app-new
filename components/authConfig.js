import GoogleProvider from 'next-auth/providers/google';
import VkProvider from 'next-auth/providers/vk';
import YandexProvider from 'next-auth/providers/yandex';

import { api } from './api.js';

console.log( 'process.env.NEXTAUTH_SECRET', process.env.NEXTAUTH_SECRET )
console.log( 'process.env', process.env )

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    VkProvider({
      clientId: process.env.VK_CLIENT_ID,
      clientSecret: process.env.VK_CLIENT_SECRET,
    }),
    YandexProvider({
      clientId: process.env.YANDEX_CLIENT_ID,
      clientSecret: process.env.YANDEX_CLIENT_SECRET,
    }),
  ], 
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {

      

      //console.log( 'calback singin user', user )
      //console.log( 'calback singin account', account )
      //console.log( 'calback singin profile', profile )
      //console.log( 'calback singin email', email )
      //console.log( 'calback singin credentials', credentials )

      //console.log( 'account.provider', account.provider )

      if( account.provider == 'yandex' ){
        const data = {
          type: 'auth_yandex',
          
          name: profile.display_name,
          email: profile.default_email,
          birthday: profile.birthday,
          number: profile.default_phone.number
          
        };
    
        const json = await api('auth', data);

        profile.user_id = json?.id;

        return json.st;
      }


      //const isAllowedToSignIn = true
      //if (isAllowedToSignIn) {
        //return true
      //} else {
        // Return false to display a default error message
      return false
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      //}
    },

    async session({ session, user, token }) {

      //console.log('session', session)
      //console.log('user', user)
      //console.log('token', token)

      session.user = token.user;
      session.user_id = token.user.user_id;

      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (profile) {
        token.user = profile;
      }

      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET
};
