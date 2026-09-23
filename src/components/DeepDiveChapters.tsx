import React, { useState } from "react";
import {
  FileCode,
  GitBranch,
  Shield,
  Layers,
  Terminal,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Lightbulb,
  Cpu,
  Database,
  Lock,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  Code2,
  FolderGit2,
  Activity,
  Sparkles,
  Workflow
} from "lucide-react";
import { AgentLoopMark } from "./AgentLoopLogo";

export interface DeepDiveChapter {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  tagline: string;
  problem: {
    trap: string;
    description: string;
  };
  solution: {
    heading: string;
    description: string;
    keyPoints: {
      title: string;
      description: string;
    }[];
  };
  interactiveShowcase: {
    badge: string;
    title: string;
    type: "contract_dialogue" | "action_kinds" | "map_comparison" | "validation_states" | "dual_learning_loop";
  };
  codeReferences: {
    file: string;
    package: string;
    repoUrl: string;
    role: string;
    architecturalTruth: string;
    keySnippet?: string;
  }[];
  connectedDots: {
    from: string;
    mechanism: string;
    to: string;
    outcome: string;
  }[];
  invariant: string;
  cliExample: {
    command: string;
    output: string;
  };
}

export function DeepDiveChapters({ onBackToOverview }: { onBackToOverview?: () => void }) {
  const [activeChapterId, setActiveChapterId] = useState<string>("ch1");
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const chapters: DeepDiveChapter[] = [
    {
      id: "ch1",
      chapterNumber: 1,
      title: "Humans Approve Intent, Not Shell Commands",
      subtitle: "Candidate Contracts • Scope Whitelists • voku/agent-kanban & voku/agent-loop",
      tagline: "Approval belongs to one concrete Contract revision. It is not permanent permission attached to a mutable task ID.",
      problem: {
        trap: "The Memory Landfill Trap",
        description: "The obvious response to agent mistakes has often been: 'Give the agent more memory.' Repositories slowly acquire MEMORY.md, project-rules.md, agent-notes.md, lessons-learned.md, MEMORY_FINAL.md, and actually-final-memory.md. Soon the coding agent receives old decisions, temporary workarounds, copied transcripts, and rules nobody remembers approving. It has more context, but not better context. At some point, memory becomes landfill."
      },
      solution: {
        heading: "The Governed Inversion: Candidate Contracts & Human Boundaries",
        description: "A governed workflow does not turn developers into operators of an orchestration CLI. The developer talks naturally to the agent. The agent investigates the repository and prepares a candidate Contract. When the lifecycle reaches a real human-authority boundary (decision_required), the agent presents that exact decision.",
        keyPoints: [
          {
            title: "Candidate Contract Formulation",
            description: "The agent translates user requests into an explicit Goal, Scope, Non-goals, and Validation commands."
          },
          {
            title: "Approval Belongs to a Revision",
            description: "Approval is granted to a concrete Contract revision—not a permanent blank check attached to a task ID whose meaning can silently drift."
          },
          {
            title: "Zero Micro-Management",
            description: "Ordinary implementation, deterministic validation, review acknowledgement, and local commits run inside the approved boundary without prompt babysitting every thirty seconds."
          }
        ]
      },
      interactiveShowcase: {
        badge: "Human-Authority Hand-off",
        title: "Developer Intent → Candidate Contract Revision",
        type: "contract_dialogue"
      },
      codeReferences: [
        {
          file: "docs/kanban/*.md",
          package: "voku/agent-kanban",
          repoUrl: "https://github.com/voku/agent-kanban",
          role: "Git-Native Work Items & Contract Authority",
          architecturalTruth: "Stores approved task intent, revision history, and mutation boundaries in version control so tasks survive chat resets.",
          keySnippet: `---
task_id: PROJECT-123
status: in_progress
current_contract_rev: 1
approved_by: human_authority
mutation_boundary:
  - "src/Domain/Order.php"
  - "tests/Domain/OrderTest.php"
---
# Goal: Reject invalid order state transitions
Non-goals: Do not redesign order aggregate. No public API changes.
Validation: composer phpstan && composer test`
        },
        {
          file: "src/Contract/TaskContract.php",
          package: "voku/agent-loop",
          repoUrl: "https://github.com/voku/agent-loop",
          role: "Immutable Contract Value Object",
          architecturalTruth: "Encapsulates approved revision, whitelisted files, non-goals, and test commands. If intent changes, a new revision must be generated.",
          keySnippet: `final readonly class TaskContract {
    public function __construct(
        public string $taskId,
        public int $revision,
        public string $goal,
        public array $allowedScope,
        public array $nonGoals,
        public string $validationCommand,
        public bool $isApproved,
    ) {}
}`
        }
      ],
      connectedDots: [
        {
          from: "Human Developer Intent",
          mechanism: "Agent prepares candidate Contract (Goal, Scope, Non-goals, Validation)",
          to: "decision_required boundary",
          outcome: "Developer approves or refines exact contract revision without needing to micro-manage commands."
        },
        {
          from: "Approved TaskContract revision",
          mechanism: "Passed into ScopeGuard before any file edits",
          to: "Chapter 3 (Scope Guard)",
          outcome: "Enforces strict mutation whitelist. If intent changes, a new Contract revision is required."
        }
      ],
      invariant: "Approval belongs to one concrete Contract revision. It is not permanent permission attached to a mutable task ID.",
      cliExample: {
        command: "vendor/bin/agent-loop enter PROJECT-123 --format=json",
        output: `{
  "task_id": "PROJECT-123",
  "status": "in_progress",
  "contract_revision": 1,
  "mutation_ready": true,
  "scope_whitelist": ["src/Domain/Order.php", "tests/Domain/OrderTest.php"],
  "next_action_kind": "host_work"
}`
      }
    },
    {
      id: "ch2",
      chapterNumber: 2,
      title: "The Everyday Loop Stays Small: Canonical Next Action",
      subtitle: "5 Action Kinds • Closable Working Memory • voku/agent-loop & voku/agent-session",
      tagline: "A canonical next action should converge. The host executes the emitted action instead of prompt choreography.",
      problem: {
        trap: "Prompt Phase Machine Nightmare",
        description: "Without a governed workflow, the host guesses: 'Is this something I can do myself? Should I ask the developer now? Which internal phase comes next?' Forcing the agent to memorize a 2,000-word phase machine (PLAN, MAP, SESSION, RECALL, IMPLEMENT, VALIDATE, REVIEW, LEARN, VERIFY, CLOSE) in its prompt causes constant drift and unrepeatable workflows."
      },
      solution: {
        heading: "The Governed Inversion: Executable Policy Emits the Canonical Next Action",
        description: "The normal host contract stays tiny: enter → follow next_action → work → finish → repeat. Agent Loop evaluates disk truth through executable policy and returns state, mutation_ready, next_action_kind, and next_action. The agent executes the emitted directive instead of maintaining another prose copy of the state machine.",
        keyPoints: [
          {
            title: "The 5 Canonical Action Kinds",
            description: "command (exact CLI command), command_template (host fills parameters), host_work (engineer within scope), decision_required (human authority boundary), none (converged)."
          },
          {
            title: "Working Memory Stays Temporary",
            description: "agent-session holds mutable assumptions, checkpoints, and scratchpad observations. Sessions are closable and pruneable; they do not leak into permanent instructions."
          },
          {
            title: "Deterministic Preparation is Automatic",
            description: "Enter automatically reconciles Map state, resumes Sessions, and compiles Recall so the developer and host don't have to remember choreography rituals."
          }
        ]
      },
      interactiveShowcase: {
        badge: "Deterministic Execution",
        title: "The 5 Canonical Action Kinds & Convergence",
        type: "action_kinds"
      },
      codeReferences: [
        {
          file: "src/Workflow/NextActionKind.php",
          package: "voku/agent-loop",
          repoUrl: "https://github.com/voku/agent-loop",
          role: "Action Kinds Enumeration (5 States)",
          architecturalTruth: "Eliminates prompt guessing by reducing all possible host transitions into five deterministic kinds.",
          keySnippet: `enum NextActionKind: string {
    case COMMAND = 'command';                 // Run exact deterministic command
    case COMMAND_TEMPLATE = 'command_template'; // Host fills task-specific values
    case HOST_WORK = 'host_work';             // Authorize engineering tools in scope
    case DECISION_REQUIRED = 'decision_required'; // Human authority boundary reached
    case NONE = 'none';                       // No further lifecycle action
}`
        },
        {
          file: "src/Session/SessionPlan.php",
          package: "voku/agent-session",
          repoUrl: "https://github.com/voku/agent-session",
          role: "Temporary Working-Memory Layer",
          architecturalTruth: "Working memory is not permanent knowledge. A Session tracks decisions, assumptions, and validation observations, and is pruned upon completion.",
          keySnippet: `final readonly class SessionPlan {
    public function __construct(
        public string $taskId,
        public array $decisions,
        public array $assumptions,
        public array $checkpoints,
        public array $validationObservations,
        public DateTimeImmutable $lastTurnAt,
    ) {}
}`
        },
        {
          file: "src/Command/EnterCommand.php",
          package: "voku/agent-loop",
          repoUrl: "https://github.com/voku/agent-loop",
          role: "Lifecycle Bootstrap Front Door",
          architecturalTruth: "Evaluates disk truth, resolves owner-backed state, and computes the single authoritative next step."
        }
      ],
      connectedDots: [
        {
          from: "State on disk (Docs + Session + Git)",
          mechanism: "Evaluated by executable policy on every lifecycle turn",
          to: "Host Agent (Claude Code, Codex, Cursor)",
          outcome: "Host follows explicit next_action rather than maintaining a duplicated phase machine in prompts."
        },
        {
          from: "Temporary agent-session state",
          mechanism: "Kept distinct from durable repository policy",
          to: "Task Closeout & Pruning",
          outcome: "Working memory stays closable; debugging scratchpads do not leak into permanent instructions."
        }
      ],
      invariant: "A canonical next action should converge. The host executes the emitted action instead of prompt choreography.",
      cliExample: {
        command: "vendor/bin/agent-loop enter PROJECT-123 --format=json",
        output: `{
  "mutation_ready": true,
  "next_action_kind": "host_work",
  "next_action": "Fix invalid order state transitions in approved files",
  "enforced_scope": ["src/Domain/Order.php", "tests/Domain/OrderTest.php"]
}`
      }
    },
    {
      id: "ch3",
      chapterNumber: 3,
      title: "Give the Agent Less Context, But Better Context",
      subtitle: "Deterministic PHP AST Map • Bounded L1 Briefings • voku/agent-map & voku/agent-recall-compiler",
      tagline: "Selection beats inflation. Map output is derived navigation evidence, not source truth.",
      problem: {
        trap: "Repository Context Dumps",
        description: "A coding agent does not need the whole repository in its prompt. Naive systems dump thousands of lines of raw source code, git logs, and massive AST trees into the context window. This burns tokens, dilutes the model's attention, and causes subtle hallucinations where unobserved call edges are wrongly assumed to not exist."
      },
      solution: {
        heading: "The Governed Inversion: Derived Map Evidence & Bounded L1 Briefings",
        description: "Agent Loop separates repository structure from project guidance because they answer different questions. Structure comes from agent-map (callers, callees, bounded edit context). Task guidance comes from agent-recall-compiler (L1 briefing: Goal, Context, Constraints, Verification, Done When).",
        keyPoints: [
          {
            title: "Deterministic PHP Map Intelligence",
            description: "agent-map answers where methods are defined, callers, callees, and bounded edit context. Unobserved edges are treated as capability limits, not proof of absence."
          },
          {
            title: "Task-Specific L1 Synthesis",
            description: "agent-recall-compiler synthesizes approved intent, repository facts, and precedent into a compact L1 briefing rather than inflating permanent context."
          },
          {
            title: "Selection Is a Fact; Usefulness Is a Judgment",
            description: "Recall records selected guidance as machine evidence. Helpful, irrelevant, harmful, or not-used outcomes are written only when that guidance was actually judged. An untouched selection is neutral, not a fabricated verdict."
          }
        ]
      },
      interactiveShowcase: {
        badge: "Context Precision",
        title: "Naive Context Dump vs. Governed Bounded L1 Briefing",
        type: "map_comparison"
      },
      codeReferences: [
        {
          file: "voku/agent-map",
          package: "voku/agent-map",
          repoUrl: "https://github.com/voku/agent-map",
          role: "Deterministic PHP AST Symbol & Caller Indexer",
          architecturalTruth: "Answers method definitions, callers, callees, and bounded edit context without dumping raw source text. Derived navigation evidence, not source truth.",
          keySnippet: `// agent-map returns verified symbol boundaries:
$map = AgentMap::index('src/Domain/Order.php');
// Returns exact method signatures & dependents:
// - Order::transitionTo(OrderState $newState): void
// Derived navigation evidence, NOT replacement for source truth.`
        },
        {
          file: "voku/agent-recall-compiler",
          package: "voku/agent-recall-compiler",
          repoUrl: "https://github.com/voku/agent-recall-compiler",
          role: "Bounded L1 Task Contract Compiler & Outcome Tracker",
          architecturalTruth: "Synthesizes approved task intent and precedent into a concrete L1 briefing: Goal, Context, Constraints, Verification, Done When.",
          keySnippet: `final readonly class RecallCompiler {
    public function compileL1(TaskContract $contract, BoundedContext $ctx): L1Briefing {
        return new L1Briefing(
            goal: $contract->goal,
            context: $ctx->resolvedSymbols,
            constraints: $ctx->activeConstraints,
            verification: $contract->validationCommand,
            doneWhen: "PHPStan clean & focused unit tests pass on tree snapshot"
        );
    }
}`
        },
        {
          file: "voku/agent-graph",
          package: "voku/agent-graph",
          repoUrl: "https://github.com/voku/agent-graph",
          role: "Shared SQLite Graph Storage (Infrastructure)",
          architecturalTruth: "Provides deterministic SQLite storage for Map and Learning; deliberately owns zero domain semantics."
        }
      ],
      connectedDots: [
        {
          from: "agent-map structural index & agent-recall-compiler",
          mechanism: "Synthesizes minimal bounded context package (Selection, not inflation)",
          to: "LLM Context Window",
          outcome: "Model receives only current, verified facts needed for the immediate decision."
        },
        {
          from: "Outcome tracking (agent-recall-compiler)",
          mechanism: "Classifies guidance as helpful, irrelevant, harmful, not used, or unknown",
          to: "Chapter 5 (Distillation Loop)",
          outcome: "Separates text selection from actual usefulness to prevent context inflation."
        }
      ],
      invariant: "Selection beats inflation. Map output is derived navigation evidence, not source truth.",
      cliExample: {
        command: "git status --porcelain",
        output: `M src/Domain/Order.php
M tests/Domain/OrderTest.php
# ScopeGuard: PASS (2 of 2 files authorized in Contract rev 1)`
      }
    },
    {
      id: "ch4",
      chapterNumber: 4,
      title: "Validation Belongs to an Exact Implementation & finish Does Not Mean 'Declare Victory'",
      subtitle: "Cryptographic Git Tree Hashing • Fail-Closed Reconciliation • voku/agent-loop",
      tagline: "Evidence beats confidence. If the code changes after tests pass, the validation proof is invalidated.",
      problem: {
        trap: "The Immortal Green Checkmark",
        description: "An agent saying 'Tests passed' is useful only if we know which implementation those tests validated. In ungoverned sessions, an agent passes tests, modifies 3 more files, and reports victory without re-testing. The green checkmark becomes an immortal badge decoupled from the actual git tree."
      },
      solution: {
        heading: "The Governed Inversion: Exact Git Tree Snapshots & Fail-Closed Reconciliation",
        description: "Validation evidence is cryptographically bound to the Contract revision + command + exit code + Git tree hash. When finish is called, it does not simply flip a task to done; it reconciles obligations, invalidates stale receipts, and delegates remaining owner work.",
        keyPoints: [
          {
            title: "5 Validation States",
            description: "Current, Superseded by implementation, Superseded by Contract revision, Missing validation, or Failed validation."
          },
          {
            title: "finish Reconciles Obligations",
            description: "Runs validation, prepares review diffs, surfaces human decisions, records learning dispositions, logs recall outcomes, and closes the session."
          },
          {
            title: "Fail-Closed Kanban Reconciliation (#503)",
            description: "If the Run is complete but the Kanban card is still active, Loop surfaces board.active_after_run_complete and delegates host_work to agent-kanban instead of pretending everything is finished."
          },
          {
            title: "Evidence is Not Authority",
            description: "A test passing does not approve a scope change. A review report does not acknowledge itself. Authority and evidence answer different questions."
          }
        ]
      },
      interactiveShowcase: {
        badge: "Cryptographic Integrity",
        title: "Validation Invalidation & Fail-Closed Reconciliation",
        type: "validation_states"
      },
      codeReferences: [
        {
          file: "src/Command/FinishCommand.php",
          package: "voku/agent-loop",
          repoUrl: "https://github.com/voku/agent-loop",
          role: "Task Reconciliation & Closeout Front Door",
          architecturalTruth: "Reconciles current implementation against obligations. If Kanban cards remain active after run complete, surfaces board.active_after_run_complete (#503).",
          keySnippet: `final class FinishCommand {
    public function execute(string $taskId): FinishResult {
        $currentTreeSha = $this->git->getCurrentTreeHash();
        $evidence = $this->evidenceRepo->getLatestForTask($taskId);

        if ($evidence->treeHash !== $currentTreeSha) {
            return FinishResult::staleEvidence("Code changed after tests passed. Re-run validation.");
        }

        if ($this->board->isCardActiveAfterRunComplete($taskId)) {
            return FinishResult::hostWorkRequired(
                reason: 'board.active_after_run_complete',
                directive: 'Reconcile remaining Kanban card state via agent-kanban'
            );
        }

        return FinishResult::completed($taskId);
    }
}`
        },
        {
          file: "src/Evidence/EvidenceVerifier.php",
          package: "voku/agent-loop",
          repoUrl: "https://github.com/voku/agent-loop",
          role: "Exit Code & Git Tree Snapshot Verifier",
          architecturalTruth: "Binds command execution and exit code 0 cryptographically to git tree SHA: git-tree-v1:9f8a2b...",
          keySnippet: `final readonly class EvidenceReceipt {
    public function __construct(
        public string $taskId,
        public string $command,
        public int $exitCode,
        public string $gitTreeHash,
        public DateTimeImmutable $recordedAt
    ) {}

    public function isValidFor(string $currentTreeHash): bool {
        return $this->exitCode === 0 && $this->gitTreeHash === $currentTreeHash;
    }
}`
        }
      ],
      connectedDots: [
        {
          from: "Executed tests/linters (composer test)",
          mechanism: "EvidenceVerifier binds exit code 0 to git-tree-v1:9f8a2b...",
          to: "FinishCommand validation gate",
          outcome: "Prevents conversational 'hallucinated success' from closing a task."
        },
        {
          from: "Reconciliation outcome",
          mechanism: "Surfaces remaining owner work or routes findings to learning",
          to: "Chapter 5 (Learning Distillation)",
          outcome: "Closes the Session, completes the Run, or delegates host_work for Kanban cards (#503)."
        }
      ],
      invariant: "Evidence beats confidence. If the code changes after tests pass, the validation proof is invalidated.",
      cliExample: {
        command: "vendor/bin/agent-loop finish PROJECT-123 --format=json",
        output: `{
  "task_id": "PROJECT-123",
  "validation_passed": true,
  "git_tree_hash": "9f8a2b4c10e8d77a",
  "evidence_state": "current",
  "status": "completed"
}`
      }
    },
    {
      id: "ch5",
      chapterNumber: 5,
      title: "Learning Should Begin With Evidence, Not Policy (The Fast & Slow Loops)",
      subtitle: "Precedent vs Promotion • Dream Maintenance • The Best Memory is a PHPStan Rule",
      tagline: "Learning can disappear. Distill experience into code, types, and CI sniffs so prompts stay lean.",
      problem: {
        trap: "Premature Policy Promotion",
        description: "The naive model is: 'The agent learned something useful. Save it as a rule.' That promotes evidence far too aggressively. One solved bug should not create a new constitutional rule. Project instructions balloon with brittle micro-guidelines that nobody maintains."
      },
      solution: {
        heading: "The Governed Inversion: The Fast Precedent Loop & The Slow Promotion Loop",
        description: "Agent Loop separates learning into two distinct speeds: a fast precedent loop that starts only when there is a real Finding, and a slow promotion loop where recurrence across independent tasks earns a Dream maintenance pass and reviewed Proposals. Boring runs do not manufacture learning artifacts.",
        keyPoints: [
          {
            title: "The Fast Loop (Precedent ≠ Guidance)",
            description: "A Finding captures raw evidence. It can become a LearningNote ('We have seen this before; here is the solved case'). It never approves mutations or widens scope."
          },
          {
            title: "The Slow Loop (Dream Maintenance)",
            description: "vendor/bin/agent-loop learn dream evaluates accumulated evidence for recurrence, staleness, and replacement. It prepares Proposals for human review—it never rewrites rules while you sleep."
          },
          {
            title: "Most Tasks Learn Nothing Permanent",
            description: "A perfectly valid outcome is an explicit no_durable_learning decision with no essay attached. If there is no Finding, none is created; the bug can simply be fixed and closed."
          },
          {
            title: "Sparse Outcomes, Not Fake Telemetry",
            description: "Recall selection events are automatic evidence. Guidance outcome rows exist only for guidance that was actually judged; unjudged is neutral rather than silently rewritten as unknown, irrelevant, or not used."
          },
          {
            title: "The Best Memory is a PHPStan Rule",
            description: "Once an invariant is stable, convert it into a PHPStan rule, a test, or a typed API. Once CI enforces it mechanically, prompt text can safely disappear."
          }
        ]
      },
      interactiveShowcase: {
        badge: "Dual-Speed Evolution",
        title: "Fast Precedent Loop vs. Slow Promotion Loop (Dream)",
        type: "dual_learning_loop"
      },
      codeReferences: [
        {
          file: "src/Dream/DreamEngine.php",
          package: "voku/agent-learning",
          repoUrl: "https://github.com/voku/agent-learning",
          role: "Deterministic Maintenance Pass Engine",
          architecturalTruth: "Evaluates accumulated evidence for recurrence across independent tasks, outcome coverage, and duplicate decisions; prepares candidate Proposals.",
          keySnippet: `// Invoked deterministically via the front door:
// vendor/bin/agent-loop learn dream --report=.agent-loop/dream/latest.json --dry-run
final class DreamEngine {
    public function dream(FindingRepository $findings, OutcomeRepository $outcomes): DreamReport {
        // Evaluates recurrence across independent tasks before preparing reviewable Proposals
    }
}`
        },
        {
          file: "src/Note/LearningNote.php",
          package: "voku/agent-learning",
          repoUrl: "https://github.com/voku/agent-learning",
          role: "Distilled Precedent Record (Precedent, Not Authority)",
          architecturalTruth: "Preserves what happened, what failed, why resolution worked, and how to verify it. Does not approve mutations or become project policy.",
          keySnippet: `final readonly class LearningNote {
    public function __construct(
        public string $noteId,
        public string $summary,
        public array $triggerKeywords,
        public array $relatedFindingIds,
        public bool $isPromotedToHardRule = false,
    ) {}
}`
        },
        {
          file: "voku/agent-skills",
          package: "voku/agent-skills",
          repoUrl: "https://github.com/voku/agent-skills",
          role: "Portable Engineering & Review Guidance Catalog",
          architecturalTruth: "Optional and separately installed catalog; Agent Loop does not silently download rulebooks."
        }
      ],
      connectedDots: [
        {
          from: "Task execution review & friction",
          mechanism: "agent-learning clusters repeated findings into Proposals via Dream",
          to: "Repository Tooling (PHPStan, PHPCS, CI)",
          outcome: "Knowledge becomes code instead of an ever-growing prompt markdown file."
        },
        {
          from: "Distilled rules",
          mechanism: "Enforced at compile-time and CI",
          to: "Chapter 1 & 4",
          outcome: "Future tasks are checked automatically without re-inventing the same fixes."
        }
      ],
      invariant: "Learning can disappear. Distill experience into code, types, and CI sniffs so prompts stay lean.",
      cliExample: {
        command: "vendor/bin/agent-loop learn dream --report=.agent-loop/dream/latest.json --dry-run",
        output: `{
  "action": "dream",
  "owner": "voku/agent-learning",
  "delegated_by": "voku/agent-loop",
  "findings_analyzed": 14,
  "proposals_generated": 1,
  "candidate": {
    "title": "Enforce order status transition via PHPStan custom rule",
    "rule": "Rules\\\\OrderStateTransitionRule",
    "status": "pending_human_review"
  }
}`
      }
    }
  ];

  const activeChapter = chapters.find((c) => c.id === activeChapterId) || chapters[0];

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* HEADER SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg">
              <Workflow className="w-3.5 h-3.5 text-blue-600" />
              <span>Architecture Deep Dive</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mt-2">
              Connecting the Dots Between the Chapters (Code Files)
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-3xl mt-1 leading-relaxed">
              How the core architecture files of <span className="font-mono font-bold text-slate-800">voku/agent-loop</span> interconnect to turn probabilistic coding models into bounded, reliable engineering contributors.
            </p>
          </div>

          {onBackToOverview && (
            <button
              onClick={onBackToOverview}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0 self-start md:self-center"
            >
              ← Back to Overview
            </button>
          )}
        </div>

        {/* Memory Landfill vs Governed Loop Contrast */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-950 space-y-1.5 text-xs">
            <div className="font-mono font-bold text-amber-900 flex items-center gap-1.5">
              <span>The Landfill Trap: &ldquo;Give the agent more memory&rdquo;</span>
            </div>
            <p className="text-amber-800 leading-relaxed font-sans">
              Repositories slowly accumulate <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-300">MEMORY.md</code>, <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-300">project-rules.md</code>, and <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-300">actually-final-memory.md</code>. Old decisions, temporary workarounds, and copied transcripts pile up. More context, but not better context.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/90 border border-blue-200/80 text-blue-950 space-y-1.5 text-xs">
            <div className="font-mono font-bold text-blue-900 flex items-center gap-1.5">
              <span>The Governed Inversion: Bounded Context &amp; Disappearing Lessons</span>
            </div>
            <p className="text-blue-800 leading-relaxed font-sans">
              The task survives the chat. Working memory is temporary (<code className="font-mono bg-white px-1 py-0.5 rounded border border-blue-300">agent-session</code>). Context is selected instead of dumped (<code className="font-mono bg-white px-1 py-0.5 rounded border border-blue-300">agent-map</code> + <code className="font-mono bg-white px-1 py-0.5 rounded border border-blue-300">agent-recall-compiler</code>). And stable lessons become CI checks and PHPStan rules so prompt text can disappear.
            </p>
          </div>
        </div>

        {/* 5-CHAPTER TAB BAR */}
        <div className="pt-2 flex flex-wrap gap-2 border-t border-slate-100">
          {chapters.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setActiveChapterId(ch.id)}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeChapterId === ch.id
                  ? "bg-[#0B1528] text-cyan-300 shadow-md ring-2 ring-cyan-500/20"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                activeChapterId === ch.id ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"
              }`}>
                {ch.chapterNumber}
              </span>
              <span>{ch.title.split("&")[0].trim()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVE CHAPTER DETAIL CARD */}
      <div className="bg-[#0B1528] border border-slate-700/80 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
        
        {/* CHAPTER TITLE & INVARIANT */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <span>Chapter {activeChapter.chapterNumber} of 5</span>
              <span>•</span>
              <span>{activeChapter.subtitle}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
              {activeChapter.title}
            </h2>
          </div>

          <div className="bg-blue-950/60 border border-blue-800/80 p-3 rounded-2xl max-w-md">
            <div className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Architectural Invariant</span>
            </div>
            <p className="text-xs text-slate-300 font-sans mt-1">
              {activeChapter.invariant}
            </p>
          </div>
        </div>

        {/* 1. THE DEEP DIVE NARRATIVE: DILEMMA VS GOVERNED INVERSION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-cyan-400" />
              <span>Architectural Breakdown &amp; Rationale</span>
            </h3>
            <span className="text-xs font-mono text-slate-400 italic">
              {activeChapter.tagline}
            </span>
          </div>

          {/* Problem Trap & Governed Inversion Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* The Trap */}
            <div className="bg-[#0e0707] border border-red-900/50 rounded-2xl p-4 sm:p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-400">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>The Naive Trap: {activeChapter.problem.trap}</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {activeChapter.problem.description}
              </p>
            </div>

            {/* The Governed Inversion */}
            <div className="bg-[#06141a] border border-cyan-800/60 rounded-2xl p-4 sm:p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300">
                <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{activeChapter.solution.heading}</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {activeChapter.solution.description}
              </p>
            </div>
          </div>

          {/* Key Principles of this Chapter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {activeChapter.solution.keyPoints.map((point, idx) => (
              <div
                key={idx}
                className="bg-[#070D18] border border-slate-800/90 rounded-xl p-3.5 space-y-1"
              >
                <div className="text-xs font-mono font-bold text-blue-300 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-blue-950 text-cyan-300 text-[10px] flex items-center justify-center border border-blue-800">
                    {idx + 1}
                  </span>
                  <span>{point.title}</span>
                </div>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. INTERACTIVE VISUAL SHOWCASE (CHAPTER-SPECIFIC ARTIFACT) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <h3 className="text-sm font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>{activeChapter.interactiveShowcase.title}</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-cyan-300 border border-blue-800">
              {activeChapter.interactiveShowcase.badge}
            </span>
          </div>

          {/* Chapter 1 Showcase: Conversation vs Contract */}
          {activeChapter.interactiveShowcase.type === "contract_dialogue" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-[#070D18] border border-slate-800 rounded-2xl p-4 sm:p-5">
              {/* Natural Conversation */}
              <div className="space-y-3 bg-[#0a1122] p-4 rounded-xl border border-blue-900/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-400">
                    1. How Developer Naturally Speaks
                  </span>
                  <span className="text-[10px] font-mono bg-blue-950 text-blue-300 px-2 py-0.5 rounded">
                    Human Voice
                  </span>
                </div>
                <div className="bg-[#050B14] p-3 rounded-lg border border-blue-950 text-xs text-slate-200 font-sans italic leading-relaxed">
                  &ldquo;Fix PROJECT-123. Invalid order state transitions must be rejected. Keep the public API unchanged. Stay inside the order-state validation and its focused tests. Run PHPStan and the focused test suite.&rdquo;
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Developers shouldn&apos;t be forced to write CLI parameters or micromanage file diffs. Natural language is the natural entry point.
                </p>
              </div>

              {/* Candidate Contract on Disk */}
              <div className="space-y-3 bg-[#071318] p-4 rounded-xl border border-cyan-900/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-300">
                    2. Candidate Contract Formulated by Agent
                  </span>
                  <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                    Revision 1 • Pending Review
                  </span>
                </div>
                <div className="bg-[#030910] p-3 rounded-lg border border-cyan-950/80 font-mono text-xs text-slate-300 space-y-1.5 leading-relaxed">
                  <div><strong className="text-cyan-400">Goal:</strong> Reject invalid order state transitions</div>
                  <div><strong className="text-cyan-400">Allowed Scope:</strong> <code className="text-amber-300">src/Domain/Order.php</code>, <code className="text-amber-300">tests/Domain/OrderTest.php</code></div>
                  <div><strong className="text-cyan-400">Non-goals:</strong> Do not redesign order aggregate. No public API changes.</div>
                  <div><strong className="text-cyan-400">Validation:</strong> <code className="text-emerald-300">composer phpstan &amp;&amp; composer test</code></div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-300 bg-cyan-950/40 p-2 rounded border border-cyan-800/40">
                  <span><strong>Human Boundary:</strong> Developer reviews &amp; says &ldquo;Approved&rdquo;</span>
                  <span className="text-cyan-400 font-mono font-bold">decision_required</span>
                </div>
              </div>
            </div>
          )}

          {/* Chapter 2 Showcase: The 5 Canonical Action Kinds */}
          {activeChapter.interactiveShowcase.type === "action_kinds" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {[
                  {
                    kind: "command",
                    color: "text-blue-400 border-blue-800 bg-blue-950/40",
                    description: "Workflow already knows the exact deterministic operation.",
                    example: "composer test --filter OrderTest"
                  },
                  {
                    kind: "command_template",
                    color: "text-cyan-300 border-cyan-800 bg-cyan-950/40",
                    description: "Host fills task-specific values from repository evidence.",
                    example: "git diff -- {approved_scope}"
                  },
                  {
                    kind: "host_work",
                    color: "text-emerald-300 border-emerald-800 bg-emerald-950/40",
                    description: "Authorizes engineering work strictly inside approved boundaries.",
                    example: "Edit src/Domain/Order.php"
                  },
                  {
                    kind: "decision_required",
                    color: "text-amber-300 border-amber-800 bg-amber-950/40",
                    description: "A real human-authority boundary has been reached.",
                    example: "Approve scope expansion"
                  },
                  {
                    kind: "none",
                    color: "text-purple-300 border-purple-800 bg-purple-950/40",
                    description: "No further lifecycle action; task has converged.",
                    example: "All gates complete & verified"
                  }
                ].map((act) => (
                  <div
                    key={act.kind}
                    className={`p-3 rounded-xl border ${act.color} space-y-1.5 flex flex-col justify-between`}
                  >
                    <div>
                      <div className="font-mono text-xs font-bold uppercase tracking-wider">
                        {act.kind}
                      </div>
                      <p className="text-[11px] text-slate-300 font-sans mt-1 leading-snug">
                        {act.description}
                      </p>
                    </div>
                    <div className="font-mono text-[10px] text-slate-400 bg-black/40 px-2 py-1 rounded truncate">
                      {act.example}
                    </div>
                  </div>
                ))}
              </div>

              {/* Working Memory Callout */}
              <div className="bg-[#070D18] border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="font-mono font-bold text-slate-200 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-blue-400" />
                    <span>Working Memory Stays Temporary (<code className="text-cyan-300">voku/agent-session</code>)</span>
                  </div>
                  <p className="text-slate-400 font-sans">
                    A Session tracks assumptions, checkpoints, and resume state. It is closable and pruneable—scratchpads never leak into permanent project memory.
                  </p>
                </div>
                <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2.5 py-1 rounded-md shrink-0">
                  Pruned on task close
                </span>
              </div>
            </div>
          )}

          {/* Chapter 3 Showcase: Map AST Intelligence vs Token Dump */}
          {activeChapter.interactiveShowcase.type === "map_comparison" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-[#070D18] border border-slate-800 rounded-2xl p-4 sm:p-5">
              <div className="bg-[#120707] border border-red-900/40 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-red-400">
                  <span>Naive: Token Dump</span>
                  <span className="text-[10px] bg-red-950 px-2 py-0.5 rounded text-red-300">~85,000 tokens</span>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Dumps entire source files, full git logs, and endless directory trees into prompts. Dilutes attention, exhausts tokens, and induces hallucinated assumptions when unobserved edges are wrongly treated as proof of absence.
                </p>
                <div className="font-mono text-[10px] text-red-300/80 bg-black/40 p-2 rounded">
                  ⚠️ Context window polluted with irrelevant classes
                </div>
              </div>

              <div className="bg-[#051318] border border-cyan-800/60 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-300">
                  <span>Governed: agent-map + agent-recall-compiler</span>
                  <span className="text-[10px] bg-cyan-950 px-2 py-0.5 rounded text-cyan-300 border border-cyan-800">~1,200 tokens</span>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  <strong className="text-cyan-300 font-mono">agent-map</strong> provides deterministic AST symbol callers and callees. <strong className="text-cyan-300 font-mono">agent-recall-compiler</strong> synthesizes the minimal L1 Briefing: Goal, Context, Constraints, Verification, and Done When.
                </p>
                <div className="font-mono text-[10px] text-cyan-300/90 bg-black/40 p-2 rounded">
                  ✓ Verified symbol boundaries • Outcome tracking (helpful/irrelevant/harmful)
                </div>
              </div>
            </div>
          )}

          {/* Chapter 4 Showcase: Cryptographic Tree Snapshots & Invalidation */}
          {activeChapter.interactiveShowcase.type === "validation_states" && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs font-mono">
                {[
                  { state: "current", desc: "Tree SHA matches & exit code 0", badge: "bg-emerald-950 text-emerald-300 border-emerald-800" },
                  { state: "superseded_by_impl", desc: "Files touched after test run", badge: "bg-amber-950 text-amber-300 border-amber-800" },
                  { state: "superseded_by_rev", desc: "Contract revision changed", badge: "bg-blue-950 text-blue-300 border-blue-800" },
                  { state: "missing", desc: "No validation receipt found", badge: "bg-slate-900 text-slate-400 border-slate-800" },
                  { state: "failed", desc: "Exit code non-zero", badge: "bg-red-950 text-red-300 border-red-800" }
                ].map((item) => (
                  <div key={item.state} className={`p-2.5 rounded-xl border ${item.badge} space-y-1`}>
                    <div className="font-bold">{item.state}</div>
                    <div className="text-[10px] opacity-80 font-sans">{item.desc}</div>
                  </div>
                ))}
              </div>

              <div className="bg-[#070D18] border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300 space-y-1.5 font-sans">
                <div className="font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span>The Cryptographic Invalidation Invariant</span>
                </div>
                <p className="leading-relaxed">
                  If an agent runs tests, passes, and then edits 3 more files, the old receipt is history—not evidence. <code className="text-cyan-300 font-mono">FinishCommand</code> compares the current Git tree SHA against the test receipt SHA. If they do not match, validation is invalidated immediately.
                </p>
              </div>
            </div>
          )}

          {/* Chapter 5 Showcase: Dual Learning Loop */}
          {activeChapter.interactiveShowcase.type === "dual_learning_loop" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-[#070D18] border border-slate-800 rounded-2xl p-4 sm:p-5">
              <div className="bg-[#061220] border border-blue-900/60 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-blue-300">
                  <span>1. The Fast Precedent Loop</span>
                  <span className="text-[10px] bg-blue-950 px-2 py-0.5 rounded text-blue-300 border border-blue-800">Task Level</span>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  <code className="text-cyan-300 font-mono">Finding</code> $\rightarrow$ <code className="text-cyan-300 font-mono">LearningNote</code>. A LearningNote is <strong>durable precedent, not active guidance</strong>. It says: &ldquo;We have seen something like this before. Here is the solved case.&rdquo; It does not approve mutations or widen scope.
                </p>
                <div className="font-mono text-[10px] text-blue-300/80 bg-black/40 p-2 rounded">
                  Most tasks learn nothing permanent (NO_DURABLE_LEARNING)
                </div>
              </div>

              <div className="bg-[#051614] border border-emerald-900/60 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-300">
                  <span>2. The Slow Promotion Loop (Dream)</span>
                  <span className="text-[10px] bg-emerald-950 px-2 py-0.5 rounded text-emerald-300 border border-emerald-800">Cross-Task Recurrence</span>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  <code className="text-emerald-300 font-mono">agent-loop learn dream</code> evaluates accumulated findings across independent tasks. Recurrence earns promotion to candidate Proposals. Proposals are reviewed by human authority and distilled into <strong>PHPStan rules or CI checks</strong>.
                </p>
                <div className="font-mono text-[10px] text-emerald-300/90 bg-black/40 p-2 rounded">
                  Lesson becomes mechanical code $\rightarrow$ prompt prose disappears!
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. WHERE THIS LIVES IN THE CODE (ARCHITECTURAL & REPO REFERENCES) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <h3 className="text-sm font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-cyan-400" />
              <span>Where This Lives in the Code (Package &amp; File References)</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Direct GitHub Reference Links
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeChapter.codeReferences.map((ref) => (
              <div
                key={ref.file}
                className="bg-[#070D18] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-blue-400 truncate">
                      {ref.file}
                    </span>
                    <a
                      href={ref.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-blue-950 text-cyan-300 hover:bg-blue-900 border border-blue-800 flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                    >
                      <span>{ref.package}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="text-xs font-bold text-slate-200">
                    {ref.role}
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {ref.architecturalTruth}
                  </p>
                </div>

                {ref.keySnippet && (
                  <div className="bg-[#040810] border border-slate-900 rounded-xl p-3 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
                    <pre>{ref.keySnippet}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 4. CONNECTING THE DOTS (HOW THIS CHAPTER PLUGS IN) */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-cyan-400" />
            <span>Connecting the Dots (Data Flow &amp; Hand-offs)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeChapter.connectedDots.map((dot, idx) => (
              <div
                key={idx}
                className="bg-[#070D18] border border-slate-800 rounded-2xl p-4 space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400 pb-2 border-b border-slate-800/80">
                  <span className="text-blue-400">{dot.from}</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-300">{dot.to}</span>
                </div>
                <div className="text-xs text-slate-300 font-sans">
                  <strong className="text-slate-200 font-mono text-[11px] block text-cyan-400/90 mb-0.5">
                    Mechanism:
                  </strong>
                  {dot.mechanism}
                </div>
                <div className="text-xs text-emerald-300/90 bg-emerald-950/30 p-2 rounded-lg border border-emerald-900/40 font-sans">
                  <strong className="font-mono text-[11px] block text-emerald-400 mb-0.5">
                    Guaranteed Outcome:
                  </strong>
                  {dot.outcome}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SPECIALIZED ARCHITECTURAL DEEP DIVE SECTIONS */}
        {activeChapter.id === "ch4" && (
          <div className="bg-amber-950/20 border border-amber-800/50 rounded-2xl p-4 sm:p-5 text-xs text-amber-200/90 space-y-2">
            <div className="flex items-center gap-2 font-mono font-bold text-amber-400">
              <AlertCircle className="w-4 h-4" />
              <span>Owner Boundary &amp; Fail-Closed Kanban Reconciliation (#503)</span>
            </div>
            <p className="leading-relaxed font-sans">
              <code className="font-mono text-amber-300">finish</code> does not itself silently reconcile Kanban cards or assume human intentions. When the Run is complete but the linked Kanban card remains active, Loop surfaces <code className="font-mono bg-amber-950/60 px-1.5 py-0.5 rounded text-amber-300 border border-amber-800/60">board.active_after_run_complete</code> and returns a <code className="font-mono text-cyan-300">host_work</code> reconciliation owned by <code className="font-mono text-cyan-300">agent-kanban</code>. It does not pretend the board is already reconciled.
            </p>
          </div>
        )}

        {activeChapter.id === "ch5" && (
          <div className="space-y-4">
            {/* CANONICAL LADDER */}
            <div className="bg-[#070D18] border border-cyan-800/40 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-2">
                <Workflow className="w-4 h-4" />
                <span>The Canonical Learning Ladder</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                The learning architecture is designed to close this loop cleanly without private host choreography:
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                {[
                  "Finding",
                  "LearningNote",
                  "Recall",
                  "L2 → L1",
                  "later execution",
                  "Finding",
                  "Dream",
                  "Proposal",
                  "Human approval",
                  "Constraint / Skill",
                  "mechanical enforcement"
                ].map((step, sIdx, arr) => (
                  <React.Fragment key={step}>
                    <span className="bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 px-2 py-1 rounded-md font-semibold text-[11px]">
                      {step}
                    </span>
                    {sIdx < arr.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 font-sans pt-1">
                <strong className="text-slate-300 font-mono">Delegation rule:</strong> <code className="text-cyan-300 font-mono">agent-learning</code> owns Dream semantics and distillation logic, while <code className="text-cyan-300 font-mono">agent-loop</code> resolves the project boundary and delegates via the front door (<code className="text-cyan-300 font-mono">agent-loop learn dream</code>).
              </p>
            </div>

            {/* PRE-1.0 EVIDENCE DISCLOSURE (#457) */}
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-2">
              <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Pre-1.0 Evidence Standard &amp; Disclosure (#457)</span>
              </div>
              <div className="text-xs text-slate-300 font-sans space-y-2 leading-relaxed">
                <p>
                  The individual mechanics of this loop exist today, including Finding capture, LearningNotes, deterministic Recall selection, Dream, reviewed Proposals, and Constraint enforcement.
                </p>
                <p className="border-l-2 border-emerald-500 pl-3 italic text-slate-200">
                  &ldquo;The project is still pre-1.0, and I am actively dogfooding the harder claim: whether precedent from one real task measurably changes a later independent task, and whether the resulting hard rule catches a different manifestation of the same problem. I would rather leave that claim open than turn &apos;the precedent appeared in the prompt&apos; into evidence that learning worked.&rdquo;
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  Applying our own evidence standard directly to ourselves makes the architecture accountable and reproducible.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. CLI PROJECTION */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Observable CLI Execution</span>
            </h3>
            <button
              onClick={() => copyCommand(activeChapter.cliExample.command)}
              className="text-xs font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedCmd === activeChapter.cliExample.command ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Copied
                </span>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Command
                </>
              )}
            </button>
          </div>

          <div className="bg-[#050A14] border border-slate-800 rounded-xl p-3 font-mono text-xs text-cyan-300 flex items-center gap-2">
            <span className="text-slate-500 font-bold">$</span>
            <span>{activeChapter.cliExample.command}</span>
          </div>

          <pre className="bg-[#050A14] border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
            {activeChapter.cliExample.output}
          </pre>
        </div>

        {/* CHAPTER STEPPER CONTROLS */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            disabled={activeChapter.chapterNumber === 1}
            onClick={() => {
              const prevIndex = activeChapter.chapterNumber - 2;
              if (prevIndex >= 0) setActiveChapterId(chapters[prevIndex].id);
            }}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
              activeChapter.chapterNumber === 1
                ? "opacity-30 cursor-not-allowed text-slate-500"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200"
            }`}
          >
            ← Previous Chapter
          </button>

          <span className="text-xs font-mono text-slate-400">
            Chapter {activeChapter.chapterNumber} of 5
          </span>

          <button
            onClick={() => {
              const nextIndex = activeChapter.chapterNumber % chapters.length;
              setActiveChapterId(chapters[nextIndex].id);
            }}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-cyan-500/20"
          >
            <span>{activeChapter.chapterNumber === 5 ? "Restart at Chapter 1" : "Next Chapter"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* END-TO-END ARCHITECTURE DIAGRAM MAP */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-xl font-black tracking-tight text-slate-950">
              The Connected Pipeline (Lifecycle Data Flow)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              From developer intent to durable repo structure with zero prompt inflation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative font-mono text-xs">
          {chapters.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => setActiveChapterId(ch.id)}
              className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                activeChapterId === ch.id
                  ? "bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-xs"
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100/80"
              }`}
            >
              <div>
                <div className="text-[10px] font-bold text-blue-700 uppercase">
                  Ch {ch.chapterNumber}
                </div>
                <div className="font-bold text-slate-900 text-xs mt-0.5 line-clamp-2">
                  {ch.title}
                </div>
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {ch.subtitle.split("•")[0].trim()}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* WHAT CHANGED IN MY MENTAL MODEL & ONE SEMANTIC OWNER MATRIX */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg">
            <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
            <span>Mental Model Shift</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 mt-2">
            What Changed in My Mental Model
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-sans mt-1 max-w-3xl leading-relaxed">
            Instead of asking <em className="text-slate-800 font-semibold">&ldquo;How can the coding agent remember useful things?&rdquo;</em> (which leads directly to context landfill), the system asks a disciplined seven-stage sequence:
          </p>
        </div>

        {/* 7-Step Mental Shift Pipeline */}
        <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
          {[
            "1. What happened?",
            "2. Is there evidence?",
            "3. Is it useful precedent?",
            "4. Does it recur?",
            "5. Human approves as guidance?",
            "6. Can software enforce it?",
            "7. Delete the prompt prose"
          ].map((item, idx, arr) => (
            <React.Fragment key={item}>
              <span className={`px-3 py-1.5 rounded-xl border font-bold text-xs ${
                idx === arr.length - 1
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : "bg-slate-50 text-slate-800 border-slate-200"
              }`}>
                {item}
              </span>
              {idx < arr.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ONE SEMANTIC OWNER PER KIND OF TRUTH TABLE */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-mono text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>One Semantic Owner Per Kind of Truth</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Authority Matrix</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-50 border-b border-slate-200 font-mono text-slate-600 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4 font-bold">Concern</th>
                  <th className="py-2.5 px-4 font-bold">Semantic Owner</th>
                  <th className="py-2.5 px-4 font-bold">Role &amp; Invariant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {[
                  { concern: "Contract / Run authority & lifecycle", owner: "voku/agent-loop", note: "Canonical workflow orchestration & front door" },
                  { concern: "Git-native work items (docs/kanban/*.md)", owner: "voku/agent-kanban", note: "Task boundary & markdown board authority" },
                  { concern: "Temporary working memory & validation evidence", owner: "voku/agent-session", note: "Closable & pruneable across turns" },
                  { concern: "Repository structure & code navigation", owner: "voku/agent-map", note: "AST symbols, bounded edit context (derived navigation evidence)" },
                  { concern: "Bounded task context & prompt construction", owner: "voku/agent-recall-compiler", note: "L1 briefing + selection events as machine evidence; outcomes only when judged" },
                  { concern: "Findings, precedent and durable Learning", owner: "voku/agent-learning", note: "Findings only when evidence exists; reasonless no_durable_learning is valid" },
                  { concern: "Portable engineering & review guidance", owner: "voku/agent-skills", note: "Optional, separately installed catalog" },
                  { concern: "Local human control plane", owner: "voku/agent-ui", note: "Optional presentation surface; consumes owner projections without reconstructing lifecycle semantics" },
                  { concern: "Isolated coding-host execution plane", owner: "voku/agent-loop-runner", note: "Optional runner; current clean-consumer proof resolves Loop 0.20.40 without owning close-out truth" },
                  { concern: "Shared deterministic SQLite graph mechanics", owner: "voku/agent-graph", note: "Infrastructure for Map & Learning; owns zero domain semantics" },
                ].map((row) => (
                  <tr key={row.concern} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-4 font-medium text-slate-900">{row.concern}</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-blue-700">{row.owner}</td>
                    <td className="py-2.5 px-4 text-slate-500">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* VERIFIED GITHUB VOKU/AGENT-* PACKAGES DIRECTORY */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cross-Checked with github.com/voku/agent-*</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 mt-2">
              The Official voku/agent-* Ecosystem
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Every package is modular, local-first, and published on Composer &amp; GitHub.
            </p>
          </div>

          <a
            href="https://github.com/voku"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-colors self-start sm:self-center shrink-0"
          >
            <span>View All on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-300" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              pkg: "voku/agent-loop",
              role: "Umbrella CLI & Workflow Orchestrator",
              desc: "Unified Composer CLI for the governed coding-agent loop: enter, next_action, and finish.",
              chapter: "Chapters 1, 2, 4",
              github: "https://github.com/voku/agent-loop"
            },
            {
              pkg: "voku/agent-kanban",
              role: "Markdown Kanban Board & Authority",
              desc: "Markdown TODO Kanban parser, renderer, and verifier for coding-agent workflows (docs/kanban/*.md).",
              chapter: "Chapter 1",
              github: "https://github.com/voku/agent-kanban"
            },
            {
              pkg: "voku/agent-session",
              role: "Working-Memory Layer",
              desc: "Per-task session plans, decisions, assumptions, checkpoints, and claim metadata across turns.",
              chapter: "Chapter 2",
              github: "https://github.com/voku/agent-session"
            },
            {
              pkg: "voku/agent-map",
              role: "Compact PHP AST Symbol Mapper",
              desc: "Fast symbol and dependency indexer providing verified code structure without raw token bloat.",
              chapter: "Chapter 3",
              github: "https://github.com/voku/agent-map"
            },
            {
              pkg: "voku/agent-graph",
              role: "Deterministic SQLite Graph Runtime",
              desc: "Deterministic SQLite graph indexing and shared SQLite runtime for coding-agent tools.",
              chapter: "Chapter 3",
              github: "https://github.com/voku/agent-graph"
            },
            {
              pkg: "voku/agent-recall-compiler",
              role: "L2 Meta-Prompt & Briefing Compiler",
              desc: "Deterministic L2 Meta-Prompt compiler and briefing manager for task-focused recall.",
              chapter: "Chapter 3",
              github: "https://github.com/voku/agent-recall-compiler"
            },
            {
              pkg: "voku/agent-learning",
              role: "Reviewable Learning & Distillation Loop",
              desc: "Tooling for reviewable findings, proposals, redactions, and decision history.",
              chapter: "Chapter 5",
              github: "https://github.com/voku/agent-learning"
            }
          ].map((item) => (
            <div
              key={item.pkg}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 hover:bg-slate-100/60 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-blue-700">
                    {item.pkg}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100/70 text-blue-800 font-semibold">
                    {item.chapter}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1">
                  {item.role}
                </div>
                <p className="text-xs text-slate-600 font-sans mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-mono">
                <a
                  href={item.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-bold"
                >
                  <span>Repository</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-slate-400 text-[11px]">PHP 8.3+</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footnotes on skills & graph infrastructure */}
        <div className="pt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600 font-sans border-t border-slate-100">
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <span className="font-mono font-bold text-slate-800 block text-[11px]">
              Optional Skills Catalog:
            </span>
            <p>
              The portable <code className="font-mono text-blue-700 bg-white px-1 py-0.5 rounded border border-slate-200">agent-skills</code> catalog is optional and separately installed (<code className="font-mono text-blue-700">npx skills add voku/agent-skills</code> or supplied to Loop as an extra skill root); Agent Loop does not silently download a second engineering rulebook.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <span className="font-mono font-bold text-slate-800 block text-[11px]">
              Graph Infrastructure Role:
            </span>
            <p>
              Internally, <code className="font-mono text-blue-700 bg-white px-1 py-0.5 rounded border border-slate-200">agent-graph</code> provides shared deterministic SQLite graph mechanics for Map and Learning; it deliberately owns none of their domain semantics.
            </p>
          </div>
        </div>
      </div>

      {/* THE ACTUAL LESSON CARD */}
      <div className="bg-[#0B1528] border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Core Thesis</span>
            </div>
            <h3 className="text-2xl font-black tracking-tight text-white mt-1">
              The Actual Lesson: Intentional Forgetting
            </h3>
          </div>
          <div className="font-mono text-xs text-slate-400">
            More memory hides bad context management. A governed loop exposes it.
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed font-sans max-w-4xl">
          Coding agents do not need to remember everything. They need:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
          {[
            { label: "Durable task intent", desc: "Survives chat resets in Git-tracked Kanban contracts" },
            { label: "Explicit authority boundaries", desc: "Humans approve intent, not shell commands" },
            { label: "Bounded repository context", desc: "Map intelligence provides bounded edit context, not token dumps" },
            { label: "Temporary working memory", desc: "Sessions are closable and pruneable; not permanent landfill" },
            { label: "Implementation-bound validation", desc: "Tied cryptographically to exact Contract rev + Git tree hash" },
            { label: "One canonical next action", desc: "Explicit action kind that converges deterministically" },
            { label: "Evidence-backed precedent", desc: "LearningNotes represent precedent, not active project policy" },
            { label: "Recurrence before promotion", desc: "Lessons must recur across independent tasks to earn review" },
            { label: "Deterministic enforcement", desc: "Stable invariants become PHPStan rules and CI sniffs" },
            { label: "Intentional forgetting", desc: "Once CI proves the invariant, prompt prose can safely disappear" },
          ].map((item) => (
            <div key={item.label} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
              <div className="text-cyan-300 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{item.label}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/60 text-xs text-slate-300 font-sans leading-relaxed">
          <span className="font-bold text-cyan-200">The Ultimate Goal:</span> And once a lesson becomes stable enough that PHPStan, a test, a typed API, or CI can enforce it, the ideal outcome is not that the coding agent remembers it forever. <strong className="text-white">The ideal outcome is that it no longer has to.</strong>
        </div>
      </div>

    </div>
  );
}
