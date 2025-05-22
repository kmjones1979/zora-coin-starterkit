// It's generally better to define fundamental types like NetworkId directly
// or in a dedicated base types file, rather than importing from a hook.
export type NetworkId = "mainnet" | "base" | "arbitrum-one" | "bsc" | "optimism" | "matic"; // Removed the general '| string' for better type safety with hooks

/**
 * EVM Network information
 */
export interface EVMNetwork {
  id: NetworkId;
  name: string;
  icon?: string;
  blockExplorer?: string; // Added from README example
}

// --- Add other common type definitions below ---

// Example from README for useTokenMetadata
export interface TokenMetadata {
  contract_address: string;
  name: string;
  symbol: string;
  decimals: number;
  total_supply: string;
  logo_url?: string;
  market_data?: {
    price_usd: number;
    price_change_percentage_24h: number;
    market_cap: number;
    total_volume_24h: number;
  };
}

// Example from README for useTokenBalances
export interface TokenBalance {
  contract_address: string;
  amount: string;
  name?: string;
  symbol?: string;
  decimals?: number;
  amount_usd?: number;
}

// From useHistoricalBalances (README & hook file)
export interface HistoricalBalance {
  timestamp: number;
  block_number?: number;
  block_num?: number;
  datetime?: string;
  date?: string;
  balance: string;
  balance_usd?: number;
  token_price_usd?: number;
  price_usd?: number;
}

export interface TokenBalanceHistory {
  contract_address: string;
  token_name?: string;
  token_symbol?: string;
  symbol?: string;
  name?: string;
  token_decimals?: number;
  decimals?: number;
  network_id?: NetworkId;
  balances: HistoricalBalance[];
}

// From useTokenOHLCByPool and useTokenOHLCByContract (README)
export interface OHLCDataPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume_token0?: number; // Optional as it's specific to pool OHLC
  volume_token1?: number; // Optional as it's specific to pool OHLC
  volume_usd?: number; // Optional as it's specific to pool OHLC
  volume?: number; // Optional as it's specific to contract OHLC (different name)
}

// From useTokenTransfers (README)
export interface TokenTransferItem {
  block_num: number;
  datetime?: string;
  timestamp?: number;
  date?: string;
  contract: string;
  from: string;
  to: string;
  amount: string;
  transaction_id: string;
  decimals: number;
  symbol: string;
  network_id: string;
  price_usd?: number;
  value_usd?: number;
}

// From useTokenHolders (README)
export interface TokenHolder {
  address: string;
  balance: string;
  last_updated_block: number;
  balance_usd?: number;
  token_share?: number;
}

// Response type for useTokenHolders (from README)
export interface TokenHoldersResponse {
  holders: TokenHolder[];
  pagination: {
    page: number;
    page_size: number;
    total_pages: number;
  };
  total: number;
}

// From useTokenPools (README)
export interface TokenInfo {
  address: string;
  symbol: string;
  name?: string;
  decimals?: number;
}

export interface Pool {
  block_num: number;
  datetime: string;
  transaction_id: string;
  factory: string;
  pool: string;
  token0: TokenInfo;
  token1: TokenInfo;
  fee: number;
  protocol: string;
  network_id: string;
}

// From useTokenSwaps (README)
export interface Swap {
  block_num: number;
  datetime: string;
  transaction_id: string;
  caller: string;
  pool: string;
  factory?: string;
  sender: string;
  recipient: string;
  network_id: string;
  amount0: string;
  amount1: string;
  token0?: TokenInfo | string;
  token1?: TokenInfo | string;
  amount0_usd?: number;
  amount1_usd?: number;
  protocol?: string;
}

// TODO: Add definitions for the following types based on README.md:
// - PoolOHLCResponse (if not directly imported by hooks, should use OHLCDataPoint)
// - ContractOHLCResponse (if not directly imported by hooks, should use OHLCDataPoint)
// Note: Also consider adding TokenHoldersResponse, TokenTransfersResponse, PoolsResponse etc. if they are directly used.
