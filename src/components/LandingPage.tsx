import React, { useState } from "react";
import {
  Activity,
  ArrowRight,
  Brain,
  Check,
  Copy,
  FileCheck,
  GitBranch,
  GitPullRequest,
  Layers,
  Map,
  PackageCheck,
  Search,
  ShieldCheck,
  Terminal as TermIcon,
  User,
  Wrench
} from "lucide-react";

interface LandingPageProps {
  onLaunchSandbox: () => void;
}

interface CliCommand {
  readonly cmd: string;
  readonly description: string;
  readonly does: string;
  readonly doesNot: string;
  readonly input: string;
  readonly output: string;
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

const packages = [
  ["CORE", "voku/agent-loop", "Kernel & Governance", "Contract/Run lifecycle, cross-owner policy, approvals, routing, quality gates, and host-facing projections."],
  ["BOARD", "voku/agent-kanban", "Board & Tasks", "Git-native Markdown work items, deterministic parsing, revision identity, and safe board mutation."],
  ["STATE", "voku/agent-session", "Working Memory", "Task-local mutable session state, validation evidence, checkpoints, and pruneable retention."],
  ["INTEL", "voku/agent-map", "Code Intelligence", "Structural and semantic PHP repository maps, search, callers, callees, impact, and edit context."],
  ["RECALL", "voku/agent-recall-compiler", "Context & Prompts", "Governed briefing, provenance, task-scoped Recall, review semantics, and L2 operating-prompt recipes."],
  ["LEARN", "voku/agent-learning", "Durable Learning", "Reviewable findings, LearningNotes, proposals, evidence, lineage, and durable Learning decisions."],
  ["RUN", "voku/agent-loop-runner", "Execution Plane", "Optional external process supervisor with isolated Git worktrees and coding-host adapters."],
  ["UI", "voku/agent-ui", "Control Plane", "Local server-rendered human cockpit for board, task workbench, evidence, and code-intelligence views."],
  ["SKILLS", "voku/agent-skills", "Guidance Catalog", "Portable engineering skills, review lenses, and reusable static-analysis guidance."]
] as const;

const faqItems = [
  {
    q: "Is agent-loop another coding agent?",
    a: "No. The coding host still performs implementation. agent-loop is the local workflow kernel around that host: durable task authority, bounded context, evidence, review, Learning, and canonical next-action routing. It is intentionally provider-independent."
  },
  {
    q: "Why is the happy path now enter -> work -> finish?",
    a: "Because the host should not duplicate the internal gate machine. enter and finish expose executable owner-backed policy through next_action_kind and next_action. Lower-level map, session, recall, review, learn, edit, and verify commands remain available for diagnostics, specialist work, CI, and recovery."
  },
  {
    q: "Does approval lock every discovered file forever?",
    a: "Approval seals the exact Contract revision and its mutation boundary. Discovery inside that approved boundary is ordinary implementation work. A real change to scope, product intent, policy, acceptance, accepted risk, or another authority-bearing decision can require a new human decision."
  },
  {
    q: "Does agent-loop run PHPUnit or PHPStan itself?",
    a: "Project tools remain project tools. agent-loop binds and evaluates evidence through the workflow owners instead of pretending that conversational claims are proof. Validation commands belong to the repository Contract and can be routed as lifecycle actions."
  },
  {
    q: "Why PHP 8.3+?",
    a: "The orchestration layer stays inspectable, local, Composer-native, and easy to dogfood inside ordinary PHP repositories. The tool can be modified, tested, and reviewed with the same language and engineering controls as the projects it governs."
  }
] as const;

export default function LandingPage({ onLaunchSandbox }: LandingPageProps) {
  const [copiedText, setCopiedText] = useState(false);
  const [selectedCliTab, setSelectedCliTab] = useState<keyof typeof cliCommands>("enter");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText("composer require --dev voku/agent-loop");
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const selectedCommand = cliCommands[selectedCliTab];

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

        <section className="grid grid-cols-2 md:grid-cols-4 border-2 border-[#141414] bg-[#F0EFEC] divide-x divide-y md:divide-y-0 divide-[#141414] text-center font-mono font-bold uppercase shadow-[6px_6px_0px_0px_rgba(20,20,20,1)] select-none">
          <div className="py-4 px-2"><div className="text-xl font-black">PHP 8.3+</div><div className="text-[9px] text-slate-500 tracking-wider mt-0.5">Runtime floor</div></div>
          <div className="py-4 px-2"><div className="text-xl font-black text-indigo-700">LOCAL-FIRST</div><div className="text-[9px] text-slate-500 tracking-wider mt-0.5">Files + Git evidence</div></div>
          <div className="py-4 px-2"><div className="text-xl font-black text-emerald-700">9 PACKAGES</div><div className="text-[9px] text-slate-500 tracking-wider mt-0.5">Focused ownership</div></div>
          <div className="py-4 px-2"><div className="text-xl font-black text-amber-700">6 HOSTS</div><div className="text-[9px] text-slate-500 tracking-wider mt-0.5">Portable agent assets</div></div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-6 items-stretch">
          <div className="border-2 border-[#141414] bg-white p-6 space-y-4 shadow-[5px_5px_0px_0px_rgba(20,20,20,1)]">
            <div>
              <h2 className="font-mono text-[10px] font-black uppercase tracking-widest text-[#141414]/65">WHY THIS EXISTS</h2>
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

        <section className="space-y-6">
          <div>
            <h2 className="font-mono text-[10px] font-black uppercase tracking-widest text-[#141414]/65">THE CURRENT HOST CONTRACT</h2>
            <h3 className="text-2xl font-black uppercase tracking-tight font-mono mt-1">Enter. Obey the next action. Work when authorized. Finish.</h3>
          </div>
          <div className="border-2 border-[#141414] bg-[#111827] text-slate-100 p-5 shadow-[6px_6px_0px_0px_rgba(20,20,20,1)] overflow-x-auto">
            <pre className="font-mono text-xs leading-6 whitespace-pre">{`human/task intent
  -> agent-loop enter <task-id> --format=json
  -> obey next_action_kind / next_action
  -> host-native implementation when authorized
  -> agent-loop finish <task-id> --format=json
  -> obey next_action_kind / next_action
  -> complete`}</pre>
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

        <section className="space-y-6">
          <div>
            <h2 className="font-mono text-[10px] font-black uppercase tracking-widest text-[#141414]/65">THE COMPOSABLE ECOSYSTEM</h2>
            <h3 className="text-2xl font-black uppercase tracking-tight font-mono mt-1">Focused packages, explicit owners.</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map(([badge, name, role, text]) => (
              <article key={name} className="border-2 border-[#141414] bg-white p-5 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
                <div className="flex items-center justify-between gap-2 mb-3"><span className="font-mono text-[9px] font-black bg-amber-300 border border-[#141414] px-2 py-0.5">{badge}</span><PackageCheck className="w-4 h-4" /></div>
                <h4 className="font-mono font-black text-sm">{name}</h4>
                <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500 mt-1">{role}</div>
                <p className="text-xs text-slate-700 leading-relaxed mt-3">{text}</p>
              </article>
            ))}
          </div>
        </section>

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

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-2 border-[#141414] bg-white p-5"><ShieldCheck className="w-5 h-5 mb-3" /><div className="font-mono text-[10px] font-black text-slate-500">01 / OWNER AUTHORITY</div><h3 className="font-mono font-black uppercase mt-1">One semantic owner per decision</h3><p className="text-xs text-slate-700 leading-relaxed mt-3">Loop coordinates cross-package policy while Kanban, Session, Map, Recall, and Learning keep their own state and semantics.</p></div>
          <div className="border-2 border-[#141414] bg-white p-5"><GitBranch className="w-5 h-5 mb-3" /><div className="font-mono text-[10px] font-black text-slate-500">02 / VERSIONED CONSENT</div><h3 className="font-mono font-black uppercase mt-1">Approval binds one Contract revision</h3><p className="text-xs text-slate-700 leading-relaxed mt-3">Changed authority means a new decision. Ordinary discovery and implementation inside the approved boundary do not need ceremonial re-approval.</p></div>
          <div className="border-2 border-[#141414] bg-white p-5"><Search className="w-5 h-5 mb-3" /><div className="font-mono text-[10px] font-black text-slate-500">03 / BOUNDED CONTEXT</div><h3 className="font-mono font-black uppercase mt-1">Curation over context landfill</h3><p className="text-xs text-slate-700 leading-relaxed mt-3">Map and Recall provide targeted source/navigation facts and task-scoped guidance instead of treating every old note as equally authoritative.</p></div>
        </section>

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
