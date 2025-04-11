import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./global.css";
import { ThemeProvider } from "./contexts/ThemeContext";

const geist = Geist({
    subsets: ["latin"],
    variable: "--font-geist",
});

export const metadata: Metadata = {
    title: "Zora Coin Creator",
    description: "Create and manage Zora coins across multiple chains",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geist.variable} antialiased`}>
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    );
}
