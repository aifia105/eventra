"use client";

import StageSetupContent from "@/components/stage/StageSetupContent";
import { StageSetupPageProps } from "@/lib/types";

import React, { useState, useEffect } from "react";

const StageSetupPage = ({ params }: StageSetupPageProps) => {
  const [eventId, setEventId] = useState<string | null>(null);

  useEffect(() => {
    Promise.resolve(params).then((p: any) => {
      if (p && typeof p === "object" && "id" in p) {
        setEventId(p.id);
      }
    });
  }, [params]);

  if (!eventId) return null;

  return <StageSetupContent eventId={eventId} />;
};

export default StageSetupPage;
