/**
 * Site Notice v2 — Redesigned workflow.
 *
 * Key changes from v1:
 * - Overview-first: landing page is the status/overview (or empty state)
 * - Single clean creation page (no massive conditional reveals)
 * - Single task with evolving status (no separate "confirm" sub-task)
 * - Timeline view showing full lifecycle
 *
 * Stories:
 *   EmptyState, CreateForm, CreateFormApplicant, CreateFormPrint,
 *   OverviewSent, UploadEvidence, ReminderEmail,
 *   OverviewComplete, NotRequired
 */
import { mockData, renderStatusTag } from "../../../helpers";

export default {
  title: "Workflows/Planning Permission/2. Consultation/Site Notice v2",
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (story) =>
      `<div style="max-width: 1100px; margin: 0 auto; padding: 30px 20px;">${story()}</div>`,
  ],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const { siteNoticeV2: sn, application, people } = mockData;

function renderTimeline(events) {
  const items = events
    .map((event) => {
      const isComplete = event.status === "complete";
      const isPending = event.status === "pending";

      const icon = isComplete
        ? `<span style="color: #00703c; font-weight: bold;">&#10003;</span>`
        : isPending
          ? `<span style="color: #b1b4b6;">&#9675;</span>`
          : `<span style="color: #f47738;">&#9675;</span>`;

      const dateCol = event.date
        ? `<span class="govuk-body-s" style="color: #505a5f; min-width: 110px; display: inline-block;">${event.date}</span>`
        : `<span class="govuk-body-s" style="color: #505a5f; min-width: 110px; display: inline-block; font-style: italic;">${event.status === "pending" ? "Pending" : "Awaiting"}</span>`;

      const evidenceHtml =
        event.evidence
          ? `
        <div style="margin-top: 8px; padding: 12px 16px; background: #f3f2f1; border-left: 4px solid #b1b4b6;">
          <p class="govuk-body-s govuk-!-margin-bottom-0">
            <strong>${event.evidence.filename}</strong><br>
            Displayed: ${event.evidence.displayedAt}
          </p>
        </div>`
          : "";

      return `
        <div style="display: flex; gap: 12px; align-items: flex-start; padding: 8px 0; ${!isComplete && !event.date ? "opacity: 0.7;" : ""}">
          <span style="font-size: 18px; line-height: 1; flex-shrink: 0; width: 24px; text-align: center;">${icon}</span>
          <div style="flex: 1;">
            <div style="display: flex; gap: 12px; align-items: baseline;">
              ${dateCol}
              <span class="govuk-body-s govuk-!-margin-bottom-0">${event.label}</span>
            </div>
            ${evidenceHtml}
          </div>
        </div>`;
    })
    .join("");

  return `
    <div class="govuk-!-margin-top-6 govuk-!-margin-bottom-6">
      <h2 class="govuk-heading-m">Timeline</h2>
      <div style="border-left: 3px solid #b1b4b6; margin-left: 11px; padding-left: 0;">
        ${items}
      </div>
    </div>`;
}

function renderSummaryList(rows) {
  const items = rows
    .map(
      (row) => `
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">${row.key}</dt>
        <dd class="govuk-summary-list__value">${row.value}</dd>
        ${row.action ? `<dd class="govuk-summary-list__actions"><a class="govuk-link" href="#">${row.action}</a></dd>` : ""}
      </div>`
    )
    .join("");

  return `<dl class="govuk-summary-list">${items}</dl>`;
}

function renderDateInput(id, legend, hint) {
  return `
    <fieldset class="govuk-fieldset" role="group">
      <legend class="govuk-fieldset__legend govuk-fieldset__legend--s">${legend}</legend>
      ${hint ? `<div class="govuk-hint">${hint}</div>` : ""}
      <div class="govuk-date-input" id="${id}">
        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label class="govuk-label govuk-date-input__label" for="${id}-day">Day</label>
            <input class="govuk-input govuk-date-input__input govuk-input--width-2" id="${id}-day" name="${id}[day]" type="text" inputmode="numeric">
          </div>
        </div>
        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label class="govuk-label govuk-date-input__label" for="${id}-month">Month</label>
            <input class="govuk-input govuk-date-input__input govuk-input--width-2" id="${id}-month" name="${id}[month]" type="text" inputmode="numeric">
          </div>
        </div>
        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label class="govuk-label govuk-date-input__label" for="${id}-year">Year</label>
            <input class="govuk-input govuk-date-input__input govuk-input--width-4" id="${id}-year" name="${id}[year]" type="text" inputmode="numeric">
          </div>
        </div>
      </div>
    </fieldset>`;
}

function renderEmailPreview({ subject, to, body }) {
  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Email preview</h1>

        <table class="govuk-table">
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <th scope="row" class="govuk-table__header" style="width: 100px;">To</th>
              <td class="govuk-table__cell">${to}</td>
            </tr>
            <tr class="govuk-table__row">
              <th scope="row" class="govuk-table__header">Subject</th>
              <td class="govuk-table__cell">${subject}</td>
            </tr>
          </tbody>
        </table>

        <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">
        <div class="govuk-inset-text" style="white-space: pre-line;">${body}</div>

        <div class="govuk-button-group">
          <button type="submit" class="govuk-button" data-module="govuk-button">Send</button>
          <a class="govuk-link" href="#">Back</a>
        </div>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Empty state — no site notice exists yet. Two clear actions. */
export const EmptyState = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">
          Site notice
          <span class="govuk-!-margin-left-2">${renderStatusTag("not_started")}</span>
        </h1>

        <p class="govuk-body">No site notice has been created for this application.</p>

        <div class="govuk-button-group govuk-!-margin-top-6">
          <a href="#" role="button" draggable="false" class="govuk-button" data-module="govuk-button">
            Create site notice
          </a>
          <a href="#" role="button" draggable="false" class="govuk-button govuk-button--secondary" data-module="govuk-button">
            Mark as not required
          </a>
        </div>

        <a class="govuk-link" href="#">Back</a>
      </div>
    </div>`,
};

/** Creation form — email to internal team selected. Single clean page. */
export const CreateForm = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Create site notice</h1>

        <h2 class="govuk-heading-m">Notice details</h2>

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--s" for="quantity">
            Number of site notices
          </label>
          <input class="govuk-input govuk-input--width-4" id="quantity" name="quantity" type="number" value="2" min="1">
        </div>

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--s" for="location-instructions">
            Where should the notices be displayed?
          </label>
          <div class="govuk-hint">This will be shared with whoever displays them.</div>
          <textarea class="govuk-textarea" id="location-instructions" name="location_instructions" rows="4">${sn.locationInstructions}</textarea>
        </div>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">How should the notice be arranged?</h2>

        <div class="govuk-form-group">
          <fieldset class="govuk-fieldset">
            <div class="govuk-radios" data-module="govuk-radios">
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="method-team" name="method" type="radio" value="internal_team" checked data-aria-controls="conditional-method-team">
                <label class="govuk-label govuk-radios__label" for="method-team">Email an internal team to display it</label>
              </div>
              <div class="govuk-radios__conditional" id="conditional-method-team">
                <div class="govuk-form-group">
                  <label class="govuk-label" for="team-email">Team email address</label>
                  <input class="govuk-input" id="team-email" name="internal_team_email" type="email" value="${sn.internalTeamEmail}">
                </div>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="method-applicant" name="method" type="radio" value="applicant" data-aria-controls="conditional-method-applicant">
                <label class="govuk-label govuk-radios__label" for="method-applicant">Email the applicant to display it</label>
              </div>
              <div class="govuk-radios__conditional" id="conditional-method-applicant" style="display: none;">
                <div class="govuk-inset-text">
                  The notice will be emailed to <strong>${people.applicant.email}</strong> with instructions on how to print, protect, and display it.
                </div>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="method-print" name="method" type="radio" value="print" data-aria-controls="conditional-method-print">
                <label class="govuk-label govuk-radios__label" for="method-print">I'll print and arrange it myself</label>
              </div>
              <div class="govuk-radios__conditional" id="conditional-method-print" style="display: none;">
                <div class="govuk-form-group">
                  ${renderDateInput("display-date", "When will you display it?", null)}
                </div>
              </div>
            </div>
          </fieldset>
        </div>

        <div class="govuk-button-group govuk-!-margin-top-6">
          <button type="submit" class="govuk-button" data-module="govuk-button">
            Send and create
          </button>
          <a class="govuk-link" href="#">Back</a>
        </div>
      </div>
    </div>`,
};

/** Creation form — email to applicant selected. */
export const CreateFormApplicant = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Create site notice</h1>

        <h2 class="govuk-heading-m">Notice details</h2>

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--s" for="quantity">
            Number of site notices
          </label>
          <input class="govuk-input govuk-input--width-4" id="quantity" name="quantity" type="number" value="1" min="1">
        </div>

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--s" for="location-instructions">
            Where should the notices be displayed?
          </label>
          <div class="govuk-hint">This will be shared with whoever displays them.</div>
          <textarea class="govuk-textarea" id="location-instructions" name="location_instructions" rows="4"></textarea>
        </div>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">How should the notice be arranged?</h2>

        <div class="govuk-form-group">
          <fieldset class="govuk-fieldset">
            <div class="govuk-radios" data-module="govuk-radios">
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="method-team" name="method" type="radio" value="internal_team" data-aria-controls="conditional-method-team">
                <label class="govuk-label govuk-radios__label" for="method-team">Email an internal team to display it</label>
              </div>
              <div class="govuk-radios__conditional" id="conditional-method-team" style="display: none;">
                <div class="govuk-form-group">
                  <label class="govuk-label" for="team-email">Team email address</label>
                  <input class="govuk-input" id="team-email" name="internal_team_email" type="email" value="${sn.internalTeamEmail}">
                </div>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="method-applicant" name="method" type="radio" value="applicant" checked data-aria-controls="conditional-method-applicant">
                <label class="govuk-label govuk-radios__label" for="method-applicant">Email the applicant to display it</label>
              </div>
              <div class="govuk-radios__conditional" id="conditional-method-applicant">
                <div class="govuk-inset-text">
                  The notice will be emailed to <strong>${people.applicant.email}</strong> with instructions on how to print, protect, and display it.
                </div>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="method-print" name="method" type="radio" value="print" data-aria-controls="conditional-method-print">
                <label class="govuk-label govuk-radios__label" for="method-print">I'll print and arrange it myself</label>
              </div>
              <div class="govuk-radios__conditional" id="conditional-method-print" style="display: none;">
                <div class="govuk-form-group">
                  ${renderDateInput("display-date", "When will you display it?", null)}
                </div>
              </div>
            </div>
          </fieldset>
        </div>

        <div class="govuk-button-group govuk-!-margin-top-6">
          <button type="submit" class="govuk-button" data-module="govuk-button">
            Send and create
          </button>
          <a class="govuk-link" href="#">Back</a>
        </div>
      </div>
    </div>`,
};

/** Creation form — print it myself selected. */
export const CreateFormPrint = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Create site notice</h1>

        <h2 class="govuk-heading-m">Notice details</h2>

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--s" for="quantity">
            Number of site notices
          </label>
          <input class="govuk-input govuk-input--width-4" id="quantity" name="quantity" type="number" value="1" min="1">
        </div>

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--s" for="location-instructions">
            Where should the notices be displayed?
          </label>
          <div class="govuk-hint">This will be shared with whoever displays them.</div>
          <textarea class="govuk-textarea" id="location-instructions" name="location_instructions" rows="4"></textarea>
        </div>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">How should the notice be arranged?</h2>

        <div class="govuk-form-group">
          <fieldset class="govuk-fieldset">
            <div class="govuk-radios" data-module="govuk-radios">
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="method-team" name="method" type="radio" value="internal_team" data-aria-controls="conditional-method-team">
                <label class="govuk-label govuk-radios__label" for="method-team">Email an internal team to display it</label>
              </div>
              <div class="govuk-radios__conditional" id="conditional-method-team" style="display: none;">
                <div class="govuk-form-group">
                  <label class="govuk-label" for="team-email">Team email address</label>
                  <input class="govuk-input" id="team-email" name="internal_team_email" type="email" value="${sn.internalTeamEmail}">
                </div>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="method-applicant" name="method" type="radio" value="applicant" data-aria-controls="conditional-method-applicant">
                <label class="govuk-label govuk-radios__label" for="method-applicant">Email the applicant to display it</label>
              </div>
              <div class="govuk-radios__conditional" id="conditional-method-applicant" style="display: none;">
                <div class="govuk-inset-text">
                  The notice will be emailed to <strong>${people.applicant.email}</strong> with instructions on how to print, protect, and display it.
                </div>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="method-print" name="method" type="radio" value="print" checked data-aria-controls="conditional-method-print">
                <label class="govuk-label govuk-radios__label" for="method-print">I'll print and arrange it myself</label>
              </div>
              <div class="govuk-radios__conditional" id="conditional-method-print">
                <div class="govuk-form-group">
                  ${renderDateInput("display-date", "When will you display it?", null)}
                </div>
              </div>
            </div>
          </fieldset>
        </div>

        <div class="govuk-button-group govuk-!-margin-top-6">
          <button type="submit" class="govuk-button" data-module="govuk-button">
            Create and download PDF
          </button>
          <a class="govuk-link" href="#">Back</a>
        </div>
      </div>
    </div>`,
};

/** Overview — site notice sent, awaiting evidence of display. */
export const OverviewSent = {
  render: () => {
    const timelineEvents = [
      {
        date: "27 Nov 2024",
        label: "Created and emailed to site.notices@southwark.gov.uk",
        status: "complete",
      },
      {
        label: "Evidence of display",
        status: "pending",
      },
    ];

    return `
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">
          <h1 class="govuk-heading-l">
            Site notice
            <span class="govuk-!-margin-left-2">${renderStatusTag("sent")}</span>
          </h1>

          ${renderSummaryList([
            { key: "Notices", value: "2" },
            { key: "Display locations", value: sn.locationInstructions },
            { key: "Arranged via", value: `Email to internal team (${sn.internalTeamEmail})` },
            { key: "PDF", value: `<a class="govuk-link" href="#">Download site notice</a>` },
          ])}

          <p class="govuk-body-s govuk-!-margin-top-2">
            <a class="govuk-link" href="#">Edit details</a>
          </p>

          ${renderTimeline(timelineEvents)}

          <div class="govuk-button-group">
            <a href="#" role="button" draggable="false" class="govuk-button" data-module="govuk-button">
              Upload evidence
            </a>
            <a class="govuk-link" href="#">Send reminder email</a>
          </div>

          <a class="govuk-link" href="#">Back</a>
        </div>
      </div>`;
  },
};

/** Upload evidence — short dedicated page. */
export const UploadEvidence = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Confirm site notice is displayed</h1>

        <div class="govuk-form-group">
          ${renderDateInput("displayed-at", "When was the site notice displayed?", null)}
        </div>

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--s" for="evidence-upload">
            Upload a photo of the notice in place
          </label>
          <div class="govuk-hint">
            Add any photos of the site notice being displayed.
          </div>
          <input class="govuk-file-upload" id="evidence-upload" name="documents[]" type="file" multiple>
        </div>

        <div class="govuk-button-group govuk-!-margin-top-6">
          <button type="submit" class="govuk-button" data-module="govuk-button">
            Save
          </button>
          <a class="govuk-link" href="#">Back</a>
        </div>
      </div>
    </div>`,
};

/** Reminder email preview — officer reviews before sending. */
export const ReminderEmail = {
  render: () =>
    renderEmailPreview({
      subject: `Reminder: site notice evidence needed for ${application.reference}`,
      to: sn.internalTeamEmail,
      body: `Application reference: ${application.reference}

Address: ${application.address.full}

The site notice for this application was sent on 27 Nov 2024. We have not yet received evidence that it has been displayed.

Please upload a photo of the site notice in place using the link below:

http://southwark.bops.services/planning_applications/${application.reference}/site_notices/1/edit

Case officer: ${people.caseOfficer.name}`,
    }),
};

/** Overview — complete with evidence in timeline. */
export const OverviewComplete = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">
          Site notice
          <span class="govuk-!-margin-left-2">${renderStatusTag("complete")}</span>
        </h1>

        ${renderSummaryList([
          { key: "Notices", value: "2" },
          { key: "Display locations", value: sn.locationInstructions },
          { key: "Arranged via", value: `Email to internal team (${sn.internalTeamEmail})` },
          { key: "PDF", value: `<a class="govuk-link" href="#">Download site notice</a>` },
        ])}

        ${renderTimeline(sn.timeline)}

        <a class="govuk-link" href="#">Back</a>
      </div>
    </div>`,
};

/** Not required — simple confirmation state. */
export const NotRequired = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">
          Site notice
          <span class="govuk-!-margin-left-2">${renderStatusTag("not_required")}</span>
        </h1>

        <p class="govuk-body">A site notice is not required for this application.</p>

        <p class="govuk-body-s">
          <a class="govuk-link" href="#">Change this decision</a>
        </p>

        <a class="govuk-link" href="#">Back</a>
      </div>
    </div>`,
};
