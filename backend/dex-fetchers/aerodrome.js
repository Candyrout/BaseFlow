/**
 * Aerodrome Quote Fetcher
 * Fetches quotes from Aerodrome DEX on Base using Router contract
 */

import { ethers } from 'ethers';

// Aerodrome Router address on Base
const AERODROME_ROUTER = '0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43';

// Router ABI (simplified - only what we need)
const ROUTER_ABI = [
  'function getAmountsOut(uint256 amountIn, tuple(address from, address to, bool stable)[] routes) external view returns (uint256[] amounts)'
];

/**
 * Get quote from Aerodrome
 * @param {string} tokenIn - Input token address
 * @param {string} tokenOut - Output token address
 * @param {string} amount - Input amount (wei)
 * @param {string} rpcUrl - Base RPC URL
 * @returns {Promise<Object>} Quote object
 */
export async function getAerodromeQuote(tokenIn, tokenOut, amount, rpcUrl = process.env.BASE_MAINNET_RPC || 'https://mainnet.base.org') {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const router = new ethers.Contract(AERODROME_ROUTER, ROUTER_ABI, provider);

    let bestQuote = null;
    let bestAmountOut = BigInt(0);
    let useStable = false;

    // Try volatile pool first
    const routesVolatile = [{
      from: tokenIn,
      to: tokenOut,
      stable: false
    }];

    try {
      const amounts = await router.getAmountsOut.staticCall(amount, routesVolatile);
      const amountOut = amounts[amounts.length - 1]; // Last element is output
      
      if (amountOut > bestAmountOut) {
        bestAmountOut = amountOut;
        useStable = false;
        bestQuote = {
          amountOut: amountOut.toString(),
          routes: routesVolatile
        };
      }
    } catch (error) {
      console.debug('No volatile pool found:', error.message);
    }

    // Try stable pool
    const routesStable = [{
      from: tokenIn,
      to: tokenOut,
      stable: true
    }];

    try {
      const amounts = await router.getAmountsOut.staticCall(amount, routesStable);
      const amountOut = amounts[amounts.length - 1];
      
      if (amountOut > bestAmountOut) {
        bestAmountOut = amountOut;
        useStable = true;
        bestQuote = {
          amountOut: amountOut.toString(),
          routes: routesStable
        };
      }
    } catch (error) {
      console.debug('No stable pool found:', error.message);
    }

    if (!bestQuote) {
      throw new Error('No Aerodrome pool found for this token pair');
    }

    // Calculate price impact (simplified)
    const amountInBig = BigInt(amount);
    const priceImpact = calculatePriceImpact(amountInBig, bestAmountOut);

    return {
      dex: 'aerodrome',
      amountOut: bestQuote.amountOut,
      route: {
        path: [tokenIn, tokenOut],
        dex: 'aerodrome',
        stable: useStable
      },
      priceImpact: priceImpact.toString(),
      gasEstimate: '150000', // Estimated gas for Aerodrome swap
      stable: useStable
    };
  } catch (error) {
    console.error('Aerodrome quote error:', error);
    throw error;
  }
}

/**
 * Calculate price impact (simplified)
 * @param {bigint} amountIn - Input amount
 * @param {bigint} amountOut - Output amount
 * @returns {number} Price impact percentage
 */
function calculatePriceImpact(amountIn, amountOut) {
  // Simplified calculation - in production, use actual pool reserves
  return 0.1; // 0.1% default
}
