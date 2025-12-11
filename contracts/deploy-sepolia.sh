#!/bin/bash

# BaseFlow Deployment Script for Base Sepolia
# Make sure to set PRIVATE_KEY and BASESCAN_API_KEY environment variables

set -e

echo "🚀 Deploying BaseFlow to Base Sepolia..."
echo ""

# Check if required environment variables are set
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: PRIVATE_KEY environment variable is not set"
    echo "   Set it with: export PRIVATE_KEY=your_private_key"
    exit 1
fi

if [ -z "$BASESCAN_API_KEY" ]; then
    echo "⚠️  Warning: BASESCAN_API_KEY not set. Contracts will not be verified."
    echo "   Set it with: export BASESCAN_API_KEY=your_api_key"
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
  --rpc-url base_sepolia \
  --broadcast \
  $VERIFY_FLAG \
  -vvvv

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Copy the contract addresses from above"
echo "2. Update DEPLOYED_ADDRESSES.md"
echo "3. Update frontend .env.local with FlowRouter address"
echo "4. Test the contracts on Basescan"
