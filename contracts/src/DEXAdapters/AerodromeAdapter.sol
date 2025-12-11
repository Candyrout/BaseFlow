// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IDEXAdapter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title AerodromeAdapter
 * @notice Adapter for Aerodrome DEX on Base
 * @dev Interacts with Aerodrome Router (V2-style with routes)
 */
contract AerodromeAdapter is IDEXAdapter {
    using SafeERC20 for IERC20;

    // Aerodrome Router address on Base
    address public constant AERODROME_ROUTER = 0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43;

    struct Route {
        address from;
        address to;
        bool stable;
    }

    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut,
        bytes calldata data
    ) external payable override returns (uint256 amountOut) {
        // Decode route from data if provided
        Route[] memory routes;
        if (data.length > 0) {
            routes = abi.decode(data, (Route[]));
        } else {
            // Default direct route
            routes = new Route[](1);
            routes[0] = Route({
                from: tokenIn,
                to: tokenOut,
                stable: false // Default to volatile pool
            });
        }

        // Approve router to spend tokens
        IERC20 tokenInContract = IERC20(tokenIn);
        SafeERC20.forceApprove(tokenInContract, AERODROME_ROUTER, amountIn);

        // Prepare swap parameters
        uint256[] memory amounts = new uint256[](routes.length + 1);
        amounts[0] = amountIn;

        // Encode swapExactTokensForTokens function call
        bytes memory swapData = abi.encodeWithSignature(
            "swapExactTokensForTokens(uint256,uint256,(address,address,bool)[],address,uint256)",
            amountIn,
            minAmountOut,
            routes,
            msg.sender,
            block.timestamp + 300 // 5 minutes deadline
        );

        // Execute swap
        (bool success, bytes memory returnData) = AERODROME_ROUTER.call(swapData);
        require(success, "AerodromeAdapter: swap failed");

        // Decode amounts array from return data
        amounts = abi.decode(returnData, (uint256[]));
        amountOut = amounts[amounts.length - 1]; // Last element is output amount

        return amountOut;
    }

    function getQuote(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external view override returns (uint256 amountOut) {
        // Try both stable and volatile pools
        Route[] memory routes = new Route[](1);
        
        uint256 bestAmountOut = 0;
        bool useStable = false;

        // Try volatile pool first
        routes[0] = Route({
            from: tokenIn,
            to: tokenOut,
            stable: false
        });

        try this._getQuoteForRoute(routes, amountIn) returns (uint256 quote) {
            if (quote > bestAmountOut) {
                bestAmountOut = quote;
                useStable = false;
            }
        } catch {
            // Pool might not exist, continue
        }

        // Try stable pool
        routes[0].stable = true;
        try this._getQuoteForRoute(routes, amountIn) returns (uint256 quote) {
            if (quote > bestAmountOut) {
                bestAmountOut = quote;
                useStable = true;
            }
        } catch {
            // Pool might not exist, continue
        }

        require(bestAmountOut > 0, "AerodromeAdapter: no pool found");
        return bestAmountOut;
    }

    function _getQuoteForRoute(
        Route[] memory routes,
        uint256 amountIn
    ) external view returns (uint256 amountOut) {
        // Call router's getAmountsOut function
        (bool success, bytes memory returnData) = AERODROME_ROUTER.staticcall(
            abi.encodeWithSignature(
                "getAmountsOut(uint256,(address,address,bool)[])",
                amountIn,
                routes
            )
        );

        require(success, "AerodromeAdapter: quote failed");
        
        // getAmountsOut returns uint256[] amounts
        uint256[] memory amounts = abi.decode(returnData, (uint256[]));
        amountOut = amounts[amounts.length - 1]; // Last element is output amount
        
        return amountOut;
    }

    function name() external pure override returns (string memory) {
        return "Aerodrome";
    }
}
