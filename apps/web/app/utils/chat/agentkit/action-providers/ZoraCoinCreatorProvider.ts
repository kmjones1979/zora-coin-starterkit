import {
    ActionProvider,
    CreateAction,
    EvmWalletProvider,
    Network,
} from "@coinbase/agentkit";
import { z } from "zod";
import { createCoinCall } from "@zoralabs/coins-sdk";
import { type Hex, type Address, encodeFunctionData } from "viem";
import { CHAINS } from "../../../../config/chains"; // Corrected path

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
            "Creates a new Zora coin on the specified chain with the given parameters. Requires the agent to have a wallet with funds for gas and any initial purchase.",
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
            `[ZoraCoinCreatorProvider] Received request to create coin: ${args.name} (${args.symbol}) on chain ${args.chainId}`
        );
        try {
            const selectedChainConfig =
                CHAINS[args.chainId as keyof typeof CHAINS];
            if (!selectedChainConfig || !selectedChainConfig.factory) {
                const errorMessage = `Unsupported or unconfigured chainId: ${args.chainId}. Supported chainIds with factory: ${Object.keys(
                    CHAINS
                )
                    .filter(
                        (key) =>
                            CHAINS[Number(key) as keyof typeof CHAINS]?.factory
                    )
                    .join(", ")}`;
                console.error(`[ZoraCoinCreatorProvider] ${errorMessage}`);
                return { error: errorMessage };
            }

            const payoutRecipient = args.payoutRecipient as Address;
            const platformReferrer = args.platformReferrer
                ? (args.platformReferrer as Address)
                : payoutRecipient; // Default to payoutRecipient if not provided
            const initialPurchaseWei = args.initialPurchaseEth
                ? BigInt(parseFloat(args.initialPurchaseEth) * 1e18)
                : BigInt(0);

            if (!/^0x[a-fA-F0-9]{40}$/.test(payoutRecipient)) {
                return {
                    error: `Invalid payoutRecipient address format: ${args.payoutRecipient}`,
                };
            }
            if (
                args.platformReferrer &&
                !/^0x[a-fA-F0-9]{40}$/.test(args.platformReferrer)
            ) {
                return {
                    error: `Invalid platformReferrer address format: ${args.platformReferrer}`,
                };
            }
            if (
                !args.uri.startsWith("ipfs://") &&
                !args.uri.startsWith("http://") &&
                !args.uri.startsWith("https://")
            ) {
                return {
                    error: `Invalid URI format: ${args.uri}. Must start with ipfs://, http://, or https://`,
                };
            }

            const coinParams = {
                name: args.name.trim(),
                symbol: args.symbol.trim(),
                uri: args.uri.trim(),
                owners: [payoutRecipient], // As per useCoinCreation hook, owners array contains payoutRecipient
                payoutRecipient,
                platformReferrer,
                initialPurchaseWei,
                factoryAddress: selectedChainConfig.factory as Address,
            };

            console.log(
                "[ZoraCoinCreatorProvider] Prepared coinParams:",
                JSON.stringify(coinParams, (k, v) =>
                    typeof v === "bigint" ? v.toString() : v
                )
            );

            const {
                address: targetAddress,
                abi,
                functionName,
                args: callArgs,
            } = await createCoinCall(coinParams);

            console.log(
                "[ZoraCoinCreatorProvider] createCoinCall successful. Target address:",
                targetAddress,
                "Function:",
                functionName
            );

            const txHash = await walletProvider.sendTransaction({
                to: targetAddress,
                data: encodeFunctionData({
                    abi,
                    functionName,
                    args: callArgs,
                }),
                value: initialPurchaseWei, // Already a BigInt
                // chainId: args.chainId, // sendTransaction in EvmWalletProvider might not need chainId if wallet is chain-specific
            });

            console.log(
                `[ZoraCoinCreatorProvider] Transaction sent with hash: ${txHash} for coin ${args.name}`
            );
            // Note: We don't easily get the deployed coin address here without waiting for receipt & parsing logs.
            // For simplicity, the agent will be informed of the tx hash.
            // A more advanced version could wait for the receipt and parse logs if needed.
            return { transactionHash: txHash };
        } catch (error: any) {
            const errorMessage =
                error.message ||
                "An unknown error occurred during coin creation.";
            console.error(
                `[ZoraCoinCreatorProvider] Error creating coin ${args.name}: ${errorMessage}`,
                error
            );
            return { error: errorMessage };
        }
    }
}

export const zoraCoinCreatorProvider = () => new ZoraCoinCreatorProvider();
