import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useCoinCreation } from "../hooks/useCoinCreation";
import { useAccount } from "wagmi";

interface CoinFormProps {
    onSuccess?: (hash: `0x${string}`) => void;
}

export function CoinForm({ onSuccess }: CoinFormProps) {
    const { address } = useAccount();
    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [initialSupply, setInitialSupply] = useState("");
    const [theme, setTheme] = useState("light");

    const {
        write,
        isLoading,
        error,
        transactionHash,
        status,
        resetTransaction,
    } = useCoinCreation({
        name,
        symbol,
        initialSupply: BigInt(initialSupply || "0"),
        address: address || "0x0000000000000000000000000000000000000000",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        write?.();
    };

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    return (
        <div className="card bg-white shadow-xl">
            <div className="card-body">
                <div className="flex justify-between items-center">
                    <h2 className="card-title">Create New Coin</h2>
                    <button onClick={toggleTheme} className="btn btn-ghost">
                        {theme === "light" ? "🌙" : "☀️"}
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Coin Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="My Coin"
                            required
                            className="text-black"
                        />
                    </div>

                    <div>
                        <Label htmlFor="symbol">Symbol</Label>
                        <Input
                            id="symbol"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
                            placeholder="MC"
                            required
                            className="text-black"
                        />
                    </div>

                    <div>
                        <Label htmlFor="supply">Initial Supply</Label>
                        <Input
                            id="supply"
                            type="number"
                            value={initialSupply}
                            onChange={(e) => setInitialSupply(e.target.value)}
                            placeholder="1000000"
                            required
                            className="text-black"
                        />
                    </div>

                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Coin"}
                    </Button>

                    {error && (
                        <div className="text-red-500">
                            Error: {error.message}
                        </div>
                    )}

                    {transactionHash && (
                        <div className="space-y-2">
                            <div>Transaction Hash: {transactionHash}</div>
                            <div>Status: {status}</div>
                            <Button onClick={resetTransaction}>
                                Create Another Coin
                            </Button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
