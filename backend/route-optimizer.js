/**
 * Route Optimizer
 * Finds optimal routes across multiple DEXs
 */

import { getQuote } from './quotation-engine.js';

/**
 * Get all available routes for a token pair
 * @param {string} tokenIn - Input token address
 * @param {string} tokenOut - Output token address
 * @returns {Promise<Array>} Array of available routes
 */
export async function getRoutes(tokenIn, tokenOut) {
  // TODO: Implement multi-hop routing
  // For now, return direct routes only
  return [
    {
      path: [tokenIn, tokenOut],
      dex: 'uniswap-v3',
      type: 'direct'
    },
    {
      path: [tokenIn, tokenOut],
      dex: 'aerodrome',
      type: 'direct'
    },
    {
      path: [tokenIn, tokenOut],
      dex: 'baseswap',
      type: 'direct'
    }
  ];
}

/**
 * Optimize route for best execution
 * @param {Array} routes - Available routes
 * @param {string} amountIn - Input amount
 * @returns {Promise<Object>} Optimized route
 */
export async function optimizeRoute(routes, amountIn) {
  // Get quotes for all routes
  const routeQuotes = [];

  for (const route of routes) {
    try {
      const tokenIn = route.path[0];
      const tokenOut = route.path[route.path.length - 1];
      const quote = await getQuote(tokenIn, tokenOut, amountIn);

      routeQuotes.push({
        route,
        quote,
        score: calculateRouteScore(quote)
      });
    } catch (error) {
      console.error(`Error getting quote for route:`, error);
    }
  }

  if (routeQuotes.length === 0) {
    throw new Error('No valid routes found');
  }

  // Sort by score (higher is better)
  routeQuotes.sort((a, b) => b.score - a.score);

  return routeQuotes[0].route;
}

/**
 * Calculate route score based on multiple factors
 * @param {Object} quote - Quote object
 * @returns {number} Route score
 */
function calculateRouteScore(quote) {
  // Factors:
  // - Output amount (higher is better)
  // - Price impact (lower is better)
  // - Gas estimate (lower is better)

  const outputAmount = BigInt(quote.amountOut);
  const priceImpact = parseFloat(quote.priceImpact || '0');
  const gasEstimate = parseInt(quote.gasEstimate || '0');

  // Normalize and weight factors
  // This is a simplified scoring - can be improved
  const outputScore = Number(outputAmount) / 1e18; // Normalize to ETH
  const impactScore = 100 - priceImpact; // Invert (lower impact = higher score)
  const gasScore = Math.max(0, 100000 - gasEstimate) / 1000; // Lower gas = higher score

  return outputScore * 0.7 + impactScore * 0.2 + gasScore * 0.1;
}

