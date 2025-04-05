"use client";

import { useState, useEffect } from "react";
import { getCoinsNew } from "@zoralabs/coins-sdk";
import { sepolia } from "viem/chains";

interface Coin {
    name: string;
    symbol: string;
    address: string;
    createdAt: string;
    creatorAddress: string;
    marketCap?: string;
}

export function RecentCoins() {
    const [coins, setCoins] = useState<Coin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecentCoins = async () => {
            try {
                setLoading(true);
                const response = await getCoinsNew({
                    count: 10,
                });

                if (response.data?.exploreList?.edges) {
                    const recentCoins = response.data.exploreList.edges.map(
                        (edge: any) => ({
                            name: edge.node.name,
                            symbol: edge.node.symbol,
                            address: edge.node.address,
                            createdAt: edge.node.createdAt,
                            creatorAddress: edge.node.creatorAddress,
                            marketCap: edge.node.marketCap,
                        })
                    );
                    setCoins(recentCoins);
                }
            } catch (err) {
                console.error("Error fetching recent coins:", err);
                setError("Failed to fetch recent coins");
            } finally {
                setLoading(false);
            }
        };

        fetchRecentCoins();
    }, []);

    if (loading) {
        return (
            <div className="p-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Recent Coins</h2>
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
                <h2 className="text-xl font-semibold mb-4">Recent Coins</h2>
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Coins</h2>
            <div className="space-y-4">
                {coins.map((coin, index) => (
                    <div
                        key={index}
                        className="p-4 border rounded-lg hover:bg-gray-50"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-medium">{coin.name}</h3>
                                <p className="text-sm text-gray-500">
                                    {coin.symbol}
                                </p>
                            </div>
                            <div className="text-sm text-gray-500">
                                {new Date(coin.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                        <div className="mt-2 text-sm">
                            <p className="text-gray-600">
                                Creator: {coin.creatorAddress.slice(0, 6)}...
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
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
