import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import * as zora from "@zoralabs/coins-sdk";

export const publicClient = createPublicClient({
    chain: base,
    transport: http(),
});

export const zoraSDK = {
    ...zora,
    publicClient,
    chain: base,
};
