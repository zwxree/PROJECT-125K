"use client";
import { useEffect } from "react";
import { usePatchStore } from "@/store/usePatchStore";

export default function SyncSimulator() {
  const { syncTick, generateInsight } = usePatchStore();

  useEffect(() => {
    // Generate the initial AI insight based on time/data
    generateInsight();

    // The heartbeat of the app - ticks every 5000ms (5 seconds)
    const interval = setInterval(() => {
      syncTick();
    }, 5000);

    return () => clearInterval(interval);
  }, [syncTick, generateInsight]);

  return null; // Invisible component, just runs the logic
}
