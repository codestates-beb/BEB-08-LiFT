// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'John Doe' })
}

/*
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import { CLIENT_ID, CLIENT_SECRET } from '@/constants/clinets'

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: 'database',
    maxAge: 10 * 24 * 60 * 60,
    // session 기간 = 10일로 설정   47
  },
  callbacks: {
    session: async ({ session, user }) => {
      session.id = user.id
      return Promise.resolve(session)
    },
  },
}

export default NextAuth(authOptions)
*/
