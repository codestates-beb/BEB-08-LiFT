import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { alchemyProvider } from 'wagmi/providers/alchemy';

import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  goerli,
  polygonMumbai,
} from 'wagmi/chains';
import { createClient, configureChains, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { SessionProvider } from 'next-auth/react';
import { InjectedConnector } from 'wagmi/connectors/injected';

export const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, polygon, optimism, arbitrum, goerli, polygonMumbai],
  [
    alchemyProvider({ apiKey: '5TGG0GWvMbPVHurH4IfOV-kuIFj1I95U' }),
    publicProvider(),
  ]
);

const client = createClient({
  autoConnect: true,
  provider,
  // connectors: [new InjectedConnector({ chains })],
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

  return (
    <SessionProvider session={pageProps.session} refetchInterval={0}>
      <WagmiConfig client={client}>
        <QueryClientProvider client={queryClient}>
          <div className='px-36'>
            <Header />

            <Component {...pageProps} />

            <Footer />
          </div>
        </QueryClientProvider>
      </WagmiConfig>
    </SessionProvider>
  );
}
