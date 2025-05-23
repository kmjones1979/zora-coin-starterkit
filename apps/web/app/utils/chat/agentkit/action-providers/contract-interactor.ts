import {
    ActionProvider,
    EvmWalletProvider,
    Network,
    CreateAction,
    WalletProvider,
} from "@coinbase/agentkit";
import { z } from "zod";
// ABI for ZoraFactory implementation
const zoraFactoryImplementationABI = [
    {
        inputs: [
            { internalType: "address", name: "_coinImpl", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [{ internalType: "address", name: "target", type: "address" }],
        name: "AddressEmptyCode",
        type: "error",
    },
    {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "AddressInsufficientBalance",
        type: "error",
    },
    { inputs: [], name: "ERC1167FailedCreateClone", type: "error" },
    {
        inputs: [
            {
                internalType: "address",
                name: "implementation",
                type: "address",
            },
        ],
        name: "ERC1967InvalidImplementation",
        type: "error",
    },
    { inputs: [], name: "ERC1967NonPayable", type: "error" },
    { inputs: [], name: "ERC20TransferAmountMismatch", type: "error" },
    { inputs: [], name: "EthTransferInvalid", type: "error" },
    { inputs: [], name: "FailedInnerCall", type: "error" },
    { inputs: [], name: "InvalidHook", type: "error" },
    { inputs: [], name: "InvalidInitialization", type: "error" },
    { inputs: [], name: "NotInitializing", type: "error" },
    {
        inputs: [{ internalType: "address", name: "owner", type: "address" }],
        name: "OwnableInvalidOwner",
        type: "error",
    },
    {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "OwnableUnauthorizedAccount",
        type: "error",
    },
    { inputs: [], name: "ReentrancyGuardReentrantCall", type: "error" },
    {
        inputs: [{ internalType: "address", name: "token", type: "address" }],
        name: "SafeERC20FailedOperation",
        type: "error",
    },
    { inputs: [], name: "UUPSUnauthorizedCallContext", type: "error" },
    {
        inputs: [{ internalType: "bytes32", name: "slot", type: "bytes32" }],
        name: "UUPSUnsupportedProxiableUUID",
        type: "error",
    },
    {
        inputs: [
            { internalType: "string", name: "currentName", type: "string" },
            { internalType: "string", name: "newName", type: "string" },
        ],
        name: "UpgradeToMismatchedContractName",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "caller",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "payoutRecipient",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "platformReferrer",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "currency",
                type: "address",
            },
            {
                indexed: false,
                internalType: "string",
                name: "uri",
                type: "string",
            },
            {
                indexed: false,
                internalType: "string",
                name: "name",
                type: "string",
            },
            {
                indexed: false,
                internalType: "string",
                name: "symbol",
                type: "string",
            },
            {
                indexed: false,
                internalType: "address",
                name: "coin",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "pool",
                type: "address",
            },
            {
                indexed: false,
                internalType: "string",
                name: "version",
                type: "string",
            },
        ],
        name: "CoinCreated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint64",
                name: "version",
                type: "uint64",
            },
        ],
        name: "Initialized",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "implementation",
                type: "address",
            },
        ],
        name: "Upgraded",
        type: "event",
    },
    {
        inputs: [],
        name: "UPGRADE_INTERFACE_VERSION",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "coinImpl",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "contractName",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [],
        name: "contractVersion",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "payoutRecipient",
                type: "address",
            },
            { internalType: "address[]", name: "owners", type: "address[]" },
            { internalType: "string", name: "uri", type: "string" },
            { internalType: "string", name: "name", type: "string" },
            { internalType: "string", name: "symbol", type: "string" },
            {
                internalType: "address",
                name: "platformReferrer",
                type: "address",
            },
            { internalType: "address", name: "currency", type: "address" },
            { internalType: "int24", name: "tickLower", type: "int24" },
            { internalType: "uint256", name: "orderSize", type: "uint256" },
        ],
        name: "deploy",
        outputs: [
            { internalType: "address", name: "", type: "address" },
            { internalType: "uint256", name: "", type: "uint256" },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "payoutRecipient",
                type: "address",
            },
            { internalType: "address[]", name: "owners", type: "address[]" },
            { internalType: "string", name: "uri", type: "string" },
            { internalType: "string", name: "name", type: "string" },
            { internalType: "string", name: "symbol", type: "string" },
            { internalType: "bytes", name: "poolConfig", type: "bytes" },
            {
                internalType: "address",
                name: "platformReferrer",
                type: "address",
            },
            { internalType: "uint256", name: "orderSize", type: "uint256" },
        ],
        name: "deploy",
        outputs: [
            { internalType: "address", name: "", type: "address" },
            { internalType: "uint256", name: "", type: "uint256" },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "payoutRecipient",
                type: "address",
            },
            { internalType: "address[]", name: "owners", type: "address[]" },
            { internalType: "string", name: "uri", type: "string" },
            { internalType: "string", name: "name", type: "string" },
            { internalType: "string", name: "symbol", type: "string" },
            { internalType: "bytes", name: "poolConfig", type: "bytes" },
            {
                internalType: "address",
                name: "platformReferrer",
                type: "address",
            },
            { internalType: "address", name: "hook", type: "address" },
            { internalType: "bytes", name: "hookData", type: "bytes" },
        ],
        name: "deployWithHook",
        outputs: [
            { internalType: "address", name: "coin", type: "address" },
            { internalType: "bytes", name: "hookDataOut", type: "bytes" },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "implementation",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "initialOwner", type: "address" },
        ],
        name: "initialize",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "proxiableUUID",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "newOwner", type: "address" },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "newImplementation",
                type: "address",
            },
            { internalType: "bytes", name: "data", type: "bytes" },
        ],
        name: "upgradeToAndCall",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
] as const;

// TODO: To enable contract interaction, ensure
// the path (e.g., "~~/contracts/deployedContracts") correctly points to your contract
// addresses and ABIs file. For now, contract interaction is disabled.
// The expected structure for deployedContracts is:
// {
//   [chainId: number]: {
//     [contractName: string]: { address: Hex; abi: readonly AbiItem[] };
//   };
// }

// Define deployedContracts directly with Zora Factory info for Base and Base Sepolia
const deployedContracts: Record<
    number,
    Record<string, { address: Hex; abi: readonly any[] }>
> = {
    8453: {
        // Base Chain ID
        ZoraFactory: {
            address: "0x777777751622c0d3258f214F9DF38E35BF45baF3",
            abi: zoraFactoryImplementationABI,
        },
    },
    84532: {
        // Base Sepolia Chain ID
        ZoraFactory: {
            address: "0x777777751622c0d3258f214F9DF38E35BF45baF3", // Same address as Base Mainnet
            abi: zoraFactoryImplementationABI,
        },
    },
};

import { Hex } from "viem";
import { encodeFunctionData } from "viem";
class ContractInteractor extends ActionProvider<WalletProvider> {
    private chainId: number; // Changed from keyof typeof deployedContracts

    private static readonly SCHEMA = z.object({
        contractName: z.string(),
        functionName: z.string().describe("The name of the function to call"),
        functionArgs: z
            .array(z.string())
            .describe("The arguments to pass to the function"),
        value: z
            .string()
            .optional()
            .describe("The value to send with the transaction, in wei"),
    });

    private static readonly BASE_RESULT = z.object({
        contractName: z.string(),
        functionName: z.string(),
        error: z.string().optional(),
    });

    private static readonly READ_RESULT = ContractInteractor.BASE_RESULT.extend(
        {
            result: z.unknown(),
        }
    );

    private static readonly WRITE_RESULT =
        ContractInteractor.BASE_RESULT.extend({
            hash: z.string().optional(),
        });

    constructor(chainId: number) {
        // Changed from keyof typeof deployedContracts
        super("contract-interactor", []);
        this.chainId = chainId;
        // TODO: When re-enabling contract interactions, ensure deployedContracts[this.chainId] exists.
        if (
            !deployedContracts[this.chainId] ||
            Object.keys(deployedContracts[this.chainId]).length === 0
        ) {
            console.warn(
                `[ContractInteractor] No contracts configured for chainId ${this.chainId}. ` +
                    `Contract interactions via this tool will fail. Please configure your deployedContracts file.`
            );
        }
    }

    private createBaseResponse(
        args: z.infer<typeof ContractInteractor.SCHEMA>
    ) {
        return {
            contractName: args.contractName,
            functionName: args.functionName,
        };
    }

    private createErrorResponse(
        args: z.infer<typeof ContractInteractor.SCHEMA>,
        error: string
    ) {
        return {
            ...this.createBaseResponse(args),
            error,
        };
    }

    private validateContract(args: z.infer<typeof ContractInteractor.SCHEMA>) {
        // TODO: This logic will use the placeholder 'deployedContracts' object.
        // When you configure your actual contracts, this will validate against them.
        const chainContracts = deployedContracts[this.chainId];
        if (!chainContracts || Object.keys(chainContracts).length === 0) {
            return this.createErrorResponse(
                args,
                `Contract interaction is not configured for chainId ${this.chainId}. ` +
                    `Please ensure 'deployedContracts' is correctly set up.`
            );
        }

        const contractInfo = chainContracts[args.contractName];
        if (!contractInfo) {
            return this.createErrorResponse(
                args,
                `Contract "${args.contractName}" not found or not configured for chainId ${this.chainId}. ` +
                    `Available on this chain (if configured): ${Object.keys(chainContracts).join(", ")}`
            );
        }
        return contractInfo;
    }

    @CreateAction({
        name: "read-contract",
        description: "Call a read-only function on a contract",
        schema: ContractInteractor.SCHEMA,
    })
    async readContract(
        walletProvider: EvmWalletProvider,
        args: z.infer<typeof ContractInteractor.SCHEMA>
    ): Promise<string> {
        try {
            const contract = this.validateContract(args);
            if ("error" in contract) return contract.error;

            const result = await walletProvider.readContract({
                address: contract.address,
                abi: contract.abi,
                functionName: args.functionName,
                args: args.functionArgs,
            });

            return `Result of ${args.functionName} on ${args.contractName}: ${result}`;
        } catch (error) {
            return `Error: ${String(error)}`;
        }
    }

    @CreateAction({
        name: "write-contract",
        description: "Call a write function on a contract",
        schema: ContractInteractor.SCHEMA,
    })
    async writeContract(
        walletProvider: EvmWalletProvider,
        args: z.infer<typeof ContractInteractor.SCHEMA>
    ) {
        try {
            const contract = this.validateContract(args);
            if ("error" in contract) return contract; // error will now be an object { error: string }

            const hash = await walletProvider.sendTransaction({
                to: contract.address as Hex, // contract.address is Hex from placeholder type
                data: encodeFunctionData({
                    abi: contract.abi, // contract.abi is readonly any[] from placeholder type
                    functionName: args.functionName, // No longer 'as keyof typeof contract.abi.entries'
                    args: args.functionArgs, // This is already string[]
                }),
                value: args.value ? BigInt(args.value) : undefined,
            });

            return { ...this.createBaseResponse(args), hash };
        } catch (error) {
            return this.createErrorResponse(args, String(error));
        }
    }

    // eslint-disable-next-line
    supportsNetwork = (network: Network) =>
        Number(network.chainId) === this.chainId; // Compare numbers
}

export const contractInteractor = (
    chainId: number // Changed from keyof typeof deployedContracts
) => new ContractInteractor(chainId);
