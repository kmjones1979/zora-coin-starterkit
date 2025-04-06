import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http, createConfig } from "wagmi";
import {
    base,
    mainnet,
    optimism,
    arbitrum,
    sepolia,
    baseSepolia,
    arbitrumSepolia,
    zora,
    zoraSepolia,
    blast,
    blastSepolia,
} from "viem/chains";

// Create custom transport for each chain
const baseTransport = http(
    `https://rpc.drpc.org/rpc/${process.env.NEXT_PUBLIC_DRPC_KEY}/base`,
    {
        batch: {
            wait: 16,
        },
        retryCount: 10,
        timeout: 30000,
        fetchOptions: {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        },
    }
);

const optimismTransport = http(
    `https://drpc.org/rpc/${process.env.NEXT_PUBLIC_DRPC_KEY}/optimism`,
    {
        batch: {
            wait: 16,
        },
        retryCount: 3,
    }
);

const arbitrumTransport = http(
    `https://drpc.org/rpc/${process.env.NEXT_PUBLIC_DRPC_KEY}/arbitrum`,
    {
        batch: {
            wait: 16,
        },
        retryCount: 3,
    }
);

const zoraTransport = http("https://rpc.zora.energy", {
    batch: {
        wait: 16,
    },
    retryCount: 3,
});

const blastTransport = http("https://rpc.blast.io", {
    batch: {
        wait: 16,
    },
    retryCount: 3,
});

// Default transports for other chains
const mainnetTransport = http(
    `https://drpc.org/rpc/${process.env.NEXT_PUBLIC_DRPC_KEY}/ethereum`,
    {
        batch: {
            wait: 16,
        },
        retryCount: 3,
    }
);

const sepoliaTransport = http(
    `https://drpc.org/rpc/${process.env.NEXT_PUBLIC_DRPC_KEY}/sepolia`,
    {
        batch: {
            wait: 16,
        },
        retryCount: 3,
    }
);

const baseSepoliaTransport = http(
    `https://drpc.org/rpc/${process.env.NEXT_PUBLIC_DRPC_KEY}/base-sepolia`,
    {
        batch: {
            wait: 16,
        },
        retryCount: 3,
    }
);

const arbitrumSepoliaTransport = http(
    `https://drpc.org/rpc/${process.env.NEXT_PUBLIC_DRPC_KEY}/arbitrum-sepolia`,
    {
        batch: {
            wait: 16,
        },
        retryCount: 3,
    }
);

const zoraSepoliaTransport = http("https://testnet.rpc.zora.energy", {
    batch: {
        wait: 16,
    },
    retryCount: 3,
});

const blastSepoliaTransport = http("https://sepolia.blast.io", {
    batch: {
        wait: 16,
    },
    retryCount: 3,
});

// Create custom chain configurations
const baseRpc = {
    ...base,
    transport: baseTransport,
};

const optimismRpc = {
    ...optimism,
    transport: optimismTransport,
};

const arbitrumRpc = {
    ...arbitrum,
    transport: arbitrumTransport,
};

const zoraRpc = {
    ...zora,
    transport: zoraTransport,
};

const blastRpc = {
    ...blast,
    transport: blastTransport,
};

const chains = [
    mainnet,
    baseRpc,
    optimismRpc,
    arbitrumRpc,
    sepolia,
    baseSepolia,
    arbitrumSepolia,
    zoraRpc,
    zoraSepolia,
    blastRpc,
    blastSepolia,
] as const;

export const config = createConfig({
    chains,
    transports: {
        [mainnet.id]: mainnetTransport,
        [base.id]: baseTransport,
        [optimism.id]: optimismTransport,
        [arbitrum.id]: arbitrumTransport,
        [sepolia.id]: sepoliaTransport,
        [baseSepolia.id]: baseSepoliaTransport,
        [arbitrumSepolia.id]: arbitrumSepoliaTransport,
        [zora.id]: zoraTransport,
        [zoraSepolia.id]: zoraSepoliaTransport,
        [blast.id]: blastTransport,
        [blastSepolia.id]: blastSepoliaTransport,
    },
    pollingInterval: 4000,
});
