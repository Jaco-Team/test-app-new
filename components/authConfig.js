import GoogleProvider from 'next-auth/providers/google';
import VkProvider from 'next-auth/providers/vk';
import YandexProvider from 'next-auth/providers/yandex';
import CredentialsProvider from "next-auth/providers/credentials"

import { api } from './api.js';

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
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        login: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        
        const data = {
          type: 'site_login',
          
          number: credentials.login,
          pwd: credentials.password
        };
    
        const json = await api('auth', data);

        if( json.st === true ){
          return {
            id: json.token,
            name: json.name,
            email: "",
            image: "",
          }
        }

        return false;
      }
    })
  ], 
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {

      if( account.provider == 'credentials' ){
        return true;
      }

      if( account.provider == 'yandex' ){
        const data = {
          type: 'auth_yandex',
          
          name: profile.display_name,
          email: profile.default_email,
          birthday: profile.birthday,
          number: profile.default_phone.number
        };
    
        const json = await api('auth', data);

        profile.token = json?.token;

        return json.st;
      }

      return false
    },
    
    async session({ session, user, token }) {

      console.log( 'token', token )
      console.log( 'user', user )
      console.log( 'session', session )

      session.user.token = token?.user?.token ?? token.sub;

      return session;
    },
    
    async jwt({ token, user, account, profile, isNewUser }) {
      if (profile) {
        token.user = profile;
      }
      return token
    }
  },
  session: {
    jwt: true, 
    // Seconds - How long until an idle session expires and is no longer valid.
    //maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET
};
