// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MEVGuard
 * @notice MEV protection contract for BaseFlow
 * @dev Provides protection against sandwich attacks and other MEV
 */
contract MEVGuard {
    /// @notice Maximum slippage allowed (in basis points)
    uint256 public maxSlippageBps;
    
    /// @notice Minimum deadline (blocks from current)
    uint256 public minDeadlineBlocks;
    
    /// @notice Whitelisted private relayers
    mapping(address => bool) public whitelistedRelayers;
    
    /// @notice Owner (for access control)
    address public owner;

    event MaxSlippageUpdated(uint256 oldSlippage, uint256 newSlippage);
    event MinDeadlineUpdated(uint256 oldDeadline, uint256 newDeadline);
    event RelayerWhitelisted(address indexed relayer, bool whitelisted);

    modifier onlyOwner() {
        require(msg.sender == owner, "MEVGuard: not owner");
        _;
    }

    constructor(uint256 _maxSlippageBps, uint256 _minDeadlineBlocks) {
        owner = msg.sender;
        maxSlippageBps = _maxSlippageBps;
        minDeadlineBlocks = _minDeadlineBlocks;
    }

    /**
     * @notice Validate swap parameters for MEV protection
     * @param minAmountOut Minimum output amount
     * @param expectedAmountOut Expected output amount
     * @param deadline Transaction deadline (block number)
     */
    function validateSwap(
        uint256 minAmountOut,
        uint256 expectedAmountOut,
        uint256 deadline
    ) external view {
        // Check slippage
        require(
            minAmountOut >= (expectedAmountOut * (10000 - maxSlippageBps)) / 10000,
            "MEVGuard: slippage too high"
        );

        // Check deadline
        require(
            deadline >= block.number + minDeadlineBlocks,
            "MEVGuard: deadline too soon"
        );
    }

    /**
     * @notice Check if relayer is whitelisted
     * @param relayer Address to check
     */
    function isRelayerWhitelisted(address relayer) external view returns (bool) {
        return whitelistedRelayers[relayer];
    }

    /**
     * @notice Whitelist/remove relayer
     * @param relayer Address to whitelist
     * @param whitelisted Whether to whitelist or remove
     */
    function setRelayerWhitelist(
        address relayer,
        bool whitelisted
    ) external onlyOwner {
        whitelistedRelayers[relayer] = whitelisted;
        emit RelayerWhitelisted(relayer, whitelisted);
    }

    /**
     * @notice Update max slippage
     */
    function setMaxSlippage(uint256 _maxSlippageBps) external onlyOwner {
        require(_maxSlippageBps <= 10000, "MEVGuard: invalid slippage");
        uint256 oldSlippage = maxSlippageBps;
        maxSlippageBps = _maxSlippageBps;
        emit MaxSlippageUpdated(oldSlippage, _maxSlippageBps);
    }

    /**
     * @notice Update min deadline
     */
    function setMinDeadline(uint256 _minDeadlineBlocks) external onlyOwner {
        minDeadlineBlocks = _minDeadlineBlocks;
        emit MinDeadlineUpdated(minDeadlineBlocks, _minDeadlineBlocks);
    }

    /**
     * @notice Transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "MEVGuard: zero address");
        owner = newOwner;
    }
}

