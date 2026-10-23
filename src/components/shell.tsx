"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Dashboard" },
  { href: "/patients", label: "Patients" },
  { href: "/assessments", label: "Assessments" },
  { href: "/speech", label: "Speech capture" },
  { href: "/results", label: "Results" },
  { href: "/admin", label: "Admin" },
];

export function Shell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen flex-col md:flex-row overflow-hidden">
      <aside
        className="fixed inset-y-0 left-0 z-20 w-64 border-r border-border bg-muted-subtle transform -translate-x-full transition duration-300 md:static md:translate-x-0"
      >
        <nav className="flex h-full flex-col p-6 space-y-1">
          <div className="px-3 text-sm font-semibold tracking-wider text-muted uppercase">
            NeurAI
          </div>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                "text-muted hover:bg-primary-subtle hover:text-primary",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden md:inset-0">
        <header className="flex h-16 items-center justify-between gap-6 border-b border-border bg-background px-6">
          <div className="text-sm font-semibold text-foreground">NeurAI</div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">Demo mode — synthetic data</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
