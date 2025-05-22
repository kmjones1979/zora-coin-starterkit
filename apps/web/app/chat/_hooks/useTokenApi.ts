"use client";

import { useEffect, useState } from "react";

/**
 * Available network IDs
 */
export type NetworkId = "mainnet" | "bsc" | "base" | "arbitrum-one" | "optimism" | "matic" | "unichain";

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    status: number;
  };
}

/**
 * Hook options for useTokenApi
 */
export interface TokenApiOptions {
  skip?: boolean;
  refetchInterval?: number;
}

/**
 * Base hook for interacting with the Token API through the proxy endpoint
 *
 * @param endpoint - API endpoint path (without leading slash)
 * @param params - Query parameters
 * @param options - Hook options
 * @returns Object containing data, loading state, error state and refetch function
 */
export const useTokenApi = <DataType, ParamsType = Record<string, any>>(
  endpoint: string,
  params?: ParamsType,
  options: TokenApiOptions = {},
) => {
  const [data, setData] = useState<DataType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);

  const { skip = false, refetchInterval } = options;

  const apiUrl = `/api/token-proxy`;

  // Build query parameters
  const buildQueryParams = () => {
    if (!params) return "";

    const searchParams = new URLSearchParams();

    // Add endpoint to the query params as 'path'
    searchParams.append("path", endpoint);

    // Add all other params
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });

    return `?${searchParams.toString()}`;
  };

  // Fetch data function
  const fetchData = async () => {
    if (skip || !endpoint) return undefined;

    setIsLoading(true);
    setError(undefined);
    let resultData: DataType | undefined = undefined;

    try {
      const url = `${apiUrl}${buildQueryParams()}`;
      console.log("🌐 Making API request:", url);
      const response = await fetch(url);

      // Check if the response is OK
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`🔴 API error (${response.status}):`, errorText);
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }

      const jsonData = await response.json();
      console.log("📊 API Response:", jsonData);

      if (jsonData.error) {
        setError(jsonData.error.message);
      } else if (jsonData.data) {
        // The API returns a wrapper with a data property
        resultData = jsonData.data as DataType;
        setData(resultData);
      } else if (Array.isArray(jsonData)) {
        // Direct array response
        resultData = jsonData as DataType;
        setData(resultData);
      } else {
        // Assume the entire response is the data (may be missing wrapper)
        resultData = jsonData as DataType;
        setData(resultData);
      }

      return resultData;
    } catch (error) {
      console.error("❌ API Error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);
      return undefined;
    } finally {
      setIsLoading(false);
      setLastUpdated(new Date());
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [JSON.stringify(params), endpoint, skip]);

  // Set up interval for refetching if needed
  useEffect(() => {
    if (refetchInterval && !skip) {
      const intervalId = setInterval(fetchData, refetchInterval);
      return () => clearInterval(intervalId);
    }
  }, [refetchInterval, skip, JSON.stringify(params), endpoint]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    lastUpdated,
  };
};
