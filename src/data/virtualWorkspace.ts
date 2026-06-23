/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VirtualFile } from "../types";

export const getInitialFiles = (): VirtualFile[] => [
  {
    name: "composer.json",
    path: "composer.json",
    category: "config",
    language: "json",
    content: `{
  "name": "acme/signup-portal",
  "description": "ACME signup portal and auth system",
  "type": "project",
  "require": {
    "php": "^8.2",
    "vlucas/phpdotenv": "^5.6"
  },
  "require-dev": {
    "phpunit/phpunit": "^10.5",
    "phpstan/phpstan": "^1.11"
  },
  "autoload": {
    "psr-4": {
      "App\\\\": "src/"
    }
  }
}`
  },
  {
    name: "Signup.php",
    path: "src/Signup.php",
    category: "source",
    language: "php",
    content: `<?php

namespace App;

class Signup {
    private array $errors = [];

    public function register(array $data): bool {
        // Core signup handler
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        // TODO: ADD VALIDATION HERE (DEMO-1 Task)
        // Lars says: "1. Reject invalid email addresses."
        // Lars says: "2. Reject passwords shorter than 8 characters."

        if (empty($email)) {
            $this->errors[] = "Email is required.";
        }

        if (empty($password)) {
            $this->errors[] = "Password is required.";
        }

        return empty($this->errors);
    }

    public function getErrors(): array {
        return $this->errors;
    }
}`
  }
];

export const getBoardFiles = (): VirtualFile[] => [
  ...getInitialFiles(),
  {
    name: "DEMO-1.md",
    path: ".agent-loop/board/DEMO-1.md",
    category: "board",
    language: "markdown",
    content: `# Task: DEMO-1
## Goal: Add validation to signup form

### Description
Ensure the signup form handler properly guards against garbage input. 
Specifically, developers have noticed accounts registered with invalid emails and blank passwords.

### Acceptance Criteria
1. Reject invalid email addresses (must contain '@' and domain).
2. Reject passwords shorter than 8 characters.
3. Keep valid submissions working smoothly.

### Validation Methods
1. Run local PHPUnit unit tests: \`vendor/bin/phpunit\`
2. Run PHPStan static analysis: \`vendor/bin/phpstan analyse src/\`
`
  }
];

export const getSessionFiles = (): VirtualFile[] => [
  ...getBoardFiles(),
  {
    name: "plan.md",
    path: ".agent-loop/sessions/DEMO-1/plan.md",
    category: "session",
    language: "markdown",
    content: `# Session Plan - DEMO-1
Current Goal: Add email and password validation strength to App\\Signup.php.

## Proposed Strategy
1. Modify App\\Signup::register() method.
2. Add a standard filter_var() check for email validation.
3. Add helper string length check for the password (length < 8 check).
4. Verify tests pass without breaking existing logic.
`
  },
  {
    name: "decisions.md",
    path: ".agent-loop/sessions/DEMO-1/decisions.md",
    category: "session",
    language: "markdown",
    content: `# Session decisions - DEMO-1
The following rigid developer constraints are active for this terminal pass:

- **Constraint 1**: Only touch App\\Signup.php (Do not modify tests or databases).
- **Constraint 2**: Keep validation entirely server-side in PHP.
- **Constraint 3**: Avoid regex for email validation (use PHP's core \`filter_var($email, FILTER_VALIDATE_EMAIL)\`).
`
  },
  {
    name: "assumptions.md",
    path: ".agent-loop/sessions/DEMO-1/assumptions.md",
    category: "session",
    language: "markdown",
    content: `# Setup assumptions - DEMO-1
- PHP Unit tests are configured in PHPUnit.xml.
- We assume PHP 8.2 runtime compatibility.
`
  }
];

export const getRecallFiles = (): VirtualFile[] => [
  ...getSessionFiles(),
  {
    name: "system.md",
    path: ".agent-loop/recall/system.md",
    category: "recall",
    language: "markdown",
    content: `# System Briefing (Compiling via agent-loop recall)
This briefing compiles rules across the repository for active agent injection.

## Project Coding Style Guidelines
- Strict Type declaration (\`declare(strict_types=1);\`) must exist on every file.
- PHP PSR-12 code formatting standards apply.
- Always use typehints in method signatures.
`
  },
  {
    name: "validation-plan.md",
    path: ".agent-loop/recall/validation-plan.md",
    category: "recall",
    language: "markdown",
    content: `# Validation Plan Briefing
Active verification checks to preserve system state:

1. **Syntax Check**: \`php -l src/Signup.php\`
2. **Analysis**: \`vendor/bin/phpstan\` (Strict level 5)
3. **Tests**: \`vendor/bin/phpunit\`
`
  },
  {
    name: "meta.json",
    path: ".agent-loop/recall/meta.json",
    category: "recall",
    language: "json",
    content: `{
  "compiledAt": "${new Date().toISOString()}",
  "taskId": "DEMO-1",
  "activeBranch": "feature/signup-validation",
  "baseCommit": "e70f2a9db4",
  "lastRecallSize": "1.2kb"
}`
  }
];

export const getWorkDoneFiles = (): VirtualFile[] => {
  const base = getRecallFiles();
  // Modify the Signup.php content to represent the proposed patch! This is beautiful.
  return base.map(f => {
    if (f.path === "src/Signup.php") {
      return {
        ...f,
        content: `<?php

declare(strict_types=1);

namespace App;

class Signup {
    private array $errors = [];

    public function register(array $data): bool {
        $email = trim($data['email'] ?? '');
        $password = $data['password'] ?? '';

        // 1. Reject invalid email addresses (Acceptance Condition 1)
        if (empty($email)) {
            $this->errors[] = "Email is required.";
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->errors[] = "Invalid email format.";
        }

        // 2. Reject passwords shorter than 8 characters (Acceptance Condition 2)
        if (empty($password)) {
            $this->errors[] = "Password is required.";
        } elseif (strlen($password) < 8) {
            $this->errors[] = "Password must be at least 8 characters long.";
        }

        return empty($this->errors);
    }

    public function getErrors(): array {
        return $this->errors;
    }
}`
      };
    }
    return f;
  });
};

export const getLearningApprovedFiles = (): VirtualFile[] => [
  ...getWorkDoneFiles(),
  {
    name: "findings.json",
    path: ".agent-loop/learning/findings.json",
    category: "learning",
    language: "json",
    content: `{
  "findings": [
    {
      "id": "FIND-001",
      "task": "DEMO-1",
      "observation": "PHPStan analysis initially failed due to missing return types on helper utilities.",
      "category": "static_analysis",
      "resolvedBy": "Added explicit return types in Src/Signup.php.",
      "isDurableGuidance": true,
      "approvedByHuman": true,
      "ruleAdded": "Always apply strict types and return type declarations on all Signup handlers to avoid level 5 static analysis errors."
    }
  ]
}`
  }
];
