/**
 * API client for BaseFlow backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Quote {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOut: string;
  route: {
    path: string[];
    dex: string;
    fee?: number;
    stable?: boolean;
  };
  dex: string;
  priceImpact: string;
  gasEstimate: string;
  allQuotes?: Quote[];
}

export interface Route {
  path: string[];
  dex: string;
  type?: string;
}

/**
 * Get quote for a swap
 */
export async function getQuote(
  tokenIn: string,
  tokenOut: string,
  amount: string
): Promise<Quote> {
  const response = await fetch(
    `${API_URL}/quote?tokenIn=${tokenIn}&tokenOut=${tokenOut}&amount=${amount}`
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to get quote' }));
    throw new Error(error.error || 'Failed to get quote');
  }

  return response.json();
}

/**
 * Get available routes for a token pair
 */
export async function getRoutes(
  tokenIn: string,
  tokenOut: string
): Promise<Route[]> {
  const response = await fetch(
    `${API_URL}/routes?tokenIn=${tokenIn}&tokenOut=${tokenOut}`
  );

  if (!response.ok) {
    throw new Error('Failed to get routes');
  }

  const data = await response.json();
  return data.routes;
}

/**
 * Simulate a route
 */
export async function simulateRoute(route: Route, amountIn: string) {
  const response = await fetch(`${API_URL}/simulate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ route, amountIn }),
  });

  if (!response.ok) {
    throw new Error('Failed to simulate route');
  }

  return response.json();
}

/**
 * Prepare swap transaction
 */
export async function prepareSwap(params: {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  minAmountOut: string;
  recipient: string;
}) {
  const response = await fetch(`${API_URL}/swap`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to prepare swap');
  }

  return response.json();
}

