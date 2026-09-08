/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SandboxStage =
  | "start"
  | "plan_requested"
  | "planned"
  | "approval_required"
  | "approved"
  | "mutation_ready"
  | "implemented"
  | "validated"
  | "complete";

export interface HistoryEntry {
  readonly kind: "command" | "output" | "success" | "human";
  readonly text: string;
}

export interface SandboxAction {
  readonly label: string;
  readonly command?: string;
  readonly nextStage: SandboxStage;
  readonly entries: readonly HistoryEntry[];
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

