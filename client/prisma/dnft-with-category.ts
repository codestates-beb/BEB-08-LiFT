import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// const productData: Prisma.productsCreateInput[] = Array.apply(
//   null,
//   Array(30)
// ).map((_, idx) => ({
//   name: `HOODIE ${idx + 1}`,
//   contents: `{\"blocks\":[{\"key\":\"uhd0\",\"text\":\"안녕 나는 HOODIE No.${
//     idx + 1
//   } 입니다.\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}`,
//   category_id: 5,
//   image_url: `https://picsum.photos/id/${Math.floor(
//     Math.random() * (1000 - idx + 1)
//   )}/1000/600`,
//   price: Math.floor(Math.random() * (100000 - 20000) + 20000)
// }));

export const WeatherDNFTs: Prisma.dnftsCreateInput[] = Array.apply(
  null,
  Array(30)
).map((_, idx) => ({
  name: `Weather DNFT ${idx + 1}`,
  contents: `{\"blocks\":[{\"key\":\"uhd0\",\"text\":\"저는 Weather DNFT No.${
    idx + 1
  } 입니다.\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}`,
  category_id: 1,
  image_url: `https://picsum.photos/id/${Math.floor(
    Math.random() * (1000 - idx + 1)
  )}/1000/600`,
  price: Math.floor(Math.random() * (10 - 20) + 20),
}))

export const CoinPriceDNFTs: Prisma.dnftsCreateInput[] = Array.apply(
  null,
  Array(30)
).map((_, idx) => ({
  name: `Time DNFT ${idx + 1}`,
  contents: `{\"blocks\":[{\"key\":\"uhd0\",\"text\":\"저는 Time DNFT No.${
    idx + 1
  } 입니다.\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}`,
  category_id: 2,
  image_url: `https://picsum.photos/id/${Math.floor(
    Math.random() * (400 - idx + 1)
  )}/1000/600`,
  price: Math.floor(Math.random() * (10 - 20) + 20),
}))

export const TimeDNFTs: Prisma.dnftsCreateInput[] = Array.apply(
  null,
  Array(30)
).map((_, idx) => ({
  name: `Coin Price DNFT ${idx + 1}`,
  contents: `{\"blocks\":[{\"key\":\"uhd0\",\"text\":\"저는 Coin Price DNFT No.${
    idx + 1
  } 입니다.\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}`,
  category_id: 3,
  image_url: `https://picsum.photos/id/${Math.floor(
    Math.random() * (700 - idx + 1)
  )}/1000/600`,
  price: Math.floor(Math.random() * (10 - 20) + 20),
}))

export const productsItmes: Prisma.dnftsCreateInput[] = [
  ...WeatherDNFTs,
  ...CoinPriceDNFTs,
  ...TimeDNFTs,
]

const main = async () => {
  const CATEGORY_NAME = ['WeatherDNFT', 'TimeDNFT', 'CoinPriceDNFT']

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
    })
    console.log(
      'category id : ',
      category.id,
      'category name : ',
      category.name
    )
  })

  // await prisma.products.deleteMany({});

  for (const p of productsItmes) {
    const product = await prisma.dnfts.create({
      data: p,
    })

    console.log(`== Created == : ${product.id} / ${product.name}`)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
