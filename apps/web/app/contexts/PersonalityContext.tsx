"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { PERSONALITIES } from "../components/PersonalitySelector";

interface PersonalityContextType {
    selectedPersonality: string;
    setSelectedPersonality: (personalityId: string) => void;
    getCurrentPersonality: () => any;
}

const PersonalityContext = createContext<PersonalityContextType | undefined>(
    undefined
);

export function PersonalityProvider({ children }: { children: ReactNode }) {
    const [selectedPersonality, setSelectedPersonality] = useState("default");

    const getCurrentPersonality = () => {
        return (
            PERSONALITIES.find((p) => p.id === selectedPersonality) ||
            PERSONALITIES[0]
        );
    };

    return (
        <PersonalityContext.Provider
            value={{
                selectedPersonality,
                setSelectedPersonality,
                getCurrentPersonality,
            }}
        >
            {children}
        </PersonalityContext.Provider>
    );
}

export function usePersonality() {
    const context = useContext(PersonalityContext);
    if (context === undefined) {
        throw new Error(
            "usePersonality must be used within a PersonalityProvider"
        );
    }
    return context;
}
