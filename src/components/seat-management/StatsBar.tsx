import { Seat } from "@/lib/types";
import { Clock, Ticket, Users } from "lucide-react";
import React from "react";

const StatsBar = ({ seats }: { seats: Seat[] }) => {
  const total = seats.length;
  const reserved = seats.filter((s) => s.status === "reserved").length;
  const locked = seats.filter((s) => s.status === "locked").length;
  const available = seats.filter((s) => s.status === "available").length;
  const revenue = seats
    .filter((s) => s.status === "reserved")
    .reduce((sum, s) => sum + s.price, 0);

  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {[
        {
          label: "Reserved",
          value: reserved,
          sub: `${pct(reserved)}% of total`,
          color: "text-red-600",
          bg: "bg-red-50",
          border: "border-red-100",
          icon: <Ticket className="h-4 w-4 text-red-400" />,
        },
        {
          label: "Locked",
          value: locked,
          sub: `${pct(locked)}% of total`,
          color: "text-amber-600",
          bg: "bg-amber-50",
          border: "border-amber-100",
          icon: <Clock className="h-4 w-4 text-amber-400" />,
        },
        {
          label: "Available",
          value: available,
          sub: `${pct(available)}% of total`,
          color: "text-emerald-600",
          bg: "bg-emerald-50",
          border: "border-emerald-100",
          icon: <Users className="h-4 w-4 text-emerald-400" />,
        },
        {
          label: "Revenue",
          value: `$${revenue.toLocaleString()}`,
          sub: `from ${reserved} reservations`,
          color: "text-blue-600",
          bg: "bg-blue-50",
          border: "border-blue-100",
          icon: <Ticket className="h-4 w-4 text-blue-400" />,
        },
      ].map(({ label, value, sub, color, bg, border, icon }) => (
        <div
          key={label}
          className={`rounded-xl border ${border} ${bg} p-4 flex items-start gap-3`}
        >
          <div className="mt-0.5">{icon}</div>
          <div>
            <p className="text-xs font-medium text-gray-500">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
