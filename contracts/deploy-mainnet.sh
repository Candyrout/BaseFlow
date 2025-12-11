#!/bin/bash

# BaseFlow Deployment Script for Base Mainnet
# ⚠️  WARNING: This deploys to MAINNET. Make sure you've tested on Sepolia first!

set -e

echo "⚠️  WARNING: You are about to deploy to Base MAINNET!"
echo "   Make sure you have:"
echo "   1. Tested thoroughly on Base Sepolia"
echo "   2. Reviewed all contract code"
echo "   3. Have enough ETH for gas fees"
echo ""
read -p "Are you sure you want to continue? (type 'yes' to confirm): " -r
if [[ ! $REPLY == "yes" ]]; then
    echo "Deployment cancelled."
    exit 1
fi

echo ""
echo "🚀 Deploying BaseFlow to Base Mainnet..."
echo ""

# Check if required environment variables are set
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: PRIVATE_KEY environment variable is not set"
    exit 1
fi

if [ -z "$BASESCAN_API_KEY" ]; then
    echo "⚠️  Warning: BASESCAN_API_KEY not set. Contracts will not be verified."
    read -p "Continue without verification? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
    VERIFY_FLAG=""
else
    VERIFY_FLAG="--verify"
fi

echo "📝 Deploying contracts..."
echo ""

forge script script/Deploy.s.sol:DeployScript \
  --rpc-url base_mainnet \
  --broadcast \
  $VERIFY_FLAG \
  -vvvv

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Copy the contract addresses from above"
echo "2. Update DEPLOYED_ADDRESSES.md with mainnet addresses"
echo "3. Update README.md with contract links"
echo "4. Update frontend .env.local with FlowRouter address"
echo "5. Share on Twitter with #BuildOnBase!"
