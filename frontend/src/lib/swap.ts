/**
 * Swap execution utilities
 */

import { getFlowRouterAddress, FLOW_ROUTER_ABI, ERC20_ABI } from './contracts';
import { type Address, encodeAbiParameters, parseAbiParameters } from 'viem';
import type { Quote } from './api';

// DEX adapter addresses (from deployment)
const ADAPTER_ADDRESSES: Record<string, Address> = {
  'uniswap-v3': process.env.NEXT_PUBLIC_CHAIN_ID === '8453' 
    ? '0x696d9eCCB5766F90bDaBBf9295159E00cc8BDA81' as Address // Mainnet
    : '0xE19ED72bBAd0a0f2Dd447726DB6281c921180Bc5' as Address, // Sepolia
  'aerodrome': process.env.NEXT_PUBLIC_CHAIN_ID === '8453'
    ? '0x59f28BFb9f8c696E20Efb3Dc8f2555372120f859' as Address // Mainnet
    : '0x86abAE065A10B6B6076cb32A7832658EA19Aca61' as Address, // Sepolia
};

/**
 * Prepare swap paths for FlowRouter
 */
export function prepareSwapPaths(quote: Quote): any[] {
  const adapterAddress = ADAPTER_ADDRESSES[quote.dex];
  
  if (!adapterAddress) {
    throw new Error(`Adapter not found for DEX: ${quote.dex}`);
  }

  // Prepare swap path data
  let pathData = '0x';
  
  // For Uniswap V3, encode the fee tier
  if (quote.dex === 'uniswap-v3' && quote.route.fee !== undefined) {
    const feeValue = Number(quote.route.fee);
    pathData = encodeAbiParameters(
      parseAbiParameters('uint24'),
      [feeValue]
    );
  }
  
  // For Aerodrome, encode the stable flag
  if (quote.dex === 'aerodrome' && quote.route.stable !== undefined) {
    // Aerodrome uses routes array, but for single path we can use empty data
    pathData = '0x';
  }

  return [
    {
      dex: adapterAddress,
      tokenIn: quote.tokenIn as Address,
      tokenOut: quote.tokenOut as Address,
      data: pathData as `0x${string}`
    }
  ];
}

/**
 * Calculate minimum amount out with slippage tolerance
 */
export function calculateMinAmountOut(amountOut: string, slippageBps: number = 50): bigint {
  const amount = BigInt(amountOut);
  const slippage = BigInt(slippageBps); // 50 = 0.5%
  const minAmount = (amount * (10000n - slippage)) / 10000n;
  return minAmount;
}

