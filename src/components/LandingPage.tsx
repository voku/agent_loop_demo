import React, { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  Check,
  CheckCircle,
  Copy,
  FileCheck,
  FileCode,
  FileWarning,
  GitBranch,
  GitPullRequest,
  Layers,
  Map,
  PackageCheck,
  Scale,
  Search,
  ShieldAlert,
  ShieldCheck,
  Terminal as TermIcon,
  User,
  Wrench,
  XCircle
} from "lucide-react";
import {
  CliCommand,
  EvidenceComparison,
  FaqItem,
  HumanDecisionBoundary,
  PackageSpec
} from "../types";

interface LandingPageProps {
  onLaunchSandbox: () => void;
}

const cliCommands: Readonly<Record<string, CliCommand>> = {
  enter: {
    cmd: "vendor/bin/agent-loop enter DEMO-1 --format=json",
    description: "Read the current owner-backed lifecycle state and receive the canonical next action.",
    does: "Reconciles deterministic post-approval preparation when needed and returns mutation_ready, next_action_kind, next_action, and owner-backed references.",
    doesNot: "Invent a parallel phase order or silently broaden human-approved task authority.",
    input: "Task id + durable Contract/Run state",
    output: "Structured lifecycle projection with the current next action"
  },
  plan: {
    cmd: "vendor/bin/agent-loop workflow plan DEMO-1 --by lars --file src/Signup.php --goal \"Add validated signup guards.\" --validation \"composer test\"",
    description: "Persist a durable candidate Contract for the task when enter requests planning.",
    does: "Records task intent, mutation scope, validation, acceptance criteria, and selected policy as a versioned candidate Contract.",
    doesNot: "Create a governed Run, allocate a Session, compile Recall, or constitute human approval.",
    input: "User intent + bounded repository evidence",
    output: "Candidate Contract revision"
  },
  finish: {
    cmd: "vendor/bin/agent-loop finish DEMO-1 --format=json",
    description: "Use the lifecycle kernel as the deterministic close-out front door.",
    does: "Reconciles implementation-bound evidence and routes the first decisive validation, review, Learning, risk, or close action through next_action_kind / next_action.",
    doesNot: "Require the host to maintain a copied checklist of internal gates or infer workflow legality from file paths.",
    input: "Current approved Contract + implementation/evidence identity",
    output: "Canonical next action or complete/none"
  },
  status: {
    cmd: "vendor/bin/agent-loop workflow status DEMO-1 --format=json",
    description: "Inspect durable lifecycle state without creating a second happy path.",
    does: "Provides a read-only diagnostic projection for recovery, debugging, and external integrations.",
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
  }
};

const workflowSteps = [
  { label: "Enter", text: "Ask the lifecycle kernel for the current state and canonical next action." },
  { label: "Contract", text: "Persist task intent and scope only when the kernel asks for planning." },
  { label: "Authority", text: "A human approves the exact Contract revision when a real decision boundary is reached." },
  { label: "Host Work", text: "Implement with normal repository tools only when mutation is authorized." },
  { label: "Finish", text: "Let the kernel reconcile evidence and expose the next decisive action." },
  { label: "Complete", text: "Stop when next_action_kind is none and the governed Run is complete." }
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
    domain: "Test Suite Verification",
    claim: 'Agent says: "I ran composer test and all 18 test suites passed with 0 errors."',
    claimFlaw: "Hallucinated stdout, cached stale results, or skipped execution entirely. In natural language chat, this claim cannot be distinguished from reality.",
    evidenceArtifact: "agent-session/runs/DEMO-1/evidence/test_execution.json",
    evidenceCheck: "Recorded process invocation `composer test`, exit code 0, execution duration, and hash of working-tree implementation at time of run.",
    ownerPackage: "voku/agent-session & voku/agent-loop"
  },
  {
    domain: "Scope & Mutation Boundary",
    claim: 'Agent says: "I only changed src/Signup.php as authorized."',
    claimFlaw: "Silent edits in database migrations, bootstrap configs, or global helpers go unnoticed until staging crashes.",
    evidenceArtifact: "Contract revision diff boundary + Git working-tree status",
    evidenceCheck: "Kernel checks actual modified files against approved Contract scope [src/Signup.php]. Any foreign path mutation triggers an automatic out-of-scope halt.",
    ownerPackage: "voku/agent-loop"
  },
  {
    domain: "Context & Guidance Hygiene",
    claim: 'Agent says: "I kept all historical project rules in my context memory."',
    claimFlaw: "Landfill context: temporary workarounds from 3 weeks ago conflict with modern rules; prompt tokens drown in obsolete chatter.",
    evidenceArtifact: "agent-recall-compiler briefing with provenance hash",
    evidenceCheck: "Deterministic token-budgeted prompt compiled strictly from active, human-approved Learning rules and symbol intelligence, excluding dead session notes.",
    ownerPackage: "voku/agent-recall-compiler"
  },
  {
    domain: "Durable Learning Promotion",
    claim: 'Agent says: "I noted this edge-case in MEMORY.md for all future sessions."',
    claimFlaw: "Unchecked markdown edits create contradictory instructions, hallucinated architecture guidelines, and prompt drift across developers.",
    evidenceArtifact: "infra/doc/agent-learning/proposals/candidate/*.json",
    evidenceCheck: "Structured finding note with reproducible test evidence, reviewed and promoted into a project guideline only through explicit human approval.",
    ownerPackage: "voku/agent-learning"
  }
];

const decisionBoundaries: readonly HumanDecisionBoundary[] = [
  {
    role: "Human-Owned",
    decision: "Contract Goal & Scope Approval",
    justification: "Only humans define what problem is being solved and which files the agent has permission to touch.",
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

const packages: readonly PackageSpec[] = [
  {
    badge: "CORE",
    name: "voku/agent-loop",
    role: "Kernel & Governance",
    responsibility: "Contract/Run lifecycle, cross-owner policy, approvals, routing, quality gates, and host-facing projections.",
    boundary: "Does not parse board markdown or manage working tree git directly."
  },
  {
    badge: "BOARD",
    name: "voku/agent-kanban",
    role: "Board & Tasks",
    responsibility: "Git-native Markdown work items, deterministic parsing, revision identity, and safe board mutation.",
    boundary: "Owns task cards and columns; does not govern run lifecycles."
  },
  {
    badge: "STATE",
    name: "voku/agent-session",
    role: "Working Memory",
    responsibility: "Task-local mutable session state, validation evidence, checkpoints, and pruneable retention.",
    boundary: "Scratchpad and evidence storage; intentionally discarded after task close."
  },
  {
    badge: "INTEL",
    name: "voku/agent-map",
    role: "Code Intelligence",
    responsibility: "Structural and semantic PHP repository maps, search, callers, callees, impact, and edit context.",
    boundary: "Read-only code graph generation; does not execute code or edit files."
  },
  {
    badge: "RECALL",
    name: "voku/agent-recall-compiler",
    role: "Context & Prompts",
    responsibility: "Governed briefing, provenance, task-scoped Recall, review semantics, and L2 operating-prompt recipes.",
    boundary: "Compiles bounded prompt budgets; does not generate model completions."
  },
  {
    badge: "LEARN",
    name: "voku/agent-learning",
    role: "Durable Learning",
    responsibility: "Reviewable findings, LearningNotes, proposals, evidence, lineage, and durable Learning decisions.",
    boundary: "Maintains durable organizational memory; distinct from task-local sessions."
  },
  {
    badge: "RUN",
    name: "voku/agent-loop-runner",
    role: "Execution Plane",
    responsibility: "Optional external process supervisor with isolated Git worktrees and coding-host adapters.",
    boundary: "Execution supervisor; downstream consumer of the core CLI."
  },
  {
    badge: "UI",
    name: "voku/agent-ui",
    role: "Control Plane",
    responsibility: "Local server-rendered human cockpit for board, task workbench, evidence, and code-intelligence views.",
    boundary: "Human inspection dashboard; read-only projections of owner state."
  },
  {
    badge: "SKILLS",
    name: "voku/agent-skills",
    role: "Guidance Catalog",
    responsibility: "Portable engineering skills, review lenses, and reusable static-analysis guidance.",
    boundary: "Static procedural guidance; portable across six distinct coding hosts."
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

export default function LandingPage({ onLaunchSandbox }: LandingPageProps) {
  const [copiedText, setCopiedText] = useState(false);
  const [selectedCliTab, setSelectedCliTab] = useState<keyof typeof cliCommands>("enter");
  const [selectedEvidenceIdx, setSelectedEvidenceIdx] = useState<number>(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText("composer require --dev voku/agent-loop");
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const selectedCommand = cliCommands[selectedCliTab];
  const activeEvidence = evidenceComparisons[selectedEvidenceIdx];

  return (
    <div className="bg-[#E4E3E0] text-[#141414] min-h-screen font-sans antialiased selection:bg-[#141414] selection:text-white pb-16">
      <header className="border-b-2 border-[#141414] bg-[#F0EFEC] px-6 py-4 sticky top-0 z-50 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-[#141414] text-[#E4E3E0] flex items-center justify-center font-bold font-mono text-sm tracking-tighter shrink-0">AL_</div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-sm md:text-base uppercase tracking-widest">agent-loop</span>
                <span className="bg-[#141414] text-[#E4E3E0] text-[9px] font-mono font-bold px-1.5 py-0.5 uppercase">PHP 8.3+ CLI</span>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-mono font-black px-1.5 py-0.5 border border-emerald-400">LOCAL-FIRST</span>
              </div>
              <p className="text-[10px] text-[#141414]/75 font-mono uppercase tracking-widest mt-0.5 truncate">Governed lifecycle for coding-agent work</p>
            </div>
          </div>
          <button
            onClick={onLaunchSandbox}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-[#141414] font-black font-mono text-xs uppercase tracking-wider border-2 border-[#141414] shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] cursor-pointer shrink-0"
          >
            Lifecycle Sandbox
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-12 md:pt-16 space-y-16">
        {/* HERO SECTION */}
        <section className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#141414]/15 font-mono text-[10px] font-bold text-slate-600 uppercase tracking-wider rounded-full">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            Open-source local orchestration CLI
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[1.1] font-mono">Better workflows beat bigger context windows.</h1>
          <p className="text-sm md:text-base text-slate-700 leading-relaxed max-w-2xl mx-auto">
            Your coding agent does not need a second hidden state machine in its prompt. It needs a governed workflow.
            <strong className="text-[#141414]"> agent-loop</strong> keeps durable task authority, bounded context, implementation evidence, review, and Learning explicit while the coding host remains free to use normal repository tools.
          </p>
          <div className="inline-block bg-[#141414] text-[#F0EFEC] border-2 border-[#141414] px-4 py-2 font-mono text-[11px] font-black uppercase shadow-[4px_4px_0px_0px_rgba(251,191,36,1)]">
            Git versions code. Agent Loop versions engineering decisions.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <div className="flex items-center bg-white border-2 border-[#141414] font-mono text-xs font-bold divide-x divide-[#141414] shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] w-full max-w-md sm:w-auto">
              <span className="px-3 py-2.5 text-slate-400 select-none bg-slate-50">$</span>
              <span className="px-4 py-2.5 text-slate-800 select-all font-semibold flex-1">composer require --dev voku/agent-loop</span>
              <button onClick={copyToClipboard} className="px-3 py-2.5 hover:bg-[#F0EFEC] cursor-pointer" title="Copy install command">
                {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <button onClick={onLaunchSandbox} className="w-full sm:w-auto px-5 py-3 bg-[#141414] hover:bg-slate-800 text-white font-black font-mono text-xs uppercase tracking-widest border-2 border-[#141414] flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] cursor-pointer">
              Explore lifecycle
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </section>

        {/* METRICS / CREDIBILITY BAR */}
        <section className="grid grid-cols-2 md:grid-cols-4 border-2 border-[#141414] bg-[#F0EFEC] divide-x divide-y md:divide-y-0 divide-[#141414] text-center font-mono font-bold uppercase shadow-[6px_6px_0px_0px_rgba(20,20,20,1)] select-none">
          <div className="py-4 px-2"><div className="text-xl font-black">PHP 8.3+</div><div className="text-[9px] text-slate-500 tracking-wider mt-0.5">Runtime floor</div></div>
          <div className="py-4 px-2"><div className="text-xl font-black text-indigo-700">LOCAL-FIRST</div><div className="text-[9px] text-slate-500 tracking-wider mt-0.5">Files + Git evidence</div></div>
          <div className="py-4 px-2"><div className="text-xl font-black text-emerald-700">9 PACKAGES</div><div className="text-[9px] text-slate-500 tracking-wider mt-0.5">Focused ownership</div></div>
          <div className="py-4 px-2"><div className="text-xl font-black text-amber-700">6 HOSTS</div><div className="text-[9px] text-slate-500 tracking-wider mt-0.5">Portable agent assets</div></div>
        </section>

        {/* SECTION 1: WHY THIS EXISTS / GRAVEYARD */}
        <section className="grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-6 items-stretch">
          <div className="border-2 border-[#141414] bg-white p-6 space-y-4 shadow-[5px_5px_0px_0px_rgba(20,20,20,1)]">
            <div>
              <h2 className="font-mono text-[10px] font-black uppercase tracking-widest text-[#141414]/65">QUESTION 1 // THE REAL PROBLEM</h2>
              <h3 className="text-xl font-black uppercase tracking-tight font-mono mt-1">Prompt piles decay. Owner-backed workflow state can be checked.</h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              Coding-agent setups tend to accumulate chat history, rules, workaround notes, and copied gate lists. Eventually the host is expected to remember workflow law from prose. agent-loop moves that authority into durable Contracts, package-owned state, and an executable lifecycle kernel.
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              The goal is not maximum automation. It is explicit authority: what may change, which evidence belongs to the current implementation, which decision is human-owned, and what the next action actually is.
            </p>
          </div>
          <div className="border-2 border-[#141414] bg-[#141414] text-[#F0EFEC] p-6 shadow-[5px_5px_0px_0px_rgba(251,191,36,1)]">
            <div className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-300 mb-4">THE FAMILIAR GRAVEYARD</div>
            <div className="space-y-2 font-mono text-sm">
              {["MEMORY.md", "project-rules.md", "agent-notes.md", "lessons-learned.md", "MEMORY_FINAL.md"].map((name) => (
                <div key={name} className="border border-white/20 px-3 py-2 bg-white/5">{name}</div>
              ))}
            </div>
            <p className="text-xs text-slate-300 mt-4 leading-relaxed">More files can preserve more text without preserving which text still has authority. That distinction is the entire point.</p>
          </div>
        </section>

        {/* SECTION 2: THE CURRENT HOST CONTRACT */}
        <section className="space-y-6">
          <div>
            <h2 className="font-mono text-[10px] font-black uppercase tracking-widest text-[#141414]/65">QUESTION 2 // MINIMAL NORMAL WORKFLOW</h2>
            <h3 className="text-2xl font-black uppercase tracking-tight font-mono mt-1">Enter. Obey the next action. Work when authorized. Finish.</h3>
          </div>
          <div className="border-2 border-[#141414] bg-[#111827] text-slate-100 p-5 shadow-[6px_6px_0px_0px_rgba(20,20,20,1)] overflow-x-auto">
            <pre className="font-mono text-xs leading-6 whitespace-pre">{`human/task intent
  -> agent-loop enter <task-id> --format=json
  -> obey next_action_kind / next_action
  -> host-native implementation when authorized (mutation_ready: true)
  -> agent-loop finish <task-id> --format=json
  -> obey next_action_kind / next_action
  -> complete (next_action_kind: "none")`}</pre>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {workflowSteps.map((step, index) => (
              <div key={step.label} className="border-2 border-[#141414] bg-white p-4 shadow-[3px_3px_0px_0px_rgba(20,20,20,1)]">
                <div className="font-mono text-[10px] font-black text-slate-500">{String(index + 1).padStart(2, "0")}</div>
                <h4 className="font-mono font-black uppercase mt-1">{step.label}</h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">{step.text}</p>
              </div>
            ))}
          </div>
          <div className="bg-amber-100 border-2 border-[#141414] p-4 text-sm leading-relaxed">
            <strong>Important:</strong> map, session, recall, review, learn, edit, and verify are still real commands. They are specialist, diagnostic, CI, or recovery surfaces, not a mandatory phase list that every host must memorize.
          </div>
        </section>

        {/* SECTION 3: STRUCTURED ROUTING */}
        <section className="space-y-5">
          <div>
            <h2 className="font-mono text-[10px] font-black uppercase tracking-widest text-[#141414]/65">STRUCTURED ROUTING</h2>
            <h3 className="text-2xl font-black uppercase tracking-tight font-mono mt-1">The host is told what kind of next action it received.</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {nextActionKinds.map(([kind, description]) => (
              <div key={kind} className="border border-[#141414] bg-[#F0EFEC] p-4 flex gap-3 items-start">
                <code className="font-mono text-[11px] font-black bg-[#141414] text-white px-2 py-1 shrink-0">{kind}</code>
                <p className="text-sm text-slate-700 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            The lifecycle result also exposes <code className="font-mono font-bold">mutation_ready</code> and owner-backed <code className="font-mono font-bold">manifest.references</code>. The host routes that authority; it does not reconstruct it from storage paths or copied documentation.
          </p>
        </section>

        {/* SECTION 4: EVIDENCE VS CLAIMS (STANDALONE SECTION) */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-mono text-[10px] font-black uppercase tracking-widest text-[#141414]/65">QUESTION 4 // EVIDENCE VS CLAIMS</h2>
              <h3 className="text-2xl font-black uppercase tracking-tight font-mono mt-1">Why chat assertions fail governance.</h3>
              <p className="text-sm text-slate-700 mt-2 max-w-2xl">
                In un-governed agent sessions, proof is conflated with prose. Agent Loop treats natural language assertions as unverified claims until package owners record tangible evidence.
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold shrink-0 bg-white border border-[#141414] p-2">
              <Scale className="w-4 h-4 text-indigo-700" />
              <span>Claims ≠ Evidence</span>
            </div>
          </div>

          <div className="border-2 border-[#141414] bg-white shadow-[6px_6px_0px_0px_rgba(20,20,20,1)] overflow-hidden">
            {/* Tab selector for evidence domains */}
            <div className="grid grid-cols-2 md:grid-cols-4 border-b-2 border-[#141414] bg-[#F0EFEC] divide-x divide-[#141414] font-mono text-xs">
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
                  <div>
                    <h5 className="font-mono text-[10px] font-black uppercase text-emerald-900">How Agent Loop enforces it:</h5>
                    <p className="text-xs text-emerald-950 mt-1 leading-relaxed">{activeEvidence.evidenceCheck}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#141414]/15 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-600 font-mono">
                <div>
                  <span className="font-bold text-slate-900 uppercase">Enforcing Package: </span>
                  <code className="bg-slate-200 px-1.5 py-0.5 text-slate-800 font-bold">{activeEvidence.ownerPackage}</code>
                </div>
                <div className="text-[11px] text-slate-500">
                  Evidence identity is sealed to the working-tree revision and active Contract hash.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: WHICH DECISIONS REMAIN HUMAN-OWNED? */}
        <section className="space-y-6">
          <div>
            <h2 className="font-mono text-[10px] font-black uppercase tracking-widest text-[#141414]/65">QUESTION 3 // AUTHORITY BOUNDARIES</h2>
            <h3 className="text-2xl font-black uppercase tracking-tight font-mono mt-1">Which decisions remain human-owned?</h3>
            <p className="text-sm text-slate-700 mt-2 max-w-2xl">
              Governance does not mean replacing humans with autonomous agents. It means making the hand-offs explicit so authority is never silently abdicated.
            </p>
          </div>

          <div className="border-2 border-[#141414] bg-white shadow-[6px_6px_0px_0px_rgba(20,20,20,1)] divide-y-2 divide-[#141414]">
            {decisionBoundaries.map((boundary, i) => (
              <div key={i} className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-[#F9F8F6] transition-colors">
                <div className="space-y-1.5 md:max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-[9px] font-black uppercase px-2 py-0.5 border ${
                      boundary.role === "Human-Owned"
                        ? "bg-amber-300 text-amber-950 border-[#141414]"
                        : boundary.role === "Kernel-Enforced"
                        ? "bg-indigo-100 text-indigo-950 border-indigo-300"
                        : "bg-slate-100 text-slate-800 border-slate-300"
                    }`}>
                      {boundary.role}
                    </span>
                    <h4 className="font-mono font-black text-sm uppercase text-[#141414]">{boundary.decision}</h4>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{boundary.justification}</p>
                </div>
                <div className="font-mono text-[11px] bg-[#F0EFEC] border border-[#141414]/30 p-2.5 shrink-0 max-w-sm">
                  <div className="text-[9px] text-slate-500 uppercase font-black mb-1">Enforcement Mechanism</div>
                  <div className="text-slate-800 font-semibold break-all">{boundary.mechanism}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6: THE COMPOSABLE ECOSYSTEM */}
        <section className="space-y-6">
          <div>
            <h2 className="font-mono text-[10px] font-black uppercase tracking-widest text-[#141414]/65">QUESTION 5 // PACKAGE RESPONSIBILITIES</h2>
            <h3 className="text-2xl font-black uppercase tracking-tight font-mono mt-1">9 focused packages, explicit ownership boundaries.</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map((pkg) => (
              <article key={pkg.name} className="border-2 border-[#141414] bg-white p-5 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-[9px] font-black bg-amber-300 border border-[#141414] px-2 py-0.5">{pkg.badge}</span>
                    <PackageCheck className="w-4 h-4 text-slate-700" />
                  </div>
                  <h4 className="font-mono font-black text-sm">{pkg.name}</h4>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500 mt-1">{pkg.role}</div>
                  <p className="text-xs text-slate-700 leading-relaxed mt-3">{pkg.responsibility}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200">
                  <div className="font-mono text-[9px] font-bold text-slate-500 uppercase">Ownership Boundary:</div>
                  <p className="text-[11px] text-slate-600 font-sans mt-0.5">{pkg.boundary}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* SECTION 7: WHEN TO NOT USE AGENT LOOP */}
        <section className="space-y-6">
          <div>
            <h2 className="font-mono text-[10px] font-black uppercase tracking-widest text-[#141414]/65">QUESTION 6 // HONEST BOUNDARIES</h2>
            <h3 className="text-2xl font-black uppercase tracking-tight font-mono mt-1">When should someone NOT use Agent Loop?</h3>
            <p className="text-sm text-slate-700 mt-2 max-w-2xl">
              Technical credibility requires knowing where a tool stops being appropriate. Agent Loop is an engineering governance system, not a generic AI wrapper.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {whenNotToUse.map((item, idx) => (
              <div key={idx} className="border-2 border-[#141414] bg-white p-5 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] flex gap-3.5 items-start">
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
        </section>

        {/* SECTION 8: CLI PLAYBOOK */}
        <section className="border-2 border-[#141414] bg-white shadow-[6px_6px_0px_0px_rgba(20,20,20,1)] overflow-hidden">
          <div className="px-5 py-4 border-b-2 border-[#141414] bg-[#F0EFEC] flex items-center justify-between gap-4">
            <div>
              <h2 className="font-mono text-[10px] font-black uppercase tracking-widest text-[#141414]/65">CLI PLAYBOOK</h2>
              <h3 className="font-mono text-lg font-black uppercase">Front doors first, specialist commands second.</h3>
            </div>
            <TermIcon className="w-5 h-5" />
          </div>
          <div className="flex flex-wrap border-b border-[#141414] bg-slate-100">
            {(Object.keys(cliCommands) as Array<keyof typeof cliCommands>).map((key) => (
              <button key={key} onClick={() => setSelectedCliTab(key)} className={`px-4 py-3 font-mono text-[10px] font-black uppercase border-r border-[#141414] cursor-pointer ${selectedCliTab === key ? "bg-[#141414] text-white" : "hover:bg-white"}`}>{key}</button>
            ))}
          </div>
          <div className="p-5 space-y-4">
            <div className="bg-[#111827] text-slate-100 border-2 border-[#141414] p-4 overflow-x-auto"><code className="font-mono text-xs whitespace-pre">$ {selectedCommand.cmd}</code></div>
            <p className="text-sm text-slate-700 leading-relaxed">{selectedCommand.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-emerald-700 bg-emerald-50 p-4"><div className="font-mono text-[10px] font-black uppercase text-emerald-800 mb-2">What it does</div><p className="text-xs text-slate-700 leading-relaxed">{selectedCommand.does}</p></div>
              <div className="border border-rose-700 bg-rose-50 p-4"><div className="font-mono text-[10px] font-black uppercase text-rose-800 mb-2">What it does not do</div><p className="text-xs text-slate-700 leading-relaxed">{selectedCommand.doesNot}</p></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[10px]"><div className="bg-slate-100 p-3 border border-slate-300"><strong>INPUT:</strong> {selectedCommand.input}</div><div className="bg-slate-100 p-3 border border-slate-300"><strong>OUTPUT:</strong> {selectedCommand.output}</div></div>
          </div>
        </section>

        {/* SECTION 9: ARCHITECTURAL PILLARS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-2 border-[#141414] bg-white p-5"><ShieldCheck className="w-5 h-5 mb-3" /><div className="font-mono text-[10px] font-black text-slate-500">01 / OWNER AUTHORITY</div><h3 className="font-mono font-black uppercase mt-1">One semantic owner per decision</h3><p className="text-xs text-slate-700 leading-relaxed mt-3">Loop coordinates cross-package policy while Kanban, Session, Map, Recall, and Learning keep their own state and semantics.</p></div>
          <div className="border-2 border-[#141414] bg-white p-5"><GitBranch className="w-5 h-5 mb-3" /><div className="font-mono text-[10px] font-black text-slate-500">02 / VERSIONED CONSENT</div><h3 className="font-mono font-black uppercase mt-1">Approval binds one Contract revision</h3><p className="text-xs text-slate-700 leading-relaxed mt-3">Changed authority means a new decision. Ordinary discovery and implementation inside the approved boundary do not need ceremonial re-approval.</p></div>
          <div className="border-2 border-[#141414] bg-white p-5"><Search className="w-5 h-5 mb-3" /><div className="font-mono text-[10px] font-black text-slate-500">03 / BOUNDED CONTEXT</div><h3 className="font-mono font-black uppercase mt-1">Curation over context landfill</h3><p className="text-xs text-slate-700 leading-relaxed mt-3">Map and Recall provide targeted source/navigation facts and task-scoped guidance instead of treating every old note as equally authoritative.</p></div>
        </section>

        {/* SECTION 10: DOGFOODED GOVERNANCE */}
        <section className="border-2 border-[#141414] bg-[#141414] text-white p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(251,191,36,1)]">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-8 items-center">
            <div>
              <div className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-300">DOGFOODED GOVERNANCE</div>
              <h3 className="font-mono text-2xl font-black uppercase mt-2">The workflow is used to change the workflow.</h3>
            </div>
            <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
              <p>agent-loop is developed through the same evidence, review, ownership, release, and installed-consumer paths it asks downstream repositories to use.</p>
              <p>The useful credibility claim is not “trust the framework.” It is that lifecycle defects, owner-boundary mistakes, and false dependency floors can be turned into reproducible tests and package-owned fixes.</p>
            </div>
          </div>
        </section>

        {/* SECTION 11: ENGINE & PLATFORM CREDENTIALS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-2 border-[#141414] bg-white p-6 space-y-4">
            <div className="flex items-center gap-3"><Wrench className="w-5 h-5" /><h3 className="font-mono font-black uppercase">Built in PHP for inspectability</h3></div>
            <p className="text-sm text-slate-700 leading-relaxed">The CLI is Composer-native and runs on PHP 8.3+. Its workflow code can be inspected, tested, statically analyzed, and improved from the same repositories it governs instead of hiding policy in a remote orchestration service.</p>
          </div>
          <div className="border-2 border-[#141414] bg-white p-6 space-y-4">
            <div className="flex items-center gap-3"><Layers className="w-5 h-5" /><h3 className="font-mono font-black uppercase">Portable host support</h3></div>
            <p className="text-sm text-slate-700 leading-relaxed">Package-owned instructions, skills, and agent-role assets can target Codex, Claude Code, OpenCode, Copilot, Gemini CLI, and Antigravity. Host-specific policy projection is capability-dependent rather than falsely claimed universal.</p>
          </div>
        </section>

        {/* SECTION 12: FAQS */}
        <section className="space-y-4">
          <div><h2 className="font-mono text-[10px] font-black uppercase tracking-widest text-[#141414]/65">TECHNICAL ENQUIRIES</h2><h3 className="text-2xl font-black uppercase tracking-tight font-mono mt-1">Frequently answered queries</h3></div>
          <div className="border-2 border-[#141414] divide-y-2 divide-[#141414] bg-white">
            {faqItems.map((item, index) => (
              <div key={item.q}>
                <button onClick={() => setExpandedFaq(expandedFaq === index ? null : index)} className="w-full flex items-center justify-between gap-4 p-4 text-left cursor-pointer hover:bg-[#F0EFEC]">
                  <span className="font-mono text-sm font-black">{item.q}</span>
                  <span className="font-mono font-black">{expandedFaq === index ? "−" : "+"}</span>
                </button>
                {expandedFaq === index && <div className="px-4 pb-4 text-sm text-slate-700 leading-relaxed bg-[#F0EFEC]">{item.a}</div>}
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 13: CALL TO ACTION FOOTER */}
        <section className="text-center border-2 border-[#141414] bg-amber-300 p-8 shadow-[6px_6px_0px_0px_rgba(20,20,20,1)] space-y-4">
          <div className="flex justify-center gap-3"><User className="w-5 h-5" /><Brain className="w-5 h-5" /><FileCheck className="w-5 h-5" /><Map className="w-5 h-5" /><Activity className="w-5 h-5" /></div>
          <h3 className="font-mono text-2xl font-black uppercase">Make the hand-offs explicit.</h3>
          <p className="text-sm max-w-2xl mx-auto">Start with the local CLI, let <code className="font-mono font-bold">enter</code> tell the host what is actually next, and keep human authority where it matters instead of spreading it across prose.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <button onClick={onLaunchSandbox} className="px-5 py-3 bg-[#141414] text-white border-2 border-[#141414] font-mono text-xs font-black uppercase cursor-pointer flex items-center justify-center gap-2"><TermIcon className="w-4 h-4" />Open lifecycle sandbox</button>
            <a href="https://github.com/voku/agent-loop" target="_blank" rel="noreferrer" className="px-5 py-3 bg-white text-[#141414] border-2 border-[#141414] font-mono text-xs font-black uppercase flex items-center justify-center gap-2"><GitPullRequest className="w-4 h-4" />GitHub repository</a>
          </div>
        </section>
      </main>
    </div>
  );
}

