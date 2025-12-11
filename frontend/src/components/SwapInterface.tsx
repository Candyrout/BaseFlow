'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { getQuote, type Quote } from '@/lib/api';
import { formatUnits, parseUnits } from 'viem';

export function SwapInterface() {
  const { address } = useAccount();
  const [tokenIn, setTokenIn] = useState('');
  const [tokenOut, setTokenOut] = useState('');
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Common Base tokens for quick selection
  const commonTokens = {
    WETH: '0x4200000000000000000000000000000000000006',
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    DAI: '0x50c5725949A6F0c72E6C4a641F24049A917E0D69',
  };

  const fetchQuote = async () => {
    if (!tokenIn || !tokenOut || !amount || !address) {
      setError('Please fill in all fields and connect wallet');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert amount to wei (assuming 18 decimals for simplicity)
      const amountWei = parseUnits(amount, 18).toString();
      const quoteData = await getQuote(tokenIn, tokenOut, amountWei);
      setQuote(quoteData);
    } catch (err: any) {
      setError(err.message || 'Failed to get quote');
      setQuote(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = async () => {
    if (!quote || !address) return;
    // TODO: Implement actual swap execution
    alert('Swap execution will be implemented with contract interaction');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-semibold mb-6">Swap Tokens</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Token In
          </label>
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setTokenIn(commonTokens.WETH)}
              className="px-3 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
            >
              WETH
            </button>
            <button
              onClick={() => setTokenIn(commonTokens.USDC)}
              className="px-3 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
            >
              USDC
            </button>
          </div>
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
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setTokenOut(commonTokens.WETH)}
              className="px-3 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
            >
              WETH
            </button>
            <button
              onClick={() => setTokenOut(commonTokens.USDC)}
              className="px-3 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
            >
              USDC
            </button>
          </div>
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

        <button
          onClick={fetchQuote}
          disabled={loading || !tokenIn || !tokenOut || !amount}
          className="w-full bg-base-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Getting Quote...' : 'Get Quote'}
        </button>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {quote && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">DEX:</span>
              <span className="font-semibold capitalize">{quote.dex}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount Out:</span>
              <span className="font-semibold">
                {formatUnits(BigInt(quote.amountOut), 18).slice(0, 8)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Price Impact:</span>
              <span className="font-semibold">{quote.priceImpact}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Gas Estimate:</span>
              <span className="font-semibold">{quote.gasEstimate}</span>
            </div>
            <button
              onClick={handleSwap}
              className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Swap
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
