/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VirtualFile {
  name: string;
  path: string;
  content: string;
  language: "markdown" | "json" | "php";
  category: "board" | "workflow" | "session" | "recall" | "map" | "learning" | "config" | "source";
}

export interface TerminalLine {
  type: "input" | "output" | "error" | "success" | "warning";
  text: string;
  timestamp?: string;
}

export type StepId = 
  | "init"
  | "board"
  | "plan"
  | "approve"
  | "recall"
  | "work"
  | "verify"
  | "close"
  | "learn"
  | "memory";

export interface DemoStep {
  id: StepId;
  title: string;
  description: string;
  command: string;
  highlightWords: string[];
}
