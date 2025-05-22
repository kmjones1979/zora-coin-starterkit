import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getServerSession } from "next-auth";
import { foundry } from "viem/chains";
import { siweAuthOptions } from "../../utils/scaffold-eth/auth";
import { getTools, createAgentKit } from "../../utils/chat/tools";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const session = (await getServerSession(
        siweAuthOptions({ chain: foundry })
    )) as any;
    const userAddress = session?.user?.address;

    if (!userAddress) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { messages } = await req.json();
    const { agentKit } = await createAgentKit();

    const prompt = `
  You are a helpful assistant that can answer questions and help with tasks.
  You are currently on the Foundry network.
  `;

    try {
        console.log("[api/chat] Calling streamText with AI SDK..."); // Log 6: Before calling AI
        const result = await streamText({
            model: openai("gpt-4-turbo-preview"),
            system: prompt,
            messages,
            tools: getTools(agentKit),
        });
        console.log("[api/chat] streamText initial call completed."); // Log 7a: After initial AI call returns stream object

        // --- DEBUG: Log stream parts using async iterator ---
        let loggedToolCalls = 0;
        let loggedText = "";
        console.log("[api/chat] Reading stream parts...");
        for await (const part of result.fullStream) {
            // Use fullStream or potentially another iterator if available
            switch (part.type) {
                case "text-delta":
                    // console.log("[api/chat] Stream part: text-delta:", part.textDelta);
                    loggedText += part.textDelta;
                    break;
                case "tool-call":
                    console.log(
                        "[api/chat] Stream part: tool-call: ID:",
                        part.toolCallId,
                        "Name:",
                        part.toolName,
                        "Args:",
                        JSON.stringify(part.args)
                    );
                    loggedToolCalls++;
                    break;
                case "tool-result":
                    console.log(
                        "[api/chat] Stream part: tool-result:",
                        JSON.stringify(part.result)
                    );
                    break;
                case "error":
                    console.error("[api/chat] Stream part: error:", part.error);
                    break;
                // Handle other part types if necessary (e.g., 'finish')
                case "finish":
                    console.log(
                        "[api/chat] Stream part: finish. Reason:",
                        part.finishReason,
                        "Usage:",
                        part.usage
                    );
                    break;
                default:
                    // console.log("[api/chat] Stream part: other type:", part.type);
                    break;
            }
        }
        console.log(
            `[api/chat] Finished reading stream. Logged ${loggedToolCalls} tool calls. Logged text length: ${loggedText.length}`
        );
        // --- END DEBUG ---

        // Re-execute to get a fresh stream for the actual response
        console.log("[api/chat] Re-executing streamText to return response...");
        const finalResult = await streamText({
            model: openai("gpt-4-turbo-preview"),
            system: prompt,
            messages,
            tools: getTools(agentKit),
        });

        // Use toDataStreamResponse as indicated by the linter error
        return finalResult.toDataStreamResponse();
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        console.error(
            `[api/chat] Error in POST handler: ${errorMessage}`,
            error
        ); // Log 8: Catching errors
        return new Response(`Error processing request: ${errorMessage}`, {
            status: 500,
        });
    }
}
