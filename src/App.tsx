/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import AgentMonitor from "./components/AgentMonitor";
import Terminal from "./components/Terminal";
import FileSystem from "./components/FileSystem";
import { VirtualFile, TerminalLine } from "./types";
import {
  getInitialFiles,
  getBoardFiles,
  getSessionFiles,
  getRecallFiles,
  getWorkDoneFiles,
  getLearningApprovedFiles
} from "./data/virtualWorkspace";
import {
  Terminal as TermIcon,
  Play,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  User,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  BookOpen,
  Sparkles,
  Award
} from "lucide-react";

export default function App() {
  // Simulator State
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [files, setFiles] = useState<VirtualFile[]>(getInitialFiles());
  const [activeFilePath, setActiveFilePath] = useState<string>("src/Signup.php");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [humanReviewStage, setHumanReviewStage] = useState<"hidden" | "propose_patch" | "propose_learn" | "completed">("hidden");
  
  // Stats
  const [currentUtc, setCurrentUtc] = useState<string>("");

  useEffect(() => {
    // Formats a clean date for our clock dashboard
    const now = new Date();
    setCurrentUtc(now.toUTCString().replace("GMT", "UTC"));
  }, []);

  const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>([
    {
      type: "warning",
      text: "⚡ ACME DEVELOPMENT PROTOCOL v2.8.4 STARTED."
    },
    {
      type: "output",
      text: "Acme Signup-Portal PHP Repository environment detected in sandbox.\nWe are tasked with solving DEMO-1: Add robust validation to Signup.php.\n\nTo prevent agent context from dissolving into terminal archaeology, we need voku/agent-loop.\n\n👉 INSTRUCTIONS: Click the command shortcuts below to initialize the workflow and see the live monitor update as memory is constrained into files."
    }
  ]);

  // Terminal commands simulator engine
  const handleRunCommand = async (cmdString: string) => {
    if (isLoading) return;
    setIsLoading(true);

    // Append user input
    setTerminalHistory((prev) => [...prev, { type: "input", text: cmdString }]);

    // Short processing timeout to represent genuine PHP execution lag
    await new Promise((resolve) => setTimeout(resolve, 800));

    const cleanCmd = cmdString.trim();

    if (cleanCmd.startsWith("composer require")) {
      // 1. Installation
      setIsInstalled(true);
      const updatedFiles = getInitialFiles().map(file => {
        if (file.path === "composer.json") {
          return {
            ...file,
            content: `{
  "name": "acme/signup-portal",
  "description": "ACME signup portal and auth system",
  "type": "project",
  "require": {
    "php": "^8.2",
    "vlucas/phpdotenv": "^5.6"
  },
  "require-dev": {
    "phpunit/phpunit": "^10.5",
    "phpstan/phpstan": "^1.11",
    "voku/agent-loop": "^1.4.0"
  },
  "autoload": {
    "psr-4": {
      "App\\\\": "src/"
    }
  }
}`
          };
        }
        return file;
      });
      setFiles(updatedFiles);
      setActiveFilePath("composer.json");

      setTerminalHistory((prev) => [
        ...prev,
        { type: "output", text: "Updating composer.json in sandboxed repository..." },
        { type: "output", text: "Loading composer repositories with package information..." },
        { type: "output", text: "Updating dependencies (including require-dev)" },
        { type: "success", text: "  - Downloading voku/agent-loop (v1.4.0)" },
        { type: "success", text: "  - Installing symfony/console (v6.4.5)" },
        { type: "output", text: "Generating optimized autoload files" },
        { type: "success", text: "Symfony CLI helper binary linked to: vendor/bin/agent-loop" },
        { type: "output", text: "Package initialization finished. Ready to run board syncing." }
      ]);
    } 
    else if (cleanCmd.includes("board summary") || cleanCmd.includes("board:sync")) {
      // 2. Board
      if (!isInstalled) {
        setTerminalHistory((prev) => [
          ...prev,
          { type: "error", text: "bash: vendor/bin/agent-loop: No such file or directory. Please install voku/agent-loop first." }
        ]);
        setIsLoading(false);
        return;
      }
      setFiles(getBoardFiles());
      setActiveFilePath(".agent-loop/board/DEMO-1.md");

      setTerminalHistory((prev) => [
        ...prev,
        { type: "output", text: "Scanning .agent-loop/board/ directory for markdown cards..." },
        { type: "success", text: "[✔] Synced active card: .agent-loop/board/DEMO-1.md" },
        { type: "output", text: "--------------------------------------------------------" },
        { type: "output", text: "TASK: DEMO-1 | Add validation to signup form\nSTATUS: BACKLOG_READY" },
        { type: "output", text: "--------------------------------------------------------" },
        { type: "output", text: "Ready to assign task. Run session:start to initialize active memory." }
      ]);
    } 
    else if (cleanCmd.includes("session start") || cleanCmd.includes("session:start")) {
      // 3. Session
      if (!isInstalled) {
        setTerminalHistory((prev) => [
          ...prev,
          { type: "error", text: "bash: vendor/bin/agent-loop: No such file. Install voku/agent-loop first." }
        ]);
        setIsLoading(false);
        return;
      }
      setFiles(getSessionFiles());
      setActiveFilePath(".agent-loop/sessions/DEMO-1/plan.md");

      setTerminalHistory((prev) => [
        ...prev,
        { type: "output", text: "Initializing isolated active workspace session for DEMO-1..." },
        { type: "success", text: "  + Created: .agent-loop/sessions/DEMO-1/plan.md" },
        { type: "success", text: "  + Created: .agent-loop/sessions/DEMO-1/decisions.md" },
        { type: "success", text: "  + Created: .agent-loop/sessions/DEMO-1/assumptions.md" },
        { type: "output", text: "Durable intent locked. Active session directory is populated." },
        { type: "success", text: "Session started. Ready to compile recall benchmarks (recall:compile)." }
      ]);
    } 
    else if (cleanCmd.includes("recall compile") || cleanCmd.includes("recall:compile")) {
      // 4. Recall
      if (!isInstalled) {
        setTerminalHistory((prev) => [
          ...prev,
          { type: "error", text: "bash: vendor/bin/agent-loop: Package not installed." }
        ]);
        setIsLoading(false);
        return;
      }
      setFiles(getRecallFiles());
      setActiveFilePath(".agent-loop/recall/system.md");
      setHumanReviewStage("propose_patch");

      setTerminalHistory((prev) => [
        ...prev,
        { type: "output", text: "Reading repository benchmarks and knowledge maps..." },
        { type: "output", text: "Aligning context files to DEMO-1 Acceptance Criteria..." },
        { type: "success", text: "  + Written: .agent-loop/recall/system.md" },
        { type: "success", text: "  + Written: .agent-loop/recall/validation-plan.md" },
        { type: "success", text: "  + Written: .agent-loop/recall/meta.json" },
        { type: "output", text: "Safe compiled context is ready! It excludes giant prompt soup." },
        { type: "warning", text: "WAITING: Agent is proposing code fixes and tests are executing..." }
      ]);
    } 
    else if (cleanCmd === "composer test") {
      // 5. Validation Test Command
      const isWorkDone = files.some(
        (f) => f.path === "src/Signup.php" && f.content.includes("declare(strict_types=1);")
      );

      if (!isWorkDone) {
        // Failing tests
        setTerminalHistory((prev) => [
          ...prev,
          { type: "output", text: "vendor/bin/phpunit --colors=always" },
          { type: "warning", text: "PHPUnit 10.5.15 by Sebastian Bergmann and contributors." },
          { type: "output", text: "Runtime: PHP 8.2.14" },
          { type: "error", text: "F.F.  2 / 4 tests passed (FAILURES DETECTED)" },
          { type: "error", text: "1) App\\Test\\SignupTest::testRegisterWithShortPassword\n   Failed asserting that empty signups are rejected by Signup.php." },
          { type: "error", text: "2) App\\Test\\SignupTest::testRegisterWithGarbageEmail\n   Failed: Signups can be completed using invalid email inputs." },
          { type: "warning", text: "PHPStan Static Analysis (Level 5): 1 error in src/Signup.php" },
          { type: "error", text: "  - Method register() lacks validation guards on array inputs." }
        ]);
      } else {
        // Passing tests
        setTerminalHistory((prev) => [
          ...prev,
          { type: "output", text: "vendor/bin/phpunit --colors=always" },
          { type: "output", text: "Runtime: PHP 8.2.14" },
          { type: "success", text: "....  4 / 4 tests passed successfully!" },
          { type: "success", text: "✔ testRegisterWithValidDetails passed" },
          { type: "success", text: "✔ testRegisterWithShortPassword rejected" },
          { type: "success", text: "✔ testRegisterWithGarbageEmail rejected" },
          { type: "success", text: "✔ PHPStan Static Analysis: OK (Strict level 5 passed)" }
        ]);
      }
    } 
    else if (cleanCmd.includes("verify --strict") || cleanCmd.includes("verify")) {
      // 6. Verify Loop State
      if (!isInstalled) {
        setTerminalHistory((prev) => [
          ...prev,
          { type: "error", text: "Command failed. Install the loop CLI package first." }
        ]);
        setIsLoading(false);
        return;
      }

      const isWorkDone = files.some(
        (f) => f.path === "src/Signup.php" && f.content.includes("declare(strict_types=1);")
      );

      if (!isWorkDone) {
        setTerminalHistory((prev) => [
          ...prev,
          { type: "output", text: "Verifying active workspace loop boundaries..." },
          { type: "success", text: "  ✔ Local boards verified" },
          { type: "success", text: "  ✔ Active Session memory file checks passed" },
          { type: "success", text: "  ✔ Recall briefings compiled" },
          { type: "error", text: "  ✖ Code validation failing: Unit tests are broken in Signup.php" },
          { type: "warning", text: "State: INVALID. Solve PHP Unit failures before review checkin." }
        ]);
      } else {
        setTerminalHistory((prev) => [
          ...prev,
          { type: "output", text: "Verifying active workspace loop boundaries (--strict)..." },
          { type: "success", text: "  ✔ Local boards verified" },
          { type: "success", text: "  ✔ Active Session memory file checks passed" },
          { type: "success", text: "  ✔ Recall briefings compiled" },
          { type: "success", text: "  ✔ Code validation verified (Unit-tests and PHPStan OK)" },
          { type: "success", text: "WORKFLOW STATE VERIFIED. Human approval pathway unlocked." }
        ]);
        setHumanReviewStage("propose_learn");
      }
    } 
    else if (cleanCmd.includes("learn validate") || cleanCmd.includes("learn:persist") || cleanCmd.includes("learn:validate")) {
      // 7. Learning Proposal
      if (!isInstalled) {
        setTerminalHistory((prev) => [
          ...prev,
          { type: "error", text: "Not installed." }
        ]);
        setIsLoading(false);
        return;
      }

      setTerminalHistory((prev) => [
        ...prev,
        { type: "output", text: "Searching workspace journals for temporary session logs..." },
        { type: "output", text: "Found observation: PHPStan failed initially due to loose return types." },
        { type: "warning", text: "Proposing finding elevation to global learning-root..." },
        { type: "output", text: "Approve finding in the central dashboard (under Knowledge Base tab) to convert it to a durable rule!" }
      ]);
      setHumanReviewStage("propose_learn");
    } 
    else {
      setTerminalHistory((prev) => [
        ...prev,
        { type: "output", text: `Executing standard prompt: ${cleanCmd}` },
        { type: "warning", text: "Command recognized, but no custom agent-loop step tied to it." }
      ]);
    }

    setIsLoading(false);
  };

  const handleResetSimulator = () => {
    setIsInstalled(false);
    setFiles(getInitialFiles());
    setActiveFilePath("src/Signup.php");
    setHumanReviewStage("hidden");
    setTerminalHistory([
      {
        type: "warning",
        text: "💥 TERMINAL ARCHAEOLOGY CORRECTED. RE-ESTABLISHING COMPOSER BASELINE..."
      },
      {
        type: "output",
        text: "Sandbox reverted to original messy starting state.\nSelect 'Initialize agent-loop' below to show how developers declare boundaries to coding agents!"
      }
    ]);
  };

  // Human Review interactive callbacks
  const handleApproveCodePatch = () => {
    setFiles(getWorkDoneFiles());
    setActiveFilePath("src/Signup.php");
    setHumanReviewStage("propose_learn");
    setTerminalHistory((prev) => [
      ...prev,
      { type: "success", text: "👉 Human APPROVED agent's code proposal." },
      { type: "output", text: "Applying proposed code patch to src/Signup.php..." },
      { type: "output", text: "Patch successfully written. Re-run validations with: composer test" }
    ]);
  };

  const handleRejectCodePatch = () => {
    setTerminalHistory((prev) => [
      ...prev,
      { type: "error", text: "👉 Human REJECTED agent's code proposal. Plan is being re-evaluated." }
    ]);
  };

  const handleApproveDurableLearning = () => {
    setFiles(getLearningApprovedFiles());
    setActiveFilePath(".agent-loop/learning/findings.json");
    setHumanReviewStage("completed");
    setTerminalHistory((prev) => [
      ...prev,
      { type: "success", text: "👉 Human APPROVED durable learning. Finding elevated to findings.json!" },
      { type: "output", text: "Rule created: Strict method typings on SignUp guards enforced in root database." },
      { type: "success", text: "Agent session loop gracefully completed and safely archived. 🚀" }
    ]);
  };

  const hasBoard = files.some((f) => f.path.startsWith(".agent-loop/board/"));
  const hasSession = files.some((f) => f.path.startsWith(".agent-loop/sessions/"));
  const hasRecall = files.some((f) => f.path.startsWith(".agent-loop/recall/"));
  const hasWorkDone = files.some(
    (f) => f.path === "src/Signup.php" && f.content.includes("declare(strict_types=1);")
  );
  const hasLearnings = files.some((f) => f.path === "learning-root/findings.json" || f.path === ".agent-loop/learning/findings.json");

  const steps = [
    { label: "BOARD", isCompleted: hasBoard, isActive: isInstalled && !hasBoard, num: "01" },
    { label: "SESSION", isCompleted: hasSession, isActive: hasBoard && !hasSession, num: "02" },
    { label: "RECALL", isCompleted: hasRecall, isActive: hasSession && !hasRecall, num: "03" },
    { label: "VALIDATE", isCompleted: hasWorkDone, isActive: hasRecall && !hasWorkDone, num: "04" },
    { label: "LEARN", isCompleted: hasLearnings, isActive: hasWorkDone && !hasLearnings, num: "05" }
  ];

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] flex flex-col font-sans transition-colors duration-300">
      {/* Header bar */}
      <header className="border-b-2 border-[#141414] px-6 py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 select-none shrink-0 bg-[#F0EFEC]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#141414] text-[#E4E3E0] flex items-center justify-center font-bold font-mono text-sm tracking-tighter">
            AL_
          </div>
          <div>
            <h1 className="text-sm md:text-base font-black tracking-widest text-[#141414] flex items-center gap-2 uppercase">
              <span>AGENT-LOOP DX WORKSPACE</span>
              <a href="https://github.com/voku/agent-loop" target="_blank" rel="noreferrer" className="bg-[#141414] text-[#E4E3E0] text-[9px] px-2 py-0.5 font-mono tracking-widest hover:bg-[#333333] transition-colors">
                GITHUB
              </a>
            </h1>
            <p className="text-[10px] text-[#141414]/70 font-mono uppercase tracking-wider mt-0.5">
              Robust client workflow boundaries over terminal archaeology
            </p>
          </div>
        </div>

        {/* Step Progress Grid Tracker */}
        <div className="grid grid-cols-5 border-2 border-[#141414] bg-[#E4E3E0] max-w-full lg:max-w-xl w-full select-none divide-x-2 divide-[#141414] shrink-0 font-mono overflow-hidden">
          {steps.map((step, idx) => {
            let bgClass = "bg-[#DAD9D6] text-[#141414]/40";
            if (step.isCompleted) {
              bgClass = "bg-[#141414] text-[#E4E3E0]";
            } else if (step.isActive) {
              bgClass = "bg-amber-400 text-[#141414] font-bold";
            }
            return (
              <div
                key={idx}
                className={`py-1.5 px-0.5 sm:px-2 flex flex-col items-center justify-center text-center transition-all duration-300 relative ${bgClass}`}
              >
                {step.isActive && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
                )}
                <span className="text-[9px] font-bold block sm:hidden">
                  {step.isCompleted ? "✔" : step.num}
                </span>
                <span className="text-[10px] font-black tracking-wider hidden sm:inline">
                  {step.isCompleted ? "✔ DONE" : `${step.num} ${step.isActive ? "•" : ""}`}
                </span>
                <span className="text-[8px] sm:text-[9px] font-extrabold tracking-widest mt-0.5 uppercase block">
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 text-[10px] font-mono lg:ml-0 font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1.5 text-[#141414]">
            <Clock className="w-3.5 h-3.5 text-[#141414]" />
            <span>UTC: {currentUtc || "LIVE"}</span>
          </div>
        </div>
      </header>

      {/* Primary Dashboard layout split columns */}
      <main className="flex-1 max-w-[1550px] w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 min-w-0 overflow-y-auto lg:overflow-hidden">
        
        {/* Left Column: Column-1 (The Live Dashboard) */}
        <div className="lg:col-span-5 h-[650px] lg:h-full flex flex-col min-h-0 min-w-0 shrink-0">
          <AgentMonitor files={files} />
        </div>

        {/* Right Column: Column-2 (The Interactive IDE / Sandbox environment) */}
        <div className="lg:col-span-7 flex flex-col gap-4 min-h-0 min-w-0 h-full">

          {/* Interactive Human-In-The-Loop Checkpoint Card */}
          {humanReviewStage !== "hidden" && (
            <div className="bg-[#F0EFEC] border-2 border-[#141414] p-5 shadow-none relative overflow-hidden animate-fade-in">
              <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-amber-500" />
              
              {humanReviewStage === "propose_patch" && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#141414] uppercase font-mono">
                      <ShieldCheck className="w-4 h-4 text-orange-600" />
                      <span>CHECKPOINT REQUIRED // PROPOSED CODE PATCH</span>
                    </div>
                    <h3 className="text-sm font-black text-[#141414] uppercase tracking-tight">
                      ADD VALIDATION GUARDS ON App\Signup.php
                    </h3>
                    <p className="text-xs text-[#141414]/80 max-w-xl font-medium">
                      Lars says: <span className="italic">"The agent proposes, it does not own."</span> Inspect the proposed validation rules in the workspace directory file explorer below before approval checkin.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 font-mono">
                    <button
                      onClick={handleRejectCodePatch}
                      className="px-3 py-1.5 text-xs text-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] border border-[#141414] font-bold uppercase tracking-wider transition cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={handleApproveCodePatch}
                      className="px-3 py-1.5 text-xs text-[#E4E3E0] bg-[#141414] hover:bg-[#333333] border border-[#141414] font-bold uppercase tracking-wider transition cursor-pointer"
                    >
                      Approve & Write
                    </button>
                  </div>
                </div>
              )}

              {humanReviewStage === "propose_learn" && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-emerald-700 uppercase font-mono">
                      <Sparkles className="w-4 h-4 text-emerald-700" />
                      <span>ELEVATE RULE // MEMORY STORAGE UPGRADE</span>
                    </div>
                    <h3 className="text-sm font-black text-[#141414] uppercase tracking-tight">
                      PERSIST LEARNINGS IN FINDINGS.JSON?
                    </h3>
                    <p className="text-xs text-[#141414]/80 max-w-xl font-medium">
                      Elevate strict method typing boundaries to durable repository memory. Future coding sessions will immediately inherit this knowledge constraint!
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 font-mono">
                    <button
                      onClick={() => {
                        setHumanReviewStage("completed");
                        setTerminalHistory((prev) => [
                          ...prev,
                          { type: "warning", text: "👉 Human chose to skip durable rule addition. Session closed cleanly." }
                        ]);
                      }}
                      className="px-3 py-1.5 text-xs text-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] border border-[#141414] font-bold uppercase tracking-wider transition cursor-pointer"
                    >
                      Skip
                    </button>
                    <button
                      onClick={handleApproveDurableLearning}
                      className="px-3 py-1.5 text-xs text-[#141414] bg-amber-400 hover:bg-amber-300 border border-[#141414] font-bold uppercase tracking-wider transition cursor-pointer animate-pulse"
                    >
                      Persist finding
                    </button>
                  </div>
                </div>
              )}

              {humanReviewStage === "completed" && (
                <div className="flex items-center gap-3 pl-3">
                  <div className="p-2 bg-[#141414] text-[#E4E3E0] rounded-none border border-[#141414]">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#141414] uppercase tracking-tight">
                      SESSION LOG COMPLETED & SECURELY ARCHIVED
                    </h3>
                    <p className="text-xs text-[#141414]/80 font-medium">
                      You have successfully installed the package, established memory boundaries, run validations, and logged findings. Grounded agent automation complete.
                    </p>
                  </div>
                 </div>
              )}
            </div>
          )}

          {/* Top Panel: Interactive Workspace Directory & IDE Code View */}
          <div className="flex-[1.5] min-h-[450px] lg:min-h-0 lg:h-1/2">
            <FileSystem
              files={files}
              activeFilePath={activeFilePath}
              onSelectFile={(path) => setActiveFilePath(path)}
              isInstalled={isInstalled}
            />
          </div>

          {/* Bottom Panel: Visual Terminal Console Simulator */}
          <div className="flex-1 min-h-[380px] shrink-0">
            <Terminal
              history={terminalHistory}
              onReset={handleResetSimulator}
              isLoading={isLoading}
              onRunCustomCommand={(cmd) => handleRunCommand(cmd)}
            />
          </div>

        </div>
      </main>
    </div>
  );
}
