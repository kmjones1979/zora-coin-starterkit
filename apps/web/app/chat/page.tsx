"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import { ChatInput } from "../components/chat/ChatInput";
import { MessageToolCalls } from "../components/chat/MessageToolCalls";
import { StatusIndicator } from "../components/chat/StatusIndicator";

export default function Chat() {
    const { messages, input, handleInputChange, handleSubmit, status, stop } =
        useChat({
            maxSteps: 10,
        });
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const lastMessageCount = useRef(messages.length);

    const scrollToBottom = () => {
        if (
            messages.length > lastMessageCount.current &&
            messagesContainerRef.current
        ) {
            const container = messagesContainerRef.current;
            container.scrollTop = container.scrollHeight;
            lastMessageCount.current = messages.length;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const renderMessage = (m: any) => {
        if (!m.parts) {
            return <ReactMarkdown>{m.content}</ReactMarkdown>;
        }

        const textParts = m.parts.filter((p: any) => p.type === "text");
        const toolParts = m.parts.filter(
            (p: any) => p.type === "tool-invocation"
        );

        return (
            <>
                {textParts.map((part: any, index: number) => (
                    <div
                        key={`text-${index}`}
                        className="mx-4 break-words whitespace-pre-wrap"
                    >
                        <ReactMarkdown
                            components={{
                                code: ({ ...props }) => (
                                    <code
                                        className="break-all font-mono text-sm"
                                        {...props}
                                    />
                                ),
                                p: ({ ...props }) => (
                                    <p className="break-words" {...props} />
                                ),
                            }}
                        >
                            {part.text}
                        </ReactMarkdown>
                    </div>
                ))}
                <MessageToolCalls toolParts={toolParts} messageId={m.id} />
            </>
        );
    };

    return (
        <div className="flex flex-col w-full max-w-md mx-auto h-[600px] my-8 relative bg-white dark:bg-zinc-900 rounded-lg shadow-xl">
            <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto px-4"
            >
                <div className="space-y-2 py-4">
                    {messages.map((m) => (
                        <div
                            key={m.id}
                            className={`flex ${m.role === "user" ? "justify-end ml-8" : "justify-start mr-8"}`}
                        >
                            <div
                                className={`flex flex-col rounded-lg w-fit max-w-[90%] ${
                                    m.role === "user"
                                        ? "bg-blue-100 dark:bg-blue-900/30"
                                        : "bg-zinc-100 dark:bg-zinc-800/50"
                                }`}
                            >
                                {renderMessage(m)}
                            </div>
                        </div>
                    ))}
                    <StatusIndicator status={status} onStop={stop} />
                </div>
            </div>
            <ChatInput
                input={input}
                status={status}
                onSubmit={handleSubmit}
                onChange={handleInputChange}
            />
        </div>
    );
}
