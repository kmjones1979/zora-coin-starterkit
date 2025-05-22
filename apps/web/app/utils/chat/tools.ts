import { contractInteractor } from "./agentkit/action-providers/contract-interactor";
import { SUBGRAPH_ENDPOINTS, graphQuerierProvider } from "./agentkit/action-providers/graph-querier";
import { tokenApiProvider } from "./agentkit/action-providers/token-api-provider";
import { agentKitToTools } from "./agentkit/framework-extensions/ai-sdk";
import { AgentKit, ViemWalletProvider, walletActionProvider } from "@coinbase/agentkit";
import { tool } from "ai";
import fetch from "node-fetch";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { foundry } from "viem/chains";
import { z } from "zod";

export { SUBGRAPH_ENDPOINTS };

export async function createAgentKit() {
  const walletClient = createWalletClient({
    account: privateKeyToAccount(process.env.AGENT_PRIVATE_KEY as `0x${string}`),
    chain: foundry,
    transport: http(),
  });
  const viemWalletProvider = new ViemWalletProvider(walletClient as any);

  const agentKit = await AgentKit.from({
    walletProvider: viemWalletProvider,
    actionProviders: [
      walletActionProvider(),
      contractInteractor(foundry.id),
      graphQuerierProvider(),
      tokenApiProvider(),
    ],
  });

  return { agentKit, address: walletClient.account.address };
}

export function getTools(agentKit: AgentKit) {
  const tools = agentKitToTools(agentKit);

  return {
    ...tools,
    showTransaction: tool({
      description: "Show the transaction hash",
      parameters: z.object({
        transactionHash: z.string().describe("The transaction hash to show"),
      }),
      execute: async ({ transactionHash }) => {
        return {
          transactionHash,
        };
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
