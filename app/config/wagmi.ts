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
    `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_BASE_KEY}`,
    {
        batch: {
            wait: 16,
        },
        retryCount: 3,
    }
);

const optimismTransport = http(
    `https://opt-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_OPTIMISM_KEY}`,
    {
        batch: {
            wait: 16,
        },
        retryCount: 3,
    }
);

const arbitrumTransport = http(
    `https://arb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ARBITRUM_KEY}`,
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
    `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_KEY}`,
    {
        batch: {
            wait: 16,
        },
        retryCount: 3,
    }
);

const sepoliaTransport = http(
    `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_KEY}`,
    {
        batch: {
            wait: 16,
        },
        retryCount: 3,
    }
);

const baseSepoliaTransport = http(
    `https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_BASE_SEPOLIA_KEY}`,
    {
        batch: {
            wait: 16,
        },
        retryCount: 3,
    }
);

const arbitrumSepoliaTransport = http(
    `https://arb-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ARBITRUM_SEPOLIA_KEY}`,
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
