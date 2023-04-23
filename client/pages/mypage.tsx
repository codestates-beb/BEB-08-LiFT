import styled from '@emotion/styled';
import { Badge } from '@mantine/core';
import { OrderItem, Orders, nft } from '@prisma/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, TextField, Input, TextareaAutosize, Link } from '@mui/material';
import { useState } from 'react';
import { getSession, useSession } from 'next-auth/react';

import FlipCard, { BackCard, FrontCard } from '../components/FlipCardSecond';

import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import marketABI from '../contract/market_ABI.json';
import nftABI from '../contract/nft_ABI.json';
import Image from 'next/image';

interface MyDNFT {
  token_id: number;
  user_owner_address: string;
  user_name: string;
  user_description: string;
  nft_ipfs_url: string;
  nft_name: number;
  nft_description: number;
  nft_contract_address: string;
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

export default function MyPage(session) {
  console.log('address ' + session.address);
  console.log('chainId ' + session.chainId);

  const { data: myDNFT } = useQuery<{ nft: MyDNFT[] }, unknown, MyDNFT[]>(
    [`http://152.69.231.140:1323/mypage?owner_address=${session.address}`],
    async () => {
      try {
        const response = await fetch(
          `http://152.69.231.140:1323/mypage?owner_address=${session.address}`,
          {
            method: 'GET',
          }
        );
        const data = await response.json();
        console.log('userMydata' + JSON.stringify(response));
        return data;
      } catch (error) {
        console.log('Error: ' + error);
      }
    }
  );

  const router = useRouter();

  return (
    <div className='ml-2'>
      <div className='flex'>
        <div className='flex-col'>
          <div className='text-2xl mb-3 flex-1'>유저 정보</div>

          <div>
            {myDNFT
              ?.map((item, idx) => <MyDetail key={idx} {...item} />)
              .slice(0)}
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
    </div>
  );
}

const MyDetail = (props: MyDNFT) => {
  const { data: session } = useSession();

  console.log('1111' + props.nft_name);

  const [editable, setEditable] = useState(false);
  const [newUserName, setNewUserName] = useState('userName');
  const [newUserDesc, setNewUserDesc] = useState('userDesc');
  const [userImage, setUserImage] = useState(
    'https://picsum.photos/id/1005/1920/1080/'
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

  const handleSave = async () => {
    try {
      const response = await fetch('http://152.69.231.140:1323/mypage/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newUserName,
          description: newUserDesc,
          owner_address: session?.address,
        }),
      });
      const data = await response.json();
      console.log('Card data saved successfully:', JSON.stringify(data));
      setNewUserName(data.name);
      setNewUserDesc(data.description);
      setEditable(false);
    } catch (error) {
      console.error('Error saving card data:', error);
      setEditable(false);
    }
  };

  return (
    <div>
      <Card sx={{ width: 500 }} className='mt-9'>
        <CardMedia
          component='img'
          sx={{ width: 500 }}
          image={userImage}
          title='user image'
        />

        {editable ? (
          <CardContent>
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
          <CardContent>
            <Typography component='div' variant='h5'>
              Name: {props.user_name}
            </Typography>
            <Typography
              variant='subtitle1'
              color='text.secondary'
              component='div'
            >
              Desc: {props.user_description}
            </Typography>
            <br />
            <Typography
              variant='subtitle1'
              color='text.secondary'
              component='div'
            >
              Address: {session?.address}
            </Typography>
            <Typography
              variant='subtitle1'
              color='text.secondary'
              component='div'
            >
              chainID: {session?.chainId}
            </Typography>
            <Typography
              variant='subtitle1'
              color='text.secondary'
              component='div'
            >
              Count My DNFT: {props.token_id}
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
      </Card>
    </div>
  );
};

// TODO: 이 부분에 대한 고민
// 한번의 버튼 클릭으로 이행될 수 없음 usePrepareContractWrite => 한 component? 에서 두번 쓰일 수 없음

const DNFT = (props: MyDNFT) => {
  const { data: session } = useSession();

  console.log('session chainID: ' + session?.chainId);
  console.log('session chainID: ' + props.token_id);

  const router = useRouter();
  const queryClient = useQueryClient();

  const nftCA = '0x1077a33ED9aDD3d55aE3ef66C28b9638B9611C1d'; // approve (to: marketCA / tokenId: 1)
  const marketCA = '0xC78bc4Aac028a5e94F8D70b70EaE57ec3e0b0527'; // saleNFT (_tokenId: uint256, _price: uint256)

  const abi = [nftABI] as const;

  const { config, error } = usePrepareContractWrite({
    address: nftCA,
    abi: nftABI,
    chainId: session?.chainId,
    functionName: 'approve',
    args: [marketCA, props.token_id],
    enabled: Boolean(props.token_id), // 유효한 tokenID가 있을 경우 활성화
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
      <Card sx={{ display: 'flex', width: 790 }} className='mt-5 ml-5'>
        <CardMedia
          component='img'
          sx={{ width: 151 }}
          image={props.nft_ipfs_url}
          title='user image'
          onClick={() => router.push(`/detail/${props.token_id}`)}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: 630 }}>
          <CardContent sx={{ flex: '1 0 auto' }} className='flex-1'>
            <Typography component='div' variant='h5'>
              Name: {props.nft_name}
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
              Token desc: {props.nft_description}
            </Typography>
          </CardContent>
          <CardActions>
            {isSelling ? (
              <SellDNFT token_id={props.token_id} />
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

const SellDNFT = (props) => {
  const [price, setPrice] = useState(0);

  const { data: session } = useSession();

  console.log('session chainID 2: ' + session?.chainId); // 80001 check
  console.log('session chainID 2: ' + JSON.stringify(props.token_id)); // 4 check

  const handlePrice = (event) => {
    event.preventDefault();
    setPrice(event.target.value);
  };

  const router = useRouter();
  const queryClient = useQueryClient();

  const marketCA = '0xC78bc4Aac028a5e94F8D70b70EaE57ec3e0b0527';

  const { config, error } = usePrepareContractWrite({
    address: marketCA,
    abi: marketABI,
    chainId: session?.chainId,
    functionName: 'saleNFT',
    args: [props, price],
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
        {isSaleStarted && `On sale for ${price}MATIC`}
        {!isSaleLoading && !isSaleStarted && 'Enter price'}
      </button>
    </div>
  );
};

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
