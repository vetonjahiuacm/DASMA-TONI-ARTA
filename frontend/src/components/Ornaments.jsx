import React, { useMemo } from "react";

// Elegant botanical divider (line with leaves + center bloom)
export const FloralDivider = ({ className = "", color = "#b09a6b" }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <svg width="260" height="34" viewBox="0 0 260 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 17 H108" stroke={color} strokeWidth="1" />
      <path d="M258 17 H152" stroke={color} strokeWidth="1" />
      {/* left leaves */}
      <path d="M108 17 C96 8, 84 8, 78 15 C86 17, 98 17, 108 17 Z" fill={color} opacity="0.7" />
      <path d="M96 17 C86 24, 74 24, 68 18 C78 16, 90 16, 96 17 Z" fill={color} opacity="0.5" />
      {/* right leaves */}
      <path d="M152 17 C164 8, 176 8, 182 15 C174 17, 162 17, 152 17 Z" fill={color} opacity="0.7" />
      <path d="M164 17 C174 24, 186 24, 192 18 C182 16, 170 16, 164 17 Z" fill={color} opacity="0.5" />
      {/* center bloom */}
      <circle cx="130" cy="17" r="4.5" fill={color} />
      <circle cx="130" cy="17" r="8" stroke={color} strokeWidth="0.8" opacity="0.6" />
      <circle cx="130" cy="6" r="1.6" fill={color} opacity="0.8" />
      <circle cx="130" cy="28" r="1.6" fill={color} opacity="0.8" />
    </svg>
  </div>
);

// Botanical sprig used to frame headings
export const Sprig = ({ className = "", flip = false, color = "#b09a6b" }) => (
  <svg
    width="70" height="120" viewBox="0 0 70 120" fill="none"
    className={className}
    style={{ transform: flip ? "scaleX(-1)" : "none" }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M55 4 C40 30, 34 60, 40 116" stroke={color} strokeWidth="1.1" fill="none" />
    {[16, 34, 52, 70, 88].map((y, i) => (
      <g key={i}>
        <path d={`M${40 - i * 0.6} ${y} C${20} ${y - 12}, ${8} ${y - 6}, ${6} ${y + 2} C${18} ${y + 6}, ${30} ${y + 4}, ${40} ${y}`} fill={color} opacity={0.55 - i * 0.05} />
      </g>
    ))}
    {[24, 44, 64, 82].map((y, i) => (
      <path key={i} d={`M${42} ${y} C${58} ${y - 10}, ${66} ${y - 4}, ${66} ${y + 3} C${56} ${y + 6}, ${48} ${y + 3}, ${42} ${y}`} fill={color} opacity={0.5 - i * 0.05} />
    ))}
    <circle cx="55" cy="4" r="3" fill={color} />
  </svg>
);

// Falling petals ambient background
export const Petals = ({ count = 14 }) => {
  const petals = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        left: Math.random() * 100,
        size: 8 + Math.random() * 10,
        duration: 12 + Math.random() * 12,
        delay: Math.random() * 12,
      })),
    [count]
  );
  return (
    <>
      {petals.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </>
  );
};
