# BOPS Storybook: Designer-Focused Workflow Documentation

## Context

The current Storybook has basic component demos. Designers need to see the **real pages and interactions** — what every task looks like, what happens when you select Yes vs No, what a table looks like with 0 items vs many, how a page changes after an action. This replaces clicking through staging.

## What each story should show (designer-first)

Each task story is a visual walkthrough. For each task, we show:

1. **The page as it first appears** — the full page layout including header, breadcrumbs, and form
2. **Interaction outcomes** — what happens when you select different options (e.g. "Yes, the description is correct" vs "No, I want to request a change"). Each branch becomes a separate story.
3. **Content variations** — what the page looks like with different amounts of data (empty table vs populated, short text vs long, one document vs many)
4. **After-action states** — what you see after completing the task, after sending a request, after receiving a response
5. **The task in the sidebar/task list** — how the status tag changes as you progress
6. **Error states** — what validation errors look like (as one story among many, not the focus)

### Example: "Check Description" task
```
Stories:
  - InitialView          → Page with current description, Yes/No radio buttons
  - SelectedYes          → What you see after selecting "Yes, it's correct" (confirmed state)
  - SelectedNo           → Form expands: text area for new description, sub-question about applicant approval
  - ChangeRequestSent    → Inset text showing pending request, status tag = "Invalid"
  - ApplicantResponded   → Updated view with applicant's response, accept/reject options
  - Completed            → Final confirmed state with green "Complete" tag
  - WithErrors           → Error summary when submitting without selecting an option
```

### Example: "Check Constraints" task
```
Stories:
  - EmptyConstraints     → Page with no constraints found (empty state message)
  - WithConstraints      → Table showing 5 constraints with types and sources
  - AddingConstraint     → Autocomplete search expanded, typing a constraint name
  - ConstraintsReviewed  → All constraints marked as reviewed, "Complete" tag
```

## Story file convention

- **Title**: `"Workflows/Planning Permission/1. Validation/Check Description"`
- **JSDoc**: Brief explanation of what this task does and when it appears in the workflow
- **Exports**: Named by what the designer sees (e.g. `InitialView`, `SelectedYes`, `SelectedNo`, `RequestSent`)
- **HTML**: Full page context (not just the form — include breadcrumbs, heading, surrounding layout)

## Sample data

Since there's no Rails backend, every story needs realistic mock data. A shared data file (`src/stories/helpers/mockData.js`) provides consistent data across all stories so it feels like one real application. Agents should import from this file rather than inventing new data each time.

The file should include:

- **Application** — reference (`BPS-24-00345-HAPP`), type, description, address, ward, parish
- **People** — applicant name/email, agent name/company, case officer, reviewer (with realistic names)
- **Dates** — received, validated, consultation start/end, target decision date
- **Documents** — list of typical document names with tags (e.g. "Site plan", "Elevations", "Design and Access Statement")
- **Constraints** — list of 5–8 planning constraints with types (e.g. "Conservation Area", "Tree Preservation Order", "Listed Building")
- **Consultees** — 4–5 consultees with organisations, roles, email addresses, and response statuses
- **Neighbours** — 6–8 addresses with names and response types (support/object/neutral)
- **Fee** — amount, payment method, exemption status
- **Site history** — 2–3 previous applications with references, descriptions, and decisions
- **Conditions** — 3–4 sample planning conditions with titles and text
- **Policy references** — 2–3 policy classes with sections and parts

Each agent should:
1. Import what they need from `mockData.js`
2. Add new data entries to the file if their task needs something not yet covered
3. Keep data realistic — use actual GOV.UK / planning terminology

## File structure
```
src/stories/workflows/planning-permission/
  _Overview.mdx                                    # Visual map of all stages and tasks
  stage-1-validation/
    _ValidationTaskList.stories.js                 # Full task list page in different states
    CheckDescription.stories.js
    CheckFee.stories.js
    ...
  stage-2-consultation/
    _ConsultationOverview.stories.js
    SelectConsultees.stories.js
    ...
  stage-3-assessment/
    ...
  stage-4-review/
    ...
  stage-5-determination/
    ...
```

---

## Backlog (43 tasks)

Priority guide:
- **P1** — Complex tasks with rich interactions (branching forms, multiple outcomes, dynamic tables)
- **P2** — Moderate interactions (simpler forms, fewer branches)
- **P3** — Simple or variant tasks

### Foundation (do first)

| # | Task | What to build |
|---|------|--------------|
| 0 | **Story helpers + styles** | Reusable helpers for page layout, breadcrumbs, status tags, GOV.UK grid. Import missing SCSS from source. |
| 0B | **Workflow overview MDX** | Visual map of all 5 stages, every task listed with links. Shows which tasks differ between application types. |

### Stage 1: Validation (14 tasks)

| # | Task | P | Key interactions to show |
|---|------|---|------------------------|
| 1 | **Validation Task List** | P1 | Full page: all tasks not_started; some in_progress; all complete. How the task list looks at different points. |
| 2 | Review Documents | P2 | Document list with tags dropdown, selecting tags, document with thumbnail, all documents tagged. |
| 3 | **Check & Request Documents** | P1 | Initial view (documents OK / missing); creating a document request; request pending; applicant uploaded response. |
| 4 | **Check Red Line Boundary** | P1 | Map view with boundary drawn; selecting "incorrect"; sending change request; applicant's updated boundary. |
| 5 | Check Constraints | P2 | Empty list; populated table; adding via autocomplete; removing one; all reviewed. |
| 6 | **Check Description** | P1 | Yes selected (confirmed); No selected (form expands with textarea); change request sent; applicant responded; accept/reject response. |
| 7 | **Check Fee** | P1 | Fee calculation display; fee correct (Yes); fee incorrect (No → request form); payment info variants; exemption documents. |
| 8 | Add Reporting Details | P3 | Radio list of reporting types; one selected; saved. |
| 9 | Confirm CIL | P2 | Radio Yes/No with CIL context from PlanX; selected Yes; selected No. |
| 10 | Check EIA | P2 | EIA not required (simple); EIA required (address, email, fee fields appear). |
| 11 | **Check Ownership Certificate** | P1 | Certificate table; valid selected; invalid selected (request form); request sent; applicant responded with new cert; activity log. |
| 12 | Other Validation Requests | P2 | No requests; creating a request; request pending; response received. |
| 13 | Review Validation Requests | P2 | Summary table: all pending; mixed statuses; all resolved. |
| 14 | **Send Validation Decision** | P1 | Ready to validate (green button); can't validate yet (pending items warning); invalidated state; validated confirmation. |

### Stage 2: Consultation (9 tasks)

| # | Task | P | Key interactions to show |
|---|------|---|------------------------|
| 15 | **Consultation Task List** | P1 | 3 variants: full (neighbours + consultees + publicity), consultees-only, no consultation. Task list at different progress points. |
| 16 | Select Neighbours | P2 | Address list; selecting/deselecting neighbours; map with neighbour pins; empty vs populated. |
| 17 | Send Letters to Neighbours | P2 | Letter preview; selecting which neighbours; confirmation; letters sent state. |
| 18 | View Neighbour Responses | P2 | No responses yet; responses coming in (mixed support/object/neutral); all responded. Response detail view. |
| 19 | **Select Consultees** | P2 | Constraint-based checklist; consultee table (empty → populated); add consultee form expanded; removing a consultee. |
| 20 | Email Consultees | P2 | Email template preview; customising message; selecting recipients; emails sent confirmation. |
| 21 | View Consultee Responses | P2 | No responses; awaiting responses; mixed responses with tags (supportive/objection); individual response detail. |
| 22 | Site Notice | P3 | Form: number of notices, date displayed, evidence upload; completed with uploaded photo. |
| 23 | Press Notice | P3 | Reason selection; date published; evidence upload; completed state. |

### Stage 3: Assessment (7 tasks)

| # | Task | P | Key interactions to show |
|---|------|---|------------------------|
| 24 | **Assessment Task List** | P1 | Accordion with application info; task sections at different progress points; conditional sections showing/hiding. |
| 25 | Check Ownership Cert (Assessment) | P2 | Post-validation view with activity log; request change option. |
| 26 | Check Consultees | P2 | Consultee summary list with response statuses; marking as reviewed. |
| 27 | Check Site History | P2 | Empty history; table with planning history entries; adding a new entry form. |
| 28 | Check Publicity | P2 | Site notice and press notice evidence review; marking as checked. |
| 29 | Summary of Works | P2 | Empty textarea; filled summary; read-only view after completion. |
| 30 | **Make Recommendation** | P1 | Radio: Grant / Refuse / Not required; selecting Grant (comment textarea); selecting Refuse (reason textarea); submitted recommendation view. |

### Stage 4: Review (4 tasks)

| # | Task | P | Key interactions to show |
|---|------|---|------------------------|
| 31 | **Review Task List** | P1 | Assessor's recommendation banner; review sections; all reviewed state; changes requested state. |
| 32 | Review Assessment Summaries | P2 | Summary with agree/disagree; editing a summary; reviewer comment added. |
| 33 | **Sign-off Recommendation** | P1 | Accept recommendation; challenge recommendation (reason form); changes requested to assessor. |
| 34 | Review Conditions | P3 | Conditions list; editing a condition; adding reviewer note. |

### Stage 5: Determination (2 tasks)

| # | Task | P | Key interactions to show |
|---|------|---|------------------------|
| 35 | Publish Determination | P2 | Ready to publish (checklist of prerequisites); decision notice preview; published confirmation. |
| 36 | Decision Notice Preview | P3 | Full decision notice document layout. |

### Cross-cutting (4 tasks)

| # | Task | P | What |
|---|------|---|------|
| 37 | Sidebar / Accordion | P2 | Application info sidebar expanded/collapsed; each accordion section with sample content. |
| 38 | **Validation Request Lifecycle** | P1 | The full visual journey of a request: create → preview → sent → pending → applicant view → response → officer review → resolved. |
| 39 | Application Status Bar | P3 | All stage combinations showing progress through the workflow. |
| 40 | Flash Messages & Banners | P3 | All banner types with real message text from the app. |

### Workflow variants (3 tasks)

| # | Task | P | What |
|---|------|---|------|
| 41 | Check Legislative Requirements | P3 | Prior Approval / Lawfulness only — legislation dropdown and review. |
| 42 | Permitted Development Rights | P3 | PDR assessment form with Yes/No and reason field. |
| 43 | Pre-Application Tasks | P3 | Meeting form, Site Visit form, Choose Application Type, Heads of Terms. |

---

## Execution order

**Sprint 1 — Foundation + most visual validation tasks**
1. Task 0: Story helpers + styles
2. Task 0B: Workflow overview MDX
3. Task 1: Validation Task List
4. Task 6: Check Description (rich Yes/No branching)
5. Task 7: Check Fee (most visual variations)
6. Task 14: Send Validation Decision (the key moment)

**Sprint 2 — More validation tasks with rich interactions**
7. Task 4: Check Red Line Boundary (map + request flow)
8. Task 11: Check Ownership Certificate (table + request flow)
9. Task 3: Check & Request Documents (document request lifecycle)
10. Task 38: Validation Request Lifecycle (cross-cutting journey)

**Sprint 3 — Remaining validation + consultation**
11. Tasks 2, 5, 8, 9, 10, 12, 13
12. Task 15: Consultation Task List

**Sprint 4 — Consultation tasks**
13. Tasks 16–23

**Sprint 5 — Assessment + Review**
14. Tasks 24, 30, 31, 33 (P1 tasks)
15. Tasks 25–29, 32, 34 (P2/P3)

**Sprint 6 — Determination + polish + variants**
16. Tasks 35–43

## How to work through the backlog

Each session, tell Claude: **"Do Task N: [name]"**. The agent will:
1. Read the source views and components listed in the backlog
2. Import sample data from `src/stories/helpers/mockData.js` (add new entries if the task needs data not yet covered)
3. Recreate the HTML for each interaction state using that data
4. Create the story file at the correct path
5. Add any missing styles to `src/styles/main.scss`
6. Rebuild Docker and verify it renders
7. **Mark the task as done** — edit this file and change `[ ]` to `[x]` for the completed task in the checklist below

## Verification
```bash
docker compose down && docker compose up -d --build
# Open http://localhost:6008 → navigate to the new story
```

---

## Progress checklist

### Foundation
- [x] Task 0: Story helpers + styles
- [x] Task 0B: Workflow overview MDX

### Stage 1: Validation
- [x] Task 1: Validation Task List
- [ ] Task 2: Review Documents
- [ ] Task 3: Check & Request Documents
- [ ] Task 4: Check Red Line Boundary
- [ ] Task 5: Check Constraints
- [ ] Task 6: Check Description
- [ ] Task 7: Check Fee
- [ ] Task 8: Add Reporting Details
- [ ] Task 9: Confirm CIL
- [ ] Task 10: Check EIA
- [ ] Task 11: Check Ownership Certificate
- [ ] Task 12: Other Validation Requests
- [ ] Task 13: Review Validation Requests
- [ ] Task 14: Send Validation Decision

### Stage 2: Consultation
- [ ] Task 15: Consultation Task List
- [ ] Task 16: Select Neighbours
- [ ] Task 17: Send Letters to Neighbours
- [ ] Task 18: View Neighbour Responses
- [ ] Task 19: Select Consultees
- [ ] Task 20: Email Consultees
- [ ] Task 21: View Consultee Responses
- [ ] Task 22: Site Notice
- [ ] Task 23: Press Notice

### Stage 3: Assessment
- [ ] Task 24: Assessment Task List
- [ ] Task 25: Check Ownership Cert (Assessment)
- [ ] Task 26: Check Consultees
- [ ] Task 27: Check Site History
- [ ] Task 28: Check Publicity
- [ ] Task 29: Summary of Works
- [ ] Task 30: Make Recommendation

### Stage 4: Review
- [ ] Task 31: Review Task List
- [ ] Task 32: Review Assessment Summaries
- [ ] Task 33: Sign-off Recommendation
- [ ] Task 34: Review Conditions

### Stage 5: Determination
- [ ] Task 35: Publish Determination
- [ ] Task 36: Decision Notice Preview

### Cross-cutting
- [ ] Task 37: Sidebar / Accordion
- [ ] Task 38: Validation Request Lifecycle
- [ ] Task 39: Application Status Bar
- [ ] Task 40: Flash Messages & Banners

### Workflow variants
- [ ] Task 41: Check Legislative Requirements
- [ ] Task 42: Permitted Development Rights
- [ ] Task 43: Pre-Application Tasks
