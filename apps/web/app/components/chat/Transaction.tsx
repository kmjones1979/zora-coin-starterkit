import { Chain } from "viem";
import { foundry } from "viem/chains";

interface TransactionProps {
  hash: string;
  chain: Chain;
}

export function Transaction({ hash, chain }: TransactionProps) {
  const explorerUrl =
    chain.id === foundry.id ? `blockexplorer/transaction/${hash}` : `${chain.blockExplorers?.default.url}/tx/${hash}`;

  return (
    <a
      href={explorerUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-mono text-xs bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-2 py-1 rounded transition-colors"
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
      {hash.slice(0, 6)}...{hash.slice(-4)}
    </a>
  );
}
