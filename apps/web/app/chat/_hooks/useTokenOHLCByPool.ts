"use client";

import { useCallback, useEffect, useState } from "react";
// Import the new utility function and types
import {
  NetworkId,
  PoolOHLCDataPoint,
  PoolOHLCParams,
  TokenOHLCByPoolResponseData,
  fetchTokenOHLCByPool,
} from "~~/utils/chat/agentkit/token-api/utils";

/**
 * OHLC data point
 */
export interface OHLCDataPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume_token0: number;
  volume_token1: number;
  volume_usd?: number;
}

/**
 * Pool OHLC API response
 */
export interface PoolOHLCResponse {
  // Core data fields
  ohlc?: OHLCDataPoint[];

  // Pool metadata
  pool_address?: string;
  token0_address?: string;
  token0_symbol?: string;
  token0_name?: string;
  token0_decimals?: number;
  token1_address?: string;
  token1_symbol?: string;
  token1_name?: string;
  token1_decimals?: number;
  protocol?: string;
  network_id?: string;
  resolution?: string;

  // Pagination
  pagination?: {
    page: number;
    page_size: number;
    total_pages: number;
  };

  // Alternative API format
  data?: Array<{
    timestamp?: number;
    datetime?: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
    volume_token0?: number;
    volume_token1?: number;
    volume_usd?: number;
  }>;

  // Statistics info
  statistics?: {
    token0_symbol?: string;
    token0_address?: string;
    token1_symbol?: string;
    token1_address?: string;
    protocol?: string;
    elapsed?: number;
    rows_read?: number;
    bytes_read?: number;
  };

  // Additional fields that might be in the response
  results?: number;
  total_results?: number;
}

// Options for the hook, maps to PoolOHLCParams + hook controls
export interface UseTokenOHLCByPoolOptions {
  poolAddress?: string;
  networkId?: NetworkId;
  fromTimestamp?: number; // Unix seconds
  toTimestamp?: number; // Unix seconds
  resolution?: PoolOHLCParams["resolution"]; // Use imported type directly
  page?: number;
  pageSize?: number;
  tokenAddress?: string; // Added based on PoolOHLCParamsSchema
  skip?: boolean;
  refetchInterval?: number;
  enabled?: boolean; // Kept for compatibility, maps to !skip
}

/**
 * Hook to fetch OHLC price data for a liquidity pool using the new utility.
 *
 * @param options - Configuration options including poolAddress and parameters.
 * @returns API response with OHLC data and helper functions.
 */
export function useTokenOHLCByPool(options: UseTokenOHLCByPoolOptions = {}) {
  const {
    poolAddress,
    networkId,
    fromTimestamp,
    toTimestamp,
    resolution,
    page,
    pageSize,
    tokenAddress: filterTokenAddress,
    skip: optionSkip,
    refetchInterval,
    enabled = true,
  } = options;

  const [data, setData] = useState<TokenOHLCByPoolResponseData | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);

  const skipFetching = optionSkip !== undefined ? optionSkip : !enabled || !poolAddress;

  const fetchData = useCallback(async () => {
    if (skipFetching || !poolAddress) {
      setData(undefined);
      setIsLoading(false);
      setError(undefined);
      return;
    }

    setIsLoading(true);
    setError(undefined);

    const apiParams: PoolOHLCParams = {
      // Use imported type directly
      network_id: networkId,
      resolution: resolution,
      from_timestamp: fromTimestamp,
      to_timestamp: toTimestamp,
      page: page,
      page_size: pageSize,
      token_address: filterTokenAddress,
    };

    try {
      const response = await fetchTokenOHLCByPool(poolAddress, apiParams);

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
  }, [
    poolAddress,
    networkId,
    resolution,
    fromTimestamp,
    toTimestamp,
    page,
    pageSize,
    filterTokenAddress,
    skipFetching,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (refetchInterval && !skipFetching) {
      const intervalId = setInterval(fetchData, refetchInterval);
      return () => clearInterval(intervalId);
    }
  }, [fetchData, refetchInterval, skipFetching]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    lastUpdated,
  };
}

// Also re-export main response data type and NetworkId for convenience
export type { TokenOHLCByPoolResponseData, NetworkId, PoolOHLCDataPoint, PoolOHLCParams };
