import NextAuth, { NextAuthOptions } from "next-auth";
import { Chain } from "viem";
import { siweAuthOptions } from "../utils/scaffold-eth/auth";

interface NextAuthHandlerProps {
    chain: Chain;
    authOptions?: Partial<NextAuthOptions>;
    onSuccess?: (address: string) => Promise<any>;
    onError?: (error: Error) => Promise<void>;
}

/**
 * Creates a Next.js Auth route handler with SIWE (Sign-In with Ethereum) configuration
 * This is useful for Next.js 13+ apps using SIWE with RainbowKit
 *
 * @example
 * ```typescript
 * // app/api/auth/[...nextauth]/route.ts
 * import { mainnet } from "viem/chains";
 * import { NextAuthHandler } from "~~/components/scaffold-eth";
 *
 * const { GET, POST } = NextAuthHandler({ chain: mainnet });
 * export { GET, POST };
 * ```
 */
export const NextAuthHandler = ({
    chain,
    authOptions = {},
    onSuccess,
    onError,
}: NextAuthHandlerProps) => {
    const handler = NextAuth(
        siweAuthOptions({
            chain,
            onSuccess,
            onError,
            ...authOptions,
        })
    );

    return handler;
};
