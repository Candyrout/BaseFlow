# BaseFlow Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies

```bash
# Install all dependencies (root, contracts, backend, frontend, SDK)
npm run install:all
```

### 2. Configure Environment

#### Contracts
```bash
cd contracts
# Create .env file with:
PRIVATE_KEY=your_private_key
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASE_MAINNET_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=your_api_key
```

#### Backend
```bash
cd backend
# Create .env file with:
PORT=3001
BASE_MAINNET_RPC=https://mainnet.base.org
BASE_SEPOLIA_RPC=https://sepolia.base.org
NETWORK=sepolia
```

#### Frontend
```bash
cd frontend
# Create .env.local file with:
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ROUTER_ADDRESS=
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### 3. Development

#### Smart Contracts
```bash
cd contracts
forge build
forge test
```

#### Backend API
```bash
cd backend
npm run dev
# API runs on http://localhost:3001
```

#### Frontend
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:3000
```

#### SDK
```bash
cd sdk/js
npm run build
```

## 📚 Next Steps

1. **Read the Documentation:**
   - [README.md](./README.md) - Project overview
   - [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - System architecture
   - [docs/api.md](./docs/api.md) - API documentation
   - [docs/sdk.md](./docs/sdk.md) - SDK documentation

2. **Start Implementing:**
   - See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for current status
   - Check the roadmap in README.md
   - Create GitHub issues for tasks

3. **Deploy:**
   - See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for deployment instructions

## 🎯 Project Structure

```
baseflow/
├── contracts/      # Smart contracts (Foundry)
├── backend/        # API server (Node.js)
├── sdk/            # SDK (JS/TS, Python)
├── frontend/       # Next.js UI
├── docs/           # Documentation
└── examples/       # Integration examples
```

## 🔗 Useful Links

- **Base Documentation:** https://docs.base.org
- **Base Explorer:** https://basescan.org
- **Base Discord:** https://discord.gg/base

---

**Ready to build?** Start with the MVP tasks in [PROJECT_STATUS.md](./PROJECT_STATUS.md)!

