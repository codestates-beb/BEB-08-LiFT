import { getCsrfToken, signIn, useSession, getSession } from 'next-auth/react'
import { SiweMessage } from 'siwe'
import { useAccount, useConnect, useNetwork, useSignMessage } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useEffect, useState } from 'react'
import { Button } from '@mantine/core'

function Siwe() {
  const { signMessageAsync } = useSignMessage()
  const { chain } = useNetwork()
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { data: session, status } = useSession()

  const handleLogin = async () => {
    try {
      const callbackUrl = '/protected'
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId: chain?.id,
        nonce: await getCsrfToken(), //getCsrfToken
      })
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      })
      signIn('credentials', {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl,
      })
    } catch (error) {
      window.alert(error)
    }
  }

  useEffect(() => {
    console.log(isConnected)
    if (isConnected && !session) {
      handleLogin()
      fetch(`/api/auth/sign-up?address=${address}`).then((res) => res.json())
    }
  }, [isConnected])

  return (
    <>
      <Button
        onClick={(e) => {
          e.preventDefault()
          if (!isConnected) {
            connect()
          } else {
            handleLogin()
          }
        }}
      >
        Sign-in
      </Button>
    </>
  )
}

export async function getServerSideProps(context: any) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  }
}

export default Siwe

// fetch('/api/auth/sign-up?address=${address}') // test 해보자 안되면 message ㄱㄱ
// credential은 사실 말이 안된다. 로그인을 다 한 후에 {"url":"http://localhost:3000/me"}가 만들어질 것이기 때문이다. (setTimeout으로 딜레이를 주면 될지도 모르겠지만..)
