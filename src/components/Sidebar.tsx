"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  GitBranch,
  FileText,
  Package,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useAuth } from "./AuthProvider";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/funil", label: "Funil", icon: GitBranch },
  { href: "/orcamentos", label: "Orçamentos", icon: FileText },
  { href: "/produtos", label: "Produtos", icon: Package },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, signOut, cloudMode } = useAuth();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-3 left-3 z-50 p-2 bg-primary-dark text-white rounded-lg md:hidden"
      >
        <Menu size={22} />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setOpen(false)} />
      )}

      <aside className={`fixed left-0 top-0 h-full w-64 bg-primary-dark flex flex-col z-50 transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h1 className="text-white text-lg font-bold tracking-tight">VIBRANIHIL</h1>
            <p className="text-blue-300 text-xs mt-0.5">CRM de Prospecção</p>
          </div>
          <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white md:hidden">
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`sidebar-link ${active ? "active" : ""}`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-blue-300 text-xs truncate">{cloudMode && user ? user.email : "Isabela - Vendas"}</p>
          {cloudMode && user && (
            <button onClick={() => signOut()} className="flex items-center gap-1 text-xs text-red-300 hover:text-red-200 mt-2">
              <LogOut size={14} /> Sair
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
