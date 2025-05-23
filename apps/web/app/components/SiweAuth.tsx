"use client";

import { useState } from "react";
import { useAccount, useSignMessage, useChainId } from "wagmi";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { createSiweMessage } from "viem/siwe";
import { baseSepolia } from "viem/chains";

export function SiweAuth() {
    const { address, isConnected } = useAccount();
    const { data: session, status } = useSession();
    const { signMessageAsync } = useSignMessage();
    const chainId = useChainId();
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async () => {
        if (!address) return;

        setIsLoading(true);
        try {
            // Create SIWE message
            const message = createSiweMessage({
                address,
                chainId: baseSepolia.id, // Use baseSepolia to match the API
                domain: window.location.host,
                uri: window.location.origin,
                version: "1",
                statement: "Sign in to Zora Coin Creator",
                nonce: Math.random().toString(36).substring(2, 15),
            });

            // Sign the message
            const signature = await signMessageAsync({
                account: address,
                message,
            });

            // Send to NextAuth
            const result = await signIn("credentials", {
                message,
                signature,
                redirect: false,
            });

            if (result?.error) {
                console.error("Sign-in error:", result.error);
            }
        } catch (error) {
            console.error("SIWE authentication error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignOut = async () => {
        await signOut({ redirect: false });
    };

    // Show loading state while checking session
    if (status === "loading") {
        return (
            <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">
                    Checking authentication...
                </div>
            </div>
        );
    }

    // If not connected to wallet, show nothing (WalletConnect handles this)
    if (!isConnected || !address) {
        return null;
    }

    // If wallet is connected but not authenticated with SIWE
    if (!session) {
        return (
            <Button
                onClick={handleSignIn}
                disabled={isLoading}
                variant="default"
                size="sm"
            >
                {isLoading ? "Signing In..." : "Sign In"}
            </Button>
        );
    }

    // If authenticated
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full bg-green-100 dark:bg-green-900 px-3 py-1.5">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    Authenticated
                </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
            </Button>
        </div>
    );
}
