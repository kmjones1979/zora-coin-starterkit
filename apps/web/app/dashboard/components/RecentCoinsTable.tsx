"use client";

import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RecentCoinRow from "./RecentCoinRow";
import { type } from "os";

// Re-define or import the Coin type if not already globally available or imported
// For now, assuming Coin type is similar to what's in RecentCoinRow
interface Coin {
    id: string;
    name: string;
    symbol: string;
    currency: string | null;
    blockTimestamp: string;
    coin: string;
    pool: string;
    payoutRecipient: string;
    platformReferrer: string | null;
    uri: string;
}

interface RecentCoinsTableProps {
    data?: { coinCreateds?: Coin[] } | null; // Match structure from page.tsx
    isLoading: boolean;
    error?: Error | null;
}

const RecentCoinsTable: React.FC<RecentCoinsTableProps> = ({
    data,
    isLoading,
    error,
}) => {
    const [expandedCoinId, setExpandedCoinId] = useState<string | null>(null);

    const handleToggleExpand = (coinId: string) => {
        setExpandedCoinId(expandedCoinId === coinId ? null : coinId);
    };

    const coins = data?.coinCreateds || [];

    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle>Recently Created Coins</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading && <p>Loading recent coins...</p>}
                {error && (
                    <p className="text-red-500">Error loading recent coins.</p>
                )}
                {!isLoading && !error && coins.length > 0 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">
                                    Name
                                </TableHead>
                                <TableHead>Symbol</TableHead>
                                <TableHead>Currency</TableHead>
                                <TableHead className="text-right">
                                    Created At
                                </TableHead>
                                <TableHead className="w-[80px] text-center">
                                    Details
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {coins.map((coin: Coin) => (
                                <RecentCoinRow
                                    key={coin.id}
                                    coin={coin}
                                    isExpanded={expandedCoinId === coin.id}
                                    onToggleExpand={() =>
                                        handleToggleExpand(coin.id)
                                    }
                                />
                            ))}
                        </TableBody>
                    </Table>
                )}
                {!isLoading && !error && coins.length === 0 && (
                    <p>No recent coins to display.</p>
                )}
            </CardContent>
        </Card>
    );
};

export default RecentCoinsTable;
