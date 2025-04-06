import { useDebug } from "../contexts/DebugContext";

export function DebugToggle() {
    const { isDebug, toggleDebug } = useDebug();

    return (
        <button
            onClick={toggleDebug}
            className={`btn btn-sm ${isDebug ? "btn-primary" : "btn-ghost"}`}
            title="Toggle Debug Mode"
        >
            {isDebug ? "🔍 Debug On" : "Debug Off"}
        </button>
    );
}
