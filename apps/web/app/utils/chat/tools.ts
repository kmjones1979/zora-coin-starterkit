import { contractInteractor } from "./agentkit/action-providers/contract-interactor";
import {
    SUBGRAPH_ENDPOINTS,
    graphQuerierProvider,
} from "./agentkit/action-providers/graph-querier";
import { tokenApiProvider } from "./agentkit/action-providers/token-api-provider";
import { zoraCoinCreatorProvider } from "./agentkit/action-providers/ZoraCoinCreatorProvider";
import { tokenDetailsProvider } from "./agentkit/action-providers/TokenDetailsProvider";
import { agentKitToTools } from "./agentkit/framework-extensions/ai-sdk";
import {
    AgentKit,
    ViemWalletProvider,
    walletActionProvider,
} from "@coinbase/agentkit";
import { tool } from "ai";
import fetch from "node-fetch";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { foundry, baseSepolia } from "viem/chains";
import { z } from "zod";
import { CHAINS } from "../../config/chains";
import {
    getCoinsNew,
    getCoinsTopGainers,
    getCoinsTopVolume24h,
    getCoinsMostValuable,
    getCoinsLastTraded,
    getCoinsLastTradedUnique,
} from "@zoralabs/coins-sdk";
import { initializeZoraSDK } from "../../config/zora";

// Initialize Zora SDK
initializeZoraSDK();

export { SUBGRAPH_ENDPOINTS };

export async function createAgentKit(chainId?: number) {
    // Use provided chainId or fallback to baseSepolia
    const selectedChainId = chainId || baseSepolia.id;
    const selectedChain = CHAINS[selectedChainId as keyof typeof CHAINS];

    if (!selectedChain) {
        throw new Error(`Unsupported chain ID: ${selectedChainId}`);
    }

    const walletClient = createWalletClient({
        account: privateKeyToAccount(
            process.env.AGENT_PRIVATE_KEY as `0x${string}`
        ),
        chain: selectedChain,
        transport: http(selectedChain.rpc),
    });
    const viemWalletProvider = new ViemWalletProvider(walletClient as any);

    const agentKit = await AgentKit.from({
        walletProvider: viemWalletProvider,
        actionProviders: [
            walletActionProvider(),
            contractInteractor(selectedChainId),
            graphQuerierProvider(),
            tokenApiProvider(),
            zoraCoinCreatorProvider(),
            tokenDetailsProvider(),
        ],
    });

    return {
        agentKit,
        address: walletClient.account.address,
        chainId: selectedChainId,
        chainName: selectedChain.name,
    };
}

export function getTools(agentKit: AgentKit) {
    const tools = agentKitToTools(agentKit);

    return {
        ...tools,
        showTransaction: tool({
            description: "Show the transaction hash",
            parameters: z.object({
                transactionHash: z
                    .string()
                    .describe("The transaction hash to show"),
            }),
            execute: async ({ transactionHash }) => {
                return {
                    transactionHash,
                };
            },
        }),
        getRecentCoins: tool({
            description:
                "Get recent Zora coins created on the current chain. Can fetch new coins, trending coins, or coins by specific criteria.",
            parameters: z.object({
                category: z
                    .enum([
                        "new",
                        "topGainers",
                        "topVolume",
                        "mostValuable",
                        "lastTraded",
                        "lastTradedUnique",
                    ])
                    .describe("The category of coins to fetch"),
                chainId: z
                    .number()
                    .describe("The chain ID to fetch coins from"),
                count: z
                    .number()
                    .optional()
                    .describe("Number of coins to fetch (default: 10)"),
            }),
            execute: async ({ category, chainId, count = 10 }) => {
                try {
                    console.log(
                        `[getRecentCoins] Fetching ${category} coins for chain ${chainId}`
                    );

                    let response;
                    switch (category) {
                        case "new":
                            // Use lastTraded as workaround for getCoinsNew bug
                            response = await getCoinsLastTraded({ count });
                            break;
                        case "topGainers":
                            response = await getCoinsTopGainers({ count });
                            break;
                        case "topVolume":
                            response = await getCoinsTopVolume24h({ count });
                            break;
                        case "mostValuable":
                            response = await getCoinsMostValuable({ count });
                            break;
                        case "lastTraded":
                            response = await getCoinsLastTraded({ count });
                            break;
                        case "lastTradedUnique":
                            response = await getCoinsLastTradedUnique({
                                count,
                            });
                            break;
                        default:
                            response = await getCoinsNew({ count });
                    }

                    if (!response || !response.data?.exploreList?.edges) {
                        throw new Error("No data received from Zora API");
                    }

                    const allCoins = response.data.exploreList.edges.map(
                        (edge: any) => ({
                            name: edge.node.name || "Unknown",
                            symbol: edge.node.symbol || "N/A",
                            address: edge.node.address,
                            creatorAddress: edge.node.creatorAddress,
                            chainId: edge.node.chainId,
                            createdAt: edge.node.createdAt,
                            marketCap: edge.node.marketCap,
                            volume24h: edge.node.volume24h,
                            uniqueHolders: edge.node.uniqueHolders,
                            marketCapDelta24h: edge.node.marketCapDelta24h,
                        })
                    );

                    // Filter coins by current chain
                    const filteredCoins = allCoins.filter(
                        (coin: any) => coin.chainId === chainId
                    );

                    console.log(
                        `[getRecentCoins] Found ${filteredCoins.length} coins for chain ${chainId}`
                    );

                    return {
                        success: true,
                        category,
                        chainId,
                        count: filteredCoins.length,
                        coins: filteredCoins,
                    };
                } catch (error) {
                    console.error(`[getRecentCoins] Error:`, error);
                    return {
                        success: false,
                        error:
                            error instanceof Error
                                ? error.message
                                : "Unknown error",
                        category,
                        chainId,
                    };
                }
            },
        }),
    };
}

export const querySubgraph = {
    name: "querySubgraph",
    description: "Query a subgraph using GraphQL",
    parameters: {
        type: "object",
        properties: {
            endpoint: {
                type: "string",
                description: "The subgraph endpoint URL",
            },
            query: {
                type: "string",
                description: "The GraphQL query string",
            },
            variables: {
                type: "object",
                description: "Optional variables for the GraphQL query",
            },
        },
        required: ["endpoint", "query"],
    },
    async handler({
        endpoint,
        query,
        variables = {},
    }: {
        endpoint: string;
        query: string;
        variables?: Record<string, any>;
    }) {
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query,
                    variables,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            if (error instanceof Error) {
                return { error: error.message };
            }
            return { error: "An unknown error occurred" };
        }
    },
};
