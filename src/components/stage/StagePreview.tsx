import { StageShape } from "@/lib/types";
import React from "react";
import { STAGE_SHAPES } from "./stage-shapes";

const StagePreview = ({ shape }: { shape: StageShape }) => {
  const def = STAGE_SHAPES.find((s) => s.id === shape)!;
  return (
    <div className="flex justify-center mb-6">
      <div className="relative">
        <svg
          viewBox="0 0 200 90"
          className="w-56 h-24 drop-shadow-md"
          aria-label={`${def.label} stage shape`}
        >
          <defs>
            <linearGradient id="stageGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>
          <path
            d={def.svgPath}
            fill="url(#stageGrad)"
            stroke="#334155"
            strokeWidth="7"
          />
          <text
            x="100"
            y={shape === "amphitheater" ? 55 : 30}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#EB4C4C"
            fontSize="13"
            fontWeight="600"
            fontFamily="sans-serif"
            letterSpacing="2"
          >
            STAGE
          </text>
        </svg>
      </div>
    </div>
  );
};

export default StagePreview;
