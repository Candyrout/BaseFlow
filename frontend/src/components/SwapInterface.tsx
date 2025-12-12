'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { getQuote, type Quote } from '@/lib/api';
import { formatUnits, parseUnits, type Address } from 'viem';
import { getFlowRouterAddress, FLOW_ROUTER_ABI, ERC20_ABI, WETH_ABI, WETH_ADDRESS } from '@/lib/contracts';
import { prepareSwapPaths, calculateMinAmountOut } from '@/lib/swap';
import { useBalance } from 'wagmi';

export function SwapInterface() {
  const { address } = useAccount();
  const [tokenIn, setTokenIn] = useState('');
  const [tokenOut, setTokenOut] = useState('');
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slippage, setSlippage] = useState(0.5); // 0.5% default slippage
  const [swapStatus, setSwapStatus] = useState<'idle' | 'approving' | 'swapping' | 'success' | 'error'>('idle');

  // Wagmi hooks for contract interaction
  const { writeContract, data: hash, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Check token allowance
  const { data: allowance } = useReadContract({
    address: quote?.tokenIn as Address,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: quote && address ? [address as Address, getFlowRouterAddress()] : undefined,
    query: { enabled: !!quote && !!address },
  });

  // Check token balance
  const { data: tokenBalance } = useReadContract({
    address: quote?.tokenIn as Address,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address as Address] : undefined,
    query: { enabled: !!quote && !!address },
  });

  // Check native ETH balance (for WETH wrapping)
  const { data: nativeBalance } = useBalance({
    address: address,
  });

  // Calculate amount in wei
  const amountWei = quote && amount ? parseUnits(amount, 18) : 0n;
  
  // Check if token is WETH
  const isWETH = quote?.tokenIn?.toLowerCase() === WETH_ADDRESS.toLowerCase();
  
  // Check if user needs to wrap ETH to WETH
  // Reserve some ETH for gas (estimate ~0.001 ETH)
  const gasReserve = parseUnits('0.001', 18);
  const maxWrappable = nativeBalance && nativeBalance.value > gasReserve 
    ? nativeBalance.value - gasReserve 
    : 0n;
  
  const needsWrapping = isWETH && 
    tokenBalance !== undefined && 
    tokenBalance < amountWei && 
    nativeBalance && 
    maxWrappable >= amountWei;

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

  const handleWrapETH = async () => {
    if (!quote || !address || !amount || !nativeBalance) return;

    try {
      setSwapStatus('approving'); // Reuse status for wrapping
      setError(null);

      const amountWei = parseUnits(amount, 18);
      
      // Reserve some ETH for gas (estimate ~0.001 ETH for gas)
      const gasReserve = parseUnits('0.001', 18);
      const maxWrappable = nativeBalance.value > gasReserve 
        ? nativeBalance.value - gasReserve 
        : 0n;

      // Check if user has enough ETH (with gas reserve)
      if (nativeBalance.value < amountWei + gasReserve) {
        const available = formatUnits(maxWrappable, 18);
        setError(
          `Insufficient ETH. You have ${formatUnits(nativeBalance.value, 18).slice(0, 8)} ETH, ` +
          `but need ${amount} ETH + gas fees. Maximum you can wrap: ${available.slice(0, 8)} ETH`
        );
        setSwapStatus('error');
        return;
      }

      // If amount exceeds max wrappable, use max
      const wrapAmount = amountWei > maxWrappable ? maxWrappable : amountWei;

      await writeContract({
        address: WETH_ADDRESS,
        abi: WETH_ABI,
        functionName: 'deposit',
        value: wrapAmount,
      });
    } catch (err: any) {
      let errorMessage = err.message || 'Failed to wrap ETH';
      
      // Provide more helpful error messages
      if (err.message?.includes('insufficient funds') || err.message?.includes('balance')) {
        errorMessage = 'Insufficient ETH balance. Make sure you have enough ETH to wrap and pay for gas fees.';
      } else if (err.message?.includes('revert')) {
        errorMessage = 'Wrapping failed. Please check your ETH balance and try again.';
      } else if (err.message?.includes('user rejected')) {
        errorMessage = 'Transaction was cancelled.';
      }
      
      setError(errorMessage);
      setSwapStatus('error');
    }
  };

  const handleApprove = async () => {
    if (!quote || !address) return;

    try {
      setSwapStatus('approving');
      setError(null);

      const amountWei = parseUnits(amount, 18);
      const routerAddress = getFlowRouterAddress();

      // Check balance first
      if (tokenBalance !== undefined && tokenBalance < amountWei) {
        setError(`Insufficient balance. You have ${formatUnits(tokenBalance, 18).slice(0, 8)} but need ${amount}`);
        setSwapStatus('error');
        return;
      }

      await writeContract({
        address: quote.tokenIn as Address,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [routerAddress, amountWei],
      });
    } catch (err: any) {
      // Provide more helpful error messages
      let errorMessage = err.message || 'Approval failed';
      if (err.message?.includes('balance')) {
        errorMessage = 'Insufficient token balance. Please check your balance.';
      } else if (err.message?.includes('revert')) {
        errorMessage = 'Approval failed. Make sure you have enough balance and gas.';
      }
      setError(errorMessage);
      setSwapStatus('error');
    }
  };

  const handleSwap = async () => {
    if (!quote || !address) return;

    try {
      setSwapStatus('swapping');
      setError(null);

      const amountWei = parseUnits(amount, 18);
      const minAmountOut = calculateMinAmountOut(quote.amountOut, slippage * 100); // Convert to basis points
      const paths = prepareSwapPaths(quote);
      const routerAddress = getFlowRouterAddress();

      await writeContract({
        address: routerAddress,
        abi: FLOW_ROUTER_ABI,
        functionName: 'swap',
        args: [paths, amountWei, minAmountOut],
      });
    } catch (err: any) {
      setError(err.message || 'Swap failed');
      setSwapStatus('error');
    }
  };

  // Update swap status based on transaction
  if (isConfirmed && swapStatus === 'swapping') {
    setSwapStatus('success');
    // Reset after 3 seconds
    setTimeout(() => {
      setSwapStatus('idle');
      setQuote(null);
      setAmount('');
    }, 3000);
  }

  if (isConfirmed && swapStatus === 'approving') {
    setSwapStatus('idle');
  }

  // Check if approval is needed
  const needsApproval = allowance !== undefined && allowance < amountWei && !needsWrapping;

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
          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
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

            {/* Slippage Tolerance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slippage Tolerance: {slippage}%
              </label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={slippage}
                onChange={(e) => setSlippage(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Transaction Status */}
            {swapStatus === 'success' && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                ✅ Swap successful! Transaction: {hash && `${hash.slice(0, 10)}...`}
              </div>
            )}

            {writeError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                Error: {writeError.message}
              </div>
            )}

            {/* Balance Warning */}
            {tokenBalance !== undefined && tokenBalance < amountWei && !needsWrapping && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
                ⚠️ Insufficient balance. You have {formatUnits(tokenBalance, 18).slice(0, 8)} but need {amount}
              </div>
            )}
            
            {/* WETH Wrapping Info */}
            {needsWrapping && nativeBalance && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
                💡 You have {formatUnits(nativeBalance.value, 18).slice(0, 8)} ETH but need WETH. 
                You can wrap up to {formatUnits(maxWrappable, 18).slice(0, 8)} ETH (reserving gas fees).
              </div>
            )}
            
            {/* Insufficient ETH for wrapping */}
            {isWETH && tokenBalance !== undefined && tokenBalance < amountWei && nativeBalance && maxWrappable < amountWei && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                ❌ Insufficient ETH. You have {formatUnits(nativeBalance.value, 18).slice(0, 8)} ETH, 
                but need {amount} ETH + gas fees. Maximum wrappable: {formatUnits(maxWrappable, 18).slice(0, 8)} ETH
              </div>
            )}

            {/* Action Buttons */}
            {needsWrapping ? (
              <button
                onClick={handleWrapETH}
                disabled={
                  swapStatus === 'approving' || 
                  isConfirming || 
                  !nativeBalance || 
                  maxWrappable < amountWei
                }
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {swapStatus === 'approving' || isConfirming ? 'Wrapping ETH...' : `Wrap ${amount} ETH to WETH`}
              </button>
            ) : needsApproval ? (
              <button
                onClick={handleApprove}
                disabled={swapStatus === 'approving' || isConfirming}
                className="w-full mt-4 bg-yellow-600 text-white py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {swapStatus === 'approving' || isConfirming ? 'Approving...' : 'Approve Token'}
              </button>
            ) : (
              <button
                onClick={handleSwap}
                disabled={swapStatus === 'swapping' || isConfirming || !quote || (tokenBalance !== undefined && tokenBalance < amountWei)}
                className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {swapStatus === 'swapping' || isConfirming ? 'Swapping...' : 'Swap'}
              </button>
            )}

            {hash && (
              <div className="text-xs text-gray-500 text-center mt-2">
                Transaction: {hash.slice(0, 10)}...{hash.slice(-8)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
