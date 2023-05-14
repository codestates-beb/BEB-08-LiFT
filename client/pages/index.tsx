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
import { useContractRead } from 'wagmi';
import marketABI from '@/contract/market_ABI.json';
import nftABI from '../contract/nft_ABI.json';

export default function Dnfts() {
  const router = useRouter();
  const { data: session } = useSession();
  const [activePage, setPage] = useState(1);

  const [selectedCategory, setSelectedCategory] = useState<string>('-1');

  const [selectedFilter, setFilter] = useState<string | null>(FILTERS[0].value);
  const [keyword, setKeyword] = useState('');

  const delay = 600;
  const debouncedKeyword = useDebounce<String>(keyword, delay);

  const { data: total } = useQuery(
    [
      `/api/get-DNFTs-count?category=${selectedCategory}&contains=${debouncedKeyword}`,
    ],
    () =>
      fetch(
        `/api/get-DNFTs-count?category=${selectedCategory}&contains=${debouncedKeyword}`
      )
        .then((res) => res.json())
        .then((data) => Math.ceil(data.dnfts) / TAKE + 1)
    // TODO: TAKE => TAKE + 1로 변화했더니 딱 9개씩 나뉘어 져서 메인 페이지에 보이던 dnft 목록들이 몇개든 상관없이 다 보일 수 있게 됨
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

  const marketCA = '0xC78bc4Aac028a5e94F8D70b70EaE57ec3e0b0527';
  const nftCA = '0x1077a33ED9aDD3d55aE3ef66C28b9638B9611C1d';

  const [dataPriceShow, setDataPrice] = useState<number | string>('');

  const {
    data: dataPrice,
    isError,
    isLoading,
  } = useContractRead({
    address: marketCA,
    abi: marketABI,
    functionName: 'sale',
    chainId: session?.chainId,
    args: [dnfts?.length], // pass current dnft's token_id
    overrides: { from: session?.address },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  useEffect(() => {
    if (dataPrice !== undefined) {
      setDataPrice(dataPrice?.toNumber()); // or setDataPrice(data.toString());
    } else {
      setDataPrice('');
    }
  }, [dataPrice]);

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

          {CATEGORY_NAME && ( // TODO : 임시 카테고리
            <div className='mb-4 '>
              <SegmentedControl
                value={selectedCategory}
                onChange={setSelectedCategory}
                data={[
                  { label: 'ALL', value: '-1' },
                  ...CATEGORY_NAME.map((category) => ({
                    label: category,
                    value: String(category),
                  })),
                ]}
                color='dark'
              />
            </div>
          )}

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
        <div className='grid grid-cols-3 gap-5 ml-2'>
          {dnfts

            .slice(0)
            .reverse()
            .map((dnft) => (
              <Card
                className='ml-3'
                shadow='lg'
                padding='lg'
                radius='md'
                key={dnft.id}
                withBorder
                style={{ maxWidth: 500, cursor: 'pointer' }}
                onClick={() => router.push(`/detail/${dnft.id}`)}
              >
                <Card.Section
                  component='a'
                  onClick={() => router.push(`/detail/${dnft.id}`)}
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
                  {dataPriceShow ? (
                    <Badge color='pink' variant='light'>
                      on Sale
                    </Badge>
                  ) : (
                    <Badge color='blue' variant='light'>
                      off Sale
                    </Badge>
                  )}
                </Group>
                <Text size='sm' color='dimmed'>
                  {dnft.description}
                </Text>
                <Text size='sm' color='dimmed'>
                  token ID: {dnft.token_id}
                </Text>
                <Text size='sm' color='dimmed'>
                  Price: {dataPriceShow ? dataPriceShow : '0'}
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
