// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IDEXAdapter.sol";

/**
 * @title AerodromeAdapter
 * @notice Adapter for Aerodrome DEX
 * @dev This is a placeholder - actual implementation will interact with Aerodrome router
 */
contract AerodromeAdapter is IDEXAdapter {
    // TODO: Add Aerodrome router address
    // address public constant AERODROME_ROUTER = 0x...;

    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut,
        bytes calldata data
    ) external payable override returns (uint256 amountOut) {
        // TODO: Implement Aerodrome swap logic
        revert("AerodromeAdapter: not implemented");
    }

    function getQuote(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external view override returns (uint256 amountOut) {
        // TODO: Implement Aerodrome quote logic
        revert("AerodromeAdapter: not implemented");
    }

    function name() external pure override returns (string memory) {
        return "Aerodrome";
    }
}

