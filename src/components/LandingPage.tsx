import React, { useState } from "react";
import {
  BookOpen,
  Terminal as TermIcon,
  GitPullRequest,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Brain,
  Layers,
  Cpu,
  User,
  ShieldCheck,
  FileCheck,
  FileText,
  Map,
  Sparkles,
  Trash2,
  Copy,
  Check,
  Activity,
  Maximize2,
  ChevronRight,
  HelpCircle
} from "lucide-react";

interface LandingPageProps {
  onLaunchSandbox: () => void;
}

export default function LandingPage({ onLaunchSandbox }: LandingPageProps) {
  const [copiedText, setCopiedText] = useState(false);
  const [selectedCliTab, setSelectedCliTab] = useState<string>("plan");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText("composer require voku/agent-loop --dev");
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const cliCommands = {
    plan: {
      cmd: "vendor/bin/agent-loop workflow plan DEMO-1",
      description: "Generates a versioned work-brief candidate for the targeted backlog task.",
      does: "Analyzes the backlog card, extracts in-scope and out-of-scope files, and drafts a candidate specification file in JSON.",
      doesNot: "Modify active codebase files, execute coding agents, or make changes to any production directories.",
      input: "todo/cards/DEMO-1.md",
      output: "session_plan/2026-07-14-demo-1/work-brief.json"
    },
    approve: {
      cmd: "vendor/bin/agent-loop workflow approve DEMO-1 --by lars",
      description: "Records formal human developer authorization of the current work-brief revision.",
      does: "Verifies the brief matches the current target task, signs the brief status as 'approved', and locks the scope contract.",
      doesNot: "Generate patches, compile guidelines, or run codebase analyses.",
      input: "session_plan/2026-07-14-demo-1/work-brief.json (candidate)",
      output: "session_plan/2026-07-14-demo-1/work-brief.json (status: approved)"
    },
    map: {
      cmd: "vendor/bin/agent-loop map build",
      description: "Analyzes codebase structure and compiles a lightweight Abstract Syntax Tree (AST) token guide.",
      does: "Parses symbols, types, namespace hierarchies, and signatures in a highly compressed JSON dictionary for the agent's reference.",
      doesNot: "Retrieve external embeddings, connect to vector databases, or edit code files.",
      input: "src/*.php",
      output: ".agent-map/php-symbols.json"
    },
    verify: {
      cmd: "vendor/bin/agent-loop verify --strict",
      description: "Verifies workflow coherence, file consistency, and presence of registered external validation logs.",
      does: "Asserts that the applied file diffs match the approved brief scope, and verifies external test suite logs (PHPUnit/PHPStan) exist and passed.",
      doesNot: "Execute the test runner itself (such as vendor/bin/phpunit) directly. It verifies external evidence files.",
      input: "session_plan/2026-07-14-demo-1/work-brief.json, src/Signup.php",
      output: "session_plan/2026-07-14-demo-1/verification_summary.json (consistency_verify: OK)"
    },
    learn: {
      cmd: "vendor/bin/agent-loop learn validate --root infra/doc/agent-learning",
      description: "Validates local temporary findings schemas generated during the active coding session.",
      does: "Asserts syntax coherence, verifies the observation records, and maps the localized learnings back to targeted symbol structures.",
      doesNot: "Commit durable rules or automatically edit project guidelines.",
      input: "infra/doc/agent-learning/findings/*.json",
      output: "Schema verification results logged to console."
    },
    evaluate: {
      cmd: "vendor/bin/agent-loop learn guidance-evaluate --root infra/doc/agent-learning --write-candidates",
      description: "Evaluates the historical usefulness of guidelines and drafts durable rule candidate proposals.",
      does: "Scans outcome journals, updates recall metrics, purges unused cache, and writes candidate proposals for global promotion.",
      doesNot: "Merge proposals into active guidelines. Proposals are candidates requiring human validation.",
      input: "infra/doc/agent-learning/findings/*.json, recall-logs.json",
      output: "infra/doc/agent-learning/proposals/candidate/proposal.*.json"
    }
  };

  const faqItems = [
    {
      q: "Why PHP 8.3? Most AI engineering happens in Python or TypeScript.",
      a: "This is a deliberate architectural advantage. Because the orchestration tool is written in interpreted PHP, the coding agent itself can inspect, fix, and improve its own tooling during execution. If a command is missing or validation logic is faulty, the agent can apply a patch, continue the session, and submit the tooling upgrade as part of the pull request. It empowers the system to improve its own workflow recursively."
    },
    {
      q: "Is agent-loop a competitor to Claude Code, Aider, or Cursor?",
      a: "No. It is a complementary workflow layer. You use existing high-performance agents (Aider, Claude Code, Cursor, OpenCode) to write the actual code. agent-loop wraps their execution in an explicit engineering contract: planning, scope locking, selective recall compiled prior to execution, and rigorous verification gates."
    },
    {
      q: "What is 'context landfill' and how does agent-loop solve it?",
      a: "In naive autonomous structures, we paste everything—past chat logs, general markdown rules, old bug summaries—into the prompt. Over time, the context window swells with contradictory or irrelevant instructions. The agent repeats mistakes because of too much noise. agent-loop enforces explicit lifecycle stages. It separates temporary working files from durable knowledge, compiling only task-specific, triaged guidance for the agent prior to execution, and intentionally forgetting obsolete caching."
    },
    {
      q: "What does agent-loop verify if it doesn't run PHPUnit or PHPStan directly?",
      a: "agent-loop verify enforces architectural coherence. It checks that the modified files are strictly inside the approved brief's scope, that no unapproved files were changed, and that the external testing engines (like PHPUnit or PHPStan) have indeed generated a successful passing log. This decoupling ensures agent-loop remains a lean, deterministic validator of the hand-offs, rather than wrapping heavy external processes."
    },
    {
      q: "How does the 'Re-planning invalidates approval' rule work?",
      a: "If Human Reviewer Lars approves Revision 1 of a work brief, but then the task requirements shift and a new file is added to the scope, agent-loop marks Revision 1 as 'superseded' and invalidates the approval state. The CLI blocks execution until Lars reviews and formally approves the Revision 2 candidate brief. This protects repositories from scope creep and rogue agent edits."
    }
  ];

  return (
    <div className="bg-[#E4E3E0] text-[#141414] min-h-screen font-sans antialiased selection:bg-[#141414] selection:text-white pb-16">
      
      {/* Neo-brutalist Header */}
      <div className="border-b-2 border-[#141414] bg-[#F0EFEC] px-6 py-4 sticky top-0 z-50 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#141414] text-[#E4E3E0] flex items-center justify-center font-bold font-mono text-sm tracking-tighter">
              AL_
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm md:text-base uppercase tracking-widest">agent-loop</span>
                <span className="bg-[#141414] text-[#E4E3E0] text-[9px] font-mono font-bold px-1.5 py-0.2 uppercase border border-[#141414]">
                  PHP 8.3+ CLI
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-mono font-black px-1.5 py-0.2 border border-emerald-400">
                  Current
                </span>
              </div>
              <p className="text-[10px] text-[#141414]/75 font-mono uppercase tracking-widest mt-0.5">
                Local Governance Protocol for AI Coding Workflows
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onLaunchSandbox}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-[#141414] font-black font-mono text-xs uppercase tracking-wider border-2 border-[#141414] shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] hover:translate-y-[-1px] active:translate-y-[1px] transition-all cursor-pointer"
            >
              Launch Interactive Sandbox
            </button>
          </div>
        </div>
      </div>

      {/* Main Landing Page Content */}
      <div className="max-w-5xl mx-auto px-6 pt-12 md:pt-16 space-y-16">
        
        {/* HERO SECTION */}
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#141414]/15 font-mono text-[10px] font-bold text-slate-600 uppercase tracking-wider rounded-full">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            <span>Open-Source Local Orchestration CLI</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#141414] leading-[1.1] font-mono">
            Better workflows beat bigger context windows.
          </h1>
          <p className="text-sm md:text-base text-slate-700 leading-relaxed max-w-2xl mx-auto font-sans">
            AI coding agents don’t primarily fail due to small memory buffers. They fail because workflows don’t distinguish temporary changes from durable project rules. 
            <strong className="text-[#141414]"> agent-loop</strong> introduces a versioned, multi-actor local contract that eliminates context landfill and repeats of structural mistakes.
          </p>

          {/* Quick Copy Command Component */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <div className="flex items-center bg-white border-2 border-[#141414] font-mono text-xs font-bold divide-x divide-[#141414] shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] w-full max-w-sm sm:max-w-none sm:w-auto">
              <span className="px-3 py-2.5 text-slate-400 select-none bg-slate-50">$</span>
              <span className="px-4 py-2.5 text-slate-800 select-all font-semibold flex-1 sm:flex-initial">
                composer require voku/agent-loop --dev
              </span>
              <button
                onClick={copyToClipboard}
                className="px-3 py-2.5 hover:bg-[#F0EFEC] active:bg-[#DAD9D6] transition-colors cursor-pointer text-[#141414]"
                title="Copy package command"
              >
                {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            
            <button
              onClick={onLaunchSandbox}
              className="w-full sm:w-auto px-5 py-3 bg-[#141414] hover:bg-slate-800 text-white font-black font-mono text-xs uppercase tracking-widest border-2 border-[#141414] flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] hover:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
            >
              <span>Simulate Local CLI</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>

        {/* METRICS & CREDIBILITY SUB-BANNER */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-2 border-[#141414] bg-[#F0EFEC] divide-x divide-y md:divide-y-0 divide-[#141414] text-center font-mono font-bold uppercase shadow-[6px_6px_0px_0px_rgba(20,20,20,1)] select-none">
          <div className="py-4 px-2">
            <div className="text-xl font-black text-[#141414]">PHP 8.3+</div>
            <div className="text-[9px] text-slate-500 tracking-wider mt-0.5">CLI Architecture</div>
          </div>
          <div className="py-4 px-2">
            <div className="text-xl font-black text-indigo-700">100% LOCAL</div>
            <div className="text-[9px] text-slate-500 tracking-wider mt-0.5">No Cloud Lock-In</div>
          </div>
          <div className="py-4 px-2">
            <div className="text-xl font-black text-emerald-700">6 PACKAGES</div>
            <div className="text-[9px] text-slate-500 tracking-wider mt-0.5">Composable Ecosystem</div>
          </div>
          <div className="py-4 px-2">
            <div className="text-xl font-black text-amber-600">ZERO GLUE</div>
            <div className="text-[9px] text-slate-500 tracking-wider mt-0.5">Independent of APIs</div>
          </div>
        </div>

        {/* COMPARATIVE VISUALIZATION: LANDFILL VS GOVERNED LOOP */}
        <div className="space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="font-mono text-[10px] font-black uppercase tracking-widest text-[#141414]/65">THE CORE PROBLEM STATEMENT</h2>
            <h3 className="text-xl font-black uppercase tracking-tight font-mono">Drowning in Context vs. Governing Hand-offs</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Context Landfill Card */}
            <div className="border-2 border-[#141414] bg-white p-5 space-y-4 shadow-[4px_4px_0px_0px_rgba(239,68,68,0.2)]">
              <div className="flex items-center gap-2 border-b pb-3 border-red-200">
                <div className="w-6 h-6 bg-red-100 text-red-700 rounded-full flex items-center justify-center text-xs font-bold">✗</div>
                <div>
                  <h4 className="font-mono text-xs font-black uppercase text-red-700">The Context Landfill Approach</h4>
                  <p className="text-[9.5px] text-slate-400 font-mono">Endless accumulative accumulation</p>
                </div>
              </div>

              <ul className="space-y-2.5 text-[11.5px] text-slate-600 font-sans">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-mono font-bold mt-0.5">•</span>
                  <span><strong>Endless context dump:</strong> Past logs, chat history, and contradictory <code>MEMORY.md</code> files are continually concatenated.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-mono font-bold mt-0.5">•</span>
                  <span><strong>Invisible scope:</strong> The coding agent can modify any file in the workspace, causing silent regression or un-tracked changes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-mono font-bold mt-0.5">•</span>
                  <span><strong>Repeating past mistakes:</strong> Because transient hacks and durable rules are not segregated, agents easily reuse deprecated hacks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-mono font-bold mt-0.5">•</span>
                  <span><strong>Silent failure states:</strong> If tests fail, the agent struggles without scope boundaries, causing infinite loops of debugging.</span>
                </li>
              </ul>

              <div className="bg-red-50 border border-red-100 p-2 text-[9.5px] font-mono text-red-950 leading-relaxed">
                Result: Swelling token counts, sluggish feedback loops, high API costs, and silent architectural drift.
              </div>
            </div>

            {/* Governed Loop Card */}
            <div className="border-2 border-[#141414] bg-white p-5 space-y-4 shadow-[4px_4px_0px_0px_rgba(16,185,129,0.2)]">
              <div className="flex items-center gap-2 border-b pb-3 border-emerald-200">
                <div className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold">✓</div>
                <div>
                  <h4 className="font-mono text-xs font-black uppercase text-emerald-700">The Governed Loop Protocol</h4>
                  <p className="text-[9.5px] text-slate-400 font-mono">Versioned, explicit engineering stages</p>
                </div>
              </div>

              <ul className="space-y-2.5 text-[11.5px] text-slate-600 font-sans">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-mono font-bold mt-0.5">•</span>
                  <span><strong>Versioned Work Briefs:</strong> The task scope is locked inside a brief. Any plan modification invalidates approval instantly.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-mono font-bold mt-0.5">•</span>
                  <span><strong>Task-Scoped Selective Recall:</strong> Prior to coding, agent-loop compiles <em>only</em> relevant rules inside a clean folder.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-mono font-bold mt-0.5">•</span>
                  <span><strong>Rigid Verification Gates:</strong> Decoupled verification ensures file diff bounds are matched, and evidence log existences verified.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-mono font-bold mt-0.5">•</span>
                  <span><strong>Durable Learning Promotions:</strong> Findings are stored locally, requiring explicit human authorization to become global rules.</span>
                </li>
              </ul>

              <div className="bg-emerald-50 border border-emerald-100 p-2 text-[9.5px] font-mono text-emerald-950 leading-relaxed">
                Result: Minimal context sizes, deterministic scopes, complete audit logs, and zero repeating errors.
              </div>
            </div>

          </div>
        </div>

        {/* ARCHITECTURE DIAGRAM (TECHNICAL GRAPH) */}
        <div className="space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="font-mono text-[10px] font-black uppercase tracking-widest text-[#141414]/65">TECHNICAL WORKFLOW ARCHITECTURE</h2>
            <h3 className="text-xl font-black uppercase tracking-tight font-mono">The Four-Actor Governed Execution Cycle</h3>
          </div>

          <div className="border-2 border-[#141414] bg-white shadow-[6px_6px_0px_0px_rgba(20,20,20,1)] overflow-hidden">
            
            {/* Header tab */}
            <div className="bg-[#F0EFEC] border-b border-[#141414] px-4 py-2 flex items-center justify-between font-mono text-[9.5px] uppercase font-bold text-slate-500">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#141414]" />
                <span>governance_pipeline.txt</span>
              </div>
              <span className="bg-[#141414] text-amber-400 px-1.5 font-black text-[8px]">PROD ENG ARCH</span>
            </div>

            {/* ASCII diagram block */}
            <div className="p-4 bg-[#141414] text-slate-300 font-mono text-[9px] md:text-[10px] leading-relaxed overflow-x-auto whitespace-pre select-all">
{`+---------------------------------------------------------------------------------------------------------+
|                                    THE 10-STEP GOVERNED LOOP PIPELINE                                   |
+---------------------------------------------------------------------------------------------------------+

[01. INIT] -----------> [02. BOARD] -----------> [03. PLAN] -------------> [04. APPROVE] --------> [05. RECALL]
  CLI Installed.          Kanban task            Brief candidate          Human checks             Guidelines
  Doctor checked.        card analyzed.           is compiled.           brief bounds.           compiled.
                                                       |                       |
                                                       |                       | (re-plan invalidates)
                                                       v                       v
[10. MEMORY] <--------- [09. LEARN] <---------- [08. CLOSE] <------------ [07. VERIFY] <--------- [06. WORK]
  Durable proposal        Findings schema        Workflow closed.          Consistency              External agent
  human-promoted.         validated local.       Report compiled.        contracts verified.         edits code.
`}
            </div>

            {/* Explanatory breakdown of the 4 Actors */}
            <div className="p-5 bg-slate-50 border-t border-[#141414]/15 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans">
              <div className="space-y-1">
                <div className="flex items-center gap-1 font-mono text-[10.5px] font-black text-red-700 uppercase">
                  <User className="w-3.5 h-3.5" />
                  <span>1. Human</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Holds ultimate authority. Selects backlog tasks, approves or invalidates briefs, reviews localized findings, and promotes candidate rules.
                </p>
              </div>

              <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4">
                <div className="flex items-center gap-1 font-mono text-[10.5px] font-black text-indigo-700 uppercase">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>2. agent-loop</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  The local CLI protocol. Enforces states, records approvals, compiles selective recall, and locks verification gates.
                </p>
              </div>

              <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4">
                <div className="flex items-center gap-1 font-mono text-[10.5px] font-black text-amber-600 uppercase">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>3. Coding Agent</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  External actor (e.g. Claude Code, Aider, Cursor). Consumes task-scoped recall and implements clean patches without scope creep.
                </p>
              </div>

              <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4">
                <div className="flex items-center gap-1 font-mono text-[10.5px] font-black text-emerald-700 uppercase">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>4. Project Tools</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  The existing codebase toolchain (PHPUnit, PHPStan, linters). Runs test suites independently; outputs are verified as evidence.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ECOSYSTEM SECTION */}
        <div className="space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="font-mono text-[10px] font-black uppercase tracking-widest text-[#141414]/65">THE COMPOSABLE ECOSYSTEM</h2>
            <h3 className="text-xl font-black uppercase tracking-tight font-mono">Small, Composable Repositories with Single Responsibilities</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
            
            <div className="border-2 border-[#141414] bg-white p-4.5 space-y-2 relative shadow-[3px_3px_0px_0px_rgba(20,20,20,1)]">
              <span className="absolute top-3 right-3 text-[9px] font-mono font-bold text-slate-400">CORE</span>
              <div className="font-mono text-[11px] font-black text-indigo-700 flex items-center gap-1">
                <Layers className="w-4 h-4" />
                <span>voku/agent-loop</span>
              </div>
              <p className="text-slate-600 leading-normal">
                Workflow orchestration CLI. Enforces progression state-transitions, validates evidence caches, and logs approvals.
              </p>
            </div>

            <div className="border-2 border-[#141414] bg-white p-4.5 space-y-2 relative shadow-[3px_3px_0px_0px_rgba(20,20,20,1)]">
              <span className="absolute top-3 right-3 text-[9px] font-mono font-bold text-slate-400">STATE</span>
              <div className="font-mono text-[11px] font-black text-amber-600 flex items-center gap-1">
                <FileText className="w-4 h-4" />
                <span>voku/agent-kanban</span>
              </div>
              <p className="text-slate-600 leading-normal">
                A simple local flat-file markdown backlog tool. Controls developer ticket states, priority matrices, and story branches.
              </p>
            </div>

            <div className="border-2 border-[#141414] bg-white p-4.5 space-y-2 relative shadow-[3px_3px_0px_0px_rgba(20,20,20,1)]">
              <span className="absolute top-3 right-3 text-[9px] font-mono font-bold text-slate-400">SANDBOX</span>
              <div className="font-mono text-[11px] font-black text-emerald-700 flex items-center gap-1">
                <TermIcon className="w-4 h-4" />
                <span>voku/agent-session</span>
              </div>
              <p className="text-slate-600 leading-normal">
                Temporary working memory directories. Spawns isolated session checkouts, staging area logs, and handles clean git-diff outputs.
              </p>
            </div>

            <div className="border-2 border-[#141414] bg-white p-4.5 space-y-2 relative shadow-[3px_3px_0px_0px_rgba(20,20,20,1)]">
              <span className="absolute top-3 right-3 text-[9px] font-mono font-bold text-slate-400">KNOWLEDGE</span>
              <div className="font-mono text-[11px] font-black text-purple-700 flex items-center gap-1">
                <Brain className="w-4 h-4" />
                <span>voku/agent-learning</span>
              </div>
              <p className="text-slate-600 leading-normal">
                Durable repository constraints. Governs finding validations, stores outcome metrics, and registers candidate guidelines.
              </p>
            </div>

            <div className="border-2 border-[#141414] bg-white p-4.5 space-y-2 relative shadow-[3px_3px_0px_0px_rgba(20,20,20,1)]">
              <span className="absolute top-3 right-3 text-[9px] font-mono font-bold text-slate-400">COMPILER</span>
              <div className="font-mono text-[11px] font-black text-rose-700 flex items-center gap-1">
                <Map className="w-4 h-4" />
                <span>voku/agent-recall-compiler</span>
              </div>
              <p className="text-slate-600 leading-normal">
                Task-scoped selector compiler. Pulls active context guidelines relevant to modified symbol namespaces and skips irrelevant clutter.
              </p>
            </div>

            <div className="border-2 border-[#141414] bg-white p-4.5 space-y-2 relative shadow-[3px_3px_0px_0px_rgba(20,20,20,1)]">
              <span className="absolute top-3 right-3 text-[9px] font-mono font-bold text-slate-400">AST INTEL</span>
              <div className="font-mono text-[11px] font-black text-teal-700 flex items-center gap-1">
                <Maximize2 className="w-4 h-4" />
                <span>voku/agent-map</span>
              </div>
              <p className="text-slate-600 leading-normal">
                Codebase symbol cataloguer. Scans php files into compact tokens lists detailing inheritance, signatures, and imports.
              </p>
            </div>

          </div>
        </div>

        {/* IMPLEMENTATION REASONING (PHP 8.3 ADVANTAGE) */}
        <div className="space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="font-mono text-[10px] font-black uppercase tracking-widest text-[#141414]/65">INTERPRETED SYSTEM ADVANTAGE</h2>
            <h3 className="text-xl font-black uppercase tracking-tight font-mono">PHP 8.3: Empowering Self-Correcting Workflows</h3>
          </div>

          <div className="border-2 border-[#141414] bg-white p-6 space-y-4 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] font-sans text-xs text-slate-700 leading-relaxed">
            <p>
              Choosing PHP 8.3 as the implementation language is a deliberate, practical engineering choice. Because the workflow orchestration commands are written in an interpreted, highly transparent language, <strong>there is no compiled build bottleneck</strong> between the tooling and the codebase itself.
            </p>
            
            <p className="font-medium text-[#141414]">
              How this works in practice:
            </p>

            <blockquote className="border-l-4 border-[#141414] pl-3 py-1 bg-[#F9F8F6] font-mono text-[11.5px] text-slate-800 leading-normal">
              If a workflow command or code check is missing, incomplete, or fails to catch a class of bugs, the coding agent can modify the PHP implementation of agent-loop itself, execute the corrected command in the same session, and submit the tooling improvement as a standard pull request downstream.
            </blockquote>

            <p>
              This fast-feedback recursive developer loop turns the workflow tooling into a natural extension of the repository. It completely side-steps heavy, multi-layered cloud stacks or closed-source frameworks.
            </p>
          </div>
        </div>

        {/* PRACTICAL CLI REFERENCE (INTERACTIVE COMPONENT) */}
        <div className="space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="font-mono text-[10px] font-black uppercase tracking-widest text-[#141414]/65">CLI PLAYBOOK MANUAL</h2>
            <h3 className="text-xl font-black uppercase tracking-tight font-mono">Command Specifications & Boundaries</h3>
          </div>

          <div className="border-2 border-[#141414] bg-white shadow-[6px_6px_0px_0px_rgba(20,20,20,1)] overflow-hidden">
            
            {/* Tab switchers */}
            <div className="bg-[#F0EFEC] border-b-2 border-[#141414] flex flex-wrap divide-x divide-[#141414] font-mono text-[9px] uppercase tracking-wider font-bold select-none text-slate-500">
              {Object.keys(cliCommands).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedCliTab(tab)}
                  className={`flex-1 py-2.5 px-2 text-center transition duration-150 hover:bg-[#DAD9D6] cursor-pointer ${selectedCliTab === tab ? "bg-[#141414] text-[#E4E3E0] font-black" : ""}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content area */}
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-mono text-xs font-bold text-slate-800 uppercase tracking-tight">Active Command:</span>
                <span className="bg-amber-100 text-amber-900 border border-amber-300 font-mono text-[9px] font-bold px-1.5 py-0.2">GOVERNED PROTOCOL</span>
              </div>

              {/* Console display block */}
              <div className="bg-[#141414] text-[#E4E3E0] p-4.5 font-mono text-xs border border-[#141414] select-all shadow-inner leading-relaxed">
                <div className="text-slate-500"># Syntax</div>
                <div className="text-amber-300 font-bold">$ {cliCommands[selectedCliTab as keyof typeof cliCommands].cmd}</div>
                <div className="text-slate-500 mt-2"># Context Outcome</div>
                <div className="text-slate-200">{cliCommands[selectedCliTab as keyof typeof cliCommands].description}</div>
              </div>

              {/* Functional details grids */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
                
                <div className="space-y-3.5">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 space-y-1">
                    <div className="font-mono text-[9.5px] font-black uppercase text-emerald-800 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>What it DOES</span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-normal font-medium">
                      {cliCommands[selectedCliTab as keyof typeof cliCommands].does}
                    </p>
                  </div>

                  <div className="p-3 bg-red-50 border border-red-200 space-y-1">
                    <div className="font-mono text-[9.5px] font-black uppercase text-red-800 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-700" />
                      <span>What it does NOT do</span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-normal font-medium">
                      {cliCommands[selectedCliTab as keyof typeof cliCommands].doesNot}
                    </p>
                  </div>
                </div>

                <div className="border border-[#141414]/15 bg-slate-50 p-3.5 font-mono text-[10.5px] space-y-2 leading-relaxed flex flex-col justify-center">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-black tracking-wider">Input Target Artifacts:</span>
                    <span className="text-slate-700 block font-bold mt-0.5 font-sans text-xs">
                      {cliCommands[selectedCliTab as keyof typeof cliCommands].input}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-1">
                    <span className="text-slate-400 block text-[9px] uppercase font-black tracking-wider">Resulting Evidence Output:</span>
                    <span className="text-slate-800 block font-bold mt-0.5 font-sans text-xs">
                      {cliCommands[selectedCliTab as keyof typeof cliCommands].output}
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* ENGINEERING PRINCIPLES */}
        <div className="space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="font-mono text-[10px] font-black uppercase tracking-widest text-[#141414]/65">THE GOVERNED DOCTRINES</h2>
            <h3 className="text-xl font-black uppercase tracking-tight font-mono">Durable Engineering Principles</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs">
            
            <div className="border-2 border-[#141414] bg-white p-5 space-y-2 shadow-[3px_3px_0px_0px_rgba(20,20,20,1)]">
              <div className="font-mono text-[10px] font-black text-indigo-700 uppercase tracking-wider">01 / CONTRACT COHERENCE</div>
              <h4 className="font-mono text-sm font-black text-[#141414] uppercase tracking-tight">Scope Enforces Safety</h4>
              <p className="text-slate-600 leading-normal">
                An agent is prohibited from scanning files or applying patches beyond the boundaries declared in the approved brief. If the boundary is breached, the verification gate halts immediately.
              </p>
            </div>

            <div className="border-2 border-[#141414] bg-white p-5 space-y-2 shadow-[3px_3px_0px_0px_rgba(20,20,20,1)]">
              <div className="font-mono text-[10px] font-black text-amber-600 uppercase tracking-wider">02 / VERSIONED CONSENT</div>
              <h4 className="font-mono text-sm font-black text-[#141414] uppercase tracking-tight">Re-planning Invalidates Approval</h4>
              <p className="text-slate-600 leading-normal">
                If the task shifts, previous human authorization is immediately voided. The tool blocks progress until a new candidate plan is drafted, reviewed, and signed off.
              </p>
            </div>

            <div className="border-2 border-[#141414] bg-white p-5 space-y-2 shadow-[3px_3px_0px_0px_rgba(20,20,20,1)]">
              <div className="font-mono text-[10px] font-black text-emerald-700 uppercase tracking-wider">03 / SELECTIVE COMPRESSED RECALL</div>
              <h4 className="font-mono text-sm font-black text-[#141414] uppercase tracking-tight">Curation Over Volume</h4>
              <p className="text-slate-600 leading-normal">
                Instead of dumping every historical rule, agent-loop compiles localized recall specifically matching active classes. Unused assumption caches are discarded.
              </p>
            </div>

          </div>
        </div>

        {/* TECHNICAL FAQ SECTION */}
        <div className="space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="font-mono text-[10px] font-black uppercase tracking-widest text-[#141414]/65">TECHNICAL ENQUIRIES</h2>
            <h3 className="text-xl font-black uppercase tracking-tight font-mono">Frequently Answered Queries</h3>
          </div>

          <div className="border-2 border-[#141414] bg-white divide-y-2 divide-[#141414] shadow-[6px_6px_0px_0px_rgba(20,20,20,1)]">
            {faqItems.map((item, idx) => (
              <div key={idx} className="p-4.5 font-sans text-xs">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-mono font-bold text-slate-900 cursor-pointer select-none py-1 group"
                >
                  <span className="group-hover:text-indigo-700 transition-colors text-xs flex items-start gap-2 pr-4 leading-relaxed">
                    <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{item.q}</span>
                  </span>
                  <span className="text-lg font-bold text-[#141414] shrink-0">
                    {expandedFaq === idx ? "−" : "+"}
                  </span>
                </button>
                
                {expandedFaq === idx && (
                  <p className="mt-3.5 pl-6 text-slate-600 leading-relaxed max-w-3xl animate-fade-in text-[11.5px]">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* THE FINAL CALL TO ACTION (CTA) */}
        <div className="border-2 border-[#141414] bg-[#F0EFEC] p-8 text-center space-y-6 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] relative select-none">
          <div className="absolute top-4 right-4 bg-white border border-[#141414]/15 px-2 py-0.5 font-mono text-[8px] font-black text-slate-500 uppercase tracking-wider">
            GOVERNANCE PROTOCOL
          </div>

          <div className="space-y-2 max-w-2xl mx-auto">
            <h3 className="text-2xl font-black uppercase font-mono tracking-tight text-[#141414]">
              Exit the Context Landfill.
            </h3>
            <p className="text-xs text-slate-600 font-sans max-w-md mx-auto leading-normal">
              Restore engineering credibility, clear scopes, explicit hand-offs, and versioned verification gates to your coding workspace today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
            <button
              onClick={onLaunchSandbox}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#141414] hover:bg-slate-800 text-white font-black font-mono text-xs uppercase tracking-widest border-2 border-[#141414] shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] hover:translate-x-[1px] hover:translate-y-[-1px] transition-all cursor-pointer"
            >
              Launch Interactive Sandbox
            </button>
            <a
              href="https://github.com/voku/agent-loop"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-[#F0EFEC] text-[#141414] font-black font-mono text-xs uppercase tracking-widest border-2 border-[#141414] shadow-[4px_4px_0px_0px_rgba(20,20,20,0.15)] flex items-center justify-center gap-2 hover:translate-x-[1px] hover:translate-y-[-1px] transition-all"
            >
              <GitPullRequest className="w-4 h-4 text-slate-500" />
              <span>Explore on GitHub</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
