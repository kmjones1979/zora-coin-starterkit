import { NetworkId } from "../_hooks/useTokenApi";

interface TokenExample {
  address: string;
  name: string;
  symbol: string;
  decimals?: number;
  description?: string;
}

// Example tokens for each network
export const EXAMPLE_TOKENS: Record<NetworkId, TokenExample[]> = {
  mainnet: [
    {
      address: "0xc944E90C64B2c07662A292be6244BDf05Cda44a7",
      name: "The Graph",
      symbol: "GRT",
      decimals: 18,
      description: "Indexing protocol for querying networks",
    },
    {
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      description: "Stablecoin pegged to the US Dollar",
    },
    {
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      description: "Wrapped version of ETH",
    },
  ],
  "arbitrum-one": [
    {
      address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
      name: "Arbitrum",
      symbol: "ARB",
      decimals: 18,
      description: "Arbitrum network token",
    },
  ],
  base: [
    {
      address: "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
      name: "Coinbase Wrapped Staked ETH",
      symbol: "cbETH",
      decimals: 18,
      description: "Staked ETH by Coinbase",
    },
  ],
  bsc: [
    {
      address: "0x55d398326f99059fF775485246999027B3197955",
      name: "BSC-USD",
      symbol: "BSC-USD",
      decimals: 18,
      description: "Stablecoin pegged to the US Dollar on BSC",
    },
  ],
  optimism: [
    {
      address: "0x4200000000000000000000000000000000000042",
      name: "Optimism",
      symbol: "OP",
      decimals: 18,
      description: "Optimism network token",
    },
  ],
  matic: [
    {
      address: "0x0000000000000000000000000000000000001010",
      name: "Polygon",
      symbol: "MATIC",
      decimals: 18,
      description: "Polygon network token",
    },
  ],
  unichain: [
    {
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      name: "DAI",
      symbol: "DAI",
      decimals: 18,
      description: "Decentralized stablecoin",
    },
  ],
};

// Helper functions to get example tokens
export const getExampleTokensForNetwork = (networkId: NetworkId): TokenExample[] => {
  return EXAMPLE_TOKENS[networkId] || [];
};

export const getFirstExampleTokenForNetwork = (networkId: NetworkId): TokenExample | undefined => {
  const tokens = getExampleTokensForNetwork(networkId);
  return tokens.length > 0 ? tokens[0] : undefined;
};

export const getExampleTokenAddress = (networkId: NetworkId): string => {
  const token = getFirstExampleTokenForNetwork(networkId);
  return token?.address || "";
};
