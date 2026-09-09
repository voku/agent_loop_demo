import React, { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Brain,
  Check,
  CheckCircle,
  Clock,
  Compass,
  Copy,
  Cpu,
  Database,
  ExternalLink,
  FileCheck,
  FileCode,
  FileWarning,
  GitBranch,
  GitCommit,
  GitPullRequest,
  HelpCircle,
  Layers,
  Link as LinkIcon,
  Lock,
  Map,
  MessageSquare,
  Network,
  PackageCheck,
  Palette,
  Play,
  RotateCcw,
  Scale,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal as TermIcon,
  User,
  Workflow,
  Wrench,
  XCircle,
  Zap
} from "lucide-react";
import {
  CliCommand,
  EvidenceComparison,
  FaqItem,
  HumanDecisionBoundary,
  ScenarioId
} from "../types";
import { AgentLoopLogo, AgentLoopMark } from "./AgentLoopLogo";
import { BrandSpecModal } from "./BrandSpecModal";

interface LandingPageProps {
  onLaunchSandbox: (scenarioId?: ScenarioId) => void;
}

interface EnrichedPackageSpec {
  readonly badge: string;
  readonly name: string;
  readonly role: string;
  readonly responsibility: string;
  readonly boundary: string;
  readonly consumesFrom: readonly string[];
  readonly producesFor: readonly string[];
  readonly keyArtifact: string;
}

const enrichedPackages: readonly EnrichedPackageSpec[] = [
  {
    badge: "CORE",
    name: "voku/agent-loop",
    role: "Kernel & Governance",
    responsibility: "Contract/Run lifecycle, cross-owner policy, approvals, routing, quality gates, and host-facing projections.",
    boundary: "Owns GitWorkTree and queries Git for working tree status and diff boundaries; does not parse board markdown directly.",
    consumesFrom: ["agent-kanban (task intent)", "agent-session (evidence)", "Human approval"],
    producesFor: ["Coding Host (next_action)", "agent-ui (manifest)", "CI gate check"],
    keyArtifact: "Run Manifest v1 & next_action_kind routing"
  },
  {
    badge: "BOARD",
    name: "voku/agent-kanban",
    role: "Board & Tasks",
    responsibility: "Git-native Markdown work items, deterministic parsing, revision identity, and safe board mutation.",
    boundary: "Owns task cards and columns; does not govern run lifecycles.",
    consumesFrom: ["Repository docs/kanban/*.md", "User backlog commands"],
    producesFor: ["agent-loop (Task identifier & base revision)", "agent-ui"],
    keyArtifact: "Markdown Task Cards with revision hashes"
  },
  {
    badge: "STATE",
    name: "voku/agent-session",
    role: "Working Memory",
    responsibility: "Task-local mutable working state, validation evidence, checkpoints, and pruneable retention.",
    boundary: "Task-local mutable working state and pruneable retention; not durable project knowledge.",
    consumesFrom: ["Test execution outputs", "CLI run processes", "Diff checks"],
    producesFor: ["agent-loop (Proof of validation)", "Repair loop diagnostics"],
    keyArtifact: "Session validation log & test stdout hashes"
  },
  {
    badge: "INTEL",
    name: "voku/agent-map",
    role: "Code Intelligence",
    responsibility: "Structural and semantic PHP repository maps, search, callers, callees, impact, and edit context.",
    boundary: "Read-only code graph generation; does not execute code or edit files.",
    consumesFrom: ["Repository PHP AST", "Composer autoload configuration"],
    producesFor: ["agent-recall-compiler (Relevant symbol graphs)", "agent-loop edit"],
    keyArtifact: "Structural dependency graph & symbol index"
  },
  {
    badge: "RECALL",
    name: "voku/agent-recall-compiler",
    role: "Context & Prompts",
    responsibility: "Governed briefing, provenance, task-scoped Recall, review semantics, and L2 operating-prompt recipes.",
    boundary: "Compiles bounded prompt budgets; does not generate model completions.",
    consumesFrom: ["agent-map (AST index)", "agent-learning (Approved rules)", "Task scope"],
    producesFor: ["Coding Host (Bounded prompt context with 0 landfill)"],
    keyArtifact: "Token-budgeted governed prompt briefing"
  },
  {
    badge: "LEARN",
    name: "voku/agent-learning",
    role: "Durable Learning",
    responsibility: "Reviewable findings, LearningNotes, proposals, evidence, lineage, and durable Learning decisions.",
    boundary: "Maintains durable organizational memory; distinct from task-local sessions.",
    consumesFrom: ["Task review observations", "Session failure diagnostics"],
    producesFor: ["Repository enforcements (PHPStan / Fixer / Tests / Linters)", "agent-recall-compiler"],
    keyArtifact: "Corroborated findings, proposals & durable decision lineage"
  },
  {
    badge: "RUN",
    name: "voku/agent-loop-runner",
    role: "Execution Plane",
    responsibility: "Optional external process supervisor with isolated Git worktrees and coding-host adapters.",
    boundary: "Execution supervisor; downstream consumer of the core CLI.",
    consumesFrom: ["agent-loop CLI commands", "Git worktree pool"],
    producesFor: ["Coding Host execution sandbox", "Isolated branch results"],
    keyArtifact: "Worktree isolation & host environment adapter"
  },
  {
    badge: "UI",
    name: "voku/agent-ui",
    role: "Control Plane",
    responsibility: "Local server-rendered human cockpit for board, task workbench, evidence, and code-intelligence views.",
    boundary: "Human inspection dashboard; read-only projections of owner state.",
    consumesFrom: ["agent-loop (manifest)", "agent-kanban", "agent-session"],
    producesFor: ["Human engineer interactive control & approval screen"],
    keyArtifact: "Visual cockpit & human review interface"
  },
  {
    badge: "SKILLS",
    name: "voku/agent-skills",
    role: "Guidance Catalog",
    responsibility: "Portable engineering skills, review lenses, and reusable static-analysis guidance.",
    boundary: "Static procedural guidance; portable across six distinct coding hosts.",
    consumesFrom: ["Community & team best practices"],
    producesFor: ["Coding hosts (Codex, Claude, Copilot, Antigravity, OpenCode, Gemini)"],
    keyArtifact: "Standardized agent skills & review lenses"
  }
];

const cliCommands: Readonly<Record<string, CliCommand>> = {
  enter: {
    cmd: "vendor/bin/agent-loop enter DEMO-1 --format=json",
    description: "Read the current owner-backed lifecycle state and receive the canonical next action.",
    does: "Reconciles deterministic post-approval preparation when needed and returns mutation_ready, next_action_kind, next_action, and owner-backed references.",
    doesNot: "Invent a parallel phase order or silently broaden human-approved task authority.",
    input: "Task id + durable Contract/Run state",
    output: "Structured lifecycle projection with the current next action"
  },
  finish: {
    cmd: "vendor/bin/agent-loop finish DEMO-1 --format=json",
    description: "Deterministic close-out front door. Evaluates evidence, review, and quality gates.",
    does: "Reconciles implementation-bound evidence and routes the first decisive validation, review, Learning, risk, or close action through next_action_kind / next_action.",
    doesNot: "Require the host to maintain a copied checklist of internal gates or infer workflow legality from file paths.",
    input: "Current approved Contract + implementation/evidence identity",
    output: "Canonical next action or complete/none"
  },
  quick: {
    cmd: "vendor/bin/agent-loop quick --file src/Fix.php \"Correct typo in error message\"",
    description: "Low-ceremony governed fast path for genuinely surgical 1–2 file changes.",
    does: "Creates and auto-approves a tightly bounded fast-path Contract (<=2 files, <=60 modified lines ceiling), strictly enforcing scope and diff limits while automating review and learning closeout.",
    doesNot: "Permit unbounded scope creep or unmonitored file growth. If changes exceed limits, work returns to the ordinary governed lifecycle.",
    input: "Target file(s) (max 2) + surgical intent string",
    output: "Bounded governed fast-path execution (<=60 lines diff ceiling)"
  },
  repair: {
    cmd: "vendor/bin/agent-loop repair DEMO-1",
    description: "Bounded follow-up to an observed validation failure with an attempt budget.",
    does: "Consumes recorded test/static-analysis diagnostics and projects targeted repair instructions with a strict 2-attempt budget before human escalation.",
    doesNot: "Allow unmonitored private retry loops that churn tokens without progress.",
    input: "Task id with recorded validation failure in session",
    output: "Targeted repair instruction + remaining attempt budget"
  },
  pipeline: {
    cmd: "vendor/bin/agent-loop pipeline DEMO-1 --stage=verify",
    description: "Runner for governed multi-stage execution profiles (surgical, standard, hardened).",
    does: "Drives deterministic profile stages, handles handoffs, and surfaces stage-specific attention states before returning through finish.",
    doesNot: "Acquire human authority on its own or override kernel lifecycle decisions.",
    input: "Task id with declared execution profile",
    output: "Stage transition, verification result, or attention state"
  },
  manifest: {
    cmd: "vendor/bin/agent-loop workflow manifest DEMO-1 --format=json",
    description: "Read-only live projection linking all owner artifacts for audit and recovery.",
    does: "Outputs the unified run manifest v1 connecting Kanban card, Session, Contract, Map, Recall hashes, review, and Learning decisions.",
    doesNot: "Quietly mutate the repository; read-only inspection carries zero side effects.",
    input: "Task id",
    output: "Run manifest v1 JSON projection"
  },
  plan: {
    cmd: "vendor/bin/agent-loop workflow plan DEMO-1 --by lars --file src/Signup.php --goal \"Add validated signup guards.\" --validation \"composer test\"",
    description: "Persist a durable candidate Contract for the task when enter requests planning.",
    does: "Records task intent, mutation scope whitelist, validation command, and non-goals as a versioned candidate Contract.",
    doesNot: "Create a governed Run, allocate a Session, compile Recall, or constitute human approval.",
    input: "User intent + bounded repository evidence",
    output: "Candidate Contract revision"
  },
  status: {
    cmd: "vendor/bin/agent-loop workflow status DEMO-1 --format=json",
    description: "Inspect durable lifecycle state for diagnostic and recovery purposes.",
    does: "Provides a read-only diagnostic projection for debugging, CI integration, and status reporting.",
    doesNot: "Override fresh owner authority or replace enter/finish as the ordinary host contract.",
    input: "Task id",
    output: "Read-only workflow status"
  },
  edit: {
    cmd: "vendor/bin/agent-loop edit 'App\\Service\\UserService::save' -- 'Reject inactive users before persistence.'",
    description: "Prepare a specialist exact-target edit bundle when symbol-scoped work is useful.",
    does: "Uses agent-map and bounded Recall to resolve a precise edit target and prepare auditable context.",
    doesNot: "Turn every ordinary task into a mandatory edit-bundle workflow.",
    input: "Target symbol + bounded edit intent",
    output: "Specialist execution bundle"
  },
  doctor: {
    cmd: "vendor/bin/agent-loop init doctor",
    description: "Diagnose host integration, projected assets, skills, and adapter capabilities.",
    does: "Inspects repository configuration (.agent-loop/init.json), active host adapters (Codex, Claude, Copilot, etc.), and verifies asset freshness.",
    doesNot: "Silently alter repository configuration without human invocation.",
    input: "Local repository environment",
    output: "Diagnostic report of host readiness and projected assets"
  }
};

const workflowSteps = [
  { label: "enter", text: "Ask the lifecycle kernel for current state & canonical next action." },
  { label: "current next action", text: "Receive and obey next_action_kind (command, command_template, decision_required, host_work, none)." },
  { label: "work when authorized", text: "Implement with repository-native tools within approved boundary only when mutation_ready is true." },
  { label: "finish", text: "Owner-backed evidence flows back into kernel policy evaluation for quality gates and review." },
  { label: "current next action", text: "Receive and obey follow-up next action (e.g. bounded repair, review, risk decision, or none)." },
  { label: "complete", text: "Stop deterministically when next_action_kind is none and Run is complete." }
] as const;

const nextActionKinds = [
  ["command", "Execute the returned command as written."],
  ["command_template", "Fill model-owned placeholders from current task intent and repository evidence, then execute it."],
  ["decision_required", "Present the exact authority-bearing subject to a human before continuing."],
  ["host_work", "Perform the described implementation or model work using repository-native tools."],
  ["none", "No further lifecycle action is required."]
] as const;

const evidenceComparisons: readonly EvidenceComparison[] = [
  {
    domain: "Validation Evidence",
    claim: 'Agent says: "I ran composer test and all 18 test suites passed with 0 errors."',
    claimFlaw: "Unverified conversational assertion. In natural language chat, models can hallucinate tool output, misreport exit codes, or reference stale runs before saving code changes.",
    evidenceArtifact: "Owner-backed validation evidence",
    evidenceCheck: "Session records process execution proof bound to the current Contract revision and implementation identity, distinct from conversational claims.",
    evidenceItems: [
      "Declared validation command",
      "Recorded result and exit status",
      "Current Contract revision",
      "Current implementation identity",
      "Evidence provenance owned by Session"
    ],
    ownerPackage: "voku/agent-session & voku/agent-loop"
  },
  {
    domain: "Scope & Mutation Authority",
    claim: 'Agent says: "I only changed src/Signup.php as authorized."',
    claimFlaw: "Conversational self-certification cannot enforce boundaries. Unintentional edits to global configs, shared helpers, or migrations pass unnoticed without diff inspection against the approved scope.",
    evidenceArtifact: "Approved Contract mutation boundary",
    evidenceCheck: "Loop evaluates actual working-tree changes against the human-approved scope whitelist. Expanding scope requires a new candidate revision and human decision.",
    evidenceItems: [
      "Declared scope whitelist in approved Contract",
      "Human-authorized mutation boundary",
      "Candidate Contract revision required for scope expansion",
      "Clear separation of task discovery from unauthorized mutation"
    ],
    ownerPackage: "voku/agent-loop"
  },
  {
    domain: "Candidate Tree Integrity",
    claim: 'Agent says: "I made the code changes and they are ready in my workspace."',
    claimFlaw: "Self-certification without repository truth. External executors or model completions cannot declare candidate validity merely because code was written.",
    evidenceArtifact: "git-tree-v1:<exact-base-commit>:<git-tree-object-id>",
    evidenceCheck: "Loop verifies candidate mutations directly against the Git object store. Only candidate records bound to the current Run, Contract, and authorized stage can advance execution.",
    evidenceItems: [
      "Calculated Git tree object verification in repository store",
      "Strict attempt-bound and previous-candidate-bound lineage",
      "No API for external runners to mint validation evidence",
      "Fail-closed refusal if candidate drifts from approved scope"
    ],
    ownerPackage: "voku/agent-loop"
  },
  {
    domain: "Governed Recall & Guidance",
    claim: 'Agent says: "I kept all historical project notes in my context memory."',
    claimFlaw: "Context landfill. Piling old chat transcripts and temporary workarounds into prompts creates conflicting guidance, consumes token budgets, and causes reasoning drift.",
    evidenceArtifact: "Governed task briefing with provenance",
    evidenceCheck: "Recall compiler deterministically packages active, human-approved guidance and targeted code intelligence, excluding stale session scratchpads.",
    evidenceItems: [
      "Bounded token-budgeted prompt compilation",
      "Active, human-approved Learning rules only",
      "Targeted structural symbols from agent-map",
      "Exclusion of unpromoted, ephemeral scratchpad notes"
    ],
    ownerPackage: "voku/agent-recall-compiler"
  },
  {
    domain: "Durable Learning",
    claim: 'Agent says: "I noted this rule in MEMORY.md for all future sessions."',
    claimFlaw: "Unreviewed memory drift. Letting an agent mutate permanent instructions without review spreads untested conventions and contradictory guidelines across the team.",
    evidenceArtifact: "Reviewable Learning proposal & decision",
    evidenceCheck: "Learning captures structured findings backed by recorded evidence. Findings become durable repository guidance only after explicit human approval.",
    evidenceItems: [
      "Structured finding notes with reproducible evidence",
      "Explicit proposal review workflow",
      "Human-owned decision boundary for durable rules",
      "Versioned guideline lineage in the repository"
    ],
    ownerPackage: "voku/agent-learning"
  }
];

const decisionBoundaries: readonly HumanDecisionBoundary[] = [
  {
    role: "Human-Owned",
    decision: "Contract Goal & Scope Approval",
    justification: "Only humans define the task problem statement and approve the Contract revision + mutation boundary. Discovery within that boundary does not require new approval.",
    mechanism: "vendor/bin/agent-loop workflow approve <task> --by <user>"
  },
  {
    role: "Human-Owned",
    decision: "Scope Escalation & Intent Shift",
    justification: "If implementation reveals an unforeseen dependency outside the approved boundary, mutation halts until a human accepts the new revision.",
    mechanism: "Candidate Contract revision re-planning + explicit human sign-off"
  },
  {
    role: "Human-Owned",
    decision: "Policy Waivers & Accepted Risk",
    justification: "Neither the coding agent nor the orchestrator may waive static analysis failures or bypass security gates on its own.",
    mechanism: "next_action_kind: decision_required with authority-bearing subject"
  },
  {
    role: "Human-Owned",
    decision: "Durable Guidance Promotion",
    justification: "Session observations must never become permanent repository policy without peer-reviewable human confirmation.",
    mechanism: "vendor/bin/agent-loop learn proposal-approve <proposal-id>"
  },
  {
    role: "Kernel-Enforced",
    decision: "Lifecycle State & Next Action Routing",
    justification: "Eliminates prompt drift and host confusion by calculating canonical next actions deterministically.",
    mechanism: "enter / finish CLI contract returning next_action_kind"
  },
  {
    role: "Host-Native",
    decision: "Implementation & Syntax Selection",
    justification: "The model / host remains free to use normal editor tools, language servers, and algorithms inside the approved boundary.",
    mechanism: "Direct workspace file edits bounded by Contract scope"
  }
];

const whenNotToUse = [
  {
    title: "Ephemeral single-file scripts or quick scratchpads",
    desc: "If you are hacking a 5-line throwaway bash script or testing an API curl command in a sandbox, a versioned Contract and verification gate is unnecessary ceremony."
  },
  {
    title: "Open-ended conversational ideation",
    desc: "If you are brainstorming architecture options, debating system trade-offs, or exploring syntax before any repository code is ready to change, stick to standard conversational chat."
  },
  {
    title: "Unsupervised autonomous 'vibe-coding'",
    desc: "If your workflow depends on giving an agent root shell access and letting it loop unchecked without human checkpoints or branch boundaries, Agent Loop's gated governance will deliberately stop it."
  },
  {
    title: "Environments unwilling to execute a PHP 8.3 CLI",
    desc: "While agent-skills and host configs are portable, the governance kernel is built natively in PHP for Composer-based engineering. Non-PHP projects requiring zero PHP runtime should not install the core CLI."
  }
] as const;

const faqItems: readonly FaqItem[] = [
  {
    q: "Do I have to type 10+ commands by hand in terminal?",
    a: "No, never! You converse with your coding agent (Claude Code, Cursor, GitHub Copilot, Codex, Gemini) in natural language. The agent executes agent-loop commands under the hood as silent background tool calls. You stay in your conversational flow while the local kernel ensures deterministic governance."
  },
  {
    q: "Can I confirm all next steps in one go without micromanaging?",
    a: "Yes! When the agent presents the candidate scope whitelist and validation plan, you do not need to click or approve 8 separate micro-steps. You can simply say: 'Confirm all next steps in one go — implement, run tests, and finish.' The agent accepts the contract, writes code within the approved files, records test proof, and closes out the run autonomously."
  },
  {
    q: "What if I just have a quick fix for 1-2 files?",
    a: "Use the `agent-loop quick` front door. For micro-tasks, small bugfixes, or 1-2 file patches, you don't need multi-stage candidate contracts, approval ceremonies, or recall documents. The agent executes a bounded micro-task in one shot, verifies diff limits, and completes immediately."
  },
  {
    q: "Can I still ask my coding agent to execute whatever freely?",
    a: "Absolutely. You retain total developer freedom. You can ask your agent to run arbitrary shell commands (curl, custom tests, git status, docker) or edit any scratchpad file anytime outside agent-loop. Agent Loop is an opt-in governance harness for auditable production tasks—never a restrictive straightjacket."
  },
  {
    q: "Is agent-loop another coding agent?",
    a: "No. The coding host still performs implementation. agent-loop is the local workflow kernel around that host: durable task authority, bounded context, evidence, review, Learning, and canonical next-action routing. It is intentionally provider-independent."
  },
  {
    q: "Why is the happy path now enter -> work -> finish?",
    a: "Because the host should not duplicate the internal gate machine. enter and finish expose executable owner-backed policy through next_action_kind and next_action. Lower-level map, session, recall, review, learn, edit, and verify commands remain available for diagnostics, specialist work, CI, and recovery."
  },
  {
    q: "How does Agent Loop distinguish claims from evidence?",
    a: "An agent writing 'I ran all tests' is an unverified claim. Agent Loop records the command execution, exit code, stdout hash, and implementation git tree SHA inside the session package. It gates completion on recorded proof, not natural language chat."
  },
  {
    q: "Does approval lock every discovered file forever?",
    a: "Approval seals the exact Contract revision and its mutation boundary. Discovery inside that approved boundary is ordinary implementation work. A real change to scope, product intent, policy, acceptance, accepted risk, or another authority-bearing decision requires a new human decision."
  },
  {
    q: "Does agent-loop run PHPUnit or PHPStan itself?",
    a: "Project tools remain project tools. agent-loop binds and evaluates evidence through the workflow owners instead of pretending that conversational claims are proof. Validation commands belong to the repository Contract and can be routed as lifecycle actions."
  },
  {
    q: "Why PHP 8.3+?",
    a: "The orchestration layer stays inspectable, local, Composer-native, and easy to dogfood inside ordinary PHP repositories. The tool can be modified, tested, and reviewed with the same language and engineering controls as the projects it governs."
  }
];

// Structural Chapter Index connecting all chapters
interface ChapterMeta {
  readonly id: string;
  readonly number: string;
  readonly title: string;
  readonly shortDesc: string;
  readonly packageFocus: string;
}

const chapters: readonly ChapterMeta[] = [
  {
    id: "chapter-01",
    number: "01",
    title: "The Problem",
    shortDesc: "Why prompt landfill decays and fails governance",
    packageFocus: "The Graveyard vs Checked State"
  },
  {
    id: "chapter-02",
    number: "02",
    title: "Ecosystem & Relations",
    shortDesc: "The 9 focused packages and how data flows",
    packageFocus: "Core / Kanban / Session / Map / Recall / Learn"
  },
  {
    id: "chapter-03",
    number: "03",
    title: "Lifecycle & Specialist Flows",
    shortDesc: "Canonical enter/finish contract & specialist conveniences",
    packageFocus: "enter / finish (normal) + quick / repair / pipeline"
  },
  {
    id: "chapter-04",
    number: "04",
    title: "Authority Boundaries",
    shortDesc: "Human-owned vs kernel-enforced decisions",
    packageFocus: "Contract Revision & Scope Whitelist"
  },
  {
    id: "chapter-05",
    number: "05",
    title: "Evidence vs Claims",
    shortDesc: "Implementation-bound validation evidence vs chat assertions",
    packageFocus: "Session & Validation Evidence with Exit Status"
  },
  {
    id: "chapter-06",
    number: "06",
    title: "Learning Boundary",
    shortDesc: "Corroborated findings to durable human decisions",
    packageFocus: "agent-learning ➔ Durable Enforcements"
  },
  {
    id: "chapter-07",
    number: "07",
    title: "Interactive Sandbox",
    shortDesc: "Simulate the 4 real-world governance scenarios",
    packageFocus: "Durable / Repair / Scope Guard / CI Promotion"
  },
  {
    id: "chapter-08",
    number: "08",
    title: "CLI Reference",
    shortDesc: "Complete CLI command and contract playbook",
    packageFocus: "10 Command Interfaces"
  },
  {
    id: "chapter-09",
    number: "09",
    title: "Boundaries & FAQ",
    shortDesc: "When NOT to use Agent Loop and deep answers",
    packageFocus: "Integrity & Technical Truth"
  }
];

export default function LandingPage({ onLaunchSandbox }: LandingPageProps) {
  const [copiedText, setCopiedText] = useState(false);
  const [selectedCliTab, setSelectedCliTab] = useState<keyof typeof cliCommands>("enter");
  const [selectedEvidenceIdx, setSelectedEvidenceIdx] = useState<number>(0);
  const [selectedPackageName, setSelectedPackageName] = useState<string>("voku/agent-loop");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isBrandSpecOpen, setIsBrandSpecOpen] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText("composer require --dev voku/agent-loop");
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const selectedCommand = cliCommands[selectedCliTab];
  const activeEvidence = evidenceComparisons[selectedEvidenceIdx];
  const activePackage = enrichedPackages.find((p) => p.name === selectedPackageName) ?? enrichedPackages[0];

  const scrollToChapter = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#F8FAFC] text-slate-900 min-h-screen font-sans antialiased selection:bg-blue-600 selection:text-white pb-20">
      {/* GLOBAL TOP HEADER */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 md:px-8 py-3 sticky top-0 z-50 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* BRAND */}
          <div className="flex items-center gap-3">
            <AgentLoopLogo size={24} variant="dark" />
            <span className="text-[11px] font-mono text-slate-500 font-bold hidden sm:inline border-l border-slate-300 pl-2">
              PHP 8.3+
            </span>
          </div>

          {/* CLEAN NAV & CHAPTER JUMP */}
          <div className="flex items-center gap-2 sm:gap-4">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  scrollToChapter(e.target.value);
                  e.target.value = "";
                }
              }}
              defaultValue=""
              className="bg-white border border-slate-300 text-[11px] font-mono py-1.5 px-2 cursor-pointer text-slate-800 font-bold focus:outline-none"
              title="Jump to documentation chapter"
            >
              <option value="" disabled>
                Chapters...
              </option>
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.number}. {ch.title}
                </option>
              ))}
            </select>

            <button
              onClick={() => scrollToChapter("architecture-overview")}
              className="text-xs font-mono text-slate-700 hover:text-slate-950 font-bold hidden md:inline cursor-pointer"
            >
              Architecture
            </button>
            <button
              onClick={() => scrollToChapter("reality-check")}
              className="text-xs font-mono text-slate-700 hover:text-slate-950 font-bold hidden md:inline cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToChapter("chapter-09")}
              className="text-xs font-mono text-slate-700 hover:text-slate-950 font-bold hidden lg:inline cursor-pointer"
            >
              FAQ
            </button>

            {/* PRIMARY CTA */}
            <button
              onClick={() => onLaunchSandbox()}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-mono text-xs font-bold uppercase cursor-pointer flex items-center gap-1.5 transition-all shrink-0 rounded-lg shadow-sm hover:shadow-md hover:shadow-blue-500/25"
            >
              <span>Sandbox</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-200" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 pt-8 md:pt-14 space-y-16 md:space-y-20">
        {/* HERO SECTION */}
        <section className="space-y-6 text-center max-w-3xl mx-auto">
          {/* Official agent-loop Brand Presentation (Stacked as in Image 1) */}
          <div className="flex flex-col items-center justify-center gap-3 pt-4 pb-2">
            <AgentLoopLogo layout="stacked" size={56} variant="dark" />
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 font-bold uppercase tracking-wider mt-1">
              <span>Local-First Governance Kernel</span>
              <span>•</span>
              <span>PHP 8.3+</span>
              <span>•</span>
              <span>Bounded Multi-Agent Execution</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase font-mono tracking-tight text-slate-900 leading-[1.15]">
            Better workflows beat bigger context windows.
          </h1>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-2xl mx-auto font-sans">
            Your coding agent does not need a second hidden state machine in its prompt. It needs an explicit, checkable workflow.
            <strong className="text-slate-950"> agent-loop</strong> keeps durable task authority, bounded context, implementation evidence, and review explicit in your repository.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <div className="flex items-center bg-white border border-slate-300 rounded-lg font-mono text-xs divide-x divide-slate-200 shadow-xs w-full max-w-md sm:w-auto overflow-hidden">
              <span className="px-3 py-2 text-slate-400 select-none bg-slate-50 font-mono">$</span>
              <span className="px-4 py-2 text-slate-800 select-all font-mono font-bold truncate text-[11px] sm:text-xs">
                composer require --dev voku/agent-loop
              </span>
              <button
                onClick={copyToClipboard}
                className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-slate-700 transition-colors"
                title="Copy install command"
              >
                {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={() => onLaunchSandbox()}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold font-mono text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 cursor-pointer transition-all"
            >
              <span>Launch Sandbox</span>
              <ArrowRight className="w-4 h-4 text-cyan-200" />
            </button>
          </div>

          {/* SUBTLE METRIC PROOF STRIP */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 pt-2 text-xs font-mono text-slate-600 flex-wrap">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> PHP 8.3+</span>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Local-first (Git evidence)</span>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 9 focused packages</span>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> 6 agent hosts</span>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ARCHITECTURE OVERVIEW: CONNECTING THE DOTS MENTAL MODEL                     */}
        {/* ========================================================================= */}
        <section id="architecture-overview" className="border border-slate-200 bg-white rounded-2xl p-6 md:p-8 shadow-sm space-y-6 scroll-mt-20">
          <div className="border-b-2 border-slate-300 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] font-black uppercase tracking-widest text-indigo-700 flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5" /> THE CONNECTED MENTAL MODEL
              </div>
              <h2 className="font-mono text-2xl font-black uppercase mt-1">
                How all chapters and packages connect.
              </h2>
            </div>
            <span className="font-mono text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-md px-2.5 py-1 font-bold uppercase shrink-0">
              End-to-End Traceability
            </span>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed max-w-3xl">
            A task in Agent Loop is not a free-floating conversational prompt. It moves through a strict, checkable pipeline across focused package owners, with explicit human approval checkpoints and cryptographic evidence:
          </p>

          {/* Connected Pipeline Flowchart */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2 font-mono text-xs">
            {/* Step 1 */}
            <div
              onClick={() => scrollToChapter("chapter-02")}
              className="border border-slate-200 rounded-xl bg-slate-50 hover:bg-amber-100 p-3 flex flex-col justify-between cursor-pointer transition-colors shadow-xs"
            >
              <div>
                <span className="text-[9px] font-black bg-[#141414] text-white px-1.5 py-0.5">01 INTENT</span>
                <h4 className="font-black text-xs uppercase mt-2">agent-kanban</h4>
                <p className="text-[10px] text-slate-600 mt-1 font-sans">
                  Task item parsed from versioned Git Markdown.
                </p>
              </div>
              <div className="mt-3 text-[9px] text-indigo-700 font-bold uppercase flex items-center gap-1">
                Ch 01 &amp; 02 <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Step 2 */}
            <div
              onClick={() => scrollToChapter("chapter-03")}
              className="border border-slate-200 rounded-xl bg-slate-50 hover:bg-amber-100 p-3 flex flex-col justify-between cursor-pointer transition-colors shadow-xs"
            >
              <div>
                <span className="text-[9px] font-black bg-indigo-700 text-white px-1.5 py-0.5">02 ROUTING</span>
                <h4 className="font-black text-xs uppercase mt-2">agent-loop</h4>
                <p className="text-[10px] text-slate-600 mt-1 font-sans">
                  Canonical contract: enter &rarr; next action &rarr; finish.
                </p>
              </div>
              <div className="mt-3 text-[9px] text-indigo-700 font-bold uppercase flex items-center gap-1">
                Ch 03 <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Step 3 */}
            <div
              onClick={() => scrollToChapter("chapter-04")}
              className="border border-slate-200 rounded-xl bg-slate-50 hover:bg-amber-100 p-3 flex flex-col justify-between cursor-pointer transition-colors shadow-xs"
            >
              <div>
                <span className="text-[9px] font-black bg-blue-600 text-white text-amber-950 px-1.5 py-0.5">03 CONTRACT</span>
                <h4 className="font-black text-xs uppercase mt-2">Human Seal</h4>
                <p className="text-[10px] text-slate-600 mt-1 font-sans">
                  Approves Contract revision + mutation boundary.
                </p>
              </div>
              <div className="mt-3 text-[9px] text-indigo-700 font-bold uppercase flex items-center gap-1">
                Ch 04 <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Step 4 */}
            <div
              onClick={() => scrollToChapter("chapter-04")}
              className="border border-slate-200 rounded-xl bg-slate-50 hover:bg-amber-100 p-3 flex flex-col justify-between cursor-pointer transition-colors shadow-xs"
            >
              <div>
                <span className="text-[9px] font-black bg-slate-800 text-white px-1.5 py-0.5">04 HOST WORK</span>
                <h4 className="font-black text-xs uppercase mt-2">Coding Host</h4>
                <p className="text-[10px] text-slate-600 mt-1 font-sans">
                  Edits within authorized boundary when mutation_ready.
                </p>
              </div>
              <div className="mt-3 text-[9px] text-indigo-700 font-bold uppercase flex items-center gap-1">
                Ch 04 <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Step 5 */}
            <div
              onClick={() => scrollToChapter("chapter-05")}
              className="border border-slate-200 rounded-xl bg-slate-50 hover:bg-amber-100 p-3 flex flex-col justify-between cursor-pointer transition-colors shadow-xs"
            >
              <div>
                <span className="text-[9px] font-black bg-emerald-700 text-white px-1.5 py-0.5">05 EVIDENCE</span>
                <h4 className="font-black text-xs uppercase mt-2">agent-session</h4>
                <p className="text-[10px] text-slate-600 mt-1 font-sans">
                  Implementation-bound validation evidence with command and exit status.
                </p>
              </div>
              <div className="mt-3 text-[9px] text-indigo-700 font-bold uppercase flex items-center gap-1">
                Ch 05 <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Step 6 */}
            <div
              onClick={() => scrollToChapter("chapter-06")}
              className="border border-slate-200 rounded-xl bg-slate-50 hover:bg-amber-100 p-3 flex flex-col justify-between cursor-pointer transition-colors shadow-xs"
            >
              <div>
                <span className="text-[9px] font-black bg-rose-700 text-white px-1.5 py-0.5">06 LEARNING</span>
                <h4 className="font-black text-xs uppercase mt-2">agent-learning</h4>
                <p className="text-[10px] text-slate-600 mt-1 font-sans">
                  Corroborated findings &amp; durable decisions; repository implements chosen check.
                </p>
              </div>
              <div className="mt-3 text-[9px] text-indigo-700 font-bold uppercase flex items-center gap-1">
                Ch 06 <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>

          <div className="bg-[#111827] text-slate-200 border-2 border-[#141414] p-4 text-xs font-mono leading-relaxed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[3px_3px_0px_0px_rgba(20,20,20,1)]">
            <div>
              <span className="text-cyan-400 font-bold uppercase tracking-wider">// The Golden Rule: </span>
              <span>No model self-certifies completion. Human authority, owner-backed state, implementation evidence, and CI remain distinct; the lifecycle kernel decides what action is valid next.</span>
            </div>
            <button
              onClick={() => onLaunchSandbox("durable_task")}
              className="px-3.5 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-mono text-xs font-black uppercase border border-white/20 cursor-pointer shrink-0 transition-colors shadow-xs"
            >
              Simulate in Sandbox
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* REALITY CHECK: YOU DON'T RUN 10+ COMMANDS BY HAND                         */}
        {/* ========================================================================= */}
        <section id="reality-check" className="border-2 border-[#141414] bg-slate-50 p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(20,20,20,1)] space-y-6 scroll-mt-20">
          <div className="border-b-2 border-[#141414] pb-4 flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] font-black uppercase tracking-widest text-blue-700 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-current text-blue-600" /> REALITY OF THE WORKFLOW
              </div>
              <h2 className="font-mono text-2xl font-black uppercase mt-1 text-slate-900">
                You Talk in Chat. Your Coding Agent Runs the Loop.
              </h2>
            </div>
            <span className="font-mono text-xs bg-blue-100 text-blue-900 border border-blue-300 px-2.5 py-1 font-black uppercase shrink-0">
              Zero Manual Terminal Churn
            </span>
          </div>

          <p className="text-sm text-slate-800 leading-relaxed max-w-3xl">
            Looking at the architecture diagram, you might wonder: <em>"Do I really have to type 10+ CLI commands into bash for every task?"</em>
            <strong className="text-slate-950 font-black"> Absolutely not.</strong> In practice, you interact with your coding host (Claude Code, Cursor, GitHub Copilot, Codex, Gemini) in conversational natural language. The agent invokes <code className="font-mono font-bold bg-blue-50 text-blue-900 border border-blue-200 px-1">agent-loop</code> under the hood as silent tool calls.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Conversational Chat */}
            <div className="border-2 border-[#141414] bg-white p-5 space-y-2.5 shadow-[3px_3px_0px_0px_rgba(20,20,20,1)]">
              <div className="flex items-center gap-2 font-mono font-black text-xs uppercase text-indigo-700">
                <MessageSquare className="w-4 h-4" />
                1. Natural Conversational Prompting
              </div>
              <h3 className="font-mono font-bold text-sm text-slate-900">
                You speak developer intent; the agent executes the CLI.
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                You type: <em>"Add validated signup guards to Signup.php and run tests."</em> Your coding agent runs <code className="font-mono bg-slate-100 px-1 border border-slate-300">agent-loop enter</code> and <code className="font-mono bg-slate-100 px-1 border border-slate-300">workflow plan</code> automatically. You don't copy-paste flags or memorize 10 commands.
              </p>
            </div>

            {/* 2. Confirm All Next Steps In One Go */}
            <div className="border-2 border-[#141414] bg-white p-5 space-y-2.5 shadow-[3px_3px_0px_0px_rgba(20,20,20,1)]">
              <div className="flex items-center gap-2 font-mono font-black text-xs uppercase text-blue-700">
                <Zap className="w-4 h-4 fill-current text-blue-600" />
                2. Confirm All Next Steps In One Go
              </div>
              <h3 className="font-mono font-bold text-sm text-slate-900">
                Zero micro-prompting or gate babysitting.
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                When the agent proposes candidate files, you don't need to approve every micro-step. You say: <em>"Confirm all and run to finish."</em> The agent accepts the scope whitelist, writes the code, records test proof, and finishes autonomously in one sweep.
              </p>
            </div>

            {/* 3. Quick Fix for 1-2 Files */}
            <div className="border-2 border-[#141414] bg-white p-5 space-y-2.5 shadow-[3px_3px_0px_0px_rgba(20,20,20,1)]">
              <div className="flex items-center gap-2 font-mono font-black text-xs uppercase text-cyan-700">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                3. Quick Fix (Low-Ceremony Governed Fast Path)
              </div>
              <h3 className="font-mono font-bold text-sm text-slate-900">
                Surgical 1-2 file changes under enforced bounds.
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                For genuinely surgical 1–2 file changes, <code className="font-mono bg-slate-100 px-1 border border-slate-300">agent-loop quick</code> creates and auto-approves a tightly bounded fast-path Contract (maximum 2 files, 60 modified lines ceiling). Scope and diff limits remain enforced; if the change grows beyond them, work returns to the ordinary governed lifecycle.
              </p>
            </div>

            {/* 4. Freedom to Execute Whatever */}
            <div className="border-2 border-[#141414] bg-white p-5 space-y-2.5 shadow-[3px_3px_0px_0px_rgba(20,20,20,1)]">
              <div className="flex items-center gap-2 font-mono font-black text-xs uppercase text-slate-800">
                <Wrench className="w-4 h-4 text-slate-700" />
                4. Total Developer Freedom
              </div>
              <h3 className="font-mono font-bold text-sm text-slate-900">
                Never trapped in an orchestrator cage.
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Need your agent to run an ad-hoc <code className="font-mono bg-slate-100 px-1 border border-slate-300">curl</code>, check <code className="font-mono bg-slate-100 px-1 border border-slate-300">git status</code>, test a single test filter, or edit a scratchpad? You can do so freely at any time. Agent Loop is an opt-in harness for auditable changes—not a straightjacket.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-600 font-mono">
              Experience the conversational UX and the "Confirm All in One Go" auto-runner live in the sandbox.
            </div>
            <button
              onClick={() => onLaunchSandbox("quick_fix")}
              className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-mono text-xs font-black uppercase border-2 border-[#141414] shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] cursor-pointer flex items-center gap-2 shrink-0 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-200" /> Try Quick Fix in Sandbox &rarr;
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CHAPTER 01: THE FUNDAMENTAL PROBLEM // PROMPT PILES VS CHECKED STATE       */}
        {/* ========================================================================= */}
        <section id="chapter-01" className="space-y-6 scroll-mt-24">
          <div className="border-b-2 border-slate-300 pb-2 flex items-center justify-between">
            <div className="font-mono text-xs font-black uppercase tracking-widest text-[#141414]/65">
              CHAPTER 01 // THE ROOT PROBLEM
            </div>
            <span className="font-mono text-[10px] text-slate-500 uppercase">Context Decay vs Durable State</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-6 items-stretch">
            <div className="border border-slate-200 bg-white rounded-2xl p-6 space-y-4 shadow-[5px_5px_0px_0px_rgba(20,20,20,1)]">
              <h3 className="text-2xl font-black uppercase tracking-tight font-mono">
                Prompt piles decay. Owner-backed workflow state can be checked.
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Coding-agent setups tend to accumulate chat history, rules, workaround notes, and copied gate lists. Eventually the host is expected to remember workflow law from prose. agent-loop moves that authority into durable Contracts, package-owned state, and an executable lifecycle kernel.
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                The goal is not maximum automation. It is explicit authority: what may change, which evidence belongs to the current implementation, which decision is human-owned, and what the next action actually is.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl bg-[#141414] text-[#F0EFEC] p-6 shadow-[5px_5px_0px_0px_rgba(251,191,36,1)] flex flex-col justify-between">
              <div>
                <div className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-300 mb-3">
                  THE FAMILIAR PROMPT LANDFILL
                </div>
                <div className="space-y-2 font-mono text-xs">
                  {["MEMORY.md", "project-rules.md", "agent-notes.md", "lessons-learned.md", "MEMORY_FINAL.md"].map((name) => (
                    <div key={name} className="border border-white/20 px-3 py-1.5 bg-white/5 flex items-center justify-between">
                      <span>{name}</span>
                      <span className="text-[10px] text-rose-400">UNCHECKED</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-300 mt-4 leading-relaxed border-t border-white/10 pt-3">
                More markdown files preserve more text without preserving which text still has authority. That distinction is the entire reason agent-loop exists.
              </p>
            </div>
          </div>

          {/* Chapter 1 -> Chapter 2 Bridge */}
          <div className="border border-slate-200 rounded-xl bg-slate-50 p-4 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-indigo-700" />
              <span className="font-black uppercase text-slate-800">CONNECTING TO CHAPTER 02:</span>
              <span className="text-slate-600 font-sans">
                Because un-governed prompts decay, how do we divide responsibilities cleanly? Meet the 9 focused packages.
              </span>
            </div>
            <button
              onClick={() => scrollToChapter("chapter-02")}
              className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 font-black uppercase text-[11px] shrink-0 cursor-pointer"
            >
              Explore Chapter 02 &rarr;
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CHAPTER 02: THE ECOSYSTEM & RELATIONS // 9 FOCUSED PACKAGES               */}
        {/* ========================================================================= */}
        <section id="chapter-02" className="space-y-6 scroll-mt-24">
          <div className="border-b-2 border-slate-300 pb-2 flex items-center justify-between">
            <div className="font-mono text-xs font-black uppercase tracking-widest text-[#141414]/65">
              CHAPTER 02 // ARCHITECTURE &amp; DATA FLOW
            </div>
            <span className="font-mono text-[10px] text-slate-500 uppercase">9 Focused Packages // Zero Leaked Authority</span>
          </div>

          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight font-mono">
              9 focused packages, explicit ownership boundaries.
            </h3>
            <p className="text-sm text-slate-700 mt-2 max-w-2xl">
              No single god-agent does everything. Each package has a strict semantic boundary: one owns boards, one owns the lifecycle kernel, one compiles bounded prompts, and one verifies Git trees.
            </p>
          </div>

          {/* Interactive Package Inspector */}
          <div className="border border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-white/95 backdrop-blur-md flex items-center justify-between">
              <span className="font-mono text-xs font-black uppercase">Interactive Package Dependency &amp; Boundary Explorer</span>
              <span className="font-mono text-[10px] text-slate-500 font-bold">CLICK A PACKAGE TO INSPECT DATA FLOW</span>
            </div>

            {/* Package Tabs */}
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 border-b-2 border-slate-300 bg-slate-100 divide-x divide-[#141414] font-mono text-[10px]">
              {enrichedPackages.map((pkg) => (
                <button
                  key={pkg.name}
                  onClick={() => setSelectedPackageName(pkg.name)}
                  className={`p-2 text-center font-bold uppercase transition-colors cursor-pointer truncate ${
                    selectedPackageName === pkg.name ? "bg-[#141414] text-white" : "hover:bg-white text-slate-800"
                  }`}
                >
                  <div className="text-[8px] text-amber-500">{pkg.badge}</div>
                  <div className="truncate">{pkg.name.replace("voku/agent-", "")}</div>
                </button>
              ))}
            </div>

            {/* Selected Package Details */}
            <div className="p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 rounded-md px-2 py-0.5">
                      {activePackage.badge}
                    </span>
                    <h4 className="font-mono text-lg font-black">{activePackage.name}</h4>
                  </div>
                  <div className="font-mono text-xs uppercase tracking-wider text-slate-500 mt-1">
                    {activePackage.role}
                  </div>
                </div>
                <div className="font-mono text-xs bg-slate-100 px-3 py-1.5 border border-slate-300">
                  <span className="text-slate-500">KEY ARTIFACT: </span>
                  <strong className="text-slate-900">{activePackage.keyArtifact}</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <h5 className="font-mono text-xs font-black uppercase text-slate-900">Core Responsibility:</h5>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">{activePackage.responsibility}</p>
                  </div>
                  <div className="border border-rose-200 bg-rose-50/70 p-3">
                    <h5 className="font-mono text-[10px] font-black uppercase text-rose-900">Strict Boundary (What it does NOT do):</h5>
                    <p className="text-xs text-rose-950 mt-1 leading-relaxed">{activePackage.boundary}</p>
                  </div>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="border border-indigo-200 bg-indigo-50/70 p-3 space-y-1">
                    <div className="font-black text-[10px] uppercase text-indigo-900 flex items-center gap-1.5">
                      <ArrowDown className="w-3.5 h-3.5 text-indigo-600" /> CONSUMES DATA FROM (UPSTREAM):
                    </div>
                    <ul className="space-y-1 text-indigo-950 text-[11px] pt-1">
                      {activePackage.consumesFrom.map((src, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                          <span>{src}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border border-emerald-200 bg-emerald-50/70 p-3 space-y-1">
                    <div className="font-black text-[10px] uppercase text-emerald-900 flex items-center gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-600" /> PRODUCES DATA FOR (DOWNSTREAM):
                    </div>
                    <ul className="space-y-1 text-emerald-950 text-[11px] pt-1">
                      {activePackage.producesFor.map((dest, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                          <span>{dest}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chapter 2 -> Chapter 3 Bridge */}
          <div className="border border-slate-200 rounded-xl bg-slate-50 p-4 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-indigo-700" />
              <span className="font-black uppercase text-slate-800">CONNECTING TO CHAPTER 03:</span>
              <span className="text-slate-600 font-sans">
                Now that we know the 9 packages, how does an engineering task start and finish? Meet the host contract and narrow front doors.
              </span>
            </div>
            <button
              onClick={() => scrollToChapter("chapter-03")}
              className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 font-black uppercase text-[11px] shrink-0 cursor-pointer"
            >
              Explore Chapter 03 &rarr;
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CHAPTER 03: THE TASK LIFECYCLE & 4 FRONT DOORS                             */}
        {/* ========================================================================= */}
        <section id="chapter-03" className="space-y-8 scroll-mt-24">
          <div className="border-b-2 border-slate-300 pb-2 flex items-center justify-between">
            <div className="font-mono text-xs font-black uppercase tracking-widest text-[#141414]/65">
              CHAPTER 03 // TASK LIFECYCLE &amp; FRONT DOORS
            </div>
            <span className="font-mono text-[10px] text-slate-500 uppercase">Canonical Contract &amp; Narrow Host Entry</span>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-black uppercase tracking-tight font-mono">
              Enter. Obey the next action. Work when authorized. Finish.
            </h3>
            <p className="text-sm text-slate-700 max-w-2xl leading-relaxed">
              The coding host should never duplicate the internal gate machine. The kernel tells the host what is legal to do right now, and halts when mutation is unauthorized.
            </p>
          </div>

          {/* Canonical Sequence Terminal */}
          <div className="border border-slate-200 rounded-xl bg-[#111827] text-slate-100 p-5 shadow-sm overflow-x-auto space-y-3">
            <pre className="font-mono text-xs leading-6 whitespace-pre">{`human/task intent
  -> agent-loop enter <task-id> --format=json
  -> current next action (obey next_action_kind / next_action)
  -> work when authorized (mutation_ready: true within approved boundary)
  -> agent-loop finish <task-id> --format=json
  -> current next action (evidence reconciled against policy)
  -> complete (next_action_kind: "none")`}</pre>
            <div className="border-t border-slate-700 pt-2 text-[11px] font-mono text-amber-300/90">
              // Note: map, session, recall, review, learn, edit, and verify are specialist, diagnostic, CI, or recovery surfaces — NOT phases to memorize.
            </div>
          </div>

          {/* Stepper Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {workflowSteps.map((step, index) => (
              <div key={`step-${index}-${step.label}`} className="border border-slate-200 bg-white rounded-2xl p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="font-mono text-[10px] font-black text-slate-500">{String(index + 1).padStart(2, "0")}</div>
                  <h4 className="font-mono font-black uppercase mt-1">{step.label}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2">{step.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* The Normal Contract & Specialist Front Doors */}
          <div className="border border-slate-200 bg-white rounded-2xl p-6 shadow-[5px_5px_0px_0px_rgba(20,20,20,1)] space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-2 border-slate-300 pb-3">
              <div>
                <span className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-700">AUTHORITY FLOORS</span>
                <h4 className="font-mono text-lg font-black uppercase">Normal Lifecycle Contract &amp; Specialist Front Doors</h4>
              </div>
              <span className="font-mono text-xs bg-slate-100 px-2 py-1 border border-slate-300">
                enter / finish is the normal contract
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-300 bg-[#F9F8F6] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-black bg-[#141414] text-white px-2 py-0.5 uppercase">Canonical Task</span>
                  <span className="font-mono text-[10px] text-slate-500 font-bold uppercase">enter / finish</span>
                </div>
                <h5 className="font-mono font-bold text-xs uppercase">The Normal Governed Contract</h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The primary happy path for features, fixes, and refactors. Drives the canonical lifecycle: enter &rarr; current next action &rarr; work when authorized &rarr; finish &rarr; complete.
                </p>
                <code className="block font-mono text-[10px] text-slate-700 bg-white p-2 border border-slate-200">
                  $ vendor/bin/agent-loop enter DEMO-1 --format=json
                </code>
              </div>

              <div className="border border-slate-300 bg-[#F9F8F6] p-4 space-y-2 border-t-2 border-t-amber-500">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-black bg-blue-600 text-white text-amber-950 px-2 py-0.5 uppercase">Quick Fix (1-2 Files)</span>
                  <span className="font-mono text-[10px] text-slate-500 font-bold uppercase">quick</span>
                </div>
                <h5 className="font-mono font-bold text-xs uppercase">Low-Ceremony Governed Fast Path</h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  For genuinely surgical 1–2 file changes, <code className="font-mono bg-white px-1">quick</code> creates and auto-approves a tightly bounded fast-path Contract (&le;2 files, &le;60 modified lines ceiling). Scope and diff limits remain strictly enforced; if the change grows beyond them, return to the ordinary governed lifecycle.
                </p>
                <code className="block font-mono text-[10px] text-slate-700 bg-white p-2 border border-slate-200">
                  $ vendor/bin/agent-loop quick --file src/Fix.php "Fix typo in guard"
                </code>
              </div>

              <div className="border border-slate-300 bg-[#F9F8F6] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-black bg-rose-700 text-white px-2 py-0.5 uppercase">Specialist Flow: Repair</span>
                  <span className="font-mono text-[10px] text-slate-500 font-bold uppercase">repair (budget: 2)</span>
                </div>
                <h5 className="font-mono font-bold text-xs uppercase">Observed Failure Follow-Up</h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Consumes recorded test failures. Imposes a strict budget of 2 repair attempts before mandating human escalation to prevent token churn.
                </p>
                <code className="block font-mono text-[10px] text-slate-700 bg-white p-2 border border-slate-200">
                  $ vendor/bin/agent-loop repair DEMO-1
                </code>
              </div>

              <div className="border border-slate-300 bg-[#F9F8F6] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-black bg-indigo-700 text-white px-2 py-0.5 uppercase">Specialist Flow: Pipeline</span>
                  <span className="font-mono text-[10px] text-slate-500 font-bold uppercase">pipeline</span>
                </div>
                <h5 className="font-mono font-bold text-xs uppercase">Multi-Stage Profiles</h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Drives multi-stage execution profiles (surgical, standard, hardened). Surfaces stage transitions before cleanly finishing through quality gates.
                </p>
                <code className="block font-mono text-[10px] text-slate-700 bg-white p-2 border border-slate-200">
                  $ vendor/bin/agent-loop pipeline DEMO-1 --stage=verify
                </code>
              </div>
            </div>
          </div>

          {/* Chapter 3 -> Chapter 4 Bridge */}
          <div className="border border-slate-200 rounded-xl bg-slate-50 p-4 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-indigo-700" />
              <span className="font-black uppercase text-slate-800">CONNECTING TO CHAPTER 04:</span>
              <span className="text-slate-600 font-sans">
                When the kernel returns <code className="font-bold">decision_required</code>, who holds authority? Examine the human vs kernel boundaries.
              </span>
            </div>
            <button
              onClick={() => scrollToChapter("chapter-04")}
              className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 font-black uppercase text-[11px] shrink-0 cursor-pointer"
            >
              Explore Chapter 04 &rarr;
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CHAPTER 04: AUTHORITY BOUNDARIES & THE MUTATION CONTRACT                   */}
        {/* ========================================================================= */}
        <section id="chapter-04" className="space-y-6 scroll-mt-24">
          <div className="border-b-2 border-slate-300 pb-2 flex items-center justify-between">
            <div className="font-mono text-xs font-black uppercase tracking-widest text-[#141414]/65">
              CHAPTER 04 // AUTHORITY BOUNDARIES
            </div>
            <span className="font-mono text-[10px] text-slate-500 uppercase">Human Authority vs Automated Execution</span>
          </div>

          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight font-mono">
              Which decisions remain human-owned?
            </h3>
            <p className="text-sm text-slate-700 mt-2 max-w-2xl leading-relaxed">
              Governance does not mean replacing humans with autonomous agents. It means making hand-offs explicit so authority is never silently abdicated.
            </p>
          </div>

          <div className="border border-slate-200 bg-white rounded-2xl shadow-sm divide-y-2 divide-[#141414]">
            {decisionBoundaries.map((boundary, i) => (
              <div key={i} className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-[#F9F8F6] transition-colors">
                <div className="space-y-1.5 md:max-w-xl">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-[9px] font-black uppercase px-2 py-0.5 border ${
                        boundary.role === "Human-Owned"
                          ? "bg-blue-100 text-blue-800 text-amber-950 border-slate-300"
                          : boundary.role === "Kernel-Enforced"
                          ? "bg-indigo-100 text-indigo-950 border-indigo-300"
                          : "bg-slate-100 text-slate-800 border-slate-300"
                      }`}
                    >
                      {boundary.role}
                    </span>
                    <h4 className="font-mono font-black text-sm uppercase text-[#141414]">{boundary.decision}</h4>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{boundary.justification}</p>
                </div>
                <div className="font-mono text-[11px] bg-slate-50 border border-slate-300/30 p-2.5 shrink-0 max-w-sm">
                  <div className="text-[9px] text-slate-500 uppercase font-black mb-1">Enforcement Mechanism</div>
                  <div className="text-slate-800 font-semibold break-all">{boundary.mechanism}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Chapter 4 -> Chapter 5 Bridge */}
          <div className="border border-slate-200 rounded-xl bg-slate-50 p-4 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-indigo-700" />
              <span className="font-black uppercase text-slate-800">CONNECTING TO CHAPTER 05:</span>
              <span className="text-slate-600 font-sans">
                Once work is completed within approved bounds, how do we verify it? Why chat claims must be replaced with cryptographic Git proof.
              </span>
            </div>
            <button
              onClick={() => scrollToChapter("chapter-05")}
              className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 font-black uppercase text-[11px] shrink-0 cursor-pointer"
            >
              Explore Chapter 05 &rarr;
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CHAPTER 05: EVIDENCE VS CLAIMS // CRYPTOGRAPHIC GIT PROOF                  */}
        {/* ========================================================================= */}
        <section id="chapter-05" className="space-y-6 scroll-mt-24">
          <div className="border-b-2 border-slate-300 pb-2 flex items-center justify-between">
            <div className="font-mono text-xs font-black uppercase tracking-widest text-[#141414]/65">
              CHAPTER 05 // EVIDENCE VS CLAIMS
            </div>
            <span className="font-mono text-[10px] text-slate-500 uppercase">Implementation-Bound Evidence vs Chat Assertions</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight font-mono">
                Why chat assertions fail engineering governance.
              </h3>
              <p className="text-sm text-slate-700 mt-2 max-w-2xl leading-relaxed">
                In un-governed agent sessions, proof is conflated with prose. Agent Loop treats natural language assertions as unverified claims until package owners record tangible evidence in the repository object store.
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold shrink-0 bg-white border border-slate-300 p-2">
              <Scale className="w-4 h-4 text-indigo-700" />
              <span>Claims &ne; Evidence</span>
            </div>
          </div>

          <div className="border border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Tab selector for evidence domains */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 border-b border-slate-200 bg-white/95 backdrop-blur-md divide-x divide-[#141414] font-mono text-xs">
              {evidenceComparisons.map((item, idx) => (
                <button
                  key={item.domain}
                  onClick={() => setSelectedEvidenceIdx(idx)}
                  className={`p-3 text-left font-black uppercase transition-colors cursor-pointer ${
                    selectedEvidenceIdx === idx ? "bg-[#141414] text-[#E4E3E0]" : "hover:bg-slate-200 text-slate-800"
                  }`}
                >
                  <div className="text-[9px] text-slate-400 mb-0.5">0{idx + 1} // DOMAIN</div>
                  <div className="truncate">{item.domain}</div>
                </button>
              ))}
            </div>

            {/* Side-by-side claim vs evidence comparison */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* The Un-Governed Claim */}
                <div className="border-2 border-rose-700 bg-rose-50/70 p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-rose-300 pb-2">
                    <span className="font-mono text-[10px] font-black uppercase text-rose-800 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      The Conversational Claim (Chat)
                    </span>
                    <span className="text-[10px] font-mono bg-rose-200 text-rose-900 px-1.5 py-0.5 uppercase font-bold">Unverifiable</span>
                  </div>
                  <div className="font-mono text-xs bg-white border border-rose-200 p-3 italic text-slate-800">
                    "{activeEvidence.claim}"
                  </div>
                  <div>
                    <h5 className="font-mono text-[10px] font-black uppercase text-rose-900">Why this fails engineering rigor:</h5>
                    <p className="text-xs text-rose-950 mt-1 leading-relaxed">{activeEvidence.claimFlaw}</p>
                  </div>
                </div>

                {/* The Governed Evidence */}
                <div className="border-2 border-emerald-700 bg-emerald-50/70 p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-emerald-300 pb-2">
                    <span className="font-mono text-[10px] font-black uppercase text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      Governed Evidence (Owner Artifact)
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-200 text-emerald-900 px-1.5 py-0.5 uppercase font-bold">Auditable</span>
                  </div>
                  <div className="font-mono text-xs bg-[#111827] text-emerald-300 border border-emerald-700 p-3 break-all">
                    {activeEvidence.evidenceArtifact}
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-mono text-[10px] font-black uppercase text-emerald-900">How Agent Loop enforces it:</h5>
                    <p className="text-xs text-emerald-950 leading-relaxed">{activeEvidence.evidenceCheck}</p>
                    {activeEvidence.evidenceItems && activeEvidence.evidenceItems.length > 0 && (
                      <ul className="mt-2 space-y-1 bg-white/70 border border-emerald-200 p-2.5">
                        {activeEvidence.evidenceItems.map((item, idx) => (
                          <li key={idx} className="font-mono text-[11px] text-emerald-950 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-300/15 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-600 font-mono">
                <div>
                  <span className="font-bold text-slate-900 uppercase">Enforcing Package: </span>
                  <code className="bg-slate-200 px-1.5 py-0.5 text-slate-800 font-bold">{activeEvidence.ownerPackage}</code>
                </div>
                <div className="text-[11px] text-slate-500">
                  Evidence identity is bound to the current Contract revision and active implementation identity.
                </div>
              </div>
            </div>
          </div>

          {/* Chapter 5 -> Chapter 6 Bridge */}
          <div className="border border-slate-200 rounded-xl bg-slate-50 p-4 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-indigo-700" />
              <span className="font-black uppercase text-slate-800">CONNECTING TO CHAPTER 06:</span>
              <span className="text-slate-600 font-sans">
                When validation fails or review uncovers a repeated defect, where does that knowledge go? To the Learning Boundary.
              </span>
            </div>
            <button
              onClick={() => scrollToChapter("chapter-06")}
              className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 font-black uppercase text-[11px] shrink-0 cursor-pointer"
            >
              Explore Chapter 06 &rarr;
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CHAPTER 06: THE LEARNING BOUNDARY // EXECUTABLE CI CONSTRAINTS             */}
        {/* ========================================================================= */}
        <section id="chapter-06" className="space-y-6 scroll-mt-24">
          <div className="border-b-2 border-slate-300 pb-2 flex items-center justify-between">
            <div className="font-mono text-xs font-black uppercase tracking-widest text-[#141414]/65">
              CHAPTER 06 // DURABLE KNOWLEDGE &amp; CI
            </div>
            <span className="font-mono text-[10px] text-slate-500 uppercase">Findings &rarr; Proposals &rarr; Durable Decisions &rarr; Chosen Enforcement</span>
          </div>

          <div className="border border-slate-200 bg-white rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-slate-300 pb-5">
              <div>
                <h3 className="font-mono text-2xl font-black uppercase">From observed findings to durable decisions &amp; mechanical enforcements.</h3>
                <p className="text-sm text-slate-700 mt-2 max-w-2xl leading-relaxed">
                  Piling natural language rules into <code className="font-mono font-bold">MEMORY.md</code> causes prompt landfill and context decay. Agent Loop enforces a strict three-tier learning boundary:
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs font-bold shrink-0 bg-slate-100 border border-slate-300 p-2">
                <Cpu className="w-4 h-4 text-emerald-700" />
                <span>Enforcement &gt; Prose</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-slate-300 bg-slate-50 p-4 space-y-2">
                <div className="font-mono text-[10px] font-black text-slate-500 uppercase">RULE 01</div>
                <h4 className="font-mono font-bold text-xs uppercase text-slate-900">Findings are not memory</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Raw review observations and lint diagnostics are ephemeral findings. They do not pollute active agent context without review.
                </p>
              </div>

              <div className="border border-slate-300 bg-slate-50 p-4 space-y-2">
                <div className="font-mono text-[10px] font-black text-slate-500 uppercase">RULE 02</div>
                <h4 className="font-mono font-bold text-xs uppercase text-slate-900">Candidates are not memory</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Structured learning proposals synthesize repeated patterns. They remain unpromoted candidates until approved by an engineering owner.
                </p>
              </div>

              <div className="border border-slate-300 bg-slate-50 p-4 space-y-2">
                <div className="font-mono text-[10px] font-black text-slate-500 uppercase">RULE 03</div>
                <h4 className="font-mono font-bold text-xs uppercase text-slate-900">Choose Appropriate Enforcement</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Approval and concrete enforcement implementation are separated: choose PHPStan, php-cs-fixer, regression test, repository linter, or durable contextual guidance.
                </p>
              </div>
            </div>

            <div className="bg-[#111827] text-slate-200 border border-slate-200 rounded-xl p-4 text-xs font-mono leading-relaxed space-y-2">
              <div className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">// The Learning &amp; Enforcement Flow</div>
              <div>Observed finding in task PR (voku/agent-learning)</div>
              <div className="text-slate-400">  ↳ Structured proposal generated with corroborated/repeated evidence</div>
              <div className="text-slate-400">    ↳ Human approves durable decision: `vendor/bin/agent-loop learn proposal-approve 42`</div>
              <div className="text-amber-300">      ↳ Repository implements appropriate enforcement: PHPStan rule, Fixer, regression test, or linter</div>
              <div className="text-emerald-400">        ↳ CI / Recall consume their respective owner outputs (0 prompt tokens wasted)</div>
            </div>
          </div>

          {/* Chapter 6 -> Chapter 7 Bridge */}
          <div className="border border-slate-200 rounded-xl bg-slate-50 p-4 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-indigo-700" />
              <span className="font-black uppercase text-slate-800">CONNECTING TO CHAPTER 07:</span>
              <span className="text-slate-600 font-sans">
                Ready to experience these mechanisms live? Test all 4 governance scenarios in the interactive sandbox simulator.
              </span>
            </div>
            <button
              onClick={() => scrollToChapter("chapter-07")}
              className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 font-black uppercase text-[11px] shrink-0 cursor-pointer"
            >
              Explore Chapter 07 &rarr;
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CHAPTER 07: INTERACTIVE GOVERNANCE SIMULATOR // 4 SCENARIOS                */}
        {/* ========================================================================= */}
        <section id="chapter-07" className="space-y-6 scroll-mt-24">
          <div className="border-b-2 border-slate-300 pb-2 flex items-center justify-between">
            <div className="font-mono text-xs font-black uppercase tracking-widest text-[#141414]/65">
              CHAPTER 07 // INTERACTIVE SIMULATOR
            </div>
            <span className="font-mono text-[10px] text-slate-500 uppercase">Hands-on Sandbox Simulation</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight font-mono">
                Explore governed scenarios in the sandbox.
              </h3>
              <p className="text-sm text-slate-700 mt-2 max-w-2xl leading-relaxed">
                Experience how the lifecycle kernel handles happy paths, failures, bounded repairs, and unauthorized scope creep.
              </p>
            </div>
            <button
              onClick={() => onLaunchSandbox("durable_task")}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-amber-500 font-mono text-xs font-black uppercase border border-slate-200 rounded-xl shadow-xs cursor-pointer shrink-0"
            >
              Open Full Sandbox
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Quick Fix Scenario */}
            <div className="border border-slate-200 bg-white rounded-2xl p-5 flex flex-col justify-between shadow-sm border-t-4 border-t-emerald-600">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-black bg-emerald-700 text-white px-2 py-0.5 uppercase">SCENARIO 00</span>
                  <span className="font-mono text-[9px] text-emerald-800 font-bold uppercase">2 Steps // Governed Fast Path</span>
                </div>
                <h4 className="font-mono font-black text-sm uppercase">Quick Fix (1-2 Files)</h4>
                <p className="text-xs text-slate-700 leading-relaxed mt-2">
                  Need a surgical patch for a typo or 1-2 files? The coding agent executes under a bounded fast-path Contract (&le;2 files, &le;60 modified lines ceiling), strictly enforcing limits while automating closeout.
                </p>
              </div>
              <button
                onClick={() => onLaunchSandbox("quick_fix")}
                className="mt-4 w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-slate-300 py-2 font-mono text-xs font-black uppercase flex items-center justify-center gap-2 cursor-pointer"
              >
                Launch Quick Fix <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Canonical Task */}
            <div className="border border-slate-200 bg-white rounded-2xl p-5 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-black bg-[#141414] text-white px-2 py-0.5 uppercase">SCENARIO 01</span>
                  <span className="font-mono text-[9px] text-slate-500 font-bold uppercase">8 Steps // One-Go Confirmation</span>
                </div>
                <h4 className="font-mono font-black text-sm uppercase">The Ordinary Durable Task</h4>
                <p className="text-xs text-slate-700 leading-relaxed mt-2">
                  Conversational chat with the agent, planning candidate scope, and confirming all remaining steps in one go to implement, test, and finish.
                </p>
              </div>
              <button
                onClick={() => onLaunchSandbox("durable_task")}
                className="mt-4 w-full bg-slate-50 hover:bg-slate-200 border border-slate-300 py-2 font-mono text-xs font-black uppercase flex items-center justify-center gap-2 cursor-pointer"
              >
                Launch Canonical Flow <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Repair Loop */}
            <div className="border border-slate-200 bg-white rounded-2xl p-5 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-black bg-rose-700 text-white px-2 py-0.5 uppercase">SCENARIO 02</span>
                  <span className="font-mono text-[9px] text-slate-500 font-bold uppercase">6 Steps // Bounded Repair</span>
                </div>
                <h4 className="font-mono font-black text-sm uppercase">Validation Failure &amp; Bounded Repair</h4>
                <p className="text-xs text-slate-700 leading-relaxed mt-2">
                  See what happens when tests fail. agent-loop routes to repair with a strict budget of 2 attempts before escalating to a human, preventing token churn.
                </p>
              </div>
              <button
                onClick={() => onLaunchSandbox("repair_loop")}
                className="mt-4 w-full bg-slate-50 hover:bg-slate-200 border border-slate-300 py-2 font-mono text-xs font-black uppercase flex items-center justify-center gap-2 cursor-pointer"
              >
                Launch Repair Flow <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Scope Guard */}
            <div className="border border-slate-200 bg-white rounded-2xl p-5 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-black bg-[#2563EB] text-white px-2 py-0.5 uppercase">SCENARIO 03</span>
                  <span className="font-mono text-[9px] text-slate-500 font-bold uppercase">5 Steps // Fail-Closed</span>
                </div>
                <h4 className="font-mono font-black text-sm uppercase">Scope Guard &amp; Contract Refusal</h4>
                <p className="text-xs text-slate-700 leading-relaxed mt-2">
                  Watch the kernel immediately refuse candidate registration when an agent modifies config/auth.php outside its approved Contract whitelist.
                </p>
              </div>
              <button
                onClick={() => onLaunchSandbox("scope_guard")}
                className="mt-4 w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-2 rounded-lg font-mono text-xs font-black uppercase flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                Launch Scope Guard <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Learning Promoted */}
            <div className="border border-slate-200 bg-white rounded-2xl p-5 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-black bg-indigo-700 text-white px-2 py-0.5 uppercase">SCENARIO 04</span>
                  <span className="font-mono text-[9px] text-slate-500 font-bold uppercase">3 Steps // Durable Enforcement</span>
                </div>
                <h4 className="font-mono font-black text-sm uppercase">Finding to Durable Enforcement</h4>
                <p className="text-xs text-slate-700 leading-relaxed mt-2">
                  Corroborated findings lead to a human-approved durable decision. The repository team then implements the chosen check (custom PHPStan rule, php-cs-fixer, or test) with zero prompt landfill.
                </p>
              </div>
              <button
                onClick={() => onLaunchSandbox("learning_promoted")}
                className="mt-4 w-full bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-lg font-mono text-xs font-black uppercase flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                Launch Learning Flow <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Chapter 7 -> Chapter 8 Bridge */}
          <div className="border border-slate-200 rounded-xl bg-slate-50 p-4 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-indigo-700" />
              <span className="font-black uppercase text-slate-800">CONNECTING TO CHAPTER 08:</span>
              <span className="text-slate-600 font-sans">
                Need the exact commands, arguments, and CLI inputs/outputs? Inspect the complete CLI Command Playbook.
              </span>
            </div>
            <button
              onClick={() => scrollToChapter("chapter-08")}
              className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 font-black uppercase text-[11px] shrink-0 cursor-pointer"
            >
              Explore Chapter 08 &rarr;
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CHAPTER 08: CLI COMMAND PLAYBOOK                                          */}
        {/* ========================================================================= */}
        <section id="chapter-08" className="space-y-6 scroll-mt-24">
          <div className="border-b-2 border-slate-300 pb-2 flex items-center justify-between">
            <div className="font-mono text-xs font-black uppercase tracking-widest text-[#141414]/65">
              CHAPTER 08 // CLI PLAYBOOK
            </div>
            <span className="font-mono text-[10px] text-slate-500 uppercase">Exact CLI Contract &amp; Diagnostic Surfaces</span>
          </div>

          <div className="border border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 bg-white/95 backdrop-blur-md flex items-center justify-between gap-4">
              <div>
                <h3 className="font-mono text-lg font-black uppercase">Front doors first, specialist commands second.</h3>
                <p className="text-xs text-slate-600 mt-0.5">Select a command to view its input, output, guarantees, and boundaries.</p>
              </div>
              <TermIcon className="w-5 h-5 text-slate-700" />
            </div>

            <div className="flex flex-wrap border-b border-slate-300 bg-slate-100">
              {(Object.keys(cliCommands) as Array<keyof typeof cliCommands>).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedCliTab(key)}
                  className={`px-4 py-3 font-mono text-[10px] font-black uppercase border-r border-slate-300 cursor-pointer ${
                    selectedCliTab === key ? "bg-[#141414] text-white" : "hover:bg-white"
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-[#111827] text-slate-100 border border-slate-200 rounded-xl p-4 overflow-x-auto">
                <code className="font-mono text-xs whitespace-pre">$ {selectedCommand.cmd}</code>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{selectedCommand.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-emerald-700 bg-emerald-50 p-4">
                  <div className="font-mono text-[10px] font-black uppercase text-emerald-800 mb-2">What it does</div>
                  <p className="text-xs text-slate-700 leading-relaxed">{selectedCommand.does}</p>
                </div>
                <div className="border border-rose-700 bg-rose-50 p-4">
                  <div className="font-mono text-[10px] font-black uppercase text-rose-800 mb-2">What it does not do</div>
                  <p className="text-xs text-slate-700 leading-relaxed">{selectedCommand.doesNot}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[10px]">
                <div className="bg-slate-100 p-3 border border-slate-300">
                  <strong>INPUT:</strong> {selectedCommand.input}
                </div>
                <div className="bg-slate-100 p-3 border border-slate-300">
                  <strong>OUTPUT:</strong> {selectedCommand.output}
                </div>
              </div>
            </div>
          </div>

          {/* Chapter 8 -> Chapter 9 Bridge */}
          <div className="border border-slate-200 rounded-xl bg-slate-50 p-4 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-indigo-700" />
              <span className="font-black uppercase text-slate-800">CONNECTING TO CHAPTER 09:</span>
              <span className="text-slate-600 font-sans">
                When should someone NOT use this tool? What are the architectural trade-offs? Read the honest boundaries and technical FAQ.
              </span>
            </div>
            <button
              onClick={() => scrollToChapter("chapter-09")}
              className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 font-black uppercase text-[11px] shrink-0 cursor-pointer"
            >
              Explore Chapter 09 &rarr;
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CHAPTER 09: HONEST BOUNDARIES & TECHNICAL FAQ                              */}
        {/* ========================================================================= */}
        <section id="chapter-09" className="space-y-8 scroll-mt-24">
          <div className="border-b-2 border-slate-300 pb-2 flex items-center justify-between">
            <div className="font-mono text-xs font-black uppercase tracking-widest text-[#141414]/65">
              CHAPTER 09 // BOUNDARIES &amp; FAQ
            </div>
            <span className="font-mono text-[10px] text-slate-500 uppercase">Integrity, Non-Goals &amp; Deep Questions</span>
          </div>

          {/* When NOT to use Agent Loop */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight font-mono">
                When should someone NOT use Agent Loop?
              </h3>
              <p className="text-sm text-slate-700 mt-1 max-w-2xl">
                Technical credibility requires knowing where a tool stops being appropriate. Agent Loop is an engineering governance system, not a generic AI wrapper.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {whenNotToUse.map((item, idx) => (
                <div key={idx} className="border border-slate-200 bg-white rounded-2xl p-5 shadow-sm flex gap-3.5 items-start">
                  <div className="w-7 h-7 bg-amber-100 border border-amber-500 flex items-center justify-center font-mono font-black text-xs text-amber-900 shrink-0 mt-0.5">
                    ✕
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-mono font-black text-sm uppercase text-[#141414]">{item.title}</h4>
                    <p className="text-xs text-slate-700 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dogfooded Governance */}
          <div className="border border-slate-200 rounded-xl bg-[#141414] text-white p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(251,191,36,1)]">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-8 items-center">
              <div>
                <div className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-300">DOGFOODED GOVERNANCE</div>
                <h3 className="font-mono text-2xl font-black uppercase mt-2">The workflow is used to change the workflow.</h3>
              </div>
              <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
                <p>
                  agent-loop is developed through the same evidence, review, ownership, release, and installed-consumer paths it asks downstream repositories to use.
                </p>
                <p>
                  The useful credibility claim is not “trust the framework.” It is that lifecycle defects, owner-boundary mistakes, and false dependency floors can be turned into reproducible tests and package-owned fixes.
                </p>
              </div>
            </div>
          </div>

          {/* Runtime Credentials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-slate-200 bg-white rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Wrench className="w-5 h-5 text-indigo-700" />
                <h4 className="font-mono font-black uppercase">Built in PHP for inspectability</h4>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                The CLI is Composer-native and runs on PHP 8.3+. Its workflow code can be inspected, tested, statically analyzed, and improved from the same repositories it governs instead of hiding policy in a remote orchestration service.
              </p>
            </div>
            <div className="border border-slate-200 bg-white rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-emerald-700" />
                <h4 className="font-mono font-black uppercase">Portable host support</h4>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                Package-owned instructions, skills, and agent-role assets can target Codex, Claude Code, OpenCode, Copilot, Gemini CLI, and Antigravity. Host-specific policy projection is capability-dependent rather than falsely claimed universal.
              </p>
            </div>
          </div>

          {/* FAQs */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight font-mono">Frequently answered queries</h3>
            </div>
            <div className="border border-slate-200 rounded-xl divide-y-2 divide-[#141414] bg-white">
              {faqItems.map((item, index) => (
                <div key={item.q}>
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex items-center justify-between gap-4 p-4 text-left cursor-pointer hover:bg-slate-50"
                  >
                    <span className="font-mono text-sm font-black">{item.q}</span>
                    <span className="font-mono font-black">{expandedFaq === index ? "−" : "+"}</span>
                  </button>
                  {expandedFaq === index && (
                    <div className="px-4 pb-4 text-sm text-slate-700 leading-relaxed bg-slate-50">{item.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CALL TO ACTION FOOTER - STANDARDIZED BRAND ENVIRONMENT */}
        <section className="text-center border border-slate-800 rounded-2xl bg-gradient-to-br from-[#071426] to-[#0B1F46] text-white p-8 md:p-12 shadow-xl space-y-6 relative overflow-hidden">
          {/* Subtle background infinity watermark */}
          <div className="absolute right-[-40px] top-[-30px] opacity-15 pointer-events-none">
            <AgentLoopMark className="w-[500px] h-[250px]" idPrefix="footer-bg-mark" />
          </div>

          <div className="flex justify-center relative z-10">
            <AgentLoopLogo layout="stacked" size={48} variant="light" />
          </div>

          <h3 className="font-mono text-2xl md:text-3xl font-black uppercase text-[#F8FAFC] tracking-tight relative z-10">
            Make the hand-offs explicit.
          </h3>
          <p className="text-sm max-w-2xl mx-auto leading-relaxed text-slate-300 relative z-10">
            Start with the local CLI, let <code className="font-mono font-bold bg-white/10 px-1 text-[#18D7E8]">enter</code> tell the host what is actually next, and keep human authority where it matters instead of spreading it across prose.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2 relative z-10">
            <button
              onClick={() => onLaunchSandbox()}
              className="px-6 py-3 bg-gradient-to-r from-[#6428FF] via-[#1688FF] to-[#18D7E8] hover:opacity-95 text-white rounded-lg font-mono text-xs font-bold uppercase cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
            >
              <TermIcon className="w-4 h-4" /> Open lifecycle sandbox
            </button>
            <a
              href="https://github.com/voku/agent-loop"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 hover:border-white/20 rounded-lg font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all"
            >
              <GitPullRequest className="w-4 h-4" /> GitHub repository
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white mt-16 md:mt-24 py-10 px-4 md:px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <AgentLoopLogo size={22} variant="dark" />
            <span className="text-xs text-slate-500 font-mono">
              Governed local workflows for coding agents.
            </span>
          </div>

          <div className="flex items-center flex-wrap justify-center gap-5 text-xs font-mono text-slate-500">
            <a
              href="https://github.com/voku/agent-loop"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-900 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://packagist.org/packages/voku/agent-loop"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-900 transition-colors"
            >
              Packagist
            </a>
            <button
              onClick={() => onLaunchSandbox()}
              className="hover:text-blue-600 font-bold transition-colors cursor-pointer"
            >
              Sandbox
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setIsBrandSpecOpen(true)}
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              title="Brand & Logo specification"
            >
              <Palette className="w-3.5 h-3.5 text-slate-400" />
              <span>Brand Spec</span>
            </button>
          </div>
        </div>
      </footer>

      {/* BRAND & LOGO SPECIFICATION MODAL */}
      <BrandSpecModal isOpen={isBrandSpecOpen} onClose={() => setIsBrandSpecOpen(false)} />
    </div>
  );
}
