"use client";

import { useCallback, useEffect, useState } from "react";
// Import the new utility function and types
import {
  NetworkId,
  TokenHolder, // Individual holder type
  TokenHoldersData, // The structure returned by fetchTokenHolders (contains holders array & metadata)
  TokenHoldersParams,
  fetchTokenHolders,
} from "~~/utils/chat/agentkit/token-api/utils";

// Hook-specific options
export interface UseTokenHoldersOptions {
  skip?: boolean;
  refetchInterval?: number;
}

/**
 * Token holder information
 */
export interface TokenHoldersResponse {
  data?: TokenHolder[];
  contract_address?: string;
  holders?: TokenHolder[];
  page?: number;
  page_size?: number;
  total_holders?: number;
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
}

/**
 * Hook to fetch token holders using the new utility.
 *
 * @param contractAddress - Token contract address.
 * @param params - Optional parameters like network_id, page, page_size.
 * @param options - Hook options like skip, refetchInterval.
 * @returns Token holders data (including pagination, stats) and functions.
 */
export const useTokenHolders = (
  contractAddress: string | undefined,
  params?: TokenHoldersParams, // Use imported TokenHoldersParams
  options: UseTokenHoldersOptions = {},
) => {
  // The data state will hold the TokenHoldersData object which includes the array of holders and metadata
  const [data, setData] = useState<TokenHoldersData | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);

  const { skip = !contractAddress, refetchInterval } = options; // Default skip if no contractAddress

  const fetchData = useCallback(async () => {
    if (skip || !contractAddress) {
      setData(undefined);
      setIsLoading(false);
      setError(undefined);
      return;
    }

    setIsLoading(true);
    setError(undefined);

    // Contract address normalization is handled by fetchTokenHolders utility
    try {
      const response = await fetchTokenHolders(contractAddress, params);

      if (response.error) {
        setError(response.error.message);
        setData(null); // Set to null on error
      } else {
        setData(response.data); // response.data is TokenHoldersData or null
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
      setError(errorMessage);
      setData(null);
    } finally {
      setIsLoading(false);
      setLastUpdated(new Date());
    }
  }, [contractAddress, JSON.stringify(params), skip]);

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
    data, // Type: TokenHoldersData | null | undefined
    isLoading,
    error,
    refetch: fetchData,
    lastUpdated,
  };
};

// Export types that might be needed by components using this hook
export type { TokenHolder, TokenHoldersParams, NetworkId, TokenHoldersData };
