"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { useCoinCreation } from "../hooks/useCoinCreation";
import { useAccount, useChainId } from "wagmi";
import { Address, parseEther, formatEther } from "viem";
import { CHAINS } from "../config/chains";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "./ui/card";

interface TransactionStatusProps {
    transactionHash?: `0x${string}`;
    status?: string;
    name: string;
    symbol: string;
    uri: string;
    chainId: keyof typeof CHAINS;
    tokenAddress?: `0x${string}`;
}

function TransactionStatus({
    transactionHash,
    status = "",
    name,
    symbol,
    uri,
    chainId,
    tokenAddress,
}: TransactionStatusProps) {
    if (!transactionHash) return null;

    const getTransactionStatusColor = (status: string) => {
        if (status.includes("success")) return "text-green-600";
        if (status.includes("failed")) return "text-red-600";
        return "text-yellow-600";
    };

    const getExplorerUrl = (hash: `0x${string}`) => {
        const chain = CHAINS[chainId];
        return chain ? `${chain.explorer}/tx/${hash}` : "#";
    };

    const getTokenExplorerUrl = (address: `0x${string}`) => {
        const chain = CHAINS[chainId];
        return chain ? `${chain.explorer}/address/${address}` : "#";
    };

    return (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Transaction Status</h3>
            <div className="space-y-2">
                <div>
                    <span className="font-medium">Status:</span>{" "}
                    <span className={getTransactionStatusColor(status)}>
                        {status}
                    </span>
                </div>
                <div>
                    <span className="font-medium">Transaction Hash:</span>{" "}
                    <a
                        href={getExplorerUrl(transactionHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-blue-600 hover:text-blue-800"
                    >
                        {transactionHash.slice(0, 6)}...
                        {transactionHash.slice(-4)}
                    </a>
                </div>
                {status.includes("success") && (
                    <div className="mt-4">
                        <h4 className="font-semibold mb-2">Token Created</h4>
                        <div className="space-y-1 text-sm">
                            <div>
                                <span className="font-medium">Name:</span>{" "}
                                {name}
                            </div>
                            <div>
                                <span className="font-medium">Symbol:</span>{" "}
                                {symbol}
                            </div>
                            <div>
                                <span className="font-medium">IPFS Hash:</span>{" "}
                                {uri}
                            </div>
                            {tokenAddress && (
                                <div>
                                    <span className="font-medium">
                                        Token Address:
                                    </span>{" "}
                                    <a
                                        href={getTokenExplorerUrl(tokenAddress)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-mono text-blue-600 hover:text-blue-800"
                                    >
                                        {tokenAddress}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

interface CoinFormProps {
    onSuccess?: (hash: `0x${string}`) => void;
}

interface TokenMetadata {
    name: string;
    description?: string;
    image?: string;
    attributes?: Array<{
        trait_type: string;
        value: string | number;
    }>;
    external_url?: string;
}

export function CoinForm({ onSuccess }: CoinFormProps) {
    const { address } = useAccount();
    const chainId = useChainId() as keyof typeof CHAINS;
    const [name, setName] = useState("Trump");
    const [symbol, setSymbol] = useState("TRUMP");
    const [uri, setUri] = useState(
        "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"
    );
    const [error, setError] = useState<string | null>(null);
    const [tokenAddress, setTokenAddress] = useState<`0x${string}` | null>(
        null
    );
    const [performInitialPurchase, setPerformInitialPurchase] = useState(false);
    const [initialEthAmount, setInitialEthAmount] = useState("0");
    const [initialWeiAmount, setInitialWeiAmount] = useState<bigint>(BigInt(0));

    // Metadata upload states
    const [useMetadataUpload, setUseMetadataUpload] = useState(false);
    const [metadataFile, setMetadataFile] = useState<File | null>(null);
    const [metadataContent, setMetadataContent] =
        useState<TokenMetadata | null>(null);
    const [metadataError, setMetadataError] = useState<string | null>(null);
    const [isUploadingMetadata, setIsUploadingMetadata] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<string>("");

    // Simple template for metadata
    const defaultMetadata: TokenMetadata = {
        name: "",
        description: "A token created on Zora",
        image: "",
        attributes: [],
        external_url: "",
    };

    const [editableMetadata, setEditableMetadata] =
        useState<TokenMetadata>(defaultMetadata);

    useEffect(() => {
        if (name !== editableMetadata.name) {
            setEditableMetadata((prev) => ({ ...prev, name }));
        }
    }, [name]);

    useEffect(() => {
        try {
            if (
                initialEthAmount &&
                !isNaN(parseFloat(initialEthAmount)) &&
                parseFloat(initialEthAmount) >= 0
            ) {
                const wei = parseEther(initialEthAmount as `${number}`);
                setInitialWeiAmount(wei);
                setError(null);
            } else if (initialEthAmount === "") {
                setInitialWeiAmount(BigInt(0));
            } else {
                if (initialEthAmount !== "." && initialEthAmount !== "") {
                    setError("Invalid ETH amount");
                }
                setInitialWeiAmount(BigInt(0));
            }
        } catch (e) {
            setError("Invalid ETH amount format");
            setInitialWeiAmount(BigInt(0));
        }
    }, [initialEthAmount]);

    const validateMetadata = (metadata: any): TokenMetadata => {
        if (typeof metadata !== "object" || metadata === null) {
            throw new Error("Metadata must be a valid JSON object");
        }

        if (!metadata.name || typeof metadata.name !== "string") {
            throw new Error('Metadata must have a "name" field as a string');
        }

        // Return validated metadata with defaults
        return {
            name: metadata.name,
            description: metadata.description || "A token created on Zora",
            image: metadata.image || "",
            attributes: Array.isArray(metadata.attributes)
                ? metadata.attributes
                : [],
            external_url: metadata.external_url || "",
        };
    };

    const handleMetadataFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setMetadataFile(file);
        setMetadataError(null);

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const content = event.target?.result as string;
                const parsed = JSON.parse(content);
                const validated = validateMetadata(parsed);
                setMetadataContent(validated);
                setEditableMetadata(validated);
            } catch (err) {
                setMetadataError(
                    `Invalid JSON file: ${err instanceof Error ? err.message : "Unknown error"}`
                );
                setMetadataContent(null);
            }
        };
        reader.readAsText(file);
    };

    const uploadToIPFS = async (metadata: TokenMetadata): Promise<string> => {
        setUploadProgress("Uploading to IPFS...");

        try {
            const response = await fetch("/api/upload-metadata", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(metadata),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to upload to IPFS");
            }

            const data = await response.json();

            if (!data.isAvailable) {
                setUploadProgress(
                    "Upload successful! Waiting for IPFS propagation..."
                );
                // Additional wait time if needed
                await new Promise((resolve) => setTimeout(resolve, 2000));
            }

            setUploadProgress("Upload complete!");
            return data.ipfsHash;
        } catch (error) {
            console.error("IPFS upload failed:", error);
            throw error;
        }
    };

    const handleMetadataUpload = async () => {
        if (!metadataContent) {
            setMetadataError("Please select a valid metadata file first");
            return;
        }

        setIsUploadingMetadata(true);
        setMetadataError(null);
        setUploadProgress("");

        try {
            const ipfsHash = await uploadToIPFS(metadataContent);
            setUri(ipfsHash);
            setMetadataError(null);
        } catch (err) {
            setMetadataError(
                `Failed to upload metadata: ${err instanceof Error ? err.message : "Unknown error"}`
            );
        } finally {
            setIsUploadingMetadata(false);
            setUploadProgress("");
        }
    };

    const handleCreateMetadataFile = () => {
        const blob = new Blob([JSON.stringify(editableMetadata, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${symbol.toLowerCase()}-metadata.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleUseGeneratedMetadata = async () => {
        setIsUploadingMetadata(true);
        setMetadataError(null);
        setUploadProgress("");

        try {
            const ipfsHash = await uploadToIPFS(editableMetadata);
            setUri(ipfsHash);
            setMetadataContent(editableMetadata);
            setMetadataError(null);
        } catch (err) {
            setMetadataError(
                `Failed to upload metadata: ${err instanceof Error ? err.message : "Unknown error"}`
            );
        } finally {
            setIsUploadingMetadata(false);
            setUploadProgress("");
        }
    };

    const {
        write,
        isLoading,
        error: contractError,
        transactionHash,
        status,
        tokenAddress: contractTokenAddress,
    } = useCoinCreation({
        name,
        symbol,
        uri,
        owners: undefined,
        payoutRecipient:
            address || "0x0000000000000000000000000000000000000000",
        platformReferrer: address || undefined,
        initialPurchaseWei: performInitialPurchase
            ? initialWeiAmount
            : BigInt(0),
        chainId,
    });

    const handleEthAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setInitialEthAmount(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            useMetadataUpload &&
            (!uri ||
                uri === "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco")
        ) {
            setError("Please upload metadata or enter a valid IPFS hash.");
            return;
        }

        if (!uri || uri === "ipfs://Qm...") {
            setError("Please enter a valid IPFS hash for metadata.");
            return;
        }

        if (
            performInitialPurchase &&
            initialWeiAmount <= BigInt(0) &&
            initialEthAmount !== "0" &&
            initialEthAmount !== ""
        ) {
            setError("Initial purchase amount must be greater than 0 ETH.");
            return;
        }
        setError(null);

        if (performInitialPurchase) {
            console.log(
                "[Debug] Attempting initial purchase with Wei amount:",
                initialWeiAmount.toString()
            );
        } else {
            console.log("[Debug] No initial purchase requested.");
        }

        write?.();
    };

    if (transactionHash && status === "success") {
        onSuccess?.(transactionHash);
    }

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg">
            <CardHeader className="space-y-1">
                <CardTitle className="text-3xl font-semibold text-foreground">
                    Create New Coin
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                    Deploy your own ERC20 token on Zora
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="name">Coin Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="My Awesome Coin"
                            required
                            className="text-foreground"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Example: My Awesome Coin
                        </p>
                    </div>

                    <div>
                        <Label htmlFor="symbol">Symbol</Label>
                        <Input
                            id="symbol"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
                            placeholder="MAC"
                            required
                            className="text-foreground"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Example: MAC
                        </p>
                    </div>

                    {/* Metadata Section */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="useMetadataUpload"
                                checked={useMetadataUpload}
                                onCheckedChange={(checked: boolean) => {
                                    setUseMetadataUpload(Boolean(checked));
                                    if (!checked) {
                                        setMetadataFile(null);
                                        setMetadataContent(null);
                                        setMetadataError(null);
                                        setUploadProgress("");
                                    }
                                }}
                            />
                            <Label
                                htmlFor="useMetadataUpload"
                                className="cursor-pointer"
                            >
                                Upload/Create Metadata
                            </Label>
                        </div>

                        <p className="text-xs text-gray-500 ml-6">
                            Upload metadata to IPFS using Pinata service
                            (requires API credentials)
                        </p>

                        {useMetadataUpload ? (
                            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                                <div className="flex space-x-4">
                                    <div className="flex-1">
                                        <Label htmlFor="metadataFile">
                                            Upload JSON Metadata
                                        </Label>
                                        <Input
                                            id="metadataFile"
                                            type="file"
                                            accept=".json"
                                            onChange={handleMetadataFileChange}
                                            className="text-foreground"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            <a
                                                href="/example-metadata.json"
                                                download
                                                className="text-blue-600 hover:text-blue-800 underline"
                                            >
                                                Download example metadata.json
                                            </a>
                                        </p>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Button
                                            type="button"
                                            onClick={handleMetadataUpload}
                                            disabled={
                                                !metadataContent ||
                                                isUploadingMetadata
                                            }
                                            variant="outline"
                                            size="sm"
                                        >
                                            {isUploadingMetadata
                                                ? "Uploading..."
                                                : "Upload to IPFS"}
                                        </Button>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <Label>Or Create Metadata</Label>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        <div>
                                            <Label htmlFor="metaDescription">
                                                Description
                                            </Label>
                                            <Input
                                                id="metaDescription"
                                                value={
                                                    editableMetadata.description
                                                }
                                                onChange={(e) =>
                                                    setEditableMetadata(
                                                        (prev) => ({
                                                            ...prev,
                                                            description:
                                                                e.target.value,
                                                        })
                                                    )
                                                }
                                                placeholder="Token description"
                                                className="text-foreground"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="metaImage">
                                                Image URL
                                            </Label>
                                            <Input
                                                id="metaImage"
                                                value={editableMetadata.image}
                                                onChange={(e) =>
                                                    setEditableMetadata(
                                                        (prev) => ({
                                                            ...prev,
                                                            image: e.target
                                                                .value,
                                                        })
                                                    )
                                                }
                                                placeholder="https://example.com/image.png"
                                                className="text-foreground"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="metaExternalUrl">
                                                External URL
                                            </Label>
                                            <Input
                                                id="metaExternalUrl"
                                                value={
                                                    editableMetadata.external_url
                                                }
                                                onChange={(e) =>
                                                    setEditableMetadata(
                                                        (prev) => ({
                                                            ...prev,
                                                            external_url:
                                                                e.target.value,
                                                        })
                                                    )
                                                }
                                                placeholder="https://example.com"
                                                className="text-foreground"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 mt-4">
                                        <Button
                                            type="button"
                                            onClick={handleCreateMetadataFile}
                                            variant="outline"
                                            size="sm"
                                        >
                                            Download JSON
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={handleUseGeneratedMetadata}
                                            disabled={isUploadingMetadata}
                                            variant="outline"
                                            size="sm"
                                        >
                                            {isUploadingMetadata
                                                ? "Uploading..."
                                                : "Use This Metadata"}
                                        </Button>
                                    </div>

                                    {/* Preview of current metadata */}
                                    <div className="bg-gray-100 p-3 rounded mt-4">
                                        <Label className="text-sm font-medium">
                                            Current Metadata Preview:
                                        </Label>
                                        <pre className="text-xs mt-1 overflow-x-auto text-gray-700 max-h-32">
                                            {JSON.stringify(
                                                editableMetadata,
                                                null,
                                                2
                                            )}
                                        </pre>
                                    </div>
                                </div>

                                {uploadProgress && (
                                    <div className="text-blue-600 text-sm">
                                        {uploadProgress}
                                    </div>
                                )}

                                {metadataError && (
                                    <div className="text-red-500 text-sm">
                                        {metadataError}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>
                                <Label htmlFor="uri">
                                    IPFS Hash (Metadata)
                                </Label>
                                <Input
                                    id="uri"
                                    value={uri}
                                    onChange={(e) => setUri(e.target.value)}
                                    placeholder="ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"
                                    required
                                    className="text-foreground"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Enter a valid IPFS hash for your token
                                    metadata. <br />
                                    Example:
                                    ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="initialPurchase"
                            checked={performInitialPurchase}
                            onCheckedChange={(checked: boolean) =>
                                setPerformInitialPurchase(Boolean(checked))
                            }
                        />
                        <Label
                            htmlFor="initialPurchase"
                            className="cursor-pointer"
                        >
                            Perform Initial Purchase?
                        </Label>
                    </div>

                    {performInitialPurchase && (
                        <div className="space-y-2">
                            <Label htmlFor="ethAmount">
                                Initial Purchase (ETH)
                            </Label>
                            <div className="flex items-center space-x-2">
                                <Input
                                    id="ethAmount"
                                    type="text"
                                    value={initialEthAmount}
                                    onChange={handleEthAmountChange}
                                    placeholder="0.01"
                                    className="text-foreground w-1/2"
                                />
                                <span
                                    className="text-sm text-muted-foreground flex-shrink-0"
                                    title={initialWeiAmount.toString() + " Wei"}
                                >
                                    ≈ {formatEther(initialWeiAmount)} ETH *
                                    <br />
                                    <i className="text-xs">
                                        (Calculated:{" "}
                                        {initialWeiAmount.toString()} Wei)
                                    </i>
                                </span>
                            </div>
                            {error &&
                                (initialEthAmount !== "" ||
                                    !performInitialPurchase) && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {error}
                                    </p>
                                )}
                            <p className="text-xs text-muted-foreground mt-1">
                                * Enter the amount of ETH to spend on the
                                initial purchase.
                            </p>
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={
                            isLoading ||
                            (performInitialPurchase && !!error) ||
                            isUploadingMetadata
                        }
                    >
                        {isLoading ? "Creating..." : "Create Coin"}
                    </Button>

                    {contractError && (
                        <div className="text-red-500 mt-2">
                            Error: {contractError.message}
                        </div>
                    )}
                </form>

                <TransactionStatus
                    transactionHash={transactionHash}
                    status={status}
                    name={name}
                    symbol={symbol}
                    uri={uri}
                    chainId={chainId}
                    tokenAddress={contractTokenAddress || undefined}
                />
            </CardContent>
        </Card>
    );
}
