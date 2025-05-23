import {
    ActionProvider,
    CreateAction,
    EvmWalletProvider,
    Network,
} from "@coinbase/agentkit";
import { z } from "zod";
import {
    type Hex,
    type Address,
    parseEther,
    isAddress,
    encodeFunctionData,
} from "viem";
import { createCoinCall, getCoinCreateFromLogs } from "@zoralabs/coins-sdk";
import { CHAINS } from "../../../../config/chains";

// TODO: Ensure AGENT_PRIVATE_KEY is set in your environment for the agent to sign transactions.

const CreateZoraCoinSchema = z.object({
    chainId: z
        .number()
        .describe(
            "The chain ID where the coin will be created (e.g., 8453 for Base, 7777777 for Zora)."
        ),
    name: z
        .string()
        .describe("The name of the coin (e.g., 'My Awesome Coin')."),
    symbol: z.string().describe("The symbol for the coin (e.g., 'MAC')."),
    uri: z
        .string()
        .describe(
            "The URI for the coin metadata (e.g., 'ipfs://Qm...'). Must be a valid IPFS or HTTP(S) URI."
        ),
    payoutRecipient: z
        .string()
        .describe(
            "The Ethereum address that will receive payouts. Must be a valid 0x address."
        ),
    platformReferrer: z
        .string()
        .optional()
        .describe(
            "Optional. The Ethereum address of the platform referrer. Must be a valid 0x address."
        ),
    initialPurchaseEth: z
        .string()
        .optional()
        .describe(
            "Optional. The amount of ETH for an initial purchase, as a string (e.g., '0.01'). Defaults to 0."
        ),
});

class ZoraCoinCreatorProvider extends ActionProvider<EvmWalletProvider> {
    constructor() {
        super("zora-coin-creator", []);
    }

    // Required by ActionProvider
    supportsNetwork = (network: Network): boolean => {
        // This provider can support any chain defined in CHAINS with a factory
        return !!CHAINS[Number(network.chainId) as keyof typeof CHAINS]
            ?.factory;
    };

    @CreateAction({
        name: "createZoraCoin",
        description:
            "Creates a new Zora coin on the specified chain with the given parameters using the canonical Zora factory contract.",
        schema: CreateZoraCoinSchema,
    })
    async createZoraCoin(
        walletProvider: EvmWalletProvider,
        args: z.infer<typeof CreateZoraCoinSchema>
    ): Promise<{
        transactionHash?: Hex;
        error?: string;
        coinAddress?: Address;
    }> {
        console.log(
            `[ZoraCoinCreatorProvider] Creating coin: ${args.name} (${args.symbol}) on chain ${args.chainId}`
        );

        try {
            // Validation
            if (!args.payoutRecipient || !isAddress(args.payoutRecipient)) {
                throw new Error(
                    "Invalid payoutRecipient. Must be a valid Ethereum address."
                );
            }

            const initialPurchaseWei = args.initialPurchaseEth
                ? parseEther(args.initialPurchaseEth)
                : BigInt(0);

            // Make names unique to avoid conflicts
            const timestamp = Date.now().toString().slice(-6);
            const uniqueName = `${args.name.trim()} ${timestamp}`;
            const uniqueSymbol = `${args.symbol.trim()}${timestamp}`;

            // Use exact same coinParams structure as working useCoinCreation hook
            const coinParams = {
                name: uniqueName,
                symbol: uniqueSymbol,
                uri: args.uri.trim(),
                owners: [args.payoutRecipient as Address],
                payoutRecipient: args.payoutRecipient as Address,
                platformReferrer: args.payoutRecipient as Address, // Always use payoutRecipient like working hook
                initialPurchaseWei,
                factoryAddress: CHAINS[args.chainId as keyof typeof CHAINS]
                    .factory as `0x${string}`,
            };

            console.log("[ZoraCoinCreatorProvider] Coin creation parameters:", {
                ...coinParams,
                initialPurchaseWei: initialPurchaseWei.toString(),
            });

            // Use createCoinCall from Zora SDK (exactly like working hook)
            const contractCallParams = await createCoinCall(coinParams);

            console.log("[ZoraCoinCreatorProvider] Contract call parameters:", {
                address: contractCallParams.address,
                factoryAddress:
                    CHAINS[args.chainId as keyof typeof CHAINS].factory,
                chainId: args.chainId,
                functionName: contractCallParams.functionName,
                argsLength: contractCallParams.args?.length || 0,
            });

            // Use the factory address from chains config (exactly like working hook)
            const factoryAddress = CHAINS[args.chainId as keyof typeof CHAINS]
                .factory as Address;

            // Encode the function call properly for the factory contract
            // This is the key fix - use the abi, functionName, and args but encode for factory
            const encodedData = encodeFunctionData({
                abi: contractCallParams.abi,
                functionName: contractCallParams.functionName as any,
                args: contractCallParams.args,
            });

            console.log("[ZoraCoinCreatorProvider] Encoded transaction data:", {
                factoryAddress,
                functionName: contractCallParams.functionName,
                dataLength: encodedData.length,
            });

            // Send transaction using the exact same approach as working hook
            const txHash = await walletProvider.sendTransaction({
                to: factoryAddress,
                data: encodedData, // Use properly encoded data for factory contract
                value: initialPurchaseWei,
            });

            console.log(
                `[ZoraCoinCreatorProvider] Transaction sent: ${txHash}`
            );

            // Try to extract coin address from transaction receipt
            try {
                // Wait a bit for the transaction to be mined
                await new Promise((resolve) => setTimeout(resolve, 2000));

                // Note: We can't easily get the receipt in this context without a public client
                // This is a limitation compared to the React hook version
                console.log(
                    "[ZoraCoinCreatorProvider] Transaction submitted successfully"
                );

                return {
                    transactionHash: txHash,
                    // coinAddress will need to be extracted separately by the user
                };
            } catch (receiptError: any) {
                console.log(
                    `[ZoraCoinCreatorProvider] Transaction sent but couldn't extract coin address: ${receiptError.message}`
                );
                return {
                    transactionHash: txHash,
                };
            }
        } catch (error: any) {
            const errorMessage =
                error.message || "Unknown error during coin creation";
            console.error(
                `[ZoraCoinCreatorProvider] Error creating ${args.name}:`,
                errorMessage
            );
            return { error: errorMessage };
        }
    }
}

export const zoraCoinCreatorProvider = () => new ZoraCoinCreatorProvider();
