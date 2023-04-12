// 로그인 후 user 정보 저장 => 새로운 회원이면 새로 형성 후 저장, 혹은 수정 사항이 있을 시 적용, 그외에는 실행되지 않음.
// session에 정보가 담겨 있는 만큼 session을 가져와서 적용
//!  jwtDecode가 필요한지는 확인 필요

import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import jwtDecode from 'jwt-decode'

const prisma = new PrismaClient()

async function signUp(address: string) {
  // const decoded: {
  //   name: string
  //   address: string
  //   image: string
  //   expires: string
  // } = jwtDecode(address) // 이게 필요 없지 않나? decode할게 없는데 .....

  try {
    // upsert : 없으면 생성
    const response = await prisma.user.upsert({
      where: {
        address: address,
      },
      update: {},
      create: {
        address: address,
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
  const { address } = req.query
  try {
    const dnfts = await signUp(String(address))
    res.status(200).json({ dnfts: dnfts, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
