"use client";

import { useCallback, useEffect, useState } from "react";
// For the type of 'data' state
import type { z } from "zod";
import type { TokenTransfersResponseDataSchema } from "~~/utils/chat/agentkit/token-api/schemas";
// Import the new utility function and types
import {
  NetworkId, // The hook returns the `data` part of TokenTransfersApiResponse, which includes transfers, pagination etc.
  // So, the data type for the state will be the type of `data` inside TokenTransfersApiResponse.
  // Let's call this TokenTransfersData for clarity within the hook.
  TokenTransferItem,
  TokenTransfersParams,
  fetchTokenTransfers,
} from "~~/utils/chat/agentkit/token-api/utils";

/**
 * Token transfer information
 */
export interface TokenTransfer {
  token_address: string;
  token_id?: string;
  from_address: string;
  to_address: string;
  value: string;
  value_display?: string;
  value_usd?: number;
  tx_hash: string;
  tx_index: number;
  block_number: number;
  block_timestamp: number;
  log_index: number;
  type: "erc20" | "erc721" | "erc1155";
}

/**
 * Token transfers API response
 */
export interface TokenTransfersResponse {
  data: TokenTransferItem[];
  transfers?: TokenTransfer[];
  statistics?: {
    bytes_read: number;
    rows_read: number;
    elapsed: number;
  };
  pagination?: {
    page: number;
    page_size: number;
    total_pages: number;
  };
  results?: number;
  total_results?: number;
}

// Local type for hook options
export interface UseTokenTransfersOptions {
  skip?: boolean;
  refetchInterval?: number;
}

// Type for the data returned by the hook, aligning with TokenTransfersResponseDataSchema
export type TokenTransfersData = z.infer<typeof TokenTransfersResponseDataSchema>;

/**
 * Hook to fetch token transfers using the new utility.
 *
 * @param address - Wallet address to query for transfers (used as the 'to' address).
 * @param params - Optional parameters, excluding 'to' which is derived from address.
 * @param options - Hook options (skip, refetchInterval).
 * @returns Token transfers data (including pagination, stats) and functions.
 */
export const useTokenTransfers = (
  address: string | undefined, // This address will be used as the 'to' parameter
  // Params for the hook should not include 'to', as it's taken from the main 'address' arg.
  params?: Omit<TokenTransfersParams, "to">,
  options: UseTokenTransfersOptions = {},
) => {
  const [data, setData] = useState<TokenTransfersData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);

  const { skip = !address, refetchInterval } = options; // Default skip if no address

  const fetchData = useCallback(async () => {
    // The fetchTokenTransfers utility expects `toAddress` and `params` (without `to`)
    if (skip) {
      // if address is undefined, skip will be true by default
      setData(undefined);
      setIsLoading(false);
      setError(undefined);
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      // Pass the main 'address' as 'toAddress' to the utility
      const response = await fetchTokenTransfers(address, params);

      if (response.error) {
        setError(response.error.message);
        setData(undefined);
      } else {
        // The fetchTokenTransfers utility already normalizes the response
        // to include the full data structure (transfers array + metadata)
        setData(response.data);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
      setError(errorMessage);
      setData(undefined);
    } finally {
      setIsLoading(false);
      setLastUpdated(new Date());
    }
    // Dependencies: address, and the stringified params object.
  }, [address, JSON.stringify(params), skip]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (refetchInterval && !skip) {
      const intervalId = setInterval(fetchData, refetchInterval);
      return () => clearInterval(intervalId);
    }
  }, [fetchData, refetchInterval, skip]);

  return {
    data, // This will be of type TokenTransfersData (includes transfers array, pagination, stats)
    isLoading,
    error,
    refetch: fetchData,
    lastUpdated,
  };
};

// Export types that might be needed by components using this hook
export type { TokenTransferItem, TokenTransfersParams, NetworkId };
