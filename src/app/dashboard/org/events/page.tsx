import { auth } from "@/lib/config/auth";
import { getOrgEvents } from "@/lib/actions/event";
import {
  Plus,
  Calendar,
  MapPin,
  Users,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import EventCard from "@/components/events/EventCard";

export default async function ManageEventsPage() {
  const session = await auth();

  if (!session || session.user.role !== "org") {
    redirect("/dashboard");
  }

  const events = await getOrgEvents();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-500 mt-1">
            Manage and monitor all your events
          </p>
        </div>
        <Link
          href="/dashboard/org/events/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-all duration-200 hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Create Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="rounded-full bg-gray-100 p-6 mb-4">
            <Calendar className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No events yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm">
            Get started by creating your first event and start selling tickets
          </p>
          {/* <Link
            href="/dashboard/org/events/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-all"
          >
            <Plus className="h-4 w-4" />
            Create Your First Event
          </Link> */}
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
