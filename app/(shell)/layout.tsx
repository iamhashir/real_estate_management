import type { Metadata } from "next";

// Shell layout — owns the sidebar + top bar + bottom nav chrome.
// Components imported here will be built in components/layout/.
// Stubbed now so route group resolves; expand once layout components exist.

export const metadata: Metadata = {
  title: {
    default: "Real Estate Management",
    template: "%s · Real Estate",
  },
};

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // lg: offset for full sidebar (240px), md: offset for icon sidebar (64px)
    // These classes will be applied properly once Sidebar + PageShell are built.
    <div className="flex h-full min-h-screen bg-surface-base">
      {/* Sidebar placeholder — replace with <Sidebar /> once built */}
      <aside
        className="
          hidden md:flex flex-col
          md:w-16 lg:w-60
          bg-sea-950 shrink-0
          transition-all duration-300
        "
        aria-label="Main navigation"
      />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar placeholder — replace with <TopBar /> once built */}
        <header
          className="
            h-14 shrink-0
            bg-surface-card/80 backdrop-blur-md
            border-b border-hairline
            flex items-center px-4 md:px-6
          "
          aria-label="Top bar"
        />

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Bottom tab bar placeholder — replace with <BottomTabBar /> once built */}
      <nav
        className="
          fixed bottom-0 inset-x-0 md:hidden
          h-16 safe-bottom
          bg-surface-card border-t border-hairline
          flex items-center justify-around px-2
          z-50
        "
        aria-label="Mobile navigation"
      />
    </div>
  );
}
