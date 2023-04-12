import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import { getCsrfToken } from 'next-auth/react'
import { SiweMessage } from 'siwe'

const prisma = new PrismaClient()

export default async function auth(req: any, res: any) {
  const providers = [
    CredentialsProvider({
      name: 'Ethereum',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
      },
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || '{}'))
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL)

          const result = await siwe.verify({
            signature: credentials?.signature || '',
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req }),
          })

          if (result.success) {
            return {
              id: siwe.address,
            }
          }
          return null
        } catch (e) {
          return null
        }
      },
    }),
  ]

  const isDefaultSigninPage =
    req.method === 'GET' && req.query.nextauth.includes('signin')

  // Hide Sign-In with Ethereum from default sign page
  if (isDefaultSigninPage) {
    providers.pop()
  }

  return await NextAuth(req, res, {
    // https://next-auth.js.org/configuration/providers/oauth

    providers,
    session: {
      strategy: 'jwt',
      //maxAge: 10 * 24 * 60 * 60,
    },

    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async session({
        session,
        token,
      }: // user,
      {
        session: any
        token: any
        // user: any
      }) {
        session.address = token.sub
        session.user.name = token.sub
        session.user.image = 'https://picsum.photos/id/1015/1000/600/'
        // session.id = user.id
        return session // Promise.resolve(session)
      },
    },
    adapter: PrismaAdapter(prisma),
  })
}
