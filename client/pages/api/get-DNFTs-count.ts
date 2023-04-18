// db에 데이터 조회
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getDNFTsCount(category: number, contains: string) {
  const containCondition =
    contains && contains !== ''
      ? {
          name: { contains: contains },
        }
      : undefined;

  // 추후 카테고리가 만들어질 시 자동 활성화
  const where =
    category && category != -1
      ? {
          category_id: category,
          ...containCondition,
        }
      : containCondition
      ? containCondition
      : undefined;

  try {
    const response = await prisma.nft.count({ where: where });
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

type Data = {
  dnfts?: any;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { category, contains } = req.query;
  try {
    const dnfts = await getDNFTsCount(Number(category), String(contains));
    res.status(200).json({ dnfts: dnfts, message: 'Success' });
  } catch (error) {
    res.status(400).json({ message: 'Failed' });
  }
}
