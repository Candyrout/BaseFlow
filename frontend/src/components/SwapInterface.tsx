'use client';

import { useState } from 'react';

export function SwapInterface() {
  const [tokenIn, setTokenIn] = useState('');
  const [tokenOut, setTokenOut] = useState('');
  const [amount, setAmount] = useState('');

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-semibold mb-6">Swap Tokens</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Token In
          </label>
          <input
            type="text"
            value={tokenIn}
            onChange={(e) => setTokenIn(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-blue focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Token Out
          </label>
          <input
            type="text"
            value={tokenOut}
            onChange={(e) => setTokenOut(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-blue focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-blue focus:border-transparent"
          />
        </div>

        <button className="w-full bg-base-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
          Get Quote
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-500 text-center">
        Connect your wallet to start swapping
      </p>
    </div>
  );
}

