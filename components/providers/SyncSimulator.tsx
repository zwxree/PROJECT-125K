"use client";
import { useEffect } from "react";
import { usePatchStore } from "@/store/usePatchStore";

export default function SyncSimulator() {
  const { syncTick, generateInsight } = usePatchStore();

  useEffect(() => {
    // Generate the initial AI insight based on time/data
    generateInsight();

    let lastTime = performance.now();
    let frameId: number;

    const tick = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      // Only sync if the tab is active to save resources
      if (document.visibilityState === 'visible') {
        syncTick(deltaTime);
      }
      
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    // AI Insight heartbeat - every 10 seconds
    const insightInterval = setInterval(() => {
      generateInsight();
    }, 10000);

    return () => {
      cancelAnimationFrame(frameId);
      clearInterval(insightInterval);
    };
  }, [syncTick, generateInsight]);

  return null; // Invisible component, just runs the logic
}
