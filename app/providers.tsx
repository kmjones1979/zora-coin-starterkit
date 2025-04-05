"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { base } from "viem/chains";
import dynamic from "next/dynamic";

const queryClient = new QueryClient();

const { connectors } = getDefaultWallets({
    appName: "Zora Coin Creator",
    projectId: "YOUR_PROJECT_ID", // Replace with your WalletConnect project ID
});

const config = createConfig({
    chains: [base],
    connectors,
    transports: {
        [base.id]: http(),
    },
});

function ProvidersContent({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>{children}</RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

export const Providers = dynamic(() => Promise.resolve(ProvidersContent), {
    ssr: false,
});
