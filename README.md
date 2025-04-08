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
-   Chain selection with visual indicators
-   Dark/Light mode support
-   Responsive design with DaisyUI components
-   Real-time transaction status updates
-   Error handling with retry logic

## Architecture

The application is built using a modern web3 stack with the following architecture:

### Frontend

-   **Next.js**: React framework with server-side rendering capabilities
-   **Tailwind CSS**: Utility-first CSS framework for styling
-   **RainbowKit**: Web3 wallet connection UI components
-   **Shadcn UI**: Reusable UI components built with Radix UI
-   **DaisyUI**: Styling components for responsive design

### Web3 Infrastructure

-   **Wagmi**: React hooks for Ethereum
-   **Viem**: TypeScript interface for Ethereum
-   **Zora Coins SDK**: Official SDK for interacting with Zora's coin protocol
-   **DRPC**: Multi-chain RPC provider for blockchain interactions

### State Management

-   React hooks for local state
-   Wagmi hooks for blockchain state
-   Context providers for global application state

## UI Components

### Card-based Layout

The application uses DaisyUI cards for a clean, modern interface:

```tsx
<div className="card bg-white shadow-xl">
    <div className="card-body">
        <h2 className="card-title">Create New Coin</h2>
        {/* Form content */}
    </div>
</div>
```

### Theme Support

The application supports both light and dark modes with a theme toggle:

```tsx
const [theme, setTheme] = useState("light");
const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
};
```

### Chain Selector

A dropdown menu for selecting different chains:

```tsx
<DropdownMenu>
    <DropdownMenuTrigger>
        <Button variant="outline">
            {currentChain?.name || "Select Network"}
        </Button>
    </DropdownMenuTrigger>
    {/* Chain options */}
</DropdownMenu>
```

## Zora Coins SDK Implementation

The application leverages the Zora Coins SDK to interact with the Zora protocol, providing a robust interface for creating and managing coins across multiple chains. The SDK abstracts away much of the complexity of interacting with the blockchain, while still providing fine-grained control over the coin creation process.

### Creating a New Coin

The coin creation process is handled through a series of well-defined steps that ensure proper deployment and verification of the new coin. Here's a detailed breakdown of how it works:

1. **Factory and Implementation Setup**: The SDK requires two key addresses to function properly:

    - The Zora Coin Factory address (`0x7777777F279eba3d3Ad8F4E708545291A6fDBA8B`): This is the main contract that handles the deployment of new coins
    - The Zora Coin Implementation address: This is the template contract that new coins are based on

2. **Coin Parameters**: When creating a new coin, you need to specify several key parameters:

    - `name`: The full name of your coin (e.g., "My Awesome Coin")
    - `symbol`: The ticker symbol (e.g., "MAC")
    - `uri`: A URI that points to the coin's metadata
    - `payoutRecipient`: The address that will receive any fees or rewards
    - `platformReferrer`: The address that referred the coin creation

3. **Transaction Flow**: The creation process follows a specific sequence:

    - First, the SDK prepares the transaction parameters using `createCoinCall`
    - Then, the transaction is sent using wagmi's `useContractWrite` hook
    - The transaction is monitored for confirmation using `useTransaction`
    - Finally, the new coin's address is extracted from the transaction logs

4. **Error Handling**: The implementation includes comprehensive error handling:
    - Transaction failures are caught and displayed to the user
    - Network issues are handled with retry logic
    - Invalid parameters are validated before submission

### Reading Token Details

The SDK provides several ways to read information about existing coins. Here's how the token details reading process works:

1. **Contract ABI**: The application uses a standardized ABI (Application Binary Interface) to interact with the token contracts. This ABI includes three main functions:

    - `name()`: Returns the full name of the token
    - `symbol()`: Returns the token's ticker symbol
    - `totalSupply()`: Returns the total number of tokens in circulation

2. **Reading Process**: The token details are read using wagmi's `useContractRead` hook, which:

    - Automatically handles caching of results
    - Provides loading and error states
    - Allows for manual refetching when needed
    - Supports multiple chains through the `chainId` parameter

3. **Data Management**: The implementation includes:
    - Automatic updates when the contract state changes
    - Error handling for failed reads
    - Loading states for better UX
    - Caching to reduce unnecessary network calls

### Error Handling and Retries

The application implements a sophisticated error handling and retry system to ensure reliable operation:

1. **Exponential Backoff**: The retry system uses exponential backoff to handle temporary failures:

    - Starts with a base delay (default 1000ms)
    - Doubles the delay after each retry
    - Caps the maximum number of retries (default 3)

2. **Rate Limit Handling**: Special handling for rate limits:

    - Detects rate limit errors in the response
    - Implements exponential backoff for rate-limited requests
    - Logs retry attempts for debugging

3. **Transaction Receipt Handling**: Special handling for transaction receipts:
    - Retries receipt fetching with increasing delays
    - Handles cases where receipts aren't immediately available
    - Provides detailed error information for failed attempts

### Key Features of the SDK Implementation

1. **Error Handling and Retries**
   The implementation includes a robust error handling system that:

    - Automatically retries failed operations with exponential backoff
    - Specifically handles rate limits from the Zora API
    - Provides detailed error messages for debugging
    - Implements graceful degradation when services are unavailable

2. **Transaction Management**
   The transaction management system provides:

    - Real-time status updates during coin creation
    - Automatic confirmation monitoring
    - Detailed error reporting
    - Transaction receipt extraction and validation

3. **Token Details Management**
   The token details system offers:

    - Automatic caching of token information
    - Real-time updates when token state changes
    - Comprehensive error handling
    - Support for multiple chains

4. **Chain Support**
   The multi-chain support includes:
    - Automatic chain detection and switching
    - Chain-specific configurations
    - Cross-chain compatibility
    - Network validation and error handling

## Chain Configuration

The application supports multiple chains with their respective RPC endpoints:

### Mainnet Chains

-   Base (Chain ID: 8453)
-   Zora (Chain ID: 7777777)
-   Optimism (Chain ID: 10)
-   Arbitrum (Chain ID: 42161)
-   Blast (Chain ID: 81457)
-   Ethereum (Chain ID: 1)

### Testnet Chains

-   Base Sepolia (Chain ID: 84532)
-   Zora Sepolia (Chain ID: 999)
-   Arbitrum Sepolia (Chain ID: 421614)
-   Blast Sepolia (Chain ID: 168587773)

### RPC Configuration

Each chain is configured with specific RPC endpoints and settings:

```typescript
const chainTransport = http(
    `https://drpc.org/rpc/${process.env.NEXT_PUBLIC_DRPC_KEY}/chain-name`,
    {
        batch: {
            wait: 16, // Batch requests for 16ms
        },
        retryCount: 3, // Retry failed requests up to 3 times
    }
);
```

Native RPC endpoints are used for:

-   Zora: `https://rpc.zora.energy`
-   Blast: `https://rpc.blast.io`

## Extending the Application

### Adding New Features

#### 1. Adding a New Chain

To add support for a new chain:

1. Add the chain to the Wagmi configuration in `app/config/wagmi.ts`:

```typescript
const newChainTransport = http(
    `https://drpc.org/rpc/${process.env.NEXT_PUBLIC_DRPC_KEY}/new-chain`,
    {
        batch: { wait: 16 },
        retryCount: 3,
    }
);

const newChainRpc = {
    ...newChain,
    transport: newChainTransport,
};

// Add to chains array
const chains = [
    // ... existing chains
    newChainRpc,
] as const;
```

2. Update the chain selector in `app/components/ChainSelector.tsx`:

```typescript
const SUPPORTED_CHAINS = [
    // ... existing chains
    {
        id: NEW_CHAIN_ID,
        name: "New Chain",
        icon: "🟫",
    },
];
```

#### 2. Adding New Coin Features

To add new features to coin creation:

1. Extend the coin parameters in `CreateZoraCoin.tsx`:

```typescript
const coinParams = {
    // ... existing parameters
    newFeature: value,
    // Add validation
    validateNewFeature: (value: string) => {
        // Add validation logic
    },
};
```

2. Update the UI to include new fields:

```typescript
<div>
    <label>New Feature</label>
    <input
        type="text"
        value={newFeature}
        onChange={(e) => setNewFeature(e.target.value)}
    />
</div>
```

### Customizing the UI

#### 1. Adding New UI Components

The application uses Shadcn UI components. To add a new component:

1. Install the component:

```bash
npx shadcn-ui@latest add component-name
```

2. Import and use in your component:

```typescript
import { ComponentName } from "@/components/ui/component-name";

export function YourComponent() {
    return <ComponentName>{/* Your content */}</ComponentName>;
}
```

#### 2. Customizing Styles

The application uses Tailwind CSS. To add custom styles:

1. Add to `tailwind.config.js`:

```javascript
module.exports = {
    theme: {
        extend: {
            colors: {
                "custom-color": "#your-color",
            },
        },
    },
};
```

2. Use in your components:

```typescript
<div className="bg-custom-color text-white">{/* Your content */}</div>
```

## Implementation Details

### State Management Architecture

The application uses a combination of React hooks and context for state management:

```typescript
// Example of a custom hook for coin management
export function useCoinManagement() {
    const [coins, setCoins] = useState<Coin[]>([]);
    const { address } = useAccount();

    const fetchCoins = useCallback(async () => {
        // Implementation
    }, [address]);

    return {
        coins,
        fetchCoins,
    };
}
```

### Error Handling Strategy

The application implements a comprehensive error handling strategy:

```typescript
// Example of error handling in coin creation
const handleCreateCoin = async () => {
    try {
        // Implementation
    } catch (error) {
        if (error instanceof Error) {
            setError(error.message);
        } else if (typeof error === "string") {
            setError(error);
        } else {
            setError("An unknown error occurred");
        }
    }
};
```

### Performance Optimization

The application includes several performance optimizations:

1. **Memoization**:

```typescript
const memoizedComponent = useMemo(
    () => <ExpensiveComponent data={data} />,
    [data]
);
```

2. **Debouncing**:

```typescript
const debouncedSearch = useDebounce(searchTerm, 300);
```

3. **Lazy Loading**:

```typescript
const LazyComponent = dynamic(() => import("./LazyComponent"), {
    loading: () => <LoadingSpinner />,
});
```

## Testing Guide

### Setting Up Tests

1. Install testing dependencies:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

2. Create a test file:

```typescript
// __tests__/CreateZoraCoin.test.tsx
import { render, screen } from "@testing-library/react";
import { CreateZoraCoin } from "../app/components/CreateZoraCoin";

describe("CreateZoraCoin", () => {
    it("renders the form correctly", () => {
        render(<CreateZoraCoin />);
        expect(screen.getByLabelText("Coin Name")).toBeInTheDocument();
    });
});
```

### Writing Tests

1. **Component Tests**:

```typescript
test("handles form submission", async () => {
    render(<CreateZoraCoin />);
    const submitButton = screen.getByRole("button", { name: /create/i });
    fireEvent.click(submitButton);
    expect(await screen.findByText(/processing/i)).toBeInTheDocument();
});
```

2. **Hook Tests**:

```typescript
test("useCoinManagement hook", () => {
    const { result } = renderHook(() => useCoinManagement());
    expect(result.current.coins).toEqual([]);
});
```

## Debugging Guide

### Common Debugging Scenarios

1. **Transaction Debugging**:

```typescript
// Add to your component
useEffect(() => {
    console.log("Transaction state:", {
        hash,
        isPending,
        isSuccess,
        error,
    });
}, [hash, isPending, isSuccess, error]);
```

2. **Network Debugging**:

```typescript
// Add to wagmi config
const config = createConfig({
    // ... other config
    logger: {
        warn: (message) => console.warn(message),
        error: (message) => console.error(message),
    },
});
```

### Performance Profiling

1. **React Profiler**:

```typescript
import { Profiler } from "react";

<Profiler id="CreateZoraCoin" onRender={(...args) => console.log(args)}>
    <CreateZoraCoin />
</Profiler>;
```

2. **Network Profiling**:

```typescript
// Add to your API calls
const startTime = performance.now();
await fetchCoins();
const endTime = performance.now();
console.log(`API call took ${endTime - startTime}ms`);
```

## Debug Mode

The application includes a debug mode that can be toggled on/off. By default, debug mode is enabled. This feature is particularly useful during development and testing, as it provides detailed insights into the application's behavior, transaction states, and network interactions. The debug mode helps developers understand the flow of data and identify potential issues in the application.

### Toggling Debug Mode

Debug mode can be controlled in two ways, providing flexibility for both end users and developers:

1. **UI Toggle**: Click the debug button in the header (🔍 Debug On/Debug Off)
2. **Programmatic Control**: Use the `useDebug` hook in your components:

```tsx
import { useDebug } from "../contexts/DebugContext";

function YourComponent() {
    const { isDebug, toggleDebug } = useDebug();

    // Toggle debug mode
    toggleDebug();

    // Check debug status
    if (isDebug) {
        // Show debug information
    }
}
```

The UI toggle provides a quick way for users to access debug information, while the programmatic control allows developers to integrate debug functionality into their components and tests.

### Default Debug State

The debug mode is enabled by default to help developers catch issues early in the development process. However, you can change this default behavior by modifying the `DebugProvider` in `app/contexts/DebugContext.tsx`:

```tsx
export function DebugProvider({ children }: { children: ReactNode }) {
    // Change the initial state to false to disable debug by default
    const [isDebug, setIsDebug] = useState(false);
    // ... rest of the provider
}
```

This configuration is particularly useful when deploying to production, where you might want to disable debug mode by default to improve performance and reduce unnecessary logging.

### Debug Information

When debug mode is enabled, the application provides comprehensive debugging information that helps in understanding and troubleshooting various aspects of the application:

-   **Transaction details**: Shows the complete lifecycle of transactions, from initiation to confirmation
-   **Contract interactions**: Displays all contract calls and their responses
-   **Network requests**: Logs all API calls and their responses
-   **State changes**: Tracks changes in application state
-   **Error traces**: Provides detailed error information with stack traces

This information is invaluable for:

-   Debugging transaction failures
-   Understanding application flow
-   Optimizing performance
-   Identifying network issues
-   Tracking state management problems

### Using Debug Information

The debug information can be accessed and displayed in your components using the `useDebug` hook:

```tsx
function YourComponent() {
    const { isDebug } = useDebug();

    return (
        <div>
            {isDebug && (
                <div className="debug-panel">
                    {/* Debug information */}
                    <pre>{JSON.stringify(debugData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
```

The debug panel provides a structured view of the debug information, making it easier to analyze and understand the application's behavior. The information is formatted in a readable way and can be used to:

-   Monitor transaction progress
-   Verify contract interactions
-   Check network requests
-   Validate state changes
-   Debug error conditions

## Contributing Guidelines

### Code Review Process

1. **Pre-commit Checks**:

```bash
# Add to package.json
"pre-commit": "npm run lint && npm run test"
```

2. **Pull Request Template**:

```markdown
## Description

[Describe your changes]

## Testing

-   [ ] Tested on multiple chains
-   [ ] Added new tests
-   [ ] Updated documentation

## Screenshots

[Add screenshots if applicable]
```

### Documentation Standards

1. **Component Documentation**:

```typescript
/**
 * CreateZoraCoin Component
 *
 * @component
 * @example
 * <CreateZoraCoin />
 *
 * @prop {string} name - Coin name
 * @prop {string} symbol - Coin symbol
 * @returns {JSX.Element} CreateZoraCoin component
 */
```

2. **Function Documentation**:

```typescript
/**
 * Creates a new Zora coin
 *
 * @async
 * @function createCoin
 * @param {CoinParams} params - Coin creation parameters
 * @returns {Promise<TransactionReceipt>} Transaction receipt
 * @throws {Error} If coin creation fails
 */
```

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

## Components and Hooks

### Core Components

#### 1. CreateZoraCoin

The main component for creating new Zora coins. It manages the coin creation process and transaction states.

```tsx
// Usage
<CreateZoraCoin />;

// Props
interface CreateZoraCoinProps {
    onSuccess?: (hash: `0x${string}`) => void; // Optional callback after successful creation
}
```

#### 2. CoinForm

A reusable form component for coin creation with validation and error handling.

```tsx
// Usage
<CoinForm onSuccess={handleSuccess} />

// Props
interface CoinFormProps {
    onSuccess?: (hash: `0x${string}`) => void;
}

// Form Fields
- name: string
- symbol: string
- initialSupply: string
```

#### 3. TokenDetails

Displays token information including name, symbol, and total supply.

```tsx
// Usage
<TokenDetails contractAddress="0x..." />;

// Props
interface TokenDetailsProps {
    contractAddress: `0x${string}`;
}
```

#### 4. ChainSelector

A dropdown component for selecting different chains with visual indicators.

```tsx
// Usage
<ChainSelector />

// Features
- Visual chain indicators
- Chain switching
- Network validation
```

#### 5. RecentCoins

Displays a list of recently created coins with detailed information.

```tsx
// Usage
<RecentCoins />

// Features
- Pagination
- Chain filtering
- Real-time updates
```

#### 6. GetCoins

Displays a list of coins with different view types and detailed information.

```tsx
// Usage
<GetCoins count={10} initialType="topVolume" />

// Props
interface GetCoinsProps {
    count?: number;          // Number of coins to display (default: 10)
    after?: string;          // Pagination cursor
    initialType?: ExploreQueryType;  // Initial view type (default: 'new')
}

// View Types
type ExploreQueryType =
    | 'new'                 // Most recently created coins
    | 'topGainers'          // Coins with highest 24h gains
    | 'topVolume'           // Coins with highest 24h volume
    | 'mostValuable'        // Coins with highest market cap
    | 'lastTraded'          // Most recently traded coins
    | 'lastTradedUnique';   // Most recently traded by unique traders

// Features
- Dynamic view type selection
- Pagination support
- Loading states
- Error handling
- Network validation
- Detailed coin information:
  - Name and symbol
  - Creation date
  - Creator address
  - Contract address
  - Market cap
  - 24h volume
  - Number of holders
  - 24h price change
- Explorer links
- Responsive design
```

### Custom Hooks

#### 1. useCoinCreation

Manages the coin creation process and transaction states.

```tsx
// Usage
const {
    write,
    isLoading,
    error,
    transactionHash,
    status,
    resetTransaction,
} = useCoinCreation({
    name: string,
    symbol: string,
    initialSupply: bigint,
    address: `0x${string}`,
});

// Return Values
- write: () => void // Function to initiate coin creation
- isLoading: boolean // Loading state
- error: Error | null // Error state
- transactionHash: `0x${string}` | null // Transaction hash
- status: string // Transaction status
- resetTransaction: () => void // Reset transaction state
```

#### 2. useTokenDetails

Fetches and manages token information.

```tsx
// Usage
const {
    tokenName,
    tokenSymbol,
    tokenSupply,
    refetchAll,
} = useTokenDetails({
    contractAddress: `0x${string}`,
});

// Return Values
- tokenName: string | null
- tokenSymbol: string | null
- tokenSupply: bigint | null
- refetchAll: () => void // Refresh all token data
```

#### 3. useRetry

Implements retry logic with exponential backoff.

```tsx
// Usage
const response = await useRetry(() => getCoinsNew({ count: 10 }));

// Features
- Exponential backoff
- Maximum retry attempts
- Error handling
```

### UI Components

#### 1. Card

A reusable card component for consistent layout.

```tsx
// Usage
<Card>
    <CardHeader>
        <CardTitle>Title</CardTitle>
    </CardHeader>
    <CardContent>
        {/* Content */}
    </CardContent>
</Card>

// Components
- Card: Main container
- CardHeader: Header section
- CardTitle: Title text
- CardContent: Main content area
- CardFooter: Footer section
```

#### 2. Button

A customizable button component.

```tsx
// Usage
<Button variant="default" size="lg">
    Click me
</Button>;

// Props
interface ButtonProps {
    variant?: "default" | "outline" | "ghost";
    size?: "default" | "sm" | "lg";
    disabled?: boolean;
}
```

#### 3. Input

A styled input component with validation.

```tsx
// Usage
<Input
    type="text"
    placeholder="Enter value"
    value={value}
    onChange={handleChange}
/>;

// Props
interface InputProps {
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
```

### Component Integration

#### Example: Creating a New Coin

```tsx
function CreateCoinPage() {
    const { address } = useAccount();
    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [initialSupply, setInitialSupply] = useState("");

    const { write, isLoading, error, transactionHash } = useCoinCreation({
        name,
        symbol,
        initialSupply: BigInt(initialSupply || "0"),
        address: address || "0x0000000000000000000000000000000000000000",
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Coin</CardTitle>
            </CardHeader>
            <CardContent>
                <CoinForm
                    onSuccess={() => {
                        // Handle success
                    }}
                />
            </CardContent>
        </Card>
    );
}
```

#### Example: Viewing Token Details

```tsx
function TokenPage({ contractAddress }: { contractAddress: `0x${string}` }) {
    const { tokenName, tokenSymbol, tokenSupply, refetchAll } = useTokenDetails(
        { contractAddress }
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Token Details</CardTitle>
            </CardHeader>
            <CardContent>
                <TokenDetails contractAddress={contractAddress} />
            </CardContent>
        </Card>
    );
}
```
