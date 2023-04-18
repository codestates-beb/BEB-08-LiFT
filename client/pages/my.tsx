import { CATEGORY_NAME } from '@/constants/dnfts';
import styled from '@emotion/styled';
import { Badge } from '@mantine/core';
import { OrderItem, Orders } from '@prisma/client';
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
import { Box, TextField, TextareaAutosize } from '@mui/material';
import { useState } from 'react';
import { getSession } from 'next-auth/react';

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

export default function MyPage(session) {
  console.log('session' + JSON.stringify(session));
  console.log('address ' + session.address);

  const [editable, setEditable] = useState(false);
  const [newUserName, setNewUserName] = useState('userName');
  const [newUserDesc, setNewUserDesc] = useState('userDesc');
  const [userImage, setUserImage] = useState(
    'https://picsum.photos/id/1000/600/600/'
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
    fetch('/api/save-card-data', {
      method: 'POST',
      body: JSON.stringify({
        userName: newUserName,
        userDesc: newUserDesc,
        userImage: userImage,
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
        <div className='text-2xl mb-3 flex-1 ml-9'>제작한 DNFT</div>
      </div>

      <div className='flex'>
        <div className='text-2xl mb-3 flex-1 mt-12'>구매한 DNFT</div>

        <div className='text-2xl mb-3 flex-1'>
          <div className='w-full flex-col p-4 mt-8'>
            주문내역: {data ? data.length : 0}
            <div className='flex flex-col p-4'>
              {data ? (
                data.length > 0 ? (
                  data.map((item, idx) => <DetailItem key={idx} {...item} />)
                ) : (
                  <div>주문내역이 아무것도 없습니다.</div>
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
