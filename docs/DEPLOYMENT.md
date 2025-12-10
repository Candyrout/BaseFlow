# BaseFlow Deployment Guide

## Prerequisites

1. **Foundry installed** - [Install Foundry](https://book.getfoundry.sh/getting-started/installation)
2. **Node.js ≥18.x** - For API and frontend
3. **Base Sepolia ETH** - For testnet deployment
4. **Base Mainnet ETH** - For mainnet deployment
5. **Basescan API Key** - For contract verification

## Setup

### 1. Install Dependencies

```bash
npm run install:all
```

### 2. Configure Environment Variables

#### Contracts

```bash
cd contracts
cp .env.example .env
```

Edit `.env`:
```bash
PRIVATE_KEY=your_deployer_private_key
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASE_MAINNET_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=your_basescan_api_key
```

#### Backend

```bash
cd ../backend
cp .env.example .env
```

Edit `.env`:
```bash
PORT=3001
BASE_MAINNET_RPC=https://mainnet.base.org
BASE_SEPOLIA_RPC=https://sepolia.base.org
NETWORK=sepolia
```

#### Frontend

```bash
cd ../frontend
cp .env.example .env.local
```

Edit `.env.local`:
```bash
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ROUTER_ADDRESS=
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

## Deploy Smart Contracts

### Deploy to Base Sepolia

```bash
cd contracts

export PRIVATE_KEY=your_private_key
export BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
export BASESCAN_API_KEY=your_api_key

forge script script/Deploy.s.sol:DeployScript \
  --rpc-url base_sepolia \
  --broadcast \
  --verify
```

### Deploy to Base Mainnet

⚠️ **Warning**: Only deploy to mainnet after thorough testing!

```bash
cd contracts

export PRIVATE_KEY=your_private_key
export BASE_MAINNET_RPC_URL=https://mainnet.base.org
export BASESCAN_API_KEY=your_api_key

forge script script/Deploy.s.sol:DeployScript \
  --rpc-url base_mainnet \
  --broadcast \
  --verify
```

## Update Configuration

After deployment, update:
1. Backend `.env` with contract addresses
2. Frontend `.env.local` with contract addresses
3. README.md with deployment links

## Deploy Frontend

### Vercel (Recommended)

```bash
cd frontend
npm i -g vercel
vercel
```

Add environment variables in Vercel dashboard.

## Verification Checklist

- [ ] Contracts deployed and verified on Basescan
- [ ] API can query contracts
- [ ] Frontend connects to wallet
- [ ] All tests pass
- [ ] README updated with contract addresses

