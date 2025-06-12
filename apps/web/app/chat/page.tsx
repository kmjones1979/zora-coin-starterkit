"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import { ChatInput } from "../components/chat/ChatInput";
import { MessageToolCalls } from "../components/chat/MessageToolCalls";
import { StatusIndicator } from "../components/chat/StatusIndicator";
import { Header } from "../components/Header";
import { useAccount, useChainId } from "wagmi";
import { useSession } from "next-auth/react";
import { CHAINS } from "../config/chains";
import { PersonalitySelector } from "../components/PersonalitySelector";
import { usePersonality } from "../contexts/PersonalityContext";

export default function Chat() {
    const { address, isConnected } = useAccount();
    const { data: session, status: sessionStatus } = useSession();
    const chainId = useChainId();
    const currentChain = CHAINS[chainId as keyof typeof CHAINS];
    const {
        selectedPersonality,
        setSelectedPersonality,
        getCurrentPersonality,
    } = usePersonality();

    const {
        messages,
        input,
        handleInputChange,
        handleSubmit: originalHandleSubmit,
        status,
        stop,
    } = useChat({
        maxSteps: 10,
        body: {
            chainId,
            personality: selectedPersonality,
        },
    });
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const lastMessageCount = useRef(messages.length);

    type OriginalHandleSubmitType = typeof originalHandleSubmit;

    const handleSubmit: OriginalHandleSubmitType = (e, options) => {
        e.preventDefault();
        if (!session) {
            alert("Please connect your wallet and sign in to use the chat.");
            return;
        }
        if (!currentChain) {
            alert("Please switch to a supported chain before using the chat.");
            return;
        }
        originalHandleSubmit(e, options);
    };

    useEffect(() => {
        if (
            messages.length > lastMessageCount.current &&
            messagesContainerRef.current
        ) {
            messagesContainerRef.current.scrollTop =
                messagesContainerRef.current.scrollHeight;
            lastMessageCount.current = messages.length;
        }
    }, [messages]);

    // Show authentication status
    const renderAuthStatus = () => {
        if (!isConnected) {
            return (
                <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <p className="text-amber-800 dark:text-amber-200">
                        Please connect your wallet to use the chat.
                    </p>
                </div>
            );
        }

        if (sessionStatus === "loading") {
            return (
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-blue-800 dark:text-blue-200">
                        Checking authentication status...
                    </p>
                </div>
            );
        }

        if (!session) {
            return (
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                    <p className="text-orange-800 dark:text-orange-200">
                        Wallet connected! Please click "Sign In" in the header
                        to authenticate and use the chat.
                    </p>
                </div>
            );
        }

        // Check if current chain is supported
        if (!currentChain) {
            const supportedChains = Object.values(CHAINS)
                .map((chain) => chain.name)
                .join(", ");
            return (
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-800 dark:text-red-200">
                        Unsupported chain (ID: {chainId}). Please switch to a
                        supported chain: {supportedChains}
                    </p>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="bg-card border rounded-lg shadow-sm h-[calc(100vh-12rem)] flex flex-col">
                    <div className="border-b p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-xl font-semibold">
                                    AI Chat Assistant
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Ask questions about Web3, create Zora coins,
                                    or interact with smart contracts.
                                </p>
                            </div>
                            {currentChain && (
                                <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
                                    <span className="text-lg">
                                        {currentChain.icon}
                                    </span>
                                    <div className="text-sm">
                                        <div className="font-medium">
                                            {currentChain.name}
                                        </div>
                                        <div className="text-muted-foreground">
                                            Chain {chainId}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {renderAuthStatus()}

                    <div
                        ref={messagesContainerRef}
                        className="flex-1 overflow-y-auto p-4 space-y-4"
                    >
                        {messages.length === 0 ? (
                            <div className="text-center text-muted-foreground py-8">
                                <p>
                                    Welcome! Start a conversation to get help
                                    with Web3 tasks.
                                </p>
                            </div>
                        ) : (
                            messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${
                                        message.role === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                            message.role === "user"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted"
                                        }`}
                                    >
                                        {message.role === "assistant" &&
                                            message.toolInvocations && (
                                                <MessageToolCalls
                                                    toolParts={message.toolInvocations.map(
                                                        (ti) => ({
                                                            toolInvocation: ti,
                                                        })
                                                    )}
                                                    messageId={message.id}
                                                />
                                            )}
                                        <ReactMarkdown>
                                            {message.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="border-t p-4">
                        <PersonalitySelector
                            selectedPersonality={selectedPersonality}
                            onPersonalityChange={setSelectedPersonality}
                        />
                        <div className="flex items-center gap-2 mb-2">
                            <StatusIndicator status={status} onStop={stop} />
                        </div>
                        <ChatInput
                            input={input}
                            status={status}
                            onSubmit={handleSubmit}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
