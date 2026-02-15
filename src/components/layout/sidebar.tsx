"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Calendar,
    Settings,
    LogOut,
    Users,
    PlusCircle,
    BarChart,
    User,
} from "lucide-react";
import { signOut } from "next-auth/react";

interface SidebarProps {
    role: "client" | "org";
}

export function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();

    const clientLinks = [
        { name: "Dashboard", href: "/dashboard/client", icon: LayoutDashboard },
        { name: "My Events", href: "/dashboard/client/events", icon: Calendar },
        { name: "Profile", href: "/dashboard/client/profile", icon: User },
        { name: "Settings", href: "/dashboard/client/settings", icon: Settings },
    ];

    const orgLinks = [
        { name: "Dashboard", href: "/dashboard/org", icon: LayoutDashboard },
        { name: "Manage Events", href: "/dashboard/org/events", icon: Calendar },
        { name: "Create Event", href: "/dashboard/org/events/new", icon: PlusCircle },
        { name: "Analytics", href: "/dashboard/org/analytics", icon: BarChart },
        { name: "Settings", href: "/dashboard/org/settings", icon: Settings },
    ];

    const links = role === "org" ? orgLinks : clientLinks;

    return (
        <div className="hidden border-r bg-white lg:flex lg:flex-col lg:w-72 h-screen sticky top-0">
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-primary">
                    Eventra
                </Link>
            </div>
            <div className="flex-1 overflow-y-auto py-6 px-4">
                <nav className="grid items-start gap-2">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:text-primary",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-gray-500 hover:bg-gray-100"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="border-t p-4">
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 transition-all hover:text-red-600 hover:bg-red-50"
                >
                    <LogOut className="h-5 w-5" />
                    Log out
                </button>
            </div>
        </div>
    );
}
