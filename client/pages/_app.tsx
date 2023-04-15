import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  goerli,
  polygonMumbai,
  sepolia,
} from 'wagmi/chains';
import { createClient, configureChains, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { SessionProvider } from 'next-auth/react';

export const { provider, webSocketProvider } = configureChains(
  [mainnet, polygon, optimism, arbitrum, goerli, polygonMumbai, sepolia],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { staleTime: Infinity },
    },
  });
  const activeChain = 'ethereum';

  return (
    <WagmiConfig client={client}>
      <SessionProvider session={session} refetchInterval={0}>
        <QueryClientProvider client={queryClient}>
          <div className='px-36'>
            <Header />

            <Component {...pageProps} />

            <Footer />
          </div>
        </QueryClientProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}
