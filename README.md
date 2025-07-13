# Zora Coin Starter Kit

A comprehensive starter kit for building applications with Zora Protocol's Coin Factory, featuring a Next.js web application with AI-powered chat functionality and a Subgraph for on-chain data indexing.

## 🚀 Key Features

- **AI-Powered Chat Interface**: Interactive AI assistant powered by GPT-4 with blockchain-specific tools
- **Zora Coin Creation**: Seamless coin creation through chat commands or UI
- **IPFS Metadata Upload**: Real-time metadata upload to IPFS via Pinata with validation
- **Smart Contract Interaction**: Direct contract calls through AI agent
- **Subgraph Integration**: On-chain data indexing and querying capabilities
- **Multi-Chain Support**: Base and Base Sepolia networks
- **Authentication**: Wallet-based authentication with SIWE (Sign-In with Ethereum)
- **Modern UI**: Built with Next.js 15, React 19, TailwindCSS, and Radix UI

## Project Structure

```
zora-coin-starterkit/
├── apps/
│   └── web/                    # Next.js web application
│       ├── app/
│       │   ├── api/
│       │   │   └── chat/       # AI Chat API endpoints
│       │   ├── chat/           # Chat interface pages
│       │   │   ├── page.tsx    # Main chat interface
│       │   │   ├── _config/    # Chat configuration
│       │   │   ├── _hooks/     # Chat-specific hooks
│       │   │   ├── _types/     # TypeScript types
│       │   │   └── _utils/     # Chat utilities
│       │   ├── components/
│       │   │   ├── chat/       # Chat UI components
│       │   │   └── ui/         # Shadcn UI components
│       │   ├── subgraph-explorer/ # Subgraph query interface
│       │   ├── utils/
│       │   │   └── chat/
│       │   │       ├── tools.ts          # AI tool configuration
│       │   │       └── agentkit/         # AgentKit integration
│       │   │           ├── action-providers/ # Custom AI action providers
│       │   │           └── framework-extensions/ # AI SDK integration
│       │   ├── config/         # App configuration
│       │   ├── contexts/       # React contexts
│       │   ├── hooks/          # Custom React hooks
│       │   └── lib/            # Utility functions
│       └── public/             # Static assets
└── packages/
    └── subgraph/              # The Graph subgraph
        ├── src/               # Subgraph source code
        ├── schema.graphql     # GraphQL schema
        └── subgraph.yaml      # Subgraph configuration
```

## 🤖 AI Chat Interface

### Overview

The AI Chat Interface is a conversational AI assistant that can interact with Web3 protocols, create Zora coins, query subgraphs, and perform various blockchain operations through natural language commands.

### Key Features

- **GPT-4 Powered**: Uses OpenAI's GPT-4 Turbo for intelligent responses
- **Blockchain-Aware**: Understands Web3 concepts and can execute blockchain operations
- **Multi-Tool Support**: Integrates multiple action providers for diverse functionality
- **Real-time Interaction**: Streaming responses with tool execution visualization
- **Wallet Integration**: Requires wallet connection and SIWE authentication

### Chat Implementation

#### Main Chat Interface (`apps/web/app/chat/page.tsx`)

```typescript
import { useChat } from "@ai-sdk/react";
import { useAccount, useChainId } from "wagmi";
import { useSession } from "next-auth/react";

export default function Chat() {
    const { address, isConnected } = useAccount();
    const { data: session } = useSession();
    const chainId = useChainId();

    const {
        messages,
        input,
        handleInputChange,
        handleSubmit: originalHandleSubmit,
        status,
        stop,
    } = useChat({
        maxSteps: 10,
        body: { chainId },
    });

    // Authentication check
    const handleSubmit = (e, options) => {
        e.preventDefault();
        if (!session) {
            alert("Please connect your wallet and sign in to use the chat.");
            return;
        }
        originalHandleSubmit(e, options);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Chat interface with authentication checks */}
            {renderAuthStatus()}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div key={message.id}>
                        {/* Message rendering with tool call visualization */}
                        {message.role === "assistant" && message.toolInvocations && (
                            <MessageToolCalls
                                toolParts={message.toolInvocations}
                                messageId={message.id}
                            />
                        )}
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                ))}
            </div>
            <ChatInput
                input={input}
                status={status}
                onSubmit={handleSubmit}
                onChange={handleInputChange}
            />
        </div>
    );
}
```

#### Chat API Route (`apps/web/app/api/chat/route.ts`)

```typescript
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getTools, createAgentKit } from "../../utils/chat/tools";

export async function POST(req: Request) {
    const session = await getServerSession(siweAuthOptions());
    const userAddress = session?.user?.address;

    if (!userAddress) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { messages, chainId } = await req.json();
    const selectedChainId = chainId || baseSepolia.id;
    const selectedChain = CHAINS[selectedChainId];

    // Create AgentKit instance with wallet and action providers
    const { agentKit } = await createAgentKit(selectedChainId);

    const prompt = `
    You are a helpful Web3 assistant operating on ${selectedChain.name}.
    Available tools:
    - 'createZoraCoin': Create new Zora ERC1155 coins
    - 'getTokenDetails': Fetch token information
    - 'querySubgraph': Query The Graph subgraphs
    - 'read-contract'/'write-contract': Smart contract interactions
    - Wallet actions and token API operations
    
    Current user address: ${userAddress}
    Current chain: ${selectedChain.name} (${selectedChainId})
    `;

    const result = await streamText({
        model: openai("gpt-4-turbo-preview"),
        system: prompt,
        messages,
        tools: getTools(agentKit),
    });

    return result.toDataStreamResponse();
}
```

### Available AI Tools

#### 1. Zora Coin Creator (`ZoraCoinCreatorProvider.ts`)

Creates new Zora coins through natural language commands.

```typescript
// Example usage in chat:
// "Create a coin called 'My Token' with symbol 'MTK' using this metadata URI: ipfs://..."

const coinParams = {
    chainId: 8453, // Base mainnet
    name: "My Awesome Coin",
    symbol: "MAC",
    uri: "ipfs://QmYourMetadataHash",
    payoutRecipient: "0x...",
    initialPurchaseEth: "0.01", // Optional initial purchase
};
```

**Key Features:**

- Automatic unique naming with timestamps
- Proper parameter validation
- Support for initial purchases
- Integration with Zora SDK's `createCoinCall`

#### 2. Token Details Provider (`TokenDetailsProvider.ts`)

Fetches token information from any ERC20/ERC1155 contract.

```typescript
// Example usage:
// "Get details for token at address 0x..."

const tokenDetails = await getTokenDetails({
    chainId: 8453,
    contractAddress: "0x...",
});
// Returns: { name, symbol, totalSupply, decimals }
```

#### 3. Contract Interactor (`contract-interactor.ts`)

Enables read/write operations on smart contracts.

```typescript
// Example configuration:
const deployedContracts = {
    8453: {  // Base mainnet
        ZoraFactory: {
            address: "0x777777751622c0d3258f214F9DF38E35BF45baF3",
            abi: [...], // Full ZoraFactory ABI
        },
    },
    84532: { // Base Sepolia
        ZoraFactory: {
            address: "0x777777751622c0d3258f214F9DF38E35BF45baF3",
            abi: [...],
        },
    },
};
```

#### 4. Graph Querier (`graph-querier.ts`)

Queries The Graph subgraphs with GraphQL.

```typescript
// Example usage:
// "Query the subgraph for recent coin creations"

const SUBGRAPH_ENDPOINTS = {
    UNISWAP_V3: () =>
        `https://gateway.thegraph.com/api/${apiKey}/subgraphs/id/${id}`,
    AAVE_V3: () =>
        `https://gateway.thegraph.com/api/${apiKey}/subgraphs/id/${id}`,
};

await querySubgraph({
    endpoint: SUBGRAPH_ENDPOINTS.UNISWAP_V3(),
    query: `
        query {
            coinCreateds(first: 5) {
                id
                name
                symbol
                coin
                caller {
                    id
                }
            }
        }
    `,
});
```

#### 5. Token API Provider (`token-api-provider.ts`)

Provides comprehensive token data including prices, balances, and market information.

### AgentKit Integration

The chat system uses Coinbase's AgentKit framework for blockchain interactions:

```typescript
// tools.ts - AgentKit setup
export async function createAgentKit(chainId?: number) {
    const selectedChain = CHAINS[chainId || baseSepolia.id];

    const walletClient = createWalletClient({
        account: privateKeyToAccount(process.env.AGENT_PRIVATE_KEY),
        chain: selectedChain,
        transport: http(selectedChain.rpc),
    });

    const viemWalletProvider = new ViemWalletProvider(walletClient);

    const agentKit = await AgentKit.from({
        walletProvider: viemWalletProvider,
        actionProviders: [
            walletActionProvider(),
            contractInteractor(chainId),
            graphQuerierProvider(),
            tokenApiProvider(),
            zoraCoinCreatorProvider(),
            tokenDetailsProvider(),
        ],
    });

    return { agentKit, address: walletClient.account.address };
}

// Convert AgentKit actions to AI SDK tools
export function getTools(agentKit: AgentKit) {
    return agentKitToTools(agentKit);
}
```

### Authentication & Security

The chat requires proper authentication:

1. **Wallet Connection**: Users must connect via RainbowKit
2. **SIWE Authentication**: Sign-In with Ethereum for session management
3. **Chain Validation**: Ensures user is on supported networks
4. **Private Key Management**: Agent operations use secure environment variables

```typescript
// Authentication check in chat interface
const renderAuthStatus = () => {
    if (!isConnected) {
        return <div>Please connect your wallet to use the chat.</div>;
    }
    if (!session) {
        return <div>Please sign in to authenticate and use the chat.</div>;
    }
    if (!currentChain) {
        return <div>Please switch to a supported chain.</div>;
    }
    return null;
};
```

## 📁 IPFS Metadata Upload

### Overview

The application features a comprehensive IPFS metadata upload system that allows users to create and upload token metadata directly through the coin creation form, powered by Pinata's IPFS service.

### Key Features

- **Real IPFS Uploads**: Uses Pinata API for actual IPFS storage (no mock implementations)
- **Dual Input Methods**: Upload existing JSON files or create metadata inline
- **Validation & Waiting**: Ensures IPFS data is available before proceeding
- **Progress Feedback**: Real-time upload status and progress indicators
- **Example Files**: Downloadable example metadata template

### Implementation

#### API Route (`apps/web/app/api/upload-metadata/route.ts`)

```typescript
export async function POST(request: NextRequest) {
    const metadata = await request.json();

    // Validate metadata structure
    if (!metadata?.name || typeof metadata.name !== "string") {
        return NextResponse.json(
            { error: 'Metadata must have a "name" field as a string' },
            { status: 400 }
        );
    }

    // Upload to Pinata
    const response = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${PINATA_JWT}`, // or use API key + secret
            },
            body: JSON.stringify({
                pinataContent: metadata,
                pinataMetadata: {
                    name: `${metadata.name.replace(/[^a-zA-Z0-9]/g, "_")}_metadata.json`,
                    keyvalues: {
                        tokenName: metadata.name,
                        uploadedAt: new Date().toISOString(),
                        source: "zora-coin-creator",
                    },
                },
            }),
        }
    );

    const result = await response.json();
    const ipfsHash = result.IpfsHash;

    // Wait for IPFS data availability (up to 30 seconds)
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    let isAvailable = false;
    let attempts = 0;
    const maxAttempts = 30;

    while (!isAvailable && attempts < maxAttempts) {
        try {
            const verifyResponse = await fetch(ipfsUrl, { method: "HEAD" });
            if (verifyResponse.ok) {
                isAvailable = true;
            } else {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                attempts++;
            }
        } catch (error) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            attempts++;
        }
    }

    return NextResponse.json({
        success: true,
        ipfsHash: `ipfs://${ipfsHash}`,
        ipfsUrl: ipfsUrl,
        isAvailable,
    });
}
```

#### Coin Creation Form Integration

The `CoinForm` component includes comprehensive metadata upload functionality:

```typescript
const uploadToIPFS = async (metadata: TokenMetadata): Promise<string> => {
    setUploadProgress("Uploading to IPFS...");

    const response = await fetch("/api/upload-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metadata),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload to IPFS");
    }

    const data = await response.json();

    if (!data.isAvailable) {
        setUploadProgress("Upload successful! Waiting for IPFS propagation...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    return data.ipfsHash;
};
```

### Metadata Structure

The system supports standard NFT metadata format:

```json
{
    "name": "My Token",
    "description": "A description of my token",
    "image": "ipfs://QmImageHash",
    "attributes": [
        {
            "trait_type": "Category",
            "value": "Cryptocurrency"
        },
        {
            "trait_type": "Supply",
            "value": "1000000000"
        }
    ],
    "external_url": "https://mytoken.com"
}
```

### Usage Examples

1. **File Upload**: Users can upload existing JSON metadata files
2. **Inline Creation**: Create metadata using form fields directly in the UI
3. **Download Example**: Get a template file to start with proper structure
4. **Preview**: See formatted metadata before uploading

### Error Handling

The system includes comprehensive error handling:

- **Validation**: Ensures required fields are present
- **Network Errors**: Handles Pinata API failures gracefully
- **IPFS Propagation**: Waits for data availability before proceeding
- **User Feedback**: Clear error messages and progress indicators

### Configuration

Set up your Pinata credentials in `.env.local`:

```bash
# Option A: JWT Token (recommended)
PINATA_JWT=your-jwt-token-here

# Option B: API Key + Secret (legacy)
PINATA_API_KEY=your-api-key-here
PINATA_API_SECRET=your-api-secret-here
```

This eliminates the "Metadata is not a valid JSON" errors by ensuring real IPFS uploads that the Zora SDK can validate and use for coin creation.

## 🗄️ Enhanced Subgraph

### Overview

The subgraph indexes Zora Factory events and coin data on Base mainnet, providing efficient GraphQL queries for on-chain data.

### Schema Updates

Enhanced schema with comprehensive entity relationships:

```graphql
# packages/subgraph/schema.graphql

type CoinCreated @entity(immutable: true) {
    id: Bytes!
    caller: Caller!
    payoutRecipient: Bytes! # address
    platformReferrer: Bytes! # address
    currency: Bytes! @index # address
    uri: String! # metadata URI
    name: String! # coin name
    symbol: String! # coin symbol
    coin: Bytes! # coin contract address
    pool: Bytes! # liquidity pool address
    version: String! # factory version
    blockNumber: BigInt!
    blockTimestamp: BigInt!
    transactionHash: Bytes!
}

type Caller @entity(immutable: true) {
    id: Bytes!
    coinsCreated: [CoinCreated!]! @derivedFrom(field: "caller")
    blockNumber: BigInt!
    blockTimestamp: BigInt!
    transactionHash: Bytes!
}

# Timeseries for analytics
type CoinCreationEvent @entity(timeseries: true) {
    id: Int8!
    timestamp: Timestamp!
    coin: Bytes!
    caller: Bytes!
    currency: Bytes!
}

# Individual coin transfer events
type Transfer @entity(immutable: true) {
    id: Bytes!
    from: Bytes!
    to: Bytes!
    value: BigInt!
    contract: Bytes! # coin contract address
    blockNumber: BigInt!
    blockTimestamp: BigInt!
    transactionHash: Bytes!
}
```

### Event Handlers

```typescript
// packages/subgraph/src/zora-factory-impl.ts

export function handleCoinCreated(event: CoinCreatedEvent): void {
    // Create or load caller entity
    let caller = Caller.load(event.params.caller);
    if (caller === null) {
        caller = new Caller(event.params.caller);
        caller.blockNumber = event.block.number;
        caller.blockTimestamp = event.block.timestamp;
        caller.transactionHash = event.transaction.hash;
        caller.save();
    }

    // Create coin creation entity
    let entity = new CoinCreated(
        event.transaction.hash.concatI32(event.logIndex.toI32())
    );
    entity.caller = caller.id;
    entity.payoutRecipient = event.params.payoutRecipient;
    entity.platformReferrer = event.params.platformReferrer;
    entity.currency = event.params.currency;
    entity.uri = event.params.uri;
    entity.name = event.params.name;
    entity.symbol = event.params.symbol;
    entity.coin = event.params.coin;
    entity.pool = event.params.pool;
    entity.version = event.params.version;
    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;
    entity.save();

    // Create timeseries event for analytics
    let tsEvent = new CoinCreationEvent(0);
    tsEvent.coin = event.params.coin;
    tsEvent.caller = event.params.caller;
    tsEvent.currency = event.params.currency;
    tsEvent.save();

    // Create dynamic data source for coin contract
    ZoraCoin.create(event.params.coin);
}
```

### Dynamic Data Sources

The subgraph uses templates to index individual coin contracts:

```yaml
# packages/subgraph/subgraph.yaml
templates:
    - kind: ethereum/contract
      name: ZoraCoin
      network: base
      source:
          abi: ZoraCoin
      mapping:
          kind: ethereum/events
          apiVersion: 0.0.9
          language: wasm/assemblyscript
          entities:
              - Transfer
              - Approval
          eventHandlers:
              - event: Transfer(indexed address,indexed address,uint256)
                handler: handleTransfer
              - event: Approval(indexed address,indexed address,uint256)
                handler: handleApproval
          file: ./src/zora-coin.ts
```

### Example Queries

```graphql
# Get recent coin creations with creator info
{
    coinCreateds(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
        id
        name
        symbol
        coin
        uri
        caller {
            id
            coinsCreated {
                name
                symbol
            }
        }
        blockTimestamp
        transactionHash
    }
}

# Get coins by specific creator
{
    caller(id: "0x...") {
        id
        coinsCreated {
            name
            symbol
            coin
            pool
            blockTimestamp
        }
    }
}

# Get transfer events for a specific coin
{
    transfers(where: { contract: "0x..." }) {
        from
        to
        value
        blockTimestamp
        transactionHash
    }
}
```

## 🔍 Subgraph Explorer

### Overview

Interactive GraphQL playground for querying the deployed subgraph with syntax highlighting and real-time results.

### Features

- **Dual Endpoints**: Development (Studio) and Production (Gateway)
- **Syntax Highlighting**: GraphQL query editor with Prism.js
- **Real-time Results**: JSON response viewer with collapsible trees
- **API Key Support**: Automatic authorization for production gateway
- **Example Queries**: Pre-loaded default query for exploration

### Implementation

```typescript
// apps/web/app/subgraph-explorer/page.tsx

export default function SubgraphExplorer() {
    const [endpoint, setEndpoint] = useState("dev");
    const [queryText, setQueryText] = useState(DEFAULT_QUERY);

    const { data, error, isLoading } = useQuery({
        queryKey: ["subgraph-data", endpoint, submittedQuery],
        queryFn: async () => {
            const url = endpoint === "prod" ? PROD_URL : DEV_URL;
            const headers = endpoint === "prod"
                ? { Authorization: `Bearer ${process.env.NEXT_PUBLIC_GRAPH_API_KEY}` }
                : {};

            const result = await request(url, submittedQuery, {}, headers);
            return stringifyBigInts(result);
        },
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8 h-[500px]">
                {/* Query Editor */}
                <div className="flex-1">
                    <Editor
                        value={queryText}
                        onValueChange={setQueryText}
                        highlight={(code) =>
                            Prism.highlight(code, Prism.languages.graphql, "graphql")
                        }
                    />
                </div>

                {/* Response Viewer */}
                <div className="flex-1">
                    <ReactJson
                        src={data || {}}
                        theme="monokai"
                        collapsed={2}
                        enableClipboard={true}
                    />
                </div>
            </div>
        </div>
    );
}
```

### Endpoints

- **Development**: `https://api.studio.thegraph.com/query/57382/zora-coins-factory-base-mainnet/version/latest`
- **Production**: `https://gateway.thegraph.com/api/subgraphs/id/HmU5oZZCHNxv7h79G6zJjkUN916uQPXamcMrCTg9YNm6`

## 🛠️ Implementation Guide

### Prerequisites

```bash
# Required environment variables
NEXT_PUBLIC_ZORA_API_KEY=...      # Zora API key for coin queries (get from https://zora.co/settings/developer)
AGENT_PRIVATE_KEY=0x...           # Private key for AI agent wallet
GRAPH_API_KEY=your_api_key        # The Graph API key for production
NEXT_PUBLIC_GRAPH_API_KEY=...     # Public API key for client-side queries
NEXTAUTH_SECRET=your_secret       # NextAuth secret
NEXTAUTH_URL=http://localhost:3000

# Pinata API credentials (for IPFS metadata uploads)
PINATA_API_KEY=...                # Pinata API key
PINATA_API_SECRET=...             # Pinata API secret (or PINATA_API_SECRT if using legacy naming)
PINATA_JWT=...                    # Pinata JWT token (recommended for newer accounts)
```

### Installation

1. **Clone and Install**

```bash
git clone <repository>
cd zora-coin-starterkit
npm install
```

2. **Web Application Setup**

```bash
cd apps/web
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
```

3. **Zora API Key Setup** (Required for SDK v0.2.1+)

The Zora Coins SDK requires an API key to access coin data:

1. Visit [https://zora.co](https://zora.co) and connect your wallet
2. Navigate to [Developer Settings](https://zora.co/settings/developer)
3. Create a new API key for your application
4. Add it to your `.env.local` file:
    ```bash
    NEXT_PUBLIC_ZORA_API_KEY=your-actual-api-key-here
    ```
5. Restart your development server

6. **Pinata API Setup** (Required for IPFS metadata uploads)

The application uses Pinata for IPFS metadata uploads when creating coins:

1. Create a free account at [https://pinata.cloud](https://pinata.cloud)
2. Generate API credentials in your Pinata dashboard:
    - **Option A (Recommended)**: Create a JWT token with appropriate permissions
    - **Option B**: Use API Key + Secret (legacy method)
3. Add the credentials to your `.env.local` file:

    ```bash
    # Option A: JWT Token (recommended)
    PINATA_JWT=your-jwt-token-here

    # Option B: API Key + Secret (legacy)
    PINATA_API_KEY=your-api-key-here
    PINATA_API_SECRET=your-api-secret-here
    ```

4. Restart your development server

The metadata upload feature allows users to create JSON metadata files directly in the coin creation form, which are then uploaded to IPFS via Pinata before creating the coin.

6. **Subgraph Setup**

```bash
cd packages/subgraph
npm install
# Configure subgraph.yaml with your network settings
```

### Development

```bash
# Start web application
cd apps/web
npm run dev

# Deploy subgraph (first time)
cd packages/subgraph
npm run create-local    # For local development
npm run deploy-local

# Or deploy to hosted service
graph auth --product subgraph-studio
npm run deploy
```

### Environment Configuration

```bash
# apps/web/.env.local
NEXT_PUBLIC_ZORA_API_KEY=your-zora-api-key-here
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_RPC_URL=https://mainnet.base.org
AGENT_PRIVATE_KEY=0x...
GRAPH_API_KEY=...
NEXT_PUBLIC_GRAPH_API_KEY=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000

# Pinata IPFS service
PINATA_API_KEY=your-pinata-api-key
PINATA_API_SECRET=your-pinata-api-secret
PINATA_JWT=your-pinata-jwt-token
```

## 🎯 Usage Examples

### Creating Coins via Chat

```
User: "Create a coin called 'Holiday Spirit' with symbol 'HOLIDAY' using this metadata: ipfs://QmExampleHash and payout to 0x..."

AI: I'll create a Zora coin for you with those specifications.
[Tool execution: createZoraCoin]
✅ Successfully created coin "Holiday Spirit" (HOLIDAY123456)
Transaction: 0x...
Coin address: 0x...
```

### Querying Subgraph via Chat

```
User: "Show me the last 5 coins created on the platform"

AI: I'll query the subgraph for recent coin creations.
[Tool execution: querySubgraph]
Here are the 5 most recent coins:
1. "Winter Token" (WINTER) - Created by 0x...
2. "Summer Vibes" (SUMMER) - Created by 0x...
...
```

### Token Information

```
User: "Get details for token at 0x..."

AI: [Tool execution: getTokenDetails]
Token Details:
- Name: Example Token
- Symbol: EXT
- Total Supply: 1,000,000
- Decimals: 18
```

## 🔧 Troubleshooting

### Coins Showing "N/A" or "Unknown Chain"

This usually indicates a missing or invalid Zora API key:

1. **Check API Key**: Ensure `NEXT_PUBLIC_ZORA_API_KEY` is set in your `.env.local`
2. **Verify API Key**: Make sure your API key is valid and not expired
3. **Restart Server**: Restart your development server after adding the API key
4. **Check Console**: Look for API key initialization messages in browser console

Expected console message: `✅ Zora SDK initialized with API key successfully`

### Chain Connection Issues

- Ensure you're connected to a supported network (Base, Zora, Optimism, Arbitrum, Blast)
- Check that your wallet is properly connected via RainbowKit
- Verify the chain ID matches the expected values in the console logs

## 🏗️ Architecture

### Frontend Architecture

```
React App (Next.js 15)
├── Authentication (SIWE + NextAuth)
├── Chat Interface (AI SDK + AgentKit)
├── Subgraph Explorer (GraphQL + React Query)
└── Component Library (Radix UI + TailwindCSS)
```

### Backend Architecture

```
API Routes
├── /api/chat (Streaming AI responses)
└── /api/auth (SIWE authentication)

AgentKit Framework
├── Action Providers (Custom blockchain tools)
├── Wallet Provider (Viem + Private Key)
└── Tool Registry (AI SDK integration)
```

### Blockchain Integration

```
Blockchain Layer
├── Base Mainnet (8453)
├── Base Sepolia (84532)
└── Zora Factory Contract (0x777777751622c0d3258f214F9DF38E35BF45baF3)

Subgraph Layer
├── Event Indexing (CoinCreated, Transfer, Approval)
├── Entity Relationships (Caller -> CoinCreated)
└── GraphQL API (The Graph Protocol)
```

## 🔧 Advanced Configuration

### Custom Action Providers

Create custom AI tools by extending ActionProvider:

```typescript
class CustomProvider extends ActionProvider<EvmWalletProvider> {
    constructor() {
        super("custom-provider", []);
    }

    supportsNetwork = (network: Network): boolean => {
        return network.chainId === "8453";
    };

    @CreateAction({
        name: "customAction",
        description: "Performs custom blockchain operation",
        schema: z.object({
            param1: z.string(),
            param2: z.number(),
        }),
    })
    async customAction(
        walletProvider: EvmWalletProvider,
        args: { param1: string; param2: number }
    ) {
        // Custom implementation
        return { result: "success" };
    }
}
```

### Subgraph Customization

Extend the schema for additional data:

```graphql
type CustomEntity @entity {
    id: Bytes!
    customField: String!
    relatedCoin: CoinCreated!
    # Add your custom fields
}
```

### Chain Configuration

Add support for new networks:

```typescript
// apps/web/app/config/chains.ts
export const CHAINS = {
    8453: {
        // Base
        name: "Base",
        rpc: "https://mainnet.base.org",
        factory: "0x777777751622c0d3258f214F9DF38E35BF45baF3",
        icon: "🔵",
    },
    // Add new chains here
};
```

## 🚀 Deployment

### Web Application

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel deploy

# Or deploy to other platforms
npm run start
```

### Subgraph

```bash
# Deploy to The Graph Studio
graph auth --product subgraph-studio
graph deploy --studio zora-coins-factory

# Or deploy to hosted service
graph deploy --product hosted-service your-github-username/subgraph-name
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Zora Protocol Documentation](https://docs.zora.co/)
- [The Graph Documentation](https://thegraph.com/docs/)
- [AgentKit Documentation](https://github.com/coinbase/agentkit)
- [AI SDK Documentation](https://sdk.vercel.ai/)
