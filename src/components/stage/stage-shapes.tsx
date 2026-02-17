import { StageShape } from "@/lib/types";

export const STAGE_SHAPES: {
  id: StageShape;
  label: string;
  description: string;
  icon: React.ReactNode;
  svgPath: string;
}[] = [
  {
    id: "rectangle",
    label: "Rectangle",
    description: "Classic proscenium stage",
    icon: (
      <svg viewBox="0 0 40 24" className="w-8 h-5">
        <rect x="2" y="2" width="36" height="20" rx="2" fill="currentColor" />
      </svg>
    ),
    svgPath: "M0,0 L200,0 L200,60 L0,60 Z",
  },
  {
    id: "thrust",
    label: "Thrust",
    description: "Extends into the audience",
    icon: (
      <svg viewBox="0 0 40 32" className="w-8 h-6">
        <path d="M2,2 L38,2 L38,20 L22,30 L18,30 L2,20 Z" fill="currentColor" />
      </svg>
    ),
    svgPath: "M0,0 L200,0 L200,50 L115,80 L85,80 L0,50 Z",
  },
  {
    id: "semicircle",
    label: "Semicircle",
    description: "Rounded front edge",
    icon: (
      <svg viewBox="0 0 40 28" className="w-8 h-6">
        <path d="M2,2 L38,2 L38,14 Q20,28 2,14 Z" fill="currentColor" />
      </svg>
    ),
    svgPath: "M0,0 L200,0 L200,40 Q100,80 0,40 Z",
  },
  {
    id: "diamond",
    label: "Diamond",
    description: "Rotated square stage",
    icon: (
      <svg viewBox="0 0 40 32" className="w-8 h-6">
        <path d="M20,2 L38,16 L20,30 L2,16 Z" fill="currentColor" />
      </svg>
    ),
    svgPath: "M100,0 L200,40 L100,80 L0,40 Z",
  },
  {
    id: "amphitheater",
    label: "Amphitheater",
    description: "Wide curved stage",
    icon: (
      <svg viewBox="0 0 40 28" className="w-8 h-6">
        <path d="M2,14 Q20,2 38,14 L36,22 Q20,10 4,22 Z" fill="currentColor" />
      </svg>
    ),
    svgPath: "M0,40 Q100,0 200,40 L195,55 Q100,15 5,55 Z",
  },
];
