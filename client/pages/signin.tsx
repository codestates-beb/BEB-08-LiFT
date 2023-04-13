import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { signIn } from 'next-auth/react';
import { useAccount, useConnect, useSignMessage, useDisconnect } from 'wagmi';
import { useRouter } from 'next/router';
import { useAuthRequestChallengeEvm } from '@moralisweb3/next';

function SignIn() {
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { requestChallengeAsync } = useAuthRequestChallengeEvm();
  const { push } = useRouter();

  const handleAuth = async () => {
    if (isConnected) {
      await disconnectAsync();
    }

    const { account, chain } = await connectAsync({
      connector: new MetaMaskConnector(),
    });

    const { message } = await requestChallengeAsync({
      address: account,
      chainId: chain.id,
    });

    const signature = await signMessageAsync({ message });
    // redirect user after success authentication to '/user' page
    const { url } = await signIn('moralis-auth', {
      message,
      signature,
      redirect: false,
      callbackUrl: '/',
    });
    /**
     * instead of using signIn(..., redirect: "/user")
     * we get the url from callback and push it to the router to avoid page refreshing
     */
    fetch(`/api/auth/sign-up?address=${account}`) // user DB에 저장
      .then((res) => res.json())
      .then((data) => console.log(data));

    fetch(`/api/auth/enroll-wishlist?address=${account}`) // wishlist DB에 저장
      .then((res) => res.json())
      .then((data) => console.log(data));
    push(url);
  };

  return (
    <div>
      <h3>Web3 Authentication</h3>
      <button
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto mb-5'
        onClick={handleAuth}
      >
        Authenticate via Metamask
      </button>
    </div>
  );
}

export default SignIn;
