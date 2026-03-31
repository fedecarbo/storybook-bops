/**
 * Press Notice v2 — Redesigned workflow.
 *
 * Key changes from v1:
 * - Overview-first: landing page is the status/overview (or empty state)
 * - Single clean creation page with reason checkboxes
 * - Single task with evolving status (no separate "confirm" sub-task)
 * - Timeline view showing full lifecycle
 *
 * Stories:
 *   EmptyState, CreateForm, CreateFormOther,
 *   OverviewRequested, ConfirmPublication, ReminderEmail,
 *   OverviewComplete, NotRequired
 */
import { mockData, renderStatusTag } from "../../../helpers";

export default {
  title: "Workflows/Planning Permission/2. Consultation/Press Notice v2",
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

const { pressNoticeReasons, pressNoticeV2: pn, application, people, dates } =
  mockData;

function reasonLabel(key) {
  return pressNoticeReasons[key] || key;
}

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
            <strong>${event.evidence.filename}</strong>
            ${event.evidence.publishedAt ? `<br>Published: ${event.evidence.publishedAt}` : ""}
            ${event.evidence.comment ? `<br>${event.evidence.comment}` : ""}
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

/** Empty state — no press notice exists yet. Two clear actions. */
export const EmptyState = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">
          Press notice
          <span class="govuk-!-margin-left-2">${renderStatusTag("not_started")}</span>
        </h1>

        <p class="govuk-body">No press notice has been created for this application.</p>

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
          An email requesting publication will be sent to <strong>${pn.notificationEmail}</strong>.
        </div>

        <div class="govuk-button-group govuk-!-margin-top-6">
          <button type="submit" class="govuk-button" data-module="govuk-button">
            Send request
          </button>
          <a class="govuk-link" href="#">Back</a>
        </div>
      </div>
    </div>`,
};

/** Creation form — with "Other" reason expanded. */
export const CreateFormOther = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Create press notice</h1>

        <div class="govuk-form-group">
          <fieldset class="govuk-fieldset">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              Statutory reasons for the press notice
            </legend>
            ${renderReasonCheckboxes(["conservation_area", "other"], true)}
          </fieldset>
        </div>

        <div class="govuk-inset-text">
          An email requesting publication will be sent to <strong>${pn.notificationEmail}</strong>.
        </div>

        <div class="govuk-button-group govuk-!-margin-top-6">
          <button type="submit" class="govuk-button" data-module="govuk-button">
            Send request
          </button>
          <a class="govuk-link" href="#">Back</a>
        </div>
      </div>
    </div>`,
};

/** Overview — press notice requested, awaiting publication. */
export const OverviewRequested = {
  render: () => {
    const reasonsList = pn.reasons
      .map((key) => `<li>${reasonLabel(key)}</li>`)
      .join("");

    const timelineEvents = [
      {
        date: "26 Nov 2024",
        label: `Requested — email sent to ${pn.notificationEmail}`,
        status: "complete",
      },
      {
        label: "Confirmation of publication",
        status: "pending",
      },
    ];

    return `
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">
          <h1 class="govuk-heading-l">
            Press notice
            <span class="govuk-!-margin-left-2">${renderStatusTag("requested")}</span>
          </h1>

          ${renderSummaryList([
            {
              key: "Reasons",
              value: `<ul class="govuk-list govuk-list--bullet govuk-!-margin-bottom-0">${reasonsList}</ul>`,
            },
            { key: "Sent to", value: pn.notificationEmail },
            { key: "Requested", value: "26 Nov 2024" },
          ])}

          <p class="govuk-body-s govuk-!-margin-top-2">
            <a class="govuk-link" href="#">Edit details</a>
          </p>

          ${renderTimeline(timelineEvents)}

          <div class="govuk-button-group">
            <a href="#" role="button" draggable="false" class="govuk-button" data-module="govuk-button">
              Confirm publication
            </a>
            <a class="govuk-link" href="#">Send reminder email</a>
          </div>

          <a class="govuk-link" href="#">Back</a>
        </div>
      </div>`;
  },
};

/** Confirm publication — short dedicated page. */
export const ConfirmPublication = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
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
          <a class="govuk-link" href="#">Back</a>
        </div>
      </div>
    </div>`,
};

/** Reminder email preview. */
export const ReminderEmail = {
  render: () =>
    renderEmailPreview({
      subject: `Reminder: press notice evidence needed for ${application.reference}`,
      to: pn.notificationEmail,
      body: `Application reference: ${application.reference}

Address: ${application.address.full}

A press notice was requested for this application on 26 Nov 2024. We have not yet received confirmation of publication.

Please upload evidence of the published notice using the link below:

http://southwark.bops.services/planning_applications/${application.reference}/press_notice/confirmation

Case officer: ${people.caseOfficer.name}`,
    }),
};

/** Overview — complete with evidence in timeline. */
export const OverviewComplete = {
  render: () => {
    const reasonsList = pn.reasons
      .map((key) => `<li>${reasonLabel(key)}</li>`)
      .join("");

    return `
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">
          <h1 class="govuk-heading-l">
            Press notice
            <span class="govuk-!-margin-left-2">${renderStatusTag("complete")}</span>
          </h1>

          ${renderSummaryList([
            {
              key: "Reasons",
              value: `<ul class="govuk-list govuk-list--bullet govuk-!-margin-bottom-0">${reasonsList}</ul>`,
            },
            { key: "Sent to", value: pn.notificationEmail },
            { key: "Requested", value: "26 Nov 2024" },
            { key: "Published", value: "2 Dec 2024" },
            { key: "Comment", value: "Published in Southwark News, page 12" },
          ])}

          ${renderTimeline(pn.timeline)}

          <a class="govuk-link" href="#">Back</a>
        </div>
      </div>`;
  },
};

/** Not required — simple confirmation state. */
export const NotRequired = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">
          Press notice
          <span class="govuk-!-margin-left-2">${renderStatusTag("not_required")}</span>
        </h1>

        <p class="govuk-body">A press notice is not required for this application.</p>

        <p class="govuk-body-s">
          <a class="govuk-link" href="#">Change this decision</a>
        </p>

        <a class="govuk-link" href="#">Back</a>
      </div>
    </div>`,
};
