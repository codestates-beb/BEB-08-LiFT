import NextAuth, { NextAuthOptions } from 'next-auth';
import { MoralisNextAuthProvider } from '@moralisweb3/next';

export const authOptions: NextAuthOptions = {
  providers: [MoralisNextAuthProvider()],
  // adding user info to the user session object
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      (session as { user: unknown }).user = token.user;
      return session.user;
    },
  },
};

export default NextAuth(authOptions);
