"use client";

import { ChainSelector } from "./ChainSelector";
import { WalletConnect } from "./WalletConnect";
import { SiweAuth } from "./SiweAuth";
import { DebugToggle } from "./DebugToggle";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-foreground">
                        Zora Coin Creator
                    </h1>
                    <nav className="ml-6 flex gap-4">
                        <Link
                            href="/"
                            className="text-foreground hover:underline font-medium"
                        >
                            Home
                        </Link>
                        <Link
                            href="/subgraph-explorer"
                            className="text-foreground hover:underline font-medium"
                        >
                            Subgraph Explorer
                        </Link>
                        <Link
                            href="/dashboard"
                            className="text-foreground hover:underline font-medium"
                        >
                            Shadcn Dashboard
                        </Link>
                        <Link
                            href="/chat"
                            className="text-foreground hover:underline font-medium"
                        >
                            Chat
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-2">
                    <ChainSelector />
                    <WalletConnect />
                    <SiweAuth />
                    <DebugToggle />
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
