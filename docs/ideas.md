# Ideas: What to Build Next

Once all task stories are complete in Storybook, the BOPS codebase has rich structured data that can be mined for audits, analysis, and documentation. This document captures ideas for future work.

**Source material available:**
- 6 workflow YAML definitions (Planning Permission, Prior Approval, Enforcement, Pre-Application, Lawfulness Certificate, Other)
- 4,600+ lines of locale content across 15 files
- 110 ViewComponents
- 511 view templates
- 21 email templates
- 31 Stimulus.js controllers
- 11 Rails engines
- 4 user roles (assessor, reviewer, administrator, global administrator)

---

## 1. Reverse-Engineered Story Map

Build a complete user story map by mining the codebase — workflow YAMLs, task models, locale files, view templates, and controller actions.

**Structure:**
- **Layer 1 — Activities:** Dashboard, Validation, Consultation, Assessment, Review, Determination
- **Layer 2 — Tasks:** Each task within a stage (from the workflow YAML files)
- **Layer 3 — User Stories:** "As a [role], I need to [action], so that [outcome]" — inferred from task views, locale labels, and controller actions
- **Layer 4 — Acceptance Criteria:** Derived from code behaviour, validation rules, state transitions, and conditional UI logic

**What makes this rich:**
- **Multi-actor stories** — many tasks involve assessor → applicant → assessor chains (e.g. requesting a description change). The 10 validation request types and 21 email templates map these interactions.
- **Cross-workflow comparison** — compare all 6 workflow types side by side. Where does Prior Approval differ from Planning Permission? What's unique to Enforcement?
- **Dependency mapping** — the `cannot_start_yet` states and section gating show story dependencies
- **Coverage analysis** — cross-reference the story map against Storybook stories to find gaps

**Possible formats:**
- Interactive MDX pages in Storybook (one per workflow type)
- Exportable YAML/JSON for Jira, Miro, or other planning tools
- Mermaid flowcharts for each task's multi-actor journey
- Overview page showing all 6 workflows as a visual grid

---

## 2. Content & Copy Audits

### Error Message Catalogue
Extract every error/validation message from locale files. Group by severity and context. Flag:
- Inconsistent phrasing for the same concept
- Messages that don't follow GDS content guidelines ("must" vs "should")
- Messages that are unclear to applicants
- Missing error messages (form validations without user-facing text)

### Email Template Audit
Catalogue all 21 mailer templates. For each, document:
- When it's triggered in the workflow
- Who receives it
- Subject line (from `notify.en.yml`)
- Tone and language analysis
- Whether it follows GDS email patterns
- Action links and their clarity

### Terminology Consistency Check
Scan across all 15 locale files and 511 templates for synonym drift:
- "applicant" vs "agent" vs "customer"
- "planning application" vs "submission" vs "case"
- "validate" vs "check" vs "verify"
- Build a controlled vocabulary list for the product

### GOV.UK Content Standards Compliance
Audit all user-facing copy against GDS content design rules:
- Active voice
- No jargon
- Specific word choices (GDS has a style guide for preferred terms)
- Sentence length and structure

### Content Readability Scoring
Run readability analysis (Flesch-Kincaid) on:
- Decision notices
- Consultation letters
- Neighbour notification text
- Email templates
Flag anything above the recommended reading level.

---

## 3. Design Pattern Analysis

### Component Usage Map
Trace which of the 110 ViewComponents are used where:
- Find orphaned components nobody uses
- Spot where the same UI pattern is hand-coded instead of using an existing component
- Suggest consolidation opportunities
- Map component usage across the 11 engines

### UI Inconsistency Detection
Find places where the same concept is rendered differently:
- Status indicators with different colours or wording
- Date format variations
- Button labels ("Continue" vs "Save and continue" vs "Submit")
- Heading levels and page structure patterns
- Table column ordering for similar data

### SCSS Audit
Catalogue all custom BOPS styles vs GOV.UK tokens:
- Custom variables (`$bops-light-blue-background`, `$bops-blue-border`) — are any duplicating GOV.UK tokens?
- Inconsistent spacing usage (hard-coded px vs `govuk-spacing()`)
- Colour usage that doesn't come from the design system
- Unused styles

### Form Pattern Catalogue
Extract every form across the app and document:
- Field types used
- Validation rules and error display patterns
- Conditional reveal logic (Stimulus `show_hide_controller` branching)
- Form submission patterns
- Required vs optional field patterns
Flag forms that don't follow consistent patterns.

### Design Token Reference
Build a visual reference page in Storybook showing:
- Every colour used (GOV.UK standard + BOPS custom)
- Spacing scale
- Font sizes and weights
- Breakpoints
- Any custom design tokens

---

## 4. Accessibility

### Systematic ARIA Audit
Check every component template for:
- Missing `aria-label` or `aria-labelledby`
- Incorrect heading hierarchy (`h1` → `h3` skipping `h2`)
- Missing focus management on dynamic content
- Keyboard navigation gaps
- `role` attributes used correctly
- Form fields with associated labels

### Screen Reader Journey Walkthrough
For each documented task journey, describe what a screen reader user would experience:
- Announcement order on page load
- Any focus traps or confusing patterns
- Whether page titles change appropriately between steps
- Dynamic content announcements (live regions)
- Tab order through interactive elements

### Colour Contrast Audit
Check BOPS custom colours against WCAG AA/AAA standards:
- Text on custom backgrounds
- Status tag colour combinations
- Map overlay text readability
- Print stylesheet contrast

---

## 5. Workflow & Logic Documentation

### Decision Tree Visualisation
Auto-generate flowcharts for each task showing every possible path:
- Happy path through the task
- What happens at each decision point (Yes/No radio buttons, dropdowns)
- Where emails are triggered
- Where the applicant portal is involved
- Task state transitions

### Notification Map
Build a single reference document: "When X happens, who gets told what?"
- Map every email to its exact workflow trigger
- Document recipient logic (applicant, agent, consultee, officer)
- Show conditions that determine whether a notification is sent
- Timeline of notifications through a typical application lifecycle

### Permission & Role Matrix
Document which roles can do what at each stage:
- Assessor capabilities
- Reviewer capabilities
- Administrator capabilities
- Applicant portal actions
- Consultee portal actions
Surface any gaps or inconsistencies.

### Edge Case & Unhappy Path Catalogue
For each task, document what happens when things go wrong:
- Validation failures and their messages
- Request timeouts and closures
- Cancelled requests
- Re-opened tasks
- What the applicant sees when they miss a deadline

### Stimulus Controller Catalogue
Document all 31 controllers as a Storybook reference page:
- What each controller does
- Which views use it
- Its targets and values API
- Accessibility behaviour
- Interactive demo where possible

---

## 6. Quality & Improvement

### "Before & After" Improvement Proposals
Once patterns are catalogued, propose specific improvements with mockup stories:
- "These 5 forms use inconsistent error summary placement — here's a unified approach"
- "These status tags use 3 different colour schemes — here's a consolidated palette"
- Side-by-side current vs proposed in Storybook

### Documentation Coverage Gaps
Cross-reference Storybook stories against actual app views:
- UI states that exist in production but aren't documented
- Workflow paths not yet covered by journey MDX docs
- Components without visual documentation

### Engine Dependency Map
Map how the 11 engines relate:
- Shared resources and cross-engine references
- Where duplication exists between engines
- Which engines depend on `bops_core`
- Opportunities for consolidation
