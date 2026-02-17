import { SHAPE_LABELS, SHAPE_PATHS } from "@/lib/constant";
import React from "react";

type StageShape =
  | "rectangle"
  | "thrust"
  | "semicircle"
  | "diamond"
  | "amphitheater";
const StageShapeComponent = ({ shape }: { shape: StageShape }) => {
  return (
    <div className="flex justify-center mb-8">
      <svg viewBox="0 0 200 90" className="w-64 h-28 drop-shadow-lg">
        <defs>
          <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>
        <path d={SHAPE_PATHS[shape]} fill="url(#sg)" />
        <text
          x="100"
          y="38"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="13"
          fontWeight="700"
          fontFamily="sans-serif"
          letterSpacing="3"
        >
          STAGE
        </text>
        <text
          x="100"
          y="55"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(255,255,255,0.4)"
          fontSize="8"
          fontFamily="sans-serif"
          letterSpacing="1"
        >
          {SHAPE_LABELS[shape]}
        </text>
      </svg>
    </div>
  );
};

export default StageShapeComponent;
