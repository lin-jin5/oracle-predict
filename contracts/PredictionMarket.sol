// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title PredictionMarket
 * @dev Core prediction market contract for binary outcome markets
 */
contract PredictionMarket is Ownable, ReentrancyGuard {
    IERC20 public immutable paymentToken; // USDC or other stablecoin
    
    struct Market {
        string question;
        string description;
        string category;
        string resolutionSource;
        address creator;
        uint256 endTime;
        uint256 resolutionTime;
        uint256 totalYesShares;
        uint256 totalNoShares;
        uint256 totalVolume;
        MarketStatus status;
        Outcome outcome;
    }
    
    struct Position {
        uint256 yesShares;
        uint256 noShares;
        uint256 averageYesPrice;
        uint256 averageNoPrice;
    }
    
    enum MarketStatus { Open, Closed, Resolved }
    enum Outcome { Pending, Yes, No, Invalid }
    
    uint256 public marketCount;
    uint256 public constant PLATFORM_FEE = 200; // 2% (200 basis points)
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant INITIAL_PRICE = 5000; // 0.50 (50%)
    
    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(address => Position)) public positions;
    mapping(uint256 => uint256) public marketLiquidity;
    
    event MarketCreated(
        uint256 indexed marketId,
        address indexed creator,
        string question,
        uint256 endTime
    );
    
    event SharesPurchased(
        uint256 indexed marketId,
        address indexed buyer,
        bool isYes,
        uint256 shares,
        uint256 cost
    );
    
    event SharesSold(
        uint256 indexed marketId,
        address indexed seller,
        bool isYes,
        uint256 shares,
        uint256 payout
    );
    
    event MarketResolved(
        uint256 indexed marketId,
        Outcome outcome,
        address indexed resolver
    );
    
    event WinningsClaimed(
        uint256 indexed marketId,
        address indexed claimer,
        uint256 amount
    );
    
    constructor(address _paymentToken) {
        paymentToken = IERC20(_paymentToken);
    }
    
    /**
     * @dev Create a new prediction market
     * @param _question Market question
     * @param _description Detailed description
     * @param _category Market category
     * @param _resolutionSource Source for resolution
     * @param _endTime Market end timestamp
     * @param _initialLiquidity Initial liquidity in payment tokens
     */
    function createMarket(
        string memory _question,
        string memory _description,
        string memory _category,
        string memory _resolutionSource,
        uint256 _endTime,
        uint256 _initialLiquidity
    ) external nonReentrant returns (uint256) {
        require(_endTime > block.timestamp, "End time must be in future");
        require(_initialLiquidity >= 10 * 10**18, "Minimum liquidity: 10 tokens");
        
        // Transfer initial liquidity from creator
        require(
            paymentToken.transferFrom(msg.sender, address(this), _initialLiquidity),
            "Transfer failed"
        );
        
        uint256 marketId = marketCount++;
        
        markets[marketId] = Market({
            question: _question,
            description: _description,
            category: _category,
            resolutionSource: _resolutionSource,
            creator: msg.sender,
            endTime: _endTime,
            resolutionTime: 0,
            totalYesShares: 0,
            totalNoShares: 0,
            totalVolume: 0,
            status: MarketStatus.Open,
            outcome: Outcome.Pending
        });
        
        marketLiquidity[marketId] = _initialLiquidity;
        
        emit MarketCreated(marketId, msg.sender, _question, _endTime);
        
        return marketId;
    }
    
    /**
     * @dev Buy outcome shares
     * @param _marketId Market ID
     * @param _isYes True for YES shares, false for NO shares
     * @param _amount Amount of payment tokens to spend
     */
    function buyShares(
        uint256 _marketId,
        bool _isYes,
        uint256 _amount
    ) external nonReentrant {
        Market storage market = markets[_marketId];
        require(market.status == MarketStatus.Open, "Market not open");
        require(block.timestamp < market.endTime, "Market ended");
        require(_amount > 0, "Amount must be positive");
        
        // Transfer payment tokens
        require(
            paymentToken.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );
        
        // Calculate shares based on current price
        uint256 shares = calculateShares(_marketId, _isYes, _amount);
        require(shares > 0, "Invalid share amount");
        
        // Take platform fee
        uint256 fee = (_amount * PLATFORM_FEE) / BASIS_POINTS;
        uint256 netAmount = _amount - fee;
        
        // Update market state
        if (_isYes) {
            market.totalYesShares += shares;
        } else {
            market.totalNoShares += shares;
        }
        market.totalVolume += _amount;
        marketLiquidity[_marketId] += netAmount;
        
        // Update position
        Position storage position = positions[_marketId][msg.sender];
        if (_isYes) {
            uint256 totalCost = (position.yesShares * position.averageYesPrice) + _amount;
            position.yesShares += shares;
            position.averageYesPrice = totalCost / position.yesShares;
        } else {
            uint256 totalCost = (position.noShares * position.averageNoPrice) + _amount;
            position.noShares += shares;
            position.averageNoPrice = totalCost / position.noShares;
        }
        
        emit SharesPurchased(_marketId, msg.sender, _isYes, shares, _amount);
    }
    
    /**
     * @dev Sell outcome shares
     * @param _marketId Market ID
     * @param _isYes True for YES shares, false for NO shares
     * @param _shares Number of shares to sell
     */
    function sellShares(
        uint256 _marketId,
        bool _isYes,
        uint256 _shares
    ) external nonReentrant {
        Market storage market = markets[_marketId];
        require(market.status == MarketStatus.Open, "Market not open");
        require(block.timestamp < market.endTime, "Market ended");
        
        Position storage position = positions[_marketId][msg.sender];
        require(
            _isYes ? position.yesShares >= _shares : position.noShares >= _shares,
            "Insufficient shares"
        );
        
        // Calculate payout based on current price
        uint256 payout = calculatePayout(_marketId, _isYes, _shares);
        require(payout <= marketLiquidity[_marketId], "Insufficient liquidity");
        
        // Take platform fee
        uint256 fee = (payout * PLATFORM_FEE) / BASIS_POINTS;
        uint256 netPayout = payout - fee;
        
        // Update market state
        if (_isYes) {
            market.totalYesShares -= _shares;
        } else {
            market.totalNoShares -= _shares;
        }
        market.totalVolume += payout;
        marketLiquidity[_marketId] -= netPayout;
        
        // Update position
        if (_isYes) {
            position.yesShares -= _shares;
        } else {
            position.noShares -= _shares;
        }
        
        // Transfer payout
        require(paymentToken.transfer(msg.sender, netPayout), "Transfer failed");
        
        emit SharesSold(_marketId, msg.sender, _isYes, _shares, netPayout);
    }
    
    /**
     * @dev Resolve market outcome
     * @param _marketId Market ID
     * @param _outcome Market outcome (Yes, No, or Invalid)
     */
    function resolveMarket(
        uint256 _marketId,
        Outcome _outcome
    ) external onlyOwner {
        Market storage market = markets[_marketId];
        require(market.status == MarketStatus.Open, "Market already resolved");
        require(block.timestamp >= market.endTime, "Market not ended");
        require(_outcome != Outcome.Pending, "Invalid outcome");
        
        market.status = MarketStatus.Resolved;
        market.outcome = _outcome;
        market.resolutionTime = block.timestamp;
        
        emit MarketResolved(_marketId, _outcome, msg.sender);
    }
    
    /**
     * @dev Claim winnings after market resolution
     * @param _marketId Market ID
     */
    function claimWinnings(uint256 _marketId) external nonReentrant {
        Market storage market = markets[_marketId];
        require(market.status == MarketStatus.Resolved, "Market not resolved");
        
        Position storage position = positions[_marketId][msg.sender];
        uint256 winningShares = 0;
        
        if (market.outcome == Outcome.Yes) {
            winningShares = position.yesShares;
            position.yesShares = 0;
        } else if (market.outcome == Outcome.No) {
            winningShares = position.noShares;
            position.noShares = 0;
        } else {
            // Invalid outcome - refund both
            winningShares = position.yesShares + position.noShares;
            position.yesShares = 0;
            position.noShares = 0;
        }
        
        require(winningShares > 0, "No winnings to claim");
        
        // Each winning share pays out 1 token
        uint256 payout = winningShares * 10**18;
        require(payout <= marketLiquidity[_marketId], "Insufficient funds");
        
        marketLiquidity[_marketId] -= payout;
        
        require(paymentToken.transfer(msg.sender, payout), "Transfer failed");
        
        emit WinningsClaimed(_marketId, msg.sender, payout);
    }
    
    /**
     * @dev Calculate shares for a given amount
     * @param _marketId Market ID
     * @param _isYes True for YES shares
     * @param _amount Amount to spend
     */
    function calculateShares(
        uint256 _marketId,
        bool _isYes,
        uint256 _amount
    ) public view returns (uint256) {
        Market storage market = markets[_marketId];
        uint256 price = getCurrentPrice(_marketId, _isYes);
        return (_amount * BASIS_POINTS) / price;
    }
    
    /**
     * @dev Calculate payout for selling shares
     * @param _marketId Market ID
     * @param _isYes True for YES shares
     * @param _shares Number of shares
     */
    function calculatePayout(
        uint256 _marketId,
        bool _isYes,
        uint256 _shares
    ) public view returns (uint256) {
        uint256 price = getCurrentPrice(_marketId, _isYes);
        return (_shares * price) / BASIS_POINTS;
    }
    
    /**
     * @dev Get current price for outcome shares
     * @param _marketId Market ID
     * @param _isYes True for YES price
     */
    function getCurrentPrice(
        uint256 _marketId,
        bool _isYes
    ) public view returns (uint256) {
        Market storage market = markets[_marketId];
        uint256 totalShares = market.totalYesShares + market.totalNoShares;
        
        if (totalShares == 0) {
            return INITIAL_PRICE; // 0.50
        }
        
        // Simple pricing: share / total shares
        if (_isYes) {
            return (market.totalYesShares * BASIS_POINTS) / totalShares;
        } else {
            return (market.totalNoShares * BASIS_POINTS) / totalShares;
        }
    }
    
    /**
     * @dev Get user position in a market
     * @param _marketId Market ID
     * @param _user User address
     */
    function getPosition(
        uint256 _marketId,
        address _user
    ) external view returns (Position memory) {
        return positions[_marketId][_user];
    }
}
