import React from "react";
// import { getRiskColor } from "../utils/riskDetailsUtils";

// Simple SVG Circular Progress Bar
const CircularProgress = ({ value, max, label, color, size = 80 }) => {
  const radius = size / 2 - 8;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(100, Math.round((value / max) * 100));
  const offset = circumference - (percent / 100) * circumference;
  return (
    <div className="flex flex-col items-center mx-2">
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#334155"
          strokeWidth="8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s" }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="0.3em"
          fontSize="1.1em"
          fill={color}
          fontWeight="bold"
        >
          {value}
        </text>
      </svg>
      <span className="text-xs mt-1 text-slate-300 font-semibold text-center">
        {label}
      </span>
    </div>
  );
};

export default CircularProgress;
