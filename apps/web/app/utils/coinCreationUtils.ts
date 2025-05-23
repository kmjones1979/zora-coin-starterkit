import { createCoinCall, getCoinCreateFromLogs } from "@zoralabs/coins-sdk";
import { Address, Hex, createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { CHAINS } from "../config/chains";

export interface CoinCreationParams {
    name: string;
    symbol: string;
    uri: string;
    payoutRecipient: Address;
    platformReferrer?: Address;
    initialPurchaseWei?: bigint;
    chainId: number;
}

export interface CoinCreationResult {
    transactionHash: Hex;
    coinAddress?: Address;
}

/**
 * Core coin creation logic extracted from useCoinCreation hook
 * Can be used by both React components and server-side providers
 */
export async function createCoinTransaction(
    params: CoinCreationParams,
    sendTransaction: (txParams: {
        to: Address;
        data: Hex;
        value?: bigint;
    }) => Promise<Hex>
): Promise<CoinCreationResult> {
    const {
        name,
        symbol,
        uri,
        payoutRecipient,
        platformReferrer,
        initialPurchaseWei = BigInt(0),
        chainId,
    } = params;

    // Get the factory address for the chain
    const selectedChainConfig = CHAINS[chainId as keyof typeof CHAINS];
    if (!selectedChainConfig || !selectedChainConfig.factory) {
        throw new Error(`Unsupported chainId: ${chainId}`);
    }

    // Make names unique to avoid conflicts
    const timestamp = Date.now().toString().slice(-6);
    const uniqueName = `${name.trim()} ${timestamp}`;
    const uniqueSymbol = `${symbol.trim()}${timestamp}`;

    // Prepare coin parameters (same as useCoinCreation hook)
    const coinParams = {
        name: uniqueName,
        symbol: uniqueSymbol,
        uri: uri.trim(),
        owners: [payoutRecipient],
        payoutRecipient,
        platformReferrer: payoutRecipient,
        initialPurchaseWei,
        factoryAddress: selectedChainConfig.factory as `0x${string}`,
        chainId,
    };

    console.log("[CoinCreation] Using Zora SDK createCoinCall with params:", {
        ...coinParams,
        initialPurchaseWei: initialPurchaseWei.toString(),
    });

    // Use createCoinCall from Zora SDK (same as useCoinCreation hook)
    const contractCallParams = await createCoinCall(coinParams);

    console.log("[CoinCreation] Contract call params:", {
        address: contractCallParams.address,
        factoryAddress: selectedChainConfig.factory,
        chainId,
        functionName: contractCallParams.functionName,
        argsLength: contractCallParams.args?.length || 0,
        data: contractCallParams.data?.slice(0, 20) + "...", // Show first part of data
    });

    // Log the difference between expected and actual addresses
    if (contractCallParams.address !== selectedChainConfig.factory) {
        console.log(
            "[CoinCreation] WARNING: SDK returned different address than expected!"
        );
        console.log(`  Expected: ${selectedChainConfig.factory}`);
        console.log(`  SDK returned: ${contractCallParams.address}`);
        console.log(
            "  Using factory address from chains config (like useCoinCreation hook)"
        );
    }

    // Send the transaction using the factory address from chains config
    // (not the address returned by SDK, just like useCoinCreation hook)
    const txHash = await sendTransaction({
        to: selectedChainConfig.factory as Address,
        data: contractCallParams.data,
        value: initialPurchaseWei,
    });

    console.log(`[CoinCreation] Transaction sent: ${txHash}`);

    // Extract coin address from transaction receipt
    try {
        const publicClient = createPublicClient({
            chain: base,
            transport: http(),
        });

        const receipt = await publicClient.waitForTransactionReceipt({
            hash: txHash,
        });

        if (receipt.status === "success") {
            const coinDeployment = getCoinCreateFromLogs(receipt);
            if (coinDeployment?.coin) {
                console.log(
                    `[CoinCreation] Coin deployed at: ${coinDeployment.coin}`
                );
                return {
                    transactionHash: txHash,
                    coinAddress: coinDeployment.coin,
                };
            } else {
                console.log(
                    "[CoinCreation] Transaction successful but couldn't extract coin address"
                );
            }
        } else {
            console.log("[CoinCreation] Transaction failed");
        }
    } catch (receiptError: any) {
        console.log(
            `[CoinCreation] Error getting receipt: ${receiptError.message}`
        );
    }

    return { transactionHash: txHash };
}
