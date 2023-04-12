import {
  IconHeart,
  IconHome,
  IconShoppingCart,
  IconUser,
} from '@tabler/icons-react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useDisconnect } from 'wagmi';

export default function Header() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const { disconnect } = useDisconnect();

  const router = useRouter();
  return (
    <div className='mt-12 mb-12'>
      <div className='w-full flex h-50 items-center'>
        <IconHome onClick={() => router.push('/')} />
        <span className='m-auto' />
        <IconHeart className='mr-4' onClick={() => router.push('/wishlist')} />
        <IconShoppingCart
          className='mr-4'
          onClick={() => router.push('/cart')}
        />

        {session ? (
          <Image
            alt='profile'
            src={session.user?.image!}
            width={30}
            height={30}
            style={{ borderRadius: '50%' }}
            onClick={() => router.push('/my')}
          />
        ) : (
          <IconUser onClick={() => router.push('/auth/login')} />
        )}
      </div>
    </div>
  );
}
