// db에 데이터 조회
import type { NextApiRequest, NextApiResponse } from 'next';
import { OrderItem, PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

const prisma = new PrismaClient();

async function getOrder(userId: string) {
  try {
    // orders 테이블에서 나의 주문들을 조회한다.

    const orders = await prisma.orders.findMany({
      where: {
        userId: userId,
      },
    });

    console.log(orders);

    let response = [];
    // orders 안에 있는 orderItemIds로 orderItem을 꺼내고 dnfts 테이블에서 정보를 조합한다.

    for (const order of orders) {
      let orderItems: OrderItem[] = [];
      for (const id of order.orderItemIds
        .split(',')
        .map((item) => Number(item))) {
        const res: OrderItem[] = await prisma.$queryRaw`
        SELECT i.id, amount, name, image_url FROM OrderItem as i JOIN dnfts as d ON  i.dnftId = d.id WHERE i.id=${id};`;
        orderItems.push.apply(orderItems, res);
      }
      response.push({ ...order, orderItems });
    }

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
  console.log('session' + JSON.stringify(session.address));

  if (session == null) {
    res.status(200).json({ dnfts: [], message: 'no Session' });
    return;
  }

  try {
    const wishlist = await getOrder(String(session.address));
    res.status(200).json({ dnfts: wishlist, message: 'Success' });
  } catch (error) {
    res.status(400).json({ message: 'Failed' });
  }
}
