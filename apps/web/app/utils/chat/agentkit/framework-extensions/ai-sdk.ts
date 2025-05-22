import type { AgentKit } from "@coinbase/agentkit";
import { tool } from "ai";

/**
 * Transforms AgentKit instance into AI package compatible tools
 * @param agentKit AgentKit instance
 * @returns An object mapping tool names to AI package tool definitions
 */
export function agentKitToTools(agentKit: AgentKit) {
  const actions = agentKit.getActions();

  return Object.fromEntries(
    actions.map(action => [
      action.name,
      tool({
        description: action.description,
        parameters: action.schema,
        execute: async (args: Record<string, unknown>) => {
          return await action.invoke(args);
        },
      }),
    ]),
  );
}
