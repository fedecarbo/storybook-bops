/**
 * Add Reporting Details — the case officer selects the development reporting
 * type that applies to this application, used for national statistics returns.
 *
 * The available reporting types are filtered by the application type (e.g. a
 * householder application shows Q21 — Householder developments). The officer
 * also answers whether the local planning authority is the land owner, and if
 * so, whether the LA is carrying out the proposed works (Regulation 3 vs 4).
 *
 * This task appears in Stage 1 (Validation) under "Check application details".
 */
import { mockData } from "../../../helpers";

export default {
  title: "Workflows/Planning Permission/1. Validation/Add Reporting Details",
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (story) =>
      `<div style="max-width: 1100px; margin: 0 auto; padding: 30px 20px;">${story()}</div>`,
  ],
};

const { reportingTypes, application } = mockData;

// ---------------------------------------------------------------------------
// Helper: render a single reporting type radio item
// ---------------------------------------------------------------------------

function renderReportingTypeRadio(type, options = {}) {
  const { selected = false, index = 0 } = options;
  const checked = selected ? " checked" : "";
  const inputId = `reporting-type-${index}`;

  let hint = "";
  if (type.guidance) {
    hint += `<div id="${inputId}-hint" class="govuk-hint govuk-radios__hint">${type.guidance}</div>`;
  }
  if (type.guidanceLink) {
    hint += `<div class="govuk-hint govuk-radios__hint"><a class="govuk-link" href="${type.guidanceLink}" target="_blank" rel="noopener noreferrer">Read more guidance on GOV.UK</a></div>`;
  }
  if (type.legislation) {
    hint += `<div class="govuk-hint govuk-radios__hint"><strong>Legislation:</strong> ${type.legislation}</div>`;
  }

  return `
    <div class="govuk-radios__item">
      <input class="govuk-radios__input" id="${inputId}" name="reporting_type_id" type="radio" value="${type.id}"${checked}
        ${type.guidance || type.legislation ? `aria-describedby="${inputId}-hint"` : ""}>
      <label class="govuk-label govuk-radios__label" for="${inputId}">
        ${type.fullDescription}
      </label>
      ${hint}
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: render the regulation questions (LA ownership + sub-question)
// ---------------------------------------------------------------------------

function renderRegulationQuestions(options = {}) {
  const { ownerSelected = null, carryingOutSelected = null } = options;

  const ownerYesChecked = ownerSelected === "yes" ? " checked" : "";
  const ownerNoChecked = ownerSelected === "no" ? " checked" : "";
  const carryingOutYesChecked =
    carryingOutSelected === "yes" ? " checked" : "";
  const carryingOutNoChecked = carryingOutSelected === "no" ? " checked" : "";

  const subQuestion =
    ownerSelected === "yes"
      ? `
      <div class="govuk-radios__conditional" id="conditional-regulation-yes">
        <div class="govuk-form-group">
          <fieldset class="govuk-fieldset">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--s">
              Is the local planning authority carrying out the works proposed?
            </legend>
            <div class="govuk-radios" data-module="govuk-radios">
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="regulation-3-yes" name="regulation_3" type="radio" value="true"${carryingOutYesChecked}>
                <label class="govuk-label govuk-radios__label" for="regulation-3-yes">Yes</label>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="regulation-3-no" name="regulation_3" type="radio" value="false"${carryingOutNoChecked}>
                <label class="govuk-label govuk-radios__label" for="regulation-3-no">No</label>
              </div>
            </div>
          </fieldset>
        </div>
      </div>`
      : "";

  return `
    <div class="govuk-form-group">
      <fieldset class="govuk-fieldset">
        <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
          Is the local planning authority the owner of this land?
        </legend>
        <div class="govuk-radios" data-module="govuk-radios">
          <div class="govuk-radios__item">
            <input class="govuk-radios__input" id="regulation-yes" name="regulation" type="radio" value="true"${ownerYesChecked}
              data-aria-controls="conditional-regulation-yes">
            <label class="govuk-label govuk-radios__label" for="regulation-yes">Yes</label>
          </div>
          ${subQuestion}
          <div class="govuk-radios__item">
            <input class="govuk-radios__input" id="regulation-no" name="regulation" type="radio" value="false"${ownerNoChecked}>
            <label class="govuk-label govuk-radios__label" for="regulation-no">No</label>
          </div>
        </div>
      </fieldset>
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: render the full reporting details form
// ---------------------------------------------------------------------------

function renderForm(options = {}) {
  const {
    types = reportingTypes,
    selectedTypeId = null,
    ownerSelected = null,
    carryingOutSelected = null,
    hasError = false,
    errorMessage = "Please select a development type for reporting",
  } = options;

  const errorSummary = hasError
    ? `
      <div class="govuk-error-summary" data-module="govuk-error-summary">
        <div role="alert">
          <h2 class="govuk-error-summary__title">There is a problem</h2>
          <div class="govuk-error-summary__body">
            <ul class="govuk-list govuk-error-summary__list">
              <li><a href="#reporting-type-0">${errorMessage}</a></li>
            </ul>
          </div>
        </div>
      </div>`
    : "";

  const fieldError = hasError
    ? `<p id="reporting-type-error" class="govuk-error-message">
        <span class="govuk-visually-hidden">Error:</span> ${errorMessage}
      </p>`
    : "";

  const errorClass = hasError ? " govuk-form-group--error" : "";

  // Empty state — no reporting types configured for this application type
  if (types.length === 0) {
    return `
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">
          <h1 class="govuk-heading-l">Add reporting details</h1>

          <div class="govuk-inset-text">
            No applicable reporting types. Please configure them for the application type if they are required.
          </div>

          ${renderRegulationQuestions({ ownerSelected, carryingOutSelected })}

          <div class="govuk-button-group">
            <button type="submit" class="govuk-button" data-module="govuk-button">
              Save and mark as complete
            </button>
            <a class="govuk-link" href="#">Back</a>
          </div>
        </div>
      </div>`;
  }

  const radios = types
    .map((type, i) =>
      renderReportingTypeRadio(type, {
        selected: type.id === selectedTypeId,
        index: i,
      }),
    )
    .join("");

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Add reporting details</h1>

        ${errorSummary}

        <div class="govuk-form-group${errorClass}">
          <fieldset class="govuk-fieldset">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              Select development type
            </legend>
            ${fieldError}
            <div class="govuk-radios" data-module="govuk-radios">
              ${radios}
            </div>
          </fieldset>
        </div>

        ${renderRegulationQuestions({ ownerSelected, carryingOutSelected })}

        <div class="govuk-button-group">
          <button type="submit" class="govuk-button" data-module="govuk-button">
            Save and mark as complete
          </button>
          <a class="govuk-link" href="#">Back</a>
        </div>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: completed / read-only view
// ---------------------------------------------------------------------------

function renderCompletedView(options = {}) {
  const {
    selectedType = reportingTypes[0],
    ownerSelected = "no",
    carryingOutSelected = null,
  } = options;

  let regulationRow = `
    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">Local authority is land owner</dt>
      <dd class="govuk-summary-list__value">No</dd>
    </div>`;

  if (ownerSelected === "yes") {
    const regLabel =
      carryingOutSelected === "yes"
        ? "Yes — Regulation 3 (LA carrying out works)"
        : "No — Regulation 4 (LA not carrying out works)";

    regulationRow = `
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">Local authority is land owner</dt>
        <dd class="govuk-summary-list__value">Yes</dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">LA carrying out works</dt>
        <dd class="govuk-summary-list__value">${regLabel}</dd>
      </div>`;
  }

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Add reporting details</h1>

        <dl class="govuk-summary-list">
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">Development type</dt>
            <dd class="govuk-summary-list__value">${selectedType.fullDescription}</dd>
          </div>
          ${regulationRow}
        </dl>

        <div class="govuk-button-group">
          <button type="submit" class="govuk-button govuk-button--secondary" data-module="govuk-button">
            Edit
          </button>
        </div>
      </div>
    </div>`;
}

// ===========================================================================
// STORIES
// ===========================================================================

/** Initial view — form with reporting type radio buttons, nothing selected. */
export const InitialView = {
  render: () => renderForm(),
};

/** Reporting type selected — Q21 Householder developments checked, regulation questions visible but unanswered. */
export const WithTypeSelected = {
  render: () => renderForm({ selectedTypeId: 1 }),
};

/** Regulation 3 — Q21 selected, LA is owner, and LA is carrying out the works. */
export const WithRegulation3 = {
  render: () =>
    renderForm({
      selectedTypeId: 1,
      ownerSelected: "yes",
      carryingOutSelected: "yes",
    }),
};

/** Regulation 4 — Q21 selected, LA is owner, but LA is NOT carrying out the works. */
export const WithRegulation4 = {
  render: () =>
    renderForm({
      selectedTypeId: 1,
      ownerSelected: "yes",
      carryingOutSelected: "no",
    }),
};

/** No reporting types available — empty state when the application type has no configured types. */
export const NoTypesAvailable = {
  render: () => renderForm({ types: [] }),
};

/** Error state — form submitted without selecting a reporting type. */
export const WithErrors = {
  render: () => renderForm({ hasError: true }),
};

/** Completed — read-only summary showing saved selections with Edit button. */
export const Completed = {
  render: () => renderCompletedView(),
};

/** Completed with Regulation 3 — LA owns the land and is carrying out works. */
export const CompletedWithRegulation3 = {
  render: () =>
    renderCompletedView({
      ownerSelected: "yes",
      carryingOutSelected: "yes",
    }),
};
