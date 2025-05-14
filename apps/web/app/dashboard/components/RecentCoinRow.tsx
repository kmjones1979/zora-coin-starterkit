"use client";

import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

// Define the shape of the coin object based on its usage in page.tsx
interface Coin {
    id: string;
    name: string;
    symbol: string;
    currency: string | null;
    blockTimestamp: string;
    coin: string; // Address of the coin
    pool: string; // Address of the pool
    payoutRecipient: string;
    platformReferrer: string | null;
    uri: string; // Metadata URI
}

interface RecentCoinRowProps {
    coin: Coin;
    isExpanded: boolean;
    onToggleExpand: () => void;
}

const RecentCoinRow: React.FC<RecentCoinRowProps> = ({
    coin,
    isExpanded,
    onToggleExpand,
}) => {
    return (
        <React.Fragment>
            <TableRow className="border-b">
                <TableCell>{coin.name}</TableCell>
                <TableCell>{coin.symbol}</TableCell>
                <TableCell className="font-mono text-xs">
                    {coin.currency
                        ? `${coin.currency.substring(0, 6)}...${coin.currency.substring(coin.currency.length - 4)}`
                        : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                    {new Date(
                        parseInt(coin.blockTimestamp) * 1000
                    ).toLocaleTimeString()}
                </TableCell>
                <TableCell className="text-center">
                    <Button variant="ghost" size="sm" onClick={onToggleExpand}>
                        {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </Button>
                </TableCell>
            </TableRow>
            {isExpanded && (
                <TableRow>
                    <TableCell colSpan={5} className="p-0">
                        <div className="p-4 bg-muted/20 text-sm">
                            <p>
                                <strong>Coin Address:</strong>{" "}
                                <span className="font-mono text-xs">
                                    {coin.coin}
                                </span>
                            </p>
                            <p>
                                <strong>Pool Address:</strong>{" "}
                                <span className="font-mono text-xs">
                                    {coin.pool}
                                </span>
                            </p>
                            <p>
                                <strong>Payout Recipient:</strong>{" "}
                                <span className="font-mono text-xs">
                                    {coin.payoutRecipient}
                                </span>
                            </p>
                            <p>
                                <strong>Platform Referrer:</strong>{" "}
                                <span className="font-mono text-xs">
                                    {coin.platformReferrer || "N/A"}
                                </span>
                            </p>
                            <p>
                                <strong>Metadata URI:</strong>{" "}
                                <a
                                    href={coin.uri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:underline break-all"
                                >
                                    {coin.uri}
                                </a>
                            </p>
                        </div>
                    </TableCell>
                </TableRow>
            )}
        </React.Fragment>
    );
};

export default RecentCoinRow;
