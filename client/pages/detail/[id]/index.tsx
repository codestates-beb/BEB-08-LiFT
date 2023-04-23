import Image from 'next/image';
import Carousel from 'nuka-carousel/lib/carousel';
import { useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Cart, OrderItem, Wishlist, nft } from '@prisma/client';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Badge, Button } from '@mantine/core';
import {
  IconHeart,
  IconHeartbeat,
  IconShoppingCart,
} from '@tabler/icons-react';
import { useSession } from 'next-auth/react';

import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useContractRead,
} from 'wagmi';

import marketABI from '@/contract/market_ABI.json';
import nftABI from '@/contract/nft_ABI.json';
import { ethers } from 'ethers';
import styled from '@emotion/styled';

interface MyDNFT {
  id: number;
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

interface BuyData {
  token_id: number;
  buyer_address: string;
  seller_address: string;
}

const BuyMe: BuyData = {
  token_id: 0,
  buyer_address: '',
  seller_address: '',
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  console.log('id:  ' + context.params?.id);
  const product = await fetch(
    `http://152.69.231.140:1323/detail/${context.params?.id}`
  ).then((res) => res.json());

  console.log('dnfts' + product);
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
  product: nft & { ipfs_url: string[] };
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

  const product = props.product;
  const [message, setMessage] = useState('');

  BuyMe.token_id = product.id;
  BuyMe.buyer_address = session?.address;
  BuyMe.seller_address = product.owner_address;

  const buyClick = async () => {
    try {
      const response = await fetch('http://152.69.231.140:1323/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(BuyMe),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Error: ' + error);
    }
  };

  const isWished =
    wishlist != null && dnftId != null ? wishlist.includes(dnftId) : false;

  console.log('session.address: ' + session?.address);

  console.log('tokenId : ' + product.token_id);

  const nftCA = '0x1077a33ED9aDD3d55aE3ef66C28b9638B9611C1d'; // approve (to: marketCA / tokenId: 1)
  const marketCA = '0xC78bc4Aac028a5e94F8D70b70EaE57ec3e0b0527'; // saleNFT (_tokenId: uint256, _price: uint256)

  const { config, error } = usePrepareContractWrite({
    address: marketCA,
    abi: marketABI,
    chainId: 80001,
    functionName: 'buyNFT',
    args: [14], // input 값
    overrides: {
      from: session?.address, // session.address가 들어가야 함
      value: ethers.utils.parseEther('1'), // 각 DNFT의 가격을 넣어줘야 한다.
    },
    //enabled: Boolean(props.token_id), // 유효한 tokenID가 있을 경우 활성화
  });
  //value: ethers.utils.parseEther('1'),
  const {
    data: buyData,
    write: buyNFT,
    isLoading: isBuyLoading,
    isSuccess: isBuyStarted,
  } = useContractWrite(config);

  console.log('config: ' + JSON.stringify(config));
  console.log('buydata : ' + JSON.stringify(buyData));
  console.log('error:  ' + error);

  const { isSuccess: txSuccess } = useWaitForTransaction({
    hash: buyData?.hash,
  });

  const Paid = txSuccess;

  const {
    data: dataPrice,
    isError,
    isLoading,
  } = useContractRead({
    address: marketCA,
    abi: marketABI,
    functionName: 'sale',
    chainId: session?.chainId, // check
    args: [3], // product.token_id
  });

  return (
    <div>
      <div className='ml-20'>
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
                  <div
                    key={`${url}-thumbs-${idx}`}
                    onClick={() => setIndex(idx)}
                  >
                    <Image
                      src={url}
                      alt='image'
                      width={100}
                      height={60}
                    ></Image>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ maxWidth: 600 }} className='flex flex-col space-y-6'>
              <div className='text-lg text-zinc-400'>Weather DNFT</div>
              {dataPrice === 'string' ? (
                <Badge color='pink' variant='light' size='lg'>
                  on Sale
                </Badge>
              ) : (
                <Badge color='blue' variant='light' size='lg'>
                  off Sale
                </Badge>
              )}
              <div className='text-4xl font-semibold'>{product.name}</div>
              <div className='text-lg'>Owner: {product.owner_address}</div>
              <div className='text-lg'>Token ID: {product.token_id}</div>
              <div className='text-lg'>
                Price:
                {typeof dataPrice === 'string' ? dataPrice : 'Loading...'}
              </div>
              <div className='text-2xl mb-3 mt-4'>Description :</div>
              <div
                className='w-full flex-col p-4 rounded-md'
                style={{ border: '1px solid grey' }}
              >
                {product.description}
              </div>

              <div className='text-sm text-zinc-500'>
                ipfs image url: {product.ipfs_url}
              </div>
              <div className='flex space-x-3'>
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
              <div>
                {Paid && message ? (
                  <ButtonBuy>
                    {'This is yours :' + JSON.stringify(message)}
                  </ButtonBuy>
                ) : (
                  <ButtonBuy
                    className='w-full content-center justify-center'
                    data-sell-loading={isBuyLoading}
                    data-sell-stated={isBuyStarted}
                    onClick={async () => {
                      try {
                        const data1 = await new Promise(() => buyNFT?.());
                        const data2 = await new Promise(() => buyClick());
                        console.log('Purchase successful!');
                      } catch (error) {
                        console.log('Purchase failed:', error);
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {isBuyLoading && 'Waiting for approval'}
                    {isBuyStarted && 'Buying...'}
                    {!isBuyLoading && !isBuyStarted && 'Buy'}
                  </ButtonBuy>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>로딩중</div>
        )}
      </div>
    </div>
  );
}

const ButtonBuy = styled.div`
  appearance: none;
  border: none;
  font-family: Verdana, Arial, Helvetica, sans-serif;
  background-image: linear-gradient(to right, #3898ff, #7a70ff);
  display: inline-flex;
  line-height: 1;
  font-size: 20px;
  font-weight: 800;
  height: 50px;
  padding: 0 24px;
  border-radius: 9999px;
  align-items: center;
  color: white;
  transition: all ease 100ms;

  :not(:disabled):hover {
    transform: scale(1.04);
  }

  [data-mint-loading='true'] {
    background: rgba(22, 25, 31, 0.24);
  }

  [data-mint-started='true'] {
    background-image: linear-gradient(270deg, #ff6257, #ff5ca0);
    position: relative;
  }

  [data-mint-started='true']::after {
    animation-name: pulse;
    animation-duration: 500ms;
    animation-direction: alternate;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
    background-color: #ff6257;
    border-radius: inherit;
    bottom: 0;
    content: ' ';
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }

  [data-mint-done='true'] {
    opacity: 0;
    transform: scale(0.85);
  }

  h1 {
    font-size: 24px;
  }
  h2 {
    font-size: 18px;
  }
  a {
    color: inherit;
  }

  @keyframes pulse {
    0% {
      opacity: 0;
    }
    100% {
      opacity: '100%';
    }
  }
`;

// Products.getInitialProps = async function () {

//   const {
//     data: dataPrice,
//     isError,
//     isLoading,
//   } = useContractRead({
//     address: '',
//     abi: marketABI,
//     functionName: 'sale',
//     chainId: 1,
//     args: [3], // product.token_id
//   });

//   return {
//     price: dataPrice,
//   };
// };
