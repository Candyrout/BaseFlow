/**
 * BaseSwap Quote Fetcher
 * Fetches quotes from BaseSwap DEX on Base
 */

import { ethers } from 'ethers';

// BaseSwap Router address on Base (placeholder - needs verification)
// BaseSwap typically uses a Uniswap V2-style router
const BASESWAP_ROUTER = '0x327Df1E6de05895d2ab08513aaDD9313Fe505d86'; // Common BaseSwap router address

// Router ABI (Uniswap V2 style)
const ROUTER_ABI = [
  'function getAmountsOut(uint256 amountIn, address[] path) external view returns (uint256[] amounts)'
];

/**
 * Get quote from BaseSwap
 * @param {string} tokenIn - Input token address
 * @param {string} tokenOut - Output token address
 * @param {string} amount - Input amount (wei)
 * @param {string} rpcUrl - Base RPC URL
 * @returns {Promise<Object>} Quote object
 */
export async function getBaseSwapQuote(tokenIn, tokenOut, amount, rpcUrl = process.env.BASE_MAINNET_RPC || 'https://mainnet.base.org') {
  try {
    // Validate inputs
    if (!tokenIn || !tokenOut || !amount) {
      return null;
    }

    // Check for identical addresses (common error)
    if (tokenIn.toLowerCase() === tokenOut.toLowerCase()) {
      return null;
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const router = new ethers.Contract(BASESWAP_ROUTER, ROUTER_ABI, provider);

    // Direct path
    const path = [tokenIn, tokenOut];

    try {
      const amounts = await router.getAmountsOut.staticCall(amount, path);
      const amountOut = amounts[amounts.length - 1]; // Last element is output

      // Calculate price impact (simplified)
      const amountInBig = BigInt(amount);
      const priceImpact = calculatePriceImpact(amountInBig, amountOut);

      return {
        dex: 'baseswap',
        amountOut: amountOut.toString(),
        route: {
          path: [tokenIn, tokenOut],
          dex: 'baseswap'
        },
        priceImpact: priceImpact.toString(),
        gasEstimate: '120000', // Estimated gas for BaseSwap swap
      };
    } catch (error) {
      // Pool might not exist for this pair - this is expected
      // Silently return null instead of throwing
      return null;
    }
  } catch (error) {
    // Unexpected errors - return null instead of throwing
    // This prevents crashes when BaseSwap is unavailable
    return null;
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
