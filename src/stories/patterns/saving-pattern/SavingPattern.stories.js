/**
 * Saving pattern — how BOPS lets caseworkers save their work on a task.
 *
 * Two save actions ("Save and mark as complete" vs "Save changes"), a strong
 * success confirmation, and a return to the task list with the task now
 * showing as Completed. Markup mirrors the real BOPS task stories so the
 * pattern preview reads like the live application.
 */
import { mockData, renderStatusTag } from "../../helpers";

const { application } = mockData;

export default {
  title: "Patterns/Saving pattern",
  parameters: {
    layout: "padded",
  },
  decorators: [
    (story) =>
      `<div style="max-width: 1100px; margin: 0 auto; padding: 20px;">${story()}</div>`,
  ],
};

// ---------------------------------------------------------------------------
// Wireframe shell — matches the Asking-multiple-things pattern so all pattern
// previews share the same chrome.
// ---------------------------------------------------------------------------

function renderShell(innerHtml, { caption } = {}) {
  return `
    <div class="sp-wireframe">
      <div class="sp-wireframe__header">
        <span class="sp-wireframe__logo">GOV.UK</span>
        <span class="sp-wireframe__service">Back Office Planning System</span>
      </div>
      <div class="sp-wireframe__bar">
        <span>${application.reference}</span>
        <span style="margin: 0 8px; opacity: 0.5;">|</span>
        <span>${application.address}</span>
      </div>
      <div class="sp-wireframe__body">
        ${innerHtml}
      </div>
      ${caption ? `<div class="sp-wireframe__caption">${caption}</div>` : ""}
    </div>

    <style>
      .sp-wireframe {
        border: 1px solid #b1b4b6;
        border-radius: 6px;
        overflow: hidden;
        font-family: "GDS Transport", arial, sans-serif;
        background: #fff;
      }
      .sp-wireframe__header {
        background: #0b0c0c;
        padding: 10px 20px;
        display: flex;
        align-items: baseline;
        gap: 12px;
      }
      .sp-wireframe__logo {
        color: #fff;
        font-weight: bold;
        font-size: 18px;
      }
      .sp-wireframe__service {
        color: #fff;
        font-size: 16px;
      }
      .sp-wireframe__bar {
        background: #f3f2f1;
        padding: 8px 20px;
        font-size: 14px;
        color: #0b0c0c;
        border-bottom: 1px solid #b1b4b6;
      }
      .sp-wireframe__body {
        padding: 30px 40px 40px;
      }
      .sp-wireframe__caption {
        background: #f3f2f1;
        border-top: 1px solid #b1b4b6;
        padding: 10px 20px;
        font-size: 13px;
        color: #505a5f;
      }
    </style>`;
}

// ---------------------------------------------------------------------------
// A compact example of a real BOPS task form — the "Confirm site notice is in
// place" task. Used as the body above the save buttons so the button variants
// sit in a realistic context instead of floating on their own.
// ---------------------------------------------------------------------------

function renderTaskFormBody() {
  return `
    <h1 class="govuk-heading-l">Confirm site notice is in place</h1>

    <div class="govuk-form-group">
      <fieldset class="govuk-fieldset" role="group">
        <legend class="govuk-fieldset__legend govuk-fieldset__legend--s">
          What date was the site notice displayed?
        </legend>
        <div class="govuk-date-input">
          <div class="govuk-date-input__item">
            <div class="govuk-form-group">
              <label class="govuk-label govuk-date-input__label" for="displayed-day">Day</label>
              <input class="govuk-input govuk-date-input__input govuk-input--width-2" id="displayed-day" name="displayed[day]" type="text" inputmode="numeric" value="12">
            </div>
          </div>
          <div class="govuk-date-input__item">
            <div class="govuk-form-group">
              <label class="govuk-label govuk-date-input__label" for="displayed-month">Month</label>
              <input class="govuk-input govuk-date-input__input govuk-input--width-2" id="displayed-month" name="displayed[month]" type="text" inputmode="numeric" value="04">
            </div>
          </div>
          <div class="govuk-date-input__item">
            <div class="govuk-form-group">
              <label class="govuk-label govuk-date-input__label" for="displayed-year">Year</label>
              <input class="govuk-input govuk-date-input__input govuk-input--width-4" id="displayed-year" name="displayed[year]" type="text" inputmode="numeric" value="2026">
            </div>
          </div>
        </div>
      </fieldset>
    </div>

    <div class="govuk-form-group">
      <label class="govuk-label govuk-label--s" for="evidence-upload">
        Upload evidence of site notice in place
      </label>
      <div class="govuk-hint">Add any photos of the site notice being displayed.</div>
      <input class="govuk-file-upload" id="evidence-upload" name="documents[]" type="file" multiple>
    </div>`;
}

// ---------------------------------------------------------------------------
// Story 1 — Save and mark as complete (primary action)
// ---------------------------------------------------------------------------

export const SaveAndMarkAsComplete = {
  name: "Save and mark as complete (primary)",
  render: () =>
    renderShell(
      `
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">
          ${renderTaskFormBody()}

          <div class="govuk-button-group govuk-!-padding-top-4">
            <button type="submit" class="govuk-button" data-module="govuk-button">
              Save and mark as complete
            </button>
            <a class="govuk-link" href="#">Back</a>
          </div>
        </div>
      </div>
    `,
      {
        caption:
          "The primary save action on a task form. 'Save and mark as complete' persists the user's work AND changes the task's status to Completed on the task list. Use this when the user is declaring the task done.",
      }
    ),
};

// ---------------------------------------------------------------------------
// Story 2 — Save changes only (secondary action)
// ---------------------------------------------------------------------------

export const SaveChangesOnly = {
  name: "Save changes (secondary)",
  render: () =>
    renderShell(
      `
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">
          ${renderTaskFormBody()}

          <div class="govuk-button-group govuk-!-padding-top-4">
            <button type="submit" class="govuk-button govuk-button--secondary" data-module="govuk-button">
              Save changes
            </button>
            <a class="govuk-link" href="#">Back</a>
          </div>
        </div>
      </div>
    `,
      {
        caption:
          "The secondary save action. 'Save changes' persists the user's work without marking the task complete, so they can come back to it later. Use this for in-progress work or when a caseworker is interrupted.",
      }
    ),
};

// ---------------------------------------------------------------------------
// Story 3 — Success confirmation banner
// ---------------------------------------------------------------------------

export const SuccessBanner = {
  name: "Success confirmation",
  render: () =>
    renderShell(
      `
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">
          <div class="govuk-notification-banner govuk-notification-banner--success" role="alert"
            aria-labelledby="govuk-notification-banner-title"
            data-module="govuk-notification-banner">
            <div class="govuk-notification-banner__header">
              <h2 class="govuk-notification-banner__title" id="govuk-notification-banner-title">
                Success
              </h2>
            </div>
            <div class="govuk-notification-banner__content">
              <h3 class="govuk-notification-banner__heading">
                Site notice confirmation has been saved and the task has been marked as complete.
              </h3>
            </div>
          </div>

          <h1 class="govuk-heading-l">Consultation</h1>
          <p class="govuk-body">Return to the task list to continue the next task.</p>
          <a class="govuk-link" href="#">Back to application overview</a>
        </div>
      </div>
    `,
      {
        caption:
          "The success banner names exactly what was saved and what state changed. Specific wording beats a generic 'Saved successfully' — it gives caseworkers confidence their work landed and reminds them what they just did.",
      }
    ),
};

// ---------------------------------------------------------------------------
// Story 4 — Return to the task list with the task now Completed
// ---------------------------------------------------------------------------

function renderConsultationTaskList() {
  const tasks = [
    { name: "Select consultees", status: "complete" },
    { name: "Send site notice", status: "complete" },
    { name: "Confirm site notice is in place", status: "complete" },
    { name: "Send letters to neighbours", status: "in_progress" },
    { name: "Create press notice", status: "not_started" },
    { name: "View consultee responses", status: "not_started" },
  ];

  const items = tasks
    .map(
      (task) => `
      <li class="app-task-list__item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #b1b4b6;">
        <span class="app-task-list__task-name"><a class="govuk-link" href="#">${task.name}</a></span>
        <span class="app-task-list__task-tag">${renderStatusTag(task.status)}</span>
      </li>`
    )
    .join("");

  return `
    <h2 class="govuk-heading-m">Consultation</h2>
    <ul class="app-task-list__items" style="list-style: none; padding: 0; margin: 0;">
      ${items}
    </ul>`;
}

export const ReturnToTaskList = {
  name: "Return to task list (what's next)",
  render: () =>
    renderShell(
      `
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">
          <span class="govuk-caption-l">${application.reference}</span>
          <h1 class="govuk-heading-l">Application</h1>

          ${renderConsultationTaskList()}
        </div>
      </div>
    `,
      {
        caption:
          "After saving, the user lands back on the task list. The task they just completed now shows a 'Completed' tag, and the next task they could pick up is still visible in context — so the save action flows naturally into the next piece of work.",
      }
    ),
};
