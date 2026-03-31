/**
 * Press Notice v3 — Multi-notice support with GDS Summary Cards.
 *
 * Builds on v2 (overview-first, single creation form, timeline) and adds:
 * - Overview shows multiple notices as GDS Summary Cards
 * - "Add another press notice" button
 * - Two variants to compare:
 *   - Variant A: Full detail on card (timeline, evidence inline)
 *   - Variant B: Compact card, click through to detail page
 */
import { mockData, renderStatusTag } from "../../../helpers";

export default {
  title: "Workflows/Planning Permission/2. Consultation/Press Notice v3",
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

const { pressNoticeV3: pnV3, pressNoticeReasons, application, people, dates } = mockData;

function reasonLabel(key) {
  return pressNoticeReasons[key] || key;
}

function reasonsList(reasons) {
  return reasons.map((key) => reasonLabel(key)).join(", ");
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function renderEvidenceSection(notice) {
  if (!notice.evidence) {
    return `<p class="govuk-body-s govuk-!-margin-top-4" style="color: #505a5f;">No evidence uploaded yet.</p>`;
  }

  const publishedLine = notice.publishedAt
    ? `<br>Published: ${notice.publishedAt}`
    : "";
  const commentLine = notice.comment
    ? `<br>${notice.comment}`
    : "";

  return `
    <div class="govuk-!-margin-top-4">
      <h3 class="govuk-heading-s govuk-!-margin-bottom-2">Evidence</h3>
      <div style="padding: 12px 16px; background: #f3f2f1; border-left: 4px solid #b1b4b6;">
        <p class="govuk-body-s govuk-!-margin-bottom-0">
          <strong>${notice.evidence.filename}</strong>${publishedLine}${commentLine}
        </p>
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
      </div>`
    )
    .join("");

  return `<dl class="govuk-summary-list govuk-!-margin-bottom-0">${items}</dl>`;
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
// Summary card helpers
// ---------------------------------------------------------------------------

function renderSummaryCardA(notice, index) {
  const statusTag = renderStatusTag(notice.status);
  const isActionable = notice.status === "requested";

  const actions = isActionable
    ? `<div class="govuk-!-margin-top-4">
        <a href="#" role="button" draggable="false" class="govuk-button govuk-button--secondary govuk-!-margin-bottom-0 govuk-!-margin-right-2" data-module="govuk-button">
          Confirm publication
        </a>
        <a class="govuk-link" href="#">Send reminder</a>
      </div>`
    : "";

  const commentRow = notice.comment
    ? [{ key: "Comment", value: notice.comment }]
    : [];

  return `
    <div class="govuk-summary-card">
      <div class="govuk-summary-card__title-wrapper">
        <h2 class="govuk-summary-card__title">Press notice ${index + 1} ${statusTag}</h2>
        <ul class="govuk-summary-card__actions">
          <li class="govuk-summary-card__action">
            <a class="govuk-link" href="#">Edit<span class="govuk-visually-hidden"> press notice ${index + 1}</span></a>
          </li>
        </ul>
      </div>
      <div class="govuk-summary-card__content">
        ${renderSummaryList([
          { key: "Reasons", value: reasonsList(notice.reasons) },
          { key: "Sent to", value: notice.notificationEmail },
          { key: "Requested", value: notice.requestedAt },
          ...(notice.publishedAt ? [{ key: "Published", value: notice.publishedAt }] : []),
          ...commentRow,
        ])}
        ${renderEvidenceSection(notice)}
        ${actions}
      </div>
    </div>`;
}

function renderSummaryCardB(notice, index) {
  const statusTag = renderStatusTag(notice.status);

  return `
    <div class="govuk-summary-card">
      <div class="govuk-summary-card__title-wrapper">
        <h2 class="govuk-summary-card__title">Press notice ${index + 1} ${statusTag}</h2>
        <ul class="govuk-summary-card__actions">
          <li class="govuk-summary-card__action">
            <a class="govuk-link" href="#">View details<span class="govuk-visually-hidden"> for press notice ${index + 1}</span></a>
          </li>
        </ul>
      </div>
      <div class="govuk-summary-card__content">
        ${renderSummaryList([
          { key: "Reasons", value: reasonsList(notice.reasons) },
          { key: "Sent to", value: notice.notificationEmail },
          { key: "Requested", value: notice.requestedAt },
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
          Press notices
          <span class="govuk-!-margin-left-2">${renderStatusTag(overallStatus)}</span>
        </h1>

        ${cards}

        <div class="govuk-button-group govuk-!-margin-top-4">
          <a href="#" role="button" draggable="false" class="govuk-button govuk-button--secondary" data-module="govuk-button">
            Add another press notice
          </a>
        </div>

        <a class="govuk-link" href="#">Back</a>
      </div>
    </div>`;
}

function renderDetailPage(notice, index) {
  const statusTag = renderStatusTag(notice.status);
  const isActionable = notice.status === "requested";

  const commentRow = notice.comment
    ? [{ key: "Comment", value: notice.comment }]
    : [];

  const actions = isActionable
    ? `
      <div class="govuk-button-group">
        <a href="#" role="button" draggable="false" class="govuk-button" data-module="govuk-button">
          Confirm publication
        </a>
        <a class="govuk-link" href="#">Send reminder email</a>
      </div>`
    : "";

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <a class="govuk-back-link" href="#">Back to all press notices</a>

        <h1 class="govuk-heading-l">
          Press notice ${index + 1}
          <span class="govuk-!-margin-left-2">${statusTag}</span>
        </h1>

        <dl class="govuk-summary-list">
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">Reasons</dt>
            <dd class="govuk-summary-list__value">${reasonsList(notice.reasons)}</dd>
            <dd class="govuk-summary-list__actions"><a class="govuk-link" href="#">Edit</a></dd>
          </div>
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">Sent to</dt>
            <dd class="govuk-summary-list__value">${notice.notificationEmail}</dd>
            <dd class="govuk-summary-list__actions"></dd>
          </div>
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">Requested</dt>
            <dd class="govuk-summary-list__value">${notice.requestedAt}</dd>
            <dd class="govuk-summary-list__actions"></dd>
          </div>
          ${notice.publishedAt ? `
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">Published</dt>
            <dd class="govuk-summary-list__value">${notice.publishedAt}</dd>
            <dd class="govuk-summary-list__actions"></dd>
          </div>` : ""}
          ${notice.comment ? `
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">Comment</dt>
            <dd class="govuk-summary-list__value">${notice.comment}</dd>
            <dd class="govuk-summary-list__actions"></dd>
          </div>` : ""}
        </dl>

        ${renderEvidenceSection(notice)}

        ${actions}
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

        <a class="govuk-link" href="#">Back</a>
      </div>
    </div>`,
};

/** Creation form — with two reasons selected. */
export const CreateForm = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <a class="govuk-back-link" href="#">Back to all press notices</a>

        <h1 class="govuk-heading-l">Create press notice</h1>

        <div class="govuk-form-group">
          <fieldset class="govuk-fieldset">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              Statutory reasons for the press notice
            </legend>
            ${renderReasonCheckboxes(["conservation_area", "listed_building"])}
          </fieldset>
        </div>

        <div class="govuk-inset-text">
          An email requesting publication will be sent to <strong>${pnV3.notices[0].notificationEmail}</strong>.
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

/** Variant A — single notice, requested, full detail on card. */
export const OverviewSingleRequested_A = {
  name: "Overview: Single Requested (A)",
  render: () => renderOverviewPage([pnV3.notices[1]], "A"),
};

/** Variant A — two notices (one complete, one requested), full detail on cards. */
export const OverviewMultipleMixed_A = {
  name: "Overview: Multiple Mixed (A)",
  render: () => renderOverviewPage(pnV3.notices, "A"),
};

/** Variant B — single notice, requested, compact card. */
export const OverviewSingleRequested_B = {
  name: "Overview: Single Requested (B)",
  render: () => renderOverviewPage([pnV3.notices[1]], "B"),
};

/** Variant B — two notices, compact cards. */
export const OverviewMultipleMixed_B = {
  name: "Overview: Multiple Mixed (B)",
  render: () => renderOverviewPage(pnV3.notices, "B"),
};

/** Variant B detail page — requested notice. */
export const DetailPageRequested_B = {
  name: "Detail Page: Requested (B)",
  render: () => renderDetailPage(pnV3.notices[1], 1),
};

/** Variant B detail page — completed notice with evidence. */
export const DetailPageComplete_B = {
  name: "Detail Page: Complete (B)",
  render: () => renderDetailPage(pnV3.notices[0], 0),
};

/** Confirm publication — short form (same as v2). */
export const ConfirmPublication = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <a class="govuk-back-link" href="#">Back to press notice</a>

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
            E.g. which publication and page number.
          </div>
          <textarea class="govuk-textarea" id="comment" name="comment" rows="3"></textarea>
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
          Press notices
          <span class="govuk-!-margin-left-2">${renderStatusTag("not_required")}</span>
        </h1>

        <p class="govuk-body">Press notices are not required for this application.</p>

        <p class="govuk-body-s">
          <a class="govuk-link" href="#">Change this decision</a>
        </p>

        <a class="govuk-link" href="#">Back</a>
      </div>
    </div>`,
};
