"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, FilePlus, Truck, Menu, X, Users } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/cases", label: "案件一覧", icon: FileText },
  { href: "/cases/new", label: "新規案件", icon: FilePlus },
];

const adminItems = [
  { href: "/admin/users", label: "ユーザー管理", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-[6px] bg-white shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px,rgba(0,0,0,0.04)_0px_2px_2px]"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5 text-[#171717]" /> : <Menu className="h-5 w-5 text-[#171717]" />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/20"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 bg-white shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px] transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-2.5 px-6 py-5 shadow-[inset_0_-1px_0_rgba(0,0,0,0.08)]">
          <Truck className="h-5 w-5 text-[#171717]" />
          <span className="font-semibold text-[15px] tracking-[-0.32px] text-[#171717]">スター引越</span>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#fafafa] text-[#171717] shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px]"
                    : "text-[#666666] hover:bg-[#fafafa] hover:text-[#171717]"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}

          {isAdmin && (
            <>
              <div className="pt-4 pb-1">
                <p className="px-3 text-[11px] font-medium text-[#808080] uppercase tracking-wide font-mono">管理</p>
              </div>
              {adminItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-sm font-medium transition-colors",
                      isActive
                        ? "bg-[#fafafa] text-[#171717] shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px]"
                        : "text-[#666666] hover:bg-[#fafafa] hover:text-[#171717]"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
