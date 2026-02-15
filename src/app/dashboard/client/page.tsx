import { auth } from "@/lib/config/auth";
import { redirect } from "next/navigation";
import { Calendar, Ticket, Heart, Clock } from "lucide-react";

export default async function ClientDashboard() {
  const session = await auth();
  if (!session || session.user.role !== "client") redirect("/dashboard");

  const stats = [
    { label: "Upcoming Events", value: "3", icon: Calendar, color: "bg-blue-500" },
    { label: "Tickets Purchased", value: "12", icon: Ticket, color: "bg-purple-500" },
    { label: "Liked Events", value: "5", icon: Heart, color: "bg-pink-500" },
    { label: "Hours Spent", value: "24h", icon: Clock, color: "bg-orange-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {session.user.name}!</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg text-white ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-10 text-gray-500">
          No recent activity to show.
        </div>
      </div>
    </div>
  );
}
