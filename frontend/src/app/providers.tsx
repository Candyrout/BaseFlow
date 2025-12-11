'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { http } from 'wagmi';

// Get WalletConnect project ID from environment
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId || projectId === 'your_project_id_here' || projectId.trim() === '') {
  throw new Error(
    '❌ WalletConnect Project ID is required!\n\n' +
    'Please set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in your .env.local file.\n\n' +
    'Quick setup:\n' +
    '1. Go to https://cloud.walletconnect.com\n' +
    '2. Create a new project\n' +
    '3. Copy the Project ID\n' +
    '4. Add it to frontend/.env.local:\n' +
    '   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id\n\n' +
    'See frontend/ENV_SETUP.md for detailed instructions.'
  );
}

const config = getDefaultConfig({
  appName: 'BaseFlow',
  projectId: projectId,
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

