"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ContractOHLCParams as ApiContractOHLCParams,
  OHLCDataPoint as ApiOHLCDataPoint,
  NetworkId,
  TokenOHLCByContractResponseData,
  fetchTokenOHLCByContract,
} from "~~/utils/chat/agentkit/token-api/utils";

export interface UseTokenOHLCByContractOptions {
  contractAddress?: string;
  networkId?: NetworkId;
  resolution?: ApiContractOHLCParams["resolution"];
  fromTimestamp?: number;
  toTimestamp?: number;
  limit?: number;
  skip?: boolean;
  refetchInterval?: number;
  enabled?: boolean;
}

export type OHLCDataPoint = ApiOHLCDataPoint;
export type ContractOHLCParams = ApiContractOHLCParams;

/**
 * React hook to get OHLC price data for a token contract using the new utility.
 */
export function useTokenOHLCByContract(options: UseTokenOHLCByContractOptions = {}) {
  const {
    contractAddress,
    networkId,
    resolution,
    fromTimestamp,
    toTimestamp,
    limit = 100,
    skip: optionSkip,
    refetchInterval,
    enabled = true,
  } = options;

  const [data, setData] = useState<TokenOHLCByContractResponseData | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);

  const skipFetching = optionSkip !== undefined ? optionSkip : !enabled || !contractAddress;

  const fetchData = useCallback(async () => {
    if (skipFetching || !contractAddress) {
      setData(undefined);
      setIsLoading(false);
      setError(undefined);
      return;
    }

    setIsLoading(true);
    setError(undefined);

    const apiParams: ApiContractOHLCParams = {
      network_id: networkId,
      resolution: resolution,
      from_timestamp: fromTimestamp,
      to_timestamp: toTimestamp,
      limit: limit,
    };

    try {
      const response = await fetchTokenOHLCByContract(contractAddress, apiParams);

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
  }, [contractAddress, networkId, resolution, fromTimestamp, toTimestamp, limit, skipFetching]);

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

export type { TokenOHLCByContractResponseData, NetworkId };
