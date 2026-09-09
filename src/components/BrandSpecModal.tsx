import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  Palette,
  Sparkles,
  Download,
  Info,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { AgentLoopLogo, AgentLoopMark } from "./AgentLoopLogo";
import {
  BRAND_PALETTE,
  LOGO_GRADIENT,
  BACKGROUND_STANDARDS,
  LOGO_SHORT_DESCRIPTION,
  LOGO_DETAILED_DESCRIPTION,
  CORE_VISUAL_RULE
} from "../constants/brand";

interface BrandSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BrandSpecModal({ isOpen, onClose }: BrandSpecModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [previewEnv, setPreviewEnv] = useState<"dark" | "light">("dark");
  const [logoLayout, setLogoLayout] = useState<"stacked" | "horizontal">("stacked");

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getRawSvg = () => {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150" fill="none">
  <defs>
    <linearGradient id="agent-loop-gradient" x1="0%" y1="60%" x2="100%" y2="40%">
      <stop offset="0%" stop-color="#7C3AED" />
      <stop offset="22%" stop-color="#6366F1" />
      <stop offset="42%" stop-color="#2563EB" />
      <stop offset="70%" stop-color="#0284C7" />
      <stop offset="100%" stop-color="#00D2FF" />
    </linearGradient>
  </defs>
  <path
    d="M 80 25 C 52.4 25, 30 47.4, 30 75 C 30 102.6, 52.4 125, 80 125 C 115 125, 132 95, 150 75 C 168 55, 185 25, 220 25 C 247.6 25, 270 47.4, 270 75 C 270 102.6, 247.6 125, 220 125 C 185 125, 168 95, 150 75 C 132 55, 115 25, 80 25 Z"
    stroke="url(#agent-loop-gradient)"
    stroke-width="30"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>`;
  };

  const handleDownloadSvg = () => {
    const svgData = getRawSvg();
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `agent-loop-logo.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-mono text-base font-bold text-slate-900 uppercase tracking-tight">
                  agent-loop Brand Specification &amp; Color Scheme
                </h2>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                  Canonical
                </span>
              </div>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Standardized visual identity, geometric rules, and reproducible LLM specifications.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="p-6 overflow-y-auto space-y-8 divide-y divide-slate-100 font-sans text-slate-800">
          {/* 1. INTERACTIVE LOGO CANVAS & CONTROLS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                  1. Live Symbol &amp; Wordmark Environment
                </span>
              </div>

              {/* CONTROLS */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Environment Toggle */}
                <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-mono">
                  <button
                    onClick={() => setPreviewEnv("dark")}
                    className={`px-3 py-1 rounded cursor-pointer transition-all ${
                      previewEnv === "dark"
                        ? "bg-[#071426] text-white shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Dark (#071426)
                  </button>
                  <button
                    onClick={() => setPreviewEnv("light")}
                    className={`px-3 py-1 rounded cursor-pointer transition-all ${
                      previewEnv === "light"
                        ? "bg-white text-slate-900 shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Light (#F8FAFC)
                  </button>
                </div>

                {/* Layout Toggle */}
                <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-mono">
                  <button
                    onClick={() => setLogoLayout("stacked")}
                    className={`px-2.5 py-1 rounded cursor-pointer ${
                      logoLayout === "stacked" ? "bg-white text-slate-900 font-bold shadow-xs" : "text-slate-600"
                    }`}
                  >
                    Stacked
                  </button>
                  <button
                    onClick={() => setLogoLayout("horizontal")}
                    className={`px-2.5 py-1 rounded cursor-pointer ${
                      logoLayout === "horizontal" ? "bg-white text-slate-900 font-bold shadow-xs" : "text-slate-600"
                    }`}
                  >
                    Horizontal
                  </button>
                </div>
              </div>
            </div>

            {/* PREVIEW CANVAS */}
            <div
              className={`rounded-xl p-10 flex flex-col items-center justify-center transition-all duration-300 relative border ${
                previewEnv === "dark"
                  ? "bg-gradient-to-br from-[#071426] to-[#0B1F46] border-slate-800 shadow-inner"
                  : "bg-[#F8FAFC] border-slate-200 shadow-inner"
              }`}
              style={{ minHeight: "220px" }}
            >
              <AgentLoopLogo
                size={56}
                layout={logoLayout}
                variant={previewEnv === "dark" ? "light" : "dark"}
              />

              {/* Status Badge */}
              <div
                className={`absolute bottom-3 right-4 font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                  previewEnv === "dark"
                    ? "bg-white/10 text-cyan-300 border border-white/15"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                Official Logo
              </div>
            </div>

            {/* Quick SVG Actions */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => handleCopy(getRawSvg(), "raw-svg")}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                {copiedKey === "raw-svg" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>Copy SVG Code</span>
              </button>
              <button
                onClick={handleDownloadSvg}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-mono text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download SVG</span>
              </button>
            </div>
          </div>

          {/* 2. CORE VISUAL IDENTITY */}
          <div className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                2. Visual Identity &amp; Geometry
              </span>
              <span className="text-[11px] font-mono text-slate-500 font-medium">
                Continuous Ribbon Lemniscate
              </span>
            </div>

            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
              <div className="flex items-center gap-2 text-blue-800 font-mono text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>{CORE_VISUAL_RULE.mark}</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-sans font-medium">
                {CORE_VISUAL_RULE.philosophy}
              </p>
            </div>
          </div>

          {/* 3. COLOR PALETTE SPECIFICATION */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                3. Standardized Color Palette
              </span>
              <span className="text-[11px] font-mono text-slate-500">Click swatch to copy hex</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {BRAND_PALETTE.map((color) => {
                const isCopied = copiedKey === color.hex;
                return (
                  <button
                    key={color.role}
                    onClick={() => handleCopy(color.hex, color.hex)}
                    className="p-3 text-left border border-slate-200 rounded-xl hover:border-slate-400 bg-white shadow-xs transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div
                        className="w-8 h-8 rounded-lg border border-black/10 shadow-xs shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="font-mono text-xs font-bold text-slate-800 group-hover:text-blue-600 flex items-center gap-1">
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : color.hex}
                      </span>
                    </div>
                    <div className="font-mono text-[11px] font-bold text-slate-900">{color.name}</div>
                    <div className="text-[10px] font-mono text-slate-500 uppercase">{color.role}</div>
                    <div className="text-[10px] text-slate-500 mt-1 leading-tight">{color.usage}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. LOGO GRADIENT SPECIFICATION */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                4. Logo Gradient (Left-to-Right)
              </span>
              <span className="font-mono text-xs text-slate-600">
                #6428FF &rarr; #1688FF &rarr; #18D7E8
              </span>
            </div>

            {/* Gradient Visualization Bar */}
            <div className="h-6 rounded-lg shadow-inner overflow-hidden relative" style={{ background: LOGO_GRADIENT.css }}>
              <div className="absolute inset-0 flex items-center justify-between px-3 text-[10px] font-mono font-bold text-white drop-shadow-xs">
                <span>0% Electric Violet</span>
                <span>50% Electric Blue</span>
                <span>100% Bright Cyan</span>
              </div>
            </div>

            {/* Conceptual Stages */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              {LOGO_GRADIENT.stops.map((stop) => (
                <div key={stop.offset} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{stop.name}</span>
                    <span className="text-[10px] text-slate-500">{stop.offset}</span>
                  </div>
                  <div className="font-mono text-xs font-bold" style={{ color: stop.hex }}>
                    {stop.hex}
                  </div>
                  <div className="text-[11px] text-slate-600 font-sans pt-1">
                    Concept: <strong className="text-slate-800 font-mono">{stop.conceptualRole}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. CANONICAL DESCRIPTIONS (COPYABLE FOR LLMs & PROMPTS) */}
          <div className="pt-6 space-y-4">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
              5. Reusable Descriptions &amp; Prompts
            </span>

            {/* Short Canonical Description */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-800 uppercase">
                  Short Canonical Description
                </span>
                <button
                  onClick={() => handleCopy(LOGO_SHORT_DESCRIPTION, "short-desc")}
                  className="px-2.5 py-1 text-xs font-mono font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded cursor-pointer flex items-center gap-1 transition-colors"
                >
                  {copiedKey === "short-desc" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Copy</span>
                </button>
              </div>
              <blockquote className="text-xs text-slate-700 italic border-l-2 border-blue-500 pl-3 leading-relaxed">
                "{LOGO_SHORT_DESCRIPTION}"
              </blockquote>
            </div>

            {/* Detailed LLM/Design Prompt */}
            <div className="border border-slate-200 rounded-xl p-4 bg-[#071426] text-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono text-xs font-bold text-white uppercase">
                    Detailed LLM / Designer Reproduction Prompt
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(LOGO_DETAILED_DESCRIPTION, "detailed-desc")}
                  className="px-3 py-1 text-xs font-mono font-bold text-white bg-blue-600 hover:bg-blue-500 rounded cursor-pointer flex items-center gap-1 transition-colors"
                >
                  {copiedKey === "detailed-desc" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Copy Prompt</span>
                </button>
              </div>
              <pre className="text-xs font-mono whitespace-pre-wrap leading-relaxed text-slate-300 bg-black/30 p-3 rounded-lg border border-slate-800 max-h-60 overflow-y-auto">
                {LOGO_DETAILED_DESCRIPTION}
              </pre>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between flex-wrap gap-2 text-xs font-mono text-slate-500">
          <div>Standardized in <code className="font-bold text-slate-700">src/constants/brand.ts</code></div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
