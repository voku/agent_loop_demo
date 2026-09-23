import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  GitBranch,
  Layers,
  Lightbulb,
  Shield,
  Sparkles,
  Terminal,
  Workflow
} from "lucide-react";
import { AgentLoopMark } from "./AgentLoopLogo";

const ownerRows = [
  {
    concern: "Task intent and lifecycle",
    owner: "agent-loop + agent-kanban",
    detail: "Contract revisions, approval boundaries, board state, and the canonical next action."
  },
  {
    concern: "Working evidence",
    owner: "agent-session",
    detail: "Temporary checkpoints, command evidence, and resumable task-local state."
  },
  {
    concern: "Repository structure",
    owner: "agent-map",
    detail: "Derived code navigation and bounded structural context. Source code remains the source of truth."
  },
  {
    concern: "Task-specific context",
    owner: "agent-recall-compiler",
    detail: "Bounded L1 briefing plus selection events as machine evidence."
  },
  {
    concern: "Findings and durable learning",
    owner: "agent-learning",
    detail: "Findings only when evidence exists, reviewed precedent, Dream maintenance, and durable decisions."
  },
  {
    concern: "Optional execution and UI",
    owner: "agent-loop-runner + agent-ui",
    detail: "Runner executes and UI presents. Neither recreates lifecycle authority."
  }
];

const learningRules = [
  {
    title: "Selection is a fact",
    text: "Recall can prove that guidance was selected. That does not prove the guidance helped."
  },
  {
    title: "Usefulness is a judgment",
    text: "Helpful, irrelevant, harmful, or not-used outcomes are recorded only when somebody actually judged them."
  },
  {
    title: "Quiet runs stay quiet",
    text: "No Finding is created when there is no finding. no_durable_learning does not need an explanatory essay."
  },
  {
    title: "Stable lessons become software",
    text: "When an invariant becomes objective and repeatable, move it into tests, PHPStan, typed APIs, or CI."
  }
];

export function DeepDiveChapters({ onBackToOverview }: { onBackToOverview?: () => void }) {
  return (
    <div className="space-y-8">
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Deep Dive</span>
            </div>

            <div className="flex items-center gap-3">
              <AgentLoopMark className="w-10 h-5 text-blue-600" idPrefix="deep-dive-logo" />
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
                Three ideas explain the architecture.
              </h1>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Agent Loop is not a ten-phase prompt ritual. The useful mental model is smaller:
              one lifecycle, one semantic owner for each kind of truth, and sparse learning that
              records only what actually happened.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onBackToOverview && (
              <button
                type="button"
                onClick={onBackToOverview}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                ← Overview
              </button>
            )}

            <a
              href="https://github.com/voku/agent-loop/blob/main/docs/quick-start.md"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
            >
              <span>Real Quick Start</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-300" />
            </a>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-[#0B1528] text-white border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-cyan-400">
                1. One lifecycle
              </div>
              <h2 className="text-xl font-black">Follow what the kernel emits</h2>
            </div>
          </div>

          <div className="bg-[#050A14] border border-slate-800 rounded-2xl p-4 font-mono text-xs sm:text-sm text-cyan-300 leading-relaxed">
            <div>enter &lt;task&gt;</div>
            <div className="text-slate-500">↓</div>
            <div>follow next_action_kind + next_action</div>
            <div className="text-slate-500">↓</div>
            <div>do host work when authorized</div>
            <div className="text-slate-500">↓</div>
            <div>finish &lt;task&gt;</div>
            <div className="text-slate-500">↓</div>
            <div>repeat until none / complete</div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            The host does not memorize PLAN, MAP, SESSION, RECALL, REVIEW, LEARN, and CLOSE.
            Those are implementation details. The public contract is the current canonical next action.
          </p>

          <div className="flex items-start gap-2 text-xs text-cyan-200 bg-cyan-950/40 border border-cyan-800/60 rounded-xl p-3">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Human input appears only when <code className="font-mono">decision_required</code> names a real authority boundary.
            </span>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-blue-700">
                2. One owner per kind of truth
              </div>
              <h2 className="text-xl font-black text-slate-950">Packages own facts, not everything</h2>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            The ecosystem stays understandable because each package has a narrow job. Consumers read
            typed owner output instead of rebuilding the same policy in another layer.
          </p>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-slate-500">Concern</th>
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-slate-500">Owner</th>
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-slate-500">What it means</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ownerRows.map((row) => (
                  <tr key={row.concern} className="align-top">
                    <td className="px-4 py-3 font-bold text-slate-900">{row.concern}</td>
                    <td className="px-4 py-3 font-mono font-bold text-blue-700 whitespace-nowrap">{row.owner}</td>
                    <td className="px-4 py-3 text-slate-600 leading-relaxed">{row.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>3. Sparse learning</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 mt-2">
              Record evidence, not ceremony.
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Learning is useful only when it distinguishes facts from judgment. Otherwise every boring
              task turns into a tiny paperwork factory, which is a remarkable achievement for automation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {learningRules.map((rule) => (
            <div key={rule.title} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900">{rule.title}</h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{rule.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
          <div className="bg-[#0B1528] border border-slate-800 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
              <Terminal className="w-4 h-4" />
              <span>A normal run can be boring</span>
            </div>
            <pre className="mt-3 text-xs sm:text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">{`validation: passed
recall selections: recorded automatically
guidance outcomes: none
finding: none
learning decision: no_durable_learning
status: complete`}</pre>
          </div>

          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-blue-800 font-mono text-xs font-bold uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>Why this matters</span>
            </div>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              Sparse state is easier to trust. A missing outcome means nobody judged usefulness.
              A missing Finding means there was no finding. Durable guidance therefore has a stronger signal
              when it does appear.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-500 font-mono text-xs font-bold uppercase tracking-wider">
              <GitBranch className="w-4 h-4" />
              <span>Current coordinated release graph</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-950">
              Loop 0.20.40 · Learning 0.18.24 · Recall 0.25.0
            </div>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Runner and UI have consumer proofs against the same owner graph. The architecture is useful
              because those consumers do not need their own private copy of the workflow.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href="https://github.com/voku/agent-loop/blob/main/docs/workflow/lifecycle.md"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-900 font-mono text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
            >
              <span>Lifecycle contract</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href="https://github.com/voku/agent-loop"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
            >
              <span>agent-loop on GitHub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
