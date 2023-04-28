// db에 데이터 조회
import type { NextApiRequest, NextApiResponse } from 'next';
import { OrderItem, PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

const prisma = new PrismaClient();

async function addOrder(
  userId: string,
  items: Omit<OrderItem, 'id'>[],
  orderInfo?: { receiver: string }
) {
  try {
    // orderItem 들을 만든다.

    let orderItemIds = [];

    for (const item of items) {
      const orderItem = await prisma.orderItem.create({
        data: {
          ...item,
        },
      });
      console.log(`Created id: ${orderItem.id}`);
      console.log(`Created dnftid: ${orderItem.dnftId}`);
      orderItemIds.push(orderItem.id);
    }

    console.log(JSON.stringify(orderItemIds));

    // 만들어진 orderItemIds 를 포함한 order를 만든다.
    const response = await prisma.orders.create({
      data: {
        userId,
        orderItemIds: orderItemIds.join(','),
        ...orderInfo,
        status: 0,
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
  const session = await getServerSession(req, res, authOptions);
  const { items, orderInfo } = JSON.parse(req.body);

  if (session == null) {
    res.status(200).json({ dnfts: [], message: 'no Session' });
    return;
  }

  try {
    const wishlist = await addOrder(String(session.address), items, orderInfo);
    res.status(200).json({ dnfts: wishlist, message: 'Success' });
  } catch (error) {
    res.status(400).json({ message: 'Failed' });
  }
}
