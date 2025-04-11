export const coinFactoryABI = [
    {
        inputs: [
            {
                internalType: "string",
                name: "name",
                type: "string",
            },
            {
                internalType: "string",
                name: "symbol",
                type: "string",
            },
            {
                internalType: "string",
                name: "uri",
                type: "string",
            },
            {
                internalType: "address[]",
                name: "owners",
                type: "address[]",
            },
            {
                internalType: "address",
                name: "payoutRecipient",
                type: "address",
            },
            {
                internalType: "address",
                name: "platformReferrer",
                type: "address",
            },
            {
                internalType: "address",
                name: "protocolRewardRecipient",
                type: "address",
            },
            {
                internalType: "address",
                name: "protocolRewards",
                type: "address",
            },
            {
                internalType: "address",
                name: "weth",
                type: "address",
            },
            {
                internalType: "address",
                name: "v3Factory",
                type: "address",
            },
            {
                internalType: "address",
                name: "swapRouter",
                type: "address",
            },
            {
                internalType: "address",
                name: "airlock",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
] as const;
