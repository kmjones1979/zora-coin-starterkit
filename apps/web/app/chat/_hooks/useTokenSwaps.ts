"use client";

import { useCallback, useEffect, useState } from "react";
// Import the new utility function and types
import {
  NetworkId,
  Swap as SwapItem, // This is the type for the data object returned by the API
  SwapsParams,
  SwapsResponseData, // Alias Swap to SwapItem to avoid naming conflict
  TokenInfo, // For re-export if needed
  fetchTokenSwaps,
} from "~~/utils/chat/agentkit/token-api/utils";

/**
 * Swap information
 */
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
  token0?:
    | {
        address: string;
        symbol: string;
        decimals: number;
      }
    | string;
  token1?:
    | {
        address: string;
        symbol: string;
        decimals: number;
      }
    | string;
  token0_symbol?: string;
  token1_symbol?: string;
  amount0_usd?: number;
  amount1_usd?: number;
  value0?: number;
  value1?: number;
  price0?: number;
  price1?: number;
  protocol?: string;
}

/**
 * Swaps API response
 */
export interface SwapsResponse {
  swaps: Swap[];
  pagination: {
    page: number;
    page_size: number;
    total_pages: number;
  };
  total: number;
}

// Hook-specific options
export interface UseTokenSwapsOptions {
  skip?: boolean;
  refetchInterval?: number;
}

/**
 * Hook to fetch swaps data using the new utility.
 *
 * @param params - Parameters for filtering swaps, network_id is required.
 * @param options - Hook options like skip, refetchInterval.
 * @returns Swaps data (including the array of swaps, pagination, total) and functions.
 */
export const useTokenSwaps = (
  params: SwapsParams, // network_id is required by SwapsParams schema
  options: UseTokenSwapsOptions = {},
) => {
  const [data, setData] = useState<SwapsResponseData | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);

  // Skip if network_id is not provided, as it's required by the API/utility.
  const { skip = !params.network_id, refetchInterval } = options;

  const fetchData = useCallback(async () => {
    if (skip) {
      // Also implicitly true if params.network_id is missing from input
      setData(undefined);
      setIsLoading(false);
      setError(undefined);
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const response = await fetchTokenSwaps(params);

      if (response.error) {
        setError(response.error.message);
        setData(null);
      } else {
        setData(response.data);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
      setError(errorMessage);
      setData(null);
    } finally {
      setIsLoading(false);
      setLastUpdated(new Date());
    }
  }, [JSON.stringify(params), skip]); // params includes network_id

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
    data, // Type: SwapsResponseData | null | undefined
    isLoading,
    error,
    refetch: fetchData,
    lastUpdated,
  };
};

// Export types that might be needed by components using this hook
export type { SwapItem, SwapsParams, NetworkId, SwapsResponseData, TokenInfo };
