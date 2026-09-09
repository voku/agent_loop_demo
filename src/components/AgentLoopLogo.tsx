import React, { CSSProperties } from "react";

interface LogoProps {
  className?: string;
  size?: number | string;
  withText?: boolean;
  variant?: "dark" | "light"; // "dark" for light bg (dark text), "light" for dark bg (white text)
  textClassName?: string;
  layout?: "horizontal" | "stacked";
}

/**
 * High-precision, mathematically smooth infinity mark matching the official agent-loop logo.
 * ViewBox 0 0 300 150: Center at (150, 75), outer loop centers at (80, 75) and (220, 75).
 * Stroke width 30px with smooth cubic bezier junctions and continuous tangents.
 */
export function AgentLoopMark({
  className = "w-12 h-6",
  idPrefix = "al-mark",
  style
}: {
  className?: string;
  idPrefix?: string;
  style?: CSSProperties;
}) {
  const gradId = `${idPrefix}-gradient`;

  return (
    <svg
      viewBox="0 0 300 150"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="agent-loop logo symbol"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="60%" x2="100%" y2="40%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="22%" stopColor="#6366F1" />
          <stop offset="42%" stopColor="#2563EB" />
          <stop offset="70%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#00D2FF" />
        </linearGradient>
      </defs>

      {/* Perfectly continuous, tangent-matched lemniscate path */}
      <path
        d="M 80 25 C 52.4 25, 30 47.4, 30 75 C 30 102.6, 52.4 125, 80 125 C 115 125, 132 95, 150 75 C 168 55, 185 25, 220 25 C 247.6 25, 270 47.4, 270 75 C 270 102.6, 247.6 125, 220 125 C 185 125, 168 95, 150 75 C 132 55, 115 25, 80 25 Z"
        stroke={`url(#${gradId})`}
        strokeWidth="30"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AgentLoopLogo({
  className = "",
  variant = "dark",
  withText = true,
  size = 36,
  textClassName = "",
  layout = "horizontal"
}: LogoProps) {
  const isWhiteText = variant === "light"; // "light" variant is for dark backgrounds

  if (layout === "stacked") {
    return (
      <div className={`inline-flex flex-col items-center justify-center gap-3 select-none ${className}`}>
        <AgentLoopMark
          style={{
            width: typeof size === "number" ? `${size * 2}px` : size,
            height: typeof size === "number" ? `${size}px` : "auto"
          }}
          idPrefix={`logo-stacked-${variant}`}
        />
        {withText && (
          <span
            className={`font-sans font-black tracking-tight leading-none text-center ${
              isWhiteText ? "text-white" : "text-[#0B0F19]"
            } ${textClassName}`}
            style={{
              fontSize: typeof size === "number" ? `${Math.round(size * 0.72)}px` : "1.75rem",
              letterSpacing: "-0.035em"
            }}
          >
            agent-loop
          </span>
        )}
      </div>
    );
  }

  // Horizontal layout
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div className="shrink-0 flex items-center justify-center">
        <AgentLoopMark
          style={{
            width: typeof size === "number" ? `${size * 1.8}px` : size,
            height: typeof size === "number" ? `${size * 0.9}px` : "auto"
          }}
          idPrefix={`logo-h-${variant}`}
        />
      </div>
      {withText && (
        <span
          className={`font-sans font-black tracking-tight leading-none ${
            isWhiteText ? "text-white" : "text-[#0B0F19]"
          } ${textClassName}`}
          style={{
            fontSize: typeof size === "number" ? `${Math.round(size * 0.6)}px` : "1.25rem",
            letterSpacing: "-0.03em"
          }}
        >
          agent-loop
        </span>
      )}
    </div>
  );
}

export default AgentLoopLogo;
