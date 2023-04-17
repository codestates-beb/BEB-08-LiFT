import { Prisma, PrismaClient } from '@prisma/client';
import { address, tsHash } from './ganache_address';

const prisma = new PrismaClient();

export const WeatherDNFTs: Prisma.nftCreateInput[] = Array.apply(
  null,
  Array(30)
).map((_, idx) => ({
  name: `Weather DNFT ${idx + 1}`,
  description: `저는 Weather DNFT No.${idx + 1} 입니다.`,
  category_id: 1,
  owner_address: `${address[idx + 1]}`,
  ipfs_url: `https://picsum.photos/id/${Math.floor(
    Math.random() * (1000 - idx + 1)
  )}/1000/600`,
  tx_hash: `${tsHash[idx + 1]}`,
  price: Math.random() * (0.1 - 0.05) + 0.05,
}));

export const SportsDNFTs: Prisma.nftCreateInput[] = Array.apply(
  null,
  Array(30)
).map((_, idx) => ({
  name: `Sports DNFT ${idx + 1}`,
  description: `저는 Sports DNFT No.${idx + 1} 입니다.`,
  category_id: 2,
  owner_address: `${address[idx + 1]}`,
  ipfs_url: `https://picsum.photos/id/${Math.floor(
    Math.random() * (400 - idx + 1)
  )}/1000/600`,
  tx_hash: `${tsHash[idx + 1]}`,
  price: Math.random() * (0.1 - 0.05) + 0.05,
}));

// export const TimeDNFTs: Prisma.dnftsCreateInput[] = Array.apply(
//   null,
//   Array(30)
// ).map((_, idx) => ({
//   name: `Coin Price DNFT ${idx + 1}`,
//   contents: `저는 Coin Price DNFT No.${idx + 1} 입니다.`,
//   category_id: 3,
//   image_url: `https://picsum.photos/id/${Math.floor(
//     Math.random() * (700 - idx + 1)
//   )}/1000/600`,
//   price: Math.floor(Math.random() * (10 - 20) + 20),
// }));

export const productsItmes: Prisma.nftCreateInput[] = [
  ...WeatherDNFTs,
  ...SportsDNFTs,
];

const main = async () => {
  const CATEGORY_NAME = ['WeatherDNFT', 'SportsDNFT'];

  CATEGORY_NAME.forEach(async (name, idx) => {
    const category = await prisma.categories.upsert({
      where: {
        id: idx + 1,
      },
      update: {
        name: name,
      },
      create: {
        name: name,
      },
    });
    console.log(
      'category id : ',
      category.id,
      'category name : ',
      category.name
    );
  });

  // await prisma.products.deleteMany({});

  for (const p of productsItmes) {
    const product = await prisma.nft.create({
      data: p,
    });

    console.log(`== Created == : ${product.id} / ${product.name}`);
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
