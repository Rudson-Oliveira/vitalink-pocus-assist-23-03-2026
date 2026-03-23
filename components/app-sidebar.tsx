"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FilePlus2,
  History,
  DatabaseBackup,
  Stethoscope,
} from "lucide-react";

const links = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/novo-caso",
    label: "Novo Caso",
    icon: FilePlus2,
  },
  {
    href: "/historico",
    label: "Histórico",
    icon: History,
  },
  {
    href: "/backup",
    label: "Backup",
    icon: DatabaseBackup,
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-slate-800 bg-slate-950/95 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col">
        <div className="border-b border-slate-800 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-blue-600 p-3 text-slate-950 shadow-lg shadow-blue-950/30">
              <Stethoscope className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-sm font-bold uppercase tracking-[0.25em] text-amber-300">
                Vitalink
              </h1>
              <p className="text-sm text-slate-300">POCUS Assist</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-2 px-3 py-4">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  active
                    ? "bg-gradient-to-r from-amber-500/15 to-blue-500/15 text-amber-200 ring-1 ring-amber-400/30"
                    : "text-slate-300 hover:bg-slate-900 hover:text-slate-100"
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-amber-300" : "text-blue-300")} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 px-5 py-4">
          <p className="text-xs leading-5 text-slate-400">
            Navegação principal do MVP com acesso rápido ao dashboard, cadastro,
            histórico e backup/restauração.
          </p>
        </div>
      </div>
    </aside>
  );
}
