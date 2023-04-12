import { CATEGORY_NAME } from '@/constants/dnfts'
import styled from '@emotion/styled'
import { Button } from '@mantine/core'
import { Cart, OrderItem, dnfts } from '@prisma/client'
import { IconX } from '@tabler/icons-react'
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { ORDER_QUERY_KEY } from './my'

interface CartItem extends Cart {
  name: string
  price: number
  image_url: string
}

export const CART_QUERY_KEY = '/api/get-cart'

export default function CartPage() {
  const router = useRouter()

  const queryClient = useQueryClient()

  const { data } = useQuery<{ dnfts: CartItem[] }, unknown, CartItem[]>(
    [CART_QUERY_KEY],
    () =>
      fetch(CART_QUERY_KEY)
        .then((res) => res.json())
        .then((data) => data.dnfts)
  )

  console.log('cart DNFT:' + JSON.stringify(data))

  const discountAmount = data && data.length > 0 ? 0 : 0
  // TODO:  추후 할인 서비스 개시할 시 수정

  const amount = useMemo(() => {
    if (data == null) {
      return 0
    }
    return data
      .map((item) => item.amount)
      .reduce((prev, curr) => prev + curr, 0)
  }, [data])

  // TODO: 찜해놓은 dnft를 보여줘도 좋을 것 같음
  const { data: dnfts } = useQuery<{ dnfts: dnfts[] }, unknown, dnfts[]>(
    [
      `/api/get-DNFTs?skip=0
      &take=3`,
    ],
    () =>
      fetch(
        `/api/get-DNFTs?skip=0
      &take=3`
      ).then((res) => res.json()),
    {
      select: (data) => data.dnfts,
    }
  )

  const { mutate: addOrder } = useMutation<
    unknown,
    Omit<OrderItem, 'id'>[],
    any
  >(
    (items) =>
      fetch('/api/add-order', {
        //
        method: 'POST',
        body: JSON.stringify({ items }), //
      })
        .then((data) => data.json())
        .then((res) => res.items),
    {
      onMutate: () => {
        queryClient.invalidateQueries([ORDER_QUERY_KEY])
      },
      onSuccess: () => {
        router.push('/my')
      },
    }
  )

  const handleOrder = () => {
    // TODO: 주문하기 기능
    //alert(`${JSON.stringify(data)} 주문`)
    if (data == null) {
      return
    }
    addOrder(
      data.map((cart) => ({
        dnftId: cart.dnftId,
        amount: cart.amount,
      }))
    )
  }

  return (
    <div>
      <span className="text-2xl mb-3">Cart {data ? data.length : 0}</span>
      <div className="flex">
        <div className="flex flex-col p-4 flex-1">
          {data ? (
            data.length > 0 ? (
              data.map((item, idx) => <Item key={idx} {...item} />)
            ) : (
              <div>장바구니에 아무것도 없습니다.</div>
            )
          ) : (
            <div>불러오는 중...</div>
          )}
        </div>
        <div className="px-4">
          <div
            className="flex-col p-4 space-y-4"
            style={{ minWidth: 300, border: '1px solid grey' }}
          >
            <div>Info</div>
            <Row>
              <span>총 금액</span>
              <span>{amount.toLocaleString('ko-kr')} ETH</span>
            </Row>
            <Row>
              <span>할인 금액</span>
              <span>{discountAmount.toLocaleString('ko-kr')} ETH</span>
            </Row>
            <Row>
              <span className="font-semibold">결재 금액</span>
              <span className="font-semibold text-red-500">
                {(amount - discountAmount).toLocaleString('ko-kr')} ETH
              </span>
            </Row>

            <Button
              style={{ backgroundColor: 'black' }}
              radius="xl"
              size="md"
              styles={{
                root: { height: 48 },
              }}
              onClick={handleOrder}
            >
              구매하기
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-32">
        <p>추천상품</p>
        {dnfts && (
          <div className="grid grid-cols-3 gap-5">
            {dnfts.map((dnft) => (
              <div
                key={dnft.id}
                style={{ maxWidth: 500 }}
                onClick={() => router.push(`/dnfts/${dnft.id}`)}
              >
                <Image
                  className="rounded"
                  alt={dnft.name}
                  src={dnft.image_url ?? ''}
                  width={500}
                  height={300}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg=="
                />
                <div>
                  <span>{dnft.name}</span>

                  <span className="ml-auto">
                    <span className="float-right">
                      {dnft.price.toLocaleString('ko-KR')}ETH
                    </span>
                  </span>
                </div>
                <span className="text-zinc-400">
                  {CATEGORY_NAME[dnft.category_id - 1]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const Item = (props: CartItem) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { mutate: deleteCart } = useMutation<unknown, unknown, number, any>(
    (id) =>
      fetch('/api/delete-cart', {
        method: 'POST',
        body: JSON.stringify({ id }),
      })
        .then((data) => data.json())
        .then((res) => res.dnft),
    {
      onMutate: async (id) => {
        // Optimistic Updates
        await queryClient.cancelQueries([CART_QUERY_KEY])

        // Snapshot the previous value
        const previous = queryClient.getQueryData([CART_QUERY_KEY])

        // Optimistically update to the new value
        queryClient.setQueryData<Cart[]>([CART_QUERY_KEY], (old) =>
          old?.filter((c) => c.id != id)
        )

        // Return a context object with the snapshotted value
        return { previous }
      },
      onError: (error, _, context) => {
        queryClient.setQueryData([CART_QUERY_KEY], context.previous)
      },
      onSuccess: () => {
        queryClient.invalidateQueries([CART_QUERY_KEY])
      },
    }
  )

  const handleDelete = async () => {
    await deleteCart(props.id)
    alert(`장바구니에서 ${props.name} 삭제`)
  }

  return (
    <div className="w-full flex p-4" style={{ borderBottom: '1px solid grey' }}>
      <Image
        src={props.image_url}
        width={155}
        height={195}
        alt={props.name}
        onClick={() => router.push(`/dnfts/${props.dnftId}`)}
      />
      <div className="flex flex-col ml-4">
        <span className="font-semibold mb-2">{props.name}</span>
        <span className="mb-auto">
          가격: {props.price.toLocaleString('ko-kr')}ETH
        </span>
      </div>
      <div className="flex ml-auto space-x-4">
        <IconX onClick={handleDelete} />
      </div>
    </div>
  )
}

const Row = styled.div`
  display: flex;
  * ~ * {
    margin-left: auto;
  }
`
