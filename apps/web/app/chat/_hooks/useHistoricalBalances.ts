"use client";

import { useCallback, useEffect, useState } from "react";
// Import the new utility function and types
import {
  // Type for individual token history
  HistoricalBalance, // Type for individual balance data point
  HistoricalBalancesData, // This is the primary data structure returned
  HistoricalBalancesParams,
  NetworkId,
  TokenBalanceHistory,
  fetchHistoricalBalances,
} from "~~/utils/chat/agentkit/token-api/utils";

// Hook-specific options
export interface UseHistoricalBalancesOptions {
  skip?: boolean;
  refetchInterval?: number;
}

/**
 * Hook to fetch historical token balances for an address using the new utility.
 *
 * @param address - Wallet address.
 * @param params - Optional parameters like network_id, contract_address, timestamps, resolution.
 * @param options - Hook options like skip, refetchInterval.
 * @returns Historical balance data (grouped by token) and functions.
 */
export const useHistoricalBalances = (
  address: string | undefined,
  params?: HistoricalBalancesParams, // Use imported HistoricalBalancesParams
  options: UseHistoricalBalancesOptions = {},
) => {
  // The data state holds the HistoricalBalancesData object (contains history array, stats)
  const [data, setData] = useState<HistoricalBalancesData | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);

  const { skip = !address, refetchInterval } = options; // Default skip if no address

  const fetchData = useCallback(async () => {
    if (skip || !address) {
      setData(undefined);
      setIsLoading(false);
      setError(undefined);
      return;
    }

    setIsLoading(true);
    setError(undefined);

    // Address normalization is handled by the utility
    try {
      const response = await fetchHistoricalBalances(address, params);

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
    data, // Type: HistoricalBalancesData | null | undefined
    isLoading,
    error,
    refetch: fetchData,
    lastUpdated,
  };
};

// Export types that might be needed by components using this hook
export type { HistoricalBalancesData, HistoricalBalancesParams, TokenBalanceHistory, HistoricalBalance, NetworkId };
