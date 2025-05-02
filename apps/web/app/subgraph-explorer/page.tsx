"use client";

import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import { useState } from "react";
import React from "react";

const query = gql`
    {
        coinCreateds(first: 5) {
            id
            caller {
                id
            }
            payoutRecipient
            platformReferrer
        }
        callers(first: 5) {
            id
            coinsCreated {
                id
            }
            blockNumber
            blockTimestamp
        }
    }
`;

const PROD_URL =
    "https://gateway.thegraph.com/api/subgraphs/id/HmU5oZZCHNxv7h79G6zJjkUN916uQPXamcMrCTg9YNm6";
const DEV_URL =
    "https://api.studio.thegraph.com/query/57382/zora-coins-factory-base-mainnet/version/latest";

console.log("API KEY:", process.env.NEXT_PUBLIC_GRAPH_API_KEY);

export default function SubgraphExplorer() {
    const [endpoint, setEndpoint] = useState("dev");
    const url = endpoint === "prod" ? PROD_URL : DEV_URL;
    const headers =
        endpoint === "prod"
            ? {
                  Authorization: `Bearer ${process.env.NEXT_PUBLIC_GRAPH_API_KEY}`,
              }
            : undefined;

    const { data, error, isLoading } = useQuery({
        queryKey: ["subgraph-data", endpoint],
        queryFn: async () => await request(url, query, {}, headers),
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white/90 border border-gray-200 rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Subgraph Explorer
                </h2>
                <div className="mb-4 text-center text-sm text-blue-700 font-medium">
                    Note: This explorer currently only supports the{" "}
                    <span className="font-bold">Base</span> network.
                </div>
                <div className="mb-6">
                    <label className="block mb-2 font-semibold text-gray-700">
                        Select Endpoint
                    </label>
                    <div className="flex items-center gap-4">
                        <select
                            value={endpoint}
                            onChange={(e) => setEndpoint(e.target.value)}
                            className="border rounded px-3 py-2 font-medium bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="dev">
                                Development (Studio, no API key)
                            </option>
                            <option value="prod">
                                Production (Gateway, needs API key)
                            </option>
                        </select>
                        <span className="text-xs text-gray-500">
                            (
                            {endpoint === "dev"
                                ? "No API key required"
                                : "API key required"}
                            )
                        </span>
                    </div>
                    <div className="mt-3">
                        <span className="block text-xs text-gray-500 mb-1">
                            Current Endpoint URL:
                        </span>
                        <div
                            className="bg-gray-100 border rounded px-3 py-2 font-mono text-xs text-gray-800 break-all select-all cursor-pointer"
                            title={url}
                        >
                            {url}
                        </div>
                    </div>
                </div>
                <div className="mb-6">
                    <h3 className="font-semibold mb-2 text-gray-700">
                        Query Response
                    </h3>
                    <div className="bg-black/90 border border-gray-800 rounded p-4 overflow-x-auto max-h-80">
                        {isLoading && (
                            <div className="text-blue-400">Loading...</div>
                        )}
                        {error && (
                            <div className="text-red-400 font-bold mb-2">
                                Error: {error.message}
                            </div>
                        )}
                        <pre className="text-xs text-green-200 font-mono whitespace-pre-wrap">
                            <code>{JSON.stringify(data, null, 2) || "{}"}</code>
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}
