"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { TopBar, type QuickAddTarget } from "./TopBar";
import { BottomTabBar } from "./BottomTabBar";
import { BackgroundDecor } from "./BackgroundDecor";
import { ClientFormDrawer } from "@/components/forms/ClientFormDrawer";
import { PropertyFormDrawer } from "@/components/forms/PropertyFormDrawer";
import { DealFormDrawer } from "@/components/forms/DealFormDrawer";
import { PageTransitionWrapper } from "./PageTransitionWrapper";
import { OfflineBanner } from "./OfflineBanner";
import { CommandPalette } from "./CommandPalette";

/**
 * The persistent app chrome. Renders the fixed sidebar + bottom bar, offsets
 * the content column for the sidebar, and owns the quick-add drawers so any
 * surface (top bar, bottom bar) can trigger creation.
 */
export function ShellChrome({ children }: { children: React.ReactNode }) {
  const [quickAdd, setQuickAdd] = useState<QuickAddTarget | null>(null);
  const [search, setSearch] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <div className="min-h-dvh">
      <OfflineBanner />
      <BackgroundDecor />
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />

      {/* Content column — offset matches sidebar width, transitions with it */}
      <div
        className={cn(
          "flex flex-col min-h-dvh",
          sidebarCollapsed ? "md:ml-16" : "md:ml-16 lg:ml-60",
        )}
        style={{ transition: "margin-left 0.3s cubic-bezier(0.22, 1, 0.36, 1)" }}
      >
        <TopBar
          onQuickAdd={setQuickAdd}
          search={search}
          onSearchChange={setSearch}
          onOpenPalette={() => setPaletteOpen(true)}
        />
        <div className="flex-1 min-w-0 pb-16 md:pb-0">
          <PageTransitionWrapper>{children}</PageTransitionWrapper>
        </div>
      </div>

      <BottomTabBar onQuickAdd={setQuickAdd} />

      {/* Global Cmd+K command palette */}
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onQuickAdd={setQuickAdd}
      />

      {/* Quick-add drawers */}
      <ClientFormDrawer isOpen={quickAdd === "client"} onClose={() => setQuickAdd(null)} />
      <PropertyFormDrawer isOpen={quickAdd === "property"} onClose={() => setQuickAdd(null)} />
      <DealFormDrawer isOpen={quickAdd === "deal"} onClose={() => setQuickAdd(null)} />
    </div>
  );
}
