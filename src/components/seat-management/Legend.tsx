import React from "react";

const Legend = () => {
  return (
    <div className="flex items-center gap-5 text-xs text-gray-500">
      {[
        { color: "bg-emerald-100 border-emerald-300", label: "Available" },
        { color: "bg-amber-100 border-amber-300", label: "Locked" },
        { color: "bg-red-100 border-red-300", label: "Reserved" },
      ].map(({ color, label }) => (
        <div key={label} className="flex items-center gap-1.5">
          <div className={`w-4 h-4 rounded border ${color}`} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
};

export default Legend;
