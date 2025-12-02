import React from "react";

export function calculateDispatchTimes(
  dispatchStrategy,
  interval,
  startTime,
  endTime,
  payloads
) {
  const now = new Date().getTime();
  if (dispatchStrategy === "immediate") {
    return payloads.map(() => now);
  }
  if (dispatchStrategy === "interval") {
    return payloads.map((_, i) => now + i * interval);
  }
  if (dispatchStrategy === "random") {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    if (isNaN(start) || isNaN(end) || start >= end) return null; // Invalid range
    return payloads.map(() =>
      Math.floor(Math.random() * (end - start + 1) + start)
    );
  }
  return null;
}
