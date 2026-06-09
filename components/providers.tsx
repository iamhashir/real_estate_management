"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ToastProvider } from "@/components/ui/Toast";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function Providers({ children }: { children: React.ReactNode }) {
  const tree = <ToastProvider>{children}</ToastProvider>;
  if (!convex) return tree;
  return <ConvexProvider client={convex}>{tree}</ConvexProvider>;
}
