# BaseFlow Examples

Examples of integrating BaseFlow into your dApp.

## Examples

### 1. Basic Swap

Simple swap example using the SDK.

```typescript
import { getQuote, swap } from '@baseflow/sdk';

const quote = await getQuote({
  tokenIn: '0x...',
  tokenOut: '0x...',
  amount: '1000000000000000000'
});

const swapData = await swap({
  route: quote.route,
  amountIn: quote.amountIn,
  minAmountOut: quote.amountOut,
  recipient: '0x...'
});
```

### 2. Route Comparison

Compare quotes from multiple routes.

```typescript
import { getRoutes, getQuote } from '@baseflow/sdk';

const routes = await getRoutes(tokenIn, tokenOut);

const quotes = await Promise.all(
  routes.map(route => 
    getQuote({
      tokenIn: route.path[0],
      tokenOut: route.path[route.path.length - 1],
      amount: '1000000000000000000'
    })
  )
);

// Find best quote
const bestQuote = quotes.reduce((best, current) => 
  BigInt(current.amountOut) > BigInt(best.amountOut) ? current : best
);
```

### 3. Route Simulation

Simulate a route before executing.

```typescript
import { getQuote, simulate } from '@baseflow/sdk';

const quote = await getQuote({...});
const simulation = await simulate(quote.route, quote.amountIn);

console.log('Estimated output:', simulation.estimatedAmountOut);
console.log('Price impact:', simulation.priceImpact);
console.log('Gas estimate:', simulation.gasEstimate);
```

## More Examples

More examples coming soon!

