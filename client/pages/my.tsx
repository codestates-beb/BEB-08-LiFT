import { CATEGORY_NAME } from '@/constants/dnfts';
import styled from '@emotion/styled';
import { Badge } from '@mantine/core';
import { OrderItem, Orders, nft_test } from '@prisma/client';
import { IconX } from '@tabler/icons-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/router';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, TextField, Input, TextareaAutosize } from '@mui/material';
import { useState } from 'react';
import { getSession, useSession } from 'next-auth/react';

import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import marketABI from '../contract/market_ABI.json';
import nftABI from '../contract/nft_ABI.json';

import { useAccount, useConnect, useEnsName } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

interface MyDNFT extends nft_test {
  token_id: number;
  owner_address: string;
  name: string;
  description: string;
  ipfs_url: string;
  user_id: number;
  nft_contract_address: string;
}

interface OrderItemDetail extends OrderItem {
  name: string;
  ipfs_url: string;
  order: number;
}

interface OrderDetail extends Orders {
  orderItems: OrderItemDetail[];
}

interface CardComponentProps {
  userName: string;
  userDesc: string;
}

// 주문 별 / 판매 상품 별 상태
const ORDER_STATUS_MAP = [
  '배포중',
  '배포완료',
  '결제 대기',
  '결제 완료',
  '판매 대기',
  '판매 완료',
];

export const ORDER_QUERY_KEY = '/api/get-order';
export const MYDNFT_QUERY_KEY = '/api/get-mydnft';

export default function MyPage(session) {
  console.log('address ' + session.address);

  const [editable, setEditable] = useState(false);
  const [newUserName, setNewUserName] = useState('userName');
  const [newUserDesc, setNewUserDesc] = useState('userDesc');
  const [userImage, setUserImage] = useState(
    'https://picsum.photos/id/1000/600/600/'
  );

  const { data: myDNFT } = useQuery<{ nft_test: MyDNFT[] }, unknown, MyDNFT[]>(
    [MYDNFT_QUERY_KEY],
    () =>
      fetch(MYDNFT_QUERY_KEY)
        .then((res) => res.json())
        .then((data) => data.dnfts)
  );

  const handleEdit = () => {
    setEditable(true);
  };

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUserName(event.target.value);
  };

  const handleUserDescChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNewUserDesc(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserImage(event.target.value);
  };

  const handleSave = () => {
    fetch('http://localhost:1323/mypage/edit', {
      // TODO: 추후 user API 가 있을 시 수정 => 완료 => 이제 데이터 가져오는 것
      method: 'POST',
      body: JSON.stringify({
        name: newUserName,
        description: newUserDesc,
        owner_address: session.address,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Card data saved successfully:', data);
        setEditable(false);
      })
      .catch((error) => {
        console.error('Error saving card data:', error);
        setEditable(false);
      });
  };

  const router = useRouter();

  const { data } = useQuery<{ dnfts: OrderDetail[] }, unknown, OrderDetail[]>(
    [ORDER_QUERY_KEY],
    () =>
      fetch(ORDER_QUERY_KEY)
        .then((res) => res.json())
        .then((data) => data.dnfts)
  );

  // const { data } = useQuery<{ dnfts: OrderDetail[] }, unknown, OrderDetail[]>(
  //   [MYDNFT_QUERY_KEY],
  //   () =>
  //     fetch(MYDNFT_QUERY_KEY)
  //       .then((res) => res.json())
  //       .then((data) => data.dnfts)
  // );

  console.log(JSON.stringify(data));

  return (
    <div>
      <div className='flex'>
        <div className='flex-col'>
          <div className='text-2xl mb-3 flex-1'>유저 정보</div>
          <div>
            <Card sx={{ display: 'flex', width: 790 }}>
              <CardMedia
                component='img'
                sx={{ width: 151 }}
                image={userImage}
                title='user image'
              />
              <Box
                sx={{ display: 'flex', flexDirection: 'column', maxWidth: 630 }}
              >
                {editable ? (
                  <CardContent sx={{ flex: '1 0 auto' }} className='flex-1'>
                    <TextField
                      id='user_name'
                      label='User Name'
                      value={newUserName}
                      onChange={handleUserNameChange}
                    />
                    <TextField
                      id='user_desc'
                      label='User Description'
                      value={newUserDesc}
                      onChange={handleUserDescChange}
                    />
                    <TextField
                      id='user_image'
                      label='User Image URL'
                      value={userImage}
                      onChange={handleImageChange}
                    />
                  </CardContent>
                ) : (
                  <CardContent sx={{ flex: '1 0 auto' }} className='flex-1'>
                    <Typography component='div' variant='h5'>
                      userName
                    </Typography>
                    <Typography
                      variant='subtitle1'
                      color='text.secondary'
                      component='div'
                    >
                      address: {session.address}
                    </Typography>
                    <Typography
                      variant='subtitle1'
                      color='text.secondary'
                      component='div'
                    >
                      userDesc
                    </Typography>
                  </CardContent>
                )}
                <CardActions>
                  {editable ? (
                    <Button size='small' onClick={handleSave}>
                      Save
                    </Button>
                  ) : (
                    <Button size='small' onClick={handleEdit}>
                      Edit
                    </Button>
                  )}
                </CardActions>
              </Box>
            </Card>
          </div>
        </div>
        <div className='flex-col'>
          <span className='text-2xl ml-9 flex-1'>
            나의 DNFT: {myDNFT ? myDNFT.length : 0}
          </span>
          <div className='flex flex-col p-4 flex-1 ml-1'>
            {myDNFT ? ( // myDNFT
              myDNFT.length > 0 ? (
                myDNFT.map((item, idx) => <DNFT key={idx} {...item} />)
              ) : (
                <div>소유한 DNFT가 없습니다.</div>
              )
            ) : (
              <div>불러오는 중...</div>
            )}
          </div>
        </div>
      </div>

      <div className='flex'>
        <div className='text-2xl mb-3 flex-1 mt-12'>판매중인 DNFT</div>

        <div className='text-2xl mb-3 flex-1'>
          <div className='w-full flex-col p-4 mt-8'>
            주문내역: {data ? data.length : 0}
            <div className='flex flex-col p-4'>
              {data ? (
                data.length > 0 ? (
                  data.map((item, idx) => <DetailItem key={idx} {...item} />)
                ) : (
                  <div>주문내역이 없습니다.</div>
                )
              ) : (
                <div>불러오는 중...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DetailItem = (props: OrderDetail) => {
  return (
    <div className='p-4'>
      <div
        className='w-full flex-col p-4 rounded-md'
        style={{ border: '1px solid grey' }}
      >
        <div className='flex'>
          <Badge color={props.status === 0 ? 'red' : ''} className='mb-2'>
            {ORDER_STATUS_MAP[props.status]}
          </Badge>
          {/* <IconX className="ml-auto" /> */}
        </div>

        {props.orderItems.map((orderItem, idx) => (
          <Item key={idx} {...orderItem} />
        ))}
        <div className='flex mt-4'>
          <span>구매자 : </span>
        </div>
      </div>
    </div>
  );
};

const Item = (props: OrderItemDetail) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return (
    <div className='w-full flex p-4' style={{ borderBottom: '1px solid grey' }}>
      <Image src={props.ipfs_url} width={155} height={195} alt={props.name} />
      <div className='flex flex-col ml-4'>
        <span className='font-semibold mb-2'>{props.name}</span>
        <span className='mb-auto'>
          가격: 0.1 ETH
          {/* 가격: {props.amount.toLocaleString('ko-kr')}ETH */}
        </span>
      </div>
      <div className='flex ml-auto space-x-4'></div>
    </div>
  );
};

const Row = styled.div`
  display: flex;
  * ~ * {
    margin-left: auto;
  }
`;

// MyPage.getInitialProps = async function () {
//   // const res = await fetch('http://152.69.231.140:1323/location');
//   // const data = await res.json();

//   // console.log('location data:' + JSON.stringify(data));

//   const data = await getSession();

//   return {
//     session: data,
//   };
// };

// TODO: 이 부분에 대한 고민
// 한번의 버튼 클릭으로 이행될 수 없음 usePrepareContractWrite => 한 component? 에서 두번 쓰일 수 없음

const DNFT = (props: MyDNFT, session) => {
  const { chainId, address } = session;
  const router = useRouter();
  const queryClient = useQueryClient();

  const nftCA = '0x73D0b51B1fA88d83E9e029b983D8F70176b9c0A7'; // approve (to: marketCA / tokenId: 1)
  const marketCA = '0x8e2E5aC4deAFDe90cE08636E9b6dF1Edb6bAd7b7'; // saleNFT (_tokenId: uint256, _price: uint256)

  const abi = [nftABI] as const;

  const { config, error } = usePrepareContractWrite({
    address: nftCA,
    abi: nftABI,
    chainId: 80001,
    functionName: 'approve',
    args: [marketCA, 1], // input 값
    //enabled: Boolean(props.token_id), // 유효한 tokenID가 있을 경우 활성화
  });

  const {
    data: sellData,
    write: approve,
    isLoading: isSellLoading,
    isSuccess: isSellStarted,
  } = useContractWrite(config);

  console.log('config: ' + JSON.stringify(config));
  console.log('config111 : ' + JSON.stringify(sellData));
  console.log(error);

  const { isSuccess: txSuccess } = useWaitForTransaction({
    hash: sellData?.hash,
  });

  const isSelling = txSuccess;

  return (
    <div className='w-full flex'>
      <Card sx={{ display: 'flex', width: 790 }}>
        <CardMedia
          component='img'
          sx={{ width: 151 }}
          image={props.ipfs_url}
          title='user image'
          onClick={() => router.push(`/dnfts/${props.id}`)}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: 630 }}>
          <CardContent sx={{ flex: '1 0 auto' }} className='flex-1'>
            <Typography component='div' variant='h5'>
              Name: {props.name}
            </Typography>
            <Typography
              variant='subtitle1'
              color='text.secondary'
              component='div'
            >
              Token ID: {props.token_id}
            </Typography>
            <Typography
              variant='subtitle1'
              color='text.secondary'
              component='div'
            >
              Token desc: {props.description}
            </Typography>
          </CardContent>
          <CardActions>
            {isSelling ? (
              <SellDNFT />
            ) : (
              <button
                className='button ml-3'
                onClick={() => approve?.()}
                disabled={isSellLoading || isSellStarted}
                data-sell-loading={isSellLoading}
                data-sell-stated={isSellStarted}
              >
                {isSellLoading && 'Waiting for approval'}
                {isSellStarted && 'Selling...'}
                {!isSellLoading && !isSellStarted && 'sell'}
              </button>
            )}

            {isSelling ? (
              <Badge className='ml-4' color='pink' variant='light' size='lg'>
                on sale
              </Badge>
            ) : (
              <Badge className='ml-4' color='blue' variant='light' size='lg'>
                off sale
              </Badge>
            )}
          </CardActions>
        </Box>
      </Card>
    </div>
  );
};

const SellDNFT = (props: MyDNFT, session) => {
  const { chainId, address } = session;
  const [price, setPrice] = useState(0);

  const handlePrice = (event) => {
    event.preventDefault();
    setPrice(event.target.value);
  };

  const router = useRouter();
  const queryClient = useQueryClient();

  const marketCA = '0x8e2E5aC4deAFDe90cE08636E9b6dF1Edb6bAd7b7';

  const { config, error } = usePrepareContractWrite({
    address: marketCA,
    abi: marketABI,
    chainId: 80001,
    functionName: 'saleNFT',
    args: [1, price], // input 값
  });

  const {
    data: saleData,
    write: saleNFT,
    isLoading: isSaleLoading,
    isSuccess: isSaleStarted,
  } = useContractWrite(config);

  const { isSuccess: txSuccess } = useWaitForTransaction({
    hash: saleData?.hash,
  });

  const isSelling = txSuccess;

  // disabled={!price} onClick={() => saleNFT?.()}

  return (
    <div className='flex'>
      <TextField
        id='standard-basic'
        label='Price:'
        variant='standard'
        onChange={handlePrice}
      />
      <button
        className='button ml-3'
        onClick={() => saleNFT?.()}
        disabled={isSaleLoading || isSaleStarted || !price}
        data-sell-loading={isSaleLoading}
        data-sell-stated={isSaleStarted}
      >
        {isSaleLoading && 'Waiting for approval'}
        {isSaleStarted && 'Complete Sell'}
        {!isSaleLoading && !isSaleStarted && 'sell with price'}
      </button>
    </div>
  );
};

// const DNFT = (props: MyDNFT, session) => {
//   const { chainId, address } = session;

//   const router = useRouter();
//   const queryClient = useQueryClient();

//   const nftCA = '0x73D0b51B1fA88d83E9e029b983D8F70176b9c0A7'; // approve (to: marketCA / tokenId: 1)
//   const marketCA = '0x8e2E5aC4deAFDe90cE08636E9b6dF1Edb6bAd7b7';

//   const [sellApprove, setSellApprove] = useState(false);

//   marketABI;

//   const { config, error } = usePrepareContractWrite({
//     address: nftCA,
//     abi: nftABI,
//     chainId: chainId,
//     functionName: 'approve(address, uint256)',
//     args: [marketCA, props.token_id], // input 값
//     enabled: Boolean(props.token_id), // 유효한 tokenID가 있을 경우 활성화
//   });

//   const {
//     data: sellData,
//     write: approve,
//     isLoading: isSellLoading,
//     isSuccess: isSellStarted,
//   } = useContractWrite(config);

//   const { isSuccess: txSuccess } = useWaitForTransaction({
//     hash: sellData?.hash,
//   });

//   const isSelling = txSuccess;

//   usePrepareContractWrite();

//   return (
//     <div className='w-full flex'>
//       <Card sx={{ display: 'flex', width: 790 }}>
//         <CardMedia
//           component='img'
//           sx={{ width: 151 }}
//           image={props.ipfs_url}
//           title='user image'
//           onClick={() => router.push(`/dnfts/${props.id}`)}
//         />
//         <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: 630 }}>
//           <CardContent sx={{ flex: '1 0 auto' }} className='flex-1'>
//             <Typography component='div' variant='h5'>
//               Name: {props.name}
//             </Typography>
//             <Typography
//               variant='subtitle1'
//               color='text.secondary'
//               component='div'
//             >
//               Token ID: {props.token_id}
//             </Typography>
//             <Typography
//               variant='subtitle1'
//               color='text.secondary'
//               component='div'
//             >
//               Token desc: {props.description}
//             </Typography>
//             <Input></Input>
//           </CardContent>
//           <CardActions>
//             {isSelling ? (
//               <Button className='ml-4'>
//                 input price
//                 {/* input과 버튼으로 변경 */}
//               </Button>
//             ) : (
//               <button
//                 className="button"
//                 onClick={() => approve?.()}
//                 disabled={isSellLoading || isSellStarted}
//                 data-sell-loading={isSellLoading}
//                 data-sell-stated={isSellStarted}
//               >
//                 {isSellLoading && 'Waiting for approval'}
//                 {isSellStarted && 'Selling'}
//                 {!isSellLoading && !isSellStarted && 'sell'}
//               </button>
//             )}

//             {sellApprove ? (
//               <Badge className='ml-4' color='pink' variant='light'>
//                 for sale
//                 {/* input과 버튼으로 변경 */}
//               </Badge>
//             ) : (
//               <Badge className='ml-4' color='blue' variant='light'>
//                 not for sale
//               </Badge>
//             )}
//           </CardActions>
//         </Box>
//       </Card>
//     </div>
//   );
// };

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };
  }

  return {
    props: session,
  };
}

// const login = (session) => {
//   const { address, isConnected } = useAccount();
//   const { data: ensName } = useEnsName({ address });
//   const { connect } = useConnect({
//     connector: new InjectedConnector(),
//   });

//   if (isConnected) return <div>Connected to {ensName ?? address}</div>;
//   return <button onClick={() => connect()}>Connect Wallet</button>;
// }

// export function Profile() {
//   const { address, isConnected } = useAccount();
//   const { data: ensName } = useEnsName({ address });
//   const { connect } = useConnect({
//     connector: new InjectedConnector(),
//   });
// }
