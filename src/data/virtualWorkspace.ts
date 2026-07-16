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

export const getInstalledComposerJson = () => `{
  "name": "acme/signup-portal",
  "description": "ACME signup portal and auth system",
  "type": "project",
  "require": {
    "php": "^8.2",
    "vlucas/phpdotenv": "^5.6"
  },
  "require-dev": {
    "phpunit/phpunit": "^10.5",
    "phpstan/phpstan": "^1.11",
    "voku/agent-loop": "^1.4.0"
  },
  "autoload": {
    "psr-4": {
      "App\\\\": "src/"
    }
  }
}`;

export const getInstalledInitialFiles = (): VirtualFile[] => {
  return getInitialFiles().map(f => {
    if (f.path === "composer.json") {
      return { ...f, content: getInstalledComposerJson() };
    }
    return f;
  });
};

export const getBoardFiles = (): VirtualFile[] => [
  ...getInstalledInitialFiles(),
  {
    name: "DEMO-1.md",
    path: "todo/cards/DEMO-1.md",
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
  },
  {
    name: "board.md",
    path: "todo/board.md",
    category: "board",
    language: "markdown",
    content: `# Kanban Board

## BACKLOG_READY
- [ ] DEMO-1: Add validation to signup form
`
  }
];

export const getPlanFiles = (): VirtualFile[] => [
  ...getBoardFiles(),
  {
    name: "work-brief.json",
    path: "session_plan/2026-07-14-demo-1/work-brief.json",
    category: "session",
    language: "json",
    content: `{
  "taskId": "DEMO-1",
  "revision": 1,
  "status": "candidate",
  "briefProjection": {
    "goal": "Add secure server-side verification to Signup.php.",
    "context": "PHP 8.2 backend with existing failing PHPUnit tests.",
    "expectedResult": "Valid registrations succeed and malformed input is rejected.",
    "scope": [
      "src/Signup.php"
    ],
    "nonGoals": [
      "Client-side JS validation",
      "Database schema adjustments"
    ],
    "validation": [
      "composer test",
      "vendor/bin/phpstan analyse"
    ]
  },
  "warnings": [
    "Re-planning will automatically invalidate this candidate and increment the revision."
  ]
}`
  },
  {
    name: "work-brief.md",
    path: "session_plan/2026-07-14-demo-1/work-brief.md",
    category: "session",
    language: "markdown",
    content: `# Work Brief: DEMO-1
**Revision**: 1
**Status**: Candidate

## Goal
Add secure server-side verification to Signup.php, validating emails and password lengths.

## Scope
- \`src/Signup.php\`

## Non-Goals
- Client-side JS validation
- Database schema adjustments

## Validation Commands
- \`composer test\`
- \`vendor/bin/phpstan analyse\`
`
  }
];

export const getApproveFiles = (replanCount = 0): VirtualFile[] => {
  const base = getBoardFiles();
  if (replanCount === 0) {
    return [
      ...base,
      {
        name: "work-brief.json",
        path: "session_plan/2026-07-14-demo-1/work-brief.json",
        category: "session",
        language: "json",
        content: `{
  "taskId": "DEMO-1",
  "revision": 1,
  "status": "approved",
  "briefProjection": {
    "goal": "Add secure server-side verification to Signup.php.",
    "context": "PHP 8.2 backend with existing failing PHPUnit tests.",
    "expectedResult": "Valid registrations succeed and malformed input is rejected.",
    "scope": [
      "src/Signup.php"
    ],
    "nonGoals": [
      "Client-side JS validation",
      "Database schema adjustments"
    ],
    "validation": [
      "composer test",
      "vendor/bin/phpstan analyse"
    ]
  }
}`
      },
      {
        name: "approval.json",
        path: "session_plan/2026-07-14-demo-1/approval.json",
        category: "session",
        language: "json",
        content: `{
  "approvedBy": "lars",
  "approvedAt": "${new Date().toISOString()}",
  "briefRevision": 1
}`
      }
    ];
  } else {
    return [
      ...base,
      {
        name: "rev1_work-brief.json",
        path: "session_plan/2026-07-14-demo-1/work-brief-history/rev1_work-brief.json",
        category: "session",
        language: "json",
        content: `{
  "taskId": "DEMO-1",
  "revision": 1,
  "status": "superseded",
  "briefProjection": {
    "goal": "Add secure server-side verification to Signup.php.",
    "context": "PHP 8.2 backend with existing failing PHPUnit tests.",
    "expectedResult": "Valid registrations succeed and malformed input is rejected.",
    "scope": [
      "src/Signup.php"
    ],
    "nonGoals": [
      "Client-side JS validation"
    ],
    "validation": [
      "composer test"
    ]
  },
  "supersededBy": "session_plan/2026-07-14-demo-1/work-brief.json",
  "reason": "Re-planned to add PHPStan and strict-type rules into the goals definition."
}`
      },
      {
        name: "work-brief.json",
        path: "session_plan/2026-07-14-demo-1/work-brief.json",
        category: "session",
        language: "json",
        content: `{
  "taskId": "DEMO-1",
  "revision": 2,
  "status": "approved",
  "briefProjection": {
    "goal": "Add secure server-side validation to Signup.php with strict typing, fully passing PHPStan Level 5.",
    "context": "PHP 8.2 backend with existing failing PHPUnit tests.",
    "expectedResult": "Valid registrations succeed and malformed input is rejected, passing Level 5 static diagnostics.",
    "scope": [
      "src/Signup.php"
    ],
    "nonGoals": [
      "Client-side JS validation",
      "Database schema adjustments"
    ],
    "validation": [
      "composer test",
      "vendor/bin/phpstan analyse"
    ]
  }
}`
      },
      {
        name: "approval.json",
        path: "session_plan/2026-07-14-demo-1/approval.json",
        category: "session",
        language: "json",
        content: `{
  "approvedBy": "lars",
  "approvedAt": "${new Date().toISOString()}",
  "briefRevision": 2
}`
      }
    ];
  }
};

export const getRecallFiles = (replanCount = 0): VirtualFile[] => [
  ...getApproveFiles(replanCount),
  {
    name: "system.md",
    path: "infra/doc/agent-learning/recall-output/DEMO-1/system.md",
    category: "recall",
    language: "markdown",
    content: `# System Briefing (agent-loop recall)
This briefing compiles rules across the repository for active agent injection.

## Project Coding Style Guidelines
- Strict Type declaration (\`declare(strict_types=1);\`) must exist on every file.
- PHP PSR-12 code formatting standards apply.
- Always use typehints in method signatures.
`
  },
  {
    name: "validation-plan.md",
    path: "infra/doc/agent-learning/recall-output/DEMO-1/validation-plan.md",
    category: "recall",
    language: "markdown",
    content: `# Validation Plan - DEMO-1
Compiled validation plan for goal: "Add validation guards to App\\Signup."

## Commands
1. \`composer test\` (Unit Tests)
2. \`vendor/bin/phpstan analyse\` (Static Analysis)
`
  },
  {
    name: "recall-log.draft.json",
    path: "infra/doc/agent-learning/recall-output/DEMO-1/recall-log.draft.json",
    category: "recall",
    language: "json",
    content: `{
  "description": "Guidance outcomes template to evaluate selected rules usefulness.",
  "compiledRules": {
    "strict_types_required": {
      "selection": "approved_guidance",
      "usefulness": "helpful",
      "comment": "Enforced standard parameters strictness as requested."
    },
    "psr_12_formatting": {
      "selection": "approved_guidance",
      "usefulness": "helpful",
      "comment": "Aligned spacing with main branch styling."
    }
  }
}`
  },
  {
    name: "php-symbols.json",
    path: ".agent-map/php-symbols.json",
    category: "map",
    language: "json",
    content: `{
  "repository": "acme/signup-portal",
  "navigationResult": {
    "classes": [
      {
        "name": "App\\\\Signup",
        "file": "src/Signup.php",
        "methods": [
          "register",
          "getErrors"
        ]
      }
    ],
    "tests": [
      {
        "name": "App\\\\Test\\\\SignupTest",
        "file": "tests/SignupTest.php",
        "methods": [
          "testRegisterWithValidDetails",
          "testRegisterWithShortPassword",
          "testRegisterWithGarbageEmail"
        ]
      }
    ]
  },
  "explanation": "Built compact PHP symbol map index dynamically."
}`
  }
];

export const getWorkDoneFiles = (replanCount = 0): VirtualFile[] => {
  const base = getRecallFiles(replanCount);
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

export const getVerifyFiles = (replanCount = 0): VirtualFile[] => [
  ...getWorkDoneFiles(replanCount),
  {
    name: "verification_summary.json",
    path: "session_plan/2026-07-14-demo-1/verification_summary.json",
    category: "session",
    language: "json",
    content: `{
  "timestamp": "${new Date().toISOString()}",
  "status": "passed",
  "checks": {
    "board_verify": {
      "status": "passed",
      "description": "Kanban source is active and rules match target files."
    },
    "consistency_verify": {
      "status": "passed",
      "description": "Tasks, sessions, and work brief are fully aligned. Code modifications correspond to approved brief rev ${replanCount === 0 ? '1' : '2'}."
    },
    "phpunit_tests": {
      "status": "passed",
      "passedCount": 4,
      "failedCount": 0
    },
    "phpstan_static_analysis": {
      "status": "passed",
      "strictLevel": 5,
      "errors": 0
    }
  }
}`
  }
];

export const getCloseFiles = (replanCount = 0): VirtualFile[] => [
  ...getVerifyFiles(replanCount),
  {
    name: "DEMO-1_report.json",
    path: "session_plan/2026-07-14-demo-1/DEMO-1_report.json",
    category: "session",
    language: "json",
    content: `{
  "taskId": "DEMO-1",
  "status": "closed",
  "summary": "Successfully resolved validation loopholes in App\\\\Signup. Strict typing and PHPUnit suites verified.",
  "durationSeconds": 34,
  "artifacts": [
    "src/Signup.php"
  ]
}`
  }
];

export const getLearningApprovedFiles = (replanCount = 0): VirtualFile[] => {
  const base = getCloseFiles(replanCount);
  return [
    ...base,
    {
      name: "finding.2026-07-14.001.json",
      path: "infra/doc/agent-learning/findings/finding.2026-07-14.001.json",
      category: "learning",
      language: "json",
      content: `{
  "id": "finding.2026-07-14.001",
  "task": "DEMO-1",
  "status": "validated",
  "observation": "PHPStan analysis initially failed due to loose method types in Signup handler register().",
  "proposal": {
    "id": "proposal.2026-07-14.001",
    "action": "REPLACE",
    "status": "candidate",
    "description": "Enforce strict typing ('declare(strict_types=1);') and return types across all signup routes.",
    "target": "global-recall/rules/php_strict.json"
  },
  "comment": "Always inject strict_types and explicit parameter signatures in ACME PHP source modules."
}`
    },
    {
      name: "findings.json",
      path: "infra/doc/agent-learning/findings.json",
      category: "learning",
      language: "json",
      content: `{
  "findings": [
    "infra/doc/agent-learning/findings/finding.2026-07-14.001.json"
  ]
}`
    }
  ];
};

export const getMemoryFiles = (replanCount = 0, isApproved = false): VirtualFile[] => [
  ...getLearningApprovedFiles(replanCount),
  {
    name: "proposal.2026-07-14.001.json",
    path: "infra/doc/agent-learning/proposals/candidate/proposal.2026-07-14.001.json",
    category: "learning",
    language: "json",
    content: `{
  "proposalId": "proposal.2026-07-14.001",
  "findingId": "finding.2026-07-14.001",
  "status": "${isApproved ? "approved" : "candidate"}",
  "reason": "Enforce strict types in PHP components.",
  "promotionTarget": "global-recall/rules/php_strict.json"
}`
  }
];
