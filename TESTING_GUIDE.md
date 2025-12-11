# BaseFlow Testing Guide

## Testing on Base Sepolia

### 1. Test Quote Functionality

You can test quotes using the API or directly on Basescan.

#### Using the API (if backend is running):

```bash
# Test quote for WETH -> USDC
curl "http://localhost:3001/quote?tokenIn=0x4200000000000000000000000000000000000006&tokenOut=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&amount=1000000000000000000"
```

#### Using Basescan:

1. Go to [FlowRouter on Sepolia](https://sepolia.basescan.org/address/0xD9a60b0Bc8d8C7F9Bd1aab40B0486756eAF997C3#readContract)
2. Use the `quote` function
3. You'll need to prepare the SwapPath array

### 2. Test Contract Functions

#### Check Owner:
- Go to FlowRouter contract on Basescan
- Call `owner()` - should return: `0xD0c6c26f0044b776DD4803eC0ae1349d145A9F01`

#### Check Fee Settings:
- Call `feeBps()` - should return: `0` (no fee for MVP)
- Call `feeRecipient()` - should return: `0x0000000000000000000000000000000000000000`

### 3. Test Frontend (Local)

1. Set up environment variables (see `frontend/ENV_SETUP.md`)
2. Start backend: `cd backend && npm run dev`
3. Start frontend: `cd frontend && npm run dev`
4. Connect wallet to Base Sepolia
5. Test quote functionality

### 4. Test Swap Execution

⚠️ **Note:** Full swap testing requires:
- Test tokens with liquidity on Sepolia
- Proper token approvals
- Sufficient gas

For now, you can verify the contract structure is correct by checking:
- Contract verification on Basescan ✅
- All functions are accessible
- Events are properly defined

---

## Testing on Base Mainnet

⚠️ **Only test with small amounts on mainnet!**

### Quick Verification:

1. Verify contracts are deployed:
   - [FlowRouter Mainnet](https://basescan.org/address/0x3dDB67151b925734B068517Cd655A25324b95902)
   - Check "Contract" tab shows verified ✅

2. Test read functions:
   - `owner()` - should return deployer address
   - `feeBps()` - should return 0
   - `feeRecipient()` - should return zero address

3. Monitor for any issues:
   - Check contract interactions
   - Monitor events
   - Watch for any unexpected behavior

---

## Known Limitations

- BaseSwap adapter not yet implemented
- Maverick adapter not yet implemented
- Frontend swap execution not yet connected to contracts
- Multi-hop routing not yet implemented

These will be addressed in Phase 2.

