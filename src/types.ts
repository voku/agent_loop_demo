/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NextActionKind =
  | "command"
  | "command_template"
  | "decision_required"
  | "host_work"
  | "none";

export type Actor =
  | "human"
  | "kernel"
  | "host"
  | "owner";

export type OwnerPackage =
  | "agent-loop"
  | "agent-session"
  | "agent-recall-compiler"
  | "agent-learning"
  | "agent-map"
  | "agent-kanban";

export interface AuthoritativeState {
  readonly task: {
    readonly id: string;
    readonly goal: string;
    readonly owner: OwnerPackage;
  };
  readonly contract: {
    readonly revision: number;
    readonly status: "none" | "candidate" | "approved" | "superseded";
    readonly scope: readonly string[];
    readonly validation: string;
    readonly owner: OwnerPackage;
  };
  readonly run: {
    readonly status: "none" | "active" | "completed";
    readonly owner: OwnerPackage;
  };
  readonly session: {
    readonly validation: "missing" | "recorded_passed" | "recorded_failed" | "stale" | "none";
    readonly treeId?: string;
    readonly exitCode?: number;
    readonly command?: string;
    readonly owner: OwnerPackage;
  };
  readonly recall: {
    readonly status: "not_needed" | "pending" | "ready";
    readonly documentCount?: number;
    readonly owner: OwnerPackage;
  };
  readonly review: {
    readonly status: "not_started" | "in_progress" | "passed" | "finding_observed" | "not_needed";
    readonly owner: OwnerPackage;
  };
  readonly learning: {
    readonly status: "not_decided" | "no_durable_learning" | "proposal_pending" | "promoted" | "not_needed";
    readonly owner: OwnerPackage;
  };
}

export interface LifecycleResult {
  readonly mutationReady: boolean;
  readonly nextActionKind: NextActionKind;
  readonly nextAction: string | null;
  readonly references: Readonly<Record<string, unknown>>;
}

export interface EvidenceReceipt {
  readonly receiptNumber: number;
  readonly contractRevision: number;
  readonly implementationTree: string;
  readonly command: string;
  readonly exitCode: number;
  readonly status: "valid" | "stale" | "failed";
  readonly producedBy: OwnerPackage;
  readonly timestamp: string;
  readonly note?: string;
}

export interface AvailableAction {
  readonly actor: Actor;
  readonly title: string;
  readonly description: string;
  readonly buttonLabel: string;
  readonly actionType: "human_decision" | "host_work" | "command" | "kernel_eval";
  readonly commandStr?: string;
  readonly details?: {
    readonly goal?: string;
    readonly mutationBoundary?: readonly string[];
    readonly modifiedFiles?: readonly string[];
    readonly exitCode?: number;
    readonly decisionChoices?: readonly string[];
    readonly warningNote?: string;
  };
}

export interface ScenarioStep {
  readonly stepIndex: number;
  readonly title: string;
  readonly turnDescription: string;
  readonly invocation: string;
  readonly beforeState: AuthoritativeState;
  readonly lifecycleResult: LifecycleResult;
  readonly explanation: string;
  readonly availableAction: AvailableAction;
  readonly afterState: AuthoritativeState;
  readonly evidenceTimeline: readonly EvidenceReceipt[];
  readonly activeReceiptIndex?: number;
  readonly ruleHighlight?: string;
}

export type ScenarioId =
  | "scenario_a"
  | "scenario_b"
  | "scenario_c"
  | "scenario_d"
  | "scenario_e"
  | "scenario_f"
  | "scenario_g"
  | "scenario_h"
  | "scenario_i"
  | "scenario_j"
  // Legacy aliases for backward compatibility with landing page links
  | "durable_task"
  | "quick_fix"
  | "repair_loop"
  | "scope_guard"
  | "learning_promoted";

export interface ScenarioDefinition {
  readonly id: ScenarioId;
  readonly letter: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J";
  readonly name: string;
  readonly tagline: string;
  readonly takeaway: string;
  readonly description: string;
  readonly steps: readonly ScenarioStep[];
}

export interface HistoryEntry {
  readonly kind: "command" | "output" | "success" | "human" | "error" | "json" | "chat_user" | "chat_agent";
  readonly text: string;
}

export interface CliCommand {
  readonly cmd: string;
  readonly description: string;
  readonly does: string;
  readonly doesNot: string;
  readonly input: string;
  readonly output: string;
}

export interface EvidenceComparison {
  readonly domain: string;
  readonly claim: string;
  readonly claimFlaw: string;
  readonly evidenceArtifact: string;
  readonly evidenceCheck: string;
  readonly evidenceItems?: readonly string[];
  readonly ownerPackage: string;
}

export interface HumanDecisionBoundary {
  readonly role: "Human-Owned" | "Kernel-Enforced" | "Host-Native";
  readonly decision: string;
  readonly justification: string;
  readonly mechanism: string;
}

export interface PackageSpec {
  readonly badge: string;
  readonly name: string;
  readonly role: string;
  readonly responsibility: string;
  readonly boundary: string;
}

export interface FaqItem {
  readonly q: string;
  readonly a: string;
}


