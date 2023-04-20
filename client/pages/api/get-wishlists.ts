// db에 데이터 조회
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

const prisma = new PrismaClient();

async function getWishlists(userId: string) {
  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: {
        userId: userId,
      },
    });

    console.log(`wishlist: ${JSON.stringify(wishlist)}`);

    const dnftId = wishlist?.dnftIds.split(',').map((item) => Number(item));

    if (dnftId && dnftId.length > 0) {
      const response = await prisma.nft_test.findMany({
        where: {
          id: {
            in: dnftId,
          },
        },
      });
      console.log(response);
      return response;
    }

    return [];
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
  } // clg7rpt58000006jv7jefmty6

  try {
    const wishlist = await getWishlists(String(session.address));
    res.status(200).json({ dnfts: wishlist, message: 'Success' });
  } catch (error) {
    res.status(400).json({ message: 'Failed' });
  }
}
