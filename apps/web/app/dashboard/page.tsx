"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
    GetAllCoinIdsForCountDocument,
    GetRecentCoinCreatedsDocument,
    GetCoinCreationTimeSeriesDocument,
    GetCoinsCreatedInTimeRangeDocument,
    GetTopCoinCreatorsDocument,
    execute,
} from "../../../../.graphclient"; // Corrected path
import StatCard from "./components/StatCard"; // Import the new component
import CoinCreationLineChart from "./components/CoinCreationLineChart"; // Import the line chart component
import TopCreatorsBarChart from "./components/TopCreatorsBarChart"; // Import the bar chart component
import RecentCoinsTable from "./components/RecentCoinsTable"; // Import the recent coins table

// Helper function to convert BigInts to strings (can be moved to a utils file)
function stringifyBigInts(value: any): any {
    if (typeof value === "bigint") {
        return value.toString();
    }
    if (Array.isArray(value)) {
        return value.map(stringifyBigInts);
    }
    if (typeof value === "object" && value !== null) {
        const newObj: { [key: string]: any } = {};
        for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                newObj[key] = stringifyBigInts(value[key]);
            }
        }
        return newObj;
    }
    return value;
}

async function fetchData(document: any, variables: any = {}) {
    // For dashboard, let's default to the dev endpoint for now.
    // Production dashboards might need more robust endpoint selection or configuration.
    const sourceName = "zoraCoinProd"; // Changed from zoraCoinDev
    const context = { sourceName };

    try {
        const executionResult = await execute(document, variables, context);
        if (executionResult.errors && executionResult.errors.length > 0) {
            console.error("GraphQL Errors:", executionResult.errors);
            throw new Error(
                executionResult.errors.map((e) => e.message).join("\n")
            );
        }
        return executionResult.data
            ? stringifyBigInts(executionResult.data)
            : null;
    } catch (error) {
        console.error("Fetch data error:", error);
        throw error; // Re-throw to be caught by useQuery
    }
}

// Helper to process data for time-series chart (Last Hour, by Minute)
function processLastHourTimeSeriesData(
    rawData: any[] | undefined
): { minute: string; count: number }[] {
    if (!rawData) return [];
    const countsByMinute: { [key: string]: number } = {};

    // Get the timestamp for one hour ago to ensure we only plot relevant data if query returns more
    const oneHourAgoTimestamp = Date.now() - 60 * 60 * 1000;

    rawData.forEach((item) => {
        const itemTimestamp = parseInt(item.blockTimestamp) * 1000;
        if (itemTimestamp >= oneHourAgoTimestamp) {
            // Ensure data point is within the last hour
            const date = new Date(itemTimestamp);
            const minuteKey = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
            countsByMinute[minuteKey] = (countsByMinute[minuteKey] || 0) + 1;
        }
    });

    // Ensure all minutes in the last hour are represented, even if count is 0
    const allMinutesData: { minute: string; count: number }[] = [];
    for (let i = 59; i >= 0; i--) {
        // Iterate from 59 minutes ago to now
        const date = new Date(Date.now() - i * 60 * 1000);
        const minuteKey = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
        allMinutesData.push({
            minute: minuteKey,
            count: countsByMinute[minuteKey] || 0,
        });
    }

    return allMinutesData;
}

// Helper to calculate average coins per HOUR from recent data
function calculateAverageCoinsPerHour(rawData: any[] | undefined): string {
    if (!rawData || rawData.length === 0) return "0.0";

    const uniqueHourIntervals = new Set<string>();
    rawData.forEach((item) => {
        const date = new Date(parseInt(item.blockTimestamp) * 1000);
        // Create a key for YYYY-MM-DD-HH to group by hour
        const hourKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}-${String(date.getHours()).padStart(2, "0")}`;
        uniqueHourIntervals.add(hourKey);
    });

    if (uniqueHourIntervals.size === 0) return "0.0";

    const average = rawData.length / uniqueHourIntervals.size;
    return average.toFixed(1);
}

interface CreatorData {
    name: string;
    value: number;
}

const processTopCreatorsData = (
    data?: any | null,
    count: number = 10
): CreatorData[] => {
    if (!data || !data.coinCreateds) return [];
    const creatorCounts: Record<string, number> = {};
    data.coinCreateds.forEach((coin) => {
        const creatorId = coin.caller.id.toString();
        creatorCounts[creatorId] = (creatorCounts[creatorId] || 0) + 1;
    });

    return Object.entries(creatorCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, count)
        .map(([name, value]) => ({
            name: `${name.slice(0, 6)}...${name.slice(-4)}`,
            value,
        }));
};

export default function DashboardPage() {
    const {
        data: totalCoinsData,
        isLoading: isLoadingTotalCoins,
        error: errorTotalCoins,
    } = useQuery({
        queryKey: ["totalCoinsCreated"],
        queryFn: async () => {
            const first = 1000; // Fetch up to 1000
            const result: any = await fetchData(
                GetAllCoinIdsForCountDocument,
                { first, skip: 0 } // Only fetch the first page
            );
            let count = 0;
            let approximate = false;
            if (result && result.coinCreateds) {
                count = result.coinCreateds.length;
                // If we got the max we asked for, it might be approximate.
                // The API might return less than 'first' even if there are more items,
                // if 'first' exceeds the API's max per-page limit.
                // A more robust check might be needed if the API's behavior is nuanced.
                // For now, this is a common way to indicate approximation.
                if (count === first) {
                    approximate = true;
                }
            }
            return {
                count: count,
                approximate: approximate,
            };
        },
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 300000, // 5 minutes
    });

    const {
        data: recentCoinsData,
        isLoading: isLoadingRecentCoins,
        error: errorRecentCoins,
    } = useQuery({
        queryKey: ["recentCoins"],
        queryFn: () => fetchData(GetRecentCoinCreatedsDocument, { first: 5 }),
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 60000, // 1 minute
    });

    const {
        data: generalRecentDataForAvg,
        isLoading: isLoadingGeneralRecent,
        error: errorGeneralRecent,
    } = useQuery({
        queryKey: ["generalRecentCoinActivityForAvg"],
        queryFn: () =>
            fetchData(GetCoinCreationTimeSeriesDocument, {
                first: 100,
                startTime: "0",
            }),
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 300000, // 5 minutes
        enabled: !!totalCoinsData, // Depends on totalCoinsData
    });
    const averageCoinsPerHour = calculateAverageCoinsPerHour(
        generalRecentDataForAvg?.coinCreateds
    );

    const oneHourAgoTimestampForCount = Math.floor(
        (Date.now() - 1 * 60 * 60 * 1000) / 1000
    ).toString();
    const {
        data: coinsLastHourData,
        isLoading: isLoadingCoinsLastHour,
        error: errorCoinsLastHour,
    } = useQuery({
        queryKey: ["coinsLastHourCount"],
        queryFn: async () => {
            const result: any = await fetchData(
                GetCoinsCreatedInTimeRangeDocument,
                { startTime: oneHourAgoTimestampForCount }
            );
            return {
                count:
                    result && result.coinCreateds
                        ? result.coinCreateds.length
                        : 0,
            };
        },
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 30000, // 30 seconds
    });

    const oneHourAgoTimestampForChart = Math.floor(
        (Date.now() - 1 * 60 * 60 * 1000) / 1000
    ).toString();
    const {
        data: lastHourChartRawData,
        isLoading: isLoadingLastHourChart,
        error: errorLastHourChart,
    } = useQuery({
        queryKey: ["coinCreationLastHourChart"],
        queryFn: () =>
            fetchData(GetCoinCreationTimeSeriesDocument, {
                startTime: oneHourAgoTimestampForChart,
                first: 1000,
            }),
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 30000, // 30 seconds
        enabled: !!totalCoinsData, // Depends on totalCoinsData
    });
    const lastHourChartData = processLastHourTimeSeriesData(
        lastHourChartRawData?.coinCreateds
    );

    const {
        data: topCreatorsRawData,
        isLoading: isLoadingTopCreators,
        error: errorTopCreators,
    } = useQuery({
        queryKey: ["topCoinCreators"],
        queryFn: () =>
            fetchData(GetTopCoinCreatorsDocument, {
                /* variables if any, e.g., first: 100 */
            }),
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 300000, // 5 minutes
        enabled: !!totalCoinsData, // Depends on totalCoinsData
        // staleTime: Infinity, // Consider if this data changes infrequently
    });

    const topCreatorsData: CreatorData[] = React.useMemo(() => {
        return processTopCreatorsData(topCreatorsRawData, 10);
    }, [topCreatorsRawData]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-extrabold mb-8 text-center tracking-tight text-white">
                Coin Activity Dashboard
            </h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                <StatCard
                    title="Total Coins Created"
                    isLoading={isLoadingTotalCoins}
                    value={totalCoinsData?.count}
                    error={errorTotalCoins}
                    isApproximate={totalCoinsData?.approximate}
                    approximateText="Count limited by query depth (>5000 skipped)."
                    errorMessage="Error loading total"
                />
                <StatCard
                    title="Avg Coins / Hour (Recent)"
                    isLoading={isLoadingGeneralRecent}
                    value={averageCoinsPerHour}
                    error={errorGeneralRecent}
                    errorMessage="Error loading average"
                />
                <StatCard
                    title="Coins Created (Last Hour)"
                    isLoading={isLoadingCoinsLastHour}
                    value={coinsLastHourData?.count}
                    error={errorCoinsLastHour}
                    errorMessage="Error loading last hour count"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-1 mb-8">
                <CoinCreationLineChart
                    data={lastHourChartData}
                    isLoading={isLoadingLastHourChart}
                    error={errorLastHourChart}
                />
            </div>

            {/* New row for the Top Coin Creators chart */}
            <div className="grid gap-6 md:grid-cols-1 mb-8">
                <TopCreatorsBarChart
                    data={topCreatorsData}
                    isLoading={isLoadingTopCreators}
                    error={errorTopCreators}
                />
            </div>

            <RecentCoinsTable
                data={recentCoinsData}
                isLoading={isLoadingRecentCoins}
                error={errorRecentCoins}
            />
        </div>
    );
}
