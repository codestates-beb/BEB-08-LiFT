// db에 데이터 입력
import type { NextApiRequest, NextApiResponse } from 'next'
import { Client } from '@notionhq/client'

const notion = new Client({
  auth: 'secret_KVcAo09Bln9wipOU2jCDxOWCbdr7Yuth0FrZqFHqOaQ',
  // 내부 통합 토큰 secreat 값
})

const databaseId = '1a83014b630148dcae71b4a31c5a48a9'

async function getDNFTs() {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'price',
          direction: 'ascending',
        },
      ],
    })
    console.log(response)
    return response
  } catch (error) {
    console.error(JSON.stringify(error))
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
  try {
    const response = await getDNFTs()
    res.status(200).json({ dnfts: response?.results, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
