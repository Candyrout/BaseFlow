// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IDEXAdapter
 * @notice Interface for DEX adapters
 */
interface IDEXAdapter {
    /**
     * @notice Execute swap on the DEX
     * @param tokenIn Input token address
     * @param tokenOut Output token address
     * @param amountIn Input amount
     * @param minAmountOut Minimum output amount
     * @param data Additional call data
     * @return amountOut Output amount
     */
    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut,
        bytes calldata data
    ) external payable returns (uint256 amountOut);

    /**
     * @notice Get quote from the DEX
     * @param tokenIn Input token address
     * @param tokenOut Output token address
     * @param amountIn Input amount
     * @return amountOut Estimated output amount
     */
    function getQuote(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external view returns (uint256 amountOut);

    /**
     * @notice Get DEX name
     */
    function name() external pure returns (string memory);
}

