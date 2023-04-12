import { CATEGORY_NAME } from '@/constants/dnfts'
import styled from '@emotion/styled'
import { Badge } from '@mantine/core'
import { OrderItem, Orders } from '@prisma/client'
import { IconX } from '@tabler/icons-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { useRouter } from 'next/router'

interface OrderItemDetail extends OrderItem {
  name: string
  image_url: string
  dnftId: number
}

interface OrderDetail extends Orders {
  orderItems: OrderItemDetail[]
}

// 주문 별 / 판매 상품 별 상태
const ORDER_STATUS_MAP = ['결제 대기', '결제 완료', '판매 대기', '판매 완료']

export const ORDER_QUERY_KEY = '/api/get-order'

export default function MyPage() {
  const router = useRouter()

  const { data } = useQuery<{ dnfts: OrderDetail[] }, unknown, OrderDetail[]>(
    [ORDER_QUERY_KEY],
    () =>
      fetch(ORDER_QUERY_KEY)
        .then((res) => res.json())
        .then((data) => data.dnfts)
  )

  console.log(JSON.stringify(data))

  return (
    <div>
      <span className="text-2xl mb-3">주문내역 {data ? data.length : 0}</span>
      <div className="flex">
        <div className="flex flex-col p-4 flex-1">
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
  )
}

const DetailItem = (props: OrderDetail) => {
  return (
    <div className="p-4">
      <div
        className="w-full flex-col p-4 rounded-md"
        style={{ border: '1px solid grey' }}
      >
        <div className="flex">
          <Badge color={props.status === 0 ? 'red' : ''} className="mb-2">
            {ORDER_STATUS_MAP[props.status]}
          </Badge>
          {/* <IconX className="ml-auto" /> */}
        </div>

        {props.orderItems.map((orderItem, idx) => (
          <Item key={idx} {...orderItem} />
        ))}
        <div className="flex mt-4">
          <span>구매자 : </span>
        </div>
      </div>
    </div>
  )
}

const Item = (props: OrderItemDetail) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return (
    <div className="w-full flex p-4" style={{ borderBottom: '1px solid grey' }}>
      <Image
        src={props.image_url}
        width={155}
        height={195}
        alt={props.name}
        // onClick={() => {
        //   router.push(`/dnfts/${props.dnftId}`) // TODO: 왜 작동이 안되는 거지?
        //   console.log('qwerqwerqwer' + props.dnftId)
        // }}
      />
      <div className="flex flex-col ml-4">
        <span className="font-semibold mb-2">{props.name}</span>
        <span className="mb-auto">
          가격: {props.amount.toLocaleString('ko-kr')}ETH
        </span>
      </div>
      <div className="flex ml-auto space-x-4"></div>
    </div>
  )
}

const Row = styled.div`
  display: flex;
  * ~ * {
    margin-left: auto;
  }
`
