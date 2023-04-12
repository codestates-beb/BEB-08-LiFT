// db에 데이터 조회
import type { NextApiRequest, NextApiResponse } from 'next'
import { Cart, PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'

const prisma = new PrismaClient()

async function addCart(userId: string, item: Omit<Cart, 'id' | 'userId'>) {
  // omit : db가 업데이트하면서 id를 생성한다.
  try {
    const response = await prisma.cart.create({
      data: {
        userId,
        ...item,
      },
    })

    console.log(response)

    return response
  } catch (error) {
    console.error(error)
  }
}

type Data = {
  dnfts?: any
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await getServerSession(req, res, authOptions)
  const { item } = JSON.parse(req.body)

  if (session == null) {
    res.status(200).json({ dnfts: [], message: 'no Session' })
    return
  }

  try {
    const wishlist = await addCart(String(session), item)
    res.status(200).json({ dnfts: wishlist, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
