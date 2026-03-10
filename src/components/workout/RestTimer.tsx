"use client";

import { useSyncExternalStore } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { X, Plus, Minus, Timer } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function RestTimer() {
  const { restTimer, stopRestTimer, addTime } = useAppStore();
  const timeLeft = useSyncExternalStore(
    (onStoreChange) => {
      const endTime = restTimer.endTime;
      if (!endTime) return () => {};
      const interval = setInterval(() => {
        const now = Date.now();
        const diff = Math.ceil((endTime - now) / 1000);
        if (diff <= 0) {
          stopRestTimer();
        }
        onStoreChange();
      }, 100);
      return () => clearInterval(interval);
    },
    () => {
      const endTime = restTimer.endTime;
      if (!endTime) return 0;
      const now = Date.now();
      return Math.max(0, Math.ceil((endTime - now) / 1000));
    },
    () => 0
  );

  const progress = restTimer.endTime
    ? Math.min(100, Math.max(0, ((restTimer.duration - timeLeft) / restTimer.duration) * 100))
    : 0;

  if (!restTimer.endTime) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 animate-in slide-in-from-bottom-10 fade-in">
      <div className="bg-background border rounded-lg shadow-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold">
            <Timer className="h-5 w-5 animate-pulse" />
            <span>Descanso: {formatTime(timeLeft)}</span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={stopRestTimer}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <Progress value={progress} className="h-2" />

        <div className="flex gap-2 justify-center">
          <Button variant="outline" size="sm" onClick={() => addTime(-30)} disabled={timeLeft <= 30}>
            <Minus className="h-3 w-3 mr-1" /> 30s
          </Button>
          <Button variant="outline" size="sm" onClick={() => addTime(30)}>
            <Plus className="h-3 w-3 mr-1" /> 30s
          </Button>
          <Button className="flex-1" size="sm" onClick={stopRestTimer}>
            Pular Descanso
          </Button>
        </div>
      </div>
    </div>
  );
}
