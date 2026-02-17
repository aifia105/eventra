export type StageShape =
  | "rectangle"
  | "thrust"
  | "semicircle"
  | "diamond"
  | "amphitheater";

export interface StageSetupPageProps {
  params: Promise<{ id: string }>;
}

export interface Seat {
  _id: string;
  row: string;
  number: number;
  price: number;
  status: "available" | "locked" | "reserved";
  stageShape?: StageShape;
  reservedBy?: string;
  reservedAt?: string;
  lockedBy?: string;
}

export interface Event {
  _id: string;
  name: string;
  date: string;
  venue?: string;
}

export interface ActivityItem {
  id: string;
  message: string;
  time: Date;
  type: "reserved" | "locked" | "released";
}
