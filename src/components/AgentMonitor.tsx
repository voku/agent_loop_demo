import React, { useState } from "react";
import { 
  ShieldCheck, 
  Database, 
  BrainCircuit, 
  Activity, 
  CheckCircle, 
  Circle, 
  HardDrive, 
  ListTodo, 
  Kanban, 
  BookOpen, 
  Sparkles, 
  ArrowRight,
  RefreshCw,
  Lock,
  FileText,
  AlertCircle,
  Cpu,
  Map,
  Layers,
  History,
  Eye,
  Trash2,
  FileCheck,
  Play,
  RotateCcw,
  Check,
  User,
  ArrowUpRight,
  ExternalLink
} from "lucide-react";
import { VirtualFile, StepId } from "../types";

interface AgentMonitorProps {
  files: VirtualFile[];
  activeStep: StepId;
  onRunCommand: (cmd: string) => void;
  onSelectFile: (path: string) => void;
  activeFilePath: string;
  isLoading: boolean;
  onReset: () => void;
  humanReviewStage: string;
  onApproveBrief: () => void;
  onReplanBrief: () => void;
  onApproveCodePatch: () => void;
  onRejectCodePatch: () => void;
  onApproveRevisedPatch?: () => void;
  onPersistFinding: () => void;
  onConfirmPromotions: () => void;
  isAutoRunning: boolean;
  setIsAutoRunning: (val: boolean) => void;
}

type TabId = "overview" | "philosophy" | "article" | "brief" | "recall" | "learn" | "memory";

export default function AgentMonitor({ 
  files, 
  activeStep, 
  onRunCommand, 
  onSelectFile, 
  activeFilePath,
  isLoading,
  onReset,
  humanReviewStage,
  onApproveBrief,
  onReplanBrief,
  onApproveCodePatch,
  onRejectCodePatch,
  onApproveRevisedPatch,
  onPersistFinding,
  onConfirmPromotions,
  isAutoRunning,
  setIsAutoRunning
}: AgentMonitorProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  // State checks for files
  const isInstalled = files.some(f => f.path === "composer.json" && f.content.includes("voku/agent-loop"));
  const hasBoard = files.some(f => f.path.startsWith("todo/cards/"));
  const hasBrief = files.some(f => f.path === "session_plan/2026-07-14-demo-1/work-brief.json");
  const hasRecall = files.some(f => f.path.startsWith("infra/doc/agent-learning/recall-output/"));
  const hasWorkDone = files.some(f => f.path === "src/Signup.php" && f.content.includes("strlen($password) < 8"));
  const hasVerify = files.some(f => f.path === "session_plan/2026-07-14-demo-1/verification_summary.json");
  const hasClose = files.some(f => f.path === "session_plan/2026-07-14-demo-1/DEMO-1_report.json");
  const hasLearnings = files.some(f => f.path === "infra/doc/agent-learning/findings.json");
  const hasMemory = files.some(f => f.path === "infra/doc/agent-learning/proposals/candidate/proposal.2026-07-14.001.json");

  // Determine replan state
  const isReplanned = files.some(f => f.name === "rev1_work-brief.json");

  // Get Brief Status & Revision
  let briefStatus = "N/A";
  let briefRevision = 1;
  const briefFile = files.find(f => f.path === "session_plan/2026-07-14-demo-1/work-brief.json");
  if (briefFile) {
    try {
      const parsed = JSON.parse(briefFile.content);
      briefStatus = parsed.status || "candidate";
      briefRevision = parsed.brief?.goal?.includes("PHPStan") ? 2 : 1;
    } catch (e) {
      // fallback
    }
  }

  // Calculate strict step index (0-9) to determine exactly where we are
  let currentStepIdx = 0;
  if (!isInstalled) {
    currentStepIdx = 0;
  } else if (!hasBoard) {
    currentStepIdx = 1;
  } else if (!hasBrief) {
    currentStepIdx = 2;
  } else if (briefStatus !== "approved") {
    currentStepIdx = 3;
  } else if (!hasRecall) {
    currentStepIdx = 4;
  } else if (!hasWorkDone) {
    currentStepIdx = 5;
  } else if (!hasVerify) {
    currentStepIdx = 6;
  } else if (!hasClose) {
    currentStepIdx = 7;
  } else if (!hasLearnings || humanReviewStage === "findings") {
    currentStepIdx = 8;
  } else if (humanReviewStage !== "completed") {
    currentStepIdx = 9;
  } else {
    currentStepIdx = 10; // Complete
  }

  // Set up the exact 10 steps of our workflow
  const steps = [
    {
      index: 0,
      id: "init" as StepId,
      name: "01. Initialization",
      desc: "Install the agent-loop library and bootstrap repository diagnostics.",
      cmd: "composer require voku/agent-loop && vendor/bin/agent-loop init doctor",
      file: "composer.json",
      isDone: isInstalled,
      icon: Layers,
    },
    {
      index: 1,
      id: "board" as StepId,
      name: "02. Inspect board card",
      desc: "Read task specifications and acceptance criteria from local todo file structure.",
      cmd: "vendor/bin/agent-loop board card show DEMO-1",
      file: "todo/cards/DEMO-1.md",
      isDone: hasBoard,
      icon: Kanban,
    },
    {
      index: 2,
      id: "plan" as StepId,
      name: "03. Plan governed workflow",
      desc: "Plan workflow session with goal, constraints, learning root, and validation commands.",
      cmd: 'vendor/bin/agent-loop workflow plan DEMO-1 --by lars --learning-root infra/doc/agent-learning --file src/Signup.php --goal "Add validation guards to App\\Signup." --scope src/Signup.php --validation "composer test" --validation "vendor/bin/phpstan analyse"',
      file: "session_plan/2026-07-14-demo-1/work-brief.json",
      isDone: hasBrief,
      icon: FileText,
    },
    {
      index: 3,
      id: "approve" as StepId,
      name: "04. Approve work-brief revision",
      desc: "Human gate: Lars approves or requests a re-plan for the current work-brief revision.",
      cmd: "vendor/bin/agent-loop workflow approve DEMO-1 --by lars",
      file: "session_plan/2026-07-14-demo-1/approval.json",
      isDone: briefStatus === "approved",
      icon: ShieldCheck,
      isInteractive: true,
    },
    {
      index: 4,
      id: "recall" as StepId,
      name: "05. Inspect recall & codebase maps",
      desc: "Recall files are compiled during planning. Build codebase map and query symbol mapping.",
      cmd: "vendor/bin/agent-loop map build --paths=src,tests && vendor/bin/agent-loop map query Signup",
      file: ".agent-map/php-symbols.json",
      isDone: hasRecall,
      icon: Map,
    },
    {
      index: 5,
      id: "work" as StepId,
      name: "06. External Implementation & Validation",
      desc: "External harness or human implements code patch in src/Signup.php and verifies test suite.",
      cmd: "composer test && vendor/bin/phpstan analyse",
      file: "src/Signup.php",
      isDone: hasWorkDone && currentStepIdx > 5,
      icon: Activity,
      isInteractive: true,
    },
    {
      index: 6,
      id: "verify" as StepId,
      name: "07. Record outcomes & learning decision",
      desc: "Identify model blind spots, log outcomes journal with --commit, and record dynamic learning decisions.",
      cmd: "vendor/bin/agent-loop recall log-outcome --root infra/doc/agent-learning --draft infra/doc/agent-learning/recall-output/2026-07-14-demo-1/recall-log.draft.json --by lars --commit working-tree",
      file: "session_plan/2026-07-14-demo-1/verification_summary.json",
      isDone: hasVerify,
      icon: FileCheck,
    },
    {
      index: 7,
      id: "close" as StepId,
      name: "08. Verify, report and close session",
      desc: "Run verification checks, compile workflow report, and gracefully close the DEMO-1 session.",
      cmd: "vendor/bin/agent-loop review blindspots DEMO-1 && vendor/bin/agent-loop verify --strict && vendor/bin/agent-loop workflow report DEMO-1 && vendor/bin/agent-loop workflow close DEMO-1 --status done",
      file: "session_plan/2026-07-14-demo-1/DEMO-1_report.json",
      isDone: hasClose,
      icon: Lock,
    },
    {
      index: 8,
      id: "learn" as StepId,
      name: "09. Validate learning findings",
      desc: "Validate externally or human-created finding candidates finding.2026-07-14.001.json.",
      cmd: "vendor/bin/agent-loop learn validate --root infra/doc/agent-learning",
      file: "infra/doc/agent-learning/findings/finding.2026-07-14.001.json",
      isDone: hasLearnings && humanReviewStage !== "findings",
      icon: Sparkles,
      isInteractive: true,
    },
    {
      index: 9,
      id: "memory" as StepId,
      name: "10. Evaluate & Approve Guidance",
      desc: "Evaluate recall events with --write-candidates to generate candidate proposals, then explicitly approve them.",
      cmd: "vendor/bin/agent-loop learn guidance-evaluate --root infra/doc/agent-learning --write-candidates && vendor/bin/agent-loop learn proposal-approve --root infra/doc/agent-learning proposal.2026-07-14.001 --by lars",
      file: "infra/doc/agent-learning/proposals/candidate/proposal.2026-07-14.001.json",
      isDone: hasMemory && humanReviewStage !== "memory_policy" && humanReviewStage !== "completed",
      icon: History,
      isInteractive: true,
    },
  ];

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
  };

  const handleExecuteStep = (stepCmd: string, stepFile: string) => {
    onRunCommand(stepCmd);
    onSelectFile(stepFile);
  };

  return (
    <div className="bg-[#E4E3E0] text-[#141414] border-2 border-[#141414] shadow-none overflow-hidden h-full flex flex-col font-sans">
      
      {/* Header Banner */}
      <div className="bg-[#141414] text-[#E4E3E0] px-5 py-4 flex items-center justify-between shrink-0 border-b-2 border-[#141414] gap-2 select-none">
        <div className="flex items-center gap-2.5">
          <BrainCircuit className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="text-xs font-black tracking-widest uppercase">VOKU // WORKFLOW NAVIGATOR</h2>
            <p className="text-[9px] text-gray-400 font-mono tracking-wider mt-0.5">SEQUENTIAL INTERACTIVE STEPS</p>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <button
            onClick={onReset}
            className="px-2.5 py-1 text-[9.5px] font-black border border-amber-500 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-[#141414] transition duration-150 cursor-pointer flex items-center gap-1 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET SANDBOX</span>
          </button>
        </div>
      </div>

      {/* Navigation tabs - letting users inspect core artifacts without cluttering the screen */}
      <div className="bg-[#F0EFEC] border-b-2 border-[#141414] flex flex-wrap divide-x divide-[#141414] select-none text-[9px] font-mono uppercase tracking-wider shrink-0">
        <button
          onClick={() => handleTabChange("overview")}
          className={`flex-1 min-w-[65px] py-2.5 text-center font-black transition duration-150 hover:bg-[#DAD9D6] ${activeTab === "overview" ? "bg-[#141414] text-[#E4E3E0]" : "text-[#141414]"}`}
        >
          Timeline
        </button>
        <button
          onClick={() => handleTabChange("philosophy")}
          className={`flex-1 min-w-[65px] py-2.5 text-center font-black transition duration-150 hover:bg-[#DAD9D6] ${activeTab === "philosophy" ? "bg-[#141414] text-[#E4E3E0]" : "text-[#141414]"}`}
        >
          Philosophy
        </button>
        <button
          onClick={() => handleTabChange("article")}
          className={`flex-1 min-w-[65px] py-2.5 text-center font-black transition duration-150 hover:bg-[#DAD9D6] ${activeTab === "article" ? "bg-[#141414] text-[#E4E3E0]" : "text-[#141414]"}`}
        >
          Article
        </button>
        <button
          onClick={() => handleTabChange("brief")}
          disabled={!hasBrief}
          className={`flex-1 min-w-[65px] py-2.5 text-center font-bold transition duration-150 hover:bg-[#DAD9D6] disabled:opacity-45 disabled:hover:bg-transparent ${activeTab === "brief" ? "bg-[#141414] text-[#E4E3E0]" : "text-[#141414]"}`}
        >
          Specs
        </button>
        <button
          onClick={() => handleTabChange("recall")}
          disabled={!hasRecall}
          className={`flex-1 min-w-[65px] py-2.5 text-center font-bold transition duration-150 hover:bg-[#DAD9D6] disabled:opacity-45 disabled:hover:bg-transparent ${activeTab === "recall" ? "bg-[#141414] text-[#E4E3E0]" : "text-[#141414]"}`}
        >
          Recall
        </button>
        <button
          onClick={() => handleTabChange("learn")}
          disabled={!hasLearnings}
          className={`flex-1 min-w-[65px] py-2.5 text-center font-bold transition duration-150 hover:bg-[#DAD9D6] disabled:opacity-45 disabled:hover:bg-transparent ${activeTab === "learn" ? "bg-[#141414] text-[#E4E3E0]" : "text-[#141414]"}`}
        >
          Findings
        </button>
        <button
          onClick={() => handleTabChange("memory")}
          disabled={!hasMemory}
          className={`flex-1 min-w-[65px] py-2.5 text-center font-bold transition duration-150 hover:bg-[#DAD9D6] disabled:opacity-45 disabled:hover:bg-transparent ${activeTab === "memory" ? "bg-[#141414] text-[#E4E3E0]" : "text-[#141414]"}`}
        >
          Memory
        </button>
      </div>

      {/* Main Content Viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#EAE9E6]">
        
        {/* INTERACTIVE TIMELINE STEPPER (The primary unified control center) */}
        {activeTab === "overview" && (
          <div className="space-y-3.5 animate-fade-in">
            
            {/* Quick Context Ribbon */}
            <div className="border border-[#141414]/20 p-3 bg-[#F0EFEC] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-wide text-slate-800">
                <Database className="w-4 h-4 text-indigo-700" />
                <span>Task context: DEMO-1 // strict-types</span>
              </div>
              <div className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                {currentStepIdx === 10 ? "COMPLETED" : `STEP ${currentStepIdx + 1}/10 ACTIVE`}
              </div>
            </div>

            {/* Unified Master Workflow Controller Panel */}
            <div className="border-2 border-[#141414] bg-[#F0EFEC] p-4 relative overflow-hidden shrink-0 shadow-[4px_4px_0px_0px_#141414]">
              <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-[#141414]" />
              
              <div className="pl-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-[#141414]/70 uppercase font-mono">
                    <Activity className={`w-3.5 h-3.5 ${isAutoRunning ? "text-amber-500 animate-spin" : "text-[#141414]"}`} />
                    <span>LOCAL GOVERNANCE PROTOCOL</span>
                  </div>
                  <h3 className="text-xs font-black text-[#141414] uppercase tracking-tight font-mono">
                    {currentStepIdx === 10 ? (
                      <span className="text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" /> GOVERNED CYCLE SUCCESSFULLY VERIFIED
                      </span>
                    ) : isAutoRunning ? (
                      <span className="text-amber-600 flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                        AUTO-COORDINATING REVISIONAL FLOWS...
                      </span>
                    ) : [3, 5, 8, 9].includes(currentStepIdx) && ((currentStepIdx === 3 && briefStatus !== "approved") || (currentStepIdx === 5 && !hasWorkDone) || (currentStepIdx === 8 && hasLearnings) || (currentStepIdx === 9 && hasMemory)) ? (
                      <span className="text-red-700 flex items-center gap-1.5 animate-pulse">
                        🔒 PAUSED — AWAITING HUMAN DECISION
                      </span>
                    ) : (
                      <span className="text-[#141414]">READY TO RUN COHERENCE GATES</span>
                    )}
                  </h3>
                  <p className="text-[10.5px] text-[#141414]/75 font-sans leading-normal">
                    {currentStepIdx === 10 ? (
                      "All workflow contracts passed, checks verified, and durable learning candidate approved."
                    ) : isAutoRunning ? (
                      `Coordinating step ${currentStepIdx + 1}: ${steps[currentStepIdx]?.name || ""}. Note: agent-loop manages state, but external tools (PHPUnit, PHPStan) and the external agent perform the work.`
                    ) : [3, 5, 8, 9].includes(currentStepIdx) && ((currentStepIdx === 3 && briefStatus !== "approved") || (currentStepIdx === 5 && !hasWorkDone) || (currentStepIdx === 8 && hasLearnings) || (currentStepIdx === 9 && hasMemory)) ? (
                      "This is a Human-in-the-Loop gate. Humans must explicitly authorize the next transition."
                    ) : (
                      `The next step is ready. The CLI will verify artifacts and evidence coherence.`
                    )}
                  </p>
                </div>
                
                <div className="shrink-0 flex items-center gap-2 font-mono">
                  {currentStepIdx < 10 && (
                    <>
                      {isAutoRunning ? (
                        <button
                          onClick={() => setIsAutoRunning(false)}
                          className="px-4 py-2 text-xs text-[#E4E3E0] bg-[#141414] hover:bg-[#2d2c2a] border-2 border-[#141414] font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
                        >
                          <span className="w-2 h-2 bg-red-500 rounded-full" />
                          Pause Auto-Run
                        </button>
                      ) : (
                        <button
                          disabled={isLoading || ([3, 5, 8, 9].includes(currentStepIdx) && ((currentStepIdx === 3 && briefStatus !== "approved") || (currentStepIdx === 5 && !hasWorkDone) || (currentStepIdx === 8 && hasLearnings) || (currentStepIdx === 9 && hasMemory)))}
                          onClick={() => setIsAutoRunning(true)}
                          className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 border-2 border-[#141414] ${
                            [3, 5, 8, 9].includes(currentStepIdx) && ((currentStepIdx === 3 && briefStatus !== "approved") || (currentStepIdx === 5 && !hasWorkDone) || (currentStepIdx === 8 && hasLearnings) || (currentStepIdx === 9 && hasMemory))
                              ? "bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed"
                              : "bg-amber-400 text-[#141414] hover:bg-amber-300 animate-pulse"
                          }`}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          {currentStepIdx === 0 ? "Start Auto-Run Loop" : "Resume Auto-Run"}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Render Timeline Vertical Sequence */}
            <div className="relative pl-4 border-l-2 border-slate-300 space-y-4 py-1">
              {steps.map((step) => {
                const isActive = currentStepIdx === step.index;
                const isDone = step.index < currentStepIdx;
                const isPending = step.index > currentStepIdx;
                const Icon = step.icon;

                // Determine active style pairings
                let cardClass = "";
                if (isActive) {
                  cardClass = "border-2 border-amber-500 bg-white shadow-md ring-1 ring-amber-400/10";
                } else if (isDone) {
                  cardClass = "border border-emerald-600 bg-white/70 hover:bg-white transition duration-150";
                } else {
                  cardClass = "border border-slate-300 bg-[#E4E3E0]/30 opacity-55 select-none pointer-events-none";
                }

                return (
                  <div key={step.index} className="relative">
                    
                    {/* Floating Left Connector Dot */}
                    <div className="absolute -left-[25px] top-4 w-4 h-4 rounded-full border border-[#141414] flex items-center justify-center bg-white z-10 shadow-sm">
                      {isDone ? (
                        <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full" />
                      ) : isActive ? (
                        <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
                      ) : (
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      )}
                    </div>

                    {/* Step Card body */}
                    <div className={`p-3.5 transition-all duration-200 relative ${cardClass}`}>
                      
                      {/* Step Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-amber-500 animate-pulse" : isDone ? "text-emerald-700" : "text-slate-400"}`} />
                            <span className={`text-xs font-mono font-extrabold tracking-tight ${isActive ? "text-[#141414]" : "text-slate-700"}`}>
                              {step.name}
                            </span>
                          </div>
                          {isActive && (
                            <p className="text-[11px] text-slate-600 font-sans leading-relaxed mt-1">
                              {step.desc}
                            </p>
                          )}
                        </div>

                        {/* Status badges */}
                        <div className="shrink-0 font-mono text-[9px] uppercase tracking-wider">
                          {isDone ? (
                            <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 border border-emerald-400 font-bold flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-700" /> Done
                            </span>
                          ) : isActive ? (
                            <span className="bg-amber-400 text-amber-950 px-2 py-0.5 border border-amber-500 font-black animate-pulse">
                              ACTIVE
                            </span>
                          ) : (
                            <span className="text-slate-400 bg-slate-100 px-2 py-0.5 border border-slate-200">
                              Locked
                            </span>
                          )}
                        </div>
                      </div>

                      {/* ACTIVE CONTROLLER INSIDE STEP (Unified control interface to avoid jumping around) */}
                      {isActive && (
                        <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
                          
                          {/* Connected Workspace File Link */}
                          <div className="flex items-center gap-1.5 text-[10px] font-mono">
                            <span className="text-slate-400 uppercase font-bold text-[9px]">Target Workspace:</span>
                            <button
                              onClick={() => onSelectFile(step.file)}
                              className={`px-2 py-0.5 border hover:bg-[#141414] hover:text-[#E4E3E0] transition duration-150 flex items-center gap-1 truncate max-w-xs ${activeFilePath === step.file ? "bg-amber-100 text-amber-900 border-amber-400 font-black" : "bg-[#F9F8F6] text-slate-800 border-[#141414]/20"}`}
                              title="Click to view file in the IDE"
                            >
                              📁 {step.file}
                              <ArrowUpRight className="w-3 h-3 text-slate-400 shrink-0" />
                            </button>
                          </div>

                          {/* Render Dynamic Step Actions */}
                          <div className="space-y-2">
                            
                            {/* STEP 1: Initialization require */}
                            {step.index === 0 && (
                              <button
                                disabled={isLoading}
                                onClick={() => handleExecuteStep("composer require voku/agent-loop && vendor/bin/agent-loop init doctor", "composer.json")}
                                className="w-full py-2.5 bg-[#141414] hover:bg-slate-800 text-amber-400 disabled:opacity-50 font-black text-xs uppercase tracking-widest border border-[#141414] transition duration-150 cursor-pointer flex items-center justify-center gap-2 select-none animate-pulse"
                              >
                                {isLoading ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Play className="w-3.5 h-3.5 fill-current" />
                                )}
                                <span>⚡ Bootstrap agent-loop doctor</span>
                              </button>
                            )}

                            {/* STEP 2: Board sync */}
                            {step.index === 1 && (
                              <button
                                disabled={isLoading}
                                onClick={() => handleExecuteStep("vendor/bin/agent-loop board card show DEMO-1", "todo/cards/DEMO-1.md")}
                                className="w-full py-2.5 bg-[#141414] hover:bg-slate-800 text-amber-400 disabled:opacity-50 font-black text-xs uppercase tracking-widest border border-[#141414] transition duration-150 cursor-pointer flex items-center justify-center gap-2 select-none animate-pulse"
                              >
                                {isLoading ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Play className="w-3.5 h-3.5 fill-current" />
                                )}
                                <span>⚡ Inspect Board Card</span>
                              </button>
                            )}

                            {/* STEP 3: Planning */}
                            {step.index === 2 && (
                              <button
                                disabled={isLoading}
                                onClick={() => handleExecuteStep('vendor/bin/agent-loop workflow plan DEMO-1 --by lars --learning-root infra/doc/agent-learning --file src/Signup.php --goal "Add validation guards to App\\Signup." --scope src/Signup.php --validation "composer test" --validation "vendor/bin/phpstan analyse"', "session_plan/DEMO-1/work-brief.json")}
                                className="w-full py-2.5 bg-[#141414] hover:bg-slate-800 text-amber-400 disabled:opacity-50 font-black text-xs uppercase tracking-widest border border-[#141414] transition duration-150 cursor-pointer flex items-center justify-center gap-2 select-none animate-pulse"
                              >
                                {isLoading ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Play className="w-3.5 h-3.5 fill-current" />
                                )}
                                <span>⚡ Plan Session Workflow</span>
                              </button>
                            )}

                            {/* STEP 4: Human Gate (Approve Work Brief) */}
                            {step.index === 3 && (
                              <div className="p-3 bg-amber-50/50 border border-amber-300 space-y-2.5 rounded-none font-mono">
                                <div className="text-[10px] font-black text-amber-950 uppercase tracking-wider flex items-center gap-1">
                                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                                  <span>WORK BRIEF REVISION GATED APPROVAL</span>
                                </div>
                                <p className="text-[10px] text-slate-700 font-sans leading-normal">
                                  You are reviewing work-brief revision {briefRevision}. Inspect specifications under <code>session_plan/DEMO-1/work-brief.json</code>. Choose to approve or request a re-plan:
                                </p>
                                <div className="flex gap-2">
                                  {!isReplanned && (
                                    <button
                                      disabled={isLoading}
                                      onClick={onReplanBrief}
                                      className="px-3 py-1.5 text-[10px] border border-slate-700 hover:bg-[#141414] hover:text-[#E4E3E0] font-bold uppercase transition duration-150 cursor-pointer bg-transparent text-slate-800"
                                    >
                                      Request Re-plan
                                    </button>
                                  )}
                                  <button
                                    disabled={isLoading}
                                    onClick={onApproveBrief}
                                    className="flex-1 py-1.5 bg-[#141414] hover:bg-slate-800 text-amber-400 font-black text-[10px] uppercase tracking-wider border border-[#141414] transition duration-150 cursor-pointer text-center select-none"
                                  >
                                    Approve Brief Revision
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* STEP 5: Recall Compile */}
                            {step.index === 4 && (
                              <button
                                disabled={isLoading}
                                onClick={() => handleExecuteStep("vendor/bin/agent-loop map build --paths=src,tests && vendor/bin/agent-loop map query Signup", "infra/doc/agent-learning/recall-output/DEMO-1/recall-log.draft.json")}
                                className="w-full py-2.5 bg-[#141414] hover:bg-slate-800 text-amber-400 disabled:opacity-50 font-black text-xs uppercase tracking-widest border border-[#141414] transition duration-150 cursor-pointer flex items-center justify-center gap-2 select-none animate-pulse"
                              >
                                {isLoading ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Play className="w-3.5 h-3.5 fill-current" />
                                )}
                                <span>⚡ Inspect Recall & Codebase Maps</span>
                              </button>
                            )}

                            {/* STEP 6: Code Patch / Execution */}
                            {step.index === 5 && (
                              <div className="space-y-2">
                                {humanReviewStage === "revised_patch" ? (
                                  <div className="p-3 bg-red-50/50 border border-red-200 space-y-2.5 rounded-none font-mono">
                                    <div className="text-[10px] font-black text-red-950 uppercase tracking-wider flex items-center gap-1">
                                      <Activity className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                                      <span>REVIEW GATED REVISED PATCH</span>
                                    </div>
                                    <p className="text-[10.5px] text-slate-700 font-sans leading-normal">
                                      Test suite failed! The external agent has revised the validation guards to reject short passwords and malformed email domain structures:
                                    </p>
                                    <div className="flex gap-2">
                                      <button
                                        disabled={isLoading}
                                        onClick={onApproveRevisedPatch}
                                        className="flex-1 py-2 bg-[#141414] hover:bg-slate-800 text-amber-400 font-black text-[10.5px] uppercase tracking-wider border border-[#141414] transition duration-150 cursor-pointer text-center select-none animate-pulse"
                                      >
                                        Approve & Apply Revised Code Patch
                                      </button>
                                    </div>
                                  </div>
                                ) : !hasWorkDone ? (
                                  <div className="p-3 bg-red-50/50 border border-red-200 space-y-2.5 rounded-none font-mono">
                                    <div className="text-[10px] font-black text-red-950 uppercase tracking-wider flex items-center gap-1">
                                      <Activity className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                                      <span>REVIEW CODE PATCH GATED APPROVAL</span>
                                    </div>
                                    <p className="text-[10.5px] text-slate-700 font-sans leading-normal">
                                      Lars reviews and approves the planned code patch. Once approved, the patch is written to <code>src/Signup.php</code> for testing:
                                    </p>
                                    <div className="flex gap-2">
                                      <button
                                        disabled={isLoading}
                                        onClick={onRejectCodePatch}
                                        className="px-3 py-1.5 text-[10px] border border-slate-400 hover:bg-[#141414] hover:text-[#E4E3E0] font-bold uppercase transition duration-150 cursor-pointer bg-transparent text-slate-700"
                                      >
                                        Request Patch Re-plan
                                      </button>
                                      <button
                                        disabled={isLoading}
                                        onClick={onApproveCodePatch}
                                        className="flex-1 py-1.5 bg-[#141414] hover:bg-slate-800 text-[#E4E3E0] font-black text-[10px] uppercase tracking-wider border border-[#141414] transition duration-150 cursor-pointer text-center select-none animate-pulse"
                                      >
                                        Approve & Apply Code Patch
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    disabled={isLoading}
                                    onClick={() => handleExecuteStep("composer test && vendor/bin/phpstan analyse", "src/Signup.php")}
                                    className="w-full py-2.5 bg-[#141414] hover:bg-slate-800 text-amber-400 disabled:opacity-50 font-black text-xs uppercase tracking-widest border border-[#141414] transition duration-150 cursor-pointer flex items-center justify-center gap-2 select-none"
                                  >
                                    {isLoading ? (
                                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <Play className="w-3.5 h-3.5 fill-current" />
                                    )}
                                    <span>⚡ Run Unit Test Suite & PHPStan</span>
                                  </button>
                                )}
                              </div>
                            )}

                            {/* STEP 7: Consistency Verify */}
                            {step.index === 6 && (
                              <button
                                disabled={isLoading}
                                onClick={() => handleExecuteStep("vendor/bin/agent-loop recall log-outcome --root infra/doc/agent-learning --draft infra/doc/agent-learning/recall-output/DEMO-1/recall-log.draft.json --by lars", "session_plan/DEMO-1/verification_summary.json")}
                                className="w-full py-2.5 bg-[#141414] hover:bg-slate-800 text-amber-400 disabled:opacity-50 font-black text-xs uppercase tracking-widest border border-[#141414] transition duration-150 cursor-pointer flex items-center justify-center gap-2 select-none animate-pulse"
                              >
                                {isLoading ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Play className="w-3.5 h-3.5 fill-current" />
                                )}
                                <span>⚡ Log Outcomes & Learning Decision</span>
                              </button>
                            )}

                            {/* STEP 8: Report & Close */}
                            {step.index === 7 && (
                              <button
                                disabled={isLoading}
                                onClick={() => handleExecuteStep("vendor/bin/agent-loop verify --strict && vendor/bin/agent-loop workflow close DEMO-1 --status done", "session_plan/DEMO-1/DEMO-1_report.json")}
                                className="w-full py-2.5 bg-[#141414] hover:bg-slate-800 text-amber-400 disabled:opacity-50 font-black text-xs uppercase tracking-widest border border-[#141414] transition duration-150 cursor-pointer flex items-center justify-center gap-2 select-none animate-pulse"
                              >
                                {isLoading ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Play className="w-3.5 h-3.5 fill-current" />
                                )}
                                <span>⚡ Run Verification & Close Session</span>
                              </button>
                            )}

                            {/* STEP 9: Learn Validate */}
                            {step.index === 8 && (
                              <div className="space-y-2">
                                {!hasLearnings ? (
                                  <button
                                    disabled={isLoading}
                                    onClick={() => handleExecuteStep("vendor/bin/agent-loop learn validate --root infra/doc/agent-learning", "infra/doc/agent-learning/findings.json")}
                                    className="w-full py-2.5 bg-[#141414] hover:bg-slate-800 text-amber-400 disabled:opacity-50 font-black text-xs uppercase tracking-widest border border-[#141414] transition duration-150 cursor-pointer flex items-center justify-center gap-2 select-none animate-pulse"
                                  >
                                    {isLoading ? (
                                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <Play className="w-3.5 h-3.5 fill-current" />
                                    )}
                                    <span>⚡ Validate Learning Candidates</span>
                                  </button>
                                ) : (
                                  <div className="p-3 bg-emerald-50 border border-emerald-300 space-y-2 rounded-none font-mono">
                                    <div className="text-[10px] font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1">
                                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>OBSERVATION TRIAGE PORTAL</span>
                                    </div>
                                    <p className="text-[10px] text-slate-700 font-sans leading-normal">
                                      PHPStan strict analysis failures have been compiled into findings under <code>findings.json</code>. Lars triage action:
                                    </p>
                                    <button
                                      disabled={isLoading}
                                      onClick={onPersistFinding}
                                      className="w-full py-1.5 bg-[#141414] hover:bg-slate-800 text-emerald-400 font-black text-[10px] uppercase tracking-wider border border-[#141414] transition duration-150 cursor-pointer text-center select-none"
                                    >
                                      Persist Finding (Validate Findings)
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* STEP 10: Promote Memory */}
                            {step.index === 9 && (
                              <div className="space-y-2">
                                {(!hasMemory || humanReviewStage === "memory_policy" || humanReviewStage === "completed") && (
                                  <>
                                    {!hasMemory ? (
                                      <button
                                        disabled={isLoading}
                                        onClick={() => handleExecuteStep("vendor/bin/agent-loop learn guidance-evaluate --root infra/doc/agent-learning", "infra/doc/agent-learning/proposals/proposal.2026-07-14.001.json")}
                                        className="w-full py-2.5 bg-[#141414] hover:bg-slate-800 text-amber-400 disabled:opacity-50 font-black text-xs uppercase tracking-widest border border-[#141414] transition duration-150 cursor-pointer flex items-center justify-center gap-2 select-none animate-pulse"
                                      >
                                        {isLoading ? (
                                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                          <Play className="w-3.5 h-3.5 fill-current" />
                                        )}
                                        <span>⚡ Evaluate Promotion Guidance</span>
                                      </button>
                                    ) : (
                                      <div className="p-3 bg-indigo-50 border border-indigo-200 space-y-2 rounded-none font-mono">
                                        <div className="text-[10px] font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1">
                                          <History className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                                          <span>CONFIRM PERMANENT RULE PROMOTION</span>
                                        </div>
                                        <p className="text-[10px] text-slate-700 font-sans leading-normal">
                                          Review and confirm memory policy: promote strict PHP typing proposal <code>proposal.2026-07-14.001</code> to permanent global guidelines:
                                        </p>
                                        <button
                                          disabled={isLoading}
                                          onClick={onConfirmPromotions}
                                          className="w-full py-1.5 bg-[#141414] hover:bg-slate-800 text-indigo-400 font-black text-[10px] uppercase tracking-wider border border-[#141414] transition duration-150 cursor-pointer text-center select-none"
                                        >
                                          Approve Guidance Proposal
                                        </button>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            )}

                          </div>
                        </div>
                      )}

                      {/* NON-ACTIVE COMPACT SHORTCUTS */}
                      {!isActive && (
                        <div className="mt-1 flex items-center justify-between gap-2 text-[10px] font-mono opacity-80">
                          <button
                            onClick={() => onSelectFile(step.file)}
                            className={`hover:underline truncate max-w-[150px] ${activeFilePath === step.file ? "text-amber-700 font-bold" : "text-slate-500"}`}
                          >
                            📁 {step.file.split("/").pop()}
                          </button>
                          {isDone && (
                            <button
                              disabled={isLoading}
                              onClick={() => handleExecuteStep(step.cmd, step.file)}
                              className="text-[9px] text-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] px-1.5 py-0.2 border border-slate-300 bg-[#DAD9D6] font-bold uppercase transition duration-150 cursor-pointer"
                              title="Re-run this command on terminal"
                            >
                              Re-run
                            </button>
                          )}
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Loop Complete View */}
            {currentStepIdx === 10 && (
              <div className="border-2 border-emerald-600 bg-emerald-50 p-5 text-center font-mono space-y-3 animate-fade-in">
                <div className="w-12 h-12 bg-emerald-600 text-[#E4E3E0] border border-emerald-700 rounded-full flex items-center justify-center mx-auto text-lg font-black">
                  ✓
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black uppercase text-emerald-950">Governance Cycle Complete!</h3>
                  <p className="text-xs text-slate-700 font-sans max-w-sm mx-auto leading-normal">
                    You have successfully run the entire 10-step sequence, verified implementation contracts, and approved the durable guidance proposal.
                  </p>
                </div>
                <button
                  onClick={onReset}
                  className="px-5 py-2.5 bg-[#141414] hover:bg-slate-800 text-amber-400 font-black text-xs uppercase tracking-widest border border-[#141414] transition duration-150 cursor-pointer select-none"
                >
                  Start New Session
                </button>
              </div>
            )}

          </div>
        )}

        {/* LOOP PHILOSOPHY DETAILS VIEW */}
        {activeTab === "philosophy" && (
          <div className="space-y-4 animate-fade-in text-xs font-sans">
            <div className="flex items-center justify-between border-2 border-[#141414] p-3 bg-[#F0EFEC] font-mono">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#141414] uppercase">
                <BrainCircuit className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>The Governed Loop Philosophy</span>
              </div>
            </div>

            <p className="text-[11.5px] text-[#141414]/90 leading-relaxed font-sans">
              Unlike traditional autonomous setups that dump raw text into a model, <strong>agent-loop</strong> is a local governance protocol and orchestration CLI. It enforces clear hand-offs, versioned brief scopes, and evidence verification gates.
            </p>

            {/* 4 Actors Section */}
            <div className="space-y-2">
              <h4 className="font-mono text-[9.5px] font-black uppercase tracking-widest text-[#141414]/65">Four Distinct Actors</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="border border-[#141414]/20 bg-white p-3 space-y-1">
                  <div className="flex items-center gap-1.5 font-mono text-[10.5px] font-bold text-red-700">
                    <User className="w-3.5 h-3.5" />
                    <span>Human Reviewer</span>
                  </div>
                  <p className="text-[10.5px] text-slate-600 leading-normal">
                    Owns final authority. Selects the task, approves work brief revisions, reviews outcomes, and approves candidate proposals.
                  </p>
                </div>
                <div className="border border-[#141414]/20 bg-white p-3 space-y-1">
                  <div className="flex items-center gap-1.5 font-mono text-[10.5px] font-bold text-indigo-700">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>agent-loop CLI</span>
                  </div>
                  <p className="text-[10.5px] text-slate-600 leading-normal">
                    Manages states, compiles recall, verifies artifact consistency, records approvals, and blocks close gates.
                  </p>
                </div>
                <div className="border border-[#141414]/20 bg-white p-3 space-y-1">
                  <div className="flex items-center gap-1.5 font-mono text-[10.5px] font-bold text-amber-600">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>External Coding Agent</span>
                  </div>
                  <p className="text-[10.5px] text-slate-600 leading-normal">
                    Reads the approved brief and recall context, modifies code, runs checks, and records session outcomes.
                  </p>
                </div>
                <div className="border border-[#141414]/20 bg-white p-3 space-y-1">
                  <div className="flex items-center gap-1.5 font-mono text-[10.5px] font-bold text-emerald-700">
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Repository Project Tools</span>
                  </div>
                  <p className="text-[10.5px] text-slate-600 leading-normal">
                    Standard local checks: <code>PHPUnit</code>, <code>PHPStan</code>, and linters. They run validations separately from the CLI.
                  </p>
                </div>
              </div>
            </div>

            {/* What Commands Do NOT Do Callout */}
            <div className="border-2 border-[#141414] bg-amber-50 p-3.5 space-y-2 font-mono text-[10px]">
              <div className="flex items-center gap-1.5 font-bold uppercase text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>WHAT COMMANDS DO NOT DO</span>
              </div>
              <ul className="space-y-1.5 list-disc pl-4 text-slate-700 font-sans text-[10.5px] leading-normal">
                <li><strong>workflow plan:</strong> does <em>not</em> write production code. It drafts candidate scopes.</li>
                <li><strong>map:</strong> does <em>not</em> compile recall or generate code patches. It maps symbols.</li>
                <li><strong>verify:</strong> does <em>not</em> execute tests (PHPUnit/PHPStan). It checks that artifact evidence is coherent.</li>
                <li><strong>learn validate:</strong> does <em>not</em> automatically scan or discover findings. Humans or external agents submit them.</li>
                <li><strong>guidance-evaluate:</strong> does <em>not</em> modify active guidelines automatically. It evaluates recall outcomes.</li>
                <li><strong>proposal-approve:</strong> does <em>not</em> mean the proposal was applied. Approval is intent; implementation is reality.</li>
              </ul>
            </div>

            {/* Lifecycle State Machines */}
            <div className="space-y-2">
              <h4 className="font-mono text-[9.5px] font-black uppercase tracking-widest text-[#141414]/65">State Model Lifecycles</h4>
              <div className="border border-[#141414]/15 bg-white p-3 space-y-3 font-sans">
                <div className="space-y-1">
                  <span className="font-mono text-[9.5px] font-black uppercase text-indigo-700">Work Brief Lifecycle:</span>
                  <div className="flex flex-wrap items-center gap-1.5 font-mono text-[9.5px] text-slate-500">
                    <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 border">candidate</span>
                    <span>➔</span>
                    <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 border border-emerald-300 font-bold">approved</span>
                    <span>➔</span>
                    <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 border border-amber-300">superseded (on replan)</span>
                  </div>
                </div>
                <div className="space-y-1 border-t pt-2.5">
                  <span className="font-mono text-[9.5px] font-black uppercase text-purple-700">Durable Guidance Lifecycle:</span>
                  <div className="flex flex-wrap items-center gap-1.5 font-mono text-[8.5px] text-slate-500 leading-relaxed">
                    <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 border">finding</span>
                    <span>➔</span>
                    <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 border">validated finding</span>
                    <span>➔</span>
                    <span className="bg-yellow-100 text-yellow-800 px-1.5 py-0.5 border">candidate proposal</span>
                    <span>➔</span>
                    <span className="bg-indigo-100 text-indigo-800 px-1.5 py-0.5 border font-bold">approved proposal</span>
                    <span>➔</span>
                    <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 border">implemented</span>
                    <span>➔</span>
                    <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 border font-bold">validated & applied</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BLOG POST ARTICLE VIEW */}
        {activeTab === "article" && (
          <div className="space-y-5 animate-fade-in text-[#141414] font-sans text-xs bg-white p-5 border border-[#141414]/20 leading-relaxed max-w-full overflow-x-hidden">
            <div className="space-y-1 border-b pb-4 select-text">
              <h1 className="text-sm font-black uppercase tracking-tight leading-snug">
                Stop Giving Coding Agents More Memory.<br />Give Them a Governed Loop.
              </h1>
              <p className="text-[10px] text-[#141414]/65 font-mono uppercase tracking-wider">
                Why coding-agent workflows need explicit scope, versioned approval, selective context, recorded evidence, and intentional forgetting.
              </p>
            </div>

            <div className="space-y-4 select-text font-serif text-[11px] leading-relaxed text-slate-800 max-h-[500px] overflow-y-auto pr-1">
              <p>
                Most coding-agent setups eventually encounter the same problem:
              </p>
              <blockquote className="border-l-4 border-[#141414] pl-3 py-1 font-sans italic text-slate-900 bg-[#F9F8F6] text-[10px] my-3">
                The agent repeats a mistake.
              </blockquote>
              <p>
                So we add memory. More instructions, more summaries, more transcripts, more project knowledge, and more Markdown files with names such as <code>MEMORY_FINAL_v2.md</code>.
              </p>
              <p>
                And somehow the agent still forgets the one project rule that mattered, while confidently remembering a temporary workaround from three weeks ago.
              </p>
              <p>
                The uncomfortable truth is that a larger context window does not automatically produce better context. It mostly gives us more space to paste irrelevant information with impressive formatting. At some point, memory stops being memory. It becomes landfill.
              </p>

              <h4 className="font-mono text-[9px] font-black uppercase tracking-wider text-orange-600 mt-4 block">The problem is not just forgetting</h4>
              <p>
                Coding agents are surprisingly capable at producing code, but they are also surprisingly capable at working on the wrong scope, interpreting a vague requirement creatively, skipping tests, treating a one-off fix as a reusable convention, and recording accidental success as architectural wisdom.
              </p>
              <p>
                A successful patch is not automatically a project convention. And approval for revision 1 is not approval for revision 2.
              </p>

              <h4 className="font-mono text-[9px] font-black uppercase tracking-wider text-orange-600 mt-4 block">What I built</h4>
              <p>
                I created <strong>voku/agent-loop</strong> as a unified CLI around several focused packages and responsibilities: <code>board</code>, <code>workflow</code>, <code>session</code>, <code>recall</code>, <code>map</code>, <code>review</code>, <code>verify</code>, <code>learn</code>, and <code>memory</code>. This is intentionally not one giant agent framework. The goal is to connect small, inspectable tools into a workflow whose state, approvals, evidence, and decisions remain visible.
              </p>

              <blockquote className="border-l-4 border-[#141414] pl-3 py-1.5 font-sans bg-amber-50 border-amber-400 text-slate-800 text-[10px] leading-normal my-3 space-y-1">
                <p className="font-bold uppercase tracking-wider font-mono text-amber-950 text-[9px]">Four actors, not one autonomous machine:</p>
                <p><strong>agent-loop</strong> does not execute the coding agent. It coordinates and verifies the contracts around the work. There are four actors:</p>
                <div className="grid grid-cols-1 gap-1 pt-1 text-[9px] font-mono">
                  <div>• <strong>Human:</strong> selects task, approves scope, reviews durable changes.</div>
                  <div>• <strong>agent-loop:</strong> manages state and checks artifact consistency.</div>
                  <div>• <strong>External Coding Agent:</strong> reads the approved brief and edits code.</div>
                  <div>• <strong>Project Tools:</strong> run PHPUnit, PHPStan, and other validations.</div>
                </div>
              </blockquote>

              <h4 className="font-mono text-[9px] font-black uppercase tracking-wider text-orange-600 mt-4 block">The loop is a sequence of hand-offs</h4>
              <p>
                A simplified workflow looks like this:
              </p>
              <div className="bg-[#141414] text-amber-200 p-3 font-mono text-[9px] border leading-normal space-y-0.5 select-all">
                <div>Human          ➔ selects task</div>
                <div>agent-loop     ➔ creates work brief and compiles recall</div>
                <div>Human          ➔ approves the current brief revision</div>
                <div>External agent ➔ implements the change</div>
                <div>Project tools  ➔ run tests and static analysis</div>
                <div>agent-loop     ➔ verifies evidence and workflow coherence</div>
                <div>Human          ➔ reviews findings and guidance proposals</div>
                <div>External work  ➔ applies approved durable changes</div>
              </div>

              <h4 className="font-mono text-[9px] font-black uppercase tracking-wider text-orange-600 mt-4 block">What commands do not do</h4>
              <div className="bg-[#F0EFEC] p-3 text-slate-800 border border-slate-300 font-mono text-[9px] space-y-1 leading-normal">
                <div>• <strong>workflow plan:</strong> does not write production code</div>
                <div>• <strong>map:</strong> does not compile recall or generate a patch</div>
                <div>• <strong>verify:</strong> does not execute PHPUnit or PHPStan</div>
                <div>• <strong>learn validate:</strong> does not discover findings</div>
                <div>• <strong>guidance-evaluate:</strong> does not modify active guidance automatically</div>
                <div>• <strong>proposal-approve:</strong> does not mean the proposal was applied</div>
              </div>

              <h4 className="font-mono text-[9px] font-black uppercase tracking-wider text-orange-600 mt-4 block">Two Distinct Lifecycle State Machines</h4>
              <p>
                <strong>Work brief lifecycle:</strong> candidate ➔ approved ➔ superseded after re-plan.
              </p>
              <p>
                <strong>Durable guidance lifecycle:</strong> finding ➔ validated finding ➔ candidate proposal ➔ approved proposal ➔ externally implemented ➔ validated ➔ applied.
              </p>

              <h4 className="font-mono text-[9px] font-black uppercase tracking-wider text-orange-600 mt-4 block">Re-planning invalidates approval</h4>
              <p>
                Suppose revision 1 is approved. Then a scope change adds another file. The old approval must no longer authorize the work. This is versioned consent: a changed plan requires a new candidate and a new approval.
              </p>

              <h4 className="font-mono text-[9px] font-black uppercase tracking-wider text-orange-600 mt-4 block">Recall should select, not dump</h4>
              <p>
                Before changing code, the agent does not need every lesson the repository has accumulated. It needs approved, relevant guidance. Concepts are compiled into task-scoped folders: <code>&lt;resolved-recall-root&gt;/&lt;task-id&gt;/</code>.
              </p>

              <h4 className="font-mono text-[9px] font-black uppercase tracking-wider text-orange-600 mt-4 block">Verification is not test execution</h4>
              <p>
                For most developers, <code>verify</code> means running tests. But in <strong>agent-loop</strong>, <code>agent-loop verify</code> does not run PHPUnit or PHPStan. Those commands are executed externally; verify checks that the required evidence and governed artifacts agree.
              </p>

              <h4 className="font-mono text-[9px] font-black uppercase tracking-wider text-orange-600 mt-4 block">Forgetting is part of learning</h4>
              <p>
                A useful learning system must reject, supersede, archive, and forget stale caching assumptions, duplicate rules, and duplicate guidelines. If everything becomes memory, memory becomes landfill.
              </p>

              <p className="font-sans font-bold text-slate-900 border-t pt-2 mt-4 text-[10.5px]">
                The future of coding agents is not just larger context windows. It is the boring future of clear tasks, explicit scope, revisioned approval, temporary working memory, selective recall, external validation, and intentional forgetting.
              </p>
            </div>
          </div>
        )}

        {/* SPECIFICATION BRIEF DETAILED VIEW */}
        {activeTab === "brief" && (
          <div className="space-y-4 animate-fade-in font-mono text-xs">
            <div className="flex items-center justify-between bg-[#F0EFEC] border border-[#141414] p-3">
              <div className="flex items-center gap-1.5 text-[11px] uppercase font-bold text-[#141414]">
                <FileText className="w-4 h-4 text-slate-700" />
                <span>SPECIFICATION BRIEF: DEMO-1</span>
              </div>
              <div className="text-[9.5px] text-slate-500">
                REV: {briefRevision} | STATUS: <span className={`font-bold ${briefStatus === "approved" ? "text-emerald-700" : "text-amber-600"}`}>{briefStatus.toUpperCase()}</span>
              </div>
            </div>

            {isReplanned && (
              <div className="bg-amber-50 border-l-4 border-amber-500 p-3 text-[11px] text-amber-950 space-y-1 leading-normal font-sans">
                <div className="font-bold uppercase tracking-wider flex items-center gap-1 font-mono">
                  <History className="w-3.5 h-3.5 text-amber-600" />
                  <span>Re-planned Contract Brief Detected</span>
                </div>
                <p>
                  Initial revision was invalidated. Revised goals enforced full static testing (<b>PHPStan level 5</b>) alongside standard unit suites.
                </p>
              </div>
            )}

            <div className="border border-[#141414]/20 bg-white p-4 space-y-4 font-sans text-xs">
              <div className="flex items-center justify-between border-b pb-2 font-mono text-[10px] font-bold text-slate-400">
                <span>SPECIFICATION SPEC SHEET</span>
                <span>ID: DEMO-1</span>
              </div>

              <div className="space-y-3">
                <div className="p-2.5 bg-[#F9F8F6] border border-[#141414]/10 space-y-1">
                  <div className="font-mono text-[9px] font-bold text-orange-600 uppercase tracking-wider">🎯 Goal</div>
                  <p className="text-[#141414]/90 font-medium">
                    {briefRevision === 2 
                      ? "Add secure validation guards to App\\Signup (strict email structures & minimum lengths) fully passing PHPStan Level 5."
                      : "Add secure validation guards to App\\Signup (validating email strings and password lengths)."}
                  </p>
                </div>

                <div className="p-2.5 bg-[#F9F8F6] border border-[#141414]/10 space-y-1">
                  <div className="font-mono text-[9px] font-bold text-blue-600 uppercase tracking-wider">📚 Context</div>
                  <p className="text-[#141414]/90">
                    PHP 8.2 backend, existing registration pipelines, un-typed parameters causing failures in testing checks.
                  </p>
                </div>

                <div className="p-2.5 bg-[#F9F8F6] border border-[#141414]/10 space-y-1">
                  <div className="font-mono text-[9px] font-bold text-emerald-600 uppercase tracking-wider">✨ Expected Output</div>
                  <p className="text-[#141414]/90">
                    Proper registration returns, clean error logs, strict signatures, and consistent response formatting.
                  </p>
                </div>

                <div className="p-2.5 bg-[#F9F8F6] border border-[#141414]/10 space-y-1">
                  <div className="font-mono text-[9px] font-bold text-purple-600 uppercase tracking-wider">🛡️ Scope Boundary</div>
                  <div className="text-[11px] text-slate-600 space-y-0.5">
                    <div><b>In Scope:</b> <code>src/Signup.php</code> and unit testing only</div>
                    <div><b>Out of Scope:</b> Secondary databases, JS web integrations</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RECALL GUIDELINES VIEW */}
        {activeTab === "recall" && (
          <div className="space-y-4 animate-fade-in font-mono text-xs">
            <div className="flex items-center justify-between border border-[#141414] p-3 bg-[#F0EFEC]">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#141414] uppercase">
                <Map className="w-4 h-4 text-emerald-700" />
                <span>RESOLVED GUIDELINES & SYMBOL MAPS</span>
              </div>
            </div>

            <p className="text-xs text-slate-800 font-sans leading-relaxed">
              Prior to execution, approved recall root rules compile matching guidelines against usefulness criteria, filtering out garbage credentials or legacy methods.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* outcomes.json */}
              <div className="border border-[#141414]/20 bg-white p-3.5 space-y-2.5">
                <div className="border-b pb-1 flex justify-between items-center text-[10px] font-bold uppercase">
                  <span>outcomes.json</span>
                  <span className="text-slate-400">Triaged Guidelines</span>
                </div>

                <div className="space-y-2 text-[10px]">
                  <div className="p-2 bg-emerald-50 border border-emerald-200">
                    <div className="font-bold text-emerald-950 flex justify-between">
                      <span>Strict Types Rule</span>
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-400 px-1 text-[8px] font-bold">HELPFUL</span>
                    </div>
                    <p className="text-slate-500 font-sans text-[9.5px] mt-0.5">Enforces strict PHP typechecks.</p>
                  </div>

                  <div className="p-2 bg-yellow-50 border border-yellow-200">
                    <div className="font-bold text-yellow-950 flex justify-between">
                      <span>Legacy Regex Filter</span>
                      <span className="bg-yellow-100 text-yellow-800 border border-yellow-400 px-1 text-[8px] font-bold">NOT_USED</span>
                    </div>
                    <p className="text-slate-500 font-sans text-[9.5px] mt-0.5">Superseded by robust filter_var helper.</p>
                  </div>
                </div>
              </div>

              {/* codebase_map.json */}
              <div className="border border-[#141414]/20 bg-white p-3.5 space-y-2.5">
                <div className="border-b pb-1 flex justify-between items-center text-[10px] font-bold uppercase">
                  <span>codebase_map.json</span>
                  <span className="text-slate-400">Class AST Symbols</span>
                </div>

                <div className="space-y-2 text-[10px]">
                  <div className="p-2 bg-[#F9F8F6] border border-[#141414]/10 space-y-1">
                    <span className="font-bold text-indigo-700">Class App\\Signup</span>
                    <div className="text-[9px] pl-2 text-slate-500 font-mono">
                      • register(array $data): bool<br />
                      • getErrors(): array
                    </div>
                  </div>

                  <div className="p-2 bg-[#F9F8F6] border border-[#141414]/10 space-y-1">
                    <span className="font-bold text-slate-700">Test Class App\\Test\\SignupTest</span>
                    <div className="text-[9px] pl-2 text-slate-500 font-mono">
                      • testRegisterWithValidDetails()<br />
                      • testRegisterWithShortPassword()
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ACTIVE FINDINGS VIEW */}
        {activeTab === "learn" && (
          <div className="space-y-4 animate-fade-in font-mono text-xs">
            <div className="flex items-center justify-between border border-[#141414] p-3 bg-[#F0EFEC]">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#141414] uppercase">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>FINDINGS JOURNAL (findings.json)</span>
              </div>
            </div>

            <p className="text-xs text-slate-800 font-sans leading-relaxed">
              Failed static diagnostics are triaged to <code>findings.json</code>, detailing the code discrepancy, the proposed repair action, and resulting repository rules.
            </p>

            <div className="border border-[#141414]/20 bg-white p-4 space-y-3 font-sans">
              <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Active Record Sheet:</span>
              
              <div className="bg-[#141414] text-amber-200 p-4 space-y-2.5 text-[11px] font-mono leading-relaxed border border-[#141414]">
                <div><span className="text-slate-400 uppercase font-black font-mono">ID:</span> OBS-001 | <span className="text-slate-400 uppercase font-black">Target:</span> App\\Signup</div>
                <div className="text-slate-100"><span className="text-slate-400 font-bold uppercase block text-[9.5px] mt-1 text-slate-400">Observation:</span> PHPStan statically failed due to untyped register() parameters and missing declare constraints.</div>
                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[9.5px] text-slate-400">Proposal Action:</span>
                  <span className="mt-1 bg-amber-950 text-amber-300 border border-amber-500 text-[8.5px] px-1.5 py-0.2 select-none font-bold inline-block">REPLACE</span>
                  <p className="text-slate-300 font-sans text-[10.5px] mt-1">Inject strict signatures and filter_var email assertions across registering pipelines.</p>
                </div>
                <div className="text-emerald-400 font-bold"><span className="text-slate-400 font-bold uppercase text-[9.5px] text-slate-400 block mt-1">Resulting Rule:</span> Any modified php modules must declare strict types.</div>
              </div>
            </div>
          </div>
        )}

        {/* DURABLE MEMORY POLICY VIEW */}
        {activeTab === "memory" && (
          <div className="space-y-4 animate-fade-in font-mono text-xs">
            <div className="flex items-center justify-between border border-[#141414] p-3 bg-[#F0EFEC]">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#141414] uppercase">
                <History className="w-4 h-4 text-indigo-700" />
                <span>DURABLE PROMOTION POLICY</span>
              </div>
            </div>

            <p className="text-xs text-slate-800 font-sans leading-relaxed">
              Valid constraints are promoted as persistent rules for future agent runs, whereas deprecated MySQL caching or redundant code rules are forgotten and archived.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Promoted policies */}
              <div className="border border-[#141414]/20 bg-white p-3.5 space-y-2">
                <span className="text-[10px] font-bold text-emerald-800 uppercase flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Promoted Policies</span>
                </span>
                <div className="p-2.5 bg-emerald-50 border border-emerald-200">
                  <span className="font-bold text-emerald-950 text-[10px]">Strict Typing Assertion Rule</span>
                  <p className="text-slate-500 font-sans text-[9.5px] mt-1 leading-normal">
                    Successfully loaded inside <code>global-recall/rules/php_strict.json</code>. Enforced permanently.
                  </p>
                </div>
              </div>

              {/* Forgotten outcomes */}
              <div className="border border-[#141414]/20 bg-white p-3.5 space-y-2">
                <span className="text-[10px] font-bold text-slate-600 uppercase flex items-center gap-1">
                  <Trash2 className="w-4 h-4 text-slate-500" />
                  <span>Forgotten & Archived Outcomes</span>
                </span>
                <div className="p-2.5 bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 text-[10px]">OBS-002: MySQL Caching Guidelines</span>
                  <p className="text-slate-500 font-sans text-[9.5px] mt-1 leading-normal">
                    Archived due to deprecation. Purged from the global recall directory list.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Footer bar */}
      <div className="p-3 bg-[#F0EFEC] border-t-2 border-[#141414] flex flex-row items-center justify-between text-[9px] text-[#141414]/60 font-mono tracking-wider shrink-0 uppercase select-none">
        <div>INTEGRATED STEPS ENGINE ACTIVE</div>
        <div className="flex items-center gap-1 font-bold text-[#141414]">
          <span>© ACME GOVERNANCE CORE</span>
        </div>
      </div>

    </div>
  );
}
