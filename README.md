# Zora Coin Creator

A Next.js application for creating and managing Zora coins across multiple chains, including Base, Base Sepolia, and other EVM-compatible networks.

## Project Status

This project is currently under active development and is changing rapidly. Please note the following:

-   **Configuration**: Some configurations (like contract addresses and RPC endpoints) are currently hardcoded but will be made dynamic in future updates.
-   **Feature Completeness**: Not all features of the Zora Coins SDK have been implemented yet. The current focus is on core coin creation functionality.
-   **Chain Support**: While the application supports multiple chains, some features may be limited to specific networks during this development phase.
-   **API Stability**: The API and component interfaces may change as the project evolves. Breaking changes will be documented in release notes.

## Features

-   Create Zora coins on supported chains (Base, Base Sepolia, Zora, Optimism, Arbitrum, Blast)
-   View recent coins with detailed information
-   Switch between different chains
-   Connect with Web3 wallets
-   View transactions on chain explorers
-   Chain selection with visual indicators
-   Dark/Light mode support
-   Responsive design
-   Real-time transaction status updates
-   Error handling with retry logic

## Project Structure

```
zora-coin-creator/
├── app/
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   ├── CoinForm.tsx   # Coin creation form
│   │   ├── ChainSelector.tsx # Chain selection component
│   │   └── TransactionStatus.tsx # Transaction status display
│   ├── config/            # Configuration files
│   │   ├── chains.ts      # Chain configurations
│   │   ├── wagmi.ts       # Wagmi configuration
│   │   └── abis.ts        # Contract ABIs
│   ├── hooks/             # Custom React hooks
│   │   ├── useCoinCreation.ts # Coin creation logic
│   │   └── useDebug.ts    # Debug mode hook
│   ├── contexts/          # React contexts
│   │   └── DebugContext.tsx # Debug mode context
│   ├── lib/               # Utility functions
│   ├── providers.tsx      # App providers
│   └── page.tsx           # Main application page
```

## Core Components

### CoinForm

The main component for creating new Zora coins. Handles form input, validation, and transaction submission.

```tsx
interface CoinFormProps {
    onSuccess?: (hash: `0x${string}`) => void;
}

export function CoinForm({ onSuccess }: CoinFormProps) {
    // Implementation
}
```

### ChainSelector

A dropdown component for selecting different chains with visual indicators.

```tsx
export function ChainSelector() {
    // Implementation
}
```

### TransactionStatus

Displays transaction status, including success/failure states and links to explorers.

```tsx
interface TransactionStatusProps {
    transactionHash?: `0x${string}`;
    status?: string;
    name: string;
    symbol: string;
    uri: string;
    chainId: keyof typeof CHAINS;
    tokenAddress?: `0x${string}`;
}
```

## Custom Hooks

### useCoinCreation

Manages the coin creation process and transaction states.

```tsx
interface UseCoinCreationProps {
    name: string;
    symbol: string;
    uri: string;
    owners?: ViemAddress[];
    payoutRecipient: ViemAddress;
    platformReferrer?: ViemAddress;
    initialPurchaseWei?: bigint;
    chainId: number;
}

export function useCoinCreation({
    name,
    symbol,
    uri,
    owners,
    payoutRecipient,
    platformReferrer,
    initialPurchaseWei = BigInt(0),
    chainId,
}: UseCoinCreationProps) {
    // Implementation
}
```

### useDebug

Manages debug mode state and logging.

```tsx
export function useDebug() {
    // Implementation
}
```

## Configuration

### Chain Configuration

Chains are configured in `app/config/chains.ts`:

```typescript
export const CHAINS = {
    [base.id]: {
        factory: "0x777777751622c0d3258f214F9DF38E35BF45baF3",
        explorer: "https://basescan.org",
        rpc: "https://mainnet.base.org",
        protocolRewardRecipient: "0x89480c2E67876650b48622907ff5C48A569a36C7",
        protocolRewards: "0x89480c2E67876650b48622907ff5C48A569a36C7",
        weth: "0x4200000000000000000000000000000000000006",
        v3Factory: "0x0BFf88c4393F171Add343C5BA0e1e617091297Cb",
        swapRouter: "0x2626664c2603336E57B271c5C0b26F421741e481",
        airlock: "0x7777777F279eba3d3Ad8F4E708545291A6fDBA8B",
    },
    // Other chains...
};
```

### Wagmi Configuration

Wagmi is configured in `app/config/wagmi.ts`:

```typescript
import { createConfig, http } from "wagmi";
import { base, baseSepolia } from "viem/chains";

export const config = createConfig({
    chains: [base, baseSepolia],
    transports: {
        [base.id]: http(),
        [baseSepolia.id]: http(),
    },
});
```

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

3. Create a `.env.local` file:

```
NEXT_PUBLIC_DRPC_KEY=your_drpc_key
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development

### Available Scripts

-   `npm run dev`: Start development server
-   `npm run build`: Build production bundle
-   `npm run start`: Start production server
-   `npm run lint`: Run ESLint
-   `npm run format`: Format code with Prettier

### Adding a New Chain

1. Add the chain to `app/config/chains.ts`:

```typescript
export const CHAINS = {
    // ... existing chains
    [newChain.id]: {
        factory: "0x...",
        explorer: "https://...",
        rpc: "https://...",
        // ... other required addresses
    },
};
```

2. Update `app/config/wagmi.ts`:

```typescript
import { newChain } from "viem/chains";

export const config = createConfig({
    chains: [base, baseSepolia, newChain],
    transports: {
        // ... existing transports
        [newChain.id]: http(),
    },
});
```

## Debug Mode

The application includes a debug mode that can be toggled on/off. Debug mode provides detailed logging of:

-   Transaction details
-   Contract interactions
-   Network requests
-   State changes
-   Error traces

To enable debug mode:

1. Use the UI toggle in the header
2. Or use the `useDebug` hook in your components:

```tsx
const { isDebug, toggleDebug } = useDebug();
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.
