# BaseFlow SDK (JavaScript/TypeScript)

SDK for integrating BaseFlow into your dApp.

## Installation

```bash
npm install @baseflow/sdk
```

## Usage

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

See [SDK Documentation](../../docs/sdk.md) for full API reference.

