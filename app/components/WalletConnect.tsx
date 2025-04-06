"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "./ui/button";

export function WalletConnect() {
    const { address, isConnected } = useAccount();
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();

    if (isConnected) {
        return (
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5">
                    <div className="h-2 w-2 rounded-full bg-success"></div>
                    <span className="text-sm font-medium text-secondary-foreground">
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                </div>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => disconnect()}
                >
                    Disconnect
                </Button>
            </div>
        );
    }

    return (
        <div className="flex gap-2">
            {connectors.map((connector) => (
                <Button
                    key={connector.uid}
                    onClick={() => connect({ connector })}
                    size="sm"
                >
                    Connect Wallet
                </Button>
            ))}
        </div>
    );
}
