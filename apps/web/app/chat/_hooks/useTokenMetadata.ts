"use client";

import { useCallback, useEffect, useState } from "react";
// Import the new utility function and types
import {
  NetworkId,
  TokenMetadata,
  TokenMetadataParams,
  fetchTokenMetadata,
} from "~~/utils/chat/agentkit/token-api/utils";

// Hook-specific options
export interface UseTokenMetadataOptions {
  skip?: boolean;
  refetchInterval?: number;
  // include_market_data is part of TokenMetadataParams, so it will be passed via params object
}

/**
 * Hook to fetch token metadata using the new utility.
 *
 * @param contractAddress - Token contract address.
 * @param params - Optional parameters like network_id, include_market_data.
 * @param options - Hook options like skip, refetchInterval.
 * @returns Token metadata and functions.
 */
export const useTokenMetadata = (
  contractAddress: string | undefined,
  params?: TokenMetadataParams, // Use imported TokenMetadataParams
  options: UseTokenMetadataOptions = {},
) => {
  const [data, setData] = useState<TokenMetadata | null | undefined>(undefined); // Data can be TokenMetadata, null, or undefined initially
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);

  const { skip = !contractAddress, refetchInterval } = options; // Default skip if no contractAddress

  const fetchData = useCallback(async () => {
    if (skip || !contractAddress) {
      setData(undefined); // Or null, depending on desired initial/skipped state
      setIsLoading(false);
      setError(undefined);
      return;
    }

    setIsLoading(true);
    setError(undefined);

    // Normalization of contractAddress is handled within fetchTokenMetadata utility
    try {
      const response = await fetchTokenMetadata(contractAddress, params);

      if (response.error) {
        setError(response.error.message);
        setData(null); // Set to null on error to indicate fetch attempt but no data
      } else {
        setData(response.data); // response.data can be TokenMetadata or null from the utility
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
    data, // Type: TokenMetadata | null | undefined
    isLoading,
    error,
    refetch: fetchData,
    lastUpdated,
  };
};

// Export types that might be needed by components using this hook
export type { TokenMetadata, TokenMetadataParams, NetworkId };
