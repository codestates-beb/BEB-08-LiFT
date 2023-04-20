import Image from 'next/image';
import Carousel from 'nuka-carousel/lib/carousel';
import { useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Cart, OrderItem, Wishlist, nft_test } from '@prisma/client';
import { format } from 'date-fns';
import { CATEGORY_NAME } from '@/constants/dnfts';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Button } from '@mantine/core';
import {
  IconHeart,
  IconHeartbeat,
  IconShoppingCart,
} from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { CART_QUERY_KEY } from '@/pages/cart';
import { ORDER_QUERY_KEY } from '../../my';

import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';

import marketABI from '@/contract/market_ABI.json';
import nftABI from '@/contract/nft_ABI.json';
import { ethers } from 'ethers';

interface MyDNFT extends nft_test {
  token_id: number;
  owner_address: string;
  name: string;
  description: string;
  ipfs_url: string;
  user_id: number;
  nft_contract_address: string;
}

interface CartData {
  dnfts: {
    dnftId: number;
    // other properties of the dnft object
  }[];
  // other properties of the cart object
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const product = await fetch(
    `http://localhost:3000/api/get-DNFT?id=${context.params?.id}`
  )
    .then((res) => res.json())
    .then((data) => data.dnfts);

  return {
    props: {
      product: {
        ...product,
        images: [product.ipfs_url, product.ipfs_url, product.ipfs_url],
      },
    },
  };
}

const WISHLIST_QUERY_KEY = '/api/get-wishlist';

export default function Products(props: {
  product: nft_test & { ipfs_url: string[] };
}) {
  const [index, setIndex] = useState(0);

  const queryClient = useQueryClient();

  const { data: session } = useSession();
  const router = useRouter();
  const { id: dnftId } = router.query;

  // description
  // const descriptions = useState<undefined>(() =>
  //   props.product.description ? JSON.stringify(props.product.description) : ''
  // );

  const { data: wishlist } = useQuery([WISHLIST_QUERY_KEY], () =>
    fetch(WISHLIST_QUERY_KEY)
      .then((res) => res.json())
      .then((data) => data.dnfts)
  );

  const { mutate } = useMutation<unknown, unknown, string, any>(
    (dnftId) =>
      fetch('/api/update-wishlist', {
        method: 'POST',
        body: JSON.stringify({ dnftId }),
      })
        .then((data) => data.json())
        .then((res) => res.dnftId),
    {
      onMutate: async (dnftId) => {
        // Optimistic Updates
        await queryClient.cancelQueries([WISHLIST_QUERY_KEY]);

        // Snapshot the previous value
        const previous = queryClient.getQueryData([WISHLIST_QUERY_KEY]);

        // Optimistically update to the new value
        queryClient.setQueryData<string[]>([WISHLIST_QUERY_KEY], (old) =>
          old
            ? old.includes(String(dnftId))
              ? old.filter((id) => id != String(dnftId))
              : old.concat(String(dnftId))
            : []
        );

        // Return a  context object with the snapshotted value
        return { previous };
      },
      onError: (error, _, context) => {
        queryClient.setQueryData([WISHLIST_QUERY_KEY], context.previous);
      },
      onSuccess: () => {
        queryClient.invalidateQueries([WISHLIST_QUERY_KEY]);
      },
    }
  );

  const { mutate: addCart } = useMutation<
    unknown,
    Omit<Cart, 'id' | 'userId'>,
    any
  >(
    (item) =>
      fetch('/api/add-cart', {
        method: 'POST',
        body: JSON.stringify({ item }),
      })
        .then((data) => data.json())
        .then((res) => res.item),
    {
      onMutate: () => {
        // 요청을 초기화 해서 다시 요청을 보낼 수 있도록 한다.
        queryClient.invalidateQueries([CART_QUERY_KEY]);
      },
      onSuccess: () => {
        router.push('/cart');
      },
    }
  );

  const { mutate: addOrder } = useMutation<
    unknown,
    Omit<OrderItem, 'id'>[],
    any
  >(
    (items) =>
      fetch('/api/add-order', {
        method: 'POST',
        body: JSON.stringify({ items }), //
      })
        .then((data) => data.json())
        .then((res) => res.items),
    {
      onMutate: () => {
        queryClient.invalidateQueries([ORDER_QUERY_KEY]);
      },
      onSuccess: () => {
        router.push('/my');
      },
    }
  );

  const product = props.product;

  const isWished =
    wishlist != null && dnftId != null ? wishlist.includes(dnftId) : false;

  const { data: dnfts } = useQuery<{ dnfts: nft_test[] }, unknown, nft_test[]>(
    ['/api/get-cart'],
    () => fetch('/api/get-cart').then((res) => res.json()),
    {
      select: (data) => data.dnfts,
    }
  );

  const { data } = useQuery<CartData, unknown, CartData>([CART_QUERY_KEY], () =>
    fetch(CART_QUERY_KEY).then((res) => res.json())
  );

  //const result = data ? data.dnfts.flatMap((dnft) => dnft.dnftId) : [];

  const validate = (type: 'cart' | 'order') => {
    // console.log(result)
    // console.log(product.id)
    // console.log('erf ' + product.id) // TODO: 중복검사가 작동하지 않음
    // console.log(result.includes(product.id))
    // if (result.includes(product.id) == false) {
    //   if (type === 'cart') {
    //     addCart({ dnftId: product.id, amount: product.price })
    //   }
    // }
    if (type === 'cart') {
      addCart({ dnftId: product.id });
    }
    if (type === 'order') {
      addOrder([
        {
          dnftId: product.id,
          amount: 0,
        },
      ]);
    }
  };

  return (
    <>
      {product != null && dnftId != null ? (
        <div className='flex flex-row'>
          <div style={{ maxWidth: 600, marginRight: 52 }}>
            <Carousel
              animation='zoom'
              //autoplay
              withoutControls
              wrapAround
              slideIndex={index}
            >
              {product.images.map((url, idx) => (
                <Image
                  key={`${url}-carousel-${idx}`}
                  src={url}
                  alt='image'
                  width={1000}
                  height={600}
                />
              ))}
            </Carousel>
            <div className='flex space-x-4 mt-2'>
              {product.images.map((url, idx) => (
                <div key={`${url}-thumbs-${idx}`} onClick={() => setIndex(idx)}>
                  <Image src={url} alt='image' width={100} height={60}></Image>
                </div>
              ))}
            </div>
            <div className='text-2xl mb-3 mt-4'>Description :</div>
            <div
              className='w-full flex-col p-4 rounded-md'
              style={{ border: '1px solid grey' }}
            >
              {product.description}
            </div>
          </div>
          <div style={{ maxWidth: 600 }} className='flex flex-col space-y-6'>
            <div className='text-lg text-zinc-400'>Weather DNFT</div>
            <div className='text-4xl font-semibold'>{product.name}</div>
            <div className='text-lg'>Creator: {product.creator_address}</div>
            <div className='text-lg'>0.1 ETH</div>
            <div></div>
            <div className='flex space-x-3'>
              <Button
                leftIcon={<IconShoppingCart size={20} stroke={1.5} />}
                className='flex-1'
                style={{ backgroundColor: 'black' }}
                radius='xl'
                size='md'
                styles={{
                  root: { paddingRight: 14, height: 48 },
                }}
                onClick={() => {
                  if (session == null) {
                    alert('로그인이 필요합니다.');
                    router.push('/auth/login');
                    return;
                  }

                  validate('cart');
                }}
              >
                장바구니
              </Button>

              <Button
                className='flex-1'
                leftIcon={
                  isWished ? (
                    <IconHeart size={20} stroke={1.5} />
                  ) : (
                    <IconHeartbeat size={20} stroke={1.5} />
                  )
                }
                style={{ backgroundColor: isWished ? 'red' : 'grey' }}
                radius='xl'
                size='md'
                styles={{
                  root: { paddingRight: 14, height: 48 },
                }}
                onClick={() => {
                  if (session == null) {
                    alert('로그인이 필요합니다.');
                    router.push('/auth/login');
                    return;
                  }
                  // 로그인이 된 상태이다.
                  mutate(String(dnftId));
                }}
              >
                찜하기
              </Button>
            </div>
            <BuyDNFT />
            <div className='text-sm text-zinc-300'>
              Owner Address: {product.owner_address}
            </div>
          </div>
        </div>
      ) : (
        <div>로딩중</div>
      )}
    </>
  );
}

const BuyDNFT = (props: MyDNFT) => {
  const { data: session } = useSession();

  console.log('111111: ' + session?.address);
  const router = useRouter();
  const queryClient = useQueryClient();

  const nftCA = '0x351f3b5B1EfbE13De1389bE1B5c3B0aa8B6e1265'; // approve (to: marketCA / tokenId: 1)
  const marketCA = '0x1B507D794f12d9FdAb6D9fc201748B991d5100b3'; // saleNFT (_tokenId: uint256, _price: uint256)

  const { config, error } = usePrepareContractWrite({
    address: marketCA,
    abi: marketABI,
    chainId: 80001,
    functionName: 'buyNFT',
    args: [2], // input 값
    overrides: {
      from: session?.address, // session.address가 들어가야 함
      value: ethers.utils.parseEther('1'), // 각 DNFT의 가격을 넣어줘야 한다.
    },
    //enabled: Boolean(props.token_id), // 유효한 tokenID가 있을 경우 활성화
  });

  const {
    data: buyData,
    write: buyNFT,
    isLoading: isBuyLoading,
    isSuccess: isBuyStarted,
  } = useContractWrite(config);

  console.log('config: ' + JSON.stringify(config));
  console.log('config111 : ' + JSON.stringify(buyData));
  console.log('error:  ' + error);

  const { isSuccess: txSuccess } = useWaitForTransaction({
    hash: buyData?.hash,
  });

  const isSelling = txSuccess;

  return (
    <div>
      {isSelling ? (
        'This is yours'
      ) : (
        <button
          data-sell-loading={isBuyLoading}
          data-sell-stated={isBuyStarted}
          disabled={isBuyLoading || isBuyStarted}
          onClick={() => buyNFT?.()}
        >
          {isBuyLoading && 'Waiting for approval'}
          {isBuyStarted && 'Buying...'}
          {!isBuyLoading && !isBuyStarted && 'Buy'}
        </button>
      )}
    </div>
  );
};
