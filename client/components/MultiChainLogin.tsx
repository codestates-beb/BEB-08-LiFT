// 추후 구현
import { useSession, signIn, signOut } from 'next-auth/react'
import Button from './Button'

export default function MultiChainLogin() {
  const { data: session } = useSession()

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {session ? (
        <>
          Signed in as {session.user?.email} <br />
          <br /> <Button onClick={() => signOut()}>Sign out</Button>
        </>
      ) : (
        <>
          {' '}
          Not signed in <br />
          <br />
          <Button onClick={() => signIn()}>Sign in</Button>
        </>
      )}
    </div>
  )
}
