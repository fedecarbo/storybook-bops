# Audit backlog

Pick one and ask Claude Code to do it. Each audit should follow the same approach as the status tags audit: read the real BOPS Rails codebase, extract what's actually there, and display it in Storybook for the design team to review.

The BOPS source is at `~/Documents/bops-system`. Results go in `src/stories/patterns/`.

---

## Visual consistency

- [ ] **Buttons and actions** — every button across all tasks: what it says, what colour it is, and where it takes you. Check whether similar actions use the same wording ("Save and continue" vs "Save and mark as complete" vs "Submit") and whether button styles are used consistently.
- [ ] **Summary lists and cards** — how information is laid out in summary cards across different tasks. Are similar pieces of information presented the same way everywhere?
- [ ] **Notification banners** — every success, warning, and info banner in the app. What do they say, when do they appear, and are they helpful?

## Wording and content

- [ ] **Error messages** — every validation error message users see. Do they follow GDS guidelines? Do they tell people what to do, not just what went wrong?
- [ ] **Page titles and headings** — every task page title across all 52 tasks. Are they consistent in style, sentence case, and naming?
- [ ] **Hint text and help content** — all the guidance text shown below form fields. Is it useful? Is it consistent?
- [ ] **Emails and letters** — the actual text sent to applicants, consultees, and neighbours. What tone do they use? Are they clear?

## Workflow and interaction

- [ ] **Form patterns by task** — what input types each task uses (radios, checkboxes, textareas, date pickers). Are similar tasks using different form patterns for no reason?
- [ ] **Validation request types** — every type of change request sent to applicants, what response options they get, and how those responses are shown back to officers.
- [ ] **Empty states** — what users see when there's no data yet (no consultees added, no documents uploaded, no responses received). Are those states helpful or just blank?

## Navigation and structure

- [ ] **Task dependencies** — which tasks block which other tasks, mapped visually. Do the dependencies make sense?
- [ ] **Sidebar states per stage** — what combination of task statuses a user actually sees at key moments in each workflow stage.

## Cross-cutting

- [ ] **Date formatting** — how dates are displayed across the app. Are they consistent? ("2 April 2026" vs "02/04/2026" vs "2 Apr 2026")
- [ ] **Table patterns** — every table in the app. Are column headers, alignment, and layout consistent for similar types of data?
