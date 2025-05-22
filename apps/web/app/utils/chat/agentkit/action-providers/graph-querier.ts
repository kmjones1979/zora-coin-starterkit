import { ActionProvider, WalletProvider } from "@coinbase/agentkit";
import { z } from "zod";

const UNISWAP_V3_SUBGRAPH_ID = "5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV";
const AAVE_V3_SUBGRAPH_ID = "JCNWRypm7FYwV8fx5HhzZPSFaMxgkPuw4TnR3Gpi81zk";

type EndpointGetter = () => string;

export const SUBGRAPH_ENDPOINTS: Record<string, string | EndpointGetter> = {
  UNISWAP_V3: () => {
    const apiKey = process.env.GRAPH_API_KEY;
    if (!apiKey) throw new Error("GRAPH_API_KEY not found in environment variables");
    return `https://gateway.thegraph.com/api/${apiKey}/subgraphs/id/${UNISWAP_V3_SUBGRAPH_ID}`;
  },
  AAVE_V3: () => {
    const apiKey = process.env.GRAPH_API_KEY;
    if (!apiKey) throw new Error("GRAPH_API_KEY not found in environment variables");
    return `https://gateway.thegraph.com/api/${apiKey}/subgraphs/id/${AAVE_V3_SUBGRAPH_ID}`;
  },
};

const graphQuerySchema = z.object({
  endpoint: z
    .string()
    .or(z.function().returns(z.string()))
    .describe("The subgraph endpoint URL or function that returns it"),
  query: z.string().describe("The GraphQL query string"),
  variables: z.record(z.any()).optional().describe("Optional variables for the GraphQL query"),
});

export class GraphQuerierProvider implements ActionProvider<WalletProvider> {
  name = "graph-querier";
  actionProviders = [];
  supportsNetwork = () => true;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getActions(walletProvider: WalletProvider) {
    return [
      {
        name: "querySubgraph",
        description: "Query a subgraph using GraphQL",
        schema: graphQuerySchema,
        severity: "info",
        invoke: async ({ endpoint, query, variables = {} }: z.infer<typeof graphQuerySchema>) => {
          try {
            const resolvedEndpoint = typeof endpoint === "function" ? endpoint() : endpoint;

            const response = await fetch(resolvedEndpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ query, variables }),
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            return JSON.stringify(data);
          } catch (error) {
            return JSON.stringify({
              error: error instanceof Error ? error.message : "An unknown error occurred",
            });
          }
        },
      },
    ];
  }
}

export const graphQuerierProvider = () => new GraphQuerierProvider();
