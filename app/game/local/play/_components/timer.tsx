"use client";

import { type FC, useEffect, useState } from "react";
import { cn } from "@/lib/cls";

const TIMER_DURATION = 120; // 2 minutes in seconds

export const GameTimer: FC = () => {
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  const getTimerColor = () => {
    if (isExpired) return "text-destructive";
    if (timeLeft <= 30) return "text-destructive";
    if (timeLeft <= 60) return "text-warning";
    return "text-foreground";
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="text-center">
        <h2 className="mb-2 font-bold text-2xl">Discussion Time</h2>
        <p className="text-muted-foreground">
          {isExpired
            ? "Time's up! Make your final guesses."
            : "Discuss and figure out who the spy is"}
        </p>
      </div>

      <div
        className={cn(
          "flex h-64 w-64 items-center justify-center rounded-full border-4 shadow-lg transition-colors",
          getTimerColor(),
          {
            "animate-pulse border-destructive": isExpired,
            "border-destructive": timeLeft <= 30 && !isExpired,
            "border-warning": timeLeft > 30 && timeLeft <= 60,
            "border-border": timeLeft > 60,
          },
        )}>
        <div className="text-center">
          <div className={cn("font-bold text-6xl", getTimerColor())}>
            {formattedTime}
          </div>
          {isExpired && (
            <div className="mt-2 font-semibold text-xl">Time's Up!</div>
          )}
        </div>
      </div>
    </div>
  );
};
