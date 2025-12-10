// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/FlowRouter.sol";
import "../src/MEVGuard.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy MEVGuard
        MEVGuard mevGuard = new MEVGuard(50, 2); // 0.5% max slippage, 2 block min deadline
        console.log("MEVGuard deployed at:", address(mevGuard));

        // Deploy FlowRouter
        FlowRouter router = new FlowRouter(address(0), 0); // No fee for MVP
        console.log("FlowRouter deployed at:", address(router));

        vm.stopBroadcast();
    }
}

