import { nft } from '@prisma/client';
import { use, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Button,
  Input,
  Pagination,
  SegmentedControl,
  Select,
  Card,
  Text,
  Badge,
  Group,
  HoverCard,
} from '@mantine/core';
import { CATEGORY_NAME, FILTERS, TAKE } from '@/constants/dnfts';

import { IconSearch } from '@tabler/icons-react';
import useDebounce from '@/hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Dnfts() {
  const router = useRouter();
  const { data: session } = useSession();
  const [activePage, setPage] = useState(1);

  const [selectedCategory, setSelectedCategory] = useState<string>('-1');

  const [selectedFilter, setFilter] = useState<string | null>(FILTERS[0].value);
  const [keyword, setKeyword] = useState('');

  const delay = 600;
  const debouncedKeyword = useDebounce<String>(keyword, delay);

  // 한번 조회한 기능을 다시 조회하지 않도록 하는 기능 (count)
  // const { data: categories } = useQuery<
  //   { dnfts: categories[] },
  //   unknown,
  //   categories[]
  // >(
  //   ['/api/get-categories'],
  //   () => fetch('/api/get-categories').then((res) => res.json()),
  //   { select: (data) => data.dnfts }
  // );

  const { data: total } = useQuery(
    [
      `/api/get-DNFTs-count?category=${selectedCategory}&contains=${debouncedKeyword}`,
    ],
    () =>
      fetch(
        `/api/get-DNFTs-count?category=${selectedCategory}&contains=${debouncedKeyword}`
      )
        .then((res) => res.json())
        .then((data) => Math.ceil(data.dnfts) / TAKE)
  );

  // 한번 조회한 기능을 다시 조회하지 않도록 하는 기능 (get-dnfts)
  const { data: dnfts } = useQuery<{ dnfts: nft[] }, unknown, nft[]>(
    [
      `/api/get-dnfts?skip=${
        TAKE * (activePage - 1)
      }&take=${TAKE}&orderBy=${selectedFilter}&contains=${debouncedKeyword}`,
    ],
    () =>
      fetch(
        `/api/get-dnfts?skip=${
          TAKE * (activePage - 1)
        }&take=${TAKE}&orderBy=${selectedFilter}&contains=${debouncedKeyword}`
      ).then((res) => res.json()),
    {
      select: (data) => data.dnfts,
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  return (
    <div className='mt-10 mb-36'>
      <div className='mb-4'>
        <Input
          icon={<IconSearch />}
          placeholder='Search'
          value={keyword}
          onChange={handleChange}
        />
        <div className='flex mt-6'>
          {/* {categories && ( // TODO : DB에 카테고리가 추가 되었을 때 추가 
            <div className='mb-4 '>
              <SegmentedControl
                value={selectedCategory}
                onChange={setSelectedCategory}
                data={[
                  { label: 'ALL', value: '-1' },
                  ...categories.map((category) => ({
                    label: category.name,
                    value: String(category.id),
                  })),
                ]}
                color='dark'
              />
            </div>
          )} */}

          <div className='mb-4 ml-auto'>
            <Select
              value={selectedFilter}
              onChange={setFilter}
              data={FILTERS}
            />
          </div>
        </div>
      </div>

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
          ))}
        </div>
      )}
      <div className='w-full flex mt-5'>
        {total && (
          <Pagination
            className='m-auto'
            value={activePage}
            onChange={setPage}
            total={total}
            withEdges
          />
        )}
      </div>
    </div>
  );
}
