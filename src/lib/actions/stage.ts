import { StageShape } from "../types";

export const fetchSeats = async (eventId: string) => {
  const res = await fetch(`/api/event/${eventId}/seats`);
  if (!res.ok) throw new Error("Failed to fetch seats");
  return res.json();
};

export const createSeats = async (
  eventId: string,
  data: {
    rows: number;
    seatsPerRow: number;
    price: number;
    stageShape: StageShape;
  },
) => {
  const res = await fetch(`/api/event/${eventId}/seats`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create seats");
  }
  return res.json();
};

export const saveStageShape = async (
  eventId: string,
  stageShape: StageShape,
) => {
  const res = await fetch(`/api/event/${eventId}/stage-shape`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stageShape }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to save stage shape");
  }
  return res.json();
};

export const getSeatsForRow = (
  rowIndex: number,
  totalRows: number,
  baseSeatsPerRow: number,
  shape: StageShape,
): number => {
  const ratio = rowIndex / Math.max(totalRows - 1, 1);
  switch (shape) {
    case "rectangle":
      return baseSeatsPerRow;
    case "thrust":
      return Math.max(2, Math.round(baseSeatsPerRow * (0.4 + 0.6 * ratio)));
    case "semicircle":
      return Math.max(2, Math.round(baseSeatsPerRow * (0.5 + 0.5 * ratio)));
    case "diamond":
      const midRatio = 1 - Math.abs(ratio - 0.5) * 2;
      return Math.max(2, Math.round(baseSeatsPerRow * (0.3 + 0.7 * midRatio)));
    case "amphitheater":
      return Math.max(
        2,
        Math.round(baseSeatsPerRow * (0.5 + 0.5 * (1 - ratio))),
      );
    default:
      return baseSeatsPerRow;
  }
};

export const fetchEvents = async (): Promise<Event[]> => {
  const res = await fetch("/api/org/events");
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
};
