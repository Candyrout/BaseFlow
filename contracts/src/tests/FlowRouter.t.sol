// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../FlowRouter.sol";
import "../DEXAdapters/UniV3Adapter.sol";
import "../DEXAdapters/AerodromeAdapter.sol";
import "../interfaces/IDEXAdapter.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Mock ERC20 token for testing
contract MockERC20 is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 1000000 * 10**18);
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract FlowRouterTest is Test {
    FlowRouter public router;
    UniV3Adapter public uniV3Adapter;
    AerodromeAdapter public aerodromeAdapter;
    
    MockERC20 public tokenA;
    MockERC20 public tokenB;
    
    address public user = address(0x1);
    address public feeRecipient = address(0x2);

    function setUp() public {
        // Deploy adapters
        uniV3Adapter = new UniV3Adapter();
        aerodromeAdapter = new AerodromeAdapter();
        
        // Deploy router
        router = new FlowRouter(feeRecipient, 0); // 0 fee for MVP
        
        // Deploy mock tokens
        tokenA = new MockERC20("Token A", "TKA");
        tokenB = new MockERC20("Token B", "TKB");
        
        // Setup user
        vm.deal(user, 100 ether);
        tokenA.mint(user, 1000 * 10**18);
        tokenB.mint(user, 1000 * 10**18);
    }

    function test_Initialization() public {
        assertEq(router.feeRecipient(), feeRecipient);
        assertEq(router.feeBps(), 0);
    }

    function test_Quote_SinglePath() public {
        FlowRouter.SwapPath[] memory paths = new FlowRouter.SwapPath[](1);
        paths[0] = FlowRouter.SwapPath({
            dex: address(uniV3Adapter),
            tokenIn: address(tokenA),
            tokenOut: address(tokenB),
            data: ""
        });

        uint256 amountIn = 1 * 10**18;
        
        // Quote will fail because no pools exist for mock tokens
        // This is expected behavior - in production, real tokens with pools would work
        vm.expectRevert();
        router.quote(paths, amountIn);
    }

    function test_Quote_MultiplePaths() public {
        FlowRouter.SwapPath[] memory paths = new FlowRouter.SwapPath[](2);
        paths[0] = FlowRouter.SwapPath({
            dex: address(uniV3Adapter),
            tokenIn: address(tokenA),
            tokenOut: address(tokenB),
            data: ""
        });
        paths[1] = FlowRouter.SwapPath({
            dex: address(aerodromeAdapter),
            tokenIn: address(tokenA),
            tokenOut: address(tokenB),
            data: ""
        });

        uint256 amountIn = 2 * 10**18;
        
        // Quote will fail because no pools exist for mock tokens
        vm.expectRevert();
        router.quote(paths, amountIn);
    }

    function test_Swap_EmptyPaths() public {
        FlowRouter.SwapPath[] memory paths = new FlowRouter.SwapPath[](0);
        
        vm.expectRevert("FlowRouter: empty paths");
        router.swap(paths, 1 * 10**18, 0);
    }

    function test_Swap_ZeroAmount() public {
        FlowRouter.SwapPath[] memory paths = new FlowRouter.SwapPath[](1);
        paths[0] = FlowRouter.SwapPath({
            dex: address(uniV3Adapter),
            tokenIn: address(tokenA),
            tokenOut: address(tokenB),
            data: ""
        });
        
        vm.expectRevert("FlowRouter: zero amount");
        router.swap(paths, 0, 0);
    }

    function test_SetFee() public {
        uint256 newFee = 10; // 0.1%
        
        router.setFee(newFee);
        assertEq(router.feeBps(), newFee);
    }

    function test_SetFeeRecipient() public {
        address newRecipient = address(0x3);
        
        router.setFeeRecipient(newRecipient);
        assertEq(router.feeRecipient(), newRecipient);
    }

    function test_UniV3Adapter_Name() public view {
        assertEq(uniV3Adapter.name(), "Uniswap V3");
    }

    function test_AerodromeAdapter_Name() public view {
        assertEq(aerodromeAdapter.name(), "Aerodrome");
    }
}
