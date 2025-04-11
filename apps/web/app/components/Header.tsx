"use client";

import { ChainSelector } from "./ChainSelector";
import { WalletConnect } from "./WalletConnect";
import { DebugToggle } from "./DebugToggle";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-foreground">
                        Zora Coin Creator
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <ChainSelector />
                    <WalletConnect />
                    <ThemeToggle />
                    <DebugToggle />
                </div>
            </div>
        </header>
    );
}
