import { LoadingSpinner } from "./LoadingSpinner";

interface ChatInputProps {
  input: string;
  status: string;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ChatInput({ input, status, onSubmit, onChange }: ChatInputProps) {
  return (
    <div className="border-t border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          className="flex-1 p-2 border border-zinc-300 dark:border-zinc-800 rounded shadow-md dark:bg-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
          value={input}
          placeholder={["ready", "error"].includes(status) ? "Say something..." : "Wait for AI response..."}
          onChange={onChange}
          disabled={!["ready", "error"].includes(status)}
        />
        <button
          type="submit"
          disabled={!input.trim() || !["ready", "error"].includes(status)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 dark:disabled:bg-blue-900 text-white rounded shadow-md transition-colors disabled:cursor-not-allowed"
        >
          {["ready", "error"].includes(status) ? (
            <span className="flex items-center gap-2">
              Send
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          ) : (
            <LoadingSpinner />
          )}
        </button>
      </form>
    </div>
  );
}
