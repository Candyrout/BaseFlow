/**
 * Contract ABIs and addresses
 */

// FlowRouter ABI (simplified - only functions we need)
export const FLOW_ROUTER_ABI = [
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'dex', type: 'address' },
          { internalType: 'address', name: 'tokenIn', type: 'address' },
          { internalType: 'address', name: 'tokenOut', type: 'address' },
          { internalType: 'bytes', name: 'data', type: 'bytes' }
        ],
        internalType: 'struct FlowRouter.SwapPath[]',
        name: 'paths',
        type: 'tuple[]'
      },
      { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
      { internalType: 'uint256', name: 'minOut', type: 'uint256' }
    ],
    name: 'swap',
    outputs: [{ internalType: 'uint256', name: 'amountOut', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'dex', type: 'address' },
          { internalType: 'address', name: 'tokenIn', type: 'address' },
          { internalType: 'address', name: 'tokenOut', type: 'address' },
          { internalType: 'bytes', name: 'data', type: 'bytes' }
        ],
        internalType: 'struct FlowRouter.SwapPath[]',
        name: 'paths',
        type: 'tuple[]'
      },
      { internalType: 'uint256', name: 'amountIn', type: 'uint256' }
    ],
    name: 'quote',
    outputs: [{ internalType: 'uint256', name: 'amountOut', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

// ERC20 ABI (for approvals)
export const ERC20_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

// WETH ABI (for wrapping/unwrapping)
export const WETH_ABI = [
  {
    inputs: [],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'wad', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

// WETH address on Base
export const WETH_ADDRESS = '0x4200000000000000000000000000000000000006' as const;

// Contract addresses (from environment or defaults)
export const getFlowRouterAddress = (): `0x${string}` => {
  const address = process.env.NEXT_PUBLIC_ROUTER_ADDRESS;
  if (!address) {
    throw new Error('FlowRouter address not configured. Set NEXT_PUBLIC_ROUTER_ADDRESS in .env.local');
  }
  return address as `0x${string}`;
};

// DEX adapter addresses (these would need to be deployed or we use the ones from quote)
// For now, we'll get them from the quote response

