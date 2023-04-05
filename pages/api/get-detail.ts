// db에 데이터 입력
import type { NextApiRequest, NextApiResponse } from 'next'
import { Client } from '@notionhq/client'

const notion = new Client({
  auth: 'secret_KVcAo09Bln9wipOU2jCDxOWCbdr7Yuth0FrZqFHqOaQ',
  // 내부 통합 토큰 secreat 값
})

const databaseId = '1a83014b630148dcae71b4a31c5a48a9'

async function getDetail(pageId: string, propertyId: string) {
  try {
    const response = await notion.pages.properties.retrieve({
      page_id: pageId,
      property_id: propertyId,
    })
    console.log(response)
    return response
  } catch (error) {
    console.error(JSON.stringify(error))
  }
}

type Data = {
  detail?: any
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { pageId, propertyId } = req.query
    const response = await getDetail(String(pageId), String(propertyId))
    res.status(200).json({ detail: response, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
