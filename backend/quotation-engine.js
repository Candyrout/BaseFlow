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

  // Fetch quotes from all DEXs in parallel
  const quotePromises = [
    getUniswapV3Quote(tokenIn, tokenOut, amount).catch(err => {
      console.error('Uniswap V3 quote error:', err);
      return null;
    }),
    getAerodromeQuote(tokenIn, tokenOut, amount).catch(err => {
      console.error('Aerodrome quote error:', err);
      return null;
    }),
    getBaseSwapQuote(tokenIn, tokenOut, amount).catch(err => {
      console.error('BaseSwap quote error:', err);
      return null;
    })
  ];

  const results = await Promise.all(quotePromises);

  // Filter out null results and find best quote
  for (const quote of results) {
    if (quote) {
      quotes.push(quote);
    }
  }

  if (quotes.length === 0) {
    throw new Error('No quotes available');
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

