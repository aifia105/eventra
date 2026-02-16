"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { signOut } from "next-auth/react";
import { clientLinks, orgLinks } from "@/lib/constant";
import { LogOut } from "lucide-react";

interface SidebarProps {
  role: "client" | "org";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const links = role === "org" ? orgLinks : clientLinks;

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 h-screen shadow-lg sticky top-0 bg-accent/10">
      <div className="px-6 py-8 flex items-center justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 font-bold text-2xl text-primary relative group"
        >
          <div className="absolute -inset-2 bg-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative">Eventra</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative flex items-center gap-4 px-4 py-3.5 text-[15px] font-medium rounded-2xl transition-all duration-300 group overflow-hidden",
                isActive ? "text-primary" : "text-gray-500 hover:text-gray-900",
              )}
            >
              <div
                className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full transition-all duration-300",
                  isActive ? "opacity-100" : "opacity-0",
                )}
              />

              <div
                className={cn(
                  "absolute inset-0 transition-all duration-300 rounded-2xl",
                  isActive
                    ? "bg-primary/8"
                    : "bg-transparent group-hover:bg-gray-50",
                )}
              />

              <div
                className={cn(
                  "relative z-10 flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700",
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
              </div>

              <span className="relative z-10">{link.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 mt-auto">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 p-0.5">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="relative flex w-full items-center gap-4 px-4 py-3.5 text-[15px] font-medium text-gray-600 bg-white rounded-2xl transition-all duration-300 hover:text-red-600 group"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 text-gray-500 transition-all duration-300 group-hover:bg-red-50 group-hover:text-red-600">
              <LogOut className="h-[18px] w-[18px]" />
            </div>
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
