// db에 데이터 조회
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateDNFTInfo(id: number, contents: string) {
  try {
    const response = await prisma.dnfts.update({
      where: {
        id: id,
      },
      data: {
        contents: contents,
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
  const { id, contents } = JSON.parse(req.body)
  if (id == null || contents == null) {
    res.status(400).json({ message: 'no id or contents' })
    return
  }
  try {
    const dnfts = await updateDNFTInfo(Number(id), contents)
    res.status(200).json({ dnfts: dnfts, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
