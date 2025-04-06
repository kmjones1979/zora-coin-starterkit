import { useState } from "react";
import { useContractWrite, useTransaction } from "wagmi";
import { createCoinCall } from "@zoralabs/coins-sdk";
import { zora } from "viem/chains";
import { Address as ViemAddress } from "viem";

interface UseCoinCreationProps {
    name: string;
    symbol: string;
    initialSupply: bigint;
    address: ViemAddress;
}

export function useCoinCreation({
    name,
    symbol,
    initialSupply,
    address,
}: UseCoinCreationProps) {
    const [error, setError] = useState<Error | null>(null);
    const [status, setStatus] = useState<string>("");

    const coinParams = {
        name: name.trim(),
        symbol: symbol.trim(),
        uri: "",
        payoutRecipient: address,
        platformReferrer: address,
    };

    const contractCallParams = createCoinCall(coinParams);

    const {
        writeContract,
        data: hash,
        isPending: isLoading,
    } = useContractWrite({
        mutation: {
            onSuccess: () => {
                setStatus("Transaction sent, waiting for confirmation...");
            },
            onError: (err) => {
                setError(err);
                setStatus("Transaction failed");
            },
        },
    });

    const { isSuccess } = useTransaction({
        hash: hash || undefined,
        chainId: zora.id,
    });

    const resetTransaction = () => {
        setError(null);
        setStatus("");
    };

    const write = () => {
        writeContract({
            address: contractCallParams.address,
            abi: contractCallParams.abi,
            functionName: contractCallParams.functionName,
            args: contractCallParams.args,
            chainId: zora.id,
        });
    };

    return {
        write,
        isLoading,
        error,
        transactionHash: hash,
        status,
        isSuccess,
        resetTransaction,
    };
}
