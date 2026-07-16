/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import AgentMonitor from "./components/AgentMonitor";
import Terminal from "./components/Terminal";
import FileSystem from "./components/FileSystem";
import LandingPage from "./components/LandingPage";
import { VirtualFile, TerminalLine, StepId } from "./types";
import {
  getInitialFiles,
  getBoardFiles,
  getPlanFiles,
  getApproveFiles,
  getRecallFiles,
  getWorkDoneFiles,
  getVerifyFiles,
  getCloseFiles,
  getLearningApprovedFiles,
  getMemoryFiles
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
  Award,
  Activity,
  History,
  Check,
  Lock,
  RefreshCw,
  GitPullRequest
} from "lucide-react";

export default function App() {
  // Simulator State
  const [viewMode, setViewMode] = useState<"landing" | "sandbox">("landing");
  const [files, setFiles] = useState<VirtualFile[]>(getInitialFiles());
  const [activeFilePath, setActiveFilePath] = useState<string>("src/Signup.php");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [replanCount, setReplanCount] = useState<number>(0);
  const [activeStep, setActiveStep] = useState<StepId>("init");
  const [isAutoRunning, setIsAutoRunning] = useState<boolean>(false);
  const [codePatchRevision, setCodePatchRevision] = useState<number>(1);
  
  // Interactive human checkpoints
  // "hidden" | "approve_brief" | "code_patch" | "revised_patch" | "findings" | "memory_policy" | "completed"
  const [humanReviewStage, setHumanReviewStage] = useState<"hidden" | "approve_brief" | "code_patch" | "revised_patch" | "findings" | "memory_policy" | "completed">("hidden");

  // Parse files present to determine step status
  const isInstalled = files.some(f => f.path === "composer.json" && f.content.includes("voku/agent-loop"));
  const hasBoard = files.some(f => f.path.startsWith("todo/cards/"));
  const hasBrief = files.some(f => f.path === "session_plan/2026-07-14-demo-1/work-brief.json");
  const hasRecall = files.some(f => f.path.startsWith("infra/doc/agent-learning/recall-output/"));
  const hasWorkDone = files.some(f => f.path === "src/Signup.php" && f.content.includes("declare(strict_types=1);")) && codePatchRevision === 2;
  const hasVerify = files.some(f => f.path === "session_plan/2026-07-14-demo-1/verification_summary.json");
  const hasClose = files.some(f => f.path === "session_plan/2026-07-14-demo-1/DEMO-1_report.json");
  const hasLearnings = files.some(f => f.path === "infra/doc/agent-learning/findings.json");
  const hasMemory = files.some(f => f.path === "infra/doc/agent-learning/proposals/candidate/proposal.2026-07-14.001.json");

  // Determine current brief status
  let briefStatus = "N/A";
  const briefFile = files.find(f => f.path === "session_plan/2026-07-14-demo-1/work-brief.json");
  if (briefFile) {
    try {
      const parsed = JSON.parse(briefFile.content);
      briefStatus = parsed.status || "candidate";
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

  // Local clock state
  const [currentUtc, setCurrentUtc] = useState<string>("");

  useEffect(() => {
    const now = new Date();
    setCurrentUtc(now.toUTCString().replace("GMT", "UTC"));
    const interval = setInterval(() => {
      const d = new Date();
      setCurrentUtc(d.toUTCString().replace("GMT", "UTC"));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>([
    {
      type: "warning",
      text: "⚡ GOVERNED AGENT WORKSPACE PROTOCOL v3.0 ONLINE."
    },
    {
      type: "output",
      text: "Acme Signup-Portal PHP environment detected. Backlog task DEMO-1 is unassigned.\n\nTo manage this session cleanly without drowning the coding agent in massive context buffers, we need a governed loop.\n\n👉 INSTRUCTIONS: Install the CLI and run the commands using the shortcuts below to step through the governed workflow. Watch the state dashboard reflect locked files and compiled outcomes."
    }
  ]);

  // Terminal command simulator engine
  const handleRunCommand = async (cmdString: string) => {
    if (isLoading) return;
    setIsLoading(true);

    // Append user input
    setTerminalHistory((prev) => [...prev, { type: "input", text: cmdString }]);

    // Simulated PHP runtime execution delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const cleanCmd = cmdString.trim();

    if (cleanCmd.startsWith("composer require voku/agent-loop")) {
      // 1. Installation & Init
      setActiveStep("init");
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
        { type: "output", text: "Updating composer.json in isolated sandbox..." },
        { type: "output", text: "Loading composer package index and caching local manifests..." },
        { type: "success", text: "  - Installing the currently resolved voku/agent-loop release..." },
        { type: "success", text: "  - Linking vendor/bin/agent-loop cli helper" },
        { type: "output", text: "Running doctor check: vendor/bin/agent-loop init doctor" },
        { type: "success", text: "[OK] agent-loop installed and vendor/bin/agent-loop is available." },
        { type: "success", text: "[OK] Repository diagnostics passed." },
        { type: "output", text: "Next: Inspect the backlog card using: vendor/bin/agent-loop board card show DEMO-1" }
      ]);
    } 
    else if (cleanCmd.includes("board card show")) {
      // 2. Board Synced
      if (!isInstalled) {
        setTerminalHistory((prev) => [
          ...prev,
          { type: "error", text: "bash: vendor/bin/agent-loop: command not found. Run composer install require step first." }
        ]);
        setIsLoading(false);
        return;
      }
      setFiles(getBoardFiles());
      setActiveStep("board");
      setActiveFilePath("todo/cards/DEMO-1.md");

      setTerminalHistory((prev) => [
        ...prev,
        { type: "output", text: "Reading Kanban card todo/cards/DEMO-1.md..." },
        { type: "success", text: "[✔] INSPECTED BACKLOG TASK: DEMO-1 Signup Validation guards." },
        { type: "output", text: "Target Goal: Add secure validation guards to App\\Signup (Reject short passwords and invalid emails)." },
        { type: "output", text: "State: BACKLOG_READY. Next: Plan governed workflow with: vendor/bin/agent-loop workflow plan DEMO-1" }
      ]);
    } 
    else if (cleanCmd.includes("workflow plan")) {
      // 3. Plan Work Brief
      if (!isInstalled) {
        setTerminalHistory((prev) => [
          ...prev,
          { type: "error", text: "Package not installed." }
        ]);
        setIsLoading(false);
        return;
      }
      setFiles(getPlanFiles());
      setActiveStep("plan");
      setActiveFilePath("session_plan/2026-07-14-demo-1/work-brief.json");

      setTerminalHistory((prev) => [
        ...prev,
        { type: "output", text: "Compiling task parameters and planning workflow session..." },
        { type: "success", text: "  + Created: session_plan/2026-07-14-demo-1/work-brief.json" },
        { type: "success", text: "  + Created: session_plan/2026-07-14-demo-1/work-brief.md" },
        { type: "output", text: "Work Brief Revision 1 candidate successfully drafted." },
        { type: "warning", text: "AWAITING HUMAN APPROVAL GATES: Lars must approve or re-plan this brief spec before work begins." },
        { type: "output", text: "Run: vendor/bin/agent-loop workflow approve DEMO-1 --by lars" }
      ]);
    } 
    else if (cleanCmd.includes("workflow approve")) {
      // 4. Human Approval Gate
      if (!isInstalled) {
        setTerminalHistory((prev) => [
          ...prev,
          { type: "error", text: "Package not installed." }
        ]);
        setIsLoading(false);
        return;
      }
      setActiveStep("approve");
      setHumanReviewStage("approve_brief");

      setTerminalHistory((prev) => [
        ...prev,
        { type: "output", text: "Opening gated work-brief approval portal for lars..." },
        { type: "warning", text: "WAITING FOR INPUT: Review brief revision in the panel above and choose to Approve or Request Re-plan." }
      ]);
    } 
    else if (cleanCmd.includes("map build") || cleanCmd.includes("map query")) {
      // 5. Recall compile & codebase maps
      if (!isInstalled) {
        setTerminalHistory((prev) => [
          ...prev,
          { type: "error", text: "Package not installed." }
        ]);
        setIsLoading(false);
        return;
      }

      // Safeguard: must have brief
      const hasPlanBrief = files.some(f => f.path === "session_plan/2026-07-14-demo-1/work-brief.json");
      if (!hasPlanBrief) {
        setTerminalHistory((prev) => [
          ...prev,
          { type: "error", text: "ERROR: No work brief exists. Run 'workflow plan' first." }
        ]);
        setIsLoading(false);
        return;
      }

      setFiles(getRecallFiles(replanCount));
      setActiveStep("recall");
      setActiveFilePath(".agent-map/php-symbols.json");
      setHumanReviewStage("code_patch"); // Trigger the code proposal checkpoint!

      setTerminalHistory((prev) => [
        ...prev,
        { type: "output", text: "Inspecting recall artifacts created during workflow planning..." },
        { type: "output", text: "  + Found: infra/doc/agent-learning/recall-output/2026-07-14-demo-1/system.md" },
        { type: "output", text: "  + Found: infra/doc/agent-learning/recall-output/2026-07-14-demo-1/validation-plan.md" },
        { type: "output", text: "  + Found: infra/doc/agent-learning/recall-output/2026-07-14-demo-1/recall-log.draft.json" },
        { type: "output", text: "" },
        { type: "output", text: "Building compact PHP symbol map..." },
        { type: "success", text: "  + Written: .agent-map/php-symbols.json" },
        { type: "success", text: "  + Found: App\\Signup" },
        { type: "output", text: "" },
        { type: "warning", text: "SIMULATOR HARNESS:\nAn external coding agent formulated a proposed patch using the approved\nwork brief, recall briefing and symbol map." },
        { type: "output", text: "Inspect and click 'Approve & Apply Code Patch' on the Checkpoint Card above to apply changes." }
      ]);
    } 
    else if (cleanCmd === "composer test" || cleanCmd.includes("composer test")) {
      // 6. Test suite
      const hasPatchedCode = files.some(
        (f) => f.path === "src/Signup.php" && f.content.includes("declare(strict_types=1);")
      );

      if (!hasPatchedCode) {
        setTerminalHistory((prev) => [
          ...prev,
          { type: "output", text: "vendor/bin/phpunit --colors=always" },
          { type: "warning", text: "PHPUnit 10.5.15 by Sebastian Bergmann and contributors." },
          { type: "error", text: "F.F.  2 / 4 tests passed (FAILURES ENCOUNTERED)" },
          { type: "error", text: "1) App\\Test\\SignupTest::testRegisterWithShortPassword\n   Failed asserting that empty passwords are rejected by App\\Signup." },
          { type: "error", text: "2) App\\Test\\SignupTest::testRegisterWithGarbageEmail\n   Failed asserting that signup rejects bad domain structures." },
          { type: "warning", text: "PHPStan Static Analysis (Level 5): 1 error" },
          { type: "error", text: "  - Method App\\Signup::register() lacks typehints and strict validation guards." },
          { type: "warning", text: "Awaiting patch. Click 'Approve & Apply Code Patch' on the Checkpoint Card above to revise src/Signup.php." }
        ]);
        setIsLoading(false);
        return;
      }

      if (codePatchRevision === 1) {
        setTerminalHistory((prev) => [
          ...prev,
          { type: "output", text: "vendor/bin/phpunit --colors=always" },
          { type: "warning", text: "PHPUnit 10.5.15 by Sebastian Bergmann and contributors." },
          { type: "error", text: "F.F.  2 / 4 tests passed (FAILURES ENCOUNTERED)" },
          { type: "error", text: "1) App\\Test\\SignupTest::testRegisterWithShortPassword\n   Failed asserting that empty passwords are rejected by App\\Signup." },
          { type: "error", text: "2) App\\Test\\SignupTest::testRegisterWithGarbageEmail\n   Failed asserting that signup rejects bad domain structures." },
          { type: "error", text: "PHPStan Static Analysis (Level 5): 1 error" },
          { type: "error", text: "  - Method App\\Signup::register() lacks typehints and strict validation guards." },
          { type: "error", text: "\nTests failed." },
          { type: "warning", text: "\nSimulation Gate: Tests failed with initial patch. External coding agent compiled a revised patch to address failures." },
          { type: "warning", text: "Awaiting gated confirmation: Review and click 'Approve & Apply Revised Code Patch' on the Checkpoint Card above." }
        ]);
        setHumanReviewStage("revised_patch");
        setIsAutoRunning(false);
      } else {
        setTerminalHistory((prev) => [
          ...prev,
          { type: "output", text: "vendor/bin/phpunit --colors=always" },
          { type: "warning", text: "PHPUnit 10.5.15 by Sebastian Bergmann and contributors." },
          { type: "success", text: ".... 4 / 4 tests passed (SUCCESS)" },
          { type: "success", text: "PHPStan Static Analysis (Level 5): 0 errors (Passed)" },
          { type: "success", text: "\nTests passed! The revised code patch successfully resolved all verification issues." },
          { type: "output", text: "\nTest suite verified. Next: Log Outcomes with 'vendor/bin/agent-loop recall log-outcome'" }
        ]);
        setActiveStep("verify");
      }
    } 
    else if (cleanCmd.includes("recall log-outcome")) {
      // 7. Outcomes Record
      if (!isInstalled) {
        setTerminalHistory((prev) => [
          ...prev,
          { type: "error", text: "Package not installed." }
        ]);
        setIsLoading(false);
        return;
      }

      setFiles(getVerifyFiles(replanCount));
      setActiveStep("verify");
      setActiveFilePath("session_plan/2026-07-14-demo-1/verification_summary.json");

      setTerminalHistory((prev) => [
        ...prev,
        { type: "output", text: "Logging guidelines outcomes to recall outcome journals with --commit..." },
        { type: "success", text: "  ✔ Committed recall log outcomes using working-tree" },
        { type: "output", text: "\nRecording learning decision via session manager:" },
        { type: "output", text: "  vendor/bin/agent-loop session record DEMO-1 \\\n    --kind decision \\\n    --title \"Enforce strict validation guards\" \\\n    --body \"Enforce strict validation guards on server-side registrations to mitigate garbage input.\"" },
        { type: "success", text: "  ✔ Session decision recorded durably." },
        { type: "output", text: "\nGenerating verification projection..." },
        { type: "success", text: "  + Written: session_plan/2026-07-14-demo-1/verification_summary.json (Simulator-generated verification projection)" },
        { type: "success", text: "  ✔ consistency_verify: Tasks, sessions, and work brief are fully aligned." },
        { type: "success", text: "  ✔ PHPUnit unit tests: 4 / 4 checks passed." },
        { type: "success", text: "  ✔ PHPStan analysis: Level 5 strict checks passed." },
        { type: "output", text: "\n[✔] WORKFLOW STATE STABLE. Next: Close session with:\n  vendor/bin/agent-loop verify --strict && vendor/bin/agent-loop workflow report DEMO-1 && vendor/bin/agent-loop workflow close DEMO-1 --status done" }
      ]);
    } 
    else if (cleanCmd.includes("workflow close") || cleanCmd.includes("verify --strict") || cleanCmd.includes("workflow report") || cleanCmd.includes("review blindspots")) {
      // 8. Close / Report
      if (!isInstalled) {
        setTerminalHistory((prev) => [
          ...prev,
          { type: "error", text: "Package not installed." }
        ]);
        setIsLoading(false);
        return;
      }
      setFiles(getCloseFiles(replanCount));
      setActiveStep("close");
      setActiveFilePath("session_plan/2026-07-14-demo-1/DEMO-1_report.json");

      setTerminalHistory((prev) => [
        ...prev,
        { type: "output", text: "Executing: vendor/bin/agent-loop review blindspots DEMO-1..." },
        { type: "success", text: "[OK] Blind spots analysis complete: no critical gaps identified." },
        { type: "output", text: "\nRunning rigid verification gates..." },
        { type: "success", text: "[OK] All verification rules passed." },
        { type: "output", text: "\nRunning workflow report DEMO-1..." },
        { type: "success", text: "Simulator captured workflow report:\n  session_plan/2026-07-14-demo-1/DEMO-1_report.json" },
        { type: "output", text: "\nClosing workflow session DEMO-1..." },
        { type: "success", text: "[OK] Session closed with status: done." },
        { type: "output", text: "\nNext: Validate learning candidates with:\n  vendor/bin/agent-loop learn validate --root infra/doc/agent-learning" }
      ]);
    } 
    else if (cleanCmd.includes("learn validate")) {
      // 9. Learn layer findings
      if (!isInstalled) {
        setTerminalHistory((prev) => [
          ...prev,
          { type: "error", text: "Package not installed." }
        ]);
        setIsLoading(false);
        return;
      }
      setFiles(getLearningApprovedFiles(replanCount));
      setActiveStep("learn");
      setActiveFilePath("infra/doc/agent-learning/findings/finding.2026-07-14.001.json");
      setHumanReviewStage("findings");

      setTerminalHistory((prev) => [
        ...prev,
        { type: "output", text: "External agent or human created findings artifact:" },
        { type: "output", text: "  + File: infra/doc/agent-learning/findings/finding.2026-07-14.001.json" },
        { type: "output", text: "\nRunning validation: vendor/bin/agent-loop learn validate --root infra/doc/agent-learning" },
        { type: "success", text: "[OK] validated: finding.2026-07-14.001.json" },
        { type: "output", text: "\nNext: Evaluate and write promotion candidates using:\n  vendor/bin/agent-loop learn guidance-evaluate --root infra/doc/agent-learning --write-candidates" }
      ]);
    } 
    else if (cleanCmd.includes("learn guidance-evaluate") || cleanCmd.includes("guidance-evaluate")) {
      // 10. Memory Promote/Forget
      if (!isInstalled) {
        setTerminalHistory((prev) => [
          ...prev,
          { type: "error", text: "Package not installed." }
        ]);
        setIsLoading(false);
        return;
      }
      setFiles(getMemoryFiles(replanCount, false));
      setActiveStep("memory");
      setActiveFilePath("infra/doc/agent-learning/proposals/candidate/proposal.2026-07-14.001.json");
      setHumanReviewStage("memory_policy");

      setTerminalHistory((prev) => [
        ...prev,
        { type: "output", text: "Evaluating pending findings candidates for global guidelines promotion:" },
        { type: "output", text: "  vendor/bin/agent-loop learn guidance-evaluate --root infra/doc/agent-learning --write-candidates" },
        { type: "output", text: "Evaluating recall usefulness and scanning outcomes journals..." },
        { type: "success", text: "  + Written candidate proposal: infra/doc/agent-learning/proposals/candidate/proposal.2026-07-14.001.json" },
        { type: "warning", text: "\nProposal status is: candidate" },
        { type: "warning", text: "Awaiting gated confirmation: Click 'Confirm Memory Update' on the Checkpoint Card above to run vendor/bin/agent-loop learn proposal-approve." }
      ]);
    } 
    else {
      setTerminalHistory((prev) => [
        ...prev,
        { type: "output", text: `Executing: ${cleanCmd}` },
        { type: "warning", text: "Command executed, but no custom step mapping tied to it in this sandbox." }
      ]);
    }

    setIsLoading(false);
  };

  // Automated agent loop sequence driver
  useEffect(() => {
    if (!isAutoRunning || isLoading) return;

    const timer = setTimeout(() => {
      if (currentStepIdx === 0) {
        handleRunCommand("composer require voku/agent-loop && vendor/bin/agent-loop init doctor");
        setActiveFilePath("composer.json");
      } else if (currentStepIdx === 1) {
        handleRunCommand("vendor/bin/agent-loop board card show DEMO-1");
        setActiveFilePath("todo/cards/DEMO-1.md");
      } else if (currentStepIdx === 2) {
        handleRunCommand('vendor/bin/agent-loop workflow plan DEMO-1 --by lars --learning-root infra/doc/agent-learning --file src/Signup.php --goal "Add validation guards to App\\Signup." --scope src/Signup.php --validation "composer test" --validation "vendor/bin/phpstan analyse"');
        setActiveFilePath("session_plan/2026-07-14-demo-1/work-brief.json");
      } else if (currentStepIdx === 3) {
        // Human Gate: Work brief approval
        setIsAutoRunning(false);
        setHumanReviewStage("approve_brief");
      } else if (currentStepIdx === 4) {
        handleRunCommand("vendor/bin/agent-loop map build --paths=src,tests && vendor/bin/agent-loop map query Signup");
        setActiveFilePath(".agent-map/php-symbols.json");
      } else if (currentStepIdx === 5) {
        if (!hasWorkDone) {
          // Human Gate: Code patch
          setIsAutoRunning(false);
          setHumanReviewStage("code_patch");
        } else {
          // Now runs tests automatically!
          handleRunCommand("composer test && vendor/bin/phpstan analyse");
          setActiveFilePath("src/Signup.php");
        }
      } else if (currentStepIdx === 6) {
        handleRunCommand("vendor/bin/agent-loop recall log-outcome --root infra/doc/agent-learning --draft infra/doc/agent-learning/recall-output/2026-07-14-demo-1/recall-log.draft.json --by lars --commit working-tree");
        setActiveFilePath("session_plan/2026-07-14-demo-1/verification_summary.json");
      } else if (currentStepIdx === 7) {
        handleRunCommand("vendor/bin/agent-loop verify --strict && vendor/bin/agent-loop workflow report DEMO-1 && vendor/bin/agent-loop workflow close DEMO-1 --status done");
        setActiveFilePath("session_plan/2026-07-14-demo-1/DEMO-1_report.json");
      } else if (currentStepIdx === 8) {
        if (!hasLearnings) {
          handleRunCommand("vendor/bin/agent-loop learn validate --root infra/doc/agent-learning");
          setActiveFilePath("infra/doc/agent-learning/findings/finding.2026-07-14.001.json");
        } else {
          // Human Gate: Observation Triage Portal
          setIsAutoRunning(false);
          setHumanReviewStage("findings");
        }
      } else if (currentStepIdx === 9) {
        if (!hasMemory) {
          handleRunCommand("vendor/bin/agent-loop learn guidance-evaluate --root infra/doc/agent-learning --write-candidates");
          setActiveFilePath("infra/doc/agent-learning/proposals/candidate/proposal.2026-07-14.001.json");
        } else if (humanReviewStage !== "completed") {
          // Human Gate: Confirm Permanent Rule Promotion
          setIsAutoRunning(false);
          setHumanReviewStage("memory_policy");
        } else {
          setIsAutoRunning(false);
        }
      } else {
        setIsAutoRunning(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [isAutoRunning, currentStepIdx, isLoading, hasWorkDone, hasLearnings, hasMemory, humanReviewStage, replanCount]);

  const handleResetSimulator = () => {
    setIsAutoRunning(false);
    setFiles(getInitialFiles());
    setActiveFilePath("src/Signup.php");
    setReplanCount(0);
    setActiveStep("init");
    setHumanReviewStage("hidden");
    setTerminalHistory([
      {
        type: "warning",
        text: "💥 WORKSPACE baselined. ALL TRANSITIVE FILES PURGED."
      },
      {
        type: "output",
        text: "Sandbox reverted to raw, original starting state.\nSelect 'composer require voku/agent-loop' below to initialize diagnostics and see boundaries in action!"
      }
    ]);
  };

  // Human Review Gate Handlers
  const handleApproveBrief = () => {
    setFiles(getApproveFiles(replanCount));
    setActiveFilePath("session_plan/2026-07-14-demo-1/work-brief.json");
    setHumanReviewStage("hidden");
    setIsAutoRunning(true);
    
    // Auto advance to compile recall step
    setTerminalHistory((prev) => [
      ...prev,
      { type: "success", text: `✔ Human APPROVED Work Brief Revision ${replanCount === 0 ? '1' : '2'}.` },
      { type: "output", text: `Contract locked. Ready to compile codebase maps. Run: vendor/bin/agent-loop map build --paths=src,tests && vendor/bin/agent-loop map query Signup` }
    ]);
  };

  const handleReplanAndSupersede = () => {
    if (replanCount === 0) {
      setReplanCount(1);
      // set files to represent superseded rev1 and candidate rev2
      setFiles([
        ...getBoardFiles(),
        {
          name: "rev1_work-brief.json",
          path: "session_plan/2026-07-14-demo-1/work-brief-history/rev1_work-brief.json",
          category: "session",
          language: "json",
          content: `{
  "taskId": "DEMO-1",
  "revision": 1,
  "status": "superseded",
  "brief": {
    "goal": "Add secure server-side verification to Signup.php, validating emails and password lengths.",
    "context": "PHP 8.2 backend, ACME signup system, existing failing PHPUnit tests.",
    "expectedResult": "Successful registration for valid details, standard rejection errors for empty/malformed inputs.",
    "scope": [
      "src/Signup.php"
    ],
    "nonGoals": [
      "Client-side JS validation"
    ],
    "validation": [
      "vendor/bin/phpunit"
    ]
  },
  "supersededBy": "session_plan/2026-07-14-demo-1/work-brief.json",
  "reason": "Re-planned to add PHPStan and strict-type rules into the goals definition."
}`
        },
        {
          name: "work-brief.json",
          path: "session_plan/2026-07-14-demo-1/work-brief.json",
          category: "session",
          language: "json",
          content: `{
  "taskId": "DEMO-1",
  "revision": 2,
  "status": "candidate",
  "brief": {
    "goal": "Add secure server-side validation to Signup.php with strict typing, fully passing PHPStan Level 5.",
    "context": "PHP 8.2 backend, strict types requirement, existing failing PHPUnit tests.",
    "expectedResult": "Unified return values, clear error logging, all unit and static checks passing.",
    "scope": [
      "src/Signup.php"
    ],
    "nonGoals": [
      "Client-side JS validation",
      "Database schema adjustments"
    ],
    "validation": [
      "composer test",
      "vendor/bin/phpstan analyse"
    ]
  }
}`
        }
      ]);
      setActiveFilePath("session_plan/2026-07-14-demo-1/work-brief.json");
      setTerminalHistory((prev) => [
        ...prev,
        { type: "warning", text: "⚠ Human clicked Re-plan & Modify." },
        { type: "error", text: "Revision 1 candidate has been INVALIDATED and status is now SUPERSEDED." },
        { type: "output", text: "Generating Revision 2: Candidate with upgraded static checking requirements under session_plan/2026-07-14-demo-1/." },
        { type: "output", text: "Review the updated Work Brief Revision 2 candidate above." }
      ]);
    }
  };

  const handleApproveCodePatch = () => {
    // Write partial/faulty patch first
    const baseFiles = getRecallFiles(replanCount);
    const faultyFiles = baseFiles.map(f => {
      if (f.path === "src/Signup.php") {
        return {
          ...f,
          content: `<?php

declare(strict_types=1);

namespace App;

class Signup {
    private array $errors = [];

    public function register(array $data): bool {
        // Partial implementation: only checks empty values, misses regex domain format and min length
        $email = trim($data['email'] ?? '');
        $password = $data['password'] ?? '';

        if (empty($email)) {
            $this->errors[] = "Email is required.";
        }

        if (empty($password)) {
            $this->errors[] = "Password is required.";
        }

        return empty($this->errors);
    }

    public function getErrors(): array {
        return $this->errors;
    }
}`
        };
      }
      return f;
    });

    setFiles(faultyFiles);
    setCodePatchRevision(1);
    setActiveFilePath("src/Signup.php");
    setHumanReviewStage("hidden");
    setIsAutoRunning(true);
    
    setTerminalHistory((prev) => [
      ...prev,
      { type: "success", text: "✔ Human APPROVED agent's initial proposed code patch." },
      { type: "output", text: "Applying patch to src/Signup.php..." },
      { type: "success", text: "Signup.php updated with initial validation skeleton." }
    ]);
    
    setTimeout(() => {
      handleRunCommand("composer test && vendor/bin/phpstan analyse");
    }, 500);
  };

  const handleApproveRevisedPatch = () => {
    setFiles(getWorkDoneFiles(replanCount));
    setCodePatchRevision(2);
    setActiveFilePath("src/Signup.php");
    setHumanReviewStage("hidden");
    setIsAutoRunning(true);

    setTerminalHistory((prev) => [
      ...prev,
      { type: "success", text: "✔ Human APPROVED revised patch." },
      { type: "output", text: "Applying revised patch to src/Signup.php..." },
      { type: "success", text: "Signup.php updated with complete server-side email regex structure and password length checks." }
    ]);

    setTimeout(() => {
      handleRunCommand("composer test && vendor/bin/phpstan analyse");
    }, 500);
  };

  const handleRejectCodePatch = () => {
    setTerminalHistory((prev) => [
      ...prev,
      { type: "error", text: "✖ Human REJECTED code proposal. Agent is re-evaluating." }
    ]);
  };

  const handlePersistFinding = () => {
    setFiles(getLearningApprovedFiles(replanCount));
    setActiveFilePath("infra/doc/agent-learning/findings/finding.2026-07-14.001.json");
    setHumanReviewStage("hidden");
    setIsAutoRunning(true);
    setTerminalHistory((prev) => [
      ...prev,
      { type: "success", text: "✔ Finding proposal finding.2026-07-14.001 validated and persisted durably." },
      { type: "output", text: "Learnings written to infra/doc/agent-learning/findings/finding.2026-07-14.001.json. Next: Evaluate promotion guidance with 'vendor/bin/agent-loop learn guidance-evaluate'" }
    ]);
  };

  const handleConfirmPromotions = () => {
    setFiles(getMemoryFiles(replanCount, true));
    setActiveFilePath("infra/doc/agent-learning/proposals/candidate/proposal.2026-07-14.001.json");
    setHumanReviewStage("completed");
    setTerminalHistory((prev) => [
      ...prev,
      { type: "output", text: "Executing: vendor/bin/agent-loop learn proposal-approve --root infra/doc/agent-learning proposal.2026-07-14.001 --by lars" },
      { type: "success", text: "✔ Proposal proposal.2026-07-14.001 status updated to 'approved'." },
      { type: "success", text: "Durable guidance proposal approved.\n\nThe proposal is ready for external implementation and validation. No repository guidance or active constraint was modified automatically." }
    ]);
  };

  // Steps definitions for progress bar
  const stepDefinitions = [
    { label: "INIT", isCompleted: isInstalled, isActive: activeStep === "init", num: "01" },
    { label: "BOARD", isCompleted: hasBoard, isActive: activeStep === "board", num: "02" },
    { label: "PLAN", isCompleted: hasBrief, isActive: activeStep === "plan", num: "03" },
    { label: "APPROVE", isCompleted: briefStatus === "approved", isActive: activeStep === "approve", num: "04" },
    { label: "RECALL", isCompleted: hasRecall, isActive: activeStep === "recall", num: "05" },
    { label: "WORK", isCompleted: hasWorkDone, isActive: activeStep === "work", num: "06" },
    { label: "VERIFY", isCompleted: hasVerify, isActive: activeStep === "verify", num: "07" },
    { label: "CLOSE", isCompleted: hasClose, isActive: activeStep === "close", num: "08" },
    { label: "LEARN", isCompleted: hasLearnings, isActive: activeStep === "learn", num: "09" },
    { label: "MEMORY", isCompleted: hasMemory, isActive: activeStep === "memory", num: "10" },
  ];

  if (viewMode === "landing") {
    return <LandingPage onLaunchSandbox={() => setViewMode("sandbox")} />;
  }

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] flex flex-col font-sans transition-colors duration-300">
      
      {/* Header bar */}
      <header className="border-b-2 border-[#141414] px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-5 select-none shrink-0 bg-[#F0EFEC]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#141414] text-[#E4E3E0] flex items-center justify-center font-bold font-mono text-sm tracking-tighter">
            AL_
          </div>
          <div>
            <h1 className="text-sm md:text-base font-black tracking-widest text-[#141414] flex items-center gap-2 uppercase">
              <span>AGENT-LOOP GOVERNED SANDBOX</span>
              <a href="https://github.com/voku/agent-loop" target="_blank" rel="noreferrer" className="bg-[#141414] text-[#E4E3E0] text-[9px] px-2 py-0.5 font-mono tracking-widest hover:bg-slate-800 transition-colors">
                GITHUB
              </a>
            </h1>
            <p className="text-[10px] text-[#141414]/70 font-mono uppercase tracking-wider mt-0.5">
              Unified CLI Areas & Explicit Revisional Work Briefs
            </p>
          </div>
        </div>

        {/* 10-step Progress Tracker Bar */}
        <div className="grid grid-cols-5 md:grid-cols-10 border-2 border-[#141414] bg-[#E4E3E0] max-w-full lg:max-w-2xl w-full select-none divide-x divide-y md:divide-y-0 divide-[#141414] shrink-0 font-mono overflow-hidden">
          {stepDefinitions.map((step, idx) => {
            let bgClass = "bg-[#DAD9D6] text-[#141414]/40";
            if (step.isCompleted) {
              bgClass = "bg-[#141414] text-[#E4E3E0]";
            } else if (step.isActive) {
              bgClass = "bg-amber-400 text-[#141414] font-bold";
            }
            return (
              <div
                key={idx}
                className={`py-2 px-1 flex flex-col items-center justify-center text-center transition-all duration-300 relative ${bgClass}`}
              >
                {step.isActive && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
                )}
                <span className="text-[9px] font-black tracking-wider">
                  {step.isCompleted ? "✔" : step.num}
                </span>
                <span className="text-[8px] font-extrabold tracking-wider uppercase mt-0.5 block">
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 text-[10px] font-mono font-bold uppercase tracking-wider shrink-0">
          <button
            onClick={() => setViewMode("landing")}
            className="px-3 py-1.5 bg-white hover:bg-[#DAD9D6] text-[#141414] font-black border-2 border-[#141414] shadow-[2.5px_2.5px_0px_0px_rgba(20,20,20,1)] hover:translate-y-[-0.5px] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-700" />
            <span>View Project Docs</span>
          </button>
          <div className="flex items-center gap-1.5 text-[#141414]">
            <Clock className="w-3.5 h-3.5 text-[#141414]" />
            <span>UTC Clock: {currentUtc || "LIVE"}</span>
          </div>
        </div>
      </header>

      {/* Primary Dashboard layout */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 min-w-0 overflow-y-auto lg:overflow-hidden">
        
        {/* Left Column: Diagnostics State Dashboard */}
        <div className="lg:col-span-5 h-[650px] lg:h-full flex flex-col min-h-0 min-w-0">
          <AgentMonitor 
            files={files} 
            activeStep={activeStep}
            onRunCommand={handleRunCommand}
            onSelectFile={(path) => setActiveFilePath(path)}
            activeFilePath={activeFilePath}
            isLoading={isLoading}
            onReset={handleResetSimulator}
            humanReviewStage={humanReviewStage}
            onApproveBrief={handleApproveBrief}
            onReplanBrief={handleReplanAndSupersede}
            onApproveCodePatch={handleApproveCodePatch}
            onRejectCodePatch={handleRejectCodePatch}
            onApproveRevisedPatch={handleApproveRevisedPatch}
            onPersistFinding={handlePersistFinding}
            onConfirmPromotions={handleConfirmPromotions}
            isAutoRunning={isAutoRunning}
            setIsAutoRunning={setIsAutoRunning}
          />
        </div>

        {/* Right Column: Interactive Sandbox & CLI editor */}
        <div className="lg:col-span-7 flex flex-col gap-4 min-h-0 min-w-0 h-full">

          {/* Interactive Workspace Directory & IDE Code View */}
          <div className="flex-[1.5] min-h-[420px] lg:min-h-0 lg:h-1/2">
            <FileSystem
              files={files}
              activeFilePath={activeFilePath}
              onSelectFile={(path) => setActiveFilePath(path)}
              isInstalled={isInstalled}
            />
          </div>

          {/* Visual Terminal Console Simulator */}
          <div className="flex-1 min-h-[350px] shrink-0">
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
