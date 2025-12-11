/**
 * Quotation Engine
 * Calculates quotes from different DEXs
 */

import { getUniswapV3Quote } from './dex-fetchers/uniswap-v3.js';
import { getAerodromeQuote } from './dex-fetchers/aerodrome.js';
import { getBaseSwapQuote } from './dex-fetchers/baseswap.js';

/**
 * Get quote from all available DEXs
 * @param {string} tokenIn - Input token address
 * @param {string} tokenOut - Output token address
 * @param {string} amount - Input amount (wei)
 * @returns {Promise<Object>} Quote object with best price
 */
export async function getQuote(tokenIn, tokenOut, amount) {
  const quotes = [];

  // Get RPC URL from environment
  const rpcUrl = process.env.BASE_MAINNET_RPC || process.env.BASE_SEPOLIA_RPC || 'https://mainnet.base.org';

  // Fetch quotes from all DEXs in parallel
  // Errors are handled silently - missing pools are expected for some token pairs
  const quotePromises = [
    getUniswapV3Quote(tokenIn, tokenOut, amount, rpcUrl).catch(() => null),
    getAerodromeQuote(tokenIn, tokenOut, amount, rpcUrl).catch(() => null),
    getBaseSwapQuote(tokenIn, tokenOut, amount, rpcUrl).catch(() => null)
  ];

  const results = await Promise.all(quotePromises);

  // Filter out null results and find best quote
  for (const quote of results) {
    if (quote) {
      quotes.push(quote);
    }
  }

  if (quotes.length === 0) {
    throw new Error(
      `No liquidity pools found for ${tokenIn} → ${tokenOut}. ` +
      `This token pair may not have liquidity on any supported DEX. ` +
      `Try a different token pair or check if the addresses are correct.`
    );
  }

  // Find best quote (highest output amount)
  const bestQuote = quotes.reduce((best, current) => {
    return BigInt(current.amountOut) > BigInt(best.amountOut) ? current : best;
  });

  return {
    tokenIn,
    tokenOut,
    amountIn: amount,
    amountOut: bestQuote.amountOut,
    route: bestQuote.route,
    dex: bestQuote.dex,
    priceImpact: bestQuote.priceImpact,
    gasEstimate: bestQuote.gasEstimate,
    allQuotes: quotes
  };
}

