import {
    ActionProvider,
    EvmWalletProvider,
    Network,
    CreateAction,
    WalletProvider,
} from "@coinbase/agentkit";
import { z } from "zod";
// import deployedContracts from "~~/contracts/deployedContracts";
// TODO: To enable contract interaction, uncomment the import above and ensure
// the path (e.g., "~~/contracts/deployedContracts") correctly points to your contract
// addresses and ABIs file. For now, contract interaction is disabled.
// The expected structure for deployedContracts is:
// {
//   [chainId: number]: {
//     [contractName: string]: { address: Hex; abi: readonly AbiItem[] };
//   };
// }
const deployedContracts: Record<
    number,
    Record<string, { address: Hex; abi: readonly any[] }>
> = {};

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
