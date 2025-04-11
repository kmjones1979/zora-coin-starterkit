"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { useCoinCreation } from "../hooks/useCoinCreation";
import { useAccount, useChainId } from "wagmi";
import { Address, parseEther, formatEther } from "viem";
import { CHAINS } from "../config/chains";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "./ui/card";

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
    const [performInitialPurchase, setPerformInitialPurchase] = useState(false);
    const [initialEthAmount, setInitialEthAmount] = useState("0");
    const [initialWeiAmount, setInitialWeiAmount] = useState<bigint>(BigInt(0));

    useEffect(() => {
        try {
            if (
                initialEthAmount &&
                !isNaN(parseFloat(initialEthAmount)) &&
                parseFloat(initialEthAmount) >= 0
            ) {
                const wei = parseEther(initialEthAmount as `${number}`);
                setInitialWeiAmount(wei);
                setError(null);
            } else if (initialEthAmount === "") {
                setInitialWeiAmount(BigInt(0));
            } else {
                if (initialEthAmount !== "." && initialEthAmount !== "") {
                    setError("Invalid ETH amount");
                }
                setInitialWeiAmount(BigInt(0));
            }
        } catch (e) {
            setError("Invalid ETH amount format");
            setInitialWeiAmount(BigInt(0));
        }
    }, [initialEthAmount]);

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
        payoutRecipient:
            address || "0x0000000000000000000000000000000000000000",
        platformReferrer: address || undefined,
        initialPurchaseWei: performInitialPurchase
            ? initialWeiAmount
            : BigInt(0),
        chainId,
    });

    const handleEthAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setInitialEthAmount(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (
            performInitialPurchase &&
            initialWeiAmount <= BigInt(0) &&
            initialEthAmount !== "0" &&
            initialEthAmount !== ""
        ) {
            setError("Initial purchase amount must be greater than 0 ETH.");
            return;
        }
        setError(null);

        if (performInitialPurchase) {
            console.log(
                "[Debug] Attempting initial purchase with Wei amount:",
                initialWeiAmount.toString()
            );
        } else {
            console.log("[Debug] No initial purchase requested.");
        }

        write?.();
    };

    if (transactionHash && status === "success") {
        onSuccess?.(transactionHash);
    }

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg">
            <CardHeader className="space-y-1">
                <CardTitle className="text-3xl font-semibold text-foreground">
                    Create New Coin
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                    Deploy your own ERC20 token on Zora
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="name">Coin Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="My Awesome Coin"
                            required
                            className="text-foreground"
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
                            className="text-foreground"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Example: MAC
                        </p>
                    </div>

                    <div>
                        <Label htmlFor="uri">IPFS Hash (Metadata)</Label>
                        <Input
                            id="uri"
                            value={uri}
                            onChange={(e) => setUri(e.target.value)}
                            placeholder="ipfs://Qm..."
                            required
                            className="text-foreground"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Example:
                            ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco
                        </p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="initialPurchase"
                            checked={performInitialPurchase}
                            onCheckedChange={(checked: boolean) =>
                                setPerformInitialPurchase(Boolean(checked))
                            }
                        />
                        <Label
                            htmlFor="initialPurchase"
                            className="cursor-pointer"
                        >
                            Perform Initial Purchase?
                        </Label>
                    </div>

                    {performInitialPurchase && (
                        <div className="space-y-2">
                            <Label htmlFor="ethAmount">
                                Initial Purchase (ETH)
                            </Label>
                            <div className="flex items-center space-x-2">
                                <Input
                                    id="ethAmount"
                                    type="text"
                                    value={initialEthAmount}
                                    onChange={handleEthAmountChange}
                                    placeholder="0.01"
                                    className="text-foreground w-1/2"
                                />
                                <span
                                    className="text-sm text-muted-foreground flex-shrink-0"
                                    title={initialWeiAmount.toString() + " Wei"}
                                >
                                    ≈ {formatEther(initialWeiAmount)} ETH *
                                    <br />
                                    <i className="text-xs">
                                        (Calculated:{" "}
                                        {initialWeiAmount.toString()} Wei)
                                    </i>
                                </span>
                            </div>
                            {error &&
                                (initialEthAmount !== "" ||
                                    !performInitialPurchase) && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {error}
                                    </p>
                                )}
                            <p className="text-xs text-muted-foreground mt-1">
                                * Enter the amount of ETH to spend on the
                                initial purchase.
                            </p>
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={
                            isLoading || (performInitialPurchase && !!error)
                        }
                    >
                        {isLoading ? "Creating..." : "Create Coin"}
                    </Button>

                    {contractError && (
                        <div className="text-red-500 mt-2">
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
                    tokenAddress={contractTokenAddress || undefined}
                />
            </CardContent>
        </Card>
    );
}
