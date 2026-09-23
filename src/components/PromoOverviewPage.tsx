import React, { useState } from "react";
import {
  RotateCcw,
  FileText,
  HelpCircle,
  AlertTriangle,
  Check,
  Database,
  FileCheck,
  Lightbulb,
  Users,
  Copy,
  Terminal,
  ListTodo,
  Code2,
  CheckCircle2,
  Rocket,
  ArrowDown,
  ArrowRight,
  ExternalLink,
  Play,
  RotateCw,
  Sparkles,
  FileCode,
  Info,
  Workflow
} from "lucide-react";
import { AgentLoopMark } from "./AgentLoopLogo";
import { DeepDiveChapters } from "./DeepDiveChapters";

export function PromoOverviewPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "deepdive">("overview");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(1);

  const terminalCommands = [
    "composer require --dev voku/agent-loop",
    "vendor/bin/agent-loop init install-assets --agent=codex",
    "vendor/bin/agent-loop init doctor",
    "# Start a fresh Codex session (or restart if already running)",
    "vendor/bin/agent-loop enter DEMO-1 --format=json"
  ];

  const handleCopyCommand = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(terminalCommands.join("\n"));
    setCopiedIndex(99);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // 4 Steps of the everyday loop for the interactive walkthrough
  const workflowSteps = [
    {
      step: 1,
      name: "agent-loop enter <task>",
      tagline: "Resume intent + context",
      concept: "The task survives the chat",
      command: "vendor/bin/agent-loop enter DEMO-1 --format=json",
      description:
        "The coding agent calls enter. Agent Loop reads the approved Contract from docs/kanban/*.md and computes the exact mutation boundary.",
      inputLabel: "Durable State on Disk",
      inputContent: `docs/kanban/DEMO-1.md (approved Contract v1)
Approved Scope: ["src/Domain/Order.php", "tests/OrderTest.php"]
Non-goals: No public API changes`,
      outputLabel: "CLI Canonical Projection",
      outputJson: `{
  "task_id": "DEMO-1",
  "status": "in_progress",
  "mutation_ready": true,
  "next_action_kind": "host_work",
  "next_action": "Implement order transition validator and run focused tests",
  "scope_whitelist": [
    "src/Domain/Order.php",
    "tests/OrderTest.php"
  ]
}`,
      takeaway:
        "The model doesn't need to reconstruct task history from a chat transcript. If the session resets or changes models, the approved task contract remains durable on disk."
    },
    {
      step: 2,
      name: "follow next_action",
      tagline: "Command • Decision • Host work",
      concept: "Canonical routing beats prompt guesswork",
      command: "# Host agent inspects next_action_kind & next_action",
      description:
        "Instead of inventing what to do next through prompt hallucinations, the agent executes the explicit next_action emitted by the workflow.",
      inputLabel: "Canonical Action Kinds",
      inputContent: `• command: Run an exact deterministic command
• command_template: Fill task-specific parameters
• host_work: Do engineering work (code edits, test repairs)
• decision_required: Ask human when an authority boundary is reached`,
      outputLabel: "Current Directive for Coding Agent",
      outputJson: `{
  "next_action_kind": "host_work",
  "subject": "order_state_guard",
  "directive": "Add state-transition guard rejecting cancelled orders before status change",
  "enforced_files": ["src/Domain/Order.php"]
}`,
      takeaway:
        "No giant phase machine hidden in system prompts. No memorizing 20 workflow commands. The local kernel tells the agent what to do next."
    },
    {
      step: 3,
      name: "implement",
      tagline: "Normal repository tools within bounds",
      concept: "Strict scope guard protects the repository",
      command: "# Agent edits code with normal editor & LSP tools",
      description:
        "The coding host (Claude Code, Codex, Copilot, Cursor, Gemini) edits files safely within the approved scope whitelist.",
      inputLabel: "Approved Scope Whitelist",
      inputContent: `[AUTHORIZED] src/Domain/Order.php
[AUTHORIZED] tests/OrderTest.php
[BLOCKED]    config/database.php (out of bounds)
[BLOCKED]    src/Http/Api.php    (unauthorized scope expansion)`,
      outputLabel: "Diff Inspection & Boundary Check",
      outputJson: `{
  "git_modified_files": [
    "src/Domain/Order.php",
    "tests/OrderTest.php"
  ],
  "scope_violation": false,
  "diff_lines": 34,
  "status": "ready_for_validation"
}`,
      takeaway:
        "The agent works with its normal coding tools. If it attempts to touch unauthorized files, Agent Loop flags the boundary and prevents unapproved repository drift."
    },
    {
      step: 4,
      name: "agent-loop finish <task>",
      tagline: "Validate • Review • Record only what happened • Close",
      concept: "Evidence without ceremony",
      command: "vendor/bin/agent-loop finish DEMO-1 --format=json",
      description:
        "The closeout front door. It verifies current evidence, records machine facts automatically, asks for judgment only when there is something to judge, and then closes or surfaces remaining owner work.",
      inputLabel: "Evidence Verification Gate",
      inputContent: `Command: composer test tests/OrderTest.php
Exit Code: 0 (Passed)
Git Tree Snapshot: git-tree-v1:9f8a2b4...
Evidence Status: current (strictly bound to this snapshot)`,
      outputLabel: "Closeout Result — No Fabricated Outcome",
      outputJson: `{
  "task_id": "DEMO-1",
  "validation_passed": true,
  "evidence_state": "current",
  "next_action_kind": "none",
  "status": "completed"
}`,
      takeaway:
        "Selection is machine evidence; usefulness is a judgment. If recalled guidance was never judged, no outcome row is invented. If there is no Finding, none is created. A no-durable-learning decision can stay a cheap explicit decision without an essay."
    }
  ];

  const currentStep = workflowSteps[activeWorkflowStep - 1];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-blue-600 selection:text-white flex flex-col font-sans">
      
      {/* ========================================================================= */}
      {/* CLEAN TOP NAVBAR                                                          */}
      {/* ========================================================================= */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <a
            href={import.meta.env.BASE_URL}
            aria-label="Back to the agent-loop overview"
            className="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
          >
            <AgentLoopMark className="w-8 h-4 sm:w-10 sm:h-5 text-blue-600" idPrefix="promo-nav-logo" />
            <div>
              <span className="font-mono text-base sm:text-lg font-black tracking-tight text-slate-950 flex items-center gap-2">
                <span>agent-loop</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium hidden md:block">
                Governed Local Workflows for Coding Agents
              </span>
            </div>
          </a>

          {/* Navigation Links & Action */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                setActiveTab("overview");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer hidden sm:flex items-center gap-1.5 ${
                activeTab === "overview"
                  ? "bg-slate-100 text-blue-600"
                  : "text-slate-700 hover:text-blue-600 hover:bg-slate-100"
              }`}
            >
              <span>Overview</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("overview");
                setTimeout(() => {
                  const el = document.getElementById("workflow-walkthrough");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 50);
              }}
              className="px-3 py-1.5 text-xs font-mono font-bold text-slate-700 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCw className="w-3.5 h-3.5 text-blue-600" />
              <span>4-Step Workflow</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("deepdive");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "deepdive"
                  ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs"
                  : "text-slate-700 hover:text-blue-600 hover:bg-slate-100"
              }`}
            >
              <Workflow className="w-3.5 h-3.5 text-blue-600" />
              <span>Deep Dive: Chapters</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("overview");
                setTimeout(() => {
                  const el = document.getElementById("quickstart-cli");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 50);
              }}
              className="px-3 py-1.5 text-xs font-mono font-bold text-slate-700 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer hidden md:flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5 text-slate-600" />
              <span>Quickstart</span>
            </button>

            <a
              href="https://github.com/voku/agent-loop"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 text-cyan-300" />
            </a>
          </div>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* MAIN CONTAINER                                                            */}
      {/* ========================================================================= */}
      <main className="max-w-[1360px] mx-auto p-4 sm:p-6 lg:p-8 space-y-8 flex-1 w-full">
        {activeTab === "deepdive" ? (
          <DeepDiveChapters onBackToOverview={() => setActiveTab("overview")} />
        ) : (
          <>
            {/* ======================================================================= */}
            {/* THE PROMO POSTER (PIXEL-PERFECT FROM USER SPEC & IMAGE)                 */}
            {/* ======================================================================= */}
            <div className="bg-white border border-slate-200/90 rounded-3xl shadow-xl p-5 sm:p-7 lg:p-9 space-y-8">
          
          {/* HEADER ROW */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-4 border-b border-slate-100">
            {/* Main Titles */}
            <div className="space-y-3 max-w-4xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black tracking-tight leading-[1.08] text-slate-950">
                Your coding agent can write code.{" "}
                <span className="text-[#1d4ed8] block sm:inline">
                  Agent Loop keeps the work reliable.
                </span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed font-normal">
                A local-first PHP workflow around the coding agent you already use: durable task intent, bounded context, explicit evidence, and learning only when the evidence says there is something worth keeping.
              </p>
            </div>

            {/* Badges & Handwritten Script */}
            <div className="flex flex-col items-start lg:items-end gap-3 shrink-0 self-start lg:self-center">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 justify-start lg:justify-end">
                <span className="px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono font-bold tracking-tight shadow-2xs">
                  agent-loop 0.20.40
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200/80 text-slate-800 text-xs font-mono font-bold tracking-tight shadow-2xs">
                  PHP 8.3+
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200/80 text-slate-800 text-xs font-mono font-bold tracking-tight shadow-2xs">
                  Composer
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200/80 text-slate-800 text-xs font-mono font-bold tracking-tight shadow-2xs">
                  MIT
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200/80 text-slate-800 text-xs font-mono font-bold tracking-tight shadow-2xs">
                  local-first
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200/80 text-slate-800 text-xs font-mono font-bold tracking-tight shadow-2xs">
                  provider-independent
                </span>
              </div>

              {/* Handwritten Note Stamp */}
              <div className="pt-1.5 pr-2 transform -rotate-3 select-none">
                <div
                  style={{ fontFamily: "'Caveat', cursive" }}
                  className="text-slate-500 font-bold text-2xl sm:text-3xl leading-[0.9] text-left lg:text-right tracking-wide drop-shadow-xs"
                >
                  <div>Same agent.</div>
                  <div>More progress.</div>
                  <div>That sticks.</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3-COLUMN MAIN LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
            
            {/* COLUMN 1: THE PROBLEM (LIGHT PINK / RED CARD) */}
            <div className="lg:col-span-4 bg-[#fdf2f2] border border-rose-100 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-2xs">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-5 flex items-center gap-2">
                  The problem
                </h2>
                
                <div className="space-y-3">
                  {/* 1. Chat reset */}
                  <div className="bg-[#fee8e8]/90 border border-rose-200/60 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 transition-all hover:bg-rose-100/90 shadow-2xs">
                    <div className="w-10 h-10 rounded-full bg-rose-200/80 text-rose-600 flex items-center justify-center shrink-0">
                      <RotateCcw className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-tight">Chat reset</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-snug mt-0.5">
                        Reconstruct task, scope and decisions.
                      </p>
                    </div>
                  </div>

                  {/* 2. Prompt sprawl */}
                  <div className="bg-[#fee8e8]/90 border border-rose-200/60 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 transition-all hover:bg-rose-100/90 shadow-2xs">
                    <div className="w-10 h-10 rounded-full bg-rose-200/80 text-rose-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-tight">Prompt sprawl</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-snug mt-0.5">
                        Stuff more repository text into context.
                      </p>
                    </div>
                  </div>

                  {/* 3. Guesswork */}
                  <div className="bg-[#fee8e8]/90 border border-rose-200/60 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 transition-all hover:bg-rose-100/90 shadow-2xs">
                    <div className="w-10 h-10 rounded-full bg-rose-200/80 text-rose-600 flex items-center justify-center shrink-0">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-tight">Guesswork</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-snug mt-0.5">
                        The agent invents what should happen next.
                      </p>
                    </div>
                  </div>

                  {/* 4. Looks good */}
                  <div className="bg-[#fee8e8]/90 border border-rose-200/60 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 transition-all hover:bg-rose-100/90 shadow-2xs">
                    <div className="w-10 h-10 rounded-full bg-rose-200/80 text-rose-600 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-tight">Looks good</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-snug mt-0.5">
                        Confidence quietly substitutes for evidence.
                      </p>
                    </div>
                  </div>

                  {/* 5. Forgotten lessons */}
                  <div className="bg-[#fee8e8]/90 border border-rose-200/60 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 transition-all hover:bg-rose-100/90 shadow-2xs">
                    <div className="w-10 h-10 rounded-full bg-rose-200/80 text-rose-600 flex items-center justify-center shrink-0">
                      <RotateCcw className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-tight">Forgotten lessons</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-snug mt-0.5">
                        The same failure gets rediscovered later.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: THE EVERYDAY LOOP (DARK BLUE CENTERPIECE) */}
            <div className="lg:col-span-4 bg-[#0B1528] border border-slate-700/80 rounded-3xl p-5 sm:p-6 text-white shadow-2xl flex flex-col justify-between relative overflow-hidden">
              <div>
                {/* Header with Infinity Logo & Tag */}
                <div className="flex items-center justify-between gap-2 mb-5">
                  <div className="flex items-center gap-3">
                    <AgentLoopMark className="w-9 h-4.5" idPrefix="promo-center-loop" />
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      The everyday loop
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest border-b-2 border-cyan-400 pb-0.5">
                    AGENT LOOP
                  </span>
                </div>

                {/* Step Cards with Downward Arrows */}
                <div className="space-y-1.5">
                  {/* Step 1 */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveWorkflowStep(1);
                      const el = document.getElementById("workflow-walkthrough");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`w-full text-left rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 transition-all cursor-pointer group shadow-xs ${
                      activeWorkflowStep === 1
                        ? "bg-[#183054] border-2 border-cyan-400 ring-2 ring-cyan-400/20"
                        : "bg-[#132238] hover:bg-[#182c49] border border-slate-700/80"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      1
                    </div>
                    <div className="text-cyan-400 font-mono font-bold text-lg shrink-0">
                      &gt;_
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-mono font-bold text-sm sm:text-base text-white truncate">
                        agent-loop enter <span className="text-cyan-400">&lt;task&gt;</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        resume intent + context
                      </div>
                    </div>
                  </button>

                  {/* Arrow */}
                  <div className="flex justify-center py-1 text-cyan-500">
                    <ArrowDown className="w-4 h-4 stroke-[2.5]" />
                  </div>

                  {/* Step 2 */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveWorkflowStep(2);
                      const el = document.getElementById("workflow-walkthrough");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`w-full text-left rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 transition-all cursor-pointer group shadow-xs ${
                      activeWorkflowStep === 2
                        ? "bg-[#183054] border-2 border-cyan-400 ring-2 ring-cyan-400/20"
                        : "bg-[#132238] hover:bg-[#182c49] border border-slate-700/80"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      2
                    </div>
                    <div className="text-cyan-400 font-bold shrink-0">
                      <ListTodo className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-mono font-bold text-sm sm:text-base text-white truncate">
                        follow next_action
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        command • decision • host work
                      </div>
                    </div>
                  </button>

                  {/* Arrow */}
                  <div className="flex justify-center py-1 text-cyan-500">
                    <ArrowDown className="w-4 h-4 stroke-[2.5]" />
                  </div>

                  {/* Step 3 */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveWorkflowStep(3);
                      const el = document.getElementById("workflow-walkthrough");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`w-full text-left rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 transition-all cursor-pointer group shadow-xs ${
                      activeWorkflowStep === 3
                        ? "bg-[#183054] border-2 border-cyan-400 ring-2 ring-cyan-400/20"
                        : "bg-[#132238] hover:bg-[#182c49] border border-slate-700/80"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      3
                    </div>
                    <div className="text-cyan-400 font-mono font-bold text-base shrink-0">
                      &lt;/&gt;
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-mono font-bold text-sm sm:text-base text-white truncate">
                        implement
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        normal repository tools
                      </div>
                    </div>
                  </button>

                  {/* Arrow */}
                  <div className="flex justify-center py-1 text-cyan-500">
                    <ArrowDown className="w-4 h-4 stroke-[2.5]" />
                  </div>

                  {/* Step 4 */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveWorkflowStep(4);
                      const el = document.getElementById("workflow-walkthrough");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`w-full text-left rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 transition-all cursor-pointer group shadow-xs ${
                      activeWorkflowStep === 4
                        ? "bg-[#183054] border-2 border-cyan-400 ring-2 ring-cyan-400/20"
                        : "bg-[#132238] hover:bg-[#182c49] border border-slate-700/80"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      4
                    </div>
                    <div className="text-cyan-400 font-bold shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-mono font-bold text-sm sm:text-base text-white truncate">
                        agent-loop finish <span className="text-cyan-400">&lt;task&gt;</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        validate • review • record only what happened • close
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Bottom Callout in Center Column */}
              <div className="pt-5 mt-5 border-t border-slate-800/90 text-center space-y-1">
                <div className="text-sm sm:text-base font-bold text-white">
                  No hidden phase machine in the prompt.
                </div>
                <div className="text-sm sm:text-base font-bold text-cyan-400">
                  The workflow exposes what comes next.
                </div>
              </div>
            </div>

            {/* COLUMN 3: WHY TRY IT? (LIGHT GREEN CARD) */}
            <div className="lg:col-span-4 bg-[#f0fbf4] border border-emerald-100 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-2xs">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-5 flex items-center gap-2">
                  Why try it?
                </h2>

                <div className="space-y-3">
                  {/* 1. Task survives the chat */}
                  <div className="bg-[#e2f7ea]/90 border border-emerald-200/60 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 transition-all hover:bg-emerald-100/90 shadow-2xs">
                    <div className="w-10 h-10 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-tight">Task survives the chat</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-snug mt-0.5">
                        Approved intent and progress stay durable.
                      </p>
                    </div>
                  </div>

                  {/* 2. Less context, better context */}
                  <div className="bg-[#e2f7ea]/90 border border-emerald-200/60 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 transition-all hover:bg-emerald-100/90 shadow-2xs">
                    <div className="w-10 h-10 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-tight">Less context, better context</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-snug mt-0.5">
                        Map + Recall select bounded evidence.
                      </p>
                    </div>
                  </div>

                  {/* 3. Evidence beats confidence */}
                  <div className="bg-[#e2f7ea]/90 border border-emerald-200/60 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 transition-all hover:bg-emerald-100/90 shadow-2xs">
                    <div className="w-10 h-10 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-tight">Evidence beats confidence</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-snug mt-0.5">
                        Tests, analysis and review stay explicit.
                      </p>
                    </div>
                  </div>

                  {/* 4. Quiet runs stay quiet */}
                  <div className="bg-[#e2f7ea]/90 border border-emerald-200/60 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 transition-all hover:bg-emerald-100/90 shadow-2xs">
                    <div className="w-10 h-10 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-tight">Quiet runs stay quiet</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-snug mt-0.5">
                        No fake Finding or outcome prose when nothing happened.
                      </p>
                    </div>
                  </div>

                  {/* 5. Bring your own agent */}
                  <div className="bg-[#e2f7ea]/90 border border-emerald-200/60 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 transition-all hover:bg-emerald-100/90 shadow-2xs">
                    <div className="w-10 h-10 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-tight">Bring your own agent</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-snug mt-0.5">
                        Codex, Claude Code, OpenCode and others.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* CURRENT RELEASE PROOF */}
          <div className="bg-[#eef6ff] border border-blue-200/80 rounded-3xl p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="max-w-xl">
                <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-blue-700">
                  Current release proof
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 mt-1">
                  The ecosystem consumes the same owner contracts.
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Not a roadmap claim: the current release graph was resolved and exercised across the optional execution and control planes.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full lg:max-w-3xl">
                <div className="bg-white border border-blue-200 rounded-2xl p-3.5">
                  <div className="font-mono text-xs font-black text-blue-700">Core</div>
                  <div className="font-bold text-slate-900 text-sm mt-1">agent-loop 0.20.40</div>
                  <div className="text-[11px] text-slate-500 mt-1">Learning 0.18.24 · Recall 0.25.0</div>
                </div>
                <div className="bg-white border border-blue-200 rounded-2xl p-3.5">
                  <div className="font-mono text-xs font-black text-blue-700">Runner</div>
                  <div className="font-bold text-slate-900 text-sm mt-1">Clean consumer proof</div>
                  <div className="text-[11px] text-slate-500 mt-1">Released 0.20.40 graph resolved and executed</div>
                </div>
                <div className="bg-white border border-blue-200 rounded-2xl p-3.5">
                  <div className="font-mono text-xs font-black text-blue-700">UI</div>
                  <div className="font-bold text-slate-900 text-sm mt-1">Coordinated dependency graph</div>
                  <div className="text-[11px] text-slate-500 mt-1">PHP 8.3/8.4/8.5 · lowest-supported · Runner matrix</div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM BANNER: TRY ONE GOVERNED TASK */}
          <div id="quickstart-cli" className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-5 sm:p-7 lg:p-8 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left info & Launch button */}
            <div className="space-y-4 max-w-xl text-left w-full">
              <div className="flex items-center gap-3">
                <Rocket className="w-8 h-8 sm:w-10 sm:h-10 text-[#2563eb] shrink-0" />
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                  Try one governed task
                </h3>
              </div>
              <div className="space-y-1 text-sm sm:text-base text-slate-600 font-normal">
                <p>No platform migration. No new coding agent.</p>
                <p>Start in an existing Composer repository.</p>
              </div>

              {/* Fresh session boundary notice */}
              <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 leading-relaxed font-sans space-y-1">
                <div className="font-bold font-mono text-amber-950 flex items-center gap-1.5">
                  <span>Fresh-Session Boundary:</span>
                </div>
                <p>
                  Start a fresh Codex session (or restart Codex if already running). <code className="font-mono bg-white/80 px-1 py-0.5 rounded border border-amber-300 text-amber-900 font-semibold">install-assets</code> proves repository-side assets are projected; it does not prove an already-running host has reloaded newly installed skills.
                </p>
              </div>

              <div className="pt-1 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("workflow-walkthrough");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-5 py-2.5 bg-[#2563eb] hover:bg-blue-700 text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>See How the Workflow Operates</span>
                </button>
              </div>
            </div>

            {/* Right Terminal Window */}
            <div className="w-full lg:w-auto lg:min-w-[500px]">
              <div className="bg-[#0B1528] rounded-2xl p-4 sm:p-5 font-mono text-xs sm:text-sm shadow-xl border border-slate-800 text-slate-100 relative group">
                {/* Traffic lights */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
                    <span className="w-3 h-3 rounded-full bg-[#eab308]" />
                    <span className="w-3 h-3 rounded-full bg-[#22c55e]" />
                    <span className="ml-2 text-[10px] text-slate-400 font-mono">bash // quickstart</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAll}
                    className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
                    title="Copy all commands"
                  >
                    {copiedIndex === 99 ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Copied All
                      </span>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy All
                      </>
                    )}
                  </button>
                </div>

                {/* Command lines */}
                <div className="space-y-2.5">
                  {terminalCommands.map((cmd, i) => (
                    <div
                      key={cmd}
                      className="flex items-center justify-between group/cmd hover:bg-slate-800/60 p-1.5 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2.5 truncate font-mono">
                        <span className="text-cyan-400 select-none font-bold">$</span>
                        <span className="text-slate-100 select-all truncate">{cmd}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyCommand(cmd, i)}
                        className="opacity-60 group-hover/cmd:opacity-100 hover:text-cyan-400 p-1 cursor-pointer transition-all ml-2"
                        title="Copy command"
                      >
                        {copiedIndex === i ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* POSTER FOOTER ROW */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 text-xs text-slate-600">
            {/* GitHub link */}
            <a
              href="https://github.com/voku/agent-loop"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono font-bold text-slate-900 hover:text-blue-600 transition-colors"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>github.com/voku/agent-loop</span>
            </a>

            {/* Slogan & Grounding */}
            <div className="text-center sm:text-right space-y-0.5">
              <div className="font-extrabold text-slate-900 text-sm">
                Keep the agent. Add a workflow around it.
              </div>
              <div className="text-slate-500 text-xs">
                Grounded in released owner + consumer proofs • 23 Sep 2026
              </div>
            </div>
          </div>

        </div>

        {/* ======================================================================= */}
        {/* INTERACTIVE WORKFLOW WALKTHROUGH (SIMPLE, DIRECT & VISUAL)              */}
        {/* ======================================================================= */}
        <section id="workflow-walkthrough" className="space-y-5 pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Interactive Workflow Walkthrough
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-1.5">
                How the 4-Step Everyday Loop Operates
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-1">
                Click any step to inspect the exact input, canonical next action, and why this keeps engineering reliable.
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1 rounded-xl shadow-2xs">
              {[1, 2, 3, 4].map((stepNum) => (
                <button
                  key={stepNum}
                  onClick={() => setActiveWorkflowStep(stepNum)}
                  className={`w-9 h-9 rounded-lg font-mono text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                    activeWorkflowStep === stepNum
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {stepNum}
                </button>
              ))}
            </div>
          </div>

          {/* ACTIVE STEP CARD */}
          <div className="bg-[#0B1528] border border-slate-700/80 rounded-3xl p-5 sm:p-7 text-white shadow-xl space-y-6">
            
            {/* Step Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-mono font-bold text-lg flex items-center justify-center shadow-md">
                  {currentStep.step}
                </div>
                <div>
                  <div className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    Step {currentStep.step} of 4 • {currentStep.tagline}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-mono font-black text-white">
                    {currentStep.name}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 font-mono text-xs rounded-lg font-medium">
                  {currentStep.concept}
                </span>
              </div>
            </div>

            {/* Explanation & Command */}
            <div className="space-y-4">
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                {currentStep.description}
              </p>

              {/* Terminal command */}
              <div className="bg-[#050A14] border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-3 font-mono text-xs sm:text-sm text-cyan-300">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-slate-500 font-bold">$</span>
                  <span className="truncate">{currentStep.command}</span>
                </div>
                <button
                  onClick={() => handleCopyCommand(currentStep.command, 50 + currentStep.step)}
                  className="text-slate-400 hover:text-white p-1 cursor-pointer transition-colors"
                  title="Copy command"
                >
                  {copiedIndex === 50 + currentStep.step ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* 2-Column: Input / State & Canonical Output */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              {/* Left: Input */}
              <div className="bg-[#070F1E] border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-blue-400" />
                  <span>{currentStep.inputLabel}</span>
                </div>
                <pre className="text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap font-sans text-xs sm:text-[13px] bg-[#050A14] p-3 rounded-xl border border-slate-800/80">
                  {currentStep.inputContent}
                </pre>
              </div>

              {/* Right: Output */}
              <div className="bg-[#070F1E] border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{currentStep.outputLabel}</span>
                </div>
                <pre className="text-cyan-300/90 leading-relaxed overflow-x-auto font-mono text-xs sm:text-[12px] bg-[#050A14] p-3 rounded-xl border border-slate-800/80">
                  {currentStep.outputJson}
                </pre>
              </div>
            </div>

            {/* Takeaway Box */}
            <div className="p-4 bg-blue-950/40 border border-blue-800/60 rounded-2xl flex items-start gap-3">
              <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-mono text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Why This Makes Work Reliable
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  {currentStep.takeaway}
                </p>
              </div>
            </div>

            {/* Step Controls (Prev / Next) */}
            <div className="pt-2 flex items-center justify-between">
              <button
                disabled={activeWorkflowStep === 1}
                onClick={() => setActiveWorkflowStep((prev) => Math.max(1, prev - 1))}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                  activeWorkflowStep === 1
                    ? "opacity-30 cursor-not-allowed text-slate-500"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                }`}
              >
                ← Previous Step
              </button>

              <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
                <span>Step {activeWorkflowStep} of 4</span>
              </div>

              <button
                onClick={() => setActiveWorkflowStep((prev) => (prev % 4) + 1)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-cyan-500/20"
              >
                <span>{activeWorkflowStep === 4 ? "Restart Loop (Step 1)" : "Next Step"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </section>

        {/* DEEP DIVE ARCHITECTURE BANNER */}
        <div className="bg-gradient-to-r from-[#0B1528] via-[#10203a] to-[#0B1528] border border-cyan-800/60 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/70 border border-cyan-700/60 px-2.5 py-1 rounded-md">
              <Workflow className="w-3.5 h-3.5" />
              <span>Architecture Chapters</span>
            </div>
            <h3 className="text-2xl font-black tracking-tight text-white">
              Deep Dive: Connecting the Chapters (Code Files)
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl font-normal">
              Inspect how <span className="font-mono text-cyan-300">docs/kanban/*.md</span>, <span className="font-mono text-cyan-300">TaskContract.php</span>, <span className="font-mono text-cyan-300">EnterCommand.php</span>, <span className="font-mono text-cyan-300">ScopeGuard.php</span>, and <span className="font-mono text-cyan-300">FinishCommand.php</span> connect state to keep the agent's work reliable.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setActiveTab("deepdive");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-6 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer shrink-0 hover:scale-[1.02]"
          >
            <span>Explore Code Chapters</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </>
    )}
  </main>

      {/* ========================================================================= */}
      {/* GLOBAL FOOTER                                                             */}
      {/* ========================================================================= */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 text-xs font-mono text-slate-500 mt-12">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <AgentLoopMark className="w-6 h-3 text-slate-400" idPrefix="promo-footer-mark" />
            <span>voku/agent-loop • composer require --dev voku/agent-loop</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/voku/agent-loop"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              GitHub Repository
            </a>
            <span>•</span>
            <span className="text-slate-800 font-semibold font-sans">
              Keep the agent. Add a workflow around it.
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
