import GoogleProvider from 'next-auth/providers/google';
import VkProvider from 'next-auth/providers/vk';
import YandexProvider from 'next-auth/providers/yandex';

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

      console.log( 'calback singin', user, account, profile, email, credentials )

      //const isAllowedToSignIn = true
      //if (isAllowedToSignIn) {
        return true
      //} else {
        // Return false to display a default error message
      //  return false
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      //}
    },

    async session({ session, user, token }) {
      session.user = token.user;

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
