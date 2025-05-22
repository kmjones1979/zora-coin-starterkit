import { foundry } from "viem/chains";
import { NextAuthHandler } from "../../../components/NextAuthHandler";

const handler = NextAuthHandler({
    chain: foundry,
});

export { handler as GET, handler as POST };
