/**
 * Uniswap V3 Quote Fetcher
 * Fetches quotes from Uniswap V3 on Base using QuoterV2 contract
 */

import { ethers } from 'ethers';

// Uniswap V3 addresses on Base
const QUOTER_V2_ADDRESS = '0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a';
const SWAP_ROUTER_02 = '0x2626664c2603336E57B271c5C0b26F421741e481';

// QuoterV2 ABI (simplified - only what we need)
const QUOTER_V2_ABI = [
  'function quoteExactInputSingle((address tokenIn, address tokenOut, uint24 fee, uint256 amountIn, uint160 sqrtPriceLimitX96)) external returns (uint256 amountOut, uint160 sqrtPriceX96After, uint32 initializedTicksCrossed, uint256 gasEstimate)'
];

// Common fee tiers
const FEE_TIERS = [500, 3000, 10000]; // 0.05%, 0.3%, 1%

/**
 * Get quote from Uniswap V3
 * @param {string} tokenIn - Input token address
 * @param {string} tokenOut - Output token address
 * @param {string} amount - Input amount (wei)
 * @param {string} rpcUrl - Base RPC URL
 * @returns {Promise<Object>} Quote object
 */
export async function getUniswapV3Quote(tokenIn, tokenOut, amount, rpcUrl = process.env.BASE_MAINNET_RPC || 'https://mainnet.base.org') {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const quoter = new ethers.Contract(QUOTER_V2_ADDRESS, QUOTER_V2_ABI, provider);

    let bestQuote = null;
    let bestAmountOut = BigInt(0);
    let bestFee = null;

    // Try each fee tier and find the best quote
    for (const fee of FEE_TIERS) {
      try {
        const params = {
          tokenIn,
          tokenOut,
          fee,
          amountIn: amount,
          sqrtPriceLimitX96: 0
        };

        const result = await quoter.quoteExactInputSingle.staticCall(params);
        const amountOut = result[0]; // First element is amountOut

        if (amountOut > bestAmountOut) {
          bestAmountOut = amountOut;
          bestFee = fee;
          bestQuote = {
            amountOut: amountOut.toString(),
            sqrtPriceX96After: result[1].toString(),
            initializedTicksCrossed: result[2].toString(),
            gasEstimate: result[3].toString()
          };
        }
      } catch (error) {
        // Pool might not exist for this fee tier, continue
        console.debug(`No pool found for fee tier ${fee}:`, error.message);
        continue;
      }
    }

    if (!bestQuote) {
      throw new Error('No Uniswap V3 pool found for this token pair');
    }

    // Calculate price impact (simplified)
    const amountInBig = BigInt(amount);
    const priceImpact = calculatePriceImpact(amountInBig, bestAmountOut);

    return {
      dex: 'uniswap-v3',
      amountOut: bestQuote.amountOut,
      route: {
        path: [tokenIn, tokenOut],
        dex: 'uniswap-v3',
        fee: bestFee
      },
      priceImpact: priceImpact.toString(),
      gasEstimate: bestQuote.gasEstimate,
      fee: bestFee
    };
  } catch (error) {
    console.error('Uniswap V3 quote error:', error);
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
  // This is a placeholder that assumes minimal impact for now
  return 0.1; // 0.1% default
}
