import React, { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle, Play, RotateCcw, ShieldCheck, Terminal as TermIcon } from "lucide-react";
import LandingPage from "./components/LandingPage";

type SandboxStage =
  | "start"
  | "plan_requested"
  | "planned"
  | "approval_required"
  | "approved"
  | "mutation_ready"
  | "implemented"
  | "validated"
  | "complete";

interface HistoryEntry {
  readonly kind: "command" | "output" | "success" | "human";
  readonly text: string;
}

interface SandboxAction {
  readonly label: string;
  readonly command?: string;
  readonly nextStage: SandboxStage;
  readonly entries: readonly HistoryEntry[];
}

const contractSummary = {
  task: "DEMO-1",
  revision: 1,
  goal: "Add validated signup guards.",
  scope: ["src/Signup.php", "tests/SignupTest.php"],
  non_goals: ["No authentication redesign", "No repository-wide cleanup"],
  validation: "composer test"
} as const;

const stageOrder: readonly SandboxStage[] = [
  "start",
  "plan_requested",
  "planned",
  "approval_required",
  "approved",
  "mutation_ready",
  "implemented",
  "validated",
  "complete"
];

export default function App() {
  const [view, setView] = useState<"landing" | "sandbox">("landing");
  const [stage, setStage] = useState<SandboxStage>("start");
  const [history, setHistory] = useState<readonly HistoryEntry[]>([
    { kind: "output", text: "Demo repository is scaffolded and agent-loop is installed. The simulator starts at the stable host-facing lifecycle boundary." }
  ]);

  const action = useMemo<SandboxAction>(() => {
    switch (stage) {
      case "start":
        return {
          label: "Enter task",
          command: "vendor/bin/agent-loop enter DEMO-1 --format=json",
          nextStage: "plan_requested",
          entries: [
            { kind: "command", text: "$ vendor/bin/agent-loop enter DEMO-1 --format=json" },
            { kind: "output", text: '{"mutation_ready":false,"next_action_kind":"command_template","next_action":"agent-loop workflow plan DEMO-1 ..."}' }
          ]
        };
      case "plan_requested":
        return {
          label: "Persist candidate Contract",
          command: "vendor/bin/agent-loop workflow plan DEMO-1 --by lars --file src/Signup.php --file tests/SignupTest.php --goal \"Add validated signup guards.\" --validation \"composer test\"",
          nextStage: "planned",
          entries: [
            { kind: "command", text: "$ vendor/bin/agent-loop workflow plan DEMO-1 --by lars --file src/Signup.php --file tests/SignupTest.php --goal \"Add validated signup guards.\" --validation \"composer test\"" },
            { kind: "success", text: "Candidate Contract revision 1 persisted. No Run or Session was created by PLAN." }
          ]
        };
      case "planned":
        return {
          label: "Enter again",
          command: "vendor/bin/agent-loop enter DEMO-1 --format=json",
          nextStage: "approval_required",
          entries: [
            { kind: "command", text: "$ vendor/bin/agent-loop enter DEMO-1 --format=json" },
            { kind: "output", text: '{"mutation_ready":false,"next_action_kind":"decision_required","next_action":"approve the exact candidate Contract revision"}' }
          ]
        };
      case "approval_required":
        return {
          label: "Approve exact Contract",
          command: "vendor/bin/agent-loop workflow approve DEMO-1 --by lars",
          nextStage: "approved",
          entries: [
            { kind: "human", text: "Human reviews goal, scope, non-goals, validation, and accepts Contract revision 1." },
            { kind: "command", text: "$ vendor/bin/agent-loop workflow approve DEMO-1 --by lars" },
            { kind: "success", text: "Exact Contract revision approved. Authority is now bound to that revision." }
          ]
        };
      case "approved":
        return {
          label: "Reconcile post-approval state",
          command: "vendor/bin/agent-loop enter DEMO-1 --format=json",
          nextStage: "mutation_ready",
          entries: [
            { kind: "command", text: "$ vendor/bin/agent-loop enter DEMO-1 --format=json" },
            { kind: "output", text: '{"mutation_ready":true,"next_action_kind":"host_work","next_action":"implement the approved change using bounded current context"}' },
            { kind: "success", text: "Run-bound Session and current Recall are reconciled through their owners. The host did not reconstruct their storage paths." }
          ]
        };
      case "mutation_ready":
        return {
          label: "Perform host-native implementation",
          nextStage: "implemented",
          entries: [
            { kind: "human", text: "Coding host edits src/Signup.php and tests/SignupTest.php inside the approved boundary using normal repository tools." },
            { kind: "success", text: "Implementation identity changed. The workflow will require evidence bound to this implementation." }
          ]
        };
      case "implemented":
        return {
          label: "Run repository validation",
          command: "composer test",
          nextStage: "validated",
          entries: [
            { kind: "command", text: "$ composer test" },
            { kind: "success", text: "Repository validation passed. In a real run, current evidence is recorded through the owning workflow surface rather than accepted from chat text." }
          ]
        };
      case "validated":
        return {
          label: "Finish through kernel",
          command: "vendor/bin/agent-loop finish DEMO-1 --format=json",
          nextStage: "complete",
          entries: [
            { kind: "command", text: "$ vendor/bin/agent-loop finish DEMO-1 --format=json" },
            { kind: "output", text: '{"complete":true,"next_action_kind":"none","next_action":null}' },
            { kind: "success", text: "Demo complete. In real tasks finish may first route validation, review, Learning, risk, or another owner-backed next action. The host keeps obeying the returned action until complete." }
          ]
        };
      case "complete":
        return {
          label: "Restart demo",
          nextStage: "start",
          entries: []
        };
    }
  }, [stage]);

  const currentIndex = stageOrder.indexOf(stage);

  const runAction = () => {
    if (stage === "complete") {
      setStage("start");
      setHistory([{ kind: "output", text: "Demo reset. Durable workflow state is intentionally simplified in this browser-only simulator." }]);
      return;
    }

    setHistory((previous) => [...previous, ...action.entries]);
    setStage(action.nextStage);
  };

  if (view === "landing") {
    return <LandingPage onLaunchSandbox={() => setView("sandbox")} />;
  }

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button onClick={() => setView("landing")} className="font-mono text-xs font-black uppercase flex items-center gap-2 cursor-pointer mb-3"><ArrowLeft className="w-4 h-4" />Back to overview</button>
            <h1 className="font-mono text-2xl md:text-4xl font-black uppercase">Current lifecycle sandbox</h1>
            <p className="text-sm text-slate-700 mt-2 max-w-3xl">This browser demo follows the stable host contract: enter, obey the canonical next action, perform host-native work when authorized, finish, and continue until complete. Internal gates are deliberately not presented as a second mandatory phase machine.</p>
          </div>
          <div className="border-2 border-[#141414] bg-amber-300 px-4 py-3 font-mono text-xs font-black uppercase shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">Step {Math.min(currentIndex + 1, stageOrder.length)} / {stageOrder.length}</div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr] gap-6">
          <section className="border-2 border-[#141414] bg-[#111827] text-slate-100 shadow-[6px_6px_0px_0px_rgba(20,20,20,1)] min-h-[520px] flex flex-col">
            <div className="border-b border-slate-600 px-4 py-3 flex items-center justify-between bg-black/20"><div className="font-mono text-xs font-black uppercase flex items-center gap-2"><TermIcon className="w-4 h-4" />agent-loop demo terminal</div><div className="text-[10px] font-mono text-slate-400">illustrative browser harness</div></div>
            <div className="flex-1 p-4 space-y-3 overflow-auto max-h-[610px]">
              {history.map((entry, index) => (
                <div key={`${entry.kind}-${index}`} className={`font-mono text-xs whitespace-pre-wrap leading-relaxed ${entry.kind === "success" ? "text-emerald-300" : entry.kind === "human" ? "text-amber-300" : entry.kind === "command" ? "text-sky-300" : "text-slate-200"}`}>{entry.text}</div>
              ))}
            </div>
            <div className="border-t border-slate-600 p-4 bg-black/20">
              <button onClick={runAction} className="w-full bg-amber-300 text-[#141414] border-2 border-[#141414] py-3 px-4 font-mono text-xs font-black uppercase flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_rgba(255,255,255,0.25)]">
                {stage === "complete" ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {action.label}
              </button>
              {action.command && <div className="font-mono text-[10px] text-slate-400 mt-3 break-all">Next command: {action.command}</div>}
            </div>
          </section>

          <aside className="space-y-4">
            <div className="border-2 border-[#141414] bg-white p-5 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
              <div className="font-mono text-[10px] font-black uppercase text-slate-500">Contract candidate</div>
              <pre className="font-mono text-[11px] mt-3 whitespace-pre-wrap leading-relaxed">{JSON.stringify(contractSummary, null, 2)}</pre>
            </div>
            <div className="border-2 border-[#141414] bg-white p-5">
              <div className="flex items-center gap-2 font-mono font-black uppercase text-sm"><ShieldCheck className="w-4 h-4" />What the demo is proving</div>
              <ul className="mt-3 space-y-2 text-xs text-slate-700 leading-relaxed list-disc pl-4">
                <li>The host starts from executable lifecycle state, not remembered prose.</li>
                <li>PLAN creates durable intent, not approval or hidden mutable state.</li>
                <li>Human authority is explicit when next_action_kind is decision_required.</li>
                <li>Implementation stays host-native and bounded by the approved Contract.</li>
                <li>finish owns close-out routing; the host does not copy its gate ordering.</li>
              </ul>
            </div>
            <div className={`border-2 border-[#141414] p-5 ${stage === "complete" ? "bg-emerald-100" : "bg-[#F0EFEC]"}`}>
              <div className="flex items-center gap-2 font-mono font-black uppercase text-sm"><CheckCircle className="w-4 h-4" />Lifecycle state</div>
              <div className="font-mono text-xs mt-3">{stage}</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
