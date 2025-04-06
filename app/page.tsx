"use client";

import { Providers } from "./providers";
import dynamic from "next/dynamic";
import { CreateZoraCoin } from "./components/CreateZoraCoin";
import { RecentCoins } from "./components/RecentCoins";
import { ChainSelector } from "./components/ChainSelector";

const WalletConnect = dynamic(
    () => import("./components/WalletConnect").then((mod) => mod.WalletConnect),
    {
        ssr: false,
    }
);

export default function Home() {
    return (
        <Providers>
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Zora Coin Creator
                        </h1>
                        <div className="flex items-center gap-4">
                            <ChainSelector />
                            <WalletConnect />
                        </div>
                    </div>
                </header>
                <main className="max-w-7xl mx-auto px-4 py-8">
                    <div className="mb-8">
                        <CreateZoraCoin />
                        <RecentCoins />
                    </div>
                </main>
            </div>
        </Providers>
    );
}
