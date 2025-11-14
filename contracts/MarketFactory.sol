// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PredictionMarket.sol";

/**
 * @title MarketFactory
 * @dev Factory contract for deploying prediction markets
 */
contract MarketFactory {
    address public immutable paymentToken;
    address[] public allMarkets;
    
    mapping(address => address[]) public userMarkets;
    
    event MarketDeployed(
        address indexed marketAddress,
        address indexed creator,
        uint256 timestamp
    );
    
    constructor(address _paymentToken) {
        paymentToken = _paymentToken;
    }
    
    /**
     * @dev Deploy a new prediction market contract
     */
    function deployMarket() external returns (address) {
        PredictionMarket newMarket = new PredictionMarket(paymentToken);
        newMarket.transferOwnership(msg.sender);
        
        address marketAddress = address(newMarket);
        allMarkets.push(marketAddress);
        userMarkets[msg.sender].push(marketAddress);
        
        emit MarketDeployed(marketAddress, msg.sender, block.timestamp);
        
        return marketAddress;
    }
    
    /**
     * @dev Get all deployed markets
     */
    function getAllMarkets() external view returns (address[] memory) {
        return allMarkets;
    }
    
    /**
     * @dev Get markets created by a specific user
     */
    function getUserMarkets(address _user) external view returns (address[] memory) {
        return userMarkets[_user];
    }
    
    /**
     * @dev Get total number of markets
     */
    function getMarketCount() external view returns (uint256) {
        return allMarkets.length;
    }
}
