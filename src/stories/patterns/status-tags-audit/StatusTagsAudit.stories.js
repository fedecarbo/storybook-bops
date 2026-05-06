/**
 * Status Tags Audit — every status tag used in BOPS, as it appears to users.
 * Audited 2 April 2026 from the live Rails codebase.
 */

export default {
  title: "Patterns/Status Tags Audit",
  parameters: { layout: "padded" },
  decorators: [
    (story) =>
      `<div style="max-width: 960px; margin: 0 auto; padding: 20px;">${story()}</div>`,
  ],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function tag(label, colour, statusKey) {
  const cls = statusKey
    ? `govuk-tag govuk-tag--${colour} govuk-tag--status-${statusKey}`
    : `govuk-tag govuk-tag--${colour}`;
  return `<strong class="${cls}">${label}</strong>`;
}

function tagRow(items) {
  return `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">${items.join("")}</div>`;
}

function heading(text) {
  return `<h3 class="govuk-heading-s" style="margin-bottom:8px;">${text}</h3>`;
}

function note(text) {
  return `<p class="govuk-body-s" style="color:#505a5f;margin-bottom:16px;">${text}</p>`;
}

function flagBox(html) {
  return `<div class="govuk-inset-text" style="border-left-color:#f47738;background:#fef7f1;margin-bottom:24px;">${html}</div>`;
}

function infoBox(html) {
  return `<div class="govuk-inset-text" style="margin-bottom:24px;">${html}</div>`;
}

function tableStart(headers) {
  let html = `<table class="govuk-table"><thead class="govuk-table__header"><tr>`;
  for (const h of headers) html += `<th class="govuk-table__header">${h}</th>`;
  html += `</tr></thead><tbody class="govuk-table__body">`;
  return html;
}

function tableRow(cells, highlight = false) {
  const style = highlight ? ` style="background:#fef7f1;"` : "";
  let html = `<tr class="govuk-table__row"${style}>`;
  for (const c of cells) html += `<td class="govuk-table__cell">${c}</td>`;
  html += `</tr>`;
  return html;
}

function tableEnd() {
  return `</tbody></table>`;
}

// ---------------------------------------------------------------------------
// 1. All tags by colour
// ---------------------------------------------------------------------------

export const AllTagsByColour = {
  name: "All tags grouped by colour",
  render: () => {
    let html = "";

    html += `<h2 class="govuk-heading-m">Every status tag in BOPS, grouped by colour</h2>`;
    html += note("This is what users see. Each tag is shown exactly as it appears in the live application.");

    // GREEN
    html += `<h3 class="govuk-heading-s" style="margin-top:32px;border-bottom:3px solid #00703c;padding-bottom:8px;">Green</h3>`;
    html += note("Used for positive outcomes and completed actions.");
    html += tagRow([
      tag("Accepted", "green"),
      tag("Auto accepted", "green"),
      tag("Valid", "green"),
      tag("Complies", "green"),
      tag("Supportive", "green"),
      tag("No objection", "green"),
      tag("Supported", "green"),
      tag("To grant", "green"),
      tag("To grant with Legal agreement", "green"),
      tag("Published", "green"),
      tag("Active", "green"),
    ]);

    // BLUE
    html += `<h3 class="govuk-heading-s" style="margin-top:32px;border-bottom:3px solid #1d70b8;padding-bottom:8px;">Blue</h3>`;
    html += note("Used for things that haven't been started or have no response yet.");
    html += tagRow([
      tag("Not started", "blue"),
      tag("New", "blue"),
      tag("No response", "blue"),
      tag("Not consulted", "blue"),
      tag("None", "blue"),
      tag("Responded", "blue"),
    ]);

    // LIGHT BLUE
    html += `<h3 class="govuk-heading-s" style="margin-top:32px;border-bottom:3px solid #5694ca;padding-bottom:8px;">Light blue</h3>`;
    html += note("Used for things that are in progress or waiting.");
    html += tagRow([
      tag("In progress", "light-blue"),
      tag("Awaiting response", "light-blue"),
      tag("To be determined", "light-blue"),
      tag("Posted", "light-blue"),
      tag("Sent", "light-blue"),
      tag("Requested", "light-blue"),
      tag("In assessment", "light-blue"),
    ]);

    // YELLOW
    html += `<h3 class="govuk-heading-s" style="margin-top:32px;border-bottom:3px solid #ffdd00;padding-bottom:8px;">Yellow</h3>`;
    html += note("Used for things that need attention or are waiting for someone to act.");
    html += tagRow([
      tag("Updated", "yellow"),
      tag("To be reviewed", "yellow"),
      tag("Submitted", "yellow"),
      tag("Neutral", "yellow"),
      tag("Amendments needed", "yellow"),
      tag("Awaiting changes", "yellow"),
      tag("Awaiting evidence", "yellow"),
      tag("Awaiting publication", "yellow"),
      tag("Not sent yet", "yellow"),
      tag("Pending", "yellow"),
      tag("Needs Changes", "yellow"),
      tag("Waiting", "yellow"),
      tag("Deprecated", "yellow"),
    ]);

    // RED
    html += `<h3 class="govuk-heading-s" style="margin-top:32px;border-bottom:3px solid #d4351c;padding-bottom:8px;">Red</h3>`;
    html += note("Used for negative outcomes, failures, and rejections.");
    html += tagRow([
      tag("To refuse", "red"),
      tag("To refuse with Legal agreement", "red"),
      tag("Removed", "red"),
      tag("Invalid", "red"),
      tag("Rejected", "red"),
      tag("Objection", "red"),
      tag("Failed", "red"),
      tag("Cancelled", "red"),
      tag("Does not comply", "red"),
      tag("Technical failure", "red"),
      tag("Permanent failure", "red"),
      tag("Invalidated", "red"),
      tag("Delivery failed", "red"),
      tag("Retired", "red"),
      tag("Overdue", "red"),
      tag("Urgent", "red"),
    ]);

    // GREY
    html += `<h3 class="govuk-heading-s" style="margin-top:32px;border-bottom:3px solid #b1b4b6;padding-bottom:8px;">Grey</h3>`;
    html += note("Used for optional, inactive, or not-yet-relevant items.");
    html += tagRow([
      tag("Optional", "grey"),
      tag("Not required", "grey"),
      tag("Sending", "grey"),
      tag("Not consulted", "grey"),
      tag("Not sent", "grey"),
      tag("Inactive", "grey"),
      tag("Internal", "grey"),
      tag("External", "grey"),
      tag("Private", "grey"),
    ]);

    // PURPLE
    html += `<h3 class="govuk-heading-s" style="margin-top:32px;border-bottom:3px solid #4c2c92;padding-bottom:8px;">Purple</h3>`;
    html += note("Used for printing, appeals, and awaiting determination.");
    html += tagRow([
      tag("Printing", "purple"),
      tag("Awaiting determination", "purple"),
      tag("Appeal in progress", "purple"),
    ]);

    // ORANGE
    html += `<h3 class="govuk-heading-s" style="margin-top:32px;border-bottom:3px solid #f47738;padding-bottom:8px;">Orange</h3>`;
    html += note("Used for enforcement cases and postal delivery.");
    html += tagRow([
      tag("Not started", "orange"),
      tag("Under investigation", "orange"),
      tag("Closed", "orange"),
      tag("28 days received", "orange"),
      tag("Post", "orange"),
    ]);

    // TURQUOISE
    html += `<h3 class="govuk-heading-s" style="margin-top:32px;border-bottom:3px solid #28a197;padding-bottom:8px;">Turquoise</h3>`;
    html += note("Used for document type labels.");
    html += tagRow([
      tag("Floor plan", "turquoise"),
      tag("Site plan", "turquoise"),
      tag("Elevation", "turquoise"),
      tag("Photograph", "turquoise"),
    ]);

    // WHITE / TRANSPARENT (CSS overrides)
    html += `<h3 class="govuk-heading-s" style="margin-top:32px;border-bottom:3px solid #b1b4b6;padding-bottom:8px;">White (transparent background)</h3>`;
    html += note("These tags have no coloured background. They look like plain text with no tag styling.");
    html += tagRow([
      tag("Completed", "green", "complete"),
      tag("Checked", "green", "checked"),
      tag("Completed", "green", "review_complete"),
      tag("Cannot start yet", "grey", "cannot_start_yet"),
      tag("Not required", "grey", "not_required"),
    ]);

    return html;
  },
};

// ---------------------------------------------------------------------------
// 2. Same status, different colours
// ---------------------------------------------------------------------------

export const Inconsistencies = {
  name: "Same status, different colours",
  render: () => {
    let html = "";

    html += `<h2 class="govuk-heading-m">Same status shown in different colours</h2>`;
    html += note("These statuses appear in more than one place in BOPS and are shown in different colours depending on where they appear. This may be intentional or may be an inconsistency worth reviewing.");

    html += tableStart(["Status wording", "In task lists", "In consultee tables", "In letter tracking"]);

    html += tableRow([
      "Awaiting response",
      tag("Awaiting response", "light-blue"),
      tag("Awaiting response", "yellow"),
      "—",
    ], true);

    html += tableRow([
      "Not consulted",
      tag("Not consulted", "blue"),
      tag("Not consulted", "grey"),
      "—",
    ], true);

    html += tableRow([
      "Not started",
      tag("Not started", "blue"),
      "—",
      "—",
    ]);
    html += `<tr class="govuk-table__row" style="background:#fef7f1;">
      <td class="govuk-table__cell">Not started (enforcement)</td>
      <td class="govuk-table__cell">—</td>
      <td class="govuk-table__cell">—</td>
      <td class="govuk-table__cell">${tag("Not started", "orange")}</td>
    </tr>`;

    html += tableRow([
      "Failed / Delivery failed",
      tag("Failed", "red"),
      tag("Delivery failed", "red"),
      "—",
    ], true);

    html += tableEnd();

    html += flagBox("The biggest one to review: <strong>Awaiting response</strong> is light blue in task lists but yellow in consultee tables. A user seeing both on the same screen could find this confusing.");

    return html;
  },
};

// ---------------------------------------------------------------------------
// 3. Same wording, different meaning
// ---------------------------------------------------------------------------

export const WordingReview = {
  name: "Wording review",
  render: () => {
    let html = "";

    html += `<h2 class="govuk-heading-m">Wording review</h2>`;
    html += note("All the status wording used across BOPS, grouped to make it easier to spot where wording could be clearer or more consistent.");

    // Completion-related
    html += heading("Completion wording");
    html += note("Different words are used to say something is done.");
    html += tableStart(["Tag", "Where it's used", "Worth reviewing?"]);
    html += tableRow([tag("Completed", "green", "complete"), "Task completion in task lists", ""]);
    html += tableRow([tag("Completed", "green", "review_complete"), "Review completion — same label as above but different status key", flagBox("Same word for two different things")]);
    html += tableRow([tag("Checked", "green", "checked"), "Validation checks", ""]);
    html += tableRow([tag("Valid", "green"), "Validation outcome", ""]);
    html += tableEnd();

    // Approval-related
    html += heading("Approval and acceptance wording");
    html += tableStart(["Tag", "Where it's used"]);
    html += tableRow([tag("Accepted", "green"), "Consultee response (was 'Approved' — updated to match BOPS)"]);
    html += tableRow([tag("Auto accepted", "green"), "Automatic consultee acceptance"]);
    html += tableRow([tag("No objection", "green"), "Consultee response — means the same as 'Accepted'"]);
    html += tableRow([tag("Supportive", "green"), "Neighbour response"]);
    html += tableRow([tag("Supported", "green"), "Pre-application advice"]);
    html += tableRow([tag("Complies", "green"), "Policy compliance"]);
    html += tableEnd();

    // Decision-related
    html += heading("Decision wording");
    html += note("BOPS uses action language for decisions — 'To grant' and 'To refuse' rather than 'Granted' and 'Refused'.");
    html += tableStart(["Tag", "Where it's used"]);
    html += tableRow([tag("To grant", "green"), "Recommendation to grant"]);
    html += tableRow([tag("To grant with Legal agreement", "green"), "Recommendation with legal agreement"]);
    html += tableRow([tag("To refuse", "red"), "Recommendation to refuse"]);
    html += tableRow([tag("To refuse with Legal agreement", "red"), "Recommendation with legal agreement"]);
    html += tableEnd();

    // Waiting-related
    html += heading("Waiting and progress wording");
    html += note("Several different ways of saying 'waiting' or 'in progress'.");
    html += tableStart(["Tag", "Where it's used", "Worth reviewing?"]);
    html += tableRow([tag("In progress", "light-blue"), "Tasks being worked on", ""]);
    html += tableRow([tag("In assessment", "light-blue"), "Application being assessed", ""]);
    html += tableRow([tag("Awaiting response", "light-blue"), "Task lists — waiting for a response", ""]);
    html += tableRow([tag("Awaiting response", "yellow"), "Consultee tables — waiting for a response", flagBox("Same wording, different colour")]);
    html += tableRow([tag("Awaiting changes", "yellow"), "Waiting for applicant changes", ""]);
    html += tableRow([tag("Awaiting evidence", "yellow"), "Waiting for evidence", ""]);
    html += tableRow([tag("Awaiting publication", "yellow"), "Waiting for press notice publication", ""]);
    html += tableRow([tag("Awaiting determination", "purple"), "Application ready for decision", ""]);
    html += tableRow([tag("To be determined", "light-blue"), "Consultation outcome not yet known", ""]);
    html += tableRow([tag("Waiting", "yellow"), "Publish determination", ""]);
    html += tableRow([tag("Pending", "yellow"), "Validation request not yet sent", ""]);
    html += tableRow([tag("Not sent yet", "yellow"), "Validation request template", ""]);
    html += tableEnd();

    // Negative-related
    html += heading("Negative and failure wording");
    html += tableStart(["Tag", "Where it's used"]);
    html += tableRow([tag("Objection", "red"), "Neighbour or consultee objection"]);
    html += tableRow([tag("Rejected", "red"), "Letter rejected by postal service"]);
    html += tableRow([tag("Failed", "red"), "General failure"]);
    html += tableRow([tag("Delivery failed", "red"), "Consultee email delivery failure"]);
    html += tableRow([tag("Technical failure", "red"), "Letter technical failure"]);
    html += tableRow([tag("Permanent failure", "red"), "Letter permanent failure"]);
    html += tableRow([tag("Cancelled", "red"), "Cancelled"]);
    html += tableRow([tag("Invalid", "red"), "Validation failed"]);
    html += tableRow([tag("Invalidated", "red"), "Application invalidated"]);
    html += tableRow([tag("Does not comply", "red"), "Policy non-compliance"]);
    html += tableRow([tag("Removed", "red"), "Item removed"]);
    html += tableEnd();

    return html;
  },
};

// ---------------------------------------------------------------------------
// 4. Tags by where they appear
// ---------------------------------------------------------------------------

export const TagsByContext = {
  name: "Tags by where they appear",
  render: () => {
    let html = "";

    html += `<h2 class="govuk-heading-m">Tags grouped by where they appear in BOPS</h2>`;

    // Task lists
    html += heading("Task lists (all workflow stages)");
    html += note("These are the tags you see next to each task in the sidebar.");
    html += tagRow([
      tag("Not started", "blue"),
      tag("In progress", "light-blue"),
      tag("Completed", "green", "complete"),
      tag("Cannot start yet", "grey", "cannot_start_yet"),
      tag("To be reviewed", "yellow"),
      tag("Updated", "yellow"),
      tag("Not required", "grey", "not_required"),
      tag("Optional", "grey"),
      tag("Checked", "green", "checked"),
    ]);

    // Consultee tables
    html += heading("Consultee tables");
    html += note("Tags shown next to each consultee's name in the consultation stage.");
    html += tagRow([
      tag("Not consulted", "grey"),
      tag("Not required", "grey"),
      tag("Sending", "grey"),
      tag("Delivery failed", "red"),
      tag("Awaiting response", "yellow"),
      tag("No objection", "green"),
      tag("Amendments needed", "yellow"),
      tag("Objection", "red"),
    ]);

    // Consultee responses
    html += heading("Consultee response publication");
    html += tagRow([
      tag("Published", "green"),
      tag("Private", "grey"),
    ]);

    // Neighbour responses
    html += heading("Neighbour responses");
    html += tagRow([
      tag("Supportive", "green"),
      tag("Neutral", "yellow"),
      tag("Objection", "red"),
      tag("No response", "blue"),
    ]);

    // Letter tracking
    html += heading("Letter tracking");
    html += note("The lifecycle of a neighbour notification letter.");
    html += tagRow([
      tag("New", "blue"),
      tag("Submitted", "yellow"),
      tag("Printing", "purple"),
      tag("Posted", "light-blue"),
    ]);
    html += note("Letter failures:");
    html += tagRow([
      tag("Technical failure", "red"),
      tag("Permanent failure", "red"),
      tag("Rejected", "red"),
      tag("Cancelled", "red"),
    ]);

    // Application status
    html += heading("Application status (header bar and list)");
    html += note("The overall status shown at the top of every application.");
    html += tagRow([
      tag("Not started", "blue"),
      tag("In assessment", "light-blue"),
      tag("Awaiting determination", "purple"),
      tag("Corrections requested", "yellow"),
      tag("Invalidated", "red"),
    ]);
    html += note("After a decision is made:");
    html += tagRow([
      tag("Granted", "green"),
      tag("Refused", "red"),
    ]);

    // Days remaining
    html += heading("Days remaining");
    html += note("The colour changes as the deadline gets closer.");
    html += tagRow([
      tag("28 days received", "orange"),
      tag("15 days left", "green"),
      tag("8 days left", "yellow"),
      tag("3 days left", "red"),
    ]);

    // Pre-app advice
    html += heading("Pre-application advice");
    html += tagRow([
      tag("Complies", "green"),
      tag("Needs Changes", "yellow"),
      tag("Does not comply", "red"),
    ]);

    // Validation requests
    html += heading("Validation requests");
    html += tagRow([
      tag("Not sent yet", "yellow"),
      tag("Sent", "light-blue"),
      tag("Overdue", "red"),
      `<strong class="govuk-tag">Responded</strong>`,
    ]);

    // Enforcement
    html += heading("Enforcement cases");
    html += note("Enforcement uses orange to distinguish itself from planning applications.");
    html += tagRow([
      tag("Not started", "orange"),
      tag("Under investigation", "orange"),
      tag("Closed", "orange"),
      tag("28 days received", "orange"),
      tag("Urgent", "red"),
    ]);

    // Application types
    html += heading("Application type configuration");
    html += tagRow([
      tag("Active", "green"),
      tag("Inactive", "grey"),
      tag("Retired", "red"),
      tag("Deprecated", "yellow"),
    ]);

    // Document tags
    html += heading("Document type labels");
    html += tagRow([
      tag("Floor plan", "turquoise"),
      tag("Site plan", "turquoise"),
      tag("Elevation", "turquoise"),
      tag("Photograph", "turquoise"),
    ]);

    // Constraints
    html += heading("Constraint labels");
    html += tagRow([
      tag("Conservation area", "grey"),
      tag("Listed building", "grey"),
      tag("Flood zone", "grey"),
    ]);

    return html;
  },
};

// ---------------------------------------------------------------------------
// 5. Flags and things to review
// ---------------------------------------------------------------------------

export const FlagsToReview = {
  name: "Flags and things to review",
  render: () => {
    let html = "";

    html += `<h2 class="govuk-heading-m">Things worth reviewing</h2>`;
    html += note("Issues spotted during the audit that the design team may want to discuss.");

    // 1. Colour conflicts
    html += `<h3 class="govuk-heading-s" style="margin-top:24px;">1. Same status, different colours</h3>`;
    html += `<p class="govuk-body">"Awaiting response" is <strong>light blue</strong> in task lists but <strong>yellow</strong> in consultee tables. Should it be the same colour everywhere?</p>`;
    html += `<div style="display:flex;gap:24px;align-items:center;margin-bottom:16px;">
      <span class="govuk-body" style="margin-bottom:0;">Task lists:</span> ${tag("Awaiting response", "light-blue")}
      <span class="govuk-body" style="margin-bottom:0;">Consultee tables:</span> ${tag("Awaiting response", "yellow")}
    </div>`;

    html += `<p class="govuk-body">"Not consulted" is <strong>blue</strong> in task lists but <strong>grey</strong> in consultee tables.</p>`;
    html += `<div style="display:flex;gap:24px;align-items:center;margin-bottom:24px;">
      <span class="govuk-body" style="margin-bottom:0;">Task lists:</span> ${tag("Not consulted", "blue")}
      <span class="govuk-body" style="margin-bottom:0;">Consultee tables:</span> ${tag("Not consulted", "grey")}
    </div>`;

    // 2. Transparent tags
    html += `<h3 class="govuk-heading-s">2. Completed tags have no colour</h3>`;
    html += `<p class="govuk-body">"Completed", "Checked", and "Cannot start yet" have transparent backgrounds, so they don't look like tags at all. Is this intentional?</p>`;
    html += `<div style="display:flex;gap:16px;align-items:center;margin-bottom:8px;">
      <span class="govuk-body" style="margin-bottom:0;">What it looks like:</span> ${tag("Completed", "green", "complete")} ${tag("Checked", "green", "checked")} ${tag("Cannot start yet", "grey", "cannot_start_yet")}
    </div>`;
    html += `<div style="display:flex;gap:16px;align-items:center;margin-bottom:24px;">
      <span class="govuk-body" style="margin-bottom:0;">If it were green:</span> ${tag("Completed", "green")} ${tag("Checked", "green")}
    </div>`;

    // 3. Duplicate labels
    html += `<h3 class="govuk-heading-s">3. "Completed" is used for two different things</h3>`;
    html += `<p class="govuk-body">Both "complete" (task finished) and "review_complete" (review finished) display as "Completed". If they appear near each other, this could be confusing.</p>`;
    html += `<div style="display:flex;gap:16px;align-items:center;margin-bottom:24px;">
      <span class="govuk-body" style="margin-bottom:0;">Task completed:</span> ${tag("Completed", "green", "complete")}
      <span class="govuk-body" style="margin-bottom:0;">Review completed:</span> ${tag("Completed", "green", "review_complete")}
    </div>`;

    // 4. Accepted vs No objection
    html += `<h3 class="govuk-heading-s">4. "Accepted" and "No objection" mean the same thing</h3>`;
    html += `<p class="govuk-body">When a consultee responds positively, their response is tagged "Accepted" but their overall status shows "No objection". Both are green. Could one label be used consistently?</p>`;
    html += `<div style="display:flex;gap:16px;align-items:center;margin-bottom:24px;">
      <span class="govuk-body" style="margin-bottom:0;">Response:</span> ${tag("Accepted", "green")}
      <span class="govuk-body" style="margin-bottom:0;">Overall status:</span> ${tag("No objection", "green")}
    </div>`;

    // 5. Decision language
    html += `<h3 class="govuk-heading-s">5. Decision labels use action language</h3>`;
    html += `<p class="govuk-body">BOPS says "To grant" and "To refuse" (describing what's about to happen) rather than "Granted" and "Refused" (describing what has happened). This is correct for recommendations, but worth checking it reads clearly to all users.</p>`;
    html += `<div style="display:flex;gap:16px;align-items:center;margin-bottom:24px;">
      ${tag("To grant", "green")} ${tag("To refuse", "red")}
    </div>`;

    // 6. Many ways to say waiting
    html += `<h3 class="govuk-heading-s">6. Many ways of saying "waiting"</h3>`;
    html += `<p class="govuk-body">There are several tags that all mean some form of "waiting for something". Could any of these be consolidated?</p>`;
    html += tagRow([
      tag("Awaiting response", "light-blue"),
      tag("Awaiting changes", "yellow"),
      tag("Awaiting evidence", "yellow"),
      tag("Awaiting publication", "yellow"),
      tag("Awaiting determination", "purple"),
      tag("Waiting", "yellow"),
      tag("Pending", "yellow"),
      tag("Not sent yet", "yellow"),
      tag("To be determined", "light-blue"),
    ]);

    // 7. Enforcement all orange
    html += `<h3 class="govuk-heading-s">7. Enforcement statuses are all orange</h3>`;
    html += `<p class="govuk-body">"Not started", "Under investigation", and "Closed" all use the same orange colour, which means colour alone doesn't help distinguish between them.</p>`;
    html += tagRow([
      tag("Not started", "orange"),
      tag("Under investigation", "orange"),
      tag("Closed", "orange"),
    ]);

    return html;
  },
};
