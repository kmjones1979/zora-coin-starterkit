import { DebugToggle } from "./DebugToggle";
import { ChainSelector } from "./ChainSelector";
import { WalletConnect } from "./WalletConnect";

export function Header() {
    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                    Zora Coin Creator
                </h1>
                <div className="flex items-center gap-4">
                    <DebugToggle />
                    <ChainSelector />
                    <WalletConnect />
                </div>
            </div>
        </header>
    );
}
