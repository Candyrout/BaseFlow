# BaseFlow SDK Documentation

## Installation

```bash
npm install @baseflow/sdk
```

## Quick Start

```typescript
import { getQuote, simulate, swap } from '@baseflow/sdk';

// Get a quote
const quote = await getQuote({
  tokenIn: '0x...',
  tokenOut: '0x...',
  amount: '1000000000000000000' // 1 ETH
});

// Simulate a route
const simulation = await simulate(quote.route, quote.amountIn);

// Prepare swap
const swapData = await swap({
  route: quote.route,
  amountIn: quote.amountIn,
  minAmountOut: quote.amountOut,
  recipient: '0x...'
});
```

## API Reference

### getQuote(params, apiUrl?)

Get a quote for swapping tokens.

**Parameters:**
- `params.tokenIn` (string) - Input token address
- `params.tokenOut` (string) - Output token address
- `params.amount` (string) - Input amount in wei
- `apiUrl` (string, optional) - API base URL (default: `https://api.baseflow.xyz`)

**Returns:** `Promise<Quote>`

**Example:**
```typescript
const quote = await getQuote({
  tokenIn: '0x4200000000000000000000000000000000000006', // WETH
  tokenOut: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC
  amount: '1000000000000000000' // 1 ETH
});
```

### getRoutes(tokenIn, tokenOut, apiUrl?)

Get all available routes for a token pair.

**Parameters:**
- `tokenIn` (string) - Input token address
- `tokenOut` (string) - Output token address
- `apiUrl` (string, optional) - API base URL

**Returns:** `Promise<Route[]>`

### simulate(route, amountIn, apiUrl?)

Simulate a route execution.

**Parameters:**
- `route` (Route) - Route object
- `amountIn` (string) - Input amount in wei
- `apiUrl` (string, optional) - API base URL

**Returns:** `Promise<SimulationResult>`

### swap(params, apiUrl?)

Prepare swap transaction data.

**Parameters:**
- `params.route` (Route) - Route object
- `params.amountIn` (string) - Input amount in wei
- `params.minAmountOut` (string) - Minimum output amount
- `params.recipient` (string) - Recipient address
- `apiUrl` (string, optional) - API base URL

**Returns:** `Promise<SwapData>`

### executeSwap(routerAddress, provider, signer, swapData)

Execute swap on-chain using FlowRouter contract.

**Parameters:**
- `routerAddress` (string) - FlowRouter contract address
- `provider` (ethers.Provider) - Ethers provider
- `signer` (ethers.Signer) - Ethers signer
- `swapData` (any) - Swap data from `swap()` function

**Returns:** `Promise<ethers.TransactionResponse>`

## Types

### Quote

```typescript
interface Quote {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOut: string;
  route: Route;
  dex: string;
  priceImpact: string;
  gasEstimate: string;
}
```

### Route

```typescript
interface Route {
  path: string[];
  dex: string;
  type?: string;
}
```

## Examples

See [examples/](../examples/) directory for more examples.

