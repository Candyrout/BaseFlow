/**
 * BaseFlow SDK
 * JavaScript/TypeScript SDK for BaseFlow liquidity aggregator
 */

import { ethers } from 'ethers';

export interface QuoteParams {
  tokenIn: string;
  tokenOut: string;
  amount: string;
}

export interface Quote {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOut: string;
  route: Route;
  dex: string;
  priceImpact: string;
  gasEstimate: string;
}

export interface Route {
  path: string[];
  dex: string;
  type?: string;
}

export interface SwapParams {
  route: Route;
  amountIn: string;
  minAmountOut: string;
  recipient: string;
}

const DEFAULT_API_URL = 'https://api.baseflow.xyz';

/**
 * Get quote for a swap
 */
export async function getQuote(
  params: QuoteParams,
  apiUrl: string = DEFAULT_API_URL
): Promise<Quote> {
  const { tokenIn, tokenOut, amount } = params;

  const response = await fetch(
    `${apiUrl}/quote?tokenIn=${tokenIn}&tokenOut=${tokenOut}&amount=${amount}`
  );

  if (!response.ok) {
    throw new Error(`Failed to get quote: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get available routes for a token pair
 */
export async function getRoutes(
  tokenIn: string,
  tokenOut: string,
  apiUrl: string = DEFAULT_API_URL
): Promise<Route[]> {
  const response = await fetch(
    `${apiUrl}/routes?tokenIn=${tokenIn}&tokenOut=${tokenOut}`
  );

  if (!response.ok) {
    throw new Error(`Failed to get routes: ${response.statusText}`);
  }

  const data = await response.json();
  return data.routes;
}

/**
 * Simulate a route execution
 */
export async function simulate(
  route: Route,
  amountIn: string,
  apiUrl: string = DEFAULT_API_URL
): Promise<any> {
  const response = await fetch(`${apiUrl}/simulate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ route, amountIn })
  });

  if (!response.ok) {
    throw new Error(`Failed to simulate route: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Prepare swap transaction
 */
export async function swap(
  params: SwapParams,
  apiUrl: string = DEFAULT_API_URL
): Promise<any> {
  const response = await fetch(`${apiUrl}/swap`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    throw new Error(`Failed to prepare swap: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Execute swap on-chain using FlowRouter contract
 */
export async function executeSwap(
  routerAddress: string,
  provider: ethers.Provider,
  signer: ethers.Signer,
  swapData: any
): Promise<ethers.TransactionResponse> {
  // TODO: Implement actual contract interaction
  // This will call FlowRouter.swap() with the prepared data
  throw new Error('executeSwap not yet implemented');
}

