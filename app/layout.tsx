import type { Metadata } from "next";
import { Crimson_Text, Syne, Inter, Space_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

// Intentional multi-font system:
//  • Crimson Text (serif)    — editorial display: hero, page titles, premium moments
//  • Syne (geometric)        — distinctive headings & display numbers, art deco precision
//  • Inter                   — clean, refined body / UI
//  • Space Mono              — money, stats, tabular figures
const crimson = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
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
      className={`${crimson.variable} ${syne.variable} ${inter.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="h-full bg-surface-base text-ink-900 font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
