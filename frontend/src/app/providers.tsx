'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { http } from 'wagmi';

// Get WalletConnect project ID from environment
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  console.warn(
    '⚠️  WalletConnect Project ID not found. Please set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in your .env.local file.\n' +
    'Get your project ID from: https://cloud.walletconnect.com'
  );
}

const config = getDefaultConfig({
  appName: 'BaseFlow',
  projectId: projectId || '00000000000000000000000000000000000000000000', // Placeholder - will show error if not set
  chains: [
    process.env.NEXT_PUBLIC_CHAIN_ID === '8453' ? base : baseSepolia,
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

