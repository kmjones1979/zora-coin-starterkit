import { LoadingSpinner } from "./LoadingSpinner";

interface StatusIndicatorProps {
  status: string;
  onStop: () => void;
}

export function StatusIndicator({ status, onStop }: StatusIndicatorProps) {
  if (!(status === "submitted" || status === "streaming")) return null;

  return (
    <div className="flex justify-start mr-8">
      <div className="inline-flex items-center gap-4 p-2 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg">
        <div className="flex items-center gap-2">
          {status === "submitted" ? (
            <>
              <LoadingSpinner />
              <span className="text-sm text-zinc-500">Processing...</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-zinc-500">AI is typing...</span>
            </>
          )}
        </div>
        <button
          onClick={onStop}
          className="px-3 py-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          Stop generating
        </button>
      </div>
    </div>
  );
}
