import { auth } from "@/lib/config/auth";
import { redirect } from "next/navigation";
import { Calendar, Users, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function OrgDashboard() {
  const session = await auth();
  if (!session || session.user.role !== "org") redirect("/dashboard");

  const stats = [
    { label: "Active Events", value: "8", icon: Calendar, color: "bg-blue-600" },
    { label: "Total Attendees", value: "1,240", icon: Users, color: "bg-indigo-600" },
    { label: "Total Revenue", value: "$45,200", icon: DollarSign, color: "bg-green-600" },
    { label: "Growth", value: "+12.5%", icon: TrendingUp, color: "bg-emerald-600" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organization Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your events and analytics</p>
        </div>
        <Link
          href="/dashboard/org/events/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-light transition"
        >
          Create Event
        </Link>
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales</h2>
          <div className="text-center py-10 text-gray-500">
            No recent sales data available.
          </div>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h2>
          <div className="text-center py-10 text-gray-500">
            No upcoming events scheduled.
          </div>
        </div>
      </div>
    </div>
  );
}
