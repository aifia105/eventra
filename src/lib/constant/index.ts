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
import { StageShape } from "../types";

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

export const SHAPE_PATHS: Record<StageShape, string> = {
  rectangle: "M0,0 L200,0 L200,60 L0,60 Z",
  thrust: "M0,0 L200,0 L200,50 L115,80 L85,80 L0,50 Z",
  semicircle: "M0,0 L200,0 L200,40 Q100,80 0,40 Z",
  diamond: "M100,0 L200,40 L100,80 L0,40 Z",
  amphitheater: "M0,40 Q100,0 200,40 L195,55 Q100,15 5,55 Z",
};

export const SHAPE_LABELS: Record<StageShape, string> = {
  rectangle: "Rectangle",
  thrust: "Thrust",
  semicircle: "Semicircle",
  diamond: "Diamond",
  amphitheater: "Amphitheater",
};
