"use client";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "./config/wagmi";
import "@rainbow-me/rainbowkit/styles.css";
import dynamic from "next/dynamic";
import { DebugProvider } from "./contexts/DebugContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SessionProvider } from "next-auth/react";
import { PersonalityProvider } from "./contexts/PersonalityContext";
import { initializeZoraSDK } from "./config/zora";

const queryClient = new QueryClient();

// Initialize Zora SDK on app startup
if (typeof window !== "undefined") {
    initializeZoraSDK();
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <DebugProvider>
                <PersonalityProvider>
                    <SessionProvider>
                        <WagmiProvider config={config}>
                            <QueryClientProvider client={queryClient}>
                                <RainbowKitProvider>
                                    {children}
                                </RainbowKitProvider>
                            </QueryClientProvider>
                        </WagmiProvider>
                    </SessionProvider>
                </PersonalityProvider>
            </DebugProvider>
        </ThemeProvider>
    );
}

export const ProvidersDynamic = dynamic(() => Promise.resolve(Providers), {
    ssr: false,
});
