import { NetworkId } from "../_hooks/useTokenApi";

// Current block numbers (estimated for May 2024)
export const CURRENT_BLOCK_NUMBERS: Record<NetworkId, number> = {
  mainnet: 19200000, // Ethereum mainnet
  "arbitrum-one": 175000000, // Arbitrum
  base: 10000000, // Base
  bsc: 34000000, // BSC
  optimism: 110000000, // Optimism
  matic: 50000000, // Polygon
  unichain: 19200000, // Default to mainnet
};

// Average block time in seconds for different networks
export const BLOCK_TIMES: Record<NetworkId, number> = {
  mainnet: 12, // Ethereum mainnet
  "arbitrum-one": 0.25, // Arbitrum
  base: 2, // Base
  bsc: 3, // BSC
  optimism: 2, // Optimism
  matic: 2.5, // Polygon
  unichain: 12, // Default to mainnet
};

// Helper function to estimate date from block number and network
export const estimateDateFromBlock = (blockNum: number | undefined, networkId: NetworkId): Date => {
  // If block number is undefined, return current date
  if (blockNum === undefined) {
    return new Date();
  }

  // Get current block estimate for the network
  const currentBlock = CURRENT_BLOCK_NUMBERS[networkId] || CURRENT_BLOCK_NUMBERS.mainnet;

  // Get block time for the network
  const blockTime = BLOCK_TIMES[networkId] || BLOCK_TIMES.mainnet;

  // Calculate seconds since the block
  const blockDiff = Math.max(0, currentBlock - blockNum); // Ensure non-negative
  const secondsAgo = blockDiff * blockTime;

  // Calculate the date, ensuring it's not in the future
  const now = new Date();
  const estimatedDate = new Date(now.getTime() - secondsAgo * 1000);
  return estimatedDate > now ? now : estimatedDate;
};
