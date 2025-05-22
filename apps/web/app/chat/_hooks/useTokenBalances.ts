"use client";

import { useCallback, useEffect, useState } from "react";
// Import the new utility function and types directly
import {
  NetworkId,
  TokenBalance,
  TokenBalancesParams,
  fetchTokenBalances,
} from "~~/utils/chat/agentkit/token-api/utils";

// Define hook-specific options. This interface is local to the hook.
export interface UseTokenBalancesOptions {
  skip?: boolean;
  refetchInterval?: number;
}

// The interfaces for TokenBalance, TokenBalancesParams, and NetworkId
// are now imported from the utility file and should not be redefined here.

/**
 * Hook to fetch token balances for a specific address using the new utility.
 *
 * @param address - Wallet address
 * @param params - Optional filter parameters (using the imported TokenBalancesParams type)
 * @param options - Hook options (skip, refetchInterval)
 * @returns Token balances data and functions
 */
export const useTokenBalances = (
  address: string | undefined,
  params?: TokenBalancesParams, // Use the directly imported TokenBalancesParams
  options: UseTokenBalancesOptions = {},
) => {
  const [data, setData] = useState<TokenBalance[] | undefined>(undefined); // Use imported TokenBalance
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);

  const { skip = !address, refetchInterval } = options;

  const fetchData = useCallback(async () => {
    if (skip || !address) {
      setData(undefined);
      setIsLoading(false);
      setError(undefined);
      return;
    }
    // Normalization is also in fetchTokenBalances, but to be safe for params.network_id access for the condition:
    const normalizedAddress = address.startsWith("0x") || params?.network_id === "unichain" ? address : `0x${address}`;

    setIsLoading(true);
    setError(undefined);

    try {
      const response = await fetchTokenBalances(normalizedAddress, params);
      if (response.error) {
        setError(response.error.message);
        setData(undefined);
      } else {
        setData(response.data || []);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
      setError(errorMessage);
      setData(undefined);
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
    data,
    isLoading,
    error,
    refetch: fetchData,
    lastUpdated,
  };
};

// If components consuming this hook need these types,
// they should now import them from '~~/utils/chat/agentkit/token-api/utils'
// e.g. import type { TokenBalance, TokenBalancesParams } from '~~/utils/chat/agentkit/token-api/utils';
