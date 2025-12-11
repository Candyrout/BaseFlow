# BaseFlow Deployment Instructions

## Prerequisites

1. **Base Sepolia ETH** - Get from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
2. **Basescan API Key** - Get from [Basescan API](https://basescan.org/apis)
3. **Private Key** - Your deployer wallet private key

## Step 1: Set Environment Variables

```bash
cd contracts

# Set these environment variables
export PRIVATE_KEY=your_deployer_private_key_here
export BASESCAN_API_KEY=your_basescan_api_key_here
```

## Step 2: Deploy to Base Sepolia

```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url base_sepolia \
  --broadcast \
  --verify \
  -vvvv
```

This will:
- Deploy MEVGuard
- Deploy UniV3Adapter
- Deploy AerodromeAdapter
- Deploy FlowRouter
- Verify all contracts on Basescan

## Step 3: Save Contract Addresses

After deployment, copy the addresses from the output and update:
1. `DEPLOYED_ADDRESSES.md` with Sepolia addresses
2. Frontend `.env.local` with `NEXT_PUBLIC_ROUTER_ADDRESS`
3. Backend `.env` with contract addresses (if needed)

## Step 4: Test on Sepolia

1. Test quote functionality
2. Test swap execution (if possible with test tokens)
3. Verify contracts on Basescan

## Step 5: Deploy to Base Mainnet

⚠️ **Only deploy to mainnet after thorough testing on Sepolia!**

```bash
# Make sure you have Base Mainnet ETH
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url base_mainnet \
  --broadcast \
  --verify \
  -vvvv
```

## Step 6: Update Documentation

After mainnet deployment:
1. Update `DEPLOYED_ADDRESSES.md` with mainnet addresses
2. Update `README.md` with contract links
3. Update frontend environment variables
4. Commit all changes

## Troubleshooting

### "Insufficient funds"
- Make sure you have enough ETH for gas fees
- Base Sepolia: ~0.01 ETH should be enough
- Base Mainnet: ~0.05 ETH should be enough

### "Verification failed"
- Check your Basescan API key
- Wait a few minutes and try again
- Manually verify on Basescan if needed

### "RPC error"
- Check your RPC URL
- Try using a different RPC endpoint (Alchemy, Infura, etc.)

