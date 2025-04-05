import { http } from "viem";
import { base } from "viem/chains";
import { createConfig } from "wagmi";
import { injected } from "wagmi/connectors";

export const config = createConfig({
    chains: [base],
    connectors: [injected()],
    transports: {
        [base.id]: http(),
    },
});
