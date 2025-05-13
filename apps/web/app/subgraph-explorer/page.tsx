"use client";

import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import {
    GetRecentCoinCreatedsDocument,
    execute,
} from "../../../../.graphclient";
import { print } from "graphql/language/printer";
import { useState, useCallback } from "react";
import React from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-graphql";
import "prismjs/themes/prism.css";
import ReactJson from "react-json-view";
import { FaCode, FaDatabase } from "react-icons/fa";

// Helper function to convert BigInts to strings
function stringifyBigInts(value: any): any {
    if (typeof value === "bigint") {
        return value.toString();
    }
    if (Array.isArray(value)) {
        return value.map(stringifyBigInts);
    }
    if (typeof value === "object" && value !== null) {
        const newObj: { [key: string]: any } = {};
        for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                newObj[key] = stringifyBigInts(value[key]);
            }
        }
        return newObj;
    }
    return value;
}

const DEFAULT_QUERY_DOCUMENT = GetRecentCoinCreatedsDocument;
const DEFAULT_QUERY_STRING = print(DEFAULT_QUERY_DOCUMENT);

const PROD_URL =
    "https://gateway.thegraph.com/api/subgraphs/id/HmU5oZZCHNxv7h79G6zJjkUN916uQPXamcMrCTg9YNm6";
const DEV_URL =
    "https://api.studio.thegraph.com/query/57382/zora-coins-factory-base-mainnet/version/latest";

console.log("API KEY:", process.env.NEXT_PUBLIC_GRAPH_API_KEY);

export default function SubgraphExplorer() {
    const [endpoint, setEndpoint] = useState("dev");
    const [queryText, setQueryText] = useState(DEFAULT_QUERY_STRING);
    const [submittedQuery, setSubmittedQuery] = useState(DEFAULT_QUERY_STRING);

    const { data, error, isLoading, refetch } = useQuery({
        queryKey: ["subgraph-data", endpoint, submittedQuery],
        queryFn: async () => {
            const sourceName =
                endpoint === "prod" ? "zoraCoinProd" : "zoraCoinDev";
            const context = {
                sourceName,
                headers:
                    endpoint === "prod"
                        ? {
                              Authorization: `Bearer ${process.env.NEXT_PUBLIC_GRAPH_API_KEY}`,
                          }
                        : {},
            };

            try {
                if (submittedQuery === DEFAULT_QUERY_STRING) {
                    const executionResult = await execute(
                        DEFAULT_QUERY_DOCUMENT,
                        {},
                        context
                    );
                    if (
                        executionResult.errors &&
                        executionResult.errors.length > 0
                    ) {
                        throw new Error(
                            executionResult.errors
                                .map((e) => e.message)
                                .join("\n")
                        );
                    }
                    return executionResult.data
                        ? stringifyBigInts(executionResult.data)
                        : null;
                } else {
                    const currentUrl = endpoint === "prod" ? PROD_URL : DEV_URL;
                    const currentHeaders =
                        endpoint === "prod"
                            ? {
                                  Authorization: `Bearer ${process.env.NEXT_PUBLIC_GRAPH_API_KEY}`,
                              }
                            : undefined;
                    const result = await request(
                        currentUrl,
                        submittedQuery,
                        {},
                        currentHeaders
                    );
                    return result ? stringifyBigInts(result) : null;
                }
            } catch (e: any) {
                // Ensure errors are thrown in a way that useQuery can catch them properly
                // And stringify BigInts in error objects too, if any part of it might be complex
                throw new Error(
                    e.message
                        ? stringifyBigInts(e.message)
                        : "An unknown error occurred"
                );
            }
        },
    });

    const handleRunQuery = useCallback(() => {
        setSubmittedQuery(queryText);
        refetch();
    }, [queryText, refetch]);

    const handleReset = () => setQueryText(DEFAULT_QUERY_STRING);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto bg-gray-950 border border-gray-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-extrabold mb-4 text-center tracking-tight text-white">
                    Subgraph Explorer
                </h2>
                <div className="mb-4 text-center text-base text-blue-300 font-medium">
                    Note: This explorer currently only supports the{" "}
                    <span className="font-bold">Base</span> network.
                </div>
                <div className="mb-8 flex flex-col md:flex-row gap-8 md:gap-0 h-[500px]">
                    {/* Query Editor */}
                    <div className="flex-1 min-w-0 md:pr-6 md:border-r md:border-gray-800">
                        <div className="flex items-center gap-2 mb-3">
                            <FaCode className="text-blue-400" />
                            <span className="font-semibold text-lg text-gray-200">
                                Query
                            </span>
                        </div>
                        <div className="rounded-xl border border-gray-800 bg-neutral-900 p-3 shadow-sm h-[440px] overflow-auto custom-scrollbar">
                            <Editor
                                value={queryText}
                                onValueChange={setQueryText}
                                highlight={(code) =>
                                    Prism.highlight(
                                        code,
                                        Prism.languages.graphql,
                                        "graphql"
                                    )
                                }
                                padding={16}
                                style={{
                                    fontFamily: "Fira Mono, monospace",
                                    fontSize: 16,
                                    height: "100%",
                                    background: "transparent",
                                    color: "#e5e7eb",
                                    overflow: "auto",
                                }}
                            />
                        </div>
                    </div>
                    {/* Response Viewer */}
                    <div className="flex-1 min-w-0 md:pl-6 flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                            <FaDatabase className="text-green-400" />
                            <span className="font-semibold text-lg text-gray-200">
                                Response
                            </span>
                        </div>
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 shadow-inner h-[440px] overflow-auto custom-scrollbar">
                            {isLoading && (
                                <div className="text-blue-300 font-semibold">
                                    Loading...
                                </div>
                            )}
                            {error && (
                                <div className="text-red-400 font-bold mb-2">
                                    Error: {error.message}
                                </div>
                            )}
                            {!isLoading && !error && (
                                <div className="fade-mask overflow-auto h-full">
                                    <ReactJson
                                        src={(data as any) || {}}
                                        name={false}
                                        theme="monokai"
                                        collapsed={2}
                                        enableClipboard={true}
                                        displayDataTypes={false}
                                        style={{
                                            fontSize: 15,
                                            background: "transparent",
                                            height: "100%",
                                            overflow: "auto",
                                        }}
                                    />
                                </div>
                            )}
                            <style>{`.fade-mask:after { content: ''; pointer-events: none; position: absolute; right: 0; bottom: 0; left: 0; height: 32px; background: linear-gradient(180deg, rgba(36,36,36,0) 0%, #111 100%); border-radius: 0 0 12px 12px;}`}</style>
                        </div>
                    </div>
                </div>
                {/* Buttons below the columns */}
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={handleRunQuery}
                        className="bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-400 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
                    >
                        Run Query
                    </button>
                    <button
                        onClick={handleReset}
                        className="bg-gray-800 hover:bg-gray-700 focus:ring-2 focus:ring-gray-600 text-gray-200 font-semibold px-5 py-2 rounded-lg transition"
                    >
                        Reset to Default
                    </button>
                </div>
                <div className="mb-2">
                    <label className="block mb-1 font-medium text-gray-300">
                        Endpoint
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <select
                            value={endpoint}
                            onChange={(e) => setEndpoint(e.target.value)}
                            className="border border-gray-700 rounded-lg px-3 py-2 font-medium bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
                    <div className="mt-2">
                        <span className="block text-xs text-gray-500 mb-1">
                            Current Endpoint URL:
                        </span>
                        <div
                            className="bg-gray-900 border border-gray-700 rounded px-3 py-2 font-mono text-xs text-gray-200 break-all select-all cursor-pointer shadow-sm"
                            title={endpoint === "prod" ? PROD_URL : DEV_URL}
                        >
                            {endpoint === "prod" ? PROD_URL : DEV_URL}
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
            .custom-scrollbar::-webkit-scrollbar { width: 8px; background: #222; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #444; border-radius: 4px; }
            .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #444 #222; }
            `}</style>
        </div>
    );
}
