"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-20 bg-white shadow-[inset_0_-1px_0_rgba(0,0,0,0.08)] px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="lg:hidden w-10" />
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-[#666666]">
            <User className="h-4 w-4" />
            <span className="font-medium text-[#171717]">{session?.user?.name}</span>
            {session?.user?.role === "ADMIN" && (
              <span className="bg-[#ebf5ff] text-[#0068d6] text-[11px] font-medium px-2 py-0.5 rounded-[9999px]">
                管理者
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="h-4 w-4 mr-1" />
            ログアウト
          </Button>
        </div>
      </div>
    </header>
  );
}
