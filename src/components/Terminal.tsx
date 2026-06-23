/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { TerminalLine } from "../types";
import { RotateCcw, Terminal as TermIcon } from "lucide-react";

interface TerminalProps {
  history: TerminalLine[];
  onReset: () => void;
  isLoading: boolean;
  onRunCustomCommand: (cmd: string) => void;
}

export default function Terminal({
  history,
  onReset,
  isLoading,
  onRunCustomCommand
}: TerminalProps) {
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const [inputVal, setInputVal] = useState("");

  // Auto-scroll terminal on content receipt
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isLoading]);

  const getLineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "input":
        return "text-[#E4E3E0] font-bold";
      case "error":
        return "text-red-400";
      case "success":
        return "text-emerald-400 font-semibold";
      case "warning":
        return "text-orange-400 font-semibold";
      default:
        return "text-slate-300";
    }
  };

  const presetCommands = [
    { cmd: "vendor/bin/agent-loop board:sync" },
    { cmd: "vendor/bin/agent-loop session:start --task=DEMO-1 --by=lars" },
    { cmd: "vendor/bin/agent-loop recall:compile --root=learning-root --task=DEMO-1" },
    { cmd: "composer test" },
    { cmd: "vendor/bin/agent-loop verify --strict" },
    { cmd: "vendor/bin/agent-loop learn:persist --root=learning-root" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim() && !isLoading) {
      onRunCustomCommand(inputVal);
      setInputVal("");
    }
  };

  return (
    <div className="bg-[#141414] text-[#E4E3E0] rounded-none border border-[#141414] shadow-none h-full flex flex-col font-mono text-xs sm:text-[13px] leading-relaxed">
      {/* Terminal Titlebar */}
      <div className="bg-[#1c1c1c] px-4 py-3 flex items-center justify-between border-b border-[#333333] select-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 grayscale shrink-0">
            <span className="w-2.5 h-2.5 bg-[#E4E3E0] inline-block" />
            <span className="w-2.5 h-2.5 bg-[#DAD9D6] inline-block" />
            <span className="w-2.5 h-2.5 bg-[#141414] border border-[#DAD9D6] inline-block" />
          </div>
          <span className="ml-2 text-slate-300 text-xs font-semibold font-mono tracking-widest flex items-center gap-1.5 uppercase">
            <TermIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>Lars@Sandbox: ~/acme-portal</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            title="Reset Terminal Simulation"
            className="p-1 px-2.5 rounded-none border border-[#E4E3E0]/20 bg-transparent hover:bg-[#E4E3E0] hover:text-[#141414] transition duration-150 text-[#E4E3E0] flex items-center gap-1 cursor-pointer select-none"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="text-[10px] uppercase font-bold tracking-widest font-mono">Revert</span>
          </button>
        </div>
      </div>

      {/* Terminal Content Screen */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#141414] min-h-[220px]" onClick={() => document.getElementById('term-input')?.focus()}>
        <div className="space-y-2">
          {history.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap leading-relaxed animate-fade-in">
              {line.type === "input" && (
                <span className="text-orange-500 mr-2 select-none">$</span>
              )}
              <span className={getLineColor(line.type)}>{line.text}</span>
            </div>
          ))}

          {/* Simulated loading bar */}
          {isLoading && (
            <div className="flex items-center gap-2 text-orange-400 py-1 font-mono">
              <span className="animate-pulse">◌</span>
              <span className="animate-pulse font-bold">COMPILING COMPOSER MANIFEST...</span>
            </div>
          )}

          {!isLoading && (
            <form onSubmit={handleSubmit} className="flex items-center mt-2 group">
              <span className="text-orange-500 mr-2 select-none font-bold">$</span>
              <input
                id="term-input"
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                autoComplete="off"
                spellCheck="false"
                className="flex-1 bg-transparent text-[#E4E3E0] outline-none border-none caret-orange-500 p-0 text-xs sm:text-[13px] font-mono"
                autoFocus
              />
            </form>
          )}

          <div ref={terminalEndRef} />
        </div>
      </div>

      {/* CLI Quick Action Strip */}
      <div className="bg-[#1c1c1c] p-3 border-t border-[#333333]">
        <div className="text-[9px] text-[#E4E3E0]/50 uppercase font-bold tracking-widest font-mono mb-2">
          Command Shortcuts
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onRunCustomCommand("composer require voku/agent-loop")}
            disabled={isLoading}
            className="px-2 py-1 bg-[#141414] hover:bg-[#E4E3E0] hover:text-[#141414] border border-[#333333] text-[#E4E3E0] text-[10px] font-mono cursor-pointer transition disabled:opacity-50"
          >
            composer require voku/agent-loop
          </button>
          {presetCommands.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onRunCustomCommand(item.cmd)}
              disabled={isLoading}
              className="px-2 py-1 bg-[#141414] hover:bg-[#E4E3E0] hover:text-[#141414] border border-[#333333] text-[#E4E3E0] text-[10px] font-mono cursor-pointer transition disabled:opacity-50"
            >
              {item.cmd}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
