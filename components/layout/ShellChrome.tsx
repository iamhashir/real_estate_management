"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar, type QuickAddTarget } from "./TopBar";
import { BottomTabBar } from "./BottomTabBar";
import { BackgroundDecor } from "./BackgroundDecor";
import { ClientFormDrawer } from "@/components/forms/ClientFormDrawer";
import { PropertyFormDrawer } from "@/components/forms/PropertyFormDrawer";
import { DealFormDrawer } from "@/components/forms/DealFormDrawer";

/**
 * The persistent app chrome. Renders the fixed sidebar + bottom bar, offsets
 * the content column for the sidebar, and owns the quick-add drawers so any
 * surface (top bar, bottom bar) can trigger creation.
 */
export function ShellChrome({ children }: { children: React.ReactNode }) {
  const [quickAdd, setQuickAdd] = useState<QuickAddTarget | null>(null);
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-dvh">
      <BackgroundDecor />
      <Sidebar />

      {/* Content column — offset for the fixed sidebar */}
      <div className="md:ml-16 lg:ml-60 flex flex-col min-h-dvh">
        <TopBar onQuickAdd={setQuickAdd} search={search} onSearchChange={setSearch} />
        <div className="flex-1 min-w-0 pb-16 md:pb-0">{children}</div>
      </div>

      <BottomTabBar onQuickAdd={setQuickAdd} />

      {/* Quick-add drawers */}
      <ClientFormDrawer isOpen={quickAdd === "client"} onClose={() => setQuickAdd(null)} />
      <PropertyFormDrawer isOpen={quickAdd === "property"} onClose={() => setQuickAdd(null)} />
      <DealFormDrawer isOpen={quickAdd === "deal"} onClose={() => setQuickAdd(null)} />
    </div>
  );
}
