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

#### Queries

```
{
  callers(first: 5, orderBy: blockTimestamp, orderDirection: desc) {
    id
    coinsCreated {
      id
      blockNumber
      blockTimestamp
      coin
      currency
      name
      payoutRecipient
      platformReferrer
      pool
      symbol
      transactionHash
      uri
      version
    }
    blockNumber
    blockTimestamp
    transactionHash
  }
}
```

## Subgraph Explorer Page

### Overview

The web application now includes a **Subgraph Explorer** page, accessible from the main navigation. This page allows you to query and explore data from your deployed subgraph on The Graph's decentralized network.

- **Purpose:**
    - Query and visualize data indexed by your subgraph.
    - Useful for debugging, analytics, and exploring on-chain data indexed by your deployment.
- **Location:**
    - Accessible at `/subgraph-explorer` in the web app.
    - Linked in the main navigation as "Subgraph Explorer".

### Usage

1. **API Key Requirement**

    - To query The Graph's decentralized gateway, you must provide an API key.
    - Add the following to your `.env` file in `apps/web/`:
        ```
        NEXT_PUBLIC_GRAPH_API_KEY=your_api_key_here
        ```
    - You can obtain an API key from The Graph's dashboard.
    - **Restart your dev server** after editing the `.env` file.

2. **Subgraph Endpoint**

    - The explorer page is configured to use the decentralized gateway endpoint:
        ```
        https://gateway.thegraph.com/api/subgraphs/id/HmU5oZZCHNxv7h79G6zJjkUN916uQPXamcMrCTg9YNm6
        ```
    - This endpoint requires a valid API key in the `Authorization` header.

3. **Deployed Subgraph**

    - The subgraph is deployed and published here:
      [Zora Coins Factory Base Mainnet Subgraph on The Graph Explorer](https://thegraph.com/explorer/subgraphs/HmU5oZZCHNxv7h79G6zJjkUN916uQPXamcMrCTg9YNm6?view=Query&chain=arbitrum-one)
    - You can view its status, schema, and try queries directly in The Graph Explorer UI.

4. **Query Example**
    - The explorer page runs a sample query to fetch recent `coinCreateds` and `callers`:
        ```graphql
        {
            coinCreateds(first: 5) {
                id
                caller {
                    id
                }
                payoutRecipient
                platformReferrer
            }
            callers(first: 5) {
                id
                coinsCreated {
                    id
                }
                blockNumber
                blockTimestamp
            }
        }
        ```
    - You can customize this query in the code or extend the UI for custom queries.

### UI Improvements

The Subgraph Explorer page features a user-friendly and visually clear interface:

- The endpoint selector is presented in a styled card layout with clear labels.
- The currently selected endpoint URL is shown in a monospace, copyable code block for easy reference.
- The query response is displayed in a scrollable, syntax-highlighted code block with improved contrast and padding for readability.
- Error messages and loading states are visually distinct and easy to spot.
- The main explorer area is separated with a subtle background and border for clarity.

These improvements make it much easier to read, use, and debug queries within the explorer.

### Troubleshooting

- If you see errors about a missing or malformed API key, ensure your `.env` file is correct and the server has been restarted.
- If you see `subgraph not found: no allocations`, your subgraph may still be indexing or awaiting allocation on the decentralized network. Check the status in The Graph Explorer.

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
