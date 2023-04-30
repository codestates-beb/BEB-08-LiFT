// db에 데이터 조회
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

const prisma = new PrismaClient();

async function getMyDNFT(userId: string) {
  try {
    const myDNFT =
      await prisma.$queryRaw`SELECT * FROM nft as d WHERE d.owner_address=${userId};`;

    console.log(myDNFT);
    return myDNFT;
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
  const session = await getServerSession(req, res, authOptions);
  console.log('session' + JSON.stringify(session.address));

  if (session == null) {
    res.status(200).json({ dnfts: [], message: 'no Session' });
    return;
  }

  try {
    const wishlist = await getMyDNFT(String(session.address));
    res.status(200).json({ dnfts: wishlist, message: 'Success' });
  } catch (error) {
    res.status(400).json({ message: 'Failed' });
  }
}
