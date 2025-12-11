# Frontend Environment Setup

## Quick Start

1. **Copy the example file:**
   ```bash
   cd frontend
   cp .env.local.example .env.local
   ```

2. **Get WalletConnect Project ID (REQUIRED):**
   - Go to [WalletConnect Cloud](https://cloud.walletconnect.com)
   - Sign up or log in
   - Click "Create New Project"
   - Name it "BaseFlow" (or any name)
   - Copy the Project ID
   - Paste it in `.env.local` for `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

3. **Edit `.env.local`** with your values

## Base Sepolia (Testnet) Configuration

```bash
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ROUTER_ADDRESS=0xD9a60b0Bc8d8C7F9Bd1aab40B0486756eAF997C3
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

## Base Mainnet (Production) Configuration

```bash
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_API_URL=https://api.baseflow.xyz
NEXT_PUBLIC_ROUTER_ADDRESS=0x3dDB67151b925734B068517Cd655A25324b95902
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

## Getting WalletConnect Project ID

**Step-by-step:**

1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Sign up or log in with your account
3. Click **"Create New Project"** button
4. Fill in:
   - **Project Name:** BaseFlow (or any name)
   - **Homepage URL:** https://github.com/Candyrout/BaseFlow (or your URL)
5. Click **"Create"**
6. Copy the **Project ID** (it's a long string)
7. Paste it in your `.env.local` file

**Important:** The Project ID is free and takes less than 2 minutes to create!

## Troubleshooting

### Error: "No projectId found"
- Make sure you created `.env.local` file (not `.env`)
- Make sure the file is in the `frontend` directory
- Restart the Next.js dev server after creating the file
- Check that `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set correctly

### File not loading
- Make sure the file is named exactly `.env.local` (with the dot at the start)
- Restart the dev server: `npm run dev`

