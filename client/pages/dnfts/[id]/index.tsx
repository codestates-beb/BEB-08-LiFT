import Image from 'next/image'
import Carousel from 'nuka-carousel/lib/carousel'
import { useEffect, useMemo, useState } from 'react'

import CustomEditor from '@/components/Editor'
import { useRouter } from 'next/router'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Cart, OrderItem, Wishlist, dnfts } from '@prisma/client'
import { format } from 'date-fns'
import { CATEGORY_NAME } from '@/constants/dnfts'
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { Button } from '@mantine/core'
import { IconHeart, IconHeartbeat, IconShoppingCart } from '@tabler/icons-react'
import { useSession } from 'next-auth/react'
import { CART_QUERY_KEY } from '@/pages/cart'
import { ORDER_QUERY_KEY } from '../../my'
import { error } from 'console'
import { stringify } from 'querystring'

interface CartData {
  dnfts: {
    dnftId: number
    // other properties of the dnft object
  }[]
  // other properties of the cart object
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const product = await fetch(
    `http://localhost:3000/api/get-DNFT?id=${context.params?.id}`
  )
    .then((res) => res.json())
    .then((data) => data.dnfts)

  return {
    props: {
      product: { ...product, images: [product.image_url, product.image_url] },
    },
  }
}

const WISHLIST_QUERY_KEY = '/api/get-wishlist'

export default function Products(props: {
  product: dnfts & { images: string[] }
}) {
  const [index, setIndex] = useState(0)

  const queryClient = useQueryClient()

  const { data: session } = useSession()
  const router = useRouter()
  const { id: dnftId } = router.query

  const [editorState] = useState<EditorState | undefined>(() =>
    props.product.contents
      ? EditorState.createWithContent(
          convertFromRaw(JSON.parse(props.product.contents))
        )
      : EditorState.createEmpty()
  )

  const { data: wishlist } = useQuery([WISHLIST_QUERY_KEY], () =>
    fetch(WISHLIST_QUERY_KEY)
      .then((res) => res.json())
      .then((data) => data.dnfts)
  )

  const { mutate } = useMutation<unknown, unknown, string, any>(
    (dnftId) =>
      fetch('/api/update-wishlist', {
        method: 'POST',
        body: JSON.stringify({ dnftId }),
      })
        .then((data) => data.json())
        .then((res) => res.dnft),
    {
      onMutate: async (productId) => {
        // Optimistic Updates
        await queryClient.cancelQueries([WISHLIST_QUERY_KEY])

        // Snapshot the previous value
        const previous = queryClient.getQueryData([WISHLIST_QUERY_KEY])

        // Optimistically update to the new value
        queryClient.setQueryData<string[]>([WISHLIST_QUERY_KEY], (old) =>
          old
            ? old.includes(String(productId))
              ? old.filter((id) => id != String(productId))
              : old.concat(String(productId))
            : []
        )

        // Return a  context object with the snapshotted value
        return { previous }
      },
      onError: (error, _, context) => {
        queryClient.setQueryData([WISHLIST_QUERY_KEY], context.previous)
      },
      onSuccess: () => {
        queryClient.invalidateQueries([WISHLIST_QUERY_KEY])
      },
    }
  )

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
        queryClient.invalidateQueries([CART_QUERY_KEY])
      },
      onSuccess: () => {
        router.push('/cart')
      },
    }
  )

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
        queryClient.invalidateQueries([ORDER_QUERY_KEY])
      },
      onSuccess: () => {
        router.push('/my')
      },
    }
  )

  const product = props.product

  const isWished =
    wishlist != null && dnftId != null ? wishlist.includes(dnftId) : false

  const { data: dnfts } = useQuery<{ dnfts: dnfts[] }, unknown, dnfts[]>(
    ['/api/get-cart'],
    () => fetch('/api/get-cart').then((res) => res.json()),
    {
      select: (data) => data.dnfts,
    }
  )

  //

  // const result = useMemo(() => {
  //   if (data == null) {
  //     return 0
  //   }
  //   return data
  //     .filter((item) => item.dnftId === product.id)
  // }, [data])
  //

  // const { data } = useQuery<unknown, Cart[]>([CART_QUERY_KEY], () =>
  //   fetch(CART_QUERY_KEY)
  //     .then((res) => res.json())
  //     .then((data) => data.dnfts)
  // )
  const { data } = useQuery<CartData, unknown, CartData>([CART_QUERY_KEY], () =>
    fetch(CART_QUERY_KEY).then((res) => res.json())
  )

  const result = data ? data.dnfts.flatMap((dnft) => dnft.dnftId) : []

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
      addCart({ dnftId: product.id, amount: product.price })
    }
    if (type === 'order') {
      addOrder([
        {
          dnftId: product.id,
          amount: product.price,
        },
      ])
    }
  }

  return (
    <>
      {product != null && dnftId != null ? (
        <div className="flex flex-row">
          <div style={{ maxWidth: 600, marginRight: 52 }}>
            <Carousel
              animation="zoom"
              //autoplay
              withoutControls
              wrapAround
              speed={10}
              slideIndex={index}
            >
              {product.images.map((url, idx) => (
                <Image
                  key={`${url}-carousel-${idx}`}
                  src={url}
                  alt="image"
                  width={1000}
                  height={600}
                />
              ))}
            </Carousel>
            <div className="flex space-x-4 mt-2">
              {product.images.map((url, idx) => (
                <div key={`${url}-thumbs-${idx}`} onClick={() => setIndex(idx)}>
                  <Image src={url} alt="image" width={100} height={60}></Image>
                </div>
              ))}
            </div>
            {editorState != null && (
              <CustomEditor editorState={editorState} readOnly />
            )}
          </div>
          <div style={{ maxWidth: 600 }} className="flex flex-col space-y-6">
            <div className="text-lg text-zinc-400">
              {CATEGORY_NAME[product.category_id - 1]}
            </div>
            <div className="text-4xl font-semibold">{product.name}</div>
            <div className="text-lg">
              {product.price.toLocaleString('ko-kr')}ETH
            </div>
            <div></div>
            <div className="flex space-x-3">
              <Button
                leftIcon={<IconShoppingCart size={20} stroke={1.5} />}
                style={{ backgroundColor: 'black' }}
                radius="xl"
                size="md"
                styles={{
                  root: { paddingRight: 14, height: 48 },
                }}
                onClick={() => {
                  if (session == null) {
                    alert('로그인이 필요합니다.')
                    router.push('/auth/login')
                    return
                  }
                  // 로그인이 된 상태이다.
                  validate('cart')
                }}
              >
                장바구니
              </Button>
              {/* <>{JSON.stringify(wishlist)}</> */}
              <Button
                // loading={isLoading}
                disabled={wishlist == null}
                leftIcon={
                  isWished ? (
                    <IconHeart size={20} stroke={1.5} />
                  ) : (
                    <IconHeartbeat size={20} stroke={1.5} />
                  )
                }
                style={{ backgroundColor: isWished ? 'red' : 'grey' }}
                radius="xl"
                size="md"
                styles={{
                  root: { paddingRight: 14, height: 48 },
                }}
                onClick={() => {
                  if (session == null) {
                    alert('로그인이 필요합니다.')
                    router.push('/auth/login')
                    return
                  }
                  // 로그인이 된 상태이다.
                  mutate(String(dnftId))
                }}
              >
                찜하기
              </Button>
            </div>
            <Button
              style={{ backgroundColor: 'black' }}
              radius="xl"
              size="md"
              styles={{
                root: { paddingRight: 14, height: 48 },
              }}
              onClick={() => {
                if (session == null) {
                  alert('로그인이 필요합니다.')
                  router.push('/auth/login')
                  return
                }
                // 로그인이 된 상태이다.
                validate('order')
              }}
            >
              구매하기
            </Button>
            {/* date-fns */}
            <div className="text-sm text-zinc-300">
              등록: {format(new Date(product.createdAt), 'yyyy년 M월 d일')}
            </div>
          </div>
        </div>
      ) : (
        <div>로딩중</div>
      )}
    </>
  )
}
