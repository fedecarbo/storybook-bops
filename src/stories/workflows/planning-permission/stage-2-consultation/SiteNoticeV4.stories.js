/**
 * Site Notice v4 — Workflow improvements from planning officer review.
 *
 * Builds on v3 and addresses:
 * - Context-aware card actions (Confirm displayed vs Edit)
 * - Created date shown on cards
 * - Send reminder link for pending notices
 * - "Not required" captures a reason
 * - Specific button text throughout
 * - Single variant (full detail cards only)
 */
import { mockData, renderStatusTag } from "../../../helpers";

export default {
  title: "Workflows/Planning Permission/2. Consultation/Site Notice v4",
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (story) =>
      `<div style="max-width: 1100px; margin: 0 auto; padding: 30px 20px;">${story()}</div>`,
  ],
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const { siteNoticeV4: snV4, siteNoticeV2: sn, application, people } = mockData;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderSummaryList(rows, { actions = false } = {}) {
  const items = rows
    .map((row) => {
      const actionCell =
        actions && row.action
          ? `<dd class="govuk-summary-list__actions">${row.action}</dd>`
          : actions
            ? `<dd class="govuk-summary-list__actions"></dd>`
            : "";

      return `
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">${row.key}</dt>
        <dd class="govuk-summary-list__value">${row.value}</dd>
        ${actionCell}
      </div>`;
    })
    .join("");

  return `<dl class="govuk-summary-list govuk-!-margin-bottom-0">${items}</dl>`;
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

function evidenceValue(notice) {
  if (!notice.evidence) {
    return `<a class="govuk-link" href="#">Upload evidence</a>`;
  }
  const lines = [notice.evidence.filename];
  if (notice.displayedAt) lines.push(`Displayed: ${notice.displayedAt}`);
  if (notice.expiryDate) lines.push(`Expires: ${notice.expiryDate}`);
  return lines.join("<br>");
}

function arrangedViaValue(notice) {
  return notice.internalTeamEmail
    ? `${notice.methodLabel} (${notice.internalTeamEmail})`
    : notice.methodLabel;
}

// ---------------------------------------------------------------------------
// Summary card renderer — single variant with context-aware actions
// ---------------------------------------------------------------------------

function cardActions(notice, index) {
  const items = [];

  if (notice.status === "sent") {
    items.push(
      `<a class="govuk-link" href="#">Confirm displayed<span class="govuk-visually-hidden"> for site notice ${index + 1}</span></a>`
    );
  }

  items.push(
    `<a class="govuk-link" href="#">Edit<span class="govuk-visually-hidden"> site notice ${index + 1}</span></a>`
  );

  return items
    .map((a) => `<li class="govuk-summary-card__action">${a}</li>`)
    .join("");
}

function renderSummaryCard(notice, index) {
  return `
    <div class="govuk-summary-card">
      <div class="govuk-summary-card__title-wrapper">
        <h2 class="govuk-summary-card__title">Site notice ${index + 1}</h2>
        <ul class="govuk-summary-card__actions">
          ${cardActions(notice, index)}
        </ul>
      </div>
      <div class="govuk-summary-card__content">
        ${renderSummaryList([
          { key: "Quantity", value: String(notice.quantity) },
          { key: "Display locations", value: notice.locationInstructions },
          { key: "Arranged via", value: arrangedViaValue(notice) },
          { key: "PDF", value: `<a class="govuk-link" href="${notice.pdfLink}">Download site notice</a>` },
          { key: "Created", value: notice.createdAt },
          { key: "Status", value: renderStatusTag(notice.status) },
          { key: "Evidence", value: evidenceValue(notice) },
        ])}
      </div>
    </div>`;
}

function renderOverviewPage(notices) {
  const allComplete = notices.every((n) => n.status === "complete");
  const overallStatus = allComplete ? "complete" : "in_progress";

  const cards = notices.map((n, i) => renderSummaryCard(n, i)).join("\n");

  const pendingNotices = notices.filter((n) => n.status === "sent");
  const reminderSection =
    pendingNotices.length > 0
      ? `<p class="govuk-body govuk-!-margin-top-4">
          <a class="govuk-link" href="#">Send reminder email</a> for notices awaiting display confirmation.
        </p>`
      : "";

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">
          Site notices
          <span class="govuk-!-margin-left-2">${renderStatusTag(overallStatus)}</span>
        </h1>

        ${cards}

        ${reminderSection}

        <div class="govuk-button-group govuk-!-margin-top-4">
          <a href="#" role="button" draggable="false" class="govuk-button govuk-button--secondary" data-module="govuk-button">
            Add another site notice
          </a>
        </div>

        <a class="govuk-link" href="#">Back to consultation tasks</a>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Empty state — no site notices yet. */
export const EmptyState = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">
          Site notices
          <span class="govuk-!-margin-left-2">${renderStatusTag("not_started")}</span>
        </h1>

        <p class="govuk-body">No site notices have been created for this application.</p>

        <div class="govuk-button-group govuk-!-margin-top-6">
          <a href="#" role="button" draggable="false" class="govuk-button" data-module="govuk-button">
            Create site notice
          </a>
          <a href="#" role="button" draggable="false" class="govuk-button govuk-button--secondary" data-module="govuk-button">
            Mark as not required
          </a>
        </div>

        <a class="govuk-link" href="#">Back to consultation tasks</a>
      </div>
    </div>`,
};

/** Creation form — single clean page. */
export const CreateForm = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <a class="govuk-back-link" href="#">Back to site notices</a>

        <h1 class="govuk-heading-l">Create site notice</h1>

        <h2 class="govuk-heading-m">Notice details</h2>

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--s" for="quantity">
            Quantity
          </label>
          <div class="govuk-hint">How many site notices need to be displayed.</div>
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
            Create and send notice
          </button>
          <a class="govuk-link" href="#">Cancel</a>
        </div>
      </div>
    </div>`,
};

/** Overview — single notice, sent, awaiting display confirmation. */
export const OverviewSingleSent = {
  name: "Overview: Single Sent",
  render: () => renderOverviewPage([snV4.notices[1]]),
};

/** Overview — two notices, mixed states. */
export const OverviewMultipleMixed = {
  name: "Overview: Multiple Mixed",
  render: () => renderOverviewPage(snV4.notices),
};

/** Confirm notice is displayed — focused form. */
export const ConfirmDisplayed = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <a class="govuk-back-link" href="#">Back to site notices</a>

        <h1 class="govuk-heading-l">Confirm site notice is displayed</h1>

        <div class="govuk-form-group">
          ${renderDateInput("displayed-at", "When was the site notice displayed?", null)}
        </div>

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--s" for="evidence-upload">
            Upload a photo of the notice in place
          </label>
          <div class="govuk-hint">
            Add any photos showing the site notice on display.
          </div>
          <input class="govuk-file-upload" id="evidence-upload" name="documents[]" type="file" multiple>
        </div>

        <div class="govuk-button-group govuk-!-margin-top-6">
          <button type="submit" class="govuk-button" data-module="govuk-button">
            Confirm display
          </button>
          <a class="govuk-link" href="#">Cancel</a>
        </div>
      </div>
    </div>`,
};

/** Overview — all notices complete. */
export const OverviewComplete = {
  name: "Overview: All Complete",
  render: () => {
    const allComplete = snV4.notices.map((n) => ({
      ...n,
      status: "complete",
      evidence: n.evidence || {
        filename: "site-notice-photo-hoarding.jpg",
        uploadedAt: "12 Dec 2024",
      },
      displayedAt: n.displayedAt || "10 Dec 2024",
      expiryDate: n.expiryDate || "31 Dec 2024",
    }));
    return renderOverviewPage(allComplete);
  },
};

/** Mark as not required — capture reason. */
export const MarkNotRequired = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <a class="govuk-back-link" href="#">Back to site notices</a>

        <h1 class="govuk-heading-l">Why are site notices not required?</h1>

        <div class="govuk-form-group">
          <label class="govuk-label" for="not-required-reason">
            Provide a reason for this decision
          </label>
          <div class="govuk-hint">
            This will be recorded for audit purposes.
          </div>
          <textarea class="govuk-textarea" id="not-required-reason" name="not_required_reason" rows="4"></textarea>
        </div>

        <div class="govuk-button-group govuk-!-margin-top-6">
          <button type="submit" class="govuk-button" data-module="govuk-button">
            Confirm decision
          </button>
          <a class="govuk-link" href="#">Cancel</a>
        </div>
      </div>
    </div>`,
};

/** Not required — shows the captured reason. */
export const NotRequired = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">
          Site notices
          <span class="govuk-!-margin-left-2">${renderStatusTag("not_required")}</span>
        </h1>

        <p class="govuk-body">Site notices are not required for this application.</p>

        <div class="govuk-inset-text">
          <p class="govuk-body govuk-!-margin-bottom-0">
            <strong>Reason:</strong> This is a householder application for a rear extension with no impact on public land or rights of way. The site is not in a conservation area and there are no special designation requirements.
          </p>
        </div>

        <p class="govuk-body-s">
          <a class="govuk-link" href="#">Change this decision</a>
        </p>

        <a class="govuk-link" href="#">Back to consultation tasks</a>
      </div>
    </div>`,
};
