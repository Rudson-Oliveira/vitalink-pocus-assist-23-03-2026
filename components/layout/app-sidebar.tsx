"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAME } from "@/lib/constants";
import { LayoutDashboard, FolderPlus, History, Activity } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/casos/novo", label: "Novo Caso", icon: FolderPlus },
  { href: "/casos/historico", label: "Historico", icon: History },
];

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col border-r bg-card">
      <div className="p-6 border-b">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">{APP_NAME}</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                active ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
