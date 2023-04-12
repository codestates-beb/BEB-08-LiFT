// 더미 데이터 생성 및 추후 스마트 컨트랙트에 저장된 dnft 데이터 입력 => 사용 안함
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const dnftData: Prisma.dnftsCreateInput[] = Array.apply(null, Array(100)).map(
  (_, index) => ({
    name: `Frist DNFTs ${index + 1}`,
    category_id: 3,
    contents: `{"blocks":[{"key":"cu72b","text":"qwer ewr"${
      index + 1
    },"type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":7,"length":3,"style":"BOLD"}],"entityRanges":[],"data":{}}],"entityMap":{}}`,
    image_url: `https://picsum.photos/id/101${
      (index + 1) % 10 === 0 ? 10 : (index + 1) % 10
    }/1000/600/`,
    price: Math.floor(Math.random() * (10 - 20) + 20),
  })
)

async function main() {
  await prisma.dnfts.deleteMany({})

  for (const d of dnftData) {
    const dnft = await prisma.dnfts.create({
      data: d,
    })
    console.log(`Created id: ${dnft.id}`)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
