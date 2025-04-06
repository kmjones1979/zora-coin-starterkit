"use client";

import { useState, useEffect } from "react";
import { createCoinCall, getCoinCreateFromLogs } from "@zoralabs/coins-sdk";
import { Address as ViemAddress, TransactionReceipt } from "viem";
import {
    useContractWrite,
    useAccount,
    usePublicClient,
    useTransaction,
    useChainId,
    useContractRead,
} from "wagmi";
import { zora } from "viem/chains";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import { FACTORY_ADDRESSES } from "../config/factories";
import { ChainSelector } from "../components/ChainSelector";

// Add token ABI for reading token details
const tokenABI = [
    {
        inputs: [],
        name: "name",
        outputs: [{ name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "symbol",
        outputs: [{ name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "totalSupply",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
] as const;

// Update window type declaration
declare global {
    interface Window {
        handleSwitchToBase?: () => Promise<void>;
    }
}

const ZORA_COIN_FACTORY_ADDRESS = "0x7777777F279eba3d3Ad8F4E708545291A6fDBA8B";
const ZORA_COIN_IMPLEMENTATION_ADDRESS =
    "0x7777777F279eba3d3Ad8F4E708545291A6fDBA8B";

const ZORA_CHAIN_ID = 7777777; // Zora mainnet chain ID

export function CreateZoraCoin() {
    const [mounted, setMounted] = useState(false);
    const {
        address,
        isConnected,
        isConnecting,
        status: accountStatus,
    } = useAccount();
    const chainId = useChainId();
    const publicClient = usePublicClient();
    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [uri, setUri] = useState("");
    const [error, setError] = useState("");
    const [contractAddress, setContractAddress] = useState<ViemAddress | null>(
        null
    );
    const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
    const [status, setStatus] = useState<string>("");
    const [tokenDetails, setTokenDetails] = useState<{
        name: string;
        symbol: string;
        totalSupply: bigint;
    } | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Define coin parameters
    const coinParams = {
        name: name.trim(),
        symbol: symbol.trim(),
        uri: uri.trim(),
        payoutRecipient: address as ViemAddress,
        platformReferrer: address as ViemAddress,
    };

    console.log("Coin params:", coinParams);

    // Create configuration for wagmi
    const contractCallParams = createCoinCall(coinParams);
    console.log("Contract call params:", contractCallParams);

    const {
        writeContract,
        data: hash,
        error: writeError,
        isPending: isWriting,
        reset: resetWriteContract,
    } = useContractWrite({
        mutation: {
            onSuccess: (data) => {
                console.log("Transaction sent:", data);
                setTxHash(data);
                setStatus("Transaction sent, waiting for confirmation...");
            },
            onError: (error) => {
                console.error("Transaction error:", error);
                setError(error.message);
                setStatus("Transaction failed");
            },
        },
    });

    // Wait for transaction to be mined
    const { isLoading: isConfirming, isSuccess } = useTransaction({
        hash: hash || undefined,
        chainId: chainId,
    });

    // Add contract read hooks for token details
    const { data: tokenName, refetch: refetchName } = useContractRead({
        address: contractAddress || undefined,
        abi: tokenABI,
        functionName: "name",
        chainId: zora.id,
    });

    const { data: tokenSymbol, refetch: refetchSymbol } = useContractRead({
        address: contractAddress || undefined,
        abi: tokenABI,
        functionName: "symbol",
        chainId: zora.id,
    });

    const { data: tokenSupply, refetch: refetchSupply } = useContractRead({
        address: contractAddress || undefined,
        abi: tokenABI,
        functionName: "totalSupply",
        chainId: zora.id,
    });

    // Helper function for exponential backoff
    const sleep = (ms: number) =>
        new Promise<void>((resolve) => setTimeout(resolve, ms));

    const retryWithBackoff = async (
        fn: () => Promise<any>,
        maxRetries = 3,
        baseDelay = 1000
    ) => {
        let lastError: Error | undefined;
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error as Error;
                if (
                    error instanceof Error &&
                    error.message.includes("rate limit")
                ) {
                    const delay = baseDelay * Math.pow(2, i); // Exponential backoff
                    console.log(`Rate limit hit, retrying in ${delay}ms...`);
                    await sleep(delay);
                    continue;
                }
                throw error;
            }
        }
        throw lastError;
    };

    // Handle transaction success
    useEffect(() => {
        if (isSuccess && hash) {
            const fetchReceipt = async () => {
                try {
                    const receipt = await retryWithBackoff(
                        async () => {
                            const result =
                                await publicClient?.getTransactionReceipt({
                                    hash,
                                });
                            if (!result) {
                                throw new Error("Receipt not found");
                            }
                            return result;
                        },
                        3, // max retries
                        2000 // base delay of 2 seconds
                    );

                    const coinDeployment = getCoinCreateFromLogs(receipt);
                    if (coinDeployment?.coin) {
                        setContractAddress(coinDeployment.coin);
                        setStatus(
                            "Transaction confirmed! Contract created successfully."
                        );
                    } else {
                        setError(
                            "Could not find coin address in transaction logs."
                        );
                        setStatus(
                            "Transaction confirmed but coin address not found."
                        );
                    }
                } catch (error) {
                    console.error("Error fetching receipt:", error);
                    if (
                        error instanceof Error &&
                        error.message.includes("rate limit")
                    ) {
                        setError(
                            "Rate limit exceeded. Please wait a moment and try again."
                        );
                        // Final retry after longer delay
                        setTimeout(() => {
                            fetchReceipt();
                        }, 10000);
                    } else {
                        setError(
                            error instanceof Error
                                ? error.message
                                : "Failed to fetch transaction receipt"
                        );
                        setStatus("Error fetching transaction receipt.");
                    }
                }
            };
            fetchReceipt();
        }
    }, [isSuccess, hash, publicClient]);

    // Add delay to contract reads
    const fetchTokenDetails = async () => {
        try {
            await retryWithBackoff(
                async () => {
                    if (contractAddress) {
                        await Promise.all([
                            refetchName(),
                            refetchSymbol(),
                            refetchSupply(),
                        ]);
                    }
                },
                3, // max retries
                2000 // base delay of 2 seconds
            );
        } catch (error) {
            console.error("Error fetching token details:", error);
            if (
                error instanceof Error &&
                error.message.includes("rate limit")
            ) {
                setError(
                    "Rate limit exceeded. Please wait a moment and try again."
                );
                // Final retry after longer delay
                setTimeout(() => {
                    fetchTokenDetails();
                }, 10000);
            }
        }
    };

    // Refetch token details when contract is deployed
    useEffect(() => {
        if (isSuccess && contractAddress) {
            console.log("Contract deployed, fetching token details...");
            fetchTokenDetails();
        }
    }, [isSuccess, contractAddress]);

    // Update token details when contract reads complete
    useEffect(() => {
        console.log("Token details update:", {
            contractAddress,
            tokenName,
            tokenSymbol,
            tokenSupply,
        });

        if (contractAddress && tokenName && tokenSymbol && tokenSupply) {
            setTokenDetails({
                name: tokenName,
                symbol: tokenSymbol,
                totalSupply: tokenSupply,
            });
        }
    }, [contractAddress, tokenName, tokenSymbol, tokenSupply]);

    // Reset all states on component mount and when dependencies change
    useEffect(() => {
        const resetStates = () => {
            setError("");
            setStatus("");
            setTxHash(null);
            setContractAddress(null);
            resetWriteContract();
        };

        // Reset immediately
        resetStates();

        // Also reset when the component unmounts
        return () => {
            resetStates();
        };
    }, [resetWriteContract, chainId, address]);

    const getExplorerUrl = (chainId: number) => {
        switch (chainId) {
            case 8453:
                return "https://basescan.org";
            case 7777777:
                return "https://explorer.zora.energy";
            case 10:
                return "https://optimistic.etherscan.io";
            case 42161:
                return "https://arbiscan.io";
            case 81457:
                return "https://blastscan.io";
            default:
                return "https://etherscan.io";
        }
    };

    const handleCreateCoin = async () => {
        try {
            if (!isConnected) {
                throw new Error("Please connect your wallet first");
            }

            if (
                !chainId ||
                !FACTORY_ADDRESSES[chainId as keyof typeof FACTORY_ADDRESSES]
            ) {
                throw new Error(
                    "Please switch to a supported network (Base, Zora, Optimism, Arbitrum, or Blast)"
                );
            }

            setError("");
            setStatus("Preparing to create coin...");

            // Debug current state
            console.log("Creating coin with state:", {
                accountStatus,
                chainId,
                isConnected,
                name: name.trim(),
                symbol: symbol.trim(),
                uri: uri.trim(),
                writeContract: !!writeContract,
                publicClient: !!publicClient,
            });

            if (!name.trim() || !symbol.trim() || !uri.trim()) {
                throw new Error("Please fill in all fields");
            }
            if (!writeContract) {
                throw new Error("Contract write not ready");
            }
            if (!publicClient) {
                throw new Error("Public client not ready");
            }

            setStatus("Sending transaction...");
            console.log("Creating coin with params:", coinParams);

            await writeContract({
                address: contractCallParams.address,
                abi: contractCallParams.abi,
                functionName: contractCallParams.functionName,
                args: contractCallParams.args,
            });

            setStatus("Transaction sent, waiting for confirmation...");
        } catch (error) {
            console.error("Error creating coin:", error);
            setError(
                error instanceof Error ? error.message : "Failed to create coin"
            );
            setStatus("Failed to create coin");
        }
    };

    if (!mounted) {
        return (
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">
                    Create New Zora Coin
                </h2>
                <div className="animate-pulse space-y-4">
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Create New Zora Coin</h2>
            <div className="space-y-4">
                {!isConnected && (
                    <div className="p-4 bg-yellow-50 rounded-md">
                        <p className="text-yellow-700 mb-2">
                            Please connect your wallet to continue.
                        </p>
                        <ConnectButton />
                    </div>
                )}
                {isConnected &&
                    (!chainId ||
                        !FACTORY_ADDRESSES[
                            chainId as keyof typeof FACTORY_ADDRESSES
                        ]) && (
                        <div className="p-4 bg-yellow-50 rounded-md">
                            <p className="text-yellow-700 mb-2">
                                Please switch to a supported network (Base,
                                Zora, Optimism, Arbitrum, or Blast).
                            </p>
                            <ChainSelector />
                        </div>
                    )}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Coin Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="My Awesome Coin"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Symbol
                    </label>
                    <input
                        type="text"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="MAC"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Metadata URI
                    </label>
                    <input
                        type="text"
                        value={uri}
                        onChange={(e) => setUri(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="ipfs://..."
                    />
                </div>
                {(error || writeError) && (
                    <div className="text-red-500 text-sm">
                        {error || writeError?.message}
                    </div>
                )}
                {status && (
                    <div className="text-blue-600 text-sm">{status}</div>
                )}
                <button
                    onClick={handleCreateCoin}
                    disabled={
                        !writeContract ||
                        isWriting ||
                        isConfirming ||
                        accountStatus !== "connected" ||
                        !chainId ||
                        !FACTORY_ADDRESSES[
                            chainId as keyof typeof FACTORY_ADDRESSES
                        ] ||
                        !name.trim() ||
                        !symbol.trim() ||
                        !uri.trim() ||
                        !publicClient
                    }
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={
                        !writeContract
                            ? "Contract write not ready"
                            : isWriting
                            ? "Transaction in progress"
                            : isConfirming
                            ? "Waiting for confirmation"
                            : accountStatus !== "connected"
                            ? "Please connect your wallet"
                            : !chainId
                            ? "No network detected"
                            : !FACTORY_ADDRESSES[
                                  chainId as keyof typeof FACTORY_ADDRESSES
                              ]
                            ? "Please switch to a supported network"
                            : !name.trim()
                            ? "Please enter a coin name"
                            : !symbol.trim()
                            ? "Please enter a symbol"
                            : !uri.trim()
                            ? "Please enter a metadata URI"
                            : !publicClient
                            ? "Public client not ready"
                            : "Create a new Zora coin"
                    }
                >
                    {isWriting || isConfirming ? "Creating..." : "Create Coin"}
                </button>
                {txHash && (
                    <div className="space-y-2 mt-4 p-4 bg-blue-50 rounded-md">
                        <div className="text-blue-600 font-medium">
                            Transaction sent!
                        </div>
                        <div className="text-sm">
                            <div className="font-medium">Transaction Hash:</div>
                            <div className="break-all">{txHash}</div>
                            <a
                                href={`${getExplorerUrl(
                                    chainId || 8453
                                )}/tx/${txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline mt-1 inline-block"
                            >
                                View on Explorer
                            </a>
                        </div>
                    </div>
                )}
                {isSuccess && (
                    <div className="space-y-2 mt-4 p-4 bg-green-50 rounded-md">
                        <div className="text-green-600 font-medium">
                            Coin created successfully!
                        </div>
                        <div className="text-sm">
                            <div className="font-medium">Transaction Hash:</div>
                            <div className="break-all">{hash}</div>
                            <a
                                href={`${getExplorerUrl(
                                    chainId || 8453
                                )}/tx/${hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-800 underline mt-1 inline-block"
                            >
                                View on Explorer
                            </a>
                        </div>
                        {contractAddress && (
                            <>
                                <div className="text-sm">
                                    <div className="font-medium">
                                        Contract Address:
                                    </div>
                                    <div className="break-all">
                                        {contractAddress}
                                    </div>
                                    <a
                                        href={`${getExplorerUrl(
                                            chainId || 8453
                                        )}/address/${contractAddress}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-600 hover:text-green-800 underline mt-1 inline-block"
                                    >
                                        View Contract on Explorer
                                    </a>
                                </div>
                                {!tokenDetails && (
                                    <div className="text-sm mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
                                        <div className="text-yellow-700">
                                            Fetching token details... (This may
                                            take a few seconds)
                                        </div>
                                    </div>
                                )}
                                {tokenDetails && (
                                    <div className="text-sm mt-4 p-3 bg-white rounded border border-green-200">
                                        <div className="font-medium text-green-700 mb-2">
                                            Token Details:
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>Name:</div>
                                            <div className="font-medium">
                                                {tokenDetails.name}
                                            </div>
                                            <div>Symbol:</div>
                                            <div className="font-medium">
                                                {tokenDetails.symbol}
                                            </div>
                                            <div>Total Supply:</div>
                                            <div className="font-medium">
                                                {tokenDetails.totalSupply.toString()}{" "}
                                                tokens
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
