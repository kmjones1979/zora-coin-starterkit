import { useTokenDetails } from "../hooks/useTokenDetails";

interface TokenDetailsProps {
    contractAddress: `0x${string}` | undefined;
}

export function TokenDetails({ contractAddress }: TokenDetailsProps) {
    const { tokenName, tokenSymbol, tokenSupply, refetchAll } = useTokenDetails(
        {
            contractAddress,
        }
    );

    if (!contractAddress) return null;

    return (
        <div className="space-y-2">
            <h3 className="text-lg font-semibold">Token Details</h3>
            <div className="grid grid-cols-2 gap-2">
                <div>Name:</div>
                <div>{tokenName || "Loading..."}</div>
                <div>Symbol:</div>
                <div>{tokenSymbol || "Loading..."}</div>
                <div>Total Supply:</div>
                <div>{tokenSupply?.toString() || "Loading..."}</div>
            </div>
            <button
                onClick={refetchAll}
                className="text-blue-500 hover:text-blue-700"
            >
                Refresh Details
            </button>
        </div>
    );
}
