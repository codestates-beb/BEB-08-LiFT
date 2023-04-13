// db에 데이터 조회
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

const prisma = new PrismaClient();

async function updateWishlist(userId: string, dnftId: string) {
  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: {
        userId: userId,
      },
    });

    const originWishlist =
      wishlist?.dnftIds != null && wishlist.dnftIds != ''
        ? wishlist.dnftIds.split(',')
        : [];

    const isWished = originWishlist.includes(dnftId);

    const newWishlist = isWished
      ? originWishlist.filter((id) => id != dnftId)
      : [...originWishlist, dnftId];

    const response = await prisma.wishlist.upsert({
      where: {
        userId,
      },
      update: {
        dnftIds: newWishlist.join(','),
      },
      create: {
        userId,
        dnftIds: newWishlist.join(','),
      },
    });

    console.log(response);

    return response?.dnftIds.split(',');
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
  const { dnftId } = JSON.parse(req.body);

  if (session == null) {
    res.status(200).json({ dnfts: [], message: 'no Session' });
    return;
  }
  console.log('aaaaaa' + session.address);
  try {
    const wishlist = await updateWishlist(
      String(session.address),
      String(dnftId)
    );
    res.status(200).json({ dnfts: wishlist, message: 'Success' });
  } catch (error) {
    res.status(400).json({ message: 'Failed' });
  }
}
