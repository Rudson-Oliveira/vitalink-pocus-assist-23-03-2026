"use client";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { Activity, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
      <div className="flex h-14 items-center px-4 gap-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <Link href="/dashboard" className="flex items-center gap-2 md:hidden">
          <Activity className="h-5 w-5 text-primary" />
          <span className="font-bold">{APP_NAME}</span>
        </Link>
      </div>
    </header>
  );
}
