"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Menu, Search, Bell, ChevronDown, CircleUser, Settings2, LogOut, ShieldCheck } from "lucide-react";
import { Avatar } from "@/components/ui/misc";
import { RoleBadge, ClearanceBadge } from "@/components/shared/clearance-badge";
import type { Role, Clearance } from "@prisma/client";

export function Topbar({
  user,
  onMenuClick,
  onSearchClick,
}: {
  user: { name?: string | null; username: string; role: Role; clearance: Clearance; image?: string | null };
  onMenuClick: () => void;
  onSearchClick: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-hairline/60 bg-charcoal/80 px-4 backdrop-blur">
      <button
        onClick={onMenuClick}
        className="rounded-md p-2 text-muted hover:bg-panel-2 hover:text-foreground lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="size-5" />
      </button>

      {/* Search trigger */}
      <button
        onClick={onSearchClick}
        className="group flex h-9 flex-1 items-center gap-2 rounded-md border border-hairline/60 bg-ink/50 px-3 text-sm text-muted transition-colors hover:border-accent/40 lg:max-w-md"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Search the database…</span>
        <kbd className="hidden rounded border border-hairline/60 bg-panel-2 px-1.5 py-0.5 font-mono text-[0.6rem] text-muted sm:inline">
          ⌘K
        </kbd>
      </button>

      <div className="flex-1 lg:hidden" />

      {/* Security level indicator */}
      <div className="hidden items-center gap-2 rounded-md border border-hairline/50 bg-panel/60 px-3 py-1.5 md:flex">
        <span className="size-2 animate-pulse-soft rounded-full bg-success" />
        <span className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">
          Status: <span className="text-success">GREEN</span>
        </span>
      </div>

      <button
        className="relative rounded-md p-2 text-muted hover:bg-panel-2 hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell className="size-5" />
        <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-accent ring-2 ring-charcoal" />
      </button>

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-2 rounded-md border border-hairline/50 bg-panel/60 py-1 pl-1 pr-2 transition-colors hover:border-accent/40"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          <Avatar name={user.name ?? user.username} src={user.image} className="size-8" />
          <div className="hidden text-left sm:block">
            <p className="max-w-[120px] truncate text-xs font-medium text-foreground">
              {user.name ?? user.username}
            </p>
            <p className="text-[0.6rem] uppercase tracking-wide text-muted">@{user.username}</p>
          </div>
          <ChevronDown className="size-4 text-muted" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} aria-hidden />
            <div
              role="menu"
              className="glass absolute right-0 top-full z-20 mt-2 w-60 rounded-lg p-2 shadow-glass"
            >
              <div className="mb-2 flex items-center gap-3 rounded-md bg-panel-2/60 p-3">
                <Avatar name={user.name ?? user.username} src={user.image} className="size-10" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{user.name ?? user.username}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <RoleBadge role={user.role} />
                  </div>
                </div>
              </div>
              <div className="mb-2 flex items-center justify-between rounded-md border border-hairline/50 px-3 py-2">
                <span className="flex items-center gap-1.5 text-[0.66rem] uppercase tracking-wide text-muted">
                  <ShieldCheck className="size-3.5" /> Clearance
                </span>
                <ClearanceBadge clearance={user.clearance} />
              </div>
              <nav className="space-y-0.5">
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted hover:bg-panel-2 hover:text-foreground" role="menuitem">
                  <CircleUser className="size-4" /> Profile
                </Link>
                <Link href="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted hover:bg-panel-2 hover:text-foreground" role="menuitem">
                  <Settings2 className="size-4" /> Settings
                </Link>
                <button onClick={() => signOut({ callbackUrl: "/login" })} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted hover:bg-alert/10 hover:text-alert" role="menuitem">
                  <LogOut className="size-4" /> Logout
                </button>
              </nav>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
