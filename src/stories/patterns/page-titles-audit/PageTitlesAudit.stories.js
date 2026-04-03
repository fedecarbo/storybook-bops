/**
 * Page Titles and Descriptions Audit — every task page title and instruction
 * description used in BOPS, extracted from the Rails codebase.
 * Audited 2 April 2026.
 */

export default {
  title: "Patterns/Page Titles Audit",
  parameters: { layout: "padded" },
  decorators: [
    (story) =>
      `<div style="max-width: 960px; margin: 0 auto; padding: 20px;">${story()}</div>`,
  ],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function heading(text) {
  return `<h3 class="govuk-heading-s" style="margin-bottom:8px;">${text}</h3>`;
}

function headingM(text) {
  return `<h2 class="govuk-heading-m" style="margin-top:32px;">${text}</h2>`;
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

function badge(text, colour) {
  const colours = {
    blue: "#1d70b8",
    green: "#00703c",
    grey: "#505a5f",
    purple: "#4c2c92",
    orange: "#f47738",
    red: "#d4351c",
  };
  const bg = colours[colour] || colours.grey;
  return `<strong class="govuk-tag" style="background:${bg};margin-right:4px;">${text}</strong>`;
}

function desc(text) {
  if (!text) {
    return `<span style="color:#b1b4b6;font-style:italic;">No description</span>`;
  }
  return `<span style="color:#505a5f;">${text}</span>`;
}

function stageHeader(stageName, sectionName) {
  let html = `<h3 class="govuk-heading-s" style="margin-top:32px;border-bottom:3px solid #1d70b8;padding-bottom:8px;">${stageName}</h3>`;
  if (sectionName && sectionName !== stageName) {
    html += `<p class="govuk-body-s" style="color:#505a5f;margin-bottom:8px;"><strong>Section:</strong> ${sectionName}</p>`;
  }
  return html;
}

function workflowBadges(workflows) {
  const map = {
    PP: "blue",
    PA: "blue",
    LC: "blue",
    O: "blue",
    Pre: "purple",
    Enf: "orange",
  };
  return workflows.map((w) => badge(w, map[w] || "grey")).join("");
}

// ---------------------------------------------------------------------------
// Workflow abbreviation key
// ---------------------------------------------------------------------------

function workflowKey() {
  return `<div style="margin-bottom:24px;padding:16px 20px;background:#f3f2f1;border-left:4px solid #505a5f;">
    <p class="govuk-body-s" style="margin-bottom:8px;"><strong>Workflow abbreviations</strong></p>
    <p class="govuk-body" style="margin-bottom:0;">
      ${badge("PP", "blue")} Planning Permission &nbsp;&nbsp;
      ${badge("PA", "blue")} Prior Approval &nbsp;&nbsp;
      ${badge("LC", "blue")} Lawfulness Certificate &nbsp;&nbsp;
      ${badge("O", "blue")} Other &nbsp;&nbsp;
      ${badge("Pre", "purple")} Pre-application &nbsp;&nbsp;
      ${badge("Enf", "orange")} Enforcement
    </p>
  </div>`;
}

// ---------------------------------------------------------------------------
// 1. All titles by workflow
// ---------------------------------------------------------------------------

export const AllTitlesByWorkflow = {
  name: "All titles and descriptions by stage",
  render: () => {
    let html = "";

    html += `<h2 class="govuk-heading-m">Every task title and description in BOPS, by stage</h2>`;
    html += note(
      "Each row shows the task title (the h1 heading officers see), the instruction description below it (if any), and which workflows include this task."
    );
    html += workflowKey();

    // -----------------------------------------------------------------------
    // VALIDATION
    // -----------------------------------------------------------------------
    html += `<h2 class="govuk-heading-m" style="margin-top:40px;border-bottom:4px solid #1d70b8;padding-bottom:8px;">Stage 1: Validation</h2>`;
    html += note(
      'Stage name: "Check and validate" in all workflows except Enforcement.'
    );

    // -- Documents section --
    html += stageHeader(
      "Check, tag, and confirm documents",
      "Check, tag, and confirm documents"
    );
    html += tableStart([
      "Task title",
      "Instruction description",
      "Workflows",
    ]);
    html += tableRow([
      "<strong>Review documents</strong>",
      desc('h2: "Submitted documents"'),
      workflowBadges(["PP", "PA", "LC", "O", "Pre"]),
    ]);
    html += tableRow([
      "<strong>Check and request documents</strong>",
      desc(null),
      workflowBadges(["PP", "PA", "LC", "O", "Pre"]),
    ]);
    html += tableEnd();

    // -- Check application details section --
    html += stageHeader(
      "Check application details",
      "Check application details"
    );
    html += tableStart([
      "Task title",
      "Instruction description",
      "Workflows",
    ]);
    html += tableRow([
      '<strong>Draw red line boundary</strong> <span style="color:#b1b4b6;">(hidden)</span>',
      desc(
        'h3: "Red line site boundary on submission" and "Draw the red line site boundary"'
      ),
      workflowBadges(["PP", "PA", "LC", "O", "Pre"]),
    ]);
    html += tableRow([
      "<strong>Check red line boundary</strong>",
      desc(
        '"This digital red line boundary was submitted by the applicant."'
      ),
      workflowBadges(["PP", "PA", "LC", "O", "Pre"]),
    ]);
    html += tableRow([
      "<strong>Check constraints</strong>",
      desc(
        'h2: "Add, remove and save constraints" — "Check the constraints for this application. Add any constraints that are relevant. When all relevant constraints have been added, save and mark as complete."'
      ),
      workflowBadges(["PP", "PA", "LC", "O", "Pre"]),
    ]);
    html += tableRow([
      "<strong>Check description</strong>",
      desc(
        'Conditional h2: "Description change request" (only shown when a request exists)'
      ),
      workflowBadges(["PP", "PA", "LC", "O", "Pre"]),
    ]);
    html += tableRow([
      "<strong>Check fee</strong>",
      desc(
        '"This fee was calculated based on the services requested by the applicant."'
      ),
      workflowBadges(["PP", "PA", "LC", "O", "Pre"]),
    ]);
    html += tableRow([
      "<strong>Add reporting details</strong>",
      desc(null),
      workflowBadges(["PP", "PA", "LC", "O"]),
    ]);
    html += tableRow([
      "<strong>Check legislative requirements</strong>",
      desc(null),
      workflowBadges(["PA", "LC"]),
    ]);
    html += tableRow([
      "<strong>Check requested services</strong>",
      desc(null),
      workflowBadges(["Pre"]),
    ]);
    html += tableEnd();

    // -- Confirm application requirements section --
    html += stageHeader(
      "Confirm application requirements",
      "Confirm application requirements"
    );
    html += tableStart([
      "Task title",
      "Instruction description",
      "Workflows",
    ]);
    html += tableRow([
      "<strong>Confirm Community Infrastructure Levy (CIL)</strong>",
      desc("Dynamic text about CIL liability based on PlanX data"),
      workflowBadges(["PP", "PA", "LC", "O"]),
    ]);
    html += tableRow([
      "<strong>Check Environment Impact Assessment</strong>",
      desc(null),
      workflowBadges(["PP", "PA", "LC", "O"]),
    ]);
    html += tableRow([
      "<strong>Check ownership certificate</strong>",
      desc(
        'Conditional h2: "Ownership certificate change request sent" or "Ownership certificate change request created"'
      ),
      workflowBadges(["PP", "O"]),
    ]);
    html += tableEnd();

    // -- Other validation issues --
    html += stageHeader("Other validation issues", "Other validation issues");
    html += tableStart([
      "Task title",
      "Instruction description",
      "Workflows",
    ]);
    html += tableRow([
      "<strong>Other validation requests</strong>",
      desc(
        'Empty state: "No other validation requests have been added"'
      ),
      workflowBadges(["PP", "PA", "LC", "O", "Pre"]),
    ]);
    html += tableEnd();

    // -- Review section --
    html += stageHeader("Review", "Review");
    html += tableStart([
      "Task title",
      "Instruction description",
      "Workflows",
    ]);
    html += tableRow([
      '<strong>Review validation requests</strong> <span style="color:#b1b4b6;">(status hidden)</span>',
      desc(
        'h2: "Validation requests" — conditional instructions about sending validation requests and marking as valid'
      ),
      workflowBadges(["PP", "PA", "LC", "O", "Pre"]),
    ]);
    html += tableRow([
      "<strong>Send validation decision</strong>",
      desc(
        "Multiple conditional sections about valid/invalid state, unresolved requests, and applicant notifications"
      ),
      workflowBadges(["PP", "PA", "LC", "O", "Pre"]),
    ]);
    html += tableEnd();

    // -----------------------------------------------------------------------
    // CONSULTATION
    // -----------------------------------------------------------------------
    html += `<h2 class="govuk-heading-m" style="margin-top:40px;border-bottom:4px solid #1d70b8;padding-bottom:8px;">Stage 2: Consultation</h2>`;

    html += tableStart([
      "Task title",
      "Instruction description",
      "Workflows",
    ]);
    html += tableRow(
      [
        '<strong>Consultees, neighbours and publicity</strong> <span style="color:#505a5f;">(stage title, no subtasks in YAML)</span>',
        desc(null),
        workflowBadges(["PP", "PA", "LC", "O"]),
      ]
    );
    html += tableEnd();

    html += heading("Pre-application consultation tasks");
    html += note(
      'Pre-applications use the stage name "Consultees" (shorter) and define subtasks.'
    );
    html += tableStart([
      "Task title",
      "Instruction description",
      "Workflows",
    ]);
    html += tableRow([
      "<strong>Determine consultation requirement</strong>",
      desc(
        'Radio: "Is consultation required?" — hint: "Select \'Yes\' to unlock consultation tasks or \'No\' to skip them for this case."'
      ),
      workflowBadges(["Pre"]),
    ]);
    html += tableRow([
      '<strong>Add and assign consultees</strong> <span style="color:#b1b4b6;">(hidden)</span>',
      desc(
        'h2: "Select constraints that require consultation" — "Review the planning constraints and select which ones require consultation." h2: "Assign consultees to each constraint"'
      ),
      workflowBadges(["Pre"]),
    ]);
    html += tableRow([
      '<strong>Send emails to consultees</strong> <span style="color:#b1b4b6;">(hidden)</span>',
      desc(
        'Structured steps — "Step 1: Select the consultees to consult", "Step 2: [email component]", "Step 3: Set response period"'
      ),
      workflowBadges(["Pre"]),
    ]);
    html += tableRow([
      '<strong>View consultee responses</strong> <span style="color:#b1b4b6;">(hidden)</span>',
      desc(
        'Summary panel with response statistics. Empty state: "No consultees have been added yet."'
      ),
      workflowBadges(["Pre"]),
    ]);
    html += tableEnd();

    // -----------------------------------------------------------------------
    // ASSESSMENT
    // -----------------------------------------------------------------------
    html += `<h2 class="govuk-heading-m" style="margin-top:40px;border-bottom:4px solid #1d70b8;padding-bottom:8px;">Stage 3: Assessment</h2>`;
    html += note('Stage name: "Check and assess" in all non-enforcement workflows.');

    // -- Check application section --
    html += stageHeader("Check application", "Check application");
    html += tableStart([
      "Task title",
      "Instruction description",
      "Workflows",
    ]);
    html += tableRow(
      [
        "<strong>Check ownership certificate</strong>",
        desc(
          '"If the ownership certificate is incorrect, send a request to the applicant for more information."'
        ),
        workflowBadges(["PP", "O"]),
      ],
      true
    );
    html += tableRow([
      "<strong>Check consultees</strong>",
      desc(
        'Conditional: "Consultation has been marked as not required" or "Consultation hasn\'t been started yet"'
      ),
      workflowBadges(["PP", "PA", "O", "Pre"]),
    ]);
    html += tableRow([
      "<strong>Check site history</strong>",
      desc(
        'h2: "Summary of the relevant historical applications" — "Past applications for this site or relevant nearby locations:"'
      ),
      workflowBadges(["PP", "PA", "LC", "O", "Pre"]),
    ]);
    html += tableRow([
      "<strong>Permitted development rights</strong>",
      desc(null),
      workflowBadges(["PA", "LC"]),
    ]);
    html += tableRow([
      "<strong>Check application details</strong>",
      desc(
        "Consistency checklist form — checks description match, plan consistency, proposal consistency, site map correctness"
      ),
      workflowBadges(["Pre"]),
    ]);
    html += tableEnd();

    html += flagBox(
      '<strong>"Check ownership certificate"</strong> appears in both Validation (stage 1) and Assessment (stage 3) for Planning Permission and Other workflows. Same task title at two different stages.'
    );

    // -- Additional services section (Pre-app only) --
    html += stageHeader("Additional services", "Additional services");
    html += note("Pre-application only.");
    html += tableStart([
      "Task title",
      "Instruction description",
      "Workflows",
    ]);
    html += tableRow([
      "<strong>Site visit</strong>",
      desc(null),
      workflowBadges(["Pre"]),
    ]);
    html += tableRow([
      "<strong>Meeting</strong>",
      desc(null),
      workflowBadges(["Pre"]),
    ]);
    html += tableEnd();

    // -- Assessment summaries section --
    html += stageHeader("Assessment summaries", "Assessment summaries");
    html += tableStart([
      "Task title",
      "Instruction description",
      "Workflows",
    ]);
    html += tableRow([
      "<strong>Check publicity</strong>",
      desc('h2: "Check site notice", "Check press notice"'),
      workflowBadges(["PP", "PA", "O"]),
    ]);
    html += tableRow([
      "<strong>Summary of works</strong>",
      desc(
        'h2: "Add summary" — "You can include:" list of works, dimensions, materials, features'
      ),
      workflowBadges(["PP", "PA", "LC", "O"]),
    ]);
    html += tableRow([
      "<strong>Site and surroundings</strong>",
      desc(
        'h2: "Description of the site" — "You can include:" buildings on site, neighbouring buildings, constraints, land uses'
      ),
      workflowBadges(["Pre"]),
    ]);
    html += tableRow([
      "<strong>Planning considerations and advice</strong>",
      desc(null),
      workflowBadges(["Pre"]),
    ]);
    html += tableRow([
      "<strong>Suggest heads of terms</strong>",
      desc(
        '"Heads of terms can be added for pre-applications, but no email will be sent to the applicant."'
      ),
      workflowBadges(["Pre"]),
    ]);
    html += tableRow([
      "<strong>Summary of advice</strong>",
      desc(
        'Form: "Enter summary of planning considerations and advice. This should summarise any changes the applicant needs to make before they make an application."'
      ),
      workflowBadges(["Pre"]),
    ]);
    html += tableEnd();

    // -- Complete assessment section (Pre-app only) --
    html += stageHeader("Complete assessment", "Complete assessment");
    html += note("Pre-application only.");
    html += tableStart([
      "Task title",
      "Instruction description",
      "Workflows",
    ]);
    html += tableRow([
      "<strong>Choose application type</strong>",
      desc(
        'Select: "What application type would the applicant need to apply for next?"'
      ),
      workflowBadges(["Pre"]),
    ]);
    html += tableRow([
      "<strong>Check and add requirements</strong>",
      desc(null),
      workflowBadges(["Pre"]),
    ]);
    html += tableRow([
      "<strong>Review and submit pre-application</strong>",
      desc('Displays compiled "Pre-application report" view'),
      workflowBadges(["Pre"]),
    ]);
    html += tableEnd();

    // -----------------------------------------------------------------------
    // REVIEW
    // -----------------------------------------------------------------------
    html += `<h2 class="govuk-heading-m" style="margin-top:40px;border-bottom:4px solid #1d70b8;padding-bottom:8px;">Stage 4: Review</h2>`;

    html += tableStart([
      "Task title",
      "Instruction description",
      "Workflows",
    ]);
    html += tableRow([
      "<strong>View recommendation</strong>",
      desc(null),
      workflowBadges(["PP", "PA", "LC", "O", "Pre"]),
    ]);
    html += tableRow([
      "<strong>Publish determination</strong>",
      desc(null),
      workflowBadges(["PP", "PA", "LC", "O"]),
    ]);
    html += tableEnd();

    // -----------------------------------------------------------------------
    // ENFORCEMENT
    // -----------------------------------------------------------------------
    html += `<h2 class="govuk-heading-m" style="margin-top:48px;border-bottom:4px solid #f47738;padding-bottom:8px;">Enforcement workflow</h2>`;
    html += note(
      "Enforcement has a completely separate task structure with 6 stages. Uses different naming conventions."
    );

    // -- Check stage --
    html += stageHeader("Check breach report", "Check");
    html += tableStart([
      "Task title",
      "Instruction description",
    ]);
    html += tableRow([
      "<strong>Check report details</strong>",
      desc(
        'h2: "Quick close", "Quick recommendation", "Is this case urgent?", "Check description" — each with contextual instructions'
      ),
    ]);
    html += tableRow([
      '<strong>Check description</strong> <span style="color:#b1b4b6;">(optional)</span>',
      desc(
        'h3: "Existing description" in inset box, form: "Enter an amended description"'
      ),
    ]);
    html += tableRow([
      "<strong>Check site location</strong>",
      desc(null),
    ]);
    html += tableRow([
      "<strong>Review constraints</strong>",
      desc(null),
    ]);
    html += tableRow([
      "<strong>Review site history</strong>",
      desc(null),
    ]);
    html += tableRow([
      "<strong>Review documents</strong>",
      desc(null),
    ]);
    html += tableRow([
      "<strong>Start investigation</strong>",
      desc(
        '"When starting an investigation, BOPS will inform the complainant."'
      ),
    ]);
    html += tableEnd();

    // -- Investigate stage --
    html += stageHeader("Investigate and decide", "Investigate");

    html += heading("Update site and owner details");
    html += tableStart([
      "Task title",
      "Instruction description",
    ]);
    html += tableRow([
      "<strong>Update site location</strong>",
      desc(null),
    ]);
    html += tableRow([
      "<strong>Add site owners and interested parties</strong>",
      desc(null),
    ]);
    html += tableRow([
      "<strong>Review site history</strong>",
      desc(null),
    ]);
    html += tableRow([
      "<strong>Review constraints</strong>",
      desc(null),
    ]);
    html += tableEnd();

    html += heading("Investigation actions");
    html += tableStart([
      "Task title",
      "Instruction description",
    ]);
    html += tableRow([
      "<strong>Add investigation action</strong>",
      desc(null),
    ]);
    html += tableRow([
      "<strong>Add site visit</strong>",
      desc(null),
    ]);
    html += tableEnd();

    html += heading("Assess");
    html += tableStart([
      "Task title",
      "Instruction description",
    ]);
    html += tableRow([
      "<strong>Add legislation for assessment</strong>",
      desc(null),
    ]);
    html += tableRow([
      "<strong>Assess against policy</strong>",
      desc(null),
    ]);
    html += tableEnd();

    html += heading("Summarise and decide");
    html += tableStart([
      "Task title",
      "Instruction description",
    ]);
    html += tableRow([
      "<strong>Summarise investigation and make recommendation</strong>",
      desc(null),
    ]);
    html += tableRow([
      "<strong>Create enforcement notice</strong>",
      desc(null),
    ]);
    html += tableRow([
      "<strong>Submit recommendation</strong>",
      desc(null),
    ]);
    html += tableEnd();

    // -- Review stage --
    html += stageHeader("Review recommendation", "Review");
    html += tableStart([
      "Task title",
      "Instruction description",
    ]);
    html += tableRow([
      "<strong>Review recommendation</strong>",
      desc(null),
    ]);
    html += tableEnd();

    // -- Serve and monitor stage --
    html += stageHeader(
      "Serve notice and monitor compliance",
      "Serve and monitor"
    );
    html += tableStart([
      "Task title",
      "Instruction description",
    ]);
    html += tableRow([
      "<strong>Serve notice</strong>",
      desc(null),
    ]);
    html += tableRow([
      "<strong>Add evidence of serving a notice</strong>",
      desc(null),
    ]);
    html += tableRow([
      "<strong>Required actions</strong>",
      desc(null),
    ]);
    html += tableEnd();

    // -- Appeal stage --
    html += stageHeader("Process an appeal", "Appeal");
    html += tableStart([
      "Task title",
      "Instruction description",
    ]);
    html += tableRow([
      "<strong>Process an appeal</strong>",
      desc(null),
    ]);
    html += tableEnd();

    // -- Close stage --
    html += stageHeader("Close case", "Close");
    html += tableStart([
      "Task title",
      "Instruction description",
    ]);
    html += tableRow([
      '<strong>Close case</strong> <span style="color:#b1b4b6;">(hidden)</span>',
      desc(null),
    ]);
    html += tableEnd();

    return html;
  },
};

// ---------------------------------------------------------------------------
// 2. Naming patterns
// ---------------------------------------------------------------------------

export const NamingPatterns = {
  name: "Naming patterns",
  render: () => {
    let html = "";

    html += `<h2 class="govuk-heading-m">Task titles grouped by naming pattern</h2>`;
    html += note(
      'Most task titles follow a "verb + object" pattern. This view groups them by their leading verb to show whether similar actions use consistent wording.'
    );

    // -- Check X --
    html += `<h3 class="govuk-heading-s" style="margin-top:32px;border-bottom:3px solid #1d70b8;padding-bottom:8px;">"Check [thing]" &mdash; 14 tasks</h3>`;
    html += note(
      "The most common pattern. Used for verification and review tasks across Validation and Assessment."
    );
    html += tableStart(["Task title", "Stage", "Notes"]);
    html += tableRow([
      "Check and request documents",
      "Validation",
      "",
    ]);
    html += tableRow([
      "Check red line boundary",
      "Validation",
      "",
    ]);
    html += tableRow([
      "Check constraints",
      "Validation",
      "Has good instruction description",
    ]);
    html += tableRow([
      "Check description",
      "Validation / Enforcement",
      "Appears in both with different contexts",
    ]);
    html += tableRow([
      "Check fee",
      "Validation",
      "",
    ]);
    html += tableRow([
      "Check legislative requirements",
      "Validation",
      "PA and LC only",
    ]);
    html += tableRow([
      "Check requested services",
      "Validation",
      "Pre-app only",
    ]);
    html += tableRow([
      "Check Environment Impact Assessment",
      "Validation",
      "",
    ]);
    html += tableRow([
      "Check ownership certificate",
      "Validation + Assessment",
      "Same title at two different stages",
    ]);
    html += tableRow([
      "Check consultees",
      "Assessment",
      "",
    ]);
    html += tableRow([
      "Check site history",
      "Assessment",
      "",
    ]);
    html += tableRow([
      "Check publicity",
      "Assessment",
      "",
    ]);
    html += tableRow([
      "Check application details",
      "Assessment",
      "Pre-app only; also a section name in Validation",
    ]);
    html += tableRow([
      "Check and add requirements",
      "Assessment",
      "Pre-app only; compound verb",
    ]);
    html += tableEnd();

    // -- Review X --
    html += `<h3 class="govuk-heading-s" style="margin-top:32px;border-bottom:3px solid #1d70b8;padding-bottom:8px;">"Review [thing]" &mdash; 6 tasks</h3>`;
    html += note(
      'Used in Validation review section and throughout Enforcement. Enforcement uses "Review" where other workflows use "Check".'
    );
    html += tableStart(["Task title", "Stage", "Notes"]);
    html += tableRow([
      "Review documents",
      "Validation / Enforcement",
      'Same verb, different contexts',
    ]);
    html += tableRow([
      "Review validation requests",
      "Validation",
      "",
    ]);
    html += tableRow([
      "Review constraints",
      "Enforcement",
      'Other workflows call this "Check constraints"',
    ]);
    html += tableRow([
      "Review site history",
      "Enforcement",
      'Other workflows call this "Check site history"',
    ]);
    html += tableRow([
      "Review recommendation",
      "Enforcement",
      "",
    ]);
    html += tableRow([
      "Review and submit pre-application",
      "Assessment",
      "Pre-app only; compound verb",
    ]);
    html += tableEnd();

    html += flagBox(
      'Enforcement uses <strong>"Review constraints"</strong> and <strong>"Review site history"</strong> where all other workflows use <strong>"Check constraints"</strong> and <strong>"Check site history"</strong>. Should these be consistent?'
    );

    // -- Add X --
    html += `<h3 class="govuk-heading-s" style="margin-top:32px;border-bottom:3px solid #1d70b8;padding-bottom:8px;">"Add [thing]" &mdash; 6 tasks</h3>`;
    html += note("Used for tasks where officers are adding new information.");
    html += tableStart(["Task title", "Stage", "Notes"]);
    html += tableRow([
      "Add reporting details",
      "Validation",
      "",
    ]);
    html += tableRow([
      "Add and assign consultees",
      "Consultation",
      "Pre-app only; compound verb",
    ]);
    html += tableRow([
      "Add site owners and interested parties",
      "Enforcement",
      "Long title",
    ]);
    html += tableRow([
      "Add investigation action",
      "Enforcement",
      "",
    ]);
    html += tableRow([
      "Add site visit",
      "Enforcement",
      "",
    ]);
    html += tableRow([
      "Add legislation for assessment",
      "Enforcement",
      "",
    ]);
    html += tableRow([
      "Add evidence of serving a notice",
      "Enforcement",
      "Long title",
    ]);
    html += tableEnd();

    // -- Confirm / Send / Determine / Submit --
    html += `<h3 class="govuk-heading-s" style="margin-top:32px;border-bottom:3px solid #1d70b8;padding-bottom:8px;">Action verbs &mdash; 7 tasks</h3>`;
    html += note(
      'Tasks using specific action verbs: "Confirm", "Send", "Determine", "Submit", "Publish".'
    );
    html += tableStart(["Task title", "Verb", "Stage"]);
    html += tableRow([
      "Confirm Community Infrastructure Levy (CIL)",
      "Confirm",
      "Validation",
    ]);
    html += tableRow([
      "Send validation decision",
      "Send",
      "Validation",
    ]);
    html += tableRow([
      "Send emails to consultees",
      "Send",
      "Consultation (Pre-app)",
    ]);
    html += tableRow([
      "Determine consultation requirement",
      "Determine",
      "Consultation (Pre-app)",
    ]);
    html += tableRow([
      "Submit recommendation",
      "Submit",
      "Enforcement",
    ]);
    html += tableRow([
      "Publish determination",
      "Publish",
      "Review",
    ]);
    html += tableRow([
      "Start investigation",
      "Start",
      "Enforcement",
    ]);
    html += tableEnd();

    // -- Summary / Summarise --
    html += `<h3 class="govuk-heading-s" style="margin-top:32px;border-bottom:3px solid #1d70b8;padding-bottom:8px;">"Summary" and "Summarise" &mdash; 4 tasks</h3>`;
    html += tableStart(["Task title", "Stage", "Notes"]);
    html += tableRow([
      "Summary of works",
      "Assessment",
      'Noun phrase: "Summary of"',
    ]);
    html += tableRow([
      "Summary of advice",
      "Assessment",
      'Noun phrase: "Summary of" (Pre-app)',
    ]);
    html += tableRow([
      "Summarise investigation and make recommendation",
      "Enforcement",
      "Verb form; very long title",
    ]);
    html += tableRow([
      "Suggest heads of terms",
      "Assessment",
      "Pre-app only",
    ]);
    html += tableEnd();

    // -- Noun phrases (no leading verb) --
    html += `<h3 class="govuk-heading-s" style="margin-top:32px;border-bottom:3px solid #1d70b8;padding-bottom:8px;">Noun phrases (no leading verb) &mdash; 8 tasks</h3>`;
    html += note(
      "These titles don't follow the verb-first pattern. They describe a thing rather than an action."
    );
    html += tableStart(["Task title", "Stage", "Notes"]);
    html += tableRow([
      "Other validation requests",
      "Validation",
      "",
    ]);
    html += tableRow([
      "Permitted development rights",
      "Assessment",
      "PA and LC only",
    ]);
    html += tableRow([
      "Site visit",
      "Assessment",
      "Pre-app only",
    ]);
    html += tableRow([
      "Meeting",
      "Assessment",
      "Pre-app only; very generic",
    ]);
    html += tableRow([
      "Site and surroundings",
      "Assessment",
      "Pre-app only",
    ]);
    html += tableRow([
      "Planning considerations and advice",
      "Assessment",
      "Pre-app only",
    ]);
    html += tableRow([
      "Required actions",
      "Enforcement",
      "",
    ]);
    html += tableRow([
      "Close case",
      "Enforcement",
      "Hidden",
    ]);
    html += tableEnd();

    // -- View X --
    html += `<h3 class="govuk-heading-s" style="margin-top:32px;border-bottom:3px solid #1d70b8;padding-bottom:8px;">"View" and other read-only verbs &mdash; 3 tasks</h3>`;
    html += tableStart(["Task title", "Stage", "Notes"]);
    html += tableRow([
      "View recommendation",
      "Review",
      "All non-enforcement workflows",
    ]);
    html += tableRow([
      "View consultee responses",
      "Consultation",
      "Pre-app only",
    ]);
    html += tableRow([
      "Draw red line boundary",
      "Validation",
      "Hidden; unique verb",
    ]);
    html += tableEnd();

    // -- Compound / special --
    html += `<h3 class="govuk-heading-s" style="margin-top:32px;border-bottom:3px solid #1d70b8;padding-bottom:8px;">Compound titles &mdash; tasks with multiple verbs</h3>`;
    html += note(
      "These titles contain two or more actions joined together."
    );
    html += tableStart(["Task title", "Length"]);
    html += tableRow([
      "Summarise investigation and make recommendation",
      "49 characters",
    ]);
    html += tableRow([
      "Add site owners and interested parties",
      "39 characters",
    ]);
    html += tableRow([
      "Add evidence of serving a notice",
      "32 characters",
    ]);
    html += tableRow([
      "Check and add requirements",
      "27 characters",
    ]);
    html += tableRow([
      "Review and submit pre-application",
      "34 characters",
    ]);
    html += tableRow([
      "Check and request documents",
      "28 characters",
    ]);
    html += tableRow([
      "Add and assign consultees",
      "26 characters",
    ]);
    html += tableEnd();

    return html;
  },
};

// ---------------------------------------------------------------------------
// 3. Shared vs unique titles
// ---------------------------------------------------------------------------

export const SharedVsUnique = {
  name: "Shared vs unique titles",
  render: () => {
    let html = "";

    html += `<h2 class="govuk-heading-m">Which titles are shared across workflows</h2>`;
    html += note(
      "This shows which task titles appear in multiple workflow types and which are unique to one. Tasks shared across many workflows are the most important to get right."
    );
    html += workflowKey();

    // -- Shared across all 5 non-enforcement --
    html += `<h3 class="govuk-heading-s" style="margin-top:32px;border-bottom:3px solid #00703c;padding-bottom:8px;">Shared across all 5 non-enforcement workflows</h3>`;
    html += tableStart(["Task title", "Stage"]);
    html += tableRow(["Review documents", "Validation"]);
    html += tableRow(["Check and request documents", "Validation"]);
    html += tableRow(["Draw red line boundary", "Validation"]);
    html += tableRow(["Check red line boundary", "Validation"]);
    html += tableRow(["Check constraints", "Validation"]);
    html += tableRow(["Check description", "Validation"]);
    html += tableRow(["Check fee", "Validation"]);
    html += tableRow(["Other validation requests", "Validation"]);
    html += tableRow(["Review validation requests", "Validation"]);
    html += tableRow(["Send validation decision", "Validation"]);
    html += tableEnd();

    // -- Shared across PP, PA, LC, O (not Pre-app) --
    html += `<h3 class="govuk-heading-s" style="margin-top:32px;border-bottom:3px solid #1d70b8;padding-bottom:8px;">Shared across PP, PA, LC, O (not Pre-app)</h3>`;
    html += tableStart(["Task title", "Stage"]);
    html += tableRow(["Add reporting details", "Validation"]);
    html += tableRow([
      "Confirm Community Infrastructure Levy (CIL)",
      "Validation",
    ]);
    html += tableRow(["Check Environment Impact Assessment", "Validation"]);
    html += tableRow(["View recommendation", "Review"]);
    html += tableRow(["Publish determination", "Review"]);
    html += tableEnd();

    // -- Shared across some workflows --
    html += `<h3 class="govuk-heading-s" style="margin-top:32px;border-bottom:3px solid #1d70b8;padding-bottom:8px;">Shared across some workflows</h3>`;
    html += tableStart(["Task title", "Workflows", "Notes"]);
    html += tableRow([
      "Check ownership certificate",
      workflowBadges(["PP", "O"]),
      "Appears in both Validation AND Assessment stages",
    ]);
    html += tableRow([
      "Check legislative requirements",
      workflowBadges(["PA", "LC"]),
      "",
    ]);
    html += tableRow([
      "Check consultees",
      workflowBadges(["PP", "PA", "O", "Pre"]),
      "",
    ]);
    html += tableRow([
      "Check site history",
      workflowBadges(["PP", "PA", "LC", "O", "Pre"]),
      "",
    ]);
    html += tableRow([
      "Check publicity",
      workflowBadges(["PP", "PA", "O"]),
      "",
    ]);
    html += tableRow([
      "Summary of works",
      workflowBadges(["PP", "PA", "LC", "O"]),
      "",
    ]);
    html += tableRow([
      "Permitted development rights",
      workflowBadges(["PA", "LC"]),
      "",
    ]);
    html += tableEnd();

    // -- Pre-app unique --
    html += `<h3 class="govuk-heading-s" style="margin-top:32px;border-bottom:3px solid #4c2c92;padding-bottom:8px;">Unique to Pre-application</h3>`;
    html += note(
      "Pre-application has the most unique task titles, reflecting its distinct workflow."
    );
    html += tableStart(["Task title", "Stage"]);
    html += tableRow(["Check requested services", "Validation"]);
    html += tableRow(["Determine consultation requirement", "Consultation"]);
    html += tableRow(["Add and assign consultees", "Consultation"]);
    html += tableRow(["Send emails to consultees", "Consultation"]);
    html += tableRow(["View consultee responses", "Consultation"]);
    html += tableRow(["Check application details", "Assessment"]);
    html += tableRow(["Site visit", "Assessment"]);
    html += tableRow(["Meeting", "Assessment"]);
    html += tableRow(["Site and surroundings", "Assessment"]);
    html += tableRow(["Planning considerations and advice", "Assessment"]);
    html += tableRow(["Suggest heads of terms", "Assessment"]);
    html += tableRow(["Summary of advice", "Assessment"]);
    html += tableRow(["Choose application type", "Assessment"]);
    html += tableRow(["Check and add requirements", "Assessment"]);
    html += tableRow(["Review and submit pre-application", "Assessment"]);
    html += tableEnd();

    // -- Enforcement unique --
    html += `<h3 class="govuk-heading-s" style="margin-top:32px;border-bottom:3px solid #f47738;padding-bottom:8px;">Unique to Enforcement</h3>`;
    html += note(
      "Enforcement has its own task structure. Some tasks mirror other workflows but use different wording."
    );
    html += tableStart(["Task title", "Stage", "Notes"]);
    html += tableRow(["Check report details", "Check", ""]);
    html += tableRow(["Check description", "Check", "Optional; same name as Validation task"]);
    html += tableRow(["Check site location", "Check", ""]);
    html += tableRow([
      "Review constraints",
      "Check / Investigate",
      'Other workflows: "Check constraints"',
    ]);
    html += tableRow([
      "Review site history",
      "Check / Investigate",
      'Other workflows: "Check site history"',
    ]);
    html += tableRow([
      "Review documents",
      "Check",
      "Same name as Validation task but different context",
    ]);
    html += tableRow(["Start investigation", "Check", ""]);
    html += tableRow(["Update site location", "Investigate", ""]);
    html += tableRow([
      "Add site owners and interested parties",
      "Investigate",
      "",
    ]);
    html += tableRow(["Add investigation action", "Investigate", ""]);
    html += tableRow(["Add site visit", "Investigate", ""]);
    html += tableRow(["Add legislation for assessment", "Investigate", ""]);
    html += tableRow(["Assess against policy", "Investigate", ""]);
    html += tableRow([
      "Summarise investigation and make recommendation",
      "Investigate",
      "",
    ]);
    html += tableRow(["Create enforcement notice", "Investigate", ""]);
    html += tableRow(["Submit recommendation", "Investigate", ""]);
    html += tableRow(["Review recommendation", "Review", ""]);
    html += tableRow(["Serve notice", "Serve and monitor", ""]);
    html += tableRow([
      "Add evidence of serving a notice",
      "Serve and monitor",
      "",
    ]);
    html += tableRow(["Required actions", "Serve and monitor", ""]);
    html += tableRow(["Process an appeal", "Appeal", ""]);
    html += tableRow(["Close case", "Close", "Hidden"]);
    html += tableEnd();

    return html;
  },
};

// ---------------------------------------------------------------------------
// 4. Flags and things to review
// ---------------------------------------------------------------------------

export const FlagsToReview = {
  name: "Flags and things to review",
  render: () => {
    let html = "";

    html += `<h2 class="govuk-heading-m">Things worth reviewing</h2>`;
    html += note(
      "Issues spotted during the audit that the design team may want to discuss."
    );

    // 1. Check vs Review
    html += `<h3 class="govuk-heading-s" style="margin-top:24px;">1. Enforcement uses "Review" where other workflows use "Check"</h3>`;
    html += `<p class="govuk-body">The same concept is named differently depending on the workflow type:</p>`;
    html += tableStart([
      "Concept",
      "Planning / Prior approval / etc.",
      "Enforcement",
    ]);
    html += tableRow(
      [
        "Checking constraints",
        "<strong>Check constraints</strong>",
        "<strong>Review constraints</strong>",
      ],
      true
    );
    html += tableRow(
      [
        "Checking site history",
        "<strong>Check site history</strong>",
        "<strong>Review site history</strong>",
      ],
      true
    );
    html += tableEnd();
    html += flagBox(
      "Should these use the same verb? Officers who work on both planning applications and enforcement cases will see different titles for the same action."
    );

    // 2. Check ownership certificate at two stages
    html += `<h3 class="govuk-heading-s" style="margin-top:24px;">2. "Check ownership certificate" appears at two different stages</h3>`;
    html += `<p class="govuk-body">In Planning Permission and Other workflows, this task appears in both <strong>Validation</strong> (stage 1) and <strong>Assessment</strong> (stage 3). The same title is used for two tasks at different points in the workflow.</p>`;
    html += `<p class="govuk-body">Could these be distinguished? For example, "Check ownership certificate" in Validation and "Review ownership certificate" in Assessment?</p>`;

    // 3. Pre-app naming conventions
    html += `<h3 class="govuk-heading-s" style="margin-top:24px;">3. Pre-application uses different naming conventions</h3>`;
    html += `<p class="govuk-body">Most tasks follow a "verb + object" pattern. Pre-application Assessment tasks often use noun phrases instead:</p>`;
    html += tableStart(["Pre-app title", "If it followed the pattern"]);
    html += tableRow(
      [
        "Site and surroundings",
        '"Describe site and surroundings" or "Check site and surroundings"',
      ],
      true
    );
    html += tableRow(
      [
        "Planning considerations and advice",
        '"Add planning considerations and advice"',
      ],
      true
    );
    html += tableRow(
      ["Meeting", '"Record meeting" or "Add meeting notes"'],
      true
    );
    html += tableRow(
      ["Site visit", '"Record site visit" or "Add site visit"'],
      true
    );
    html += tableEnd();
    html += flagBox(
      "This isn't necessarily wrong — these tasks may feel different to officers. But it's worth discussing whether a consistent naming pattern would make the interface easier to learn."
    );

    // 4. Stage name inconsistency
    html += `<h3 class="govuk-heading-s" style="margin-top:24px;">4. Consultation stage names differ</h3>`;
    html += `<p class="govuk-body">The stage title varies by workflow type:</p>`;
    html += `<ul class="govuk-list govuk-list--bullet">
      <li><strong>"Consultees, neighbours and publicity"</strong> — PP, PA, LC, Other</li>
      <li><strong>"Consultees"</strong> — Pre-application</li>
    </ul>`;
    html += `<p class="govuk-body">The shorter name may be intentional (pre-apps don't involve neighbours or publicity), but it's worth confirming.</p>`;

    // 5. Section vs task name collision
    html += `<h3 class="govuk-heading-s" style="margin-top:24px;">5. "Check application details" is both a section name and a task name</h3>`;
    html += `<p class="govuk-body">In Validation, "Check application details" is a <strong>section heading</strong> that contains tasks like Check constraints, Check description, etc. In Pre-application Assessment, it's an <strong>individual task</strong>. This could be confusing if officers see both.</p>`;

    // 6. Oxford comma
    html += `<h3 class="govuk-heading-s" style="margin-top:24px;">6. Inconsistent use of Oxford comma</h3>`;
    html += `<p class="govuk-body">"<strong>Check, tag, and confirm documents</strong>" uses an Oxford comma. No other section heading or task title in BOPS does. The GDS style guide recommends <strong>not</strong> using the Oxford comma.</p>`;

    // 7. Long titles
    html += `<h3 class="govuk-heading-s" style="margin-top:24px;">7. Some titles are very long</h3>`;
    html += `<p class="govuk-body">These titles may be hard to scan quickly, especially in the sidebar task list:</p>`;
    html += `<ul class="govuk-list govuk-list--bullet">
      <li>"Summarise investigation and make recommendation" (49 characters)</li>
      <li>"Confirm Community Infrastructure Levy (CIL)" (45 characters)</li>
      <li>"Add site owners and interested parties" (39 characters)</li>
      <li>"Review and submit pre-application" (34 characters)</li>
      <li>"Add evidence of serving a notice" (32 characters)</li>
    </ul>`;
    html += `<p class="govuk-body">Compare with the most common pattern: "Check description" (17 characters), "Check fee" (9 characters).</p>`;

    // 8. Missing descriptions
    html += `<h3 class="govuk-heading-s" style="margin-top:32px;">8. Many tasks have no instruction description</h3>`;
    html += `<p class="govuk-body">There is no centralised system for task descriptions in BOPS. Each task's instructions are hardcoded in its view template — and many have none at all. Tasks with no description leave officers to work out what to do from the form fields alone.</p>`;

    html += heading("Tasks with good descriptions (models to follow)");
    html += tableStart(["Task", "Description"]);
    html += tableRow([
      "Check constraints",
      '"Add, remove and save constraints. Check the constraints for this application. When all relevant constraints have been added, save and mark as complete."',
    ]);
    html += tableRow([
      "Summary of works",
      '"You can include:" followed by a clear bullet list of what to write',
    ]);
    html += tableRow([
      "Site and surroundings",
      '"You can include:" followed by a list — buildings, neighbours, constraints, land uses',
    ]);
    html += tableRow([
      "Add and assign consultees",
      'Two clear steps: "Select constraints that require consultation" then "Assign consultees to each constraint"',
    ]);
    html += tableEnd();

    html += heading("Tasks with no description at all");
    html += note(
      "These tasks show only the title and then go straight into form fields or data."
    );

    html += `<div style="columns:2;column-gap:32px;margin-bottom:24px;">
      <ul class="govuk-list govuk-list--bullet" style="font-size:16px;">
        <li>Check and request documents</li>
        <li>Add reporting details</li>
        <li>Check legislative requirements</li>
        <li>Check Environment Impact Assessment</li>
        <li>Permitted development rights</li>
        <li>Check requested services</li>
        <li>View recommendation</li>
        <li>Publish determination</li>
        <li>Site visit</li>
        <li>Meeting</li>
        <li>Planning considerations and advice</li>
        <li>Check and add requirements</li>
        <li>Check site location</li>
        <li>Update site location</li>
        <li>Add site owners and interested parties</li>
        <li>Add investigation action</li>
        <li>Add site visit</li>
        <li>Add legislation for assessment</li>
        <li>Assess against policy</li>
        <li>Summarise investigation and make recommendation</li>
        <li>Create enforcement notice</li>
        <li>Submit recommendation</li>
        <li>Review recommendation</li>
        <li>Serve notice</li>
        <li>Add evidence of serving a notice</li>
        <li>Required actions</li>
        <li>Process an appeal</li>
        <li>Close case</li>
      </ul>
    </div>`;

    html += flagBox(
      "28 out of roughly 50 leaf tasks have no instruction description. Consider adding a short instruction line to every task, following the pattern set by Check constraints and Summary of works."
    );

    // 9. Description format inconsistency
    html += `<h3 class="govuk-heading-s" style="margin-top:24px;">9. No consistent format for descriptions</h3>`;
    html += `<p class="govuk-body">Where descriptions do exist, they use different formats:</p>`;
    html += tableStart(["Format", "Example", "Used by"]);
    html += tableRow([
      "h2 heading + paragraph",
      '"Add, remove and save constraints" + explanatory text',
      "Check constraints",
    ]);
    html += tableRow([
      "Standalone paragraph",
      '"This digital red line boundary was submitted by the applicant."',
      "Check red line boundary",
    ]);
    html += tableRow([
      '"You can include:" + bullet list',
      "List of things to write about",
      "Summary of works, Site and surroundings",
    ]);
    html += tableRow([
      "Conditional state message",
      '"Consultation has been marked as not required"',
      "Check consultees",
    ]);
    html += tableRow([
      "Structured steps",
      '"Step 1: Select the consultees..." etc.',
      "Send emails to consultees",
    ]);
    html += tableEnd();
    html += `<p class="govuk-body">Choosing one or two standard formats would make the interface feel more consistent.</p>`;

    // 10. Descriptions about state, not instructions
    html += `<h3 class="govuk-heading-s" style="margin-top:24px;">10. Some descriptions are about state, not instructions</h3>`;
    html += `<p class="govuk-body">Some task "descriptions" describe the current state of the data rather than telling the officer what to do:</p>`;
    html += `<ul class="govuk-list govuk-list--bullet">
      <li>"This fee was calculated based on the services requested by the applicant." — states a fact, doesn't say what to check</li>
      <li>"This digital red line boundary was submitted by the applicant." — same</li>
      <li>"Consultation has been marked as not required" — describes status, not action</li>
    </ul>`;
    html += `<p class="govuk-body">Compare with "Check the constraints for this application. Add any constraints that are relevant." — this tells the officer exactly what to do.</p>`;

    // 11. Check description in two workflows
    html += `<h3 class="govuk-heading-s" style="margin-top:24px;">11. "Check description" means different things</h3>`;
    html += `<p class="govuk-body">"Check description" appears in both standard workflows (Validation) and Enforcement (as a subtask of Check report details). In Validation, it's about checking the planning application description. In Enforcement, it's about checking the breach report description.</p>`;
    html += `<p class="govuk-body">An officer working on both would see the same title for two different things.</p>`;

    return html;
  },
};
