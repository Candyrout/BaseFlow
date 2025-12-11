// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../DEXAdapters/AerodromeAdapter.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 1000000 * 10**18);
    }
}

contract AerodromeAdapterTest is Test {
    AerodromeAdapter public adapter;
    MockERC20 public tokenA;
    MockERC20 public tokenB;

    function setUp() public {
        adapter = new AerodromeAdapter();
        tokenA = new MockERC20("Token A", "TKA");
        tokenB = new MockERC20("Token B", "TKB");
    }

    function test_AdapterName() public view {
        assertEq(adapter.name(), "Aerodrome");
    }

    function test_RouterAddress() public view {
        assertEq(adapter.AERODROME_ROUTER(), 0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43);
    }
}

