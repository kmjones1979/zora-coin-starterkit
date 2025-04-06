"use client";

import { Providers } from "./providers";
import dynamic from "next/dynamic";
import { CreateZoraCoin } from "./components/CreateZoraCoin";
import { RecentCoins } from "./components/RecentCoins";
import { Header } from "./components/Header";

const WalletConnect = dynamic(
    () => import("./components/WalletConnect").then((mod) => mod.WalletConnect),
    {
        ssr: false,
    }
);

export default function Home() {
    return (
        <Providers>
            <div className="min-h-screen bg-background">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <CreateZoraCoin />
                        <RecentCoins />
                    </div>
                </main>
            </div>
        </Providers>
    );
}
