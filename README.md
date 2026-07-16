# agent-loop Landing Page

Production-ready Vite + React landing page for **agent-loop**, a local governance protocol for AI coding workflows. The app presents the CLI workflow, interactive sandbox, and documentation for scope locking, evidence verification, and selective context management.

## What this app includes

- A responsive neo-brutalist landing page for the agent-loop project.
- An interactive browser sandbox that demonstrates the governed CLI workflow.
- Static SEO metadata, social sharing tags, and a favicon for deploy previews and production hosting.
- A GitHub Pages deployment workflow that builds the Vite app and publishes the generated `dist/` directory.

## Requirements

- Node.js LTS+
- npm+

## Local development

```bash
npm install
npm run dev
```

The development server listens on `http://localhost:3000` by default.

## Production build

```bash
npm run build
npm run preview
```

`npm run build` type-checks and bundles the application into `dist/`. `npm run preview` serves that production bundle locally so you can verify routing, assets, metadata, and layout before deployment.

## GitHub Pages deployment

This repository includes an automatic GitHub Pages workflow at `.github/workflows/deploy.yml`.

1. In GitHub, open **Settings → Pages**.
2. Set **Build and deployment → Source** to **GitHub Actions**.
3. Push to the default branch, or run the workflow manually from the **Actions** tab.
4. The workflow installs dependencies with `npm ci`, builds with `npm run build`, uploads `dist/`, and deploys it to Pages.

The Vite config automatically sets the asset base path from `GITHUB_REPOSITORY` during GitHub Actions builds, so project Pages deployments resolve bundled assets under `/<repository-name>/` without hard-coded repository URLs.

## Project structure

```text
.
├── .github/workflows/deploy.yml  # GitHub Pages build and deploy workflow
├── public/favicon.svg            # Site favicon
├── src/App.tsx                   # Interactive sandbox simulation
├── src/components/LandingPage.tsx# Landing page content and calls to action
├── src/components/AgentMonitor.tsx
├── src/components/Terminal.tsx
├── src/data/virtualWorkspace.ts  # Demo workspace fixtures
├── index.html                    # SEO, social metadata, and app shell
└── vite.config.ts                # Vite, React, Tailwind, aliases, Pages base path
```

## Key Files Detector helper prompt

Use this helper prompt when you want a coding agent to identify the smallest safe file set before implementing a change:

```text
You are the Key Files Detector for this repository.

Goal: identify the minimum set of files that must be read or edited for the requested task before any code changes are made.

Instructions:
1. Restate the requested change in one sentence.
2. Search the repository for relevant entry points, routes, components, configuration, tests, and documentation.
3. Group findings into:
   - Must read before editing
   - Likely edit targets
   - Tests or checks to run
   - Files that appear related but should not be touched unless new evidence appears
4. Explain why each file is included in one concise sentence.
5. Do not edit files. Do not install dependencies. Do not run destructive commands.
6. Prefer the smallest sufficient scope and call out assumptions explicitly.

Return the result as a Markdown checklist.
```

## Quality checks

Run these before opening or merging a pull request:

```bash
npm run lint
npm run build
```

## Deployment notes

- The application is static and does not require server-side secrets.
- Environment files are optional for this landing page; do not commit local `.env` files.
- Keep marketing copy version-flexible. Prefer compatibility wording such as `PHP 8.3+` and avoid hard-coded product version badges in page content.
