"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { GlobalSearch } from "@/components/search/global-search";
import type { Role, Clearance } from "@prisma/client";

export function AppShell({
  user,
  children,
}: {
  user: { name?: string | null; username: string; role: Role; clearance: Clearance; image?: string | null };
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Persist collapse preference.
  useEffect(() => {
    const saved = localStorage.getItem("sidebar:collapsed");
    if (saved) setCollapsed(saved === "1");
  }, []);

  const toggleCollapse = () => {
    setCollapsed((c) => {
      localStorage.setItem("sidebar:collapsed", c ? "0" : "1");
      return !c;
    });
  };

  // Global ⌘K / Ctrl+K shortcut.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="flex min-h-screen bg-ink">
      <Sidebar
        role={user.role}
        collapsed={collapsed}
        onToggle={toggleCollapse}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          user={user}
          onMenuClick={() => setMobileOpen(true)}
          onSearchClick={() => setSearchOpen(true)}
        />
        <main id="main-content" className="hairline-grid flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8 lg:py-8">{children}</div>
        </main>
      </div>
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
