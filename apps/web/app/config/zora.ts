import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import * as zora from "@zoralabs/coins-sdk";

// Initialize Zora SDK with API key
export const initializeZoraSDK = () => {
    // Try to get API key from environment variables
    const apiKey = process.env.NEXT_PUBLIC_ZORA_API_KEY;

    console.log("🔧 Initializing Zora SDK...");
    console.log("🔑 API Key available:", apiKey ? "YES" : "NO");
    console.log(
        "🔑 API Key value:",
        apiKey ? `${apiKey.substring(0, 10)}...` : "undefined"
    );

    if (apiKey && apiKey !== "your-zora-api-key-here") {
        try {
            zora.setApiKey(apiKey);
            console.log("✅ Zora SDK initialized with API key successfully");
        } catch (error) {
            console.error("❌ Failed to set Zora API key:", error);
        }
    } else {
        console.warn(
            "⚠️ Zora API key not found or is placeholder. Data may be limited."
        );
        console.log("📝 To fix this:");
        console.log("1. Create a .env.local file in apps/web/ directory");
        console.log("2. Add: NEXT_PUBLIC_ZORA_API_KEY=your-actual-api-key");
        console.log(
            "3. Get your API key from: https://zora.co/settings/developer"
        );
        console.log("4. Restart your development server");
    }
};

export const publicClient = createPublicClient({
    chain: base,
    transport: http(),
});

export const zoraSDK = {
    ...zora,
    publicClient,
    chain: base,
};
