// db에 데이터 조회
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

const prisma = new PrismaClient();

async function getCart(userId: string) {
  try {
    const cart =
      await prisma.$queryRaw`SELECT c.id, userId, name, ipfs_url, dnftId FROM  Cart as c JOIN nft as d WHERE c.dnftId = d.id AND c.userId=${userId};`;

    console.log(cart);
    return cart;
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
    const wishlist = await getCart(String(session.address));
    res.status(200).json({ dnfts: wishlist, message: 'Success' });
  } catch (error) {
    res.status(400).json({ message: 'Failed' });
  }
}
