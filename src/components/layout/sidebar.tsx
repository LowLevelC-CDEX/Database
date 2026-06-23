"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, ChevronLeft, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { NAV_SECTIONS } from "@/config/navigation";
import { can, type Permission } from "@/lib/rbac";
import type { Role } from "@prisma/client";

export function Sidebar({
  role,
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: {
  role: Role;
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    const base = href.split("?")[0];
    if (base === "/dashboard") return pathname === "/dashboard";
    return pathname === base || pathname.startsWith(base + "/");
  };

  const visibleSections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) => !item.permission || can(role, item.permission as Permission),
    ),
  })).filter((s) => s.items.length > 0);

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/70 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-hairline/60 bg-charcoal/95 backdrop-blur transition-[width,transform] duration-300 lg:static lg:translate-x-0",
          collapsed ? "w-[68px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Primary navigation"
      >
        {/* Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-hairline/50 px-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-accent/30 bg-accent/10 text-accent">
            <ShieldCheck className="size-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate font-mono text-xs font-bold tracking-[0.15em] text-foreground">
                SITE-80
              </p>
              <p className="truncate text-[0.6rem] uppercase tracking-widest text-accent/80">
                &quot;JACOBY&quot;
              </p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {visibleSections.map((section) => (
            <div key={section.heading}>
              {!collapsed && (
                <p className="px-2 pb-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted/70">
                  {section.heading}
                </p>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onMobileClose}
                        title={collapsed ? item.label : undefined}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors",
                          active
                            ? "bg-accent/10 text-accent"
                            : "text-muted hover:bg-panel-2 hover:text-foreground",
                          collapsed && "justify-center",
                        )}
                      >
                        {active && (
                          <motion.span
                            layoutId="nav-active"
                            className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent"
                          />
                        )}
                        <Icon className="size-[18px] shrink-0" />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="border-t border-hairline/50 p-3">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Logout"
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm text-muted transition-colors hover:bg-alert/10 hover:text-alert",
              collapsed && "justify-center",
            )}
          >
            <LogOut className="size-[18px] shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
          <button
            onClick={onToggle}
            className={cn(
              "mt-1 hidden w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm text-muted transition-colors hover:bg-panel-2 hover:text-foreground lg:flex",
              collapsed && "justify-center",
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className={cn("size-[18px] shrink-0 transition-transform", collapsed && "rotate-180")} />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
