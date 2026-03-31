/**
 * Site Notice v3 — Multi-notice support with GDS Summary Cards.
 *
 * Builds on v2 (overview-first, single creation form) and adds:
 * - Overview shows multiple notices as GDS Summary Cards
 * - "Add another site notice" button
 * - Two variants to compare:
 *   - Variant A: Full detail on card (all rows including status + evidence)
 *   - Variant B: Compact card, click through to detail page
 */
import { mockData, renderStatusTag } from "../../../helpers";

export default {
  title: "Workflows/Planning Permission/2. Consultation/Site Notice v3",
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

const { siteNoticeV3: snV3, siteNoticeV2: sn, application, people } = mockData;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderSummaryList(rows) {
  const items = rows
    .map(
      (row) => `
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">${row.key}</dt>
        <dd class="govuk-summary-list__value">${row.value}</dd>
      </div>`
    )
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
// Summary card renderers
// ---------------------------------------------------------------------------

function renderSummaryCardA(notice, index) {
  return `
    <div class="govuk-summary-card">
      <div class="govuk-summary-card__title-wrapper">
        <h2 class="govuk-summary-card__title">Site notice ${index + 1}</h2>
        <ul class="govuk-summary-card__actions">
          <li class="govuk-summary-card__action">
            <a class="govuk-link" href="#">Edit<span class="govuk-visually-hidden"> site notice ${index + 1}</span></a>
          </li>
        </ul>
      </div>
      <div class="govuk-summary-card__content">
        ${renderSummaryList([
          { key: "Notices", value: String(notice.quantity) },
          { key: "Locations", value: notice.locationInstructions },
          { key: "Arranged via", value: arrangedViaValue(notice) },
          { key: "PDF", value: `<a class="govuk-link" href="${notice.pdfLink}">Download site notice</a>` },
          { key: "Status", value: renderStatusTag(notice.status) },
          { key: "Evidence", value: evidenceValue(notice) },
        ])}
      </div>
    </div>`;
}

function renderSummaryCardB(notice, index) {
  return `
    <div class="govuk-summary-card">
      <div class="govuk-summary-card__title-wrapper">
        <h2 class="govuk-summary-card__title">Site notice ${index + 1}</h2>
        <ul class="govuk-summary-card__actions">
          <li class="govuk-summary-card__action">
            <a class="govuk-link" href="#">View details<span class="govuk-visually-hidden"> for site notice ${index + 1}</span></a>
          </li>
        </ul>
      </div>
      <div class="govuk-summary-card__content">
        ${renderSummaryList([
          { key: "Arranged via", value: arrangedViaValue(notice) },
          { key: "Status", value: renderStatusTag(notice.status) },
          { key: "Evidence", value: evidenceValue(notice) },
        ])}
      </div>
    </div>`;
}

function renderOverviewPage(notices, variant) {
  const allComplete = notices.every((n) => n.status === "complete");
  const overallStatus = allComplete ? "complete" : "in_progress";
  const renderCard = variant === "A" ? renderSummaryCardA : renderSummaryCardB;

  const cards = notices.map((n, i) => renderCard(n, i)).join("\n");

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">
          Site notices
          <span class="govuk-!-margin-left-2">${renderStatusTag(overallStatus)}</span>
        </h1>

        ${cards}

        <div class="govuk-button-group govuk-!-margin-top-4">
          <a href="#" role="button" draggable="false" class="govuk-button govuk-button--secondary" data-module="govuk-button">
            Add another site notice
          </a>
        </div>

        <a class="govuk-link" href="#">Back</a>
      </div>
    </div>`;
}

function renderDetailPage(notice, index) {
  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <a class="govuk-back-link" href="#">Back to all site notices</a>

        <h1 class="govuk-heading-l">Site notice ${index + 1}</h1>

        <dl class="govuk-summary-list">
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">Notices</dt>
            <dd class="govuk-summary-list__value">${notice.quantity}</dd>
            <dd class="govuk-summary-list__actions"><a class="govuk-link" href="#">Change</a></dd>
          </div>
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">Locations</dt>
            <dd class="govuk-summary-list__value">${notice.locationInstructions}</dd>
            <dd class="govuk-summary-list__actions"><a class="govuk-link" href="#">Change</a></dd>
          </div>
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">Arranged via</dt>
            <dd class="govuk-summary-list__value">${arrangedViaValue(notice)}</dd>
            <dd class="govuk-summary-list__actions"></dd>
          </div>
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">PDF</dt>
            <dd class="govuk-summary-list__value"><a class="govuk-link" href="${notice.pdfLink}">Download site notice</a></dd>
            <dd class="govuk-summary-list__actions"></dd>
          </div>
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">Status</dt>
            <dd class="govuk-summary-list__value">${renderStatusTag(notice.status)}</dd>
            <dd class="govuk-summary-list__actions"></dd>
          </div>
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">Evidence</dt>
            <dd class="govuk-summary-list__value">${evidenceValue(notice)}</dd>
            <dd class="govuk-summary-list__actions"></dd>
          </div>
        </dl>

        <a class="govuk-link" href="#">Back to all site notices</a>
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

        <a class="govuk-link" href="#">Back</a>
      </div>
    </div>`,
};

/** Creation form — single clean page. */
export const CreateForm = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <a class="govuk-back-link" href="#">Back to all site notices</a>

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
          <a class="govuk-link" href="#">Cancel</a>
        </div>
      </div>
    </div>`,
};

/** Variant A — single notice, sent, full detail on card. */
export const OverviewSingleSent_A = {
  name: "Overview: Single Sent (A)",
  render: () => renderOverviewPage([snV3.notices[1]], "A"),
};

/** Variant A — two notices (one complete, one sent), full detail on cards. */
export const OverviewMultipleMixed_A = {
  name: "Overview: Multiple Mixed (A)",
  render: () => renderOverviewPage(snV3.notices, "A"),
};

/** Variant B — single notice, sent, compact card. */
export const OverviewSingleSent_B = {
  name: "Overview: Single Sent (B)",
  render: () => renderOverviewPage([snV3.notices[1]], "B"),
};

/** Variant B — two notices, compact cards. */
export const OverviewMultipleMixed_B = {
  name: "Overview: Multiple Mixed (B)",
  render: () => renderOverviewPage(snV3.notices, "B"),
};

/** Variant B detail page — sent notice. */
export const DetailPageSent_B = {
  name: "Detail Page: Sent (B)",
  render: () => renderDetailPage(snV3.notices[1], 1),
};

/** Variant B detail page — completed notice with evidence. */
export const DetailPageComplete_B = {
  name: "Detail Page: Complete (B)",
  render: () => renderDetailPage(snV3.notices[0], 0),
};

/** Upload evidence — short dedicated form. */
export const UploadEvidence = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <a class="govuk-back-link" href="#">Back to site notice</a>

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
            Save
          </button>
          <a class="govuk-link" href="#">Cancel</a>
        </div>
      </div>
    </div>`,
};

/** Not required — simple state. */
export const NotRequired = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">
          Site notices
          <span class="govuk-!-margin-left-2">${renderStatusTag("not_required")}</span>
        </h1>

        <p class="govuk-body">Site notices are not required for this application.</p>

        <p class="govuk-body-s">
          <a class="govuk-link" href="#">Change this decision</a>
        </p>

        <a class="govuk-link" href="#">Back</a>
      </div>
    </div>`,
};
