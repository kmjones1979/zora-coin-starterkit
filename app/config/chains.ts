import { zora, base, optimism, arbitrum, blast } from "viem/chains";

export const CHAINS = {
    [base.id]: {
        ...base,
        name: "Base",
        icon: "🟦",
        factory: "0x58C3ccB2dcb9384E5AB9111CD1a5DEA916B0f33c",
        explorer: "https://basescan.org",
        rpc: "https://mainnet.base.org",
    },
    [zora.id]: {
        ...zora,
        name: "Zora",
        icon: "🟪",
        factory: "0x7777777F279eba3d3Ad8F4E708545291A6fDBA8B",
        explorer: "https://explorer.zora.energy",
        rpc: "https://rpc.zora.energy",
    },
    [optimism.id]: {
        ...optimism,
        name: "Optimism",
        icon: "🟧",
        factory: "0x7777777F279eba3d3Ad8F4E708545291A6fDBA8B",
        explorer: "https://optimistic.etherscan.io",
        rpc: "https://mainnet.optimism.io",
    },
    [arbitrum.id]: {
        ...arbitrum,
        name: "Arbitrum",
        icon: "🟨",
        factory: "0x7777777F279eba3d3Ad8F4E708545291A6fDBA8B",
        explorer: "https://arbiscan.io",
        rpc: "https://arb1.arbitrum.io/rpc",
    },
    [blast.id]: {
        ...blast,
        name: "Blast",
        icon: "💥",
        factory: "0x7777777F279eba3d3Ad8F4E708545291A6fDBA8B",
        explorer: "https://blastscan.io",
        rpc: "https://rpc.blast.io",
    },
} as const;
