# Zora Coin Creator

A Next.js application for creating and viewing Zora coins across multiple chains.

## Features

-   Create Zora coins on supported chains (Base, Zora, Optimism, Arbitrum, Blast)
-   View recent coins with detailed information including:
    -   Coin name and symbol
    -   Creation date
    -   Creator address
    -   Contract address
    -   Chain name
    -   Market cap (when available)
-   Switch between different chains to view chain-specific coins
-   Connect with MetaMask or other Web3 wallets
-   View transactions on chain explorers

## Prerequisites

-   Node.js 18.x or later
-   A DRPC account (for RPC endpoints)
-   MetaMask or compatible Web3 wallet

## Getting Started

1. Clone the repository
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a `.env.local` file with your DRPC API key (get it from [DRPC Dashboard](https://drpc.org/)):
    ```
    # Required for RPC endpoints
    NEXT_PUBLIC_DRPC_KEY=your_drpc_key
    ```
4. Run the development server:
    ```bash
    npm run dev
    ```

## Supported Chains

-   Base (Chain ID: 8453)
-   Zora (Chain ID: 7777777)
-   Optimism (Chain ID: 10)
-   Arbitrum (Chain ID: 42161)
-   Blast (Chain ID: 81457)

## Technologies Used

-   Next.js
-   React
-   Wagmi (with DRPC RPC endpoints)
-   Viem
-   Zora Coins SDK
-   Tailwind CSS
-   RainbowKit

## Contributing

Feel free to submit issues and enhancement requests.
