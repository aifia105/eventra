"use client";

import StageSetupContent from "@/components/stage/StageSetupContent";
import { StageSetupPageProps } from "@/lib/types";
import { useState, useEffect } from "react";

const StageSetupPage = ({ params }: StageSetupPageProps) => {
  const [eventId, setEventId] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      params.then((p) => setEventId(p.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, params]);

  if (!eventId) {
    return null;
  }

  return <StageSetupContent eventId={eventId} />;
};

export default StageSetupPage;
