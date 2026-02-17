import { StageShape } from "@/lib/types";
import React from "react";
import { STAGE_SHAPES } from "./stage-shapes";

const ShapeSelector = ({
  value,
  onChange,
}: {
  value: StageShape;
  onChange: (s: StageShape) => void;
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
      {STAGE_SHAPES.map((shape) => (
        <button
          key={shape.id}
          onClick={() => onChange(shape.id)}
          className={`
            flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 text-center
            ${
              value === shape.id
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-gray-200 bg-white hover:border-primary/40 hover:bg-gray-50"
            }
          `}
        >
          <span
            className={`${value === shape.id ? "text-primary" : "text-gray-400"} transition-colors`}
          >
            {shape.icon}
          </span>
          <div className="flex flex-col items-center">
            <p
              className={`text-xs font-semibold ${value === shape.id ? "text-primary" : "text-gray-700"}`}
            >
              {shape.label}
            </p>
            <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
              {shape.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ShapeSelector;
