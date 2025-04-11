"use client";

import { useDebug } from "../contexts/DebugContext";
import { Button } from "./ui/button";

export function DebugToggle() {
    const { isDebug, toggleDebug } = useDebug();

    return (
        <Button
            variant={isDebug ? "default" : "outline"}
            size="sm"
            onClick={toggleDebug}
            className="text-foreground"
        >
            {isDebug ? "🔍 Debug On" : "Debug Off"}
        </Button>
    );
}
