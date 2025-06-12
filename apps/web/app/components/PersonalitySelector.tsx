"use client";

import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { PERSONALITIES, type Personality } from "../config/personalities";

// Re-export for backward compatibility
export { PERSONALITIES, type Personality };

interface PersonalitySelectorProps {
    selectedPersonality: string;
    onPersonalityChange: (personalityId: string) => void;
}

export function PersonalitySelector({
    selectedPersonality,
    onPersonalityChange,
}: PersonalitySelectorProps) {
    const currentPersonality =
        PERSONALITIES.find((p) => p.id === selectedPersonality) ||
        PERSONALITIES[0];

    return (
        <div className="flex items-center gap-3 mb-4 p-3 bg-card rounded-lg border">
            <div className="text-2xl">{currentPersonality.emoji}</div>
            <div className="flex-1">
                <Select
                    value={selectedPersonality}
                    onValueChange={onPersonalityChange}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose AI personality">
                            <div className="flex items-center gap-2">
                                <span>{currentPersonality.emoji}</span>
                                <span>{currentPersonality.name}</span>
                            </div>
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {PERSONALITIES.map((personality) => (
                            <SelectItem
                                key={personality.id}
                                value={personality.id}
                            >
                                <div className="flex items-center gap-3 py-1">
                                    <span className="text-lg">
                                        {personality.emoji}
                                    </span>
                                    <div>
                                        <div className="font-medium">
                                            {personality.name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {personality.description}
                                        </div>
                                    </div>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
