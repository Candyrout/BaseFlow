# BaseFlow Architecture

## System Overview

```
┌─────────────┐
│   Frontend  │ (Next.js)
│   (UI)      │
└──────┬──────┘
       │
       │ HTTP/REST
       │
┌──────▼──────┐
│   Backend   │ (Node.js)
│   (API)     │
└──────┬──────┘
       │
       ├──────────────┬──────────────┐
       │              │              │
┌──────▼──────┐ ┌─────▼─────┐ ┌─────▼─────┐
│ Uniswap V3  │ │ Aerodrome │ │ BaseSwap  │
│   Adapter   │ │  Adapter  │ │  Adapter  │
└──────┬──────┘ └─────┬─────┘ └─────┬─────┘
       │              │              │
       └──────────────┴──────────────┘
                      │
              ┌───────▼───────┐
              │  FlowRouter   │
              │   Contract    │
              └───────────────┘
```

## Components

### 1. Smart Contracts

- **FlowRouter.sol:** Main router for executing swaps
- **MEVGuard.sol:** MEV protection
- **DEX Adapters:** Modular adapters for each DEX

### 2. Backend

- **API Server:** Express.js REST API
- **Quotation Engine:** Fetches quotes from DEXs
- **Route Optimizer:** Finds optimal routes
- **Path Simulator:** Simulates route execution

### 3. Frontend

- **Next.js App:** Swap interface
- **Route Visualizer:** Visual route display
- **Path Simulator UI:** Client-side simulation

### 4. SDK

- **JavaScript/TypeScript:** Main SDK
- **Python:** Planned

## Data Flow

1. User requests quote via Frontend
2. Frontend calls Backend API
3. Backend fetches quotes from all DEXs
4. Backend optimizes route
5. Backend returns best quote
6. User approves swap
7. Frontend calls FlowRouter contract
8. Contract executes swap via DEX adapters

## Security

- MEV protection via MEVGuard
- Slippage limits
- Deadline validation
- Open-source code for transparency

