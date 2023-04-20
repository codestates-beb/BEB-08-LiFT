import { Prisma, PrismaClient } from '@prisma/client';
import { address, tsHash } from './ganache_address';

const prisma = new PrismaClient();

// export const WeatherDNFTs: Prisma.nft_testCreateInput[] = Array.apply(
//   null,
//   Array(30)
// ).map((_, idx) => ({
//   name: `Weather DNFT ${idx + 1}`,
//   description: `저는 Weather DNFT No.${idx + 1} 입니다.`,
//   owner_address: `${address[idx + 1]}`,
//   ipfs_url: `https://picsum.photos/id/${Math.floor(
//     Math.random() * (1000 - idx + 1)
//   )}/1000/600`,
//   nft_contract_address: `${tsHash[idx + 1]}`,
// }));

export const WeatherDNFTs: Prisma.nft_testCreateInput[] = Array.apply(
  null,
  Array(1)
).map((_, idx) => ({
<<<<<<< HEAD
  name: `Weather DNFT ${idx + 1}`,
  description: `저는 Weather DNFT No.${idx + 1} 입니다.`,
  creator_address: `${address[idx + 1]}`,
  ipfs_url: `https://picsum.photos/id/${Math.floor(
    Math.random() * (1000 - idx + 1)
  )}/1000/600`,
  tx_hash: `${tsHash[idx + 1]}`,
=======
  token_id: 1,
  name: `Munbai Weather DNFT ${idx + 1}`,
  description: `내가 만든 Mumbai Weather DNFT No.${idx + 1} 입니다.`,
  owner_address: '0x65CAFeFA9cb3bA556Efd416fE4281F2Ee30BB36b', // mumbai는 추후에 일단 ganache로 test
  ipfs_url: `https://picsum.photos/id/${Math.floor(
    Math.random() * (1000 - idx + 1)
  )}/1000/600`,
  nft_contract_address: '0x73D0b51B1fA88d83E9e029b983D8F70176b9c0A7',
>>>>>>> 9cb4d6046 (active sale)
}));

// export const SportsDNFTs: Prisma.nftCreateInput[] = Array.apply(
//   null,
//   Array(30)
// ).map((_, idx) => ({
//   name: `Sports DNFT ${idx + 1}`,
//   description: `저는 Sports DNFT No.${idx + 1} 입니다.`,
//   category_id: 2,
//   owner_address: `${address[idx + 1]}`,
//   ipfs_url: `https://picsum.photos/id/${Math.floor(
//     Math.random() * (400 - idx + 1)
//   )}/1000/600`,
//   tx_hash: `${tsHash[idx + 1]}`,
//   price: Math.random() * (0.1 - 0.05) + 0.05,
// }));

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

export const productsItmes: Prisma.nft_testCreateInput[] = [
  ...WeatherDNFTs,
  //...SportsDNFTs,
];

const main = async () => {
<<<<<<< HEAD
  const CATEGORY_NAME = ['WeatherDNFT'];
=======
  // const CATEGORY_NAME = ['WeatherDNFT'];
>>>>>>> 9cb4d6046 (active sale)

  // CATEGORY_NAME.forEach(async (name, idx) => {
  //   const category = await prisma.categories.upsert({
  //     where: {
  //       id: idx + 1,
  //     },
  //     update: {
  //       name: name,
  //     },
  //     create: {
  //       name: name,
  //     },
  //   });
  //   console.log(
  //     'category id : ',
  //     category.id,
  //     'category name : ',
  //     category.name
  //   );
  // });

  // await prisma.products.deleteMany({});

  for (const p of productsItmes) {
    const product = await prisma.nft_test.create({
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
