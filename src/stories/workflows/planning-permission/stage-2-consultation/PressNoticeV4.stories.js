/**
 * Press Notice v4 — Workflow improvements from planning officer review.
 *
 * Builds on v3 and addresses:
 * - Context-aware card actions (Confirm publication vs Edit)
 * - Created/requested date shown on cards
 * - Send reminder link for pending notices
 * - "Not required" captures a reason
 * - Specific button text throughout
 * - Single variant (full detail cards only)
 */
import { mockData, renderStatusTag } from "../../../helpers";

export default {
  title: "Workflows/Planning Permission/2. Consultation/Press Notice v4",
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

const { pressNoticeV4: pnV4, pressNoticeReasons, dates } = mockData;

function reasonLabel(key) {
  return pressNoticeReasons[key] || key;
}

function reasonsList(reasons) {
  return reasons.map((key) => reasonLabel(key)).join(", ");
}

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

function evidenceValue(notice) {
  if (!notice.evidence) {
    return `<a class="govuk-link" href="#">Upload evidence</a>`;
  }
  const lines = [notice.evidence.filename];
  if (notice.publishedAt) lines.push(`Published: ${notice.publishedAt}`);
  if (notice.comment) lines.push(notice.comment);
  return lines.join("<br>");
}

function renderReasonCheckboxes(checkedReasons = [], showOtherTextarea = false) {
  const standardReasons = Object.entries(pressNoticeReasons).filter(
    ([key]) => key !== "other"
  );

  const checkboxes = standardReasons
    .map(([key, label]) => {
      const id = `reason-${key}`;
      const checked = checkedReasons.includes(key) ? " checked" : "";
      return `
        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="${id}" name="reasons[]" type="checkbox" value="${key}"${checked}>
          <label class="govuk-label govuk-checkboxes__label" for="${id}">${label}</label>
        </div>`;
    })
    .join("\n");

  const otherChecked = checkedReasons.includes("other") ? " checked" : "";
  const otherConditional = showOtherTextarea
    ? `
        <div class="govuk-checkboxes__conditional" id="conditional-reason-other">
          <div class="govuk-form-group">
            <label class="govuk-label" for="other-reason">
              Describe the other reason
            </label>
            <textarea class="govuk-textarea" id="other-reason" name="other_reason" rows="3"></textarea>
          </div>
        </div>`
    : "";

  return `
    <div class="govuk-checkboxes" data-module="govuk-checkboxes">
      ${checkboxes}
      <div class="govuk-checkboxes__divider">or</div>
      <div class="govuk-checkboxes__item">
        <input class="govuk-checkboxes__input" id="reason-other" name="reasons[]" type="checkbox" value="other"${otherChecked} data-aria-controls="conditional-reason-other">
        <label class="govuk-label govuk-checkboxes__label" for="reason-other">Other</label>
      </div>
      ${otherConditional}
    </div>`;
}

// ---------------------------------------------------------------------------
// Summary card renderer — single variant with context-aware actions
// ---------------------------------------------------------------------------

function cardActions(notice, index) {
  const items = [];

  if (notice.status === "requested") {
    items.push(
      `<a class="govuk-link" href="#">Confirm publication<span class="govuk-visually-hidden"> for press notice ${index + 1}</span></a>`
    );
  }

  items.push(
    `<a class="govuk-link" href="#">Edit<span class="govuk-visually-hidden"> press notice ${index + 1}</span></a>`
  );

  return items
    .map((a) => `<li class="govuk-summary-card__action">${a}</li>`)
    .join("");
}

function renderSummaryCard(notice, index) {
  return `
    <div class="govuk-summary-card">
      <div class="govuk-summary-card__title-wrapper">
        <h2 class="govuk-summary-card__title">Press notice ${index + 1}</h2>
        <ul class="govuk-summary-card__actions">
          ${cardActions(notice, index)}
        </ul>
      </div>
      <div class="govuk-summary-card__content">
        ${renderSummaryList([
          { key: "Reasons", value: reasonsList(notice.reasons) },
          { key: "Sent to", value: notice.notificationEmail },
          { key: "Requested", value: notice.requestedAt },
          ...(notice.publishedAt ? [{ key: "Published", value: notice.publishedAt }] : []),
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

  const pendingNotices = notices.filter((n) => n.status === "requested");
  const reminderSection =
    pendingNotices.length > 0
      ? `<p class="govuk-body govuk-!-margin-top-4">
          <a class="govuk-link" href="#">Send reminder email</a> for notices awaiting publication confirmation.
        </p>`
      : "";

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">
          Press notices
          <span class="govuk-!-margin-left-2">${renderStatusTag(overallStatus)}</span>
        </h1>

        ${cards}

        ${reminderSection}

        <div class="govuk-button-group govuk-!-margin-top-4">
          <a href="#" role="button" draggable="false" class="govuk-button govuk-button--secondary" data-module="govuk-button">
            Add another press notice
          </a>
        </div>

        <a class="govuk-link" href="#">Back to consultation tasks</a>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Empty state — no press notices yet. */
export const EmptyState = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">
          Press notices
          <span class="govuk-!-margin-left-2">${renderStatusTag("not_started")}</span>
        </h1>

        <p class="govuk-body">No press notices have been created for this application.</p>

        <div class="govuk-button-group govuk-!-margin-top-6">
          <a href="#" role="button" draggable="false" class="govuk-button" data-module="govuk-button">
            Create press notice
          </a>
          <a href="#" role="button" draggable="false" class="govuk-button govuk-button--secondary" data-module="govuk-button">
            Mark as not required
          </a>
        </div>

        <a class="govuk-link" href="#">Back to consultation tasks</a>
      </div>
    </div>`,
};

/** Creation form — reason checkboxes and email confirmation. */
export const CreateForm = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <a class="govuk-back-link" href="#">Back to press notices</a>

        <h1 class="govuk-heading-l">Create press notice</h1>

        <div class="govuk-form-group">
          <fieldset class="govuk-fieldset">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              Statutory reasons for the press notice
            </legend>
            ${renderReasonCheckboxes(["conservation_area", "listed_building"])}
          </fieldset>
        </div>

        <div class="govuk-button-group govuk-!-margin-top-6">
          <button type="submit" class="govuk-button" data-module="govuk-button">
            Send request
          </button>
          <a class="govuk-link" href="#">Cancel</a>
        </div>
      </div>
    </div>`,
};

/** Overview — single notice, requested, awaiting publication. */
export const OverviewSingleRequested = {
  name: "Overview: Single Requested",
  render: () => renderOverviewPage([pnV4.notices[1]]),
};

/** Overview — two notices, mixed states. */
export const OverviewMultipleMixed = {
  name: "Overview: Multiple Mixed",
  render: () => renderOverviewPage(pnV4.notices),
};

/** Confirm publication — date, evidence, and comment. */
export const ConfirmPublication = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <a class="govuk-back-link" href="#">Back to press notices</a>

        <h1 class="govuk-heading-l">Confirm press notice publication</h1>

        <div class="govuk-form-group">
          <fieldset class="govuk-fieldset" role="group">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--s">
              When was the press notice published?
            </legend>
            <div class="govuk-hint">
              Must fall within the consultation period (${dates.consultationStart} to ${dates.consultationEnd}).
            </div>
            <div class="govuk-date-input" id="published-at">
              <div class="govuk-date-input__item">
                <div class="govuk-form-group">
                  <label class="govuk-label govuk-date-input__label" for="published-at-day">Day</label>
                  <input class="govuk-input govuk-date-input__input govuk-input--width-2" id="published-at-day" name="published_at[day]" type="text" inputmode="numeric">
                </div>
              </div>
              <div class="govuk-date-input__item">
                <div class="govuk-form-group">
                  <label class="govuk-label govuk-date-input__label" for="published-at-month">Month</label>
                  <input class="govuk-input govuk-date-input__input govuk-input--width-2" id="published-at-month" name="published_at[month]" type="text" inputmode="numeric">
                </div>
              </div>
              <div class="govuk-date-input__item">
                <div class="govuk-form-group">
                  <label class="govuk-label govuk-date-input__label" for="published-at-year">Year</label>
                  <input class="govuk-input govuk-date-input__input govuk-input--width-4" id="published-at-year" name="published_at[year]" type="text" inputmode="numeric">
                </div>
              </div>
            </div>
          </fieldset>
        </div>

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--s" for="evidence-upload">
            Upload evidence of publication
          </label>
          <div class="govuk-hint">
            A photo or scan of the published notice.
          </div>
          <input class="govuk-file-upload" id="evidence-upload" name="documents[]" type="file" multiple>
        </div>

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--s" for="comment">
            Comment (optional)
          </label>
          <div class="govuk-hint">
            For example, which publication and page number.
          </div>
          <textarea class="govuk-textarea" id="comment" name="comment" rows="3"></textarea>
        </div>

        <div class="govuk-button-group govuk-!-margin-top-6">
          <button type="submit" class="govuk-button" data-module="govuk-button">
            Confirm publication
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
    const allComplete = pnV4.notices.map((n) => ({
      ...n,
      status: "complete",
      publishedAt: n.publishedAt || "15 Dec 2024",
      comment: n.comment || "Published in Southwark News, page 8",
      evidence: n.evidence || {
        filename: "press-notice-southwark-news-p8.jpg",
        uploadedAt: "16 Dec 2024",
      },
    }));
    return renderOverviewPage(allComplete);
  },
};

/** Mark as not required — capture reason. */
export const MarkNotRequired = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <a class="govuk-back-link" href="#">Back to press notices</a>

        <h1 class="govuk-heading-l">Why are press notices not required?</h1>

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
          Press notices
          <span class="govuk-!-margin-left-2">${renderStatusTag("not_required")}</span>
        </h1>

        <p class="govuk-body">Press notices are not required for this application.</p>

        <div class="govuk-inset-text">
          <p class="govuk-body govuk-!-margin-bottom-0">
            <strong>Reason:</strong> The application does not fall within any of the statutory categories requiring press notice publication. It is not in a conservation area, does not affect a listed building, and is not a major development.
          </p>
        </div>

        <p class="govuk-body-s">
          <a class="govuk-link" href="#">Change this decision</a>
        </p>

        <a class="govuk-link" href="#">Back to consultation tasks</a>
      </div>
    </div>`,
};
