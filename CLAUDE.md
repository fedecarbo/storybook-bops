# Storybook BOPS

A comprehensive workflow and UI documentation system for **BOPS** (Back Office Planning System) — a government planning application built in Rails that handles planning permissions, prior approvals, enforcement, pre-applications, lawfulness certificates, and other workflow types across 52+ tasks and 5 workflow stages (Validation, Consultation, Assessment, Review, Determination).

**The problem:** Designers, product managers, and stakeholders can't see the real BOPS UI without setting up the full Rails environment and clicking through complex multi-actor workflows to reach specific application states.

**The solution:** This project uses AI-assisted extraction of real HTML markup from the Rails codebase into a browsable Storybook — no Ruby runtime needed. Stories use shared mock data so they feel like one coherent application.

**Not just documentation — a design tool:** This project goes beyond mirroring existing UI. It is also used to prototype and iterate on improved workflows and task designs (e.g. site notice v4 with workflow improvements), and to document reusable interaction patterns worth contributing back to the wider GDS community.

**Three uses:**
- **Stories** — individual UI states and variants for each task (e.g. "Check Description: Initial View", "Check Description: Change Request Sent")
- **Journey docs (MDX)** — step-by-step narrative walkthroughs showing multi-actor interactions (case officer → applicant → consultee → reviewer) with embedded live story previews, so any stakeholder can understand the end-to-end journey for each workflow
- **Pattern library** — documenting, iterating, and improving interaction patterns that can be shared with the wider GDS design community

**Audience:** designers (primary), product managers, stakeholders, new team members, and developers referencing component patterns.

**Progress:** ~50% complete — 26 of 52 tasks documented (Stages 1–2 complete, Stage 3 in progress).

## Source Project

The source application lives at `~/Documents/bops-system`. It is a **Ruby on Rails 8.0** app with:
- **View Components** (Ruby component library)
- **GOV.UK Design System** (`govuk-frontend` v5.2.0)
- **SCSS/Sass** styling (Dart Sass)
- **Stimulus.js** for interactivity
- Multiple **Rails engines** under `engines/` for modular features

### Key source directories
- `~/Documents/bops-system/app/components/` — View Components (`.rb` + `.html.erb`)
- `~/Documents/bops-system/app/assets/stylesheets/` — SCSS stylesheets
- `~/Documents/bops-system/app/assets/stylesheets/components/` — Component-specific styles
- `~/Documents/bops-system/app/javascript/controllers/` — Stimulus.js controllers
- `~/Documents/bops-system/engines/` — Rails engines (admin, api, applicants, config, etc.)

## Tech Stack (This Project)

- **Storybook 10.3** — for component documentation and visual showcase
- **Docker** — containerised development (Node 22 Alpine)
- **HTML/CSS/JS** — stories render server-side component HTML
- **SCSS** — mirrors the source project's styles
- **Vite 8** — build tool
- **GOV.UK Frontend v5** — design system dependency (must match source app's v5.x)
- **Yarn** — package manager (matching source project)

## Goals

- Document all 52+ tasks across 5 workflow stages and 6 workflow types
- Provide designers with a browsable catalogue of every task, interaction state, and workflow step
- Make workflows understandable to any stakeholder — not just designers and developers
- Show component states, variants, and multi-actor workflows (officer, applicant, consultee, reviewer)
- Include MDX journey docs that narrate end-to-end workflows with embedded live previews
- Prototype improved workflows and task designs, not just document the current state
- Identify, document, and iterate on interaction patterns worth sharing with the wider GDS community
- No Ruby runtime needed — stories use AI-extracted HTML markup from the source Rails app

## Commands

All commands run inside Docker — do not use local Node.js/yarn.

```bash
docker compose up              # Start Storybook dev server (port 6008)
docker compose run storybook yarn install   # Install dependencies
docker compose run storybook yarn build-storybook  # Build static site
```

## Conventions

- Stories go in `src/stories/` organised by feature area
- Component HTML is extracted from the source Rails app using AI-assisted analysis of ViewComponents and templates
- Stories use shared mock data (application reference, applicants, dates, constraints, consultees) for consistency
- Component styles are imported from or mirror the source SCSS
- Use `@storybook/html` since components are server-rendered HTML, not React
- Follow GOV.UK Design System naming and patterns
- All content must follow [GDS content design guidelines](https://www.gov.uk/guidance/content-design/writing-for-gov-uk) — plain English, active voice, sentence case for headings, no jargon
