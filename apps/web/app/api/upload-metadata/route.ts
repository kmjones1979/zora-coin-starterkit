import { NextRequest, NextResponse } from "next/server";

// Pinata API configuration
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_API_SECRT;
const PINATA_JWT = process.env.PINATA_JWT;

export async function POST(request: NextRequest) {
    try {
        const metadata = await request.json();

        // Validate the metadata structure
        if (!metadata || typeof metadata !== "object") {
            return NextResponse.json(
                { error: "Invalid metadata format" },
                { status: 400 }
            );
        }

        if (!metadata.name || typeof metadata.name !== "string") {
            return NextResponse.json(
                { error: 'Metadata must have a "name" field as a string' },
                { status: 400 }
            );
        }

        // Check if Pinata credentials are available
        if (!PINATA_JWT && (!PINATA_API_KEY || !PINATA_SECRET_API_KEY)) {
            console.error("Pinata credentials not configured");
            return NextResponse.json(
                {
                    error: "IPFS service not configured. Please set up Pinata credentials.",
                },
                { status: 500 }
            );
        }

        // Upload to Pinata
        const pinataUrl = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        // Use JWT if available, otherwise use API key + secret
        if (PINATA_JWT) {
            headers["Authorization"] = `Bearer ${PINATA_JWT}`;
        } else {
            headers["pinata_api_key"] = PINATA_API_KEY!;
            headers["pinata_secret_api_key"] = PINATA_SECRET_API_KEY!;
        }

        const pinataBody = {
            pinataContent: metadata,
            pinataMetadata: {
                name: `${metadata.name.replace(/[^a-zA-Z0-9]/g, "_")}_metadata.json`,
                keyvalues: {
                    tokenName: metadata.name,
                    uploadedAt: new Date().toISOString(),
                    source: "zora-coin-creator",
                },
            },
            pinataOptions: {
                cidVersion: 1,
            },
        };

        console.log("Uploading to Pinata...", { name: metadata.name });

        const response = await fetch(pinataUrl, {
            method: "POST",
            headers,
            body: JSON.stringify(pinataBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Pinata upload failed:", response.status, errorText);
            return NextResponse.json(
                {
                    error: `Failed to upload to IPFS: ${response.status} ${errorText}`,
                },
                { status: response.status }
            );
        }

        const result = await response.json();
        const ipfsHash = result.IpfsHash;

        if (!ipfsHash) {
            console.error("No IPFS hash returned from Pinata");
            return NextResponse.json(
                { error: "Failed to get IPFS hash from upload service" },
                { status: 500 }
            );
        }

        // Wait for IPFS data to be available
        const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
        let isAvailable = false;
        let attempts = 0;
        const maxAttempts = 30; // 30 seconds max wait time

        console.log("Waiting for IPFS data availability...");

        while (!isAvailable && attempts < maxAttempts) {
            try {
                const verifyResponse = await fetch(ipfsUrl, {
                    method: "HEAD",
                    signal: AbortSignal.timeout(2000), // 2 second timeout per attempt
                });

                if (verifyResponse.ok) {
                    isAvailable = true;
                    console.log("IPFS data is available!");
                } else {
                    attempts++;
                    if (attempts < maxAttempts) {
                        await new Promise((resolve) =>
                            setTimeout(resolve, 1000)
                        ); // Wait 1 second
                    }
                }
            } catch (error) {
                attempts++;
                if (attempts < maxAttempts) {
                    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
                }
            }
        }

        if (!isAvailable) {
            console.warn(
                "IPFS data not immediately available, but upload succeeded"
            );
        }

        return NextResponse.json({
            success: true,
            ipfsHash: `ipfs://${ipfsHash}`,
            ipfsUrl: ipfsUrl,
            pinataUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
            isAvailable,
            message: isAvailable
                ? "Metadata uploaded successfully and is available on IPFS"
                : "Metadata uploaded successfully. IPFS propagation may take a few moments.",
        });
    } catch (error) {
        console.error("Error uploading metadata:", error);
        return NextResponse.json(
            { error: "Failed to upload metadata to IPFS" },
            { status: 500 }
        );
    }
}
