import { NetworkId } from "../_hooks/useTokenApi";

// Define supported EVM networks
export interface EVMNetwork {
  id: NetworkId;
  name: string;
  icon?: string;
  blockExplorer: string;
}

export const EVM_NETWORKS: EVMNetwork[] = [
  { id: "mainnet", name: "Ethereum", blockExplorer: "https://etherscan.io" },
  { id: "base", name: "Base", blockExplorer: "https://basescan.org" },
  { id: "arbitrum-one", name: "Arbitrum", blockExplorer: "https://arbiscan.io" },
  { id: "bsc", name: "BSC", blockExplorer: "https://bscscan.com" },
  { id: "optimism", name: "Optimism", blockExplorer: "https://optimistic.etherscan.io" },
  { id: "matic", name: "Polygon", blockExplorer: "https://polygonscan.com" },
];

// Helper functions for networks
export const getNetworkById = (id: NetworkId): EVMNetwork | undefined => {
  return EVM_NETWORKS.find(network => network.id === id);
};

export const getNetworkName = (id: NetworkId): string => {
  return getNetworkById(id)?.name || id;
};

export const getNetworkBlockExplorer = (id: NetworkId): string => {
  return getNetworkById(id)?.blockExplorer || "";
};

export const getBlockExplorerTokenUrl = (networkId: NetworkId, tokenAddress: string): string => {
  const explorer = getNetworkBlockExplorer(networkId);
  return `${explorer}/token/${tokenAddress}`;
};

export const getBlockExplorerAddressUrl = (networkId: NetworkId, address: string): string => {
  const explorer = getNetworkBlockExplorer(networkId);
  return `${explorer}/address/${address}`;
};

export const getBlockExplorerTxUrl = (networkId: NetworkId, txHash: string): string => {
  const explorer = getNetworkBlockExplorer(networkId);
  return `${explorer}/tx/${txHash}`;
};
