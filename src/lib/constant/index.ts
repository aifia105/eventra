import {
  LayoutDashboard,
  Calendar,
  Settings,
  LogOut,
  Users,
  PlusCircle,
  BarChart,
  User,
  Layers,
} from "lucide-react";

export const clientLinks = [
  { name: "Dashboard", href: "/dashboard/client", icon: LayoutDashboard },
  { name: "My Events", href: "/dashboard/client/events", icon: Calendar },
  { name: "Profile", href: "/dashboard/client/profile", icon: User },
  { name: "Settings", href: "/dashboard/client/settings", icon: Settings },
];

export const orgLinks = [
  { name: "Dashboard", href: "/dashboard/org", icon: LayoutDashboard },
  { name: "Manage Events", href: "/dashboard/org/events", icon: Calendar },
  { name: "Stage Management", href: "/dashboard/org/stages", icon: Layers },
  { name: "Analytics", href: "/dashboard/org/analytics", icon: BarChart },
  { name: "Settings", href: "/dashboard/org/settings", icon: Settings },
];

