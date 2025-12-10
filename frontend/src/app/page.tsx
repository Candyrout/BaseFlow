'use client';

import { SwapInterface } from '@/components/SwapInterface';

export default function Home() {
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
          <SwapInterface />
        </div>
      </div>
    </main>
  );
}

