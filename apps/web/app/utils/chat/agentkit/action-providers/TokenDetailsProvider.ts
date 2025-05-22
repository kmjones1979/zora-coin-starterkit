import {
    ActionProvider,
    CreateAction,
    EvmWalletProvider,
    Network,
} from "@coinbase/agentkit";
import { z } from "zod";
import { type Address } from "viem";
import { CHAINS } from "../../../../config/chains"; // Corrected path

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
] as const; // Copied from useTokenDetails.ts

const GetTokenDetailsSchema = z.object({
    chainId: z
        .number()
        .describe(
            "The chain ID where the token exists (e.g., 8453 for Base, 7777777 for Zora)."
        ),
    contractAddress: z
        .string()
        .describe(
            "The contract address of the token. Must be a valid 0x address."
        ),
});

class TokenDetailsProvider extends ActionProvider<EvmWalletProvider> {
    constructor() {
        super("token-details-provider", []);
    }

    // Required by ActionProvider
    supportsNetwork = (network: Network): boolean => {
        // This provider can support any chain defined in CHAINS
        return !!CHAINS[Number(network.chainId) as keyof typeof CHAINS];
    };

    @CreateAction({
        name: "getTokenDetails",
        description:
            "Fetches the name, symbol, and total supply for a given ERC20 token contract address on a specified chain.",
        schema: GetTokenDetailsSchema,
    })
    async getTokenDetails(
        walletProvider: EvmWalletProvider,
        args: z.infer<typeof GetTokenDetailsSchema>
    ): Promise<{
        name?: string;
        symbol?: string;
        totalSupply?: string;
        error?: string;
    }> {
        console.log(
            `[TokenDetailsProvider] Received request to get details for token ${args.contractAddress} on chain ${args.chainId}`
        );
        try {
            const selectedChainConfig =
                CHAINS[args.chainId as keyof typeof CHAINS];
            if (!selectedChainConfig) {
                const errorMessage = `Unsupported or unconfigured chainId: ${args.chainId}. Supported chainIds: ${Object.keys(CHAINS).join(", ")}`;
                console.error(`[TokenDetailsProvider] ${errorMessage}`);
                return { error: errorMessage };
            }

            if (!/^0x[a-fA-F0-9]{40}$/.test(args.contractAddress)) {
                return {
                    error: `Invalid contractAddress format: ${args.contractAddress}`,
                };
            }
            const contractAddress = args.contractAddress as Address;

            // Use EvmWalletProvider's readContract method
            const tokenName = await walletProvider.readContract({
                address: contractAddress,
                abi: tokenABI,
                functionName: "name",
            });

            const tokenSymbol = await walletProvider.readContract({
                address: contractAddress,
                abi: tokenABI,
                functionName: "symbol",
            });

            const tokenSupply = await walletProvider.readContract({
                address: contractAddress,
                abi: tokenABI,
                functionName: "totalSupply",
            });

            console.log(
                `[TokenDetailsProvider] Fetched details for ${contractAddress}: Name: ${tokenName}, Symbol: ${tokenSymbol}, Supply: ${tokenSupply}`
            );
            return {
                name: tokenName as string,
                symbol: tokenSymbol as string,
                totalSupply: (tokenSupply as bigint).toString(), // Convert BigInt to string for the agent
            };
        } catch (error: any) {
            const errorMessage =
                error.message ||
                "An unknown error occurred while fetching token details.";
            console.error(
                `[TokenDetailsProvider] Error fetching details for ${args.contractAddress}: ${errorMessage}`,
                error
            );
            return { error: errorMessage };
        }
    }
}

export const tokenDetailsProvider = () => new TokenDetailsProvider();
