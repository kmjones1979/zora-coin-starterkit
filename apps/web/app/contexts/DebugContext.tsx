import { createContext, useContext, useState, ReactNode } from "react";

interface DebugContextType {
    isDebug: boolean;
    toggleDebug: () => void;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export function DebugProvider({ children }: { children: ReactNode }) {
    const [isDebug, setIsDebug] = useState(true); // Default to true

    const toggleDebug = () => {
        setIsDebug((prev) => !prev);
    };

    return (
        <DebugContext.Provider value={{ isDebug, toggleDebug }}>
            {children}
        </DebugContext.Provider>
    );
}

export function useDebug() {
    const context = useContext(DebugContext);
    if (context === undefined) {
        throw new Error("useDebug must be used within a DebugProvider");
    }
    return context;
}
