import { useState, useEffect } from "react";
import {
    useContractWrite,
    useTransaction,
    usePublicClient,
    useAccount,
    useChainId,
} from "wagmi";
import { waitForTransaction } from "wagmi/actions";
import { createCoinCall } from "@zoralabs/coins-sdk";
import { zora, base, optimism, arbitrum, blast } from "viem/chains";
import { Address as ViemAddress, TransactionReceipt, Log } from "viem";

interface UseCoinCreationProps {
    name: string;
    symbol: string;
    uri: string;
    owners?: ViemAddress[];
    tickLower?: number;
    payoutRecipient: ViemAddress;
    platformReferrer?: ViemAddress;
    initialPurchaseWei?: bigint;
    chainId: number;
}

const CHAIN_CONFIGS = {
    [zora.id]: zora,
    [base.id]: base,
    [optimism.id]: optimism,
    [arbitrum.id]: arbitrum,
    [blast.id]: blast,
};

export function useCoinCreation({
    name,
    symbol,
    uri,
    owners,
    tickLower = -199200,
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

    const coinParams = {
        name: name.trim(),
        symbol: symbol.trim(),
        uri: uri.trim(),
        owners: [payoutRecipient],
        tickLower,
        payoutRecipient,
        platformReferrer: payoutRecipient,
        initialPurchaseWei,
    };

    console.log("Coin creation parameters:", {
        ...coinParams,
        initialPurchaseWei: initialPurchaseWei.toString(),
    });

    const contractCallParams = createCoinCall(coinParams);
    console.log("Contract call parameters:", contractCallParams);

    const {
        writeContract,
        data: hash,
        isPending: isLoading,
        error: writeError,
    } = useContractWrite({
        mutation: {
            onSuccess: () => {
                console.log("Transaction sent with hash:", hash);
                setStatus(
                    "Transaction sent! Please check the explorer for confirmation."
                );
            },
            onError: (err) => {
                console.error("Transaction failed:", err);
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
            console.log("Transaction sent with hash:", hash);
            setStatus(`Transaction sent! Hash: ${hash}`);
        }
    }, [hash]);

    useEffect(() => {
        if (writeError) {
            console.error("Write error:", writeError);
            setStatus(`Error: ${writeError.message}`);
        }
    }, [writeError]);

    const resetTransaction = () => {
        setError(null);
        setStatus("");
        setTokenAddress(null);
    };

    const write = () => {
        try {
            writeContract({
                address: contractCallParams.address,
                abi: contractCallParams.abi,
                functionName: contractCallParams.functionName,
                args: contractCallParams.args,
                chainId,
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
