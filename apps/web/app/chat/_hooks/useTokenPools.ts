"use client";

import { useCallback, useEffect, useState } from "react";
// Import the new utility function and types
import {
  NetworkId,
  Pool as PoolItem, // Alias Pool to PoolItem to avoid naming conflict if we export Pool type from this file
  // This is the type for the data object returned by the API (contains data array, pagination, etc.)
  PoolsParams,
  PoolsResponseData,
  fetchTokenPools,
} from "~~/utils/chat/agentkit/token-api/utils";

// Hook-specific options
export interface UseTokenPoolsOptions {
  skip?: boolean;
  refetchInterval?: number;
}

/**
 * Token information in pool
 */
export interface TokenInfo {
  address: string;
  symbol: string;
  decimals: number;
}

/**
 * Pool information
 */
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

/**
 * Pools API response
 */
export interface PoolsResponse {
  data: Pool[];
  statistics: {
    bytes_read: number;
    rows_read: number;
    elapsed: number;
  };
  pagination: {
    previous_page: number;
    current_page: number;
    next_page: number;
    total_pages: number;
  };
  results: number;
  total_results: number;
  request_time: string;
  duration_ms: number;
}

/**
 * Hook to fetch pools data using the new utility.
 *
 * @param params - Optional parameters for filtering and pagination.
 * @param options - Hook options like skip, refetchInterval.
 * @returns Pools data (including the array of pools, pagination, stats) and functions.
 */
export const useTokenPools = (
  params?: PoolsParams, // Use imported PoolsParams
  options: UseTokenPoolsOptions = {},
) => {
  // The data state will hold the PoolsResponseData object
  const [data, setData] = useState<PoolsResponseData | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);

  // Skip if no specific identifying param is provided, e.g. token or pool address, unless explicitly told not to.
  // This is a heuristic; the API might allow fetching all pools, but it could be a large request.
  // For now, let's make skip default to true if no params are given, or rely on options.skip.
  const { skip = !params || Object.keys(params).length === 0, refetchInterval } = options;

  const fetchData = useCallback(async () => {
    if (skip) {
      setData(undefined);
      setIsLoading(false);
      setError(undefined);
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const response = await fetchTokenPools(params);

      if (response.error) {
        setError(response.error.message);
        setData(null); // Set to null on error
      } else {
        setData(response.data); // response.data is PoolsResponseData or null
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
      setError(errorMessage);
      setData(null);
    } finally {
      setIsLoading(false);
      setLastUpdated(new Date());
    }
  }, [JSON.stringify(params), skip]);

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
    data, // Type: PoolsResponseData | null | undefined
    isLoading,
    error,
    refetch: fetchData,
    lastUpdated,
  };
};

// Export types that might be needed by components using this hook
export type { PoolItem, PoolsParams, NetworkId, PoolsResponseData };
