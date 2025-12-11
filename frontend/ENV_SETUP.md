# Frontend Environment Setup

## Base Sepolia (Testnet)

Create `.env.local` in the `frontend` directory:

```bash
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ROUTER_ADDRESS=0xD9a60b0Bc8d8C7F9Bd1aab40B0486756eAF997C3
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

## Base Mainnet (Production)

For production deployment:

```bash
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_API_URL=https://api.baseflow.xyz
NEXT_PUBLIC_ROUTER_ADDRESS=0x3dDB67151b925734B068517Cd655A25324b95902
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

## Getting WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Create a new project
3. Copy the Project ID
4. Add it to your `.env.local`

