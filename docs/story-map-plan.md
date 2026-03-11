# BOPS Story Map

A map of everything users can do in BOPS, told through user stories. Starting with the Planning Application validation journey — we'll expand to other stages and portals once this is right.

This lives alongside `docs/plan.md` (which tracks the Storybook build). This document captures **what users need to do** at each step.

---

## How to read this

**Area** → **Task** → **User stories**

Each user story describes something a real person needs to do, see, or understand — written in plain English, GDS style.

---

## Stage 1: Validation

The case officer checks the application is complete and correct before it can proceed to consultation. They work through a task list, checking documents, details, fees, and constraints. If something's wrong, they send requests to the applicant to fix it.

---

### Validation task list

The main page showing all validation tasks and their progress.

- See all validation tasks grouped into sections: documents, application details, requirements, and other issues
- See which tasks are not started, in progress, or complete
- See the task list when everything is done and the application is ready to validate
- Click a task name to go to it

---

### Review documents

Check that the right documents have been uploaded and tag them so they're easy to find later.

- See the list of submitted documents with their names, dates, and tags
- See a document thumbnail and its full preview
- Choose a tag for each document from the dropdown (e.g. "Site plan", "Elevations", "Design and Access Statement")
- See when all documents have been tagged
- See an empty state when there are no documents
- Download all documents at once

---

### Check and request documents

Make sure every required document has been provided. If something's missing, send a request to the applicant.

- See the list of required documents and whether each one has been provided
- See when all required documents are present (nothing to do)
- See which documents are missing and need requesting
- Create a request telling the applicant what document is needed
- See a pending request that's been sent — waiting for the applicant to respond
- See the applicant's uploaded document when they respond
- Cancel a request that's no longer needed

---

### Check red line boundary

Make sure the red line boundary on the map matches the site.

- See the site boundary drawn on the map
- Confirm the boundary is correct
- Mark the boundary as incorrect and send a change request to the applicant
- See the pending request — waiting for the applicant to update the boundary
- See the applicant's updated boundary when they respond
- Cancel a boundary change request

---

### Check constraints

Review the planning constraints that apply to the site — things like conservation areas, listed buildings, or tree preservation orders.

- See the constraints page when no constraints have been found (empty state)
- See a table of constraints with their types and sources
- Add a new constraint using the autocomplete search
- Remove a constraint that doesn't apply
- Mark all constraints as reviewed

---

### Check description

Make sure the application description matches what's actually shown in the plans.

- See the current description with the question: "Does the description match the development or use in the plans?"
- Select "Yes" — the description is confirmed as correct
- Select "No" — a text area appears to enter an amended description
- Choose whether the applicant needs to agree to the new description, or update it immediately
- See the hint: "The new description will be sent to the applicant to approve. If the applicant does not respond within 5 days, the amended description will be automatically accepted."
- See the change request after it's been sent — showing the previous and proposed descriptions
- See the status: "Sent on [date]. Agent or applicant has not yet responded."
- See the applicant's response — they've approved or rejected the change
- Accept or reject the applicant's response
- See the final confirmed description with a "Complete" tag
- See a validation error when submitting without choosing an option

---

### Check fee

Confirm the applicant has paid the right amount.

- See the fee calculation showing what's owed and what's been paid
- Select "Yes, the fee is correct"
- Select "No, the fee is incorrect" — a form appears to explain what's wrong
- See payment details (amount, method, date)
- See when the applicant is exempt from fees, with supporting documents
- See the fee change request after it's been sent
- See the applicant's response to the fee request
- Cancel a fee change request

---

### Add reporting details

Record what type of application this is for reporting purposes.

- See the available reporting types with guidance text
- Select a reporting type
- Answer "Is the local planning authority the owner of this land?" — Yes or No
- If yes, answer "Is the local planning authority carrying out the works proposed?"
- Save the reporting details

---

### Confirm Community Infrastructure Levy (CIL)

Decide whether the application is liable for CIL based on the information from PlanX.

- See what PlanX says about the new floor area and potential CIL liability
- See the recommended answer based on the submission data (e.g. "Yes — recommended based on submission data")
- See "No information on potential CIL liability from PlanX" when there's no data
- Select "Yes, liable for CIL" or "No, not liable"
- Save the CIL decision

---

### Check Environment Impact Assessment

Decide whether an EIA is needed for this application.

- See the question: "Is an Environmental Impact Assessment required?"
- Select "No" — simple confirmation, nothing more needed
- Select "Yes" — additional fields appear:
  - Enter an address where the public can view the Environmental Statement (optional)
  - Enter an email address where the public can request a copy (optional)
  - Enter the fee for a hard copy (optional)
- See the hint: "This application is subject to an EIA. The determination period will be extended to 16 weeks."

---

### Check ownership certificate

Make sure the applicant has declared who owns the land correctly.

- See the ownership certificate details in a table
- See the site location on a map
- See relevant documents in an accordion
- Select "Yes, this declaration is correct"
- Select "No, it's not correct" — a text area appears to explain why
- See the hint: "This request will be added to the application. The requests will not be sent until the application is marked as invalid."
- See the ownership certificate change request after it's been created
- See the reason: "Reason ownership certificate is invalid: [text]"
- See the applicant's response with the updated certificate
- See the activity log showing all certificate changes

---

### Other validation requests

Send any other requests to the applicant that don't fit the specific task categories.

- See an empty state when there are no other requests
- Create a new request describing what's needed
- See a pending request that's been sent
- See the applicant's response
- Cancel a request

---

### Review validation requests

See all outstanding requests in one place before deciding whether to validate.

- See a summary table of all validation requests and their statuses
- See mixed statuses — some pending, some responded, some resolved
- See when all requests have been resolved
- See requests grouped by type (description, fee, boundary, documents, ownership, other)

---

### Send validation decision

The final step — decide whether the application is valid and can proceed, or invalid and needs to go back to the applicant.

- See "Ready to validate" with a green button when all tasks are complete and all requests are resolved
- See a warning when there are still pending items that prevent validation
- See the list of what's blocking validation
- Validate the application — it moves to consultation
- See the success message: "Validation decision sent. An email notification has been sent to the applicant. The application is now ready for consultation and assessment."
- Invalidate the application — it goes back to the applicant with all the outstanding requests
- See the invalidated state

---

## What's next

Once this Stage 1 format is confirmed, the plan expands to cover:

- **Log in** — signing in, two-factor authentication, password reset
- **Dashboard** — viewing cases, filtering, status counts
- **Application overview** — the main application page with details, documents, and progress
- **Stage 2: Consultation** — neighbours, consultees, publicity
- **Stage 3: Assessment** — summaries, policies, conditions, recommendations
- **Stage 4: Review** — reviewer sign-off, challenging recommendations
- **Stage 5: Determination** — publishing decisions, decision notices
- **Documents** — uploading, tagging, archiving
- **Case actions** — notes, assigning officers, withdrawing applications
- **Appeals** — creating and managing appeals
- **Applicant portal** — what the applicant sees and does
- **Consultee portal** — what consultees see and respond to
- **Email templates** — all the emails the system sends

---

## Progress checklist

### Stage 1: Validation
- [x] Validation task list *(plan.md Task 1)*
- [x] Review documents *(plan.md Task 2)*
- [x] Check and request documents *(plan.md Task 3)*
- [x] Check red line boundary *(plan.md Task 4)*
- [x] Check constraints *(plan.md Task 5)*
- [x] Check description *(plan.md Task 6)*
- [x] Check fee *(plan.md Task 7)*
- [x] Add reporting details *(plan.md Task 8)*
- [x] Confirm CIL *(plan.md Task 9)*
- [x] Check EIA *(plan.md Task 10)*
- [x] Check ownership certificate *(plan.md Task 11)*
- [x] Other validation requests *(plan.md Task 12)*
- [x] Review validation requests *(plan.md Task 13)*
- [x] Send validation decision *(plan.md Task 14)*
