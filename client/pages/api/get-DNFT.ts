// db에 데이터 조회
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getDNFT(id: number) {
  try {
    const response = await prisma.nft.findUnique({
      where: {
        id: id,
      },
    });
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
  const { id } = req.query;
  if (id == null) {
    res.status(400).json({ message: 'no id' });
    return;
  }
  try {
    const dnfts = await getDNFT(Number(id));
    res.status(200).json({ dnfts: dnfts, message: 'Success' });
  } catch (error) {
    res.status(400).json({ message: 'Failed' });
  }
}
