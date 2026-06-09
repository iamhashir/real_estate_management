import type { Metadata } from "next";
import { Fraunces, Bricolage_Grotesque, Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

// Intentional multi-font system:
//  • Fraunces (serif)        — editorial display: hero, page titles, names
//  • Bricolage Grotesque     — characterful section/card headings + wordmark
//  • Plus Jakarta Sans       — body / UI
//  • Space Mono              — money, stats, tabular figures
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
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
      className={`${fraunces.variable} ${bricolage.variable} ${jakarta.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="h-full bg-surface-base text-ink-900 font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
