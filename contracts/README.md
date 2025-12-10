# BaseFlow Smart Contracts

Smart contracts for BaseFlow liquidity aggregator.

## Structure

```
contracts/
├── FlowRouter.sol          # Main router contract
├── MEVGuard.sol            # MEV protection contract
├── DEXAdapters/            # DEX-specific adapters
│   ├── UniV3Adapter.sol
│   ├── AerodromeAdapter.sol
│   ├── BaseSwapAdapter.sol
│   └── MaverickAdapter.sol
├── interfaces/             # Contract interfaces
├── tests/                  # Foundry tests
└── script/                 # Deployment scripts
```

## Setup

```bash
# Install Foundry dependencies
forge install

# Compile contracts
forge build

# Run tests
forge test

# Run tests with verbose output
forge test -vvv
```

## Deployment

See [DEPLOYMENT.md](../docs/DEPLOYMENT.md) for deployment instructions.

