import { CATEGORY_NAME } from '@/constants/dnfts';
<<<<<<< HEAD
import { nft } from '@prisma/client';
=======
import { Badge, Button, Card, Group, Text } from '@mantine/core';
import { nft_test } from '@prisma/client';
>>>>>>> 9cb4d6046 (active sale)
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Wishlist() {
  const router = useRouter();

<<<<<<< HEAD
  const { data: dnfts } = useQuery<{ dnfts: nft[] }, unknown, nft[]>(
=======
  const { data: dnfts } = useQuery<{ dnfts: nft_test[] }, unknown, nft_test[]>(
>>>>>>> 9cb4d6046 (active sale)
    ['/api/get-wishlists'],
    () => fetch('/api/get-wishlists').then((res) => res.json()),
    {
      select: (data) => data.dnfts,
    }
  );

  return (
    <div>
      <p className='text-2xl mb-4'>내가 찜한 DNFT</p>
      {dnfts && (
        <div className='grid grid-cols-3 gap-5'>
          {dnfts.map((dnft) => (
            <Card
              shadow='lg'
              padding='lg'
              radius='md'
              key={dnft.id}
              withBorder
              style={{ maxWidth: 500, cursor: 'pointer' }}
              onClick={() => router.push(`/dnfts/${dnft.id}`)}
            >
<<<<<<< HEAD
              <Image
                className='rounded'
                alt={dnft.name}
                src={dnft.ipfs_url ?? ''}
                width={500}
                height={300}
                placeholder='blur'
                blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg=='
              />
              <div>
                <span>{dnft.name}</span>

                <span className='ml-auto'>
                  <span className='float-right'>
                    0.1 ETH
                    {/* {dnft.price.toLocaleString('ko-KR')}ETH */}
                  </span>
                </span>
              </div>
              <span className='text-zinc-400'>
                Weather DNFT
                {/* {CATEGORY_NAME[dnft.category_id - 1]} */}
              </span>
            </div>
=======
              <Card.Section
                component='a'
                onClick={() => router.push(`/dnfts/${dnft.id}`)}
              >
                <Image
                  className='rounded'
                  alt={dnft.name ?? ''}
                  src={dnft.ipfs_url ?? ''}
                  width={500}
                  height={300}
                  placeholder='blur'
                  blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg=='
                />
              </Card.Section>
              <Group position='apart' mt='md' mb='xs'>
                <Text weight={500}>{dnft.name}</Text>
                <Badge color='pink' variant='light'>
                  On Sale
                </Badge>
              </Group>
              <Text size='sm' color='dimmed'>
                {dnft.description}
              </Text>
              <Button
                variant='light'
                color='blue'
                fullWidth
                mt='md'
                radius='md'
              >
                Weather DNFT
              </Button>

              {/* <span className='ml-auto'> // TODO: 추후 가격에 대한 정보를 얻게 되었을 때 추가
                  <span className='float-right'>
                    {dnft.price.toLocaleString('ko-KR')}ETH
                  </span>
                </span> */}

              {/* <span className='text-zinc-400'>Weather DNFT</span> */}
              {/* <span className='text-zinc-400'> // TODO: 추후 카테고리 생성시 추가 
                {CATEGORY_NAME[dnft.category_id - 1]}
              </span> */}
            </Card>
>>>>>>> 9cb4d6046 (active sale)
          ))}
        </div>
      )}
    </div>
  );
}
