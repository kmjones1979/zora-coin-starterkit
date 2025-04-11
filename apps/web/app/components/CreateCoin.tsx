"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { CoinForm } from "./CoinForm";
import { TokenDetails } from "./TokenDetails";
import { useRetry } from "../hooks/useRetry";
import { getCoinsNew } from "@zoralabs/coins-sdk";

interface Coin {
    id: string;
    address: `0x${string}`;
    name: string;
    symbol: string;
}

export function CreateCoin() {
    const { address } = useAccount();
    const [recentCoins, setRecentCoins] = useState<Coin[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchRecentCoins = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await useRetry(() => getCoinsNew({ count: 10 }));
            if (response?.data?.exploreList?.edges) {
                setRecentCoins(
                    response.data.exploreList.edges.map((edge: any) => ({
                        ...edge.node,
                        address: edge.node.address as `0x${string}`,
                    }))
                );
            }
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-12">
            <div className="space-y-6">
                <CoinForm onSuccess={fetchRecentCoins} />
            </div>

            <div className="space-y-6">
                {isLoading && <div>Loading recent coins...</div>}
                {error && (
                    <div className="text-red-500">
                        Error loading coins: {error.message}
                    </div>
                )}
                {recentCoins.map((coin) => (
                    <div key={coin.id} className="border p-4 rounded-lg">
                        <TokenDetails contractAddress={coin.address} />
                    </div>
                ))}
            </div>
        </div>
    );
}
