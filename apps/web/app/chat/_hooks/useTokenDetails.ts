"use client";

import { useCallback, useEffect, useState } from "react";
import { cleanContractAddress } from "../_utils/utils";
import { NetworkId, TokenDetails, TokenDetailsParams, fetchTokenDetails } from "~~/utils/chat/agentkit/token-api/utils";

export interface TokenDetailsResponse {
  /**
   * Token address
   */
  address: string;
  /**
   * Token name
   */
  name?: string;
  /**
   * Token symbol
   */
  symbol?: string;
  /**
   * Token decimals
   */
  decimals?: number;
  /**
   * Token network
   */
  network?: string;
}

export interface UseTokenDetailsOptions {
  contractAddress?: string;
  networkId?: NetworkId;
  skip?: boolean;
  refetchInterval?: number;
  enabled?: boolean;
}

/**
 * React hook to get token details using the new fetchTokenDetails utility.
 */
export function useTokenDetails(options: UseTokenDetailsOptions = {}) {
  const { contractAddress, networkId, skip: optionSkip, refetchInterval, enabled = true } = options;

  const [data, setData] = useState<TokenDetails | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);

  const skipFetching = optionSkip !== undefined ? optionSkip : !enabled || !contractAddress;

  const fetchData = useCallback(async () => {
    if (skipFetching || !contractAddress) {
      setData(undefined);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(undefined);

    const normalizedContract = cleanContractAddress(contractAddress);
    const apiParams: TokenDetailsParams = { network_id: networkId };

    try {
      const response = await fetchTokenDetails(normalizedContract, apiParams);
      if (response.error) {
        setError(response.error.message);
        setData(undefined);
      } else {
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
  }, [contractAddress, networkId, skipFetching]);

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

export type { TokenDetails, NetworkId };
