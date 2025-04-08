"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useCoinCreation } from "../hooks/useCoinCreation";
import { useAccount, useChainId } from "wagmi";
import { Address } from "viem";
import { CHAINS } from "../config/chains";

interface TransactionStatusProps {
    transactionHash?: `0x${string}`;
    status?: string;
    name: string;
    symbol: string;
    uri: string;
    chainId: keyof typeof CHAINS;
    tokenAddress?: `0x${string}`;
}

function TransactionStatus({
    transactionHash,
    status = "",
    name,
    symbol,
    uri,
    chainId,
    tokenAddress,
}: TransactionStatusProps) {
    if (!transactionHash) return null;

    const getTransactionStatusColor = (status: string) => {
        if (status.includes("success")) return "text-green-600";
        if (status.includes("failed")) return "text-red-600";
        return "text-yellow-600";
    };

    const getExplorerUrl = (hash: `0x${string}`) => {
        const chain = CHAINS[chainId];
        return chain ? `${chain.explorer}/tx/${hash}` : "#";
    };

    const getTokenExplorerUrl = (address: `0x${string}`) => {
        const chain = CHAINS[chainId];
        return chain ? `${chain.explorer}/address/${address}` : "#";
    };

    return (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Transaction Status</h3>
            <div className="space-y-2">
                <div>
                    <span className="font-medium">Status:</span>{" "}
                    <span className={getTransactionStatusColor(status)}>
                        {status}
                    </span>
                </div>
                <div>
                    <span className="font-medium">Transaction Hash:</span>{" "}
                    <a
                        href={getExplorerUrl(transactionHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-blue-600 hover:text-blue-800"
                    >
                        {transactionHash.slice(0, 6)}...
                        {transactionHash.slice(-4)}
                    </a>
                </div>
                {status.includes("success") && (
                    <div className="mt-4">
                        <h4 className="font-semibold mb-2">Token Created</h4>
                        <div className="space-y-1 text-sm">
                            <div>
                                <span className="font-medium">Name:</span>{" "}
                                {name}
                            </div>
                            <div>
                                <span className="font-medium">Symbol:</span>{" "}
                                {symbol}
                            </div>
                            <div>
                                <span className="font-medium">IPFS Hash:</span>{" "}
                                {uri}
                            </div>
                            {tokenAddress && (
                                <div>
                                    <span className="font-medium">
                                        Token Address:
                                    </span>{" "}
                                    <a
                                        href={getTokenExplorerUrl(tokenAddress)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-mono text-blue-600 hover:text-blue-800"
                                    >
                                        {tokenAddress}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

interface CoinFormProps {
    onSuccess?: (hash: `0x${string}`) => void;
}

export function CoinForm({ onSuccess }: CoinFormProps) {
    const { address } = useAccount();
    const chainId = useChainId() as keyof typeof CHAINS;
    const [name, setName] = useState("My Awesome Coin");
    const [symbol, setSymbol] = useState("MAC");
    const [uri, setUri] = useState("ipfs://Qm...");
    const [error, setError] = useState<string | null>(null);
    const [tokenAddress, setTokenAddress] = useState<`0x${string}` | null>(
        null
    );

    const {
        write,
        isLoading,
        error: contractError,
        transactionHash,
        status,
        tokenAddress: contractTokenAddress,
    } = useCoinCreation({
        name,
        symbol,
        uri,
        owners: undefined,
        tickLower: -199200,
        payoutRecipient:
            address || "0x0000000000000000000000000000000000000000",
        platformReferrer: address || undefined,
        initialPurchaseWei: BigInt(0),
        chainId,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        write?.();
    };

    // Call onSuccess when transaction is complete
    if (transactionHash && status === "success") {
        onSuccess?.(transactionHash);
        setTokenAddress(contractTokenAddress);
    }

    return (
        <div className="card bg-white shadow-xl">
            <div className="card-body">
                <h2 className="card-title">Create New Coin</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Coin Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="My Awesome Coin"
                            required
                            className="text-black"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Example: My Awesome Coin
                        </p>
                    </div>

                    <div>
                        <Label htmlFor="symbol">Symbol</Label>
                        <Input
                            id="symbol"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
                            placeholder="MAC"
                            required
                            className="text-black"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Example: MAC
                        </p>
                    </div>

                    <div>
                        <Label htmlFor="uri">IPFS Hash</Label>
                        <Input
                            id="uri"
                            value={uri}
                            onChange={(e) => setUri(e.target.value)}
                            placeholder="ipfs://Qm..."
                            required
                            className="text-black"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Example:
                            ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco
                        </p>
                    </div>

                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Coin"}
                    </Button>

                    {error && (
                        <div className="text-red-500">Error: {error}</div>
                    )}

                    {contractError && (
                        <div className="text-red-500">
                            Error: {contractError.message}
                        </div>
                    )}
                </form>

                <TransactionStatus
                    transactionHash={transactionHash}
                    status={status}
                    name={name}
                    symbol={symbol}
                    uri={uri}
                    chainId={chainId}
                    tokenAddress={tokenAddress || undefined}
                />
            </div>
        </div>
    );
}
