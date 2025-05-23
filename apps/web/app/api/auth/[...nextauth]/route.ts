import { baseSepolia } from "viem/chains";
import { NextAuthHandler } from "../../../components/NextAuthHandler";

const handler = NextAuthHandler({
    chain: baseSepolia,
});

export { handler as GET, handler as POST };
