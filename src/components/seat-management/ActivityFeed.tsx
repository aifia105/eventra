import { ActivityItem } from "@/lib/types";
import { Radio } from "lucide-react";
import React from "react";

const ActivityFeed = ({ activities }: { activities: ActivityItem[] }) => {
  const dotColor = {
    reserved: "bg-red-400",
    locked: "bg-amber-400",
    released: "bg-emerald-400",
  };

  return (
    <div className="rounded-2xl bg-white shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Radio className="h-4 w-4 text-primary animate-pulse" />
        <h3 className="text-sm font-semibold text-gray-900">Live Activity</h3>
      </div>
      {activities.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-6">
          No activity yet. Waiting for seat events...
        </p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {activities.map((a) => (
            <div key={a.id} className="flex items-start gap-2.5">
              <div
                className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${dotColor[a.type]}`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-700 leading-snug">
                  {a.message}
                </p>
                <p className="text-[10px] text-gray-400">
                  {a.time.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
