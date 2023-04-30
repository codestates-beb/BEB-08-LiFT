// db에 데이터 조회
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getOrderBy } from '@/utils/getorder';

const prisma = new PrismaClient();

async function getDNFTs({
  skip,
  take,
  // category,
  orderBy,
  contains,
}: {
  skip: number;
  take: number;
  // category: number;
  orderBy: string;
  contains: string;
}) {
  const containCondition =
    contains && contains != ''
      ? {
          name: { contains: contains },
        }
      : undefined;

  const where = containCondition;
  // category && category != -1
  //   ? {
  //       category_id: category,
  //       ...containCondition,
  //     }
  //   : containCondition
  //   ? containCondition
  //   : undefined;

  const orderByCondition = getOrderBy(orderBy);

  console.log(where);
  // api 조회

  try {
    const response = await prisma.nft.findMany({
      skip: skip,
      take: take,
      //...orderByCondition,
      where: where, // {}: 객체 내용물 : ...
      // orderBy: {
      //   price: 'asc', // 낮은 가격 순서대로
      // },
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
  const { skip, take, category, orderBy, contains } = req.query;

  if (skip == null || take == null) {
    res.status(400).json({ message: 'no skip or take' });
  }

  // TODO: 보안상 다른 문자가 오면 에러를 발생시켜야 한다.
  try {
    const dnfts = await getDNFTs({
      // 객체로 만들어서 순서와 유무의 상관관계를 없앤다.
      skip: Number(skip),
      take: Number(take),
      // category: Number(category),
      orderBy: String(orderBy),
      contains: contains ? String(contains) : '', // 이렇게 해줌으로써 undefined를 검색하지 않도록 한다.
    });

    res.status(200).json({ dnfts: dnfts, message: 'Success' });
  } catch (error) {
    res.status(400).json({ message: 'Failed' });
  }
}
