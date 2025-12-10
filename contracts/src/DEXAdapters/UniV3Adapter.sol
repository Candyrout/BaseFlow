// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IDEXAdapter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title UniV3Adapter
 * @notice Adapter for Uniswap V3 on Base
 * @dev Interacts with Uniswap V3 SwapRouter02 and QuoterV2
 */
contract UniV3Adapter is IDEXAdapter {
    using SafeERC20 for IERC20;

    // Uniswap V3 addresses on Base
    address public constant SWAP_ROUTER_02 = 0x2626664c2603336E57B271c5C0b26F421741e481;
    address public constant QUOTER_V2 = 0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a;

    // Common fee tiers for Uniswap V3
    uint24 public constant FEE_LOW = 500;    // 0.05%
    uint24 public constant FEE_MEDIUM = 3000; // 0.3%
    uint24 public constant FEE_HIGH = 10000;  // 1%

    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    struct QuoteExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        uint256 amountIn;
        uint160 sqrtPriceLimitX96;
    }

    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut,
        bytes calldata data
    ) external payable override returns (uint256 amountOut) {
        // Decode fee from data if provided, otherwise use medium fee
        uint24 fee = data.length >= 32 ? abi.decode(data, (uint24)) : FEE_MEDIUM;

        // Approve router to spend tokens
        IERC20 tokenInContract = IERC20(tokenIn);
        // Use SafeERC20 forceApprove
        SafeERC20.forceApprove(tokenInContract, SWAP_ROUTER_02, amountIn);

        // Prepare swap parameters
        ExactInputSingleParams memory params = ExactInputSingleParams({
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            fee: fee,
            recipient: msg.sender,
            deadline: block.timestamp + 300, // 5 minutes
            amountIn: amountIn,
            amountOutMinimum: minAmountOut,
            sqrtPriceLimitX96: 0 // No price limit
        });

        // Encode function call
        bytes memory swapData = abi.encodeWithSignature(
            "exactInputSingle((address,address,uint24,address,uint256,uint256,uint256,uint160))",
            params
        );

        // Execute swap via delegatecall or direct call
        (bool success, bytes memory returnData) = SWAP_ROUTER_02.call(swapData);
        require(success, "UniV3Adapter: swap failed");

        // Decode amount out from return data
        amountOut = abi.decode(returnData, (uint256));

        return amountOut;
    }

    function getQuote(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external view override returns (uint256 amountOut) {
        // Try different fee tiers and return the best quote
        uint24[] memory fees = new uint24[](3);
        fees[0] = FEE_LOW;
        fees[1] = FEE_MEDIUM;
        fees[2] = FEE_HIGH;

        uint256 bestAmountOut = 0;

        for (uint256 i = 0; i < fees.length; i++) {
            try this._getQuoteForFee(tokenIn, tokenOut, amountIn, fees[i]) returns (uint256 quote) {
                if (quote > bestAmountOut) {
                    bestAmountOut = quote;
                }
            } catch {
                // Pool might not exist for this fee tier, continue
                continue;
            }
        }

        require(bestAmountOut > 0, "UniV3Adapter: no pool found");
        return bestAmountOut;
    }

    function _getQuoteForFee(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint24 fee
    ) external view returns (uint256 amountOut) {
        QuoteExactInputSingleParams memory params = QuoteExactInputSingleParams({
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            fee: fee,
            amountIn: amountIn,
            sqrtPriceLimitX96: 0
        });

        // Call QuoterV2
        (bool success, bytes memory returnData) = QUOTER_V2.staticcall(
            abi.encodeWithSignature(
                "quoteExactInputSingle((address,address,uint24,uint256,uint160))",
                params
            )
        );

        require(success, "UniV3Adapter: quote failed");
        
        // QuoterV2 returns (uint256 amountOut, uint160 sqrtPriceX96After, uint32 initializedTicksCrossed, uint256 gasEstimate)
        (uint256 out, , , ) = abi.decode(returnData, (uint256, uint160, uint32, uint256));
        amountOut = out;
        
        return amountOut;
    }

    function name() external pure override returns (string memory) {
        return "Uniswap V3";
    }
}
