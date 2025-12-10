# BaseFlow

![Built for Base](https://img.shields.io/badge/Built%20for-Base-0052FF?style=for-the-badge&logo=base&logoColor=white)
![Deployed on Base](https://img.shields.io/badge/Deployed%20on-Base%20Mainnet-0052FF?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)

**Optimized liquidity routing for the Base ecosystem.**

BaseFlow is a lightweight, modular, smart liquidity aggregator specifically optimized for Base, capable of routing between Uniswap v2/v3, Aerodrome, BaseSwap, and other DEXs with MEV protection and intelligent path optimization.

## 🎯 Project Overview

BaseFlow is not a generic 1inch copycat, but a specialized aggregator that:

- ✅ Routes between Uniswap v2/v3, Aerodrome, BaseSwap, Maverick, and others
- ✅ Accounts for Base gas (very low → small trades are viable)
- ✅ Protects against MEV (simple sandwich protection)
- ✅ Allows users to create **custom swap rules**
- ✅ Provides an SDK for other dApps
- ✅ Features an open-source smart order router
- ✅ Includes its own "Path Simulator" — a client-side route simulation model

## 🔗 Links

- **Base Mainnet Contract:** [Coming Soon](#)
- **Base Sepolia Contract:** [Coming Soon](#)
- **Frontend:** [Coming Soon](#)
- **API:** [Coming Soon](#)
- **Documentation:** [docs/](./docs/)
- **Explorer:** [Basescan](https://basescan.org)

## 🌐 Network Information

- **Base Mainnet:**
  - Chain ID: `8453`
  - RPC URL: `https://mainnet.base.org`
  - Explorer: `https://basescan.org`

- **Base Sepolia (Testnet):**
  - Chain ID: `84532`
  - RPC URL: `https://sepolia.base.org`
  - Explorer: `https://sepolia.basescan.org`

## 🏗️ Architecture

```
baseflow/
├── contracts/          # Smart contracts (Solidity + Foundry)
│   ├── FlowRouter.sol  # Main router contract
│   ├── MEVGuard.sol    # MEV protection contract
│   ├── DEXAdapters/    # DEX-specific adapters
│   └── interfaces/
├── backend/            # Quotation & routing engine
│   ├── dex-fetchers/   # DEX quote fetchers
│   ├── quotation-engine.js
│   ├── route-optimizer.js
│   └── api.js
├── sdk/                # SDK for integration
│   ├── js/             # JavaScript/TypeScript SDK
│   └── python/         # Python SDK
├── frontend/           # Next.js swap UI
│   └── src/
├── docs/               # Documentation
│   ├── api.md
│   ├── sdk.md
│   ├── aggregator-algorithm.md
│   └── whitepaper.md
└── examples/           # Integration examples
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥18.x
- **Foundry** (for smart contracts)
- **Base Sepolia ETH** (for testnet deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/baseflow.git
cd baseflow

# Install all dependencies
npm run install:all
```

### Development

#### Smart Contracts

```bash
cd contracts
forge build
forge test
```

#### Backend API

```bash
cd backend
npm install
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

#### SDK

```bash
cd sdk/js
npm install
npm run build
```

## 📖 Usage

### Using the SDK

```javascript
import { getQuote, simulate, swap } from "@baseflow/sdk";

// Get a quote
const quote = await getQuote({
  tokenIn: "0x...",
  tokenOut: "0x...",
  amount: "1000000000000000000" // 1 ETH
});

// Simulate a route
const simulation = await simulate(quote.route);

// Execute swap
const tx = await swap({
  route: quote.route,
  amountIn: quote.amountIn,
  minAmountOut: quote.amountOut,
  recipient: "0x..."
});
```

### Using the API

```bash
# Get a quote
curl "https://api.baseflow.xyz/quote?tokenIn=0x...&tokenOut=0x...&amount=1000000000000000000"

# Get available routes
curl "https://api.baseflow.xyz/routes?tokenIn=0x...&tokenOut=0x..."

# Simulate a route
curl -X POST "https://api.baseflow.xyz/simulate" \
  -H "Content-Type: application/json" \
  -d '{"route": {...}, "amountIn": "1000000000000000000"}'
```

## 🔧 Features

### Supported DEXs

- ✅ Uniswap v2/v3
- ✅ Aerodrome
- ✅ BaseSwap
- ✅ Maverick
- ✅ ShushSwap
- ✅ AlienBase
- 🔄 More coming soon...

### Key Features

- **Intelligent Routing:** Optimizes paths based on liquidity, slippage, price impact, and gas efficiency
- **MEV Protection:** Built-in sandwich attack protection
- **Split Routing:** Distributes swaps across multiple paths for better execution
- **Custom Rules:** Users can define custom swap rules
- **Path Simulator:** Client-side route simulation for transparency
- **SDK Support:** Easy integration for other dApps

## 📚 Documentation

- [API Documentation](./docs/api.md)
- [SDK Documentation](./docs/sdk.md)
- [Aggregator Algorithm](./docs/aggregator-algorithm.md)
- [Whitepaper](./docs/whitepaper.md)

## 🗺️ Roadmap

### Phase 1: MVP (2 weeks)
- [x] Project structure setup
- [ ] FlowRouter.sol implementation
- [ ] UniV3Adapter.sol
- [ ] AerodromeAdapter.sol
- [ ] Basic routing engine
- [ ] API: /quote, /swap
- [ ] Basic Swap UI
- [ ] Deploy to Base Sepolia
- [ ] README + architecture diagram
- [ ] 10–15 GitHub Issues
- [ ] GitHub Actions

### Phase 2: Full Aggregator
- [ ] All DEX adapters
- [ ] Advanced routing algorithms
- [ ] Visualization UI
- [ ] Best path simulator
- [ ] MEVGuard v1
- [ ] JS SDK
- [ ] Complete documentation
- [ ] Deploy to Base Mainnet

### Phase 3: Final Polish
- [ ] PR into Base ecosystem
- [ ] Integration with small DEXs
- [ ] Twitter presence
- [ ] Whitepaper
- [ ] YouTube demo
- [ ] Add "safe mode" for swaps

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Built for [Base](https://base.org) ecosystem
- Inspired by the need for better liquidity routing on Base
- Thanks to all DEX protocols that make this possible

## 📞 Contact & Community

- **Twitter:** [@BaseFlow](https://twitter.com/baseflow) (Coming Soon)
- **Discord:** [Base Builders](https://discord.gg/base)
- **GitHub Issues:** [Report a bug or request a feature](https://github.com/yourusername/baseflow/issues)

---

**Built with ❤️ for Base**

