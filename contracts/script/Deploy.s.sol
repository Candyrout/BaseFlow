// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/FlowRouter.sol";
import "../src/MEVGuard.sol";
import "../src/DEXAdapters/UniV3Adapter.sol";
import "../src/DEXAdapters/AerodromeAdapter.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying BaseFlow contracts...");
        console.log("Deployer:", vm.addr(deployerPrivateKey));

        // Deploy MEVGuard
        console.log("\n=== Deploying MEVGuard ===");
        MEVGuard mevGuard = new MEVGuard(50, 2); // 0.5% max slippage, 2 block min deadline
        console.log("MEVGuard deployed at:", address(mevGuard));

        // Deploy DEX Adapters
        console.log("\n=== Deploying DEX Adapters ===");
        UniV3Adapter uniV3Adapter = new UniV3Adapter();
        console.log("UniV3Adapter deployed at:", address(uniV3Adapter));

        AerodromeAdapter aerodromeAdapter = new AerodromeAdapter();
        console.log("AerodromeAdapter deployed at:", address(aerodromeAdapter));

        // Deploy FlowRouter
        console.log("\n=== Deploying FlowRouter ===");
        FlowRouter router = new FlowRouter(address(0), 0); // No fee for MVP
        console.log("FlowRouter deployed at:", address(router));
        console.log("FlowRouter owner:", router.owner());

        console.log("\n=== Deployment Summary ===");
        console.log("MEVGuard:", address(mevGuard));
        console.log("UniV3Adapter:", address(uniV3Adapter));
        console.log("AerodromeAdapter:", address(aerodromeAdapter));
        console.log("FlowRouter:", address(router));
        console.log("Owner:", router.owner());

        vm.stopBroadcast();
    }
}

