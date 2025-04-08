"use client";

import { useState, useEffect } from "react";
import {
    getCoinsNew,
    getCoinsTopGainers,
    getCoinsTopVolume24h,
    getCoinsMostValuable,
    getCoinsLastTraded,
    getCoinsLastTradedUnique,
} from "@zoralabs/coins-sdk";
import { useChainId } from "wagmi";
import { CHAINS } from "../config/chains";
import { ExploreTypeSelector, ExploreQueryType } from "./ExploreTypeSelector";

interface Coin {
    name: string;
    symbol: string;
    address: string;
    createdAt: string;
    creatorAddress: string;
    marketCap?: string;
    chainId: number;
    volume24h?: string;
    uniqueHolders?: number;
    marketCapDelta24h?: string;
}

interface GetCoinsProps {
    count?: number;
    after?: string;
    initialType?: ExploreQueryType;
}

export function GetCoins({
    count = 10,
    after,
    initialType = "new",
}: GetCoinsProps) {
    const [coins, setCoins] = useState<Coin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [type, setType] = useState<ExploreQueryType>(initialType);
    const chainId = useChainId();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const fetchGetCoins = async () => {
            try {
                setLoading(true);
                setError(null);

                // Check if the current chain is supported
                if (!chainId || !(chainId in CHAINS)) {
                    console.log("Unsupported chain:", chainId);
                    setError("Please switch to a supported network");
                    setLoading(false);
                    return;
                }

                console.log(
                    "Fetching coins for chain:",
                    chainId,
                    CHAINS[chainId as keyof typeof CHAINS]?.name,
                    "with type:",
                    type
                );

                let response;
                switch (type) {
                    case "new":
                        response = await getCoinsNew({ count, after });
                        break;
                    case "topGainers":
                        response = await getCoinsTopGainers({ count, after });
                        break;
                    case "topVolume":
                        response = await getCoinsTopVolume24h({ count, after });
                        break;
                    case "mostValuable":
                        response = await getCoinsMostValuable({ count, after });
                        break;
                    case "lastTraded":
                        response = await getCoinsLastTraded({ count, after });
                        break;
                    case "lastTradedUnique":
                        response = await getCoinsLastTradedUnique({
                            count,
                            after,
                        });
                        break;
                    default:
                        response = await getCoinsNew({ count, after });
                }

                if (!response) {
                    throw new Error("Failed to fetch coins");
                }
                console.log("API Response:", JSON.stringify(response, null, 2));

                if (response.data?.exploreList?.edges) {
                    const fetchedCoins = response.data.exploreList.edges
                        .map((edge: any) => ({
                            name: edge.node.name,
                            symbol: edge.node.symbol,
                            address: edge.node.address,
                            createdAt: edge.node.createdAt,
                            creatorAddress: edge.node.creatorAddress,
                            marketCap: edge.node.marketCap,
                            chainId: edge.node.chainId,
                            volume24h: edge.node.volume24h,
                            uniqueHolders: edge.node.uniqueHolders,
                            marketCapDelta24h: edge.node.marketCapDelta24h,
                        }))
                        .sort(
                            (a: Coin, b: Coin) =>
                                new Date(b.createdAt).getTime() -
                                new Date(a.createdAt).getTime()
                        );
                    console.log("Processed coins:", fetchedCoins);
                    setCoins(fetchedCoins);
                } else {
                    console.log(
                        "No coins found in response. Response structure:",
                        {
                            hasData: !!response.data,
                            hasExploreList: !!response.data?.exploreList,
                            hasEdges: !!response.data?.exploreList?.edges,
                            edgesLength:
                                response.data?.exploreList?.edges?.length,
                        }
                    );
                    setError("No coins found on this network");
                }
            } catch (err) {
                console.error("Error fetching coins:", err);
                setError("Failed to fetch coins");
            } finally {
                setLoading(false);
            }
        };

        if (mounted) {
            fetchGetCoins();
        }
    }, [chainId, mounted, count, after, type]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split("T")[0]; // YYYY-MM-DD format
    };

    const getTitle = () => {
        switch (type) {
            case "new":
                return "New Coins";
            case "topGainers":
                return "Top Gainers";
            case "topVolume":
                return "Top Volume";
            case "mostValuable":
                return "Most Valuable";
            case "lastTraded":
                return "Recently Traded";
            case "lastTradedUnique":
                return "Recently Traded by Unique Traders";
            default:
                return "Coins";
        }
    };

    if (!mounted) {
        return null;
    }

    if (loading) {
        return (
            <div className="p-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">{getTitle()}</h2>
                <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-20 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">{getTitle()}</h2>
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-black">
                    {getTitle()}
                </h2>
                <ExploreTypeSelector value={type} onValueChange={setType} />
            </div>
            {!chainId || !(chainId in CHAINS) ? (
                <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-yellow-700">
                        Please switch to a supported network (Base, Zora,
                        Optimism, Arbitrum, or Blast).
                    </p>
                </div>
            ) : coins.length === 0 ? (
                <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-yellow-700">
                        No coins found. Try checking back later.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {coins.map((coin, index) => (
                        <div
                            key={index}
                            className="p-4 border rounded-lg hover:bg-gray-50"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-medium text-black">
                                        {coin.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {coin.symbol}
                                    </p>
                                </div>
                                <div className="text-sm text-gray-600">
                                    {formatDate(coin.createdAt)}
                                </div>
                            </div>
                            <div className="mt-3 text-sm space-y-2">
                                <p className="text-gray-600">
                                    Chain:{" "}
                                    {CHAINS[coin.chainId as keyof typeof CHAINS]
                                        ?.name || "Unknown Chain"}
                                </p>
                                <p className="text-gray-600">
                                    Creator: {coin.creatorAddress.slice(0, 6)}
                                    ...
                                    {coin.creatorAddress.slice(-4)}
                                </p>
                                <p className="text-gray-600">
                                    Contract: {coin.address.slice(0, 6)}...
                                    {coin.address.slice(-4)}
                                </p>
                                {coin.marketCap && (
                                    <p className="text-gray-600">
                                        Market Cap: {coin.marketCap}
                                    </p>
                                )}
                                {coin.volume24h && (
                                    <p className="text-gray-600">
                                        24h Volume: {coin.volume24h}
                                    </p>
                                )}
                                {coin.uniqueHolders && (
                                    <p className="text-gray-600">
                                        Holders: {coin.uniqueHolders}
                                    </p>
                                )}
                                {coin.marketCapDelta24h && (
                                    <p className="text-gray-600">
                                        24h Change: {coin.marketCapDelta24h}%
                                    </p>
                                )}
                                <a
                                    href={`${
                                        CHAINS[chainId as keyof typeof CHAINS]
                                            .explorer
                                    }/address/${coin.address}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 mt-2 inline-block"
                                >
                                    View on Explorer
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
