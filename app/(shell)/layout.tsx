import type { Metadata } from "next";
import { ShellChrome } from "@/components/layout/ShellChrome";

export const metadata: Metadata = {
  title: {
    default: "Real Estate Management",
    template: "%s · Real Estate",
  },
};

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return <ShellChrome>{children}</ShellChrome>;
}
