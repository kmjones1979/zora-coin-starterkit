# Zora Coin Starter Kit

A modern web application starter kit for creating and managing Zora coins on the Base network. Built with Next.js, RainbowKit, and wagmi.

![App Screenshot](public/screenshot.png) <!-- Add actual screenshot later -->

## 🚀 Features

-   **Wallet Integration**: Seamless wallet connection using RainbowKit
-   **Network Management**: Automatic Base network detection and switching
-   **Coin Creation**: Create new Zora coins with custom names, symbols, and metadata
-   **Transaction Tracking**: Real-time transaction status and confirmation
-   **Contract Verification**: View and verify deployed contracts on BaseScan
-   **Token Details**: Display token information including name, symbol, and total supply
-   **Responsive Design**: Mobile-friendly interface with modern UI components

## 🛠️ Tech Stack

-   **Frontend**: Next.js 14, React, TypeScript
-   **Wallet Integration**: RainbowKit, wagmi
-   **Blockchain**: Base Network, Zora Protocol
-   **Styling**: Tailwind CSS
-   **Development**: TypeScript, ESLint
-   **Package Management**: npm/yarn
-   **Version Control**: Git

## 📦 Project Structure

```
base-zora-coin-starterkit/
├── app/
│   ├── components/
│   │   ├── CreateZoraCoin.tsx    # Main coin creation component
│   │   └── RecentCoins.tsx       # Recent coins display component
│   ├── providers.tsx             # Web3 providers configuration
│   └── page.tsx                  # Main application page
├── public/                       # Static assets
├── next.config.ts               # Next.js configuration
├── postcss.config.mjs           # PostCSS configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Project dependencies
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

To get a WalletConnect Project ID:

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Sign up or log in
3. Create a new project
4. Copy the Project ID

### Network Configuration

The application is configured to work with Base mainnet. Here's the complete configuration:

```typescript
const BASE_NETWORK = {
    id: 8453,
    name: "Base",
    network: "base",
    nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
    },
    rpcUrls: {
        default: { http: ["https://mainnet.base.org"] },
        public: { http: ["https://mainnet.base.org"] },
    },
    blockExplorers: {
        default: { name: "Base Explorer", url: "https://basescan.org" },
    },
};

// Contract addresses
const ZORA_COIN_FACTORY_ADDRESS = "0x7777777F279eba3d3Ad8F4E708545291A6fDBA8B";
const ZORA_COIN_IMPLEMENTATION_ADDRESS =
    "0x7777777F279eba3d3Ad8F4E708545291A6fDBA8B";
```

## 🚀 Getting Started

### Prerequisites

-   Node.js 18.x or later
-   npm (v9+) or yarn (v1.22+)
-   Git
-   MetaMask or compatible Web3 wallet
-   Base network configured in your wallet

### Wallet Setup

1. **Install MetaMask**

    - Download from [MetaMask.io](https://metamask.io/)
    - Create a new wallet or import existing one

2. **Add Base Network**
    - Open MetaMask
    - Click "Networks" dropdown
    - Select "Add Network"
    - Enter Base network details:
        - Network Name: Base
        - RPC URL: https://mainnet.base.org
        - Chain ID: 8453
        - Currency Symbol: ETH
        - Block Explorer URL: https://basescan.org

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/kmjones1979/base-zora-coin-starterkit.git
    cd base-zora-coin-starterkit
    ```

2. **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    ```

3. **Set up environment variables**

    - Create `.env.local` file
    - Add your WalletConnect project ID

    ```bash
    echo "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here" > .env.local
    ```

4. **Start development server**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

5. **Open in browser**
    - Visit [http://localhost:3000](http://localhost:3000)
    - Make sure MetaMask is installed and unlocked

## 📝 Component Documentation

### CreateZoraCoin Component

The main component for creating Zora coins on Base network.

**Features:**

-   Wallet connection management
-   Network switching
-   Coin parameter input
-   Transaction handling
-   Contract deployment
-   Token details display

**Props:** None

**State Management:**

-   `name`: Coin name
-   `symbol`: Coin symbol
-   `uri`: Metadata URI
-   `error`: Error messages
-   `status`: Transaction status
-   `contractAddress`: Deployed contract address
-   `txHash`: Transaction hash

### RecentCoins Component

Displays recently created coins on the Base network.

**Features:**

-   Fetches recent coin data
-   Displays coin details
-   Links to BaseScan explorer

**Props:** None

**State Management:**

-   `coins`: Array of recent coins
-   `loading`: Loading state
-   `error`: Error state

### Providers Component

Configures Web3 providers for the application.

**Features:**

-   RainbowKit provider setup
-   Wagmi configuration
-   Query client setup
-   Network configuration

## 🔍 Usage Guide

1. **Connect Wallet**

    - Click "Connect Wallet" button
    - Select MetaMask from the wallet options
    - Approve the connection request in MetaMask

2. **Switch to Base Network**

    - If not on Base, you'll see a network switch prompt
    - Click "Switch Network" in the prompt
    - Approve the network switch in MetaMask

3. **Create a Coin**

    - Enter coin details:
        - Name: Your coin's name (e.g., "My Token")
        - Symbol: Short symbol (e.g., "MTK")
        - URI: Metadata URI (can be left empty for testing)
    - Click "Create Coin"
    - Approve the transaction in MetaMask
    - Wait for confirmation (usually 1-2 minutes)

4. **View Transaction**
    - Monitor transaction status in the UI
    - Click "View on Base Explorer" to see details
    - Check contract deployment status
    - View token details once deployed

## 🛠️ Development

### Running Tests

```bash
npm run test
# or
yarn test
```

### Building for Production

```bash
npm run build
# or
yarn build
```

### Linting

```bash
npm run lint
# or
yarn lint
```

## ⚠️ Troubleshooting

### Common Issues

1. **Wallet Connection Issues**

    - Ensure MetaMask is installed and unlocked
    - Check if you're on the correct network (Base)
    - Try disconnecting and reconnecting your wallet

2. **Network Switch Issues**

    - Make sure Base network is added to MetaMask
    - Check if you have enough ETH for gas fees
    - Try manually switching networks in MetaMask

3. **Transaction Failures**

    - Ensure you have enough ETH for gas
    - Check if the contract addresses are correct
    - Verify network connection is stable

4. **Build Errors**

    - Clear node_modules and reinstall dependencies
    - Check Node.js version compatibility
    - Verify all environment variables are set

## 📚 Additional Resources

-   [Base Documentation](https://docs.base.org/)
-   [Zora Protocol Documentation](https://docs.zora.co/)
-   [RainbowKit Documentation](https://www.rainbowkit.com/docs/introduction)
-   [wagmi Documentation](https://wagmi.sh/)
-   [MetaMask Documentation](https://docs.metamask.io/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

-   Base Network team
-   Zora Protocol team
-   RainbowKit team
-   wagmi team
