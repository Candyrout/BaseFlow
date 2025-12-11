'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { http } from 'wagmi';

// Get WalletConnect project ID from environment
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

// Component to show setup instructions if project ID is missing
function WalletConnectSetup() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">BaseFlow Setup Required</h1>
        <div className="space-y-4 text-gray-700">
          <p className="text-lg">
            WalletConnect Project ID is required to connect wallets.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="font-semibold text-blue-900 mb-2">Quick Setup (2 minutes):</h2>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Go to <a href="https://cloud.walletconnect.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">https://cloud.walletconnect.com</a></li>
              <li>Sign up or log in (free)</li>
              <li>Click <strong>"Create New Project"</strong></li>
              <li>Name it <strong>"BaseFlow"</strong></li>
              <li>Copy the <strong>Project ID</strong></li>
              <li>Add to <code className="bg-blue-100 px-2 py-1 rounded">frontend/.env.local</code>:
                <pre className="mt-2 bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
                </pre>
              </li>
              <li>Restart the dev server</li>
            </ol>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Complete .env.local file:</h3>
            <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ROUTER_ADDRESS=0xD9a60b0Bc8d8C7F9Bd1aab40B0486756eAF997C3
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here`}
            </pre>
          </div>

          <p className="text-sm text-gray-600">
            See <code className="bg-gray-100 px-2 py-1 rounded">frontend/ENV_SETUP.md</code> or <code className="bg-gray-100 px-2 py-1 rounded">frontend/QUICK_FIX.md</code> for detailed instructions.
          </p>
        </div>
      </div>
    </div>
  );
}

// Check if project ID is valid
const isValidProjectId = projectId && 
  projectId !== 'your_project_id_here' && 
  projectId.trim() !== '' &&
  projectId.length > 20; // WalletConnect project IDs are typically long

let config: any = null;
if (isValidProjectId) {
  config = getDefaultConfig({
    appName: 'BaseFlow',
    projectId: projectId!,
    chains: [
      process.env.NEXT_PUBLIC_CHAIN_ID === '8453' ? base : baseSepolia,
    ],
    transports: {
      [base.id]: http(),
      [baseSepolia.id]: http(),
    },
    ssr: true,
  });
}

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  // Show setup screen if project ID is missing
  if (!isValidProjectId) {
    return <WalletConnectSetup />;
  }

  return (
    <WagmiProvider config={config!}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

