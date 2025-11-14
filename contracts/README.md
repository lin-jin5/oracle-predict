# Prediction Market Smart Contracts

This directory contains the Solidity smart contracts for the CryptoPredict decentralized prediction market platform.

## Contracts

### PredictionMarket.sol
The core prediction market contract that handles:
- Market creation with customizable parameters
- Binary outcome trading (YES/NO shares)
- Automated market maker (AMM) pricing
- Position tracking and management
- Market resolution and payout distribution
- Platform fee collection (2%)

**Key Features:**
- ERC20 payment token support (USDC or other stablecoins)
- Non-custodial - users maintain control of their funds
- Reentrancy protection
- Transparent pricing based on share distribution

### MarketFactory.sol
Factory contract for deploying new prediction markets:
- Standardized market deployment
- Market registry and tracking
- User market history
- Easy market discovery

## Setup & Deployment

### Prerequisites
```bash
npm install --save-dev @openzeppelin/contracts
```

### Compile
```bash
npx hardhat compile
```

### Deploy
```bash
npx hardhat run scripts/deploy.js --network <network-name>
```

## Contract Architecture

```
┌─────────────────────┐
│   MarketFactory     │
│  - Deploy Markets   │
│  - Track Markets    │
└──────────┬──────────┘
           │ deploys
           ▼
┌─────────────────────┐
│  PredictionMarket   │
│  - Create Markets   │
│  - Buy/Sell Shares  │
│  - Resolve Markets  │
│  - Claim Winnings   │
└─────────────────────┘
```

## Market Lifecycle

1. **Creation**: Creator sets question, end date, resolution source, and adds initial liquidity
2. **Trading**: Users buy and sell YES/NO shares based on their predictions
3. **Closing**: Market closes at specified end date
4. **Resolution**: Oracle/admin resolves market to YES, NO, or INVALID
5. **Settlement**: Winners claim their payouts (1 token per winning share)

## Pricing Mechanism

The contract uses a simple automated market maker:
- Initial price: 0.50 (50%) for both outcomes
- Price adjusts based on share distribution
- YES price = (Total YES shares) / (Total shares)
- NO price = (Total NO shares) / (Total shares)
- Prices always sum to 1.0

## Security Features

- **ReentrancyGuard**: Prevents reentrancy attacks
- **Access Control**: Only owner can resolve markets
- **Time Locks**: Markets can't be resolved before end time
- **Overflow Protection**: SafeMath operations (built-in Solidity 0.8+)
- **Pausable**: Markets can be paused in emergencies

## Gas Optimization

- Immutable variables where possible
- Efficient storage patterns
- Batch operations support
- Minimal state changes

## Testing

```bash
npx hardhat test
```

## Audit Status

⚠️ **These contracts are not audited. Do not use in production without a professional security audit.**

## License

MIT
