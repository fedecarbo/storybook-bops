# Storybook BOPS

A Storybook project to showcase and document UI components from the BOPS (Back Office Planning System) Rails application for designers and stakeholders.

## Source Project

The source application lives at `~/Documents/test5`. It is a **Ruby on Rails 8.0** app with:
- **View Components** (Ruby component library)
- **GOV.UK Design System** (`govuk-frontend` v5.2.0)
- **SCSS/Sass** styling (Dart Sass)
- **Stimulus.js** for interactivity
- Multiple **Rails engines** under `engines/` for modular features

### Key source directories
- `~/Documents/test5/app/components/` — View Components (`.rb` + `.html.erb`)
- `~/Documents/test5/app/assets/stylesheets/` — SCSS stylesheets
- `~/Documents/test5/app/assets/stylesheets/components/` — Component-specific styles
- `~/Documents/test5/app/javascript/controllers/` — Stimulus.js controllers
- `~/Documents/test5/engines/` — Rails engines (admin, api, applicants, config, etc.)

## Tech Stack (This Project)

- **Storybook** — for component documentation and visual showcase
- **HTML/CSS/JS** — stories render server-side component HTML
- **SCSS** — mirrors the source project's styles
- **GOV.UK Frontend** — design system dependency
- **Yarn** — package manager (matching source project)

## Goals

- Provide designers with a browsable catalogue of BOPS UI components
- Show component states, variants, and responsive behaviour
- Organised by feature area (matching Rails engines where applicable)
- No Ruby runtime needed — stories use pre-rendered HTML or recreated markup

## Commands

```bash
yarn install          # Install dependencies
yarn storybook        # Start Storybook dev server
yarn build-storybook  # Build static Storybook site
```

## Conventions

- Stories go in `src/stories/` organised by feature area
- Component styles are imported from or mirror the source SCSS
- Use `@storybook/html` since components are server-rendered HTML, not React
- Follow GOV.UK Design System naming and patterns
