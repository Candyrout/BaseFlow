// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IDEXAdapter.sol";

/**
 * @title BaseSwapAdapter
 * @notice Adapter for BaseSwap DEX
 */
contract BaseSwapAdapter is IDEXAdapter {
    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut,
        bytes calldata data
    ) external payable override returns (uint256 amountOut) {
        // TODO: Implement BaseSwap swap logic
        revert("BaseSwapAdapter: not implemented");
    }

    function getQuote(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external view override returns (uint256 amountOut) {
        // TODO: Implement BaseSwap quote logic
        revert("BaseSwapAdapter: not implemented");
    }

    function name() external pure override returns (string memory) {
        return "BaseSwap";
    }
}

