import React, { useState, useMemo } from "react";
import {
  Check,
  AlertCircle,
  Clock,
  ArrowRight,
  Shield,
  FileCode,
  Terminal,
  Cpu,
  User,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Info,
  Layers,
  ChevronRight,
  Copy,
  Lock,
  Unlock,
  Package,
  FileCheck,
  Zap,
  HelpCircle,
  X
} from "lucide-react";
import {
  ScenarioDefinition,
  ScenarioStep,
  ScenarioId,
  Actor,
  OwnerPackage,
  EvidenceReceipt
} from "../types";
import { SCENARIOS, resolveScenario } from "../scenariosData";
import { AgentLoopLogo, AgentLoopMark } from "./AgentLoopLogo";

interface LifecycleSimulatorProps {
  initialScenarioId?: ScenarioId;
  onBackToDocs: () => void;
  onOpenBrandSpec: () => void;
}

export function LifecycleSimulator({
  initialScenarioId,
  onBackToDocs,
  onOpenBrandSpec
}: LifecycleSimulatorProps) {
  const [activeScenarioId, setActiveScenarioId] = useState<ScenarioId>(
    initialScenarioId ? resolveScenario(initialScenarioId).id : "scenario_a"
  );
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [selectedReceipt, setSelectedReceipt] = useState<EvidenceReceipt | null>(null);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const currentScenario: ScenarioDefinition = useMemo(
    () => resolveScenario(activeScenarioId),
    [activeScenarioId]
  );

  const currentStep: ScenarioStep =
    currentScenario.steps[stepIndex] ?? currentScenario.steps[0];
  const isLastStep = stepIndex >= currentScenario.steps.length - 1;

  const handleSelectScenario = (id: ScenarioId) => {
    setActiveScenarioId(id);
    setStepIndex(0);
    setSelectedReceipt(null);
  };

  const handleNextStep = () => {
    if (isLastStep) {
      setStepIndex(0);
    } else {
      setStepIndex((prev) => Math.min(prev + 1, currentScenario.steps.length - 1));
    }
  };

  const handlePrevStep = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    setStepIndex(0);
    setSelectedReceipt(null);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 1800);
  };

  // Actor styling helpers
  const getActorBadge = (actor: Actor) => {
    switch (actor) {
      case "human":
        return {
          label: "HUMAN DECISION",
          bg: "bg-purple-100 text-purple-900 border-purple-300",
          dot: "bg-purple-600",
          icon: <User className="w-3.5 h-3.5" />,
          desc: "Authority-bearing human decision required"
        };
      case "host":
        return {
          label: "HOST WORK",
          bg: "bg-blue-100 text-blue-900 border-blue-300",
          dot: "bg-blue-600",
          icon: <FileCode className="w-3.5 h-3.5" />,
          desc: "Coding host mutates authorized files"
        };
      case "owner":
        return {
          label: "OWNER TOOL / COMMAND",
          bg: "bg-emerald-100 text-emerald-900 border-emerald-300",
          dot: "bg-emerald-600",
          icon: <Terminal className="w-3.5 h-3.5" />,
          desc: "Deterministic command / evidence producer"
        };
      case "kernel":
        return {
          label: "KERNEL EVALUATION",
          bg: "bg-slate-100 text-slate-800 border-slate-300",
          dot: "bg-slate-600",
          icon: <Cpu className="w-3.5 h-3.5" />,
          desc: "Lifecycle evaluation sealed"
        };
    }
  };

  const actorBadge = getActorBadge(currentStep.availableAction.actor);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* SIMULATOR TOP HEADER */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-xs sticky top-0 z-30 px-4 md:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToDocs}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-bold uppercase rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              ← Back to Docs
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <AgentLoopMark className="w-6 h-3 shrink-0" idPrefix="sim-mark" />
              <span className="font-mono text-base font-black uppercase tracking-tight">
                Lifecycle Simulator
              </span>
              <span className="hidden sm:inline-block bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Host Contract Walkthrough
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsOwnerModalOpen(true)}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-mono text-xs font-bold uppercase rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Inspect package ownership boundaries"
            >
              <Package className="w-3.5 h-3.5 text-blue-600" />
              <span>Owner Model</span>
            </button>

            <button
              onClick={handleReset}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-mono text-xs font-bold uppercase rounded-lg shadow-2xs flex items-center gap-1 cursor-pointer transition-colors"
              title="Reset current scenario"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <div className="border border-slate-200 bg-slate-50 rounded-lg px-3 py-1.5 font-mono text-xs font-bold text-slate-700 uppercase">
              Turn {stepIndex + 1} of {currentScenario.steps.length}
            </div>
          </div>
        </div>
      </header>

      {/* CORE INTENT BANNER */}
      <div className="bg-slate-900 text-white px-4 md:px-8 py-3 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 uppercase rounded">
              LIFECYCLE PRINCIPLE
            </span>
            <span className="text-slate-300">
              enter → obey current action → work when authorized → finish → complete
            </span>
          </div>
          <span className="text-slate-400 text-[11px]">
            Simulates the governed environment, not the AI model.
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 flex-1">
        {/* SCENARIO SELECTOR */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-mono text-xs font-bold uppercase text-slate-600 flex items-center gap-2">
              <span>Select Lifecycle Scenario (A–J)</span>
              <span className="text-slate-400 font-normal">|</span>
              <span className="text-slate-500 font-normal text-[11px]">
                Each scenario demonstrates why the canonical next_action changes
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1.5">
            {SCENARIOS.map((sc) => {
              const isSelected = sc.id === activeScenarioId;
              return (
                <button
                  key={sc.id}
                  onClick={() => handleSelectScenario(sc.id)}
                  className={`p-2 text-left border rounded-lg font-mono transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-500/20"
                      : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {sc.letter}
                    </span>
                    <span
                      className={`text-[9px] ${
                        isSelected ? "text-blue-100" : "text-slate-400"
                      }`}
                    >
                      {sc.steps.length}t
                    </span>
                  </div>
                  <div className="font-bold text-[11px] leading-tight truncate">
                    {sc.name}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ACTIVE SCENARIO CARD */}
        <div className="border border-slate-200 bg-white rounded-xl p-4 md:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-slate-900 text-white font-mono text-xs font-bold px-2 py-0.5 uppercase rounded">
                Scenario {currentScenario.letter}
              </span>
              <h2 className="font-mono text-base md:text-lg font-black uppercase text-slate-900">
                {currentScenario.name}
              </h2>
            </div>
            <p className="text-xs md:text-sm text-slate-600">{currentScenario.tagline}</p>
            <p className="text-xs text-blue-700 font-mono font-medium">
              Takeaway: {currentScenario.takeaway}
            </p>
          </div>

          {/* Stepper pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {currentScenario.steps.map((st, idx) => {
              const isPast = idx < stepIndex;
              const isCurr = idx === stepIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setStepIndex(idx)}
                  className={`flex items-center gap-1 px-2 py-1 text-xs font-mono border rounded transition-colors cursor-pointer ${
                    isCurr
                      ? "bg-blue-600 text-white border-blue-600 font-bold"
                      : isPast
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold"
                      : "bg-slate-50 text-slate-500 border-slate-200"
                  }`}
                >
                  <span>{idx + 1}</span>
                  {isPast && <Check className="w-3 h-3 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* THE THREE PERSISTENT PANES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* =============================================================== */}
          {/* PANE 1: AUTHORITATIVE STATE (4 COLS)                           */}
          {/* =============================================================== */}
          <section className="lg:col-span-4 border border-slate-200 bg-white rounded-xl shadow-xs overflow-hidden flex flex-col">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black uppercase text-slate-800">
                  1. Current Governed State
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">
                Owner-Backed Facts
              </span>
            </div>

            <div className="p-4 space-y-4 font-mono text-xs">
              {/* TASK */}
              <div className="border border-slate-100 bg-slate-50/70 p-3 rounded-lg space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">
                    Task
                  </span>
                  <span className="bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded text-[9px]">
                    owner: {currentStep.beforeState.task.owner}
                  </span>
                </div>
                <div className="text-slate-900 font-bold">
                  {currentStep.beforeState.task.id}
                </div>
                <div className="text-[11px] text-slate-600 font-sans">
                  {currentStep.beforeState.task.goal}
                </div>
              </div>

              {/* CONTRACT */}
              <div className="border border-slate-100 bg-slate-50/70 p-3 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">
                    Contract
                  </span>
                  <span className="bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded text-[9px]">
                    owner: {currentStep.beforeState.contract.owner}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400">revision: </span>
                    <span className="font-bold text-slate-800">
                      {currentStep.beforeState.contract.revision > 0
                        ? `r${currentStep.beforeState.contract.revision}`
                        : "none"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">status: </span>
                    <span
                      className={`font-bold uppercase ${
                        currentStep.beforeState.contract.status === "approved"
                          ? "text-emerald-700"
                          : currentStep.beforeState.contract.status === "candidate"
                          ? "text-purple-700"
                          : "text-slate-500"
                      }`}
                    >
                      {currentStep.beforeState.contract.status}
                    </span>
                  </div>
                </div>

                <div className="text-[11px]">
                  <span className="text-slate-400">mutation scope: </span>
                  {currentStep.beforeState.contract.scope.length > 0 ? (
                    <span className="text-slate-800 font-bold">
                      {currentStep.beforeState.contract.scope.join(", ")}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">none (unplanned)</span>
                  )}
                </div>

                <div className="text-[11px]">
                  <span className="text-slate-400">validation: </span>
                  <span className="text-slate-700">
                    {currentStep.beforeState.contract.validation}
                  </span>
                </div>
              </div>

              {/* RUN */}
              <div className="border border-slate-100 bg-slate-50/70 p-3 rounded-lg flex items-center justify-between">
                <span className="font-bold text-slate-500 uppercase text-[10px]">
                  Run Status
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold uppercase px-2 py-0.5 rounded text-[10px] ${
                      currentStep.beforeState.run.status === "active"
                        ? "bg-blue-100 text-blue-800"
                        : currentStep.beforeState.run.status === "completed"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {currentStep.beforeState.run.status}
                  </span>
                  <span className="text-slate-400 text-[9px]">
                    owner: {currentStep.beforeState.run.owner}
                  </span>
                </div>
              </div>

              {/* SESSION / VALIDATION */}
              <div className="border border-slate-100 bg-slate-50/70 p-3 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">
                    Validation Session
                  </span>
                  <span className="bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded text-[9px]">
                    owner: {currentStep.beforeState.session.owner}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">evidence:</span>
                  <span
                    className={`font-bold uppercase px-2 py-0.5 rounded text-[10px] ${
                      currentStep.beforeState.session.validation === "recorded_passed"
                        ? "bg-emerald-100 text-emerald-800"
                        : currentStep.beforeState.session.validation === "recorded_failed"
                        ? "bg-rose-100 text-rose-800"
                        : currentStep.beforeState.session.validation === "stale"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {currentStep.beforeState.session.validation}
                  </span>
                </div>
                {currentStep.beforeState.session.treeId && (
                  <div className="text-[11px] text-slate-500">
                    tree identity:{" "}
                    <code className="bg-white px-1 py-0.5 border border-slate-200 rounded font-bold text-slate-800">
                      {currentStep.beforeState.session.treeId}
                    </code>
                  </div>
                )}
              </div>

              {/* RECALL, REVIEW, LEARNING ROWS */}
              <div className="border border-slate-100 bg-slate-50/70 p-3 rounded-lg space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">
                    Recall
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-800 font-bold">
                      {currentStep.beforeState.recall.status}
                    </span>
                    <span className="text-slate-400 text-[9px]">
                      (agent-recall-compiler)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200/60 pt-1.5">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">
                    Review
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-800 font-bold">
                      {currentStep.beforeState.review.status}
                    </span>
                    <span className="text-slate-400 text-[9px]">
                      (agent-recall-compiler)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200/60 pt-1.5">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">
                    Learning
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-800 font-bold">
                      {currentStep.beforeState.learning.status}
                    </span>
                    <span className="text-slate-400 text-[9px]">(agent-learning)</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =============================================================== */}
          {/* PANE 2: KERNEL RESULT (4 COLS)                                 */}
          {/* =============================================================== */}
          <section className="lg:col-span-4 border border-slate-200 bg-white rounded-xl shadow-xs overflow-hidden flex flex-col">
            <div className="px-4 py-3 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-mono text-xs font-black uppercase tracking-wide">
                  2. Kernel Projection
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                Evaluated Result
              </span>
            </div>

            <div className="p-4 space-y-4">
              {/* Invocation tag */}
              <div className="bg-slate-100 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between text-xs font-mono text-slate-700">
                <span className="truncate">{currentStep.invocation}</span>
                <button
                  onClick={() => handleCopy(currentStep.invocation)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                  title="Copy invocation"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Status Badges */}
              <div className="grid grid-cols-2 gap-2">
                <div
                  className={`border p-2.5 rounded-lg flex items-center gap-2 font-mono text-xs ${
                    currentStep.lifecycleResult.mutationReady
                      ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  {currentStep.lifecycleResult.mutationReady ? (
                    <Unlock className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <div>
                    <div className="text-[9px] uppercase font-bold text-slate-500">
                      mutation_ready
                    </div>
                    <div className="font-bold">
                      {currentStep.lifecycleResult.mutationReady ? "true" : "false"}
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 bg-slate-50 p-2.5 rounded-lg font-mono text-xs">
                  <div className="text-[9px] uppercase font-bold text-slate-500">
                    next_action_kind
                  </div>
                  <div className="font-bold text-blue-700 truncate">
                    {currentStep.lifecycleResult.nextActionKind}
                  </div>
                </div>
              </div>

              {/* Canonical JSON block */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono font-bold uppercase text-slate-500 flex items-center justify-between">
                  <span>Canonical JSON Output</span>
                  <span className="text-slate-400 font-normal">Machine Contract</span>
                </div>
                <pre className="bg-[#0f172a] text-slate-200 p-3 rounded-lg text-[11px] font-mono overflow-x-auto leading-relaxed border border-slate-800">
                  {JSON.stringify(
                    {
                      mutation_ready: currentStep.lifecycleResult.mutationReady,
                      next_action_kind: currentStep.lifecycleResult.nextActionKind,
                      next_action: currentStep.lifecycleResult.nextAction,
                      references: currentStep.lifecycleResult.references
                    },
                    null,
                    2
                  )}
                </pre>
              </div>

              {/* Plain English Projection */}
              <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-blue-900 font-mono text-[10px] font-bold uppercase">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  <span>Human Projection (Prose)</span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed">
                  {currentStep.explanation}
                </p>
                {currentStep.ruleHighlight && (
                  <div className="pt-1.5 border-t border-blue-100 text-[11px] text-blue-800 font-mono">
                    <strong>Rule:</strong> {currentStep.ruleHighlight}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* =============================================================== */}
          {/* PANE 3: AVAILABLE ACTION (4 COLS)                              */}
          {/* =============================================================== */}
          <section className="lg:col-span-4 border border-slate-200 bg-white rounded-xl shadow-xs overflow-hidden flex flex-col">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black uppercase text-slate-800">
                  3. Available Action
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">
                One Canonical Step
              </span>
            </div>

            <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                {/* ACTOR BADGE */}
                <div
                  className={`border rounded-lg p-3 flex items-start gap-3 ${actorBadge.bg}`}
                >
                  <div className="p-1.5 bg-white rounded-md shadow-2xs text-slate-800">
                    {actorBadge.icon}
                  </div>
                  <div>
                    <div className="font-mono text-xs font-black uppercase tracking-wide">
                      {actorBadge.label}
                    </div>
                    <div className="text-[11px] font-sans opacity-90">
                      {actorBadge.desc}
                    </div>
                  </div>
                </div>

                {/* ACTION CARD */}
                <div className="border border-slate-200 rounded-lg p-3.5 space-y-2 bg-slate-50/50">
                  <div className="font-mono text-xs font-bold uppercase text-slate-900">
                    {currentStep.availableAction.title}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {currentStep.availableAction.description}
                  </p>

                  {/* Concrete Details */}
                  {currentStep.availableAction.commandStr && (
                    <div className="space-y-1 pt-1">
                      <div className="text-[10px] font-mono font-bold uppercase text-slate-400">
                        Command:
                      </div>
                      <div className="bg-slate-900 text-slate-200 p-2 rounded text-[11px] font-mono flex items-center justify-between">
                        <code className="truncate">
                          {currentStep.availableAction.commandStr}
                        </code>
                        <button
                          onClick={() => handleCopy(currentStep.availableAction.commandStr!)}
                          className="text-slate-400 hover:text-white p-1 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {currentStep.availableAction.details?.mutationBoundary && (
                    <div className="pt-1">
                      <div className="text-[10px] font-mono font-bold uppercase text-slate-400">
                        Approved Boundary:
                      </div>
                      <div className="font-mono text-xs font-bold text-slate-800">
                        {currentStep.availableAction.details.mutationBoundary.join(", ")}
                      </div>
                    </div>
                  )}

                  {currentStep.availableAction.details?.modifiedFiles && (
                    <div className="pt-1">
                      <div className="text-[10px] font-mono font-bold uppercase text-slate-400">
                        Modified Files:
                      </div>
                      <div className="font-mono text-xs font-bold text-blue-700">
                        {currentStep.availableAction.details.modifiedFiles.join(", ")}
                      </div>
                    </div>
                  )}

                  {currentStep.availableAction.details?.warningNote && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-900 p-2 rounded text-[11px] font-sans">
                      ⚠️ {currentStep.availableAction.details.warningNote}
                    </div>
                  )}
                </div>
              </div>

              {/* EXECUTION BUTTON */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <button
                  onClick={handleNextStep}
                  className={`w-full py-3 px-4 rounded-xl font-mono text-xs font-black uppercase flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs ${
                    currentStep.availableAction.actor === "human"
                      ? "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20"
                      : currentStep.availableAction.actor === "host"
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
                      : currentStep.availableAction.actor === "owner"
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  <span>{currentStep.availableAction.buttonLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <button
                    onClick={handlePrevStep}
                    disabled={stepIndex === 0}
                    className="hover:text-slate-800 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                  >
                    ← Previous Turn
                  </button>
                  <span>
                    {isLastStep ? "Final Turn" : "Advances Lifecycle State"}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* EVIDENCE TIMELINE (BOTTOM VISUALIZATION) */}
        <section className="border border-slate-200 bg-white rounded-xl p-4 md:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-600" />
              <span className="font-mono text-xs font-black uppercase text-slate-900">
                Evidence Timeline &amp; Receipts
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Evidence belongs to an immutable implementation tree, not a fuzzy session
            </span>
          </div>

          {currentStep.evidenceTimeline.length === 0 ? (
            <div className="py-6 text-center text-xs font-mono text-slate-400 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
              No validation receipts recorded yet. Run validation commands to generate
              owner-backed evidence.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {currentStep.evidenceTimeline.map((receipt) => {
                const isSelected = selectedReceipt?.receiptNumber === receipt.receiptNumber;
                return (
                  <button
                    key={receipt.receiptNumber}
                    onClick={() => setSelectedReceipt(receipt)}
                    className={`p-3 text-left border rounded-lg font-mono text-xs transition-all cursor-pointer ${
                      receipt.status === "valid"
                        ? "bg-emerald-50/60 border-emerald-200 hover:border-emerald-400"
                        : receipt.status === "stale"
                        ? "bg-amber-50/60 border-amber-200 hover:border-amber-400"
                        : "bg-rose-50/60 border-rose-200 hover:border-rose-400"
                    } ${isSelected ? "ring-2 ring-blue-500" : ""}`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold uppercase text-[10px] text-slate-600">
                        Receipt #{receipt.receiptNumber}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          receipt.status === "valid"
                            ? "bg-emerald-200 text-emerald-900"
                            : receipt.status === "stale"
                            ? "bg-amber-200 text-amber-900"
                            : "bg-rose-200 text-rose-900"
                        }`}
                      >
                        {receipt.status}
                      </span>
                    </div>

                    <div className="font-bold text-slate-900 truncate">
                      {receipt.command}
                    </div>

                    <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                      <span>tree: {receipt.implementationTree}</span>
                      <span>exit: {receipt.exitCode}</span>
                    </div>

                    <div className="text-[9px] text-slate-400 mt-1">
                      owner: {receipt.producedBy}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* SELECTED RECEIPT INSPECTOR MODAL */}
        {selectedReceipt && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-lg w-full p-5 space-y-4 shadow-xl border border-slate-200 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  <span className="font-black uppercase text-sm">
                    Evidence Receipt #{selectedReceipt.receiptNumber}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400">Contract Revision: </span>
                    <span className="font-bold text-slate-900">
                      r{selectedReceipt.contractRevision}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Status: </span>
                    <span className="font-bold uppercase text-slate-900">
                      {selectedReceipt.status}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400">Implementation Tree: </span>
                  <code className="font-bold text-blue-700">
                    {selectedReceipt.implementationTree}
                  </code>
                </div>

                <div>
                  <span className="text-slate-400">Command: </span>
                  <code className="font-bold text-slate-900">
                    {selectedReceipt.command}
                  </code>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400">Exit Code: </span>
                    <span className="font-bold text-slate-900">
                      {selectedReceipt.exitCode}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Produced By: </span>
                    <span className="font-bold text-slate-900">
                      {selectedReceipt.producedBy}
                    </span>
                  </div>
                </div>

                {selectedReceipt.note && (
                  <div className="pt-2 border-t border-slate-200 text-slate-700 font-sans text-[11px]">
                    <strong>Note:</strong> {selectedReceipt.note}
                  </div>
                )}
              </div>

              <div className="text-slate-500 text-[11px] font-sans">
                Evidence identity guarantees that code cannot be certified by tests run
                against an outdated git commit.
              </div>

              <button
                onClick={() => setSelectedReceipt(null)}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase rounded-lg cursor-pointer"
              >
                Close Receipt
              </button>
            </div>
          </div>
        )}

        {/* OWNER ARCHITECTURE MODEL MODAL */}
        {isOwnerModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-xl border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  <h3 className="font-mono text-base font-black uppercase text-slate-900">
                    Package Ownership Model
                  </h3>
                </div>
                <button
                  onClick={() => setIsOwnerModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                In <code className="font-mono font-bold">agent-loop</code>, state facts
                are never anonymous strings. Every field in the governed state is owned
                by a dedicated, single-responsibility tool:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                <div className="border border-slate-200 p-3 rounded-lg space-y-1 bg-slate-50">
                  <div className="font-bold text-blue-700">agent-loop</div>
                  <div className="text-[11px] text-slate-500">Role: Lifecycle Authority</div>
                  <p className="text-[11px] text-slate-700 font-sans">
                    Emits canonical next_action, validates mutation scope, and enforces
                    Contract revisions.
                  </p>
                </div>

                <div className="border border-slate-200 p-3 rounded-lg space-y-1 bg-slate-50">
                  <div className="font-bold text-emerald-700">agent-session</div>
                  <div className="text-[11px] text-slate-500">Role: Validation Evidence</div>
                  <p className="text-[11px] text-slate-700 font-sans">
                    Executes test commands, captures exit codes, and binds receipts to
                    exact git tree hashes.
                  </p>
                </div>

                <div className="border border-slate-200 p-3 rounded-lg space-y-1 bg-slate-50">
                  <div className="font-bold text-purple-700">agent-recall-compiler</div>
                  <div className="text-[11px] text-slate-500">Role: Bounded Review</div>
                  <p className="text-[11px] text-slate-700 font-sans">
                    Compiles architectural recall guidance and produces deterministic
                    review evidence.
                  </p>
                </div>

                <div className="border border-slate-200 p-3 rounded-lg space-y-1 bg-slate-50">
                  <div className="font-bold text-indigo-700">agent-learning</div>
                  <div className="text-[11px] text-slate-500">Role: Findings Ledger</div>
                  <p className="text-[11px] text-slate-700 font-sans">
                    Maintains candidate findings and requires corroboration before
                    promoting durable rules.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-xs text-blue-950 font-sans">
                <strong>Why this matters:</strong> The simulator does not simulate a
                magical AI. It simulates the governed boundaries that keep any model
                (Claude, Cursor, Copilot) strictly contained and provable.
              </div>

              <button
                onClick={() => setIsOwnerModalOpen(false)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase rounded-lg cursor-pointer"
              >
                Close Ownership Model
              </button>
            </div>
          </div>
        )}
      </main>

      {/* SIMULATOR FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-3.5 px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-500">
        <div className="flex items-center gap-2">
          <AgentLoopLogo size={18} variant="dark" />
          <span className="text-[11px]">Governed workflow simulation kernel</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <a
            href="https://github.com/voku/agent-loop"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-800 transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://packagist.org/packages/voku/agent-loop"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-800 transition-colors"
          >
            Packagist
          </a>
          <button
            onClick={onOpenBrandSpec}
            className="hover:text-slate-800 transition-colors cursor-pointer"
          >
            Brand Spec
          </button>
        </div>
      </footer>
    </div>
  );
}
