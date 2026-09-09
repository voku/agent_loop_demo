import { ScenarioDefinition } from "./types";

export const SCENARIOS: readonly ScenarioDefinition[] = [
  // =========================================================================
  // SCENARIO A: ORDINARY DURABLE TASK (CANONICAL)
  // =========================================================================
  {
    id: "scenario_a",
    letter: "A",
    name: "Ordinary Durable Task",
    tagline: "The canonical lifecycle: enter -> obey -> work when authorized -> finish -> complete",
    takeaway: "Every turn evaluates current owner-backed state. The host only mutates files when mutation_ready is true.",
    description: "Move a realistic feature request through the entire governed lifecycle: intent -> planning -> candidate contract -> human approval -> authorized host work -> validation -> review -> learning disposition -> closeout.",
    steps: [
      {
        stepIndex: 1,
        title: "Initial Enter — Unplanned Task",
        turnDescription: "Task intent provided. Kernel evaluates whether any contract exists.",
        invocation: "agent-loop enter DEMO-1 --format=json",
        beforeState: {
          task: { id: "DEMO-1", goal: "Add validated signup guards", owner: "agent-kanban" },
          contract: { revision: 0, status: "none", scope: [], validation: "none", owner: "agent-loop" },
          run: { status: "none", owner: "agent-loop" },
          session: { validation: "none", owner: "agent-session" },
          recall: { status: "not_needed", owner: "agent-recall-compiler" },
          review: { status: "not_started", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        lifecycleResult: {
          mutationReady: false,
          nextActionKind: "command_template",
          nextAction: "vendor/bin/agent-loop workflow plan DEMO-1 --goal <goal> --file <scope> --validation <cmd>",
          references: { contract: null, session: null, candidate: null }
        },
        explanation: "No Contract exists for DEMO-1. The host is not authorized to touch code. The canonical next action is to propose a candidate Contract with explicit scope.",
        ruleHighlight: "mutation_ready is false until a human-approved Contract defines the mutation boundary.",
        availableAction: {
          actor: "owner",
          title: "Propose Candidate Contract",
          description: "Invoke agent-loop workflow plan to register candidate revision 1 with scoped boundary and validation command.",
          buttonLabel: "Execute: workflow plan",
          actionType: "command",
          commandStr: "vendor/bin/agent-loop workflow plan DEMO-1 --goal \"Add validated signup guards\" --file \"src/Auth/\" --validation \"composer test\"",
          details: {
            goal: "Add validated signup guards",
            mutationBoundary: ["src/Auth/", "tests/Auth/"]
          }
        },
        afterState: {
          task: { id: "DEMO-1", goal: "Add validated signup guards", owner: "agent-kanban" },
          contract: { revision: 1, status: "candidate", scope: ["src/Auth/", "tests/Auth/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "none", owner: "agent-loop" },
          session: { validation: "missing", owner: "agent-session" },
          recall: { status: "not_needed", owner: "agent-recall-compiler" },
          review: { status: "not_started", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        evidenceTimeline: []
      },
      {
        stepIndex: 2,
        title: "Human Decision Gate",
        turnDescription: "Candidate contract proposed. Authority boundary requires human approval.",
        invocation: "agent-loop enter DEMO-1 --format=json",
        beforeState: {
          task: { id: "DEMO-1", goal: "Add validated signup guards", owner: "agent-kanban" },
          contract: { revision: 1, status: "candidate", scope: ["src/Auth/", "tests/Auth/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "none", owner: "agent-loop" },
          session: { validation: "missing", owner: "agent-session" },
          recall: { status: "not_needed", owner: "agent-recall-compiler" },
          review: { status: "not_started", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        lifecycleResult: {
          mutationReady: false,
          nextActionKind: "decision_required",
          nextAction: "Approve Contract revision 1",
          references: { contract: "candidate-r1", scope: ["src/Auth/", "tests/Auth/"] }
        },
        explanation: "Contract revision 1 is a candidate. The kernel emits decision_required. The host cannot self-authorize mutations; a human authority must approve.",
        ruleHighlight: "Only humans possess authority to grant repository mutation licenses.",
        availableAction: {
          actor: "human",
          title: "Approve Contract Revision 1",
          description: "Confirm proposed goal and boundary (src/Auth/, tests/Auth/). Authorizes active run.",
          buttonLabel: "Approve Contract r1",
          actionType: "human_decision",
          details: {
            goal: "Add validated signup guards",
            mutationBoundary: ["src/Auth/", "tests/Auth/"],
            decisionChoices: ["Approve Contract r1", "Reject & Request Replan"]
          }
        },
        afterState: {
          task: { id: "DEMO-1", goal: "Add validated signup guards", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Auth/", "tests/Auth/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "missing", owner: "agent-session" },
          recall: { status: "ready", documentCount: 2, owner: "agent-recall-compiler" },
          review: { status: "not_started", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        evidenceTimeline: []
      },
      {
        stepIndex: 3,
        title: "Host Work Authorized",
        turnDescription: "Contract approved. Kernel projects mutation_ready: true.",
        invocation: "agent-loop enter DEMO-1 --format=json",
        beforeState: {
          task: { id: "DEMO-1", goal: "Add validated signup guards", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Auth/", "tests/Auth/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "missing", owner: "agent-session" },
          recall: { status: "ready", documentCount: 2, owner: "agent-recall-compiler" },
          review: { status: "not_started", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        lifecycleResult: {
          mutationReady: true,
          nextActionKind: "host_work",
          nextAction: "Implement the approved change inside src/Auth/.",
          references: { contract: "approved-r1", run: "active-run-1" }
        },
        explanation: "The host may edit now. The approved Contract authorizes mutation strictly inside src/Auth/ and tests/Auth/. Validation evidence is missing.",
        ruleHighlight: "Host implementation work is only legal while mutation_ready is true.",
        availableAction: {
          actor: "host",
          title: "Implement Signup Validation",
          description: "Host mutates authorized file src/Auth/Signup.php to implement email format checking and domain validation.",
          buttonLabel: "Perform Host Edit: Signup.php",
          actionType: "host_work",
          details: {
            modifiedFiles: ["src/Auth/Signup.php"]
          }
        },
        afterState: {
          task: { id: "DEMO-1", goal: "Add validated signup guards", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Auth/", "tests/Auth/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "missing", treeId: "tree_a101", owner: "agent-session" },
          recall: { status: "ready", documentCount: 2, owner: "agent-recall-compiler" },
          review: { status: "not_started", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        evidenceTimeline: []
      },
      {
        stepIndex: 4,
        title: "Validation Evidence Required",
        turnDescription: "Host requests finish. Kernel requires fresh validation receipt for tree_a101.",
        invocation: "agent-loop finish DEMO-1 --format=json",
        beforeState: {
          task: { id: "DEMO-1", goal: "Add validated signup guards", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Auth/", "tests/Auth/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "missing", treeId: "tree_a101", owner: "agent-session" },
          recall: { status: "ready", documentCount: 2, owner: "agent-recall-compiler" },
          review: { status: "not_started", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        lifecycleResult: {
          mutationReady: false,
          nextActionKind: "command",
          nextAction: "composer test",
          references: { command: "composer test", expected_tree: "tree_a101" }
        },
        explanation: "Host editing is finished. The Contract mandates validation via 'composer test'. The kernel halts mutations and commands evidence recording.",
        ruleHighlight: "Evidence must be captured by owner package agent-session against the exact git tree.",
        availableAction: {
          actor: "owner",
          title: "Run Validation Command",
          description: "Execute composer test and store cryptographic receipt tied to tree_a101.",
          buttonLabel: "Record: composer test",
          actionType: "command",
          commandStr: "composer test",
          details: { exitCode: 0 }
        },
        afterState: {
          task: { id: "DEMO-1", goal: "Add validated signup guards", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Auth/", "tests/Auth/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "recorded_passed", treeId: "tree_a101", exitCode: 0, command: "composer test", owner: "agent-session" },
          recall: { status: "ready", documentCount: 2, owner: "agent-recall-compiler" },
          review: { status: "not_started", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        evidenceTimeline: [
          {
            receiptNumber: 1,
            contractRevision: 1,
            implementationTree: "tree_a101",
            command: "composer test",
            exitCode: 0,
            status: "valid",
            producedBy: "agent-session",
            timestamp: "2026-09-09T09:12:04Z",
            note: "14 tests passed, 32 assertions (0.12s)"
          }
        ]
      },
      {
        stepIndex: 5,
        title: "Review Evidence Generation",
        turnDescription: "Validation passed. Next gate: compile bounded review against recall documents.",
        invocation: "agent-loop finish DEMO-1 --format=json",
        beforeState: {
          task: { id: "DEMO-1", goal: "Add validated signup guards", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Auth/", "tests/Auth/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "recorded_passed", treeId: "tree_a101", exitCode: 0, owner: "agent-session" },
          recall: { status: "ready", documentCount: 2, owner: "agent-recall-compiler" },
          review: { status: "not_started", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        lifecycleResult: {
          mutationReady: false,
          nextActionKind: "command",
          nextAction: "vendor/bin/agent-recall-compiler review DEMO-1",
          references: { recallDocs: 2, tree: "tree_a101" }
        },
        explanation: "Validation is green. The kernel requests review evidence from agent-recall-compiler. No human gate needed unless an unaccepted finding is observed.",
        ruleHighlight: "Delegated review work remains tool/agent work unless kernel explicitly emits decision_required.",
        availableAction: {
          actor: "owner",
          title: "Compile Review Evidence",
          description: "Run agent-recall-compiler to verify code compliance with architectural guidelines.",
          buttonLabel: "Record: recall-compiler review",
          actionType: "command",
          commandStr: "vendor/bin/agent-recall-compiler review DEMO-1"
        },
        afterState: {
          task: { id: "DEMO-1", goal: "Add validated signup guards", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Auth/", "tests/Auth/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "recorded_passed", treeId: "tree_a101", exitCode: 0, owner: "agent-session" },
          recall: { status: "ready", documentCount: 2, owner: "agent-recall-compiler" },
          review: { status: "passed", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        evidenceTimeline: [
          {
            receiptNumber: 1,
            contractRevision: 1,
            implementationTree: "tree_a101",
            command: "composer test",
            exitCode: 0,
            status: "valid",
            producedBy: "agent-session",
            timestamp: "2026-09-09T09:12:04Z"
          },
          {
            receiptNumber: 2,
            contractRevision: 1,
            implementationTree: "tree_a101",
            command: "agent-recall-compiler review",
            exitCode: 0,
            status: "valid",
            producedBy: "agent-recall-compiler",
            timestamp: "2026-09-09T09:12:18Z",
            note: "All 2 recall rules satisfied. Clean diff."
          }
        ]
      },
      {
        stepIndex: 6,
        title: "Learning Disposition",
        turnDescription: "Review passed. Kernel requests learning disposition from host.",
        invocation: "agent-loop finish DEMO-1 --format=json",
        beforeState: {
          task: { id: "DEMO-1", goal: "Add validated signup guards", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Auth/", "tests/Auth/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "recorded_passed", treeId: "tree_a101", exitCode: 0, owner: "agent-session" },
          recall: { status: "ready", documentCount: 2, owner: "agent-recall-compiler" },
          review: { status: "passed", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        lifecycleResult: {
          mutationReady: false,
          nextActionKind: "host_work",
          nextAction: "Record Learning disposition: evaluate whether this task yielded reusable repository knowledge.",
          references: { findings: [] }
        },
        explanation: "No findings or surprises were encountered. The host records that this standard task requires no durable repository learning.",
        ruleHighlight: "Not every task produces a permanent rule. Routine tasks finish without prompt landfill.",
        availableAction: {
          actor: "host",
          title: "Record Learning Disposition",
          description: "Record 'no_durable_learning' in agent-learning ledger. No new repository guidelines needed.",
          buttonLabel: "Record: No Durable Learning",
          actionType: "host_work"
        },
        afterState: {
          task: { id: "DEMO-1", goal: "Add validated signup guards", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Auth/", "tests/Auth/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "recorded_passed", treeId: "tree_a101", exitCode: 0, owner: "agent-session" },
          recall: { status: "ready", documentCount: 2, owner: "agent-recall-compiler" },
          review: { status: "passed", owner: "agent-recall-compiler" },
          learning: { status: "no_durable_learning", owner: "agent-learning" }
        },
        evidenceTimeline: [
          {
            receiptNumber: 1,
            contractRevision: 1,
            implementationTree: "tree_a101",
            command: "composer test",
            exitCode: 0,
            status: "valid",
            producedBy: "agent-session",
            timestamp: "2026-09-09T09:12:04Z"
          },
          {
            receiptNumber: 2,
            contractRevision: 1,
            implementationTree: "tree_a101",
            command: "agent-recall-compiler review",
            exitCode: 0,
            status: "valid",
            producedBy: "agent-recall-compiler",
            timestamp: "2026-09-09T09:12:18Z"
          }
        ]
      },
      {
        stepIndex: 7,
        title: "Task Lifecycle Complete",
        turnDescription: "All gates satisfied with owner-backed evidence. Run sealed.",
        invocation: "agent-loop finish DEMO-1 --format=json",
        beforeState: {
          task: { id: "DEMO-1", goal: "Add validated signup guards", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Auth/", "tests/Auth/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "recorded_passed", treeId: "tree_a101", exitCode: 0, owner: "agent-session" },
          recall: { status: "ready", documentCount: 2, owner: "agent-recall-compiler" },
          review: { status: "passed", owner: "agent-recall-compiler" },
          learning: { status: "no_durable_learning", owner: "agent-learning" }
        },
        lifecycleResult: {
          mutationReady: false,
          nextActionKind: "none",
          nextAction: null,
          references: { status: "completed", runManifest: "sealed" }
        },
        explanation: "The lifecycle run is complete. All gates are satisfied with immutable owner-backed receipts. The host halts.",
        ruleHighlight: "Stop when next_action_kind is none.",
        availableAction: {
          actor: "kernel",
          title: "Run Sealed & Complete",
          description: "All contract requirements verified. Run artifact sealed into local ledger.",
          buttonLabel: "Lifecycle Run Finished",
          actionType: "kernel_eval"
        },
        afterState: {
          task: { id: "DEMO-1", goal: "Add validated signup guards", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Auth/", "tests/Auth/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "completed", owner: "agent-loop" },
          session: { validation: "recorded_passed", treeId: "tree_a101", exitCode: 0, owner: "agent-session" },
          recall: { status: "ready", documentCount: 2, owner: "agent-recall-compiler" },
          review: { status: "passed", owner: "agent-recall-compiler" },
          learning: { status: "no_durable_learning", owner: "agent-learning" }
        },
        evidenceTimeline: [
          {
            receiptNumber: 1,
            contractRevision: 1,
            implementationTree: "tree_a101",
            command: "composer test",
            exitCode: 0,
            status: "valid",
            producedBy: "agent-session",
            timestamp: "2026-09-09T09:12:04Z"
          },
          {
            receiptNumber: 2,
            contractRevision: 1,
            implementationTree: "tree_a101",
            command: "agent-recall-compiler review",
            exitCode: 0,
            status: "valid",
            producedBy: "agent-recall-compiler",
            timestamp: "2026-09-09T09:12:18Z"
          }
        ]
      }
    ]
  },

  // =========================================================================
  // SCENARIO B: SCOPE DISCOVERY INSIDE APPROVED BOUNDARY
  // =========================================================================
  {
    id: "scenario_b",
    letter: "B",
    name: "Scope Discovery Inside Approved Boundary",
    tagline: "Discovered files inside the approved boundary require zero human interruptions",
    takeaway: "Boundary governance operates on prefix whitelists, not brittle single-file micro-approvals.",
    description: "Contract was approved for 'src/Auth/' and 'tests/Auth/'. The host expected to edit Signup.php, but discovered it also needs SignupValidator.php. Because SignupValidator.php sits inside the approved boundary, mutation_ready stays true without human re-approval.",
    steps: [
      {
        stepIndex: 1,
        title: "Discovered File Inside Approved Boundary",
        turnDescription: "Host discovers it must create SignupValidator.php inside src/Auth/.",
        invocation: "agent-loop enter DEMO-2 --format=json",
        beforeState: {
          task: { id: "DEMO-2", goal: "Refactor signup validation", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Auth/", "tests/Auth/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "missing", owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "not_started", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        lifecycleResult: {
          mutationReady: true,
          nextActionKind: "host_work",
          nextAction: "Implement changes in src/Auth/SignupValidator.php (covered by approved scope src/Auth/).",
          references: { approved_scope: ["src/Auth/", "tests/Auth/"], target: "src/Auth/SignupValidator.php" }
        },
        explanation: "NO NEW APPROVAL REQUIRED. SignupValidator.php is already within the approved mutation boundary (src/Auth/). The host proceeds without human interruption.",
        ruleHighlight: "Destroys the misconception that every discovered file requires re-planning. If it fits the approved boundary, work continues.",
        availableAction: {
          actor: "host",
          title: "Mutate Discovered File",
          description: "Edit src/Auth/SignupValidator.php freely under existing revision 1 authority.",
          buttonLabel: "Edit: src/Auth/SignupValidator.php",
          actionType: "host_work",
          details: {
            modifiedFiles: ["src/Auth/Signup.php", "src/Auth/SignupValidator.php"]
          }
        },
        afterState: {
          task: { id: "DEMO-2", goal: "Refactor signup validation", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Auth/", "tests/Auth/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "missing", treeId: "tree_b202", owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "not_started", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        evidenceTimeline: []
      },
      {
        stepIndex: 2,
        title: "Validation On Complete Scope",
        turnDescription: "Host requests finish. Both files are verified against tests.",
        invocation: "agent-loop finish DEMO-2 --format=json",
        beforeState: {
          task: { id: "DEMO-2", goal: "Refactor signup validation", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Auth/", "tests/Auth/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "missing", treeId: "tree_b202", owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "not_started", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        lifecycleResult: {
          mutationReady: false,
          nextActionKind: "command",
          nextAction: "composer test",
          references: { files_checked: ["src/Auth/Signup.php", "src/Auth/SignupValidator.php"] }
        },
        explanation: "Both files pass diff whitelist checks. Kernel commands execution of validation tests for tree_b202.",
        ruleHighlight: "Diff inspection guarantees all modified files match the contract whitelist.",
        availableAction: {
          actor: "owner",
          title: "Run Test Suite",
          description: "Execute test suite against the updated validation classes.",
          buttonLabel: "Record: composer test",
          actionType: "command",
          commandStr: "composer test",
          details: { exitCode: 0 }
        },
        afterState: {
          task: { id: "DEMO-2", goal: "Refactor signup validation", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Auth/", "tests/Auth/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "recorded_passed", treeId: "tree_b202", exitCode: 0, owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "not_started", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        evidenceTimeline: [
          {
            receiptNumber: 1,
            contractRevision: 1,
            implementationTree: "tree_b202",
            command: "composer test",
            exitCode: 0,
            status: "valid",
            producedBy: "agent-session",
            timestamp: "2026-09-09T09:18:22Z"
          }
        ]
      }
    ]
  },

  // =========================================================================
  // SCENARIO C: REAL SCOPE EXPANSION
  // =========================================================================
  {
    id: "scenario_c",
    letter: "C",
    name: "Real Scope Expansion",
    tagline: "Out-of-boundary file discovered -> mutation_ready revoked -> decision required",
    takeaway: "An agent cannot expand its own license. Out-of-bounds mutation halts the loop immediately.",
    description: "Contract r1 authorized 'src/Auth/'. During implementation, the host discovers it must modify 'config/security.php'. The kernel halts mutations (mutation_ready: false) and requires Contract revision 2.",
    steps: [
      {
        stepIndex: 1,
        title: "Out-of-Bounds File Discovered",
        turnDescription: "Host requests authority to touch config/security.php.",
        invocation: "agent-loop enter DEMO-3 --format=json",
        beforeState: {
          task: { id: "DEMO-3", goal: "Enforce session timeout", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Auth/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "missing", owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "not_started", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        lifecycleResult: {
          mutationReady: false,
          nextActionKind: "decision_required",
          nextAction: "Approve Contract revision 2 with expanded mutation boundary including config/security.php",
          references: { requestedFile: "config/security.php", currentScope: ["src/Auth/"] }
        },
        explanation: "MUTATION REVOKED. config/security.php is outside the approved scope (src/Auth/). The kernel stops mutations and demands a human decision to approve Contract revision 2.",
        ruleHighlight: "Fail-closed boundary: zero unapproved mutations escape into the repository.",
        availableAction: {
          actor: "human",
          title: "Approve Contract Revision 2",
          description: "Human reviews scope escalation: approve adding config/security.php to mutation boundary.",
          buttonLabel: "Approve Revision 2 (Expanded Scope)",
          actionType: "human_decision",
          details: {
            goal: "Enforce session timeout (with config update)",
            mutationBoundary: ["src/Auth/", "config/security.php"],
            warningNote: "Grants permission to mutate repository configuration files."
          }
        },
        afterState: {
          task: { id: "DEMO-3", goal: "Enforce session timeout", owner: "agent-kanban" },
          contract: { revision: 2, status: "approved", scope: ["src/Auth/", "config/security.php"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "missing", owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "not_started", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        evidenceTimeline: []
      },
      {
        stepIndex: 2,
        title: "Work Resumes Under Revision 2",
        turnDescription: "Human approved revision 2. Kernel restores mutation_ready: true.",
        invocation: "agent-loop enter DEMO-3 --format=json",
        beforeState: {
          task: { id: "DEMO-3", goal: "Enforce session timeout", owner: "agent-kanban" },
          contract: { revision: 2, status: "approved", scope: ["src/Auth/", "config/security.php"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "missing", owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "not_started", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        lifecycleResult: {
          mutationReady: true,
          nextActionKind: "host_work",
          nextAction: "Implement session timeout in src/Auth/ and config/security.php under approved revision 2.",
          references: { contract: "approved-r2", scope: ["src/Auth/", "config/security.php"] }
        },
        explanation: "The host may edit now. Contract revision 2 officially authorizes mutations inside config/security.php.",
        ruleHighlight: "Contract revisions preserve durable history: r1 superseded, r2 active.",
        availableAction: {
          actor: "host",
          title: "Perform Implementation Work",
          description: "Modify src/Auth/SessionGuard.php and config/security.php under revision 2.",
          buttonLabel: "Edit: SessionGuard & config",
          actionType: "host_work",
          details: {
            modifiedFiles: ["src/Auth/SessionGuard.php", "config/security.php"]
          }
        },
        afterState: {
          task: { id: "DEMO-3", goal: "Enforce session timeout", owner: "agent-kanban" },
          contract: { revision: 2, status: "approved", scope: ["src/Auth/", "config/security.php"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "missing", treeId: "tree_c303", owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "not_started", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        evidenceTimeline: []
      }
    ]
  },

  // =========================================================================
  // SCENARIO D: STALE EVIDENCE
  // =========================================================================
  {
    id: "scenario_d",
    letter: "D",
    name: "Stale Evidence & Git Tree Identity",
    tagline: "Tests once passed somewhere, but the code changed. Evidence is stale.",
    takeaway: "Evidence belongs to a cryptographic tree hash, not to a generic task name.",
    description: "Tests passed on tree abc123. The host then made an unverified edit (formatting/fix), changing the tree to def456. The kernel recognizes the existing receipt is stale and refuses to complete until current validation evidence is recorded.",
    steps: [
      {
        stepIndex: 1,
        title: "Code Changes Invalidate Previous Evidence",
        turnDescription: "Receipt exists for abc123. Code changed to def456. Host runs finish.",
        invocation: "agent-loop finish DEMO-4 --format=json",
        beforeState: {
          task: { id: "DEMO-4", goal: "Fix token expiration bug", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Token/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "stale", treeId: "def456", exitCode: 0, owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "not_started", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        lifecycleResult: {
          mutationReady: false,
          nextActionKind: "command",
          nextAction: "composer test",
          references: {
            current_tree: "def456",
            stale_receipt_tree: "abc123",
            reason: "Current tree does not match recorded evidence tree."
          }
        },
        explanation: "STALE EVIDENCE. Previous tests passed on tree abc123, but current working tree is def456. The kernel commands fresh validation evidence before finish can proceed.",
        ruleHighlight: "Evidence identity: test receipts belong to an exact tree SHA, not to a fuzzy session memory.",
        availableAction: {
          actor: "owner",
          title: "Rerun Validation on Current Tree",
          description: "Execute composer test against def456 to prove current code actually passes.",
          buttonLabel: "Record: composer test (def456)",
          actionType: "command",
          commandStr: "composer test",
          details: { exitCode: 0 }
        },
        afterState: {
          task: { id: "DEMO-4", goal: "Fix token expiration bug", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Token/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "recorded_passed", treeId: "def456", exitCode: 0, command: "composer test", owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "not_started", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        evidenceTimeline: [
          {
            receiptNumber: 1,
            contractRevision: 1,
            implementationTree: "abc123",
            command: "composer test",
            exitCode: 0,
            status: "stale",
            producedBy: "agent-session",
            timestamp: "2026-09-09T09:20:10Z",
            note: "STALE: Code changed after this receipt was generated."
          },
          {
            receiptNumber: 2,
            contractRevision: 1,
            implementationTree: "def456",
            command: "composer test",
            exitCode: 0,
            status: "valid",
            producedBy: "agent-session",
            timestamp: "2026-09-09T09:22:45Z",
            note: "FRESH: Verified green against def456."
          }
        ]
      },
      {
        stepIndex: 2,
        title: "Finish Proceeds With Fresh Evidence",
        turnDescription: "Current tree def456 verified. Closeout unblocked.",
        invocation: "agent-loop finish DEMO-4 --format=json",
        beforeState: {
          task: { id: "DEMO-4", goal: "Fix token expiration bug", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Token/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "recorded_passed", treeId: "def456", exitCode: 0, owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "passed", owner: "agent-recall-compiler" },
          learning: { status: "no_durable_learning", owner: "agent-learning" }
        },
        lifecycleResult: {
          mutationReady: false,
          nextActionKind: "none",
          nextAction: null,
          references: { status: "completed", tree: "def456" }
        },
        explanation: "All receipts now match tree def456. The task successfully completes.",
        ruleHighlight: "Prevents the false-confidence trap of shipping code that passed tests 3 commits ago.",
        availableAction: {
          actor: "kernel",
          title: "Complete Task Run",
          description: "Seal task run with verified current evidence.",
          buttonLabel: "Finish Task",
          actionType: "kernel_eval"
        },
        afterState: {
          task: { id: "DEMO-4", goal: "Fix token expiration bug", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Token/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "completed", owner: "agent-loop" },
          session: { validation: "recorded_passed", treeId: "def456", exitCode: 0, owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "passed", owner: "agent-recall-compiler" },
          learning: { status: "no_durable_learning", owner: "agent-learning" }
        },
        evidenceTimeline: [
          {
            receiptNumber: 1,
            contractRevision: 1,
            implementationTree: "abc123",
            command: "composer test",
            exitCode: 0,
            status: "stale",
            producedBy: "agent-session",
            timestamp: "2026-09-09T09:20:10Z"
          },
          {
            receiptNumber: 2,
            contractRevision: 1,
            implementationTree: "def456",
            command: "composer test",
            exitCode: 0,
            status: "valid",
            producedBy: "agent-session",
            timestamp: "2026-09-09T09:22:45Z"
          }
        ]
      }
    ]
  },

  // =========================================================================
  // SCENARIO E: FAILED VALIDATION
  // =========================================================================
  {
    id: "scenario_e",
    letter: "E",
    name: "Failed Validation Routes to Host Work",
    tagline: "Tests failed (exit 1) -> next action is host work, not re-running finish",
    takeaway: "Current evidence proves the code is broken. The next legal action is repair, not prompt looping.",
    description: "When composer test fails with exit code 1, the kernel does not blindly re-run finish. It projects mutation_ready: true and directs the host to fix the broken implementation.",
    steps: [
      {
        stepIndex: 1,
        title: "Test Failure Recorded (Exit 1)",
        turnDescription: "composer test exited with 1. Kernel evaluates current evidence.",
        invocation: "agent-loop enter DEMO-5 --format=json",
        beforeState: {
          task: { id: "DEMO-5", goal: "Refactor password hash cost", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Security/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "recorded_failed", treeId: "tree_e501", exitCode: 1, owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "not_started", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        lifecycleResult: {
          mutationReady: true,
          nextActionKind: "host_work",
          nextAction: "Fix failing tests in src/Security/PasswordHasherTest.php. Current evidence proves implementation failure.",
          references: { exitCode: 1, failures: 1 }
        },
        explanation: "Current evidence proves the implementation is broken. The kernel authorizes host work to fix the failure, rather than looping in finish.",
        ruleHighlight: "Failed evidence unlocks mutation_ready: true so the host can repair the defect.",
        availableAction: {
          actor: "host",
          title: "Fix Password Hasher Implementation",
          description: "Adjust bcrypt cost parameter in src/Security/PasswordHasher.php to match expected fixture.",
          buttonLabel: "Perform Host Edit: Fix Bug",
          actionType: "host_work",
          details: {
            modifiedFiles: ["src/Security/PasswordHasher.php"]
          }
        },
        afterState: {
          task: { id: "DEMO-5", goal: "Refactor password hash cost", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Security/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "missing", treeId: "tree_e502", owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "not_started", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        evidenceTimeline: [
          {
            receiptNumber: 1,
            contractRevision: 1,
            implementationTree: "tree_e501",
            command: "composer test",
            exitCode: 1,
            status: "failed",
            producedBy: "agent-session",
            timestamp: "2026-09-09T09:25:00Z",
            note: "FAIL: Failed asserting that 14 matches expected 12."
          }
        ]
      },
      {
        stepIndex: 2,
        title: "Re-Validation After Repair",
        turnDescription: "Host repaired code. Kernel commands validation execution.",
        invocation: "agent-loop finish DEMO-5 --format=json",
        beforeState: {
          task: { id: "DEMO-5", goal: "Refactor password hash cost", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Security/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "missing", treeId: "tree_e502", owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "not_started", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        lifecycleResult: {
          mutationReady: false,
          nextActionKind: "command",
          nextAction: "composer test",
          references: { command: "composer test", tree: "tree_e502" }
        },
        explanation: "Code was modified. Kernel commands fresh validation against tree_e502.",
        ruleHighlight: "New code tree requires new evidence receipt.",
        availableAction: {
          actor: "owner",
          title: "Run Tests on Fixed Tree",
          description: "Execute composer test and capture passing receipt.",
          buttonLabel: "Record: composer test (tree_e502)",
          actionType: "command",
          commandStr: "composer test",
          details: { exitCode: 0 }
        },
        afterState: {
          task: { id: "DEMO-5", goal: "Refactor password hash cost", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Security/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "recorded_passed", treeId: "tree_e502", exitCode: 0, owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "passed", owner: "agent-recall-compiler" },
          learning: { status: "no_durable_learning", owner: "agent-learning" }
        },
        evidenceTimeline: [
          {
            receiptNumber: 1,
            contractRevision: 1,
            implementationTree: "tree_e501",
            command: "composer test",
            exitCode: 1,
            status: "failed",
            producedBy: "agent-session",
            timestamp: "2026-09-09T09:25:00Z"
          },
          {
            receiptNumber: 2,
            contractRevision: 1,
            implementationTree: "tree_e502",
            command: "composer test",
            exitCode: 0,
            status: "valid",
            producedBy: "agent-session",
            timestamp: "2026-09-09T09:26:12Z",
            note: "PASS: 18 tests passed, 0 failures."
          }
        ]
      }
    ]
  },

  // =========================================================================
  // SCENARIO F: QUICK (SURGICAL FAST PATH)
  // =========================================================================
  {
    id: "scenario_f",
    letter: "F",
    name: "Quick — Surgical Governed Fast Path",
    tagline: "Less ceremony. Same boundaries.",
    takeaway: "Quick is not zero-governance: it enforces ≤2 files and ≤60 lines ceiling automatically.",
    description: "For genuinely surgical fixes, quick creates and auto-approves a tightly bounded fast-path Contract. Diff ceiling (<=60 lines) and scope limits remain strictly checked; closeout is automated without human gates.",
    steps: [
      {
        stepIndex: 1,
        title: "Fast-Path Contract Initialization",
        turnDescription: "Goal: Fix typo in src/ErrorMessage.php (1 file, ≤60 lines).",
        invocation: "agent-loop quick --file src/ErrorMessage.php \"Fix typo in error message\"",
        beforeState: {
          task: { id: "QUICK-12", goal: "Fix typo in error message", owner: "agent-kanban" },
          contract: { revision: 0, status: "none", scope: [], validation: "none", owner: "agent-loop" },
          run: { status: "none", owner: "agent-loop" },
          session: { validation: "none", owner: "agent-session" },
          recall: { status: "not_needed", owner: "agent-recall-compiler" },
          review: { status: "not_needed", owner: "agent-recall-compiler" },
          learning: { status: "not_needed", owner: "agent-learning" }
        },
        lifecycleResult: {
          mutationReady: true,
          nextActionKind: "host_work",
          nextAction: "Edit src/ErrorMessage.php (bounded: <= 2 files, <= 60 modified lines).",
          references: { path: "quick", limit_files: 2, limit_lines: 60 }
        },
        explanation: "Fast-path contract auto-approved under strict ceilings (<=2 files, <=60 modified lines). The host is mutation_ready immediately.",
        ruleHighlight: "Quick trades planning ceremony for hard mathematical limits.",
        availableAction: {
          actor: "host",
          title: "Apply Typo Fix",
          description: "Edit src/ErrorMessage.php line 18: fix typo 'Invalidd' -> 'Invalid'.",
          buttonLabel: "Edit: ErrorMessage.php",
          actionType: "host_work",
          details: {
            modifiedFiles: ["src/ErrorMessage.php"]
          }
        },
        afterState: {
          task: { id: "QUICK-12", goal: "Fix typo in error message", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/ErrorMessage.php"], validation: "composer test --filter ErrorMessageTest", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "missing", treeId: "tree_f601", owner: "agent-session" },
          recall: { status: "not_needed", owner: "agent-recall-compiler" },
          review: { status: "not_needed", owner: "agent-recall-compiler" },
          learning: { status: "not_needed", owner: "agent-learning" }
        },
        evidenceTimeline: []
      },
      {
        stepIndex: 2,
        title: "Validation & Automated Closeout",
        turnDescription: "Host completes 1-line edit. Kernel validates and automatically completes.",
        invocation: "agent-loop finish QUICK-12 --format=json",
        beforeState: {
          task: { id: "QUICK-12", goal: "Fix typo in error message", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/ErrorMessage.php"], validation: "composer test --filter ErrorMessageTest", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "missing", treeId: "tree_f601", owner: "agent-session" },
          recall: { status: "not_needed", owner: "agent-recall-compiler" },
          review: { status: "not_needed", owner: "agent-recall-compiler" },
          learning: { status: "not_needed", owner: "agent-learning" }
        },
        lifecycleResult: {
          mutationReady: false,
          nextActionKind: "command",
          nextAction: "composer test --filter ErrorMessageTest",
          references: { filesChanged: 1, linesChanged: 2, withinCeiling: true }
        },
        explanation: "Diff verified within ceilings (1 file, 2 lines modified). Validation command required to seal run.",
        ruleHighlight: "Ceiling compliance verified prior to closeout.",
        availableAction: {
          actor: "owner",
          title: "Run Fast-Path Validation",
          description: "Execute scoped test to verify fix.",
          buttonLabel: "Record: composer test",
          actionType: "command",
          commandStr: "composer test --filter ErrorMessageTest",
          details: { exitCode: 0 }
        },
        afterState: {
          task: { id: "QUICK-12", goal: "Fix typo in error message", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/ErrorMessage.php"], validation: "composer test --filter ErrorMessageTest", owner: "agent-loop" },
          run: { status: "completed", owner: "agent-loop" },
          session: { validation: "recorded_passed", treeId: "tree_f601", exitCode: 0, owner: "agent-session" },
          recall: { status: "not_needed", owner: "agent-recall-compiler" },
          review: { status: "not_needed", owner: "agent-recall-compiler" },
          learning: { status: "not_needed", owner: "agent-learning" }
        },
        evidenceTimeline: [
          {
            receiptNumber: 1,
            contractRevision: 1,
            implementationTree: "tree_f601",
            command: "composer test --filter ErrorMessageTest",
            exitCode: 0,
            status: "valid",
            producedBy: "agent-session",
            timestamp: "2026-09-09T09:30:15Z",
            note: "Quick task complete: 1 file, 2 lines modified, tests green."
          }
        ]
      }
    ]
  },

  // =========================================================================
  // SCENARIO G: QUICK BECOMES NON-QUICK
  // =========================================================================
  {
    id: "scenario_g",
    letter: "G",
    name: "Quick Refusal (Fast Path Exceeded)",
    tagline: "Quick is not a loophole: exceeding ceilings forces standard governance",
    takeaway: "If a fast-path task sprawls beyond ≤2 files or ≤60 lines, the kernel refuses it.",
    description: "A developer started with quick src/Foo.php. During editing, 3 files were modified (src/Foo.php, src/Bar.php, config/app.php). The kernel refuses the fast path and commands migration to a standard governed Contract.",
    steps: [
      {
        stepIndex: 1,
        title: "Fast Path Ceiling Exceeded",
        turnDescription: "Host modified 3 files during quick fix. Kernel evaluates finish.",
        invocation: "agent-loop finish QUICK-99 --format=json",
        beforeState: {
          task: { id: "QUICK-99", goal: "Quick fix on Foo", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Foo.php"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "missing", treeId: "tree_g701", owner: "agent-session" },
          recall: { status: "not_needed", owner: "agent-recall-compiler" },
          review: { status: "not_needed", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        lifecycleResult: {
          mutationReady: false,
          nextActionKind: "decision_required",
          nextAction: "FAST PATH REFUSED. Task modified 3 files (limit <= 2). Move to standard governed Contract.",
          references: {
            modifiedFiles: ["src/Foo.php", "src/Bar.php", "config/app.php"],
            fileCount: 3,
            maxAllowed: 2
          }
        },
        explanation: "FAST PATH REFUSED. The task no longer fits its bounded authority. It touched 3 files. Quick cannot be used as a backdoor to bypass normal governance.",
        ruleHighlight: "Hard ceiling refusal stops scope creep dead in its tracks.",
        availableAction: {
          actor: "human",
          title: "Migrate to Standard Contract",
          description: "Human converts task to an ordinary durable Contract with full planning and review gates.",
          buttonLabel: "Convert to Standard Governed Task",
          actionType: "human_decision",
          details: {
            decisionChoices: ["Migrate to Standard Contract", "Revert Unapproved Files"]
          }
        },
        afterState: {
          task: { id: "DEMO-99", goal: "Multi-file refactor of Foo & Bar", owner: "agent-kanban" },
          contract: { revision: 1, status: "candidate", scope: ["src/Foo.php", "src/Bar.php", "config/app.php"], validation: "composer test", owner: "agent-loop" },
          run: { status: "none", owner: "agent-loop" },
          session: { validation: "missing", owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "not_started", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        evidenceTimeline: []
      },
      {
        stepIndex: 2,
        title: "Ordinary Governance Enforced",
        turnDescription: "Task converted to DEMO-99 candidate. Standard gates apply.",
        invocation: "agent-loop enter DEMO-99 --format=json",
        beforeState: {
          task: { id: "DEMO-99", goal: "Multi-file refactor of Foo & Bar", owner: "agent-kanban" },
          contract: { revision: 1, status: "candidate", scope: ["src/Foo.php", "src/Bar.php", "config/app.php"], validation: "composer test", owner: "agent-loop" },
          run: { status: "none", owner: "agent-loop" },
          session: { validation: "missing", owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "not_started", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        lifecycleResult: {
          mutationReady: false,
          nextActionKind: "decision_required",
          nextAction: "Approve Contract revision 1 for DEMO-99",
          references: { contract: "candidate-r1", scope: ["src/Foo.php", "src/Bar.php", "config/app.php"] }
        },
        explanation: "Task is now back in the ordinary governed lifecycle. A human must review the full 3-file boundary.",
        ruleHighlight: "No loopholes: governance scales with task complexity.",
        availableAction: {
          actor: "human",
          title: "Approve Standard Contract",
          description: "Grant formal authority for 3-file mutation boundary.",
          buttonLabel: "Approve Contract r1",
          actionType: "human_decision"
        },
        afterState: {
          task: { id: "DEMO-99", goal: "Multi-file refactor of Foo & Bar", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Foo.php", "src/Bar.php", "config/app.php"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "missing", owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "not_started", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        evidenceTimeline: []
      }
    ]
  },

  // =========================================================================
  // SCENARIO H: REPAIR BUDGET
  // =========================================================================
  {
    id: "scenario_h",
    letter: "H",
    name: "Repair Budget Exhaustion",
    tagline: "2 failed repair attempts -> autonomy revoked -> human decision required",
    takeaway: "The host is not authorized to keep blindly retrying. Budgets enforce human intervention.",
    description: "Validation failed twice. The host attempted 2 automated repairs, both unsuccessful. With the repair budget exhausted, the kernel halts autonomy and demands a human decision.",
    steps: [
      {
        stepIndex: 1,
        title: "Repair Attempt 1 Fails",
        turnDescription: "First repair attempt executed. Validation tests still fail (exit 1).",
        invocation: "agent-loop enter DEMO-8 --format=json",
        beforeState: {
          task: { id: "DEMO-8", goal: "Upgrade database migration runner", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Migration/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "recorded_failed", treeId: "tree_h801", exitCode: 1, owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "not_started", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        lifecycleResult: {
          mutationReady: true,
          nextActionKind: "host_work",
          nextAction: "Execute repair attempt 2 of 2 inside src/Migration/.",
          references: { repairAttempt: 2, maxRepairAttempts: 2 }
        },
        explanation: "Repair attempt 1 failed. The kernel grants 1 remaining repair attempt before escalating.",
        ruleHighlight: "Repair budgets prevent infinite token burn and circular hallucination.",
        availableAction: {
          actor: "host",
          title: "Attempt Second Repair",
          description: "Host attempts alternative fix in src/Migration/Runner.php.",
          buttonLabel: "Perform Repair 2/2",
          actionType: "host_work",
          details: {
            modifiedFiles: ["src/Migration/Runner.php"]
          }
        },
        afterState: {
          task: { id: "DEMO-8", goal: "Upgrade database migration runner", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Migration/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "missing", treeId: "tree_h802", owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "not_started", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        evidenceTimeline: [
          {
            receiptNumber: 1,
            contractRevision: 1,
            implementationTree: "tree_h801",
            command: "composer test",
            exitCode: 1,
            status: "failed",
            producedBy: "agent-session",
            timestamp: "2026-09-09T09:35:00Z",
            note: "Repair attempt 1 failed: Syntax error in migration stream."
          }
        ]
      },
      {
        stepIndex: 2,
        title: "Budget Exhausted — Autonomy Revoked",
        turnDescription: "Repair attempt 2 failed. Budget exhausted. Kernel halts loop.",
        invocation: "agent-loop enter DEMO-8 --format=json",
        beforeState: {
          task: { id: "DEMO-8", goal: "Upgrade database migration runner", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Migration/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "recorded_failed", treeId: "tree_h802", exitCode: 1, owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "not_started", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        lifecycleResult: {
          mutationReady: false,
          nextActionKind: "decision_required",
          nextAction: "Repair budget exhausted (2/2 attempts failed). Human intervention required.",
          references: { attemptsUsed: 2, limit: 2, failureSummary: "Database migration schema deadlock" }
        },
        explanation: "The host is NO LONGER AUTHORIZED to keep blindly retrying. The repair budget is exhausted. A human developer must intervene.",
        ruleHighlight: "Bounded autonomy stops runaway repair loops dead in their tracks.",
        availableAction: {
          actor: "human",
          title: "Human Intervention Required",
          description: "Human inspects deadlock failure: choose to provide guidance, reset repair budget, or replan.",
          buttonLabel: "Provide Human Guidance & Reset Budget",
          actionType: "human_decision",
          details: {
            decisionChoices: ["Reset Repair Budget with Guidance", "Abort & Replan Task", "Take Over Manually"]
          }
        },
        afterState: {
          task: { id: "DEMO-8", goal: "Upgrade database migration runner", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Migration/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "missing", owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "not_started", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        evidenceTimeline: [
          {
            receiptNumber: 1,
            contractRevision: 1,
            implementationTree: "tree_h801",
            command: "composer test",
            exitCode: 1,
            status: "failed",
            producedBy: "agent-session",
            timestamp: "2026-09-09T09:35:00Z"
          },
          {
            receiptNumber: 2,
            contractRevision: 1,
            implementationTree: "tree_h802",
            command: "composer test",
            exitCode: 1,
            status: "failed",
            producedBy: "agent-session",
            timestamp: "2026-09-09T09:37:10Z",
            note: "Repair attempt 2 failed: Schema deadlock persists."
          }
        ]
      }
    ]
  },

  // =========================================================================
  // SCENARIO I: LEARNING WITHOUT PROMOTION
  // =========================================================================
  {
    id: "scenario_i",
    letter: "I",
    name: "Finding Recorded Without Promotion",
    tagline: "A finding does not automatically become permanent repository memory",
    takeaway: "Observations are recorded into findings ledgers; durable learning requires corroboration.",
    description: "During review, an observation was recorded ('Redundant check in Auth middleware'). Instead of immediately generating a permanent PHPStan rule or prompt rule, the disposition records 'no_durable_learning' and completes cleanly.",
    steps: [
      {
        stepIndex: 1,
        title: "Finding Observed During Review",
        turnDescription: "Review notes non-blocking style observation. Finding ledger updated.",
        invocation: "agent-loop finish DEMO-9 --format=json",
        beforeState: {
          task: { id: "DEMO-9", goal: "Clean up auth middleware", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Middleware/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "recorded_passed", treeId: "tree_i901", exitCode: 0, owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "finding_observed", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        lifecycleResult: {
          mutationReady: false,
          nextActionKind: "host_work",
          nextAction: "Record Learning disposition: evaluate whether observed finding warrants durable repository promotion.",
          references: { findingId: "FND-404", subject: "Redundant null-check in AuthMiddleware" }
        },
        explanation: "A finding was observed. The host must decide whether it represents a one-off observation or a recurring repository flaw requiring durable enforcement.",
        ruleHighlight: "Findings stay in temporary ledgers until corroborated. Zero premature prompt landfill.",
        availableAction: {
          actor: "host",
          title: "Record Disposition: No Durable Learning",
          description: "Classify finding as a routine observation. Do not promote to permanent repository rules.",
          buttonLabel: "Disposition: No Durable Learning",
          actionType: "host_work"
        },
        afterState: {
          task: { id: "DEMO-9", goal: "Clean up auth middleware", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Middleware/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "recorded_passed", treeId: "tree_i901", exitCode: 0, owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "passed", owner: "agent-recall-compiler" },
          learning: { status: "no_durable_learning", owner: "agent-learning" }
        },
        evidenceTimeline: [
          {
            receiptNumber: 1,
            contractRevision: 1,
            implementationTree: "tree_i901",
            command: "composer test",
            exitCode: 0,
            status: "valid",
            producedBy: "agent-session",
            timestamp: "2026-09-09T09:40:05Z"
          },
          {
            receiptNumber: 2,
            contractRevision: 1,
            implementationTree: "tree_i901",
            command: "agent-recall-compiler review",
            exitCode: 0,
            status: "valid",
            producedBy: "agent-recall-compiler",
            timestamp: "2026-09-09T09:40:22Z",
            note: "Finding observed: FND-404 logged to agent-learning ledger."
          }
        ]
      },
      {
        stepIndex: 2,
        title: "Clean Closeout Without Prompt Landfill",
        turnDescription: "Disposition recorded. Run completes without cluttering repository instructions.",
        invocation: "agent-loop finish DEMO-9 --format=json",
        beforeState: {
          task: { id: "DEMO-9", goal: "Clean up auth middleware", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Middleware/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "recorded_passed", treeId: "tree_i901", exitCode: 0, owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "passed", owner: "agent-recall-compiler" },
          learning: { status: "no_durable_learning", owner: "agent-learning" }
        },
        lifecycleResult: {
          mutationReady: false,
          nextActionKind: "none",
          nextAction: null,
          references: { status: "completed", learningPromotions: 0 }
        },
        explanation: "Task complete. The finding remains in the historical ledger for future analysis, but repository instructions remain clean and focused.",
        ruleHighlight: "Stops prompt inflation: only repeatedly proven issues become permanent rules.",
        availableAction: {
          actor: "kernel",
          title: "Complete Task",
          description: "Seal task run into history.",
          buttonLabel: "Complete Task",
          actionType: "kernel_eval"
        },
        afterState: {
          task: { id: "DEMO-9", goal: "Clean up auth middleware", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["src/Middleware/"], validation: "composer test", owner: "agent-loop" },
          run: { status: "completed", owner: "agent-loop" },
          session: { validation: "recorded_passed", treeId: "tree_i901", exitCode: 0, owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "passed", owner: "agent-recall-compiler" },
          learning: { status: "no_durable_learning", owner: "agent-learning" }
        },
        evidenceTimeline: [
          {
            receiptNumber: 1,
            contractRevision: 1,
            implementationTree: "tree_i901",
            command: "composer test",
            exitCode: 0,
            status: "valid",
            producedBy: "agent-session",
            timestamp: "2026-09-09T09:40:05Z"
          },
          {
            receiptNumber: 2,
            contractRevision: 1,
            implementationTree: "tree_i901",
            command: "agent-recall-compiler review",
            exitCode: 0,
            status: "valid",
            producedBy: "agent-recall-compiler",
            timestamp: "2026-09-09T09:40:22Z"
          }
        ]
      }
    ]
  },

  // =========================================================================
  // SCENARIO J: ACCEPTED RISK
  // =========================================================================
  {
    id: "scenario_j",
    letter: "J",
    name: "Accepted Risk & Human Authority",
    tagline: "An agent may report a risk. It cannot own a risk.",
    takeaway: "Security warnings cannot be waived by the AI host. Only humans own liability.",
    description: "Security validation (composer audit) flags an advisory. The agent cannot bypass or suppress the warning on its own. The kernel emits decision_required with an explicit HUMAN AUTHORITY REQUIRED badge.",
    steps: [
      {
        stepIndex: 1,
        title: "Security Advisory Flagged",
        turnDescription: "composer audit warns of low-severity dev advisory. Agent proposes ignore.",
        invocation: "agent-loop finish DEMO-10 --format=json",
        beforeState: {
          task: { id: "DEMO-10", goal: "Update dev dependencies", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["composer.json", "composer.lock"], validation: "composer audit", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "recorded_failed", treeId: "tree_j100", exitCode: 1, command: "composer audit", owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "not_started", owner: "agent-recall-compiler" },
          learning: { status: "not_decided", owner: "agent-learning" }
        },
        lifecycleResult: {
          mutationReady: false,
          nextActionKind: "decision_required",
          nextAction: "HUMAN AUTHORITY REQUIRED: Security advisory detected (CVE-2026-0129). Human decision required to accept risk or mandate fix.",
          references: { advisory: "CVE-2026-0129", severity: "low", package: "phpunit/phpunit" }
        },
        explanation: "HUMAN AUTHORITY REQUIRED. An agent may report a security risk; it cannot own it. The AI host proposed ignoring the advisory, but the kernel rejects autonomous waiver and routes to a human decision.",
        ruleHighlight: "An agent may report the risk. It cannot own the risk.",
        availableAction: {
          actor: "human",
          title: "Human Risk Determination",
          description: "Human engineer evaluates CVE-2026-0129 in dev-only test runner: accept risk with cryptographic sign-off, or reject and mandate fix.",
          buttonLabel: "Accept Risk (Dev-Only Scope)",
          actionType: "human_decision",
          details: {
            decisionChoices: ["Accept Risk for Dev Tooling", "Reject & Require Patch"],
            warningNote: "Human signs off on liability for CVE-2026-0129 in test runner."
          }
        },
        afterState: {
          task: { id: "DEMO-10", goal: "Update dev dependencies", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["composer.json", "composer.lock"], validation: "composer audit", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "recorded_passed", treeId: "tree_j100", exitCode: 0, owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "passed", owner: "agent-recall-compiler" },
          learning: { status: "no_durable_learning", owner: "agent-learning" }
        },
        evidenceTimeline: [
          {
            receiptNumber: 1,
            contractRevision: 1,
            implementationTree: "tree_j100",
            command: "composer audit",
            exitCode: 1,
            status: "failed",
            producedBy: "agent-session",
            timestamp: "2026-09-09T09:45:00Z",
            note: "Advisory CVE-2026-0129 reported by composer audit."
          },
          {
            receiptNumber: 2,
            contractRevision: 1,
            implementationTree: "tree_j100",
            command: "human-decision:risk-accept",
            exitCode: 0,
            status: "valid",
            producedBy: "agent-loop",
            timestamp: "2026-09-09T09:46:12Z",
            note: "Human signed off risk for dev-only phpunit advisory."
          }
        ]
      },
      {
        stepIndex: 2,
        title: "Signed Closeout",
        turnDescription: "Human risk acceptance recorded. Run sealed with signed ledger audit.",
        invocation: "agent-loop finish DEMO-10 --format=json",
        beforeState: {
          task: { id: "DEMO-10", goal: "Update dev dependencies", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["composer.json", "composer.lock"], validation: "composer audit", owner: "agent-loop" },
          run: { status: "active", owner: "agent-loop" },
          session: { validation: "recorded_passed", treeId: "tree_j100", exitCode: 0, owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "passed", owner: "agent-recall-compiler" },
          learning: { status: "no_durable_learning", owner: "agent-learning" }
        },
        lifecycleResult: {
          mutationReady: false,
          nextActionKind: "none",
          nextAction: null,
          references: { status: "completed", riskOverrideSignedBy: "Human-Engineer" }
        },
        explanation: "The run finishes with signed human audit receipts. Full accountability is preserved in git and local state.",
        ruleHighlight: "Accountability preserved: every authority-bearing choice traces back to a human.",
        availableAction: {
          actor: "kernel",
          title: "Complete Task",
          description: "Seal task run with human sign-off artifact.",
          buttonLabel: "Complete Task",
          actionType: "kernel_eval"
        },
        afterState: {
          task: { id: "DEMO-10", goal: "Update dev dependencies", owner: "agent-kanban" },
          contract: { revision: 1, status: "approved", scope: ["composer.json", "composer.lock"], validation: "composer audit", owner: "agent-loop" },
          run: { status: "completed", owner: "agent-loop" },
          session: { validation: "recorded_passed", treeId: "tree_j100", exitCode: 0, owner: "agent-session" },
          recall: { status: "ready", owner: "agent-recall-compiler" },
          review: { status: "passed", owner: "agent-recall-compiler" },
          learning: { status: "no_durable_learning", owner: "agent-learning" }
        },
        evidenceTimeline: [
          {
            receiptNumber: 1,
            contractRevision: 1,
            implementationTree: "tree_j100",
            command: "composer audit",
            exitCode: 1,
            status: "failed",
            producedBy: "agent-session",
            timestamp: "2026-09-09T09:45:00Z"
          },
          {
            receiptNumber: 2,
            contractRevision: 1,
            implementationTree: "tree_j100",
            command: "human-decision:risk-accept",
            exitCode: 0,
            status: "valid",
            producedBy: "agent-loop",
            timestamp: "2026-09-09T09:46:12Z"
          }
        ]
      }
    ]
  }
];

// Helper to resolve aliases from legacy landing page links
export function resolveScenario(id: string): ScenarioDefinition {
  const aliasMap: Record<string, string> = {
    durable_task: "scenario_a",
    canonical: "scenario_a",
    scope_guard: "scenario_c",
    repair_loop: "scenario_h",
    quick_fix: "scenario_f",
    learning_promoted: "scenario_i"
  };

  const resolvedId = aliasMap[id] || id;
  const match = SCENARIOS.find((s) => s.id === resolvedId);
  return match ?? SCENARIOS[0];
}
