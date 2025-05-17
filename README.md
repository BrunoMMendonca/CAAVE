# AaveADA - Cardano Lending Protocol Frontend

## Overview

AaveADA is a frontend clone of the Aave lending protocol adapted for the Cardano blockchain. This application provides a user interface for users to supply, borrow, stake, and participate in governance within a decentralized finance (DeFi) ecosystem on Cardano.

## Features

- **Dashboard**: View portfolio statistics, supply/borrow positions, and market trends
- **Markets**: Explore available assets, see market statistics, and access asset details
- **Asset Details**: View comprehensive information about individual assets
- **Stake**: Stake ADA tokens to earn rewards
- **Governance**: Participate in protocol governance by voting on proposals
- **Wallet Connection**: Connect your Cardano wallet (Nami, Eternl, etc.) to interact with the protocol

## Technology Stack

- **Frontend**: React, TailwindCSS
- **Charts**: Chart.js, react-chartjs-2
- **Animations**: Framer Motion
- **Wallet Integration**: Native Cardano wallet connectors (CIP-30)

## Wallet Integration

The application currently supports connecting to Cardano wallets using the CIP-30 standard. Supported wallets include:

- Nami
- Eternl
- Flint
- Typhon
- And other CIP-30 compatible wallets

### Wallet Features

- Connect to Cardano wallets
- View wallet balance
- View wallet address
- Persistent connection (saved in localStorage)

## Development Setup

### Prerequisites

- Node.js and npm/yarn
- A modern web browser
- A Cardano wallet extension (for wallet connection testing)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   yarn install
   ```
3. Start the development server:
   ```
   yarn start
   ```

## Future Enhancements

- Backend integration with Cardano blockchain
- Smart contract integration for real lending/borrowing functionality
- Transaction signing and submission
- Real-time market data
- Advanced wallet features like transaction history

## Notes

This is currently a frontend-only implementation with:
- Real wallet connection (if you have a Cardano wallet installed)
- Mocked data for assets, markets, and user positions
- UI flows for all core functions (supply, borrow, stake, governance)

To make this a fully functional DeFi application, backend integration with Cardano smart contracts would be required.
