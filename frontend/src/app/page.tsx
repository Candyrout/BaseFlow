'use client';

import { SwapInterface } from '@/components/SwapInterface';
import { ConnectWallet } from '@/components/ConnectWallet';
import { useAccount } from 'wagmi';

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              BaseFlow
            </h1>
            <p className="text-gray-600">
              Optimized liquidity routing for the Base ecosystem
            </p>
          </div>
          
          <div className="mb-6">
            <ConnectWallet />
          </div>

          {isConnected && <SwapInterface />}
          
          {!isConnected && (
            <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
              <p className="text-gray-600">
                Connect your wallet to start swapping
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

