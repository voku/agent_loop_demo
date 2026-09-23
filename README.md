# Agent Loop (`voku/agent-loop`)

[![Build Status](https://github.com/voku/agent-loop/actions/workflows/ci.yml/badge.svg)](https://github.com/voku/agent-loop/actions)
[![Latest Stable Version](https://poser.pugx.org/voku/agent-loop/v/stable)](https://packagist.org/packages/voku/agent-loop)
[![Total Downloads](https://poser.pugx.org/voku/agent-loop/downloads)](https://packagist.org/packages/voku/agent-loop)
[![Monthly Downloads](https://poser.pugx.org/voku/agent-loop/d/monthly)](https://packagist.org/packages/voku/agent-loop)
[![License](https://poser.pugx.org/voku/agent-loop/license)](https://packagist.org/packages/voku/agent-loop)

**Keep coding-agent work moving without losing the task, guessing what comes next, or calling something done without evidence.**

`agent-loop` is a local-first PHP workflow kernel for coding agents. It gives agents and developers a shared, checkable way to run tasks: what to do, what may be touched, what evidence proves it, and how lessons learned from one task improve future tasks.

---

## The Core Philosophy: Why a Governed Workflow?

### 1. Workflow Tokens Buy Handover Resilience
Running a governed workflow uses slightly more tokens upfront than throwing raw prompts into a chat. In return, **the task survives the chat**.
* If an agent context window runs out, the model hallucinates, or the session dies, the work is never lost.
* You can **hand over the task** seamlessly: start in Claude Code, hand off to OpenAI Codex, have GitHub Copilot inspect it, or let a human engineer pick up exactly where the agent stopped.
* The state, approved scope boundary, and validation evidence live as versioned artifacts in your Git repository—not inside volatile LLM conversational memory.

### 2. Multi-Agent Collaboration on Kanban Tasks
Different coding agents can work on the **same project at the same time on different Kanban tasks**.
* `agent-kanban` stores task items as Git-native Markdown files (`docs/kanban/*.md`) with deterministic revision hashes.
* Agent A can tackle a refactoring card while Agent B works on a bugfix card.
* Because boundaries and scope whitelists are enforced per task, agents do not step on each other's toes or pollute each other's context.

### 3. Findings → Learnings: Project Intelligence Without Paperwork
A run creates learning evidence **only when something notable actually happened**.
* Recall selections are machine facts; usefulness outcomes are recorded only when guidance was actually judged.
* A run with no reusable lesson can close with an explicit `no_durable_learning` decision and no explanatory essay.
* A **Finding** is created only when there is actual finding evidence; quiet runs do not manufacture telemetry.
* Repeated evidence can synthesize into reviewable **proposals**, and a human owner decides whether anything becomes durable guidance.

### 4. Deterministic Checks Reduce Tokens Over Time
When a project learning is approved, we don't dump another 500 words into a bloated system prompt or `MEMORY.md` landfill. Instead, we codify it into a **deterministic check**:
* A custom PHPStan rule
* A `php-cs-fixer` configuration
* A targeted unit/regression test
* A Git pre-commit or CI check

**Deterministic checks cost 0 LLM prompt tokens.** Over time, system prompts shrink, models receive sharper and smaller context, and the token cost per task decreases while repository quality increases deterministically.

---

## How It Works

Most coding-agent setups fail in one of two ways:
1. They stuff rules into giant prose prompts and hope the model remembers them.
2. They let the model mark its own homework ("*I ran the tests and everything is green!*").

`agent-loop` replaces both with two simple commands that run inside your project:

```bash
vendor/bin/agent-loop enter <task-id>
vendor/bin/agent-loop finish <task-id>
```

```text
You have work to do
       │
       ▼
┌──────────────┐
│  Agent Loop  │ ◄─── task, rules, boundaries, and evidence live here
└──────┬───────┘
       │  enter: here is the task, the scope, and the exact next step
       ▼
┌──────────────┐
│ Coding agent │ ◄─── works only inside the approved boundary
└──────┬───────┘
       │  finish: prove the work with tests and git status
       ▼
┌──────────────┐      not done yet
│  Agent Loop  │ ──────────────────────► tells the agent what to fix
└──────┬───────┘
       │  done
       ▼
Keep useful lessons ──► deterministic checks ──► faster, cheaper future runs
```

---

## Without It vs. With Agent Loop

| Without Agent Loop | With Agent Loop |
| :--- | :--- |
| **Lost context:** Close the chat window and the task state disappears. | **Durable tasks:** Tasks live in Git-backed Markdown (`agent-kanban`). Close the window, pick it up tomorrow, or hand off to another agent. |
| **Context landfill:** Every rule, lesson, and historical quirk gets dumped into one massive prompt. | **Bounded context:** `agent-recall-compiler` extracts only the code symbols and approved rules needed for this specific task. |
| **Self-certified completion:** The agent says "All tests pass!" and you have to take its word for it. | **Owner-backed evidence:** `agent-session` captures test output, exit codes, and Git working-tree status. No proof = not done. |
| **Runaway edits:** The agent decides to "clean up" five unrelated files while fixing a typo. | **Contract boundaries:** Edits are restricted to an approved file whitelist. Unauthorized file touches fail closed. |
| **Ephemeral mistakes:** The agent makes the same mistake next week in a fresh session. | **Compounding learnings:** Findings promote to approved rules, which turn into deterministic CI checks that reduce token usage over time. |
| **Single-agent bottleneck:** Only one conversation can touch the codebase safely. | **Multi-agent concurrency:** Multiple agents work concurrently on different Kanban cards without cross-session pollution. |

---

## What Makes It Different

1. **The task survives the chat.** Chat sessions are temporary; tasks are not. `agent-loop` keeps the task, its scope, and its progress in the repository so any agent (or human) can pick it up.
2. **Multi-agent Kanban concurrency.** Different agents can work on the same project simultaneously, each assigned to a separate card on the Git-native board.
3. **The agent gets less context, but better context.** Instead of feeding the model the whole repository or an endless memory log, `agent-map` and `agent-recall-compiler` select only the symbols and rules relevant to the task at hand.
4. **Evidence beats confidence.** A model saying "done" is not evidence. `agent-loop` checks recorded command runs, exit codes, and git diffs before allowing a task to finish.
5. **Useful experience improves later work without inventing it.** Real findings can become precedent and, after review, durable rules. Runs with nothing reusable stay quiet instead of padding history with synthetic observations.
6. **Deterministic checks reduce tokens over time.** Approved learnings are translated into PHPStan rules, linters, and tests. Mechanical checks run for free, keeping prompt tokens low and quality reproducible.
7. **Engineering judgment stays engineering judgment.** Humans approve contracts, scope expansions, policy waivers, and durable rules. The kernel enforces the boundaries; the agent does the coding; you remain in control.

---

## Current Release Proof

The current coordinated graph is not just version-compatible on paper:

* **`voku/agent-loop 0.20.40`** ships the sparse close-out model with `voku/agent-learning 0.18.24` and `voku/agent-recall-compiler 0.25.0`.
* **`voku/agent-loop-runner`** resolves and executes that released graph in clean-consumer proofs while keeping its broader supported Loop range.
* **`voku/agent-ui`** has been validated against the same graph on PHP 8.3, 8.4, and 8.5, including `--prefer-lowest` and Runner-present / Runner-absent matrices.

That separation is intentional: Loop owns lifecycle truth, Recall owns selection/outcome semantics, Learning owns durable evidence, Runner executes, and UI presents. Consumers do not reconstruct the workflow in parallel.

---

## What Agent Loop Does NOT Do

To maintain architectural integrity, `agent-loop` explicitly avoids doing things that belong elsewhere:

* **It does not call LLM APIs by itself.** Your coding host (Claude Code, Cursor, Copilot, Codex, etc.) handles model calls. `agent-loop` provides the workflow harness and guardrails.
* **It does not auto-commit or push without approval.** Git commits and pushes remain under human control or explicit host delegation.
* **It does not invent human approval.** Scope changes, policy waivers, and durable guidance promotions require an explicit human decision.
* **It does not replace project-native tools.** It does not reinvent PHPUnit, Pest, PHPStan, or PHP-CS-Fixer; it invokes them and checks their exit codes and evidence.
* **It does not create a prompt landfill.** It rejects the `MEMORY.md` pattern where unverified notes pile up unchecked.
* **It is not vendor-locked.** It projects instructions and assets for Codex, Claude Code, OpenCode, Copilot, Gemini CLI, and Antigravity.

---

## CLI Overview

### The Two Canonical Front Doors

For 90% of your daily workflow, you or your agent only need these two commands:

```bash
# 1. Enter the task: returns the current state and canonical next action
vendor/bin/agent-loop enter <task-id> --format=json

# 2. Finish the task: reconciles test evidence, git status, and quality gates
vendor/bin/agent-loop finish <task-id> --format=json
```

### Specialist Front Doors & Diagnostic Commands

When specialized or recovery workflows are needed:

| Command | Purpose |
| :--- | :--- |
| `vendor/bin/agent-loop quick --file <path> "<intent>"` | Low-ceremony fast path for surgical 1–2 file changes (diff ceiling <= 60 lines). |
| `vendor/bin/agent-loop repair <task-id>` | Targeted recovery after an observed test failure with a strict 2-attempt budget. |
| `vendor/bin/agent-loop pipeline <task-id> --stage=<stage>` | Multi-stage execution runner (surgical, standard, hardened). |
| `vendor/bin/agent-loop workflow manifest <task-id>` | Read-only unified JSON projection connecting all owner artifacts. |
| `vendor/bin/agent-loop workflow plan <task-id> --file <f> ...` | Proposes a candidate Contract with mutation scope and validation plan. |
| `vendor/bin/agent-loop workflow approve <task-id> --by <user>` | Human seal approving the Contract revision and mutation boundary. |
| `vendor/bin/agent-loop edit '<Symbol>' -- '<intent>'` | Specialist symbol-scoped edit bundle using structural code intelligence. |
| `vendor/bin/agent-loop board:list` / `board:show <task-id>` | Inspect and manage Git-native Markdown Kanban cards. |
| `vendor/bin/agent-loop learn proposal-approve <id>` | Promotes a reviewed finding proposal into a durable project decision. |
| `vendor/bin/agent-loop init doctor` | Diagnostic report of host readiness, adapters, and projected assets. |

---

## The 9 Focused Packages

`agent-loop` is an umbrella architecture composed of focused, single-responsibility packages:

| Package | Role | Core Responsibility | Key Artifact |
| :--- | :--- | :--- | :--- |
| **`voku/agent-loop`** | Kernel & Governance | Contract/Run lifecycle, cross-owner policy, routing, quality gates. | Run Manifest v1 & `next_action_kind` |
| **`voku/agent-kanban`** | Board & Tasks | Git-native Markdown work items, deterministic parsing, task cards. | `docs/kanban/*.md` cards & hashes |
| **`voku/agent-session`** | Working Memory | Task-local mutable state, validation evidence, pruneable retention. | Process execution proof & exit logs |
| **`voku/agent-map`** | Code Intelligence | Structural PHP repository maps, AST dependency graphs, caller/callee. | Symbol index & dependency graph |
| **`voku/agent-recall-compiler`** | Context & Prompts | Token-budgeted prompt compilation with active, approved rules only. | Governed prompt briefing (0 landfill) |
| **`voku/agent-learning`** | Durable Learning | Reviewable findings, proposals, and durable decision lineage. | Corroborated findings & decisions |
| **`voku/agent-loop-runner`** | Execution Plane | Optional isolated Git worktree runner and host execution sandbox. | Worktree isolation & runner adapters |
| **`voku/agent-ui`** | Control Plane | Local server-rendered human cockpit for board, tasks, and evidence. | Visual human review cockpit |
| **`voku/agent-skills`** | Guidance Catalog | Portable engineering skills, review lenses, and analysis guides. | Cross-host skills & prompt assets |

---

## Supported Coding Hosts

`agent-loop` projects managed instructions, skills, and settings for the major coding-agent platforms:

```bash
# Install managed assets for all supported hosts
vendor/bin/agent-loop init install-assets --agent=all
```

* **Codex** (`AGENTS.md`, `.agent-loop/codex/`)
* **Claude Code** (`CLAUDE.md`, `.claude/skills/`)
* **OpenCode** (`OPENCODE.md`, `.opencode/`)
* **GitHub Copilot** (`.github/copilot-instructions.md`)
* **Gemini CLI** (`GEMINI.md`)
* **Antigravity** (`.agent/skills/`)

---

## Requirements & Installation

* **PHP 8.3** or higher
* **Composer**
* **Git** repository

Install as a development dependency:

```bash
composer require --dev voku/agent-loop
```

Start the tutorial path used by the marketing page:

```bash
vendor/bin/agent-loop init scaffold --demo
vendor/bin/agent-loop init install-assets --agent=codex
vendor/bin/agent-loop init doctor
vendor/bin/agent-loop enter DEMO-1 --format=json
```

Replace `codex` with the coding host you actually use. Then follow the returned
`next_action_kind` and `next_action`; do not insert a separate phase checklist.
The executable tutorial source of truth is
[`voku/agent-loop/docs/quick-start.md`](https://github.com/voku/agent-loop/blob/main/docs/quick-start.md).

---

## Marketing & Documentation App

This repository contains the Vite + React landing page and architecture deep dive:

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to explore:
* **4-step everyday workflow**: `enter` → canonical next action → normal implementation → `finish`.
* **Sparse close-out model**: machine facts stay automatic while qualitative outcomes are recorded only when actually judged.
* **Architecture chapters**: trace ownership across Loop, Session, Map, Recall, Learning, Runner, UI, and supporting packages.
* **Current release proof**: see the released core graph and the consumer evidence behind Runner/UI compatibility.

---

## Quality Checks

Run before committing or submitting a pull request:

```bash
npm run lint
npm run build
```

## License

This project is open-source software licensed under the [MIT License](LICENSE).
