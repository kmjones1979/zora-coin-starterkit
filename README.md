# Zora Coin Starter Kit

A comprehensive starter kit for building applications with Zora Protocol's Coin Factory, featuring a Next.js web application and a Subgraph for on-chain data indexing.

## Project Structure

```
zora-coin-starterkit/
├── apps/
│   └── web/                    # Next.js web application
│       ├── app/
│       │   ├── components/     # Reusable UI components
│       │   │   ├── ui/         # Shadcn UI components
│       │   │   └── ...         # Custom components
│       │   ├── config/         # Configuration files
│       │   ├── contexts/       # React contexts
│       │   ├── hooks/          # Custom React hooks
│       │   ├── lib/            # Utility functions
│       │   └── ...             # Next.js app files
│       └── public/             # Static assets
└── packages/
    └── subgraph/              # The Graph subgraph
        ├── src/               # Subgraph source code
        ├── schema.graphql     # GraphQL schema
        └── subgraph.yaml      # Subgraph configuration
```

## Features

### Web Application (`apps/web`)

#### Components

- **UI Components** (`app/components/ui/`)
    - `button.tsx`: Customizable button component with variants
    - `card.tsx`: Card component for content display
    - `checkbox.tsx`: Checkbox input component
    - `dropdown-menu.tsx`: Dropdown menu with keyboard navigation
    - `input.tsx`: Form input component
    - `label.tsx`: Form label component
    - `select.tsx`: Select dropdown component

#### Configuration

- **Chain Configuration** (`app/config/chains.ts`)

    ```typescript
    export const CHAINS = {
        base: {
            id: 8453,
            name: "Base",
            // ... other chain configurations
        },
    };
    ```

- **Contract ABIs** (`app/config/abis.ts`)
    ```typescript
    export const COIN_FACTORY_ABI = [
        // ... ABI definitions
    ];
    ```

#### Hooks

- **useCoinCreation** (`app/hooks/useCoinCreation.ts`)

    ```typescript
    const { createCoin, isLoading, error } = useCoinCreation({
        name: "My Coin",
        symbol: "MC",
        // ... other parameters
    });
    ```

- **useTokenDetails** (`app/hooks/useTokenDetails.ts`)
    ```typescript
    const { tokenDetails, loading } = useTokenDetails(tokenAddress);
    ```

#### Contexts

- **Theme Context** (`app/contexts/ThemeContext.tsx`)

    ```typescript
    const { theme, setTheme } = useTheme();
    ```

- **Debug Context** (`app/contexts/DebugContext.tsx`)
    ```typescript
    const { isDebug, setIsDebug } = useDebug();
    ```

### Subgraph (`packages/subgraph`)

The subgraph indexes on-chain data from the Zora Protocol's Coin Factory, providing efficient querying of coin data.

#### Schema

```graphql
type Coin @entity {
    id: ID!
    name: String!
    symbol: String!
    uri: String!
    owner: Bytes!
    createdAt: BigInt!
    # ... other fields
}
```

#### Mappings

```typescript
export function handleCoinCreated(event: CoinCreated): void {
    let coin = new Coin(event.params.coin.toHexString());
    coin.name = event.params.name;
    coin.symbol = event.params.symbol;
    // ... other mappings
}
```

## Implementation Guide

### Setting Up the Web Application

1. **Install Dependencies**

    ```bash
    cd apps/web
    npm install
    ```

2. **Configure Environment Variables**
   Create a `.env.local` file:

    ```
    NEXT_PUBLIC_CHAIN_ID=8453
    NEXT_PUBLIC_RPC_URL=https://mainnet.base.org
    ```

3. **Implement Coin Creation**

    ```typescript
    import { useCoinCreation } from '@/hooks/useCoinCreation';

    function CreateCoinForm() {
      const { createCoin, isLoading } = useCoinCreation({
        name: "My Coin",
        symbol: "MC",
        uri: "ipfs://...",
        // ... other parameters
      });

      return (
        <Button onClick={() => createCoin()}>
          {isLoading ? "Creating..." : "Create Coin"}
        </Button>
      );
    }
    ```

4. **Add Theme Support**

    ```typescript
    import { ThemeProvider } from '@/contexts/ThemeContext';

    export default function RootLayout({ children }) {
      return (
        <ThemeProvider>
          {children}
        </ThemeProvider>
      );
    }
    ```

### Setting Up the Subgraph

1. **Install Dependencies**

    ```bash
    cd packages/subgraph
    npm install
    ```

2. **Configure Subgraph**
   Update `subgraph.yaml` with your contract addresses and network settings.

3. **Generate Types**

    ```bash
    npm run codegen
    ```

4. **Build and Deploy**
    ```bash
    npm run build
    npm run deploy
    ```

## Development

### Running the Web Application

```bash
cd apps/web
npm run dev
```

### Running the Subgraph

```bash
cd packages/subgraph
npm run create-local
npm run deploy-local
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
