// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../DEXAdapters/UniV3Adapter.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 1000000 * 10**18);
    }
}

contract UniV3AdapterTest is Test {
    UniV3Adapter public adapter;
    MockERC20 public tokenA;
    MockERC20 public tokenB;

    function setUp() public {
        adapter = new UniV3Adapter();
        tokenA = new MockERC20("Token A", "TKA");
        tokenB = new MockERC20("Token B", "TKB");
    }

    function test_AdapterName() public view {
        assertEq(adapter.name(), "Uniswap V3");
    }

    function test_RouterAddress() public view {
        assertEq(adapter.SWAP_ROUTER_02(), 0x2626664c2603336E57B271c5C0b26F421741e481);
    }

    function test_QuoterAddress() public view {
        assertEq(adapter.QUOTER_V2(), 0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a);
    }

    function test_FeeTiers() public view {
        assertEq(adapter.FEE_LOW(), 500);
        assertEq(adapter.FEE_MEDIUM(), 3000);
        assertEq(adapter.FEE_HIGH(), 10000);
    }
}

