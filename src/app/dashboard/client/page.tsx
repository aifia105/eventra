import { auth } from "@/lib/config/auth";
import { redirect } from "next/navigation";
import { Calendar, Ticket, Search } from "lucide-react";
import Link from "next/link";

export default async function ClientDashboard() {
  const session = await auth();
  if (!session || session.user.role !== "client") redirect("/dashboard");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {session.user.name}!</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Link
          href="/dashboard/client/events"
          className="group flex items-center gap-4 rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500 text-white">
            <Search className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Browse Events</p>
            <p className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
              Find & Book Seats
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-4 rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500 text-white">
            <Ticket className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">My Reservations</p>
            <p className="text-lg font-bold text-gray-900">Coming soon</p>
          </div>
        </div>
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
