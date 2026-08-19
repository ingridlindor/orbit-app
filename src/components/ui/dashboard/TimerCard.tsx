"use client";

import { useState } from "react";

interface TimerCardProps {
  client: string;
  task: string;
  elapsedTime: string; // formato "HH:MM:SS"
  progress: number; // 0 a 100 (% do anel preenchido)
  onPause?: () => void;
  onStop?: () => void;
}

export function TimerCard({
  client,
  task,
  elapsedTime,
  progress,
  onPause,
  onStop,
}: TimerCardProps) {
  const [isPaused, setIsPaused] = useState(false);

  const handlePause = () => {
    setIsPaused(!isPaused);
    onPause?.();
  };

  return (
    <div className="w-full max-w-sm bg-gradient-to-b from-[#12162E] to-[#0E1226] border border-white/[0.06] rounded-2xl p-5 relative overflow-hidden">

      <div/>

      <div className="flex items-center justify-between mb-4 relative">
        <div className="flex items-center gap-1.5 text-signal-amber text-[11px] font-semibold tracking-wide">
          <span className="size-1.5 rounded-full bg-signal-amber" />
          TRACKING NOW
        </div>
        <span className="text-[11px] text-white/40">{client}</span>
      </div>

      <div className="flex justify-center mb-4 relative">
        <div
          className="size-[190px] rounded-full flex items-center justify-center"
          style={{
            background: `conic-gradient(#F5A623 ${progress * 3.6}deg, rgba(255,255,255,0.06) ${progress * 3.6}deg 360deg)`,
          }}
        >
          <div className="size-[150px] rounded-full bg-[#0E1226] flex flex-col items-center justify-center">
            <span className="font-mono text-2xl font-bold text-white">
              {elapsedTime}
            </span>
            <span className="text-[11px] text-white/50 mt-1 text-center px-4">
              {task}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2.5 relative">
        <button
          onClick={handlePause}
          className="flex-1 rounded-lg py-2.5 text-sm font-semibold bg-white/[0.06] text-white border border-white/10 hover:bg-white/10 transition-colors"
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
        <button
          onClick={onStop}
          className="flex-1 rounded-lg py-2.5 text-sm font-semibold bg-signal-amber text-deep-space hover:bg-signal-amber/90 transition-colors"
        >
          Stop & log
        </button>
      </div>
    </div>
  );
}