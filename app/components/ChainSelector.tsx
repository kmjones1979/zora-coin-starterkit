"use client";

import { useChainId, useSwitchChain } from "wagmi";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

const SUPPORTED_CHAINS = [
    {
        id: 84532,
        name: "Base Sepolia",
        icon: "🔵",
    },
    {
        id: 8453,
        name: "Base",
        icon: "🟦",
    },
    {
        id: 7777777,
        name: "Zora",
        icon: "🟪",
    },
    {
        id: 10,
        name: "Optimism",
        icon: "🟥",
    },
    {
        id: 42161,
        name: "Arbitrum",
        icon: "🟨",
    },
    {
        id: 81457,
        name: "Blast",
        icon: "🟧",
    },
];

export function ChainSelector() {
    const [mounted, setMounted] = useState(false);
    const chainId = useChainId();
    const { switchChain } = useSwitchChain();

    useEffect(() => {
        setMounted(true);
    }, []);

    const currentChain = SUPPORTED_CHAINS.find((chain) => chain.id === chainId);

    if (!mounted) {
        return (
            <Button variant="outline" className="flex items-center gap-2">
                Loading...
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-background hover:bg-accent text-foreground"
                >
                    {currentChain ? (
                        <>
                            <span>{currentChain.icon}</span>
                            <span>{currentChain.name}</span>
                        </>
                    ) : (
                        "Select Network"
                    )}
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-48 bg-popover border border-border"
            >
                {SUPPORTED_CHAINS.map((chain) => (
                    <DropdownMenuItem
                        key={chain.id}
                        onClick={() => switchChain?.({ chainId: chain.id })}
                        className={`
                            flex items-center gap-2 cursor-pointer text-popover-foreground
                            ${
                                chain.id === chainId
                                    ? "bg-accent text-accent-foreground"
                                    : "hover:bg-accent hover:text-accent-foreground"
                            }
                        `}
                    >
                        <span className="text-lg">{chain.icon}</span>
                        <span>{chain.name}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
