import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getServerSession, type NextAuthOptions } from "next-auth";
import { baseSepolia, foundry, type Chain } from "viem/chains";
import { getTools, createAgentKit } from "../../utils/chat/tools";
import { siweAuthOptions } from "../../utils/scaffold-eth/auth";
import { CHAINS } from "../../config/chains";
import { PERSONALITIES, type Personality } from "../../config/personalities";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const session = (await getServerSession(
        siweAuthOptions({ chain: baseSepolia })
    )) as any;
    const userAddress = session?.user?.address;

    if (!userAddress) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { messages, chainId, personality } = await req.json();

    // Use the provided chainId or fallback to baseSepolia
    const selectedChainId = chainId || baseSepolia.id;
    const selectedChain = CHAINS[selectedChainId as keyof typeof CHAINS];

    if (!selectedChain) {
        return new Response(`Unsupported chain ID: ${selectedChainId}`, {
            status: 400,
        });
    }

    const { agentKit } = await createAgentKit(selectedChainId);

    // Get the selected personality
    console.log("🎭 Processing personality:", personality);
    console.log("🎭 Available personalities:", PERSONALITIES.length);

    const selectedPersonality: Personality =
        PERSONALITIES.find((p) => p.id === personality) || PERSONALITIES[0];

    console.log(
        "🎭 Selected personality:",
        selectedPersonality.name,
        selectedPersonality.id
    );

    const basePrompt = `
  You are a helpful Web3 assistant operating on EVM-compatible blockchains.
  You can interact with smart contracts, query subgraphs, and create Zora coins.`;

    const personalityPrompt =
        selectedPersonality.id !== "default"
            ? `\n\nPERSONALITY INSTRUCTIONS: ${selectedPersonality.prompt}\n\nIMPORTANT: Stay in character while helping with Web3 tasks. Blend your personality with your technical expertise.`
            : "";

    const prompt =
        basePrompt +
        personalityPrompt +
        `
  
  Your available tools include:
  - 'createZoraCoin': To create a new Zora ERC1155 coin. You will need the chain ID, name, symbol, metadata URI, and payout recipient address. An initial purchase amount in ETH is optional.
  - 'getTokenDetails': To fetch the name, symbol, and total supply for a given ERC20-like token contract address on a specified chain.
  - 'read-contract': To call read-only functions on smart contracts. (Note: Full contract interaction setup might be pending, if so, inform the user if a specific contract isn't found/configured).
  - 'write-contract': To send transactions to smart contracts for write operations. (Note: Full contract interaction setup might be pending).
  - 'querySubgraph': To query data from The Graph subgraphs using GraphQL.
  - 'getRecentCoins': To fetch recent Zora coins by category (new, topGainers, topVolume, mostValuable, lastTraded, lastTradedUnique).
  - Tools provided by 'tokenApiProvider' (you can infer its capabilities if a user asks for token-related data beyond basic details, like market prices or balances if supported).
  - Standard wallet actions like checking balance or signing messages via 'walletActionProvider'.

  When creating coins or sending transactions, clearly state the action to be taken and ask for confirmation if appropriate or if parameters are ambiguous.
  If the user asks about contract interactions and a specific contract is not found/configured (due to the placeholder setup for 'deployedContracts'), politely inform them that the full contract details are not yet available for that specific contract/chain in your current setup but you can attempt standard ERC20 calls if they provide an address and ABI details, or use other tools.
  You are currently configured to work with ${selectedChain.name} (chainId: ${selectedChainId}). Tools like 'createZoraCoin' and 'getTokenDetails' will operate on this chain unless otherwise specified by the user.
  The current user's address is ${userAddress}.
  `;

    console.log("🎭 Final system prompt:", prompt.substring(0, 500) + "...");

    try {
        console.log(
            `[api/chat] Calling streamText with AI SDK for chain ${selectedChain.name} (${selectedChainId})...`
        );
        const result = await streamText({
            model: openai("gpt-4-turbo-preview"),
            system: prompt,
            messages,
            tools: getTools(agentKit),
        });

        return result.toDataStreamResponse();
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        console.error(
            `[api/chat] Error in POST handler: ${errorMessage}`,
            error
        );
        return new Response(`Error processing request: ${errorMessage}`, {
            status: 500,
        });
    }
}
