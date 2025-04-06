# Zora Coin Creator

A Next.js application for creating and viewing Zora coins across multiple chains. This application provides a user-friendly interface for interacting with the Zora protocol's coin creation functionality and viewing recent coin deployments across various EVM-compatible chains.

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

## Architecture

The application is built using a modern web3 stack with the following architecture:

### Frontend

-   **Next.js**: React framework with server-side rendering capabilities
-   **Tailwind CSS**: Utility-first CSS framework for styling
-   **RainbowKit**: Web3 wallet connection UI components
-   **Shadcn UI**: Reusable UI components built with Radix UI

### Web3 Infrastructure

-   **Wagmi**: React hooks for Ethereum
-   **Viem**: TypeScript interface for Ethereum
-   **Zora Coins SDK**: Official SDK for interacting with Zora's coin protocol
-   **DRPC**: Multi-chain RPC provider for blockchain interactions

### State Management

-   React hooks for local state
-   Wagmi hooks for blockchain state
-   Context providers for global application state

## Zora Coins SDK Implementation

The application uses the Zora Coins SDK to interact with the Zora protocol. Here are the key implementations:

### Creating a New Coin

```typescript
// From CreateZoraCoin.tsx
import { createCoinCall, getCoinCreateFromLogs } from "@zoralabs/coins-sdk";

// Define coin parameters
const coinParams = {
    name: name.trim(),
    symbol: symbol.trim(),
    uri: uri.trim(),
    payoutRecipient: address as ViemAddress,
    platformReferrer: address as ViemAddress,
};

// Create configuration for wagmi
const contractCallParams = createCoinCall(coinParams);

// Use wagmi's useContractWrite hook to send the transaction
const { writeContract } = useContractWrite({
    mutation: {
        onSuccess: (data) => {
            console.log("Transaction sent:", data);
            setTxHash(data);
            setStatus("Transaction sent, waiting for confirmation...");
        },
        onError: (error) => {
            console.error("Transaction error:", error);
            setError(error.message);
            setStatus("Transaction failed");
        },
    },
});

// After transaction confirmation, extract the coin address from logs
const receipt = await publicClient?.getTransactionReceipt({ hash });
const coinDeployment = getCoinCreateFromLogs(receipt);
if (coinDeployment?.coin) {
    setContractAddress(coinDeployment.coin);
}
```

### Fetching Recent Coins

```typescript
// From RecentCoins.tsx
import { getCoinsNew } from "@zoralabs/coins-sdk";

// Fetch recent coins with retry logic
const fetchWithRetry = async (retries = 3, delay = 2000) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await getCoinsNew({
                count: 10,
            });
            return response;
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
};

// Process the response
const response = await getCoinsNew({
    count: 10,
});
if (response.data?.exploreList?.edges) {
    const recentCoins = response.data.exploreList.edges
        .map((edge: any) => ({
            name: edge.node.name,
            symbol: edge.node.symbol,
            address: edge.node.address,
            createdAt: edge.node.createdAt,
            creatorAddress: edge.node.creatorAddress,
            marketCap: edge.node.marketCap,
            chainId: edge.node.chainId,
        }))
        .sort(
            (a: Coin, b: Coin) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        );
    setCoins(recentCoins);
}
```

### Key Features of the SDK Implementation

1. **Error Handling and Retries**

    - Implements exponential backoff for API calls
    - Graceful error handling for transaction failures
    - Retry logic for network issues

2. **Transaction Management**

    - Uses wagmi's hooks for transaction state management
    - Tracks transaction status and confirmation
    - Extracts contract addresses from transaction logs

3. **Data Processing**

    - Sorts coins by creation date
    - Formats data for display
    - Handles optional fields like market cap

4. **Chain Support**
    - Works across multiple EVM chains
    - Handles chain-specific configurations
    - Supports both mainnet and testnet deployments

## Prerequisites

-   Node.js 18.x or later
-   A DRPC account (for RPC endpoints)
-   MetaMask or compatible Web3 wallet
-   Basic understanding of EVM-compatible chains and Web3 concepts

## Getting Started

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/zora-coin-creator.git
    cd zora-coin-creator
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env.local` file with your DRPC API key:

    ```
    # Required for RPC endpoints
    NEXT_PUBLIC_DRPC_KEY=your_drpc_key
    ```

4. Run the development server:

    ```bash
    npm run dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Configuration

### RPC Endpoints

The application uses DRPC for RPC endpoints across different chains. The configuration is set up in `app/config/wagmi.ts`:

-   Base: `https://drpc.org/rpc/${DRPC_KEY}/base`
-   Optimism: `https://drpc.org/rpc/${DRPC_KEY}/optimism`
-   Arbitrum: `https://drpc.org/rpc/${DRPC_KEY}/arbitrum`
-   Zora: `https://rpc.zora.energy` (native endpoint)
-   Blast: `https://rpc.blast.io` (native endpoint)

### Chain Configuration

Supported chains are configured in the Wagmi setup with their respective RPC endpoints and chain IDs:

-   Base (Chain ID: 8453)
-   Zora (Chain ID: 7777777)
-   Optimism (Chain ID: 10)
-   Arbitrum (Chain ID: 42161)
-   Blast (Chain ID: 81457)

### Wallet Connection

The application uses RainbowKit for wallet connection, supporting:

-   MetaMask
-   WalletConnect
-   Coinbase Wallet
-   And other popular Web3 wallets

## Project Structure

```
zora-coin-creator/
├── app/
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   ├── CreateZoraCoin.tsx
│   │   ├── RecentCoins.tsx
│   │   ├── WalletConnect.tsx
│   │   └── ChainSelector.tsx
│   ├── config/            # Configuration files
│   │   └── wagmi.ts       # Wagmi and chain configuration
│   ├── lib/               # Utility functions
│   ├── providers/         # Context providers
│   └── page.tsx           # Main application page
├── public/                # Static assets
├── .env.local            # Environment variables
├── package.json          # Dependencies and scripts
└── README.md             # Project documentation
```

## Development

### Available Scripts

-   `npm run dev`: Start development server
-   `npm run build`: Build production bundle
-   `npm run start`: Start production server
-   `npm run lint`: Run ESLint
-   `npm run format`: Format code with Prettier

### Code Style

-   Follows ESLint and Prettier configuration
-   Uses TypeScript for type safety
-   Implements React best practices
-   Follows Next.js 13+ app directory structure

## Deployment

The application can be deployed to any platform that supports Next.js applications. Recommended platforms:

1. Vercel (recommended)

    ```bash
    vercel
    ```

2. Netlify

    ```bash
    netlify deploy
    ```

3. Self-hosted
    ```bash
    npm run build
    npm run start
    ```

## Security Considerations

-   Never commit your `.env.local` file
-   Keep your DRPC API key secure
-   Use HTTPS in production
-   Implement rate limiting for API calls
-   Validate user input for coin creation

## Troubleshooting

### Common Issues

1. **Wallet Connection Issues**

    - Ensure MetaMask or your wallet is installed
    - Check if you're on a supported network
    - Clear browser cache if needed

2. **RPC Connection Issues**

    - Verify DRPC API key is correct
    - Check network connectivity
    - Ensure you're using the correct chain ID

3. **Transaction Failures**
    - Check if you have sufficient gas
    - Verify network congestion
    - Ensure all required fields are filled

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

-   Zora Protocol team for the SDK
-   DRPC for RPC endpoints
-   RainbowKit for wallet connection UI
-   The Web3 community for tools and resources
