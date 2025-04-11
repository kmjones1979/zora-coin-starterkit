import { useState, useEffect } from "react";
import {
    useContractWrite,
    useTransaction,
    usePublicClient,
    useAccount,
    useChainId,
} from "wagmi";
import { waitForTransaction } from "wagmi/actions";
import { createCoinCall, getCoinCreateFromLogs } from "@zoralabs/coins-sdk";
import {
    zora,
    base,
    optimism,
    arbitrum,
    blast,
    baseSepolia,
} from "viem/chains";
import { Address as ViemAddress, TransactionReceipt, Log } from "viem";
import { CHAINS } from "../config/chains";
import { http } from "viem";
import { useDebug } from "../contexts/DebugContext";

interface UseCoinCreationProps {
    name: string;
    symbol: string;
    uri: string;
    owners?: ViemAddress[];
    payoutRecipient: ViemAddress;
    platformReferrer?: ViemAddress;
    initialPurchaseWei?: bigint;
    chainId: number;
}

const CHAIN_CONFIGS = {
    [zora.id]: zora,
    [base.id]: base,
    [baseSepolia.id]: baseSepolia,
    [optimism.id]: optimism,
    [arbitrum.id]: arbitrum,
    [blast.id]: blast,
};

export function useCoinCreation({
    name,
    symbol,
    uri,
    owners,
    payoutRecipient,
    platformReferrer,
    initialPurchaseWei = BigInt(0),
    chainId,
}: UseCoinCreationProps) {
    const [error, setError] = useState<Error | null>(null);
    const [status, setStatus] = useState<string>("");
    const [tokenAddress, setTokenAddress] = useState<ViemAddress | null>(null);
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const { isDebug } = useDebug();

    const coinParams = {
        name: name.trim(),
        symbol: symbol.trim(),
        uri: uri.trim(),
        owners: [payoutRecipient],
        payoutRecipient,
        platformReferrer: payoutRecipient,
        initialPurchaseWei,
        factoryAddress: CHAINS[chainId as keyof typeof CHAINS]
            .factory as `0x${string}`,
    };

    if (isDebug) {
        console.log("Coin creation parameters:", {
            ...coinParams,
            initialPurchaseWei: initialPurchaseWei.toString(),
        });
    }

    const {
        writeContract,
        data: hash,
        isPending: isLoading,
        error: writeError,
    } = useContractWrite({
        mutation: {
            onSuccess: () => {
                if (isDebug) {
                    console.log("Transaction sent with hash:", hash);
                }
                setStatus(
                    "Transaction sent! Please check the explorer for confirmation."
                );
            },
            onError: (err) => {
                if (isDebug) {
                    console.error("Transaction failed:", err);
                }
                if (err.message?.includes("insufficient funds")) {
                    setStatus("Transaction failed: Insufficient funds for gas");
                } else if (err.message?.includes("user rejected")) {
                    setStatus("Transaction cancelled by user");
                } else if (err.message?.includes("nonce")) {
                    setStatus(
                        "Transaction failed: Nonce error. Please try again."
                    );
                } else {
                    setStatus(`Transaction failed: ${err.message}`);
                }
            },
        },
    });

    const { data: transactionData, isSuccess } = useTransaction({
        hash: hash || undefined,
        chainId,
    });

    useEffect(() => {
        if (hash) {
            if (isDebug) {
                console.log("Transaction sent with hash:", hash);
            }
            setStatus(`Transaction sent! Hash: ${hash}`);
        }
    }, [hash, isDebug]);

    useEffect(() => {
        if (writeError) {
            if (isDebug) {
                console.error("Write error:", writeError);
            }
            setStatus(`Error: ${writeError.message}`);
        }
    }, [writeError, isDebug]);

    useEffect(() => {
        const handleTransactionReceipt = async () => {
            if (hash && publicClient) {
                try {
                    const receipt =
                        await publicClient.waitForTransactionReceipt({
                            hash,
                        });

                    if (receipt.status === "success") {
                        setError(null);
                        const coinDeployment = getCoinCreateFromLogs(receipt);
                        if (coinDeployment?.coin) {
                            setTokenAddress(coinDeployment.coin);
                            setStatus("Coin created successfully!");
                        } else {
                            setError(
                                new Error(
                                    "Failed to extract coin address from transaction receipt"
                                )
                            );
                            setStatus(
                                "Transaction successful but failed to get coin address"
                            );
                        }
                    } else {
                        setError(new Error("Transaction failed"));
                        setStatus("Transaction failed");
                    }
                } catch (err) {
                    if (isDebug) {
                        console.error(
                            "Error processing transaction receipt:",
                            err
                        );
                    }
                    setError(err as Error);
                    setStatus("Error processing transaction receipt");
                }
            }
        };

        handleTransactionReceipt();
    }, [hash, publicClient, isDebug]);

    const resetTransaction = () => {
        setError(null);
        setStatus("");
        setTokenAddress(null);
    };

    const write = async () => {
        try {
            const contractCallParams = await createCoinCall(coinParams);
            if (isDebug) {
                console.log("Contract call parameters:", {
                    address: contractCallParams.address,
                    factoryAddress:
                        CHAINS[chainId as keyof typeof CHAINS].factory,
                    chainId,
                    abi: contractCallParams.abi,
                    functionName: contractCallParams.functionName,
                    args: contractCallParams.args,
                });
            }
            writeContract({
                address: CHAINS[chainId as keyof typeof CHAINS]
                    .factory as `0x${string}`,
                abi: contractCallParams.abi,
                functionName: contractCallParams.functionName,
                args: contractCallParams.args,
                value: initialPurchaseWei,
            });
        } catch (err) {
            setError(err as Error);
            setStatus("Transaction failed");
        }
    };

    return {
        write,
        isLoading,
        error,
        transactionHash: hash,
        status,
        isSuccess: !!transactionData,
        tokenAddress,
        resetTransaction,
    };
}
