import { useContractRead } from "wagmi";
import { zora } from "viem/chains";

const tokenABI = [
    {
        inputs: [],
        name: "name",
        outputs: [{ name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "symbol",
        outputs: [{ name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "totalSupply",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
] as const;

interface UseTokenDetailsProps {
    contractAddress: `0x${string}` | undefined;
}

export function useTokenDetails({ contractAddress }: UseTokenDetailsProps) {
    const { data: tokenName, refetch: refetchName } = useContractRead({
        address: contractAddress,
        abi: tokenABI,
        functionName: "name",
        chainId: zora.id,
    });

    const { data: tokenSymbol, refetch: refetchSymbol } = useContractRead({
        address: contractAddress,
        abi: tokenABI,
        functionName: "symbol",
        chainId: zora.id,
    });

    const { data: tokenSupply, refetch: refetchSupply } = useContractRead({
        address: contractAddress,
        abi: tokenABI,
        functionName: "totalSupply",
        chainId: zora.id,
    });

    const refetchAll = async () => {
        await Promise.all([refetchName(), refetchSymbol(), refetchSupply()]);
    };

    return {
        tokenName,
        tokenSymbol,
        tokenSupply,
        refetchAll,
    };
}
