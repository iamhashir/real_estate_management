import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Real Estate Management",
    template: "%s · Real Estate",
  },
  description:
    "Manage properties, clients, and deals — replacing spreadsheets with a fast, purpose-built tool for real estate agents.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="h-full bg-surface-base text-ink-900 font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
