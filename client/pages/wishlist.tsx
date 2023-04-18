import { CATEGORY_NAME } from '@/constants/dnfts';
import { nft } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Wishlist() {
  const router = useRouter();

  const { data: dnfts } = useQuery<{ dnfts: nft[] }, unknown, nft[]>(
    ['/api/get-wishlists'],
    () => fetch('/api/get-wishlists').then((res) => res.json()),
    {
      select: (data) => data.dnfts,
    }
  );

  return (
    <div>
      <p className='text-2xl mb-4'>내가 찜한 DNFT</p>
      {dnfts && (
        <div className='grid grid-cols-3 gap-5'>
          {dnfts.map((dnft) => (
            <div
              key={dnft.id}
              style={{ maxWidth: 500 }}
              onClick={() => router.push(`/dnfts/${dnft.id}`)}
            >
              <Image
                className='rounded'
                alt={dnft.name}
                src={dnft.ipfs_url ?? ''}
                width={500}
                height={300}
                placeholder='blur'
                blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg=='
              />
              <div>
                <span>{dnft.name}</span>

                <span className='ml-auto'>
                  <span className='float-right'>
                    0.1 ETH
                    {/* {dnft.price.toLocaleString('ko-KR')}ETH */}
                  </span>
                </span>
              </div>
              <span className='text-zinc-400'>
                Weather DNFT
                {/* {CATEGORY_NAME[dnft.category_id - 1]} */}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
