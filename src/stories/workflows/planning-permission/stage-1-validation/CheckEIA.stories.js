/**
 * Check Environment Impact Assessment (EIA) — the case officer determines
 * whether the application requires an EIA under the Town and Country
 * Planning (Environmental Impact Assessment) Regulations 2017.
 *
 * If an EIA is required, the determination period extends from 8 to 16
 * weeks. The officer can optionally provide contact details (email,
 * address) and a fee for members of the public to obtain a copy of the
 * Environmental Statement.
 *
 * This task appears in Stage 1 (Validation) under "Confirm application
 * requirements".
 */
import { mockData } from "../../../helpers";

export default {
  title: "Workflows/Planning Permission/1. Validation/Check EIA",
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (story) =>
      `<div style="max-width: 1100px; margin: 0 auto; padding: 30px 20px;">${story()}</div>`,
  ],
};

const { eia, documents } = mockData;

// ---------------------------------------------------------------------------
// Helper: render documents accordion (collapsed details component)
// ---------------------------------------------------------------------------

function renderDocumentsAccordion() {
  const docs = documents.slice(0, 3);
  const docItems = docs
    .map(
      (doc) => `
      <li>
        <a class="govuk-link" href="#">${doc.name}</a>
      </li>`,
    )
    .join("");

  return `
    <details class="govuk-details">
      <summary class="govuk-details__summary">
        <span class="govuk-details__summary-text">Documents</span>
      </summary>
      <div class="govuk-details__text">
        <ul class="govuk-list govuk-list--bullet">
          ${docItems}
        </ul>
        <a class="govuk-link" href="#">View all documents</a>
      </div>
    </details>`;
}

// ---------------------------------------------------------------------------
// Helper: render the EIA form
// ---------------------------------------------------------------------------

function renderForm(options = {}) {
  const {
    selected = null, // "yes" | "no" | null
    emailAddress = "",
    address = "",
    fee = "",
    hasError = false,
    errorType = "required", // "required" | "cross-field"
  } = options;

  // --- Error handling ---
  let errorSummary = "";
  let fieldError = "";
  let feeFieldError = "";
  let addressFieldError = "";
  let radioErrorClass = "";
  let feeErrorClass = "";
  let addressErrorClass = "";

  if (hasError && errorType === "required") {
    const msg =
      "Select whether an Environment Impact Assessment is required.";
    errorSummary = `
      <div class="govuk-error-summary" data-module="govuk-error-summary">
        <div role="alert">
          <h2 class="govuk-error-summary__title">There is a problem</h2>
          <div class="govuk-error-summary__body">
            <ul class="govuk-list govuk-error-summary__list">
              <li><a href="#eia-required-yes">${msg}</a></li>
            </ul>
          </div>
        </div>
      </div>`;
    fieldError = `
      <p id="eia-required-error" class="govuk-error-message">
        <span class="govuk-visually-hidden">Error:</span> ${msg}
      </p>`;
    radioErrorClass = " govuk-form-group--error";
  }

  if (hasError && errorType === "cross-field") {
    const feeMsg = "Enter the fee to obtain a copy of the EIA";
    errorSummary = `
      <div class="govuk-error-summary" data-module="govuk-error-summary">
        <div role="alert">
          <h2 class="govuk-error-summary__title">There is a problem</h2>
          <div class="govuk-error-summary__body">
            <ul class="govuk-list govuk-error-summary__list">
              <li><a href="#eia-fee">${feeMsg}</a></li>
            </ul>
          </div>
        </div>
      </div>`;
    feeFieldError = `
      <p id="eia-fee-error" class="govuk-error-message">
        <span class="govuk-visually-hidden">Error:</span> ${feeMsg}
      </p>`;
    feeErrorClass = " govuk-form-group--error";
  }

  // --- Conditional fields (shown when Yes is selected) ---
  const showConditional = selected === "yes";
  const conditionalStyle = showConditional ? "" : ' style="display: none;"';

  const conditionalFields = `
    <div class="govuk-radios__conditional" id="conditional-eia-yes"${conditionalStyle}>
      <div class="govuk-form-group">
        <label class="govuk-label" for="eia-email-address">
          Enter an email address where members of the public can request a copy of the Environmental Statement (optional).
        </label>
        <input class="govuk-input" id="eia-email-address" name="email_address" type="email" value="${emailAddress}">
      </div>

      <div class="govuk-form-group${addressErrorClass}">
        <label class="govuk-label" for="eia-address">
          Enter an address where members of the public can view or request a copy of the Environmental Statement. Include name/number, street, town, postcode (optional).
        </label>
        ${addressFieldError}
        <input class="govuk-input${addressErrorClass ? " govuk-input--error" : ""}" id="eia-address" name="address" type="text" value="${address}">
      </div>

      <div class="govuk-form-group${feeErrorClass}">
        <label class="govuk-label" for="eia-fee">
          Enter the fee to obtain a hard copy of the Environmental Statement (optional).
        </label>
        ${feeFieldError}
        <div class="govuk-input__wrapper">
          <div class="govuk-input__prefix" aria-hidden="true">&pound;</div>
          <input class="govuk-input govuk-input--width-5${feeErrorClass ? " govuk-input--error" : ""}" id="eia-fee" name="fee" type="text" inputmode="numeric" value="${fee}">
        </div>
      </div>
    </div>`;

  const yesChecked = selected === "yes" ? " checked" : "";
  const noChecked = selected === "no" ? " checked" : "";

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Check Environment Impact Assessment</h1>

        ${renderDocumentsAccordion()}

        <p class="govuk-body">
          <a class="govuk-link" href="https://www.gov.uk/government/publications/environmental-impact-assessment-screening-checklist" target="_blank" rel="noopener noreferrer">
            Check EIA guidance (opens in new tab)
          </a>
        </p>

        ${errorSummary}

        <div class="govuk-form-group${radioErrorClass}">
          <fieldset class="govuk-fieldset">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              Is an Environmental Impact Assessment required?
            </legend>
            ${fieldError}
            <div class="govuk-radios" data-module="govuk-radios">
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="eia-required-yes" name="eia_required" type="radio" value="true" data-aria-controls="conditional-eia-yes"${yesChecked}>
                <label class="govuk-label govuk-radios__label" for="eia-required-yes">
                  Yes
                </label>
                <div id="eia-required-yes-hint" class="govuk-hint govuk-radios__hint">
                  This application is subject to an EIA. The determination period will be extended to 16 weeks.
                </div>
              </div>

              ${conditionalFields}

              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="eia-required-no" name="eia_required" type="radio" value="false"${noChecked}>
                <label class="govuk-label govuk-radios__label" for="eia-required-no">
                  No
                </label>
              </div>
            </div>
          </fieldset>
        </div>

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
    required = true,
    emailAddress = "",
    address = "",
    fee = "",
  } = options;

  const successMessage = required
    ? "Application marked as requiring an EIA. The determination period is extended to 16 weeks."
    : "Application marked as not requiring an EIA.";

  let detailRows = "";
  if (required && emailAddress) {
    detailRows += `
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">Email address</dt>
        <dd class="govuk-summary-list__value">${emailAddress}</dd>
      </div>`;
  }
  if (required && address) {
    detailRows += `
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">Address</dt>
        <dd class="govuk-summary-list__value">${address}</dd>
      </div>`;
  }
  if (required && fee) {
    detailRows += `
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">Fee</dt>
        <dd class="govuk-summary-list__value">&pound;${fee}</dd>
      </div>`;
  }

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Check Environment Impact Assessment</h1>

        <div class="govuk-notification-banner govuk-notification-banner--success" role="alert" data-module="govuk-notification-banner">
          <div class="govuk-notification-banner__header">
            <h2 class="govuk-notification-banner__title" id="govuk-notification-banner-title">
              Success
            </h2>
          </div>
          <div class="govuk-notification-banner__content">
            <p class="govuk-notification-banner__heading">${successMessage}</p>
          </div>
        </div>

        <dl class="govuk-summary-list">
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">EIA required</dt>
            <dd class="govuk-summary-list__value">${required ? "Yes" : "No"}</dd>
          </div>
          ${detailRows}
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

/** Initial view — Yes/No radios unanswered, conditional fields hidden. */
export const InitialView = {
  render: () => renderForm(),
};

/** No selected — EIA is not required. Simple form, no additional fields. */
export const SelectedNo = {
  render: () => renderForm({ selected: "no" }),
};

/** Yes selected — conditional fields visible and populated with mock data. */
export const SelectedYes = {
  render: () =>
    renderForm({
      selected: "yes",
      emailAddress: eia.emailAddress,
      address: eia.address,
      fee: eia.fee,
    }),
};

/** Yes selected, fields empty — valid state where officer confirms EIA is required but doesn't provide optional public access details. */
export const SelectedYesMinimal = {
  render: () => renderForm({ selected: "yes" }),
};

/** Error state — form submitted without selecting an option. */
export const WithErrors = {
  render: () => renderForm({ hasError: true, errorType: "required" }),
};

/** Completed — EIA required, with all contact details. */
export const Completed = {
  render: () =>
    renderCompletedView({
      required: true,
      emailAddress: eia.emailAddress,
      address: eia.address,
      fee: eia.fee,
    }),
};

/** Completed — EIA not required. Simple summary. */
export const CompletedNotRequired = {
  render: () => renderCompletedView({ required: false }),
};
