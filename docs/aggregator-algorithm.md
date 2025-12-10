# BaseFlow Aggregator Algorithm

## Overview

BaseFlow uses a multi-factor optimization algorithm to find the best swap routes across multiple DEXs on Base.

## Algorithm Steps

### 1. Quote Collection

Fetch quotes from all available DEXs in parallel:
- Uniswap V3
- Aerodrome
- BaseSwap
- Maverick
- Others...

### 2. Route Scoring

Each route is scored based on:

**Factors:**
- **Output Amount** (70% weight) - Higher is better
- **Price Impact** (20% weight) - Lower is better
- **Gas Estimate** (10% weight) - Lower is better

**Formula:**
```
score = (outputAmount * 0.7) + (impactScore * 0.2) + (gasScore * 0.1)
```

### 3. Route Selection

Select the route with the highest score.

### 4. Split Routing (Future)

For large swaps, split across multiple routes:
- Calculate optimal split percentages
- Execute swaps in parallel
- Aggregate results

## MEV Protection

- Slippage limits enforced by MEVGuard contract
- Deadline validation
- Private relayer support (optional)

## Gas Optimization

Base has very low gas costs, so:
- Small trades are viable
- Multiple hops can be cost-effective
- Split routing is gas-efficient

## Future Improvements

- Multi-hop routing
- Dynamic split routing
- MEV risk scoring
- Real-time liquidity monitoring

