// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IDEXAdapter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title FlowRouter
 * @notice Main router contract for BaseFlow liquidity aggregator
 * @dev Handles multi-DEX routing and split routing
 */
contract FlowRouter {
    using SafeERC20 for IERC20;
    /// @notice Swap path structure
    struct SwapPath {
        address dex;        // DEX adapter address
        address tokenIn;    // Input token address
        address tokenOut;   // Output token address
        bytes data;         // Custom call data for DEX
    }

    /// @notice Fee recipient (can be zero for MVP)
    address public feeRecipient;
    
    /// @notice Fee basis points (e.g., 5 = 0.05%)
    uint256 public feeBps;

    /// @notice Owner (for access control)
    address public owner;

    /// @notice Events
    event SwapExecuted(
        address indexed user,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );

    event FeeUpdated(uint256 oldFeeBps, uint256 newFeeBps);
    event FeeRecipientUpdated(address oldRecipient, address newRecipient);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @notice Modifier to restrict access to owner only
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "FlowRouter: not owner");
        _;
    }

    /**
     * @notice Constructor
     * @param _feeRecipient Address to receive fees (can be zero)
     * @param _feeBps Fee in basis points (0 for MVP)
     */
    constructor(address _feeRecipient, uint256 _feeBps) {
        owner = msg.sender;
        feeRecipient = _feeRecipient;
        feeBps = _feeBps;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    /**
     * @notice Execute swap across multiple paths
     * @param paths Array of swap paths
     * @param amountIn Total input amount
     * @param minOut Minimum output amount (slippage protection)
     * @return amountOut Total output amount
     */
    function swap(
        SwapPath[] memory paths,
        uint256 amountIn,
        uint256 minOut
    ) external payable returns (uint256 amountOut) {
        require(paths.length > 0, "FlowRouter: empty paths");
        require(amountIn > 0, "FlowRouter: zero amount");

        uint256 totalOut = 0;

        // Execute each path
        for (uint256 i = 0; i < paths.length; i++) {
            uint256 pathAmountIn = _calculatePathAmount(paths, i, amountIn);
            uint256 pathAmountOut = _executeSwap(paths[i], pathAmountIn);
            totalOut += pathAmountOut;
        }

        require(totalOut >= minOut, "FlowRouter: slippage exceeded");

        // Transfer output tokens to user
        // Note: This is a simplified version - actual implementation will vary by DEX

        emit SwapExecuted(
            msg.sender,
            paths[0].tokenIn,
            paths[paths.length - 1].tokenOut,
            amountIn,
            totalOut
        );

        return totalOut;
    }

    /**
     * @notice Get quote for swap (view function)
     * @param paths Array of swap paths
     * @param amountIn Input amount
     * @return amountOut Estimated output amount
     */
    function quote(
        SwapPath[] memory paths,
        uint256 amountIn
    ) external view returns (uint256 amountOut) {
        require(paths.length > 0, "FlowRouter: empty paths");
        require(amountIn > 0, "FlowRouter: zero amount");

        uint256 totalOut = 0;

        for (uint256 i = 0; i < paths.length; i++) {
            uint256 pathAmountIn = _calculatePathAmount(paths, i, amountIn);
            uint256 pathAmountOut = _getQuote(paths[i], pathAmountIn);
            totalOut += pathAmountOut;
        }

        return totalOut;
    }

    /**
     * @notice Calculate amount for a specific path (for split routing)
     * @dev Simplified version - actual implementation will support percentage splits
     */
    function _calculatePathAmount(
        SwapPath[] memory paths,
        uint256 index,
        uint256 totalAmount
    ) internal pure returns (uint256) {
        // For MVP: equal split across all paths
        // TODO: Implement percentage-based splits
        return totalAmount / paths.length;
    }

    /**
     * @notice Execute swap on a specific DEX
     * @dev This will call the appropriate adapter
     */
    function _executeSwap(
        SwapPath memory path,
        uint256 amountIn
    ) internal returns (uint256 amountOut) {
        // Transfer tokens to adapter if needed
        IERC20 tokenIn = IERC20(path.tokenIn);
        uint256 balanceBefore = tokenIn.balanceOf(address(this));
        
        // Transfer tokens from user to router
        tokenIn.safeTransferFrom(msg.sender, address(this), amountIn);
        
        // Get adapter interface
        IDEXAdapter adapter = IDEXAdapter(path.dex);
        
        // Calculate minimum amount out (with 0.5% slippage tolerance)
        uint256 minAmountOut = (amountIn * 995) / 1000; // Simplified, should use actual quote
        
        // Execute swap via adapter
        amountOut = adapter.swap(
            path.tokenIn,
            path.tokenOut,
            amountIn,
            minAmountOut,
            path.data
        );
        
        // Transfer output tokens to user
        IERC20 tokenOut = IERC20(path.tokenOut);
        tokenOut.safeTransfer(msg.sender, amountOut);
        
        return amountOut;
    }

    /**
     * @notice Get quote from a specific DEX
     * @dev This will call the appropriate adapter's quote function
     */
    function _getQuote(
        SwapPath memory path,
        uint256 amountIn
    ) internal view returns (uint256 amountOut) {
        IDEXAdapter adapter = IDEXAdapter(path.dex);
        return adapter.getQuote(path.tokenIn, path.tokenOut, amountIn);
    }

    /**
     * @notice Update fee (only owner)
     * @param _feeBps Fee in basis points (must be <= 10000)
     */
    function setFee(uint256 _feeBps) external onlyOwner {
        require(_feeBps <= 10000, "FlowRouter: invalid fee");
        uint256 oldFee = feeBps;
        feeBps = _feeBps;
        emit FeeUpdated(oldFee, _feeBps);
    }

    /**
     * @notice Update fee recipient (only owner)
     * @param _feeRecipient Address to receive fees
     */
    function setFeeRecipient(address _feeRecipient) external onlyOwner {
        require(_feeRecipient != address(0), "FlowRouter: zero address");
        address oldRecipient = feeRecipient;
        feeRecipient = _feeRecipient;
        emit FeeRecipientUpdated(oldRecipient, _feeRecipient);
    }

    /**
     * @notice Transfer ownership to a new owner
     * @param newOwner Address of the new owner
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "FlowRouter: zero address");
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

