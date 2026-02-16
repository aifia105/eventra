import { auth } from "@/lib/config/auth";
import { redirect } from "next/navigation";
import { getOrgEvents } from "@/lib/actions/event";
import OrgDashboardClient from "@/components/dashboard/OrgDashboardClient";

export default async function OrgDashboard() {
  const session = await auth();
  if (!session || session.user.role !== "org") redirect("/dashboard");

  const events = await getOrgEvents();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Track your event performance and sales
          </p>
        </div>
      </div>

      <OrgDashboardClient events={events} />
    </div>
  );
}
