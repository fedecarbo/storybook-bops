/**
 * Confirm Community Infrastructure Levy (CIL) — the case officer reviews
 * PlanX submission data about potential CIL liability and confirms whether
 * the application is liable for CIL.
 *
 * PlanX may provide a recommendation (liable / exempt) along with the
 * proposed net floor area. The officer confirms or overrides this with a
 * simple Yes / No radio selection.
 *
 * This task appears in Stage 1 (Validation) under "Confirm application
 * requirements".
 */
import { mockData } from "../../../helpers";

export default {
  title: "Workflows/Planning Permission/1. Validation/Confirm CIL",
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (story) =>
      `<div style="max-width: 1100px; margin: 0 auto; padding: 30px 20px;">${story()}</div>`,
  ],
};

const { cilLiability } = mockData;

// ---------------------------------------------------------------------------
// Helper: render PlanX information panel
// ---------------------------------------------------------------------------

function renderPlanxInfo(options = {}) {
  const {
    floorArea = cilLiability.proposedFloorArea,
    result = cilLiability.result,
  } = options;

  if (!floorArea && !result) {
    return `
      <div class="govuk-inset-text">
        No information on potential CIL liability from PlanX.
      </div>`;
  }

  let recommendation = "";
  if (result === "liable") {
    recommendation =
      "Based on the submission data, this application is <strong>likely liable for CIL</strong>.";
  } else if (result && result.startsWith("exempt")) {
    recommendation =
      "Based on the submission data, this application is <strong>likely exempt from CIL</strong>.";
  }

  return `
    <div class="govuk-inset-text">
      <p class="govuk-body">
        <strong>Information from PlanX submission</strong>
      </p>
      ${floorArea ? `<p class="govuk-body">Proposed net floor area: <strong>${floorArea} m²</strong></p>` : ""}
      ${recommendation ? `<p class="govuk-body">${recommendation}</p>` : ""}
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: determine radio labels based on PlanX recommendation
// ---------------------------------------------------------------------------

function getRadioLabels(result) {
  const isLiable = result === "liable";
  const isExempt = result && result.startsWith("exempt");

  const yesLabel = isLiable
    ? 'Yes <strong>(recommended based on submission data)</strong>'
    : "Yes";
  const noLabel = isExempt
    ? 'No <strong>(recommended based on submission data)</strong>'
    : "No";

  return { yesLabel, noLabel };
}

// ---------------------------------------------------------------------------
// Helper: render the CIL confirmation form
// ---------------------------------------------------------------------------

function renderForm(options = {}) {
  const {
    floorArea = cilLiability.proposedFloorArea,
    result = cilLiability.result,
    selected = null, // "yes" | "no" | null
    hasError = false,
  } = options;

  const errorMessage = "Select whether the application is liable for CIL";

  const errorSummary = hasError
    ? `
      <div class="govuk-error-summary" data-module="govuk-error-summary">
        <div role="alert">
          <h2 class="govuk-error-summary__title">There is a problem</h2>
          <div class="govuk-error-summary__body">
            <ul class="govuk-list govuk-error-summary__list">
              <li><a href="#cil-liable-yes">${errorMessage}</a></li>
            </ul>
          </div>
        </div>
      </div>`
    : "";

  const fieldError = hasError
    ? `<p id="cil-liable-error" class="govuk-error-message">
        <span class="govuk-visually-hidden">Error:</span> ${errorMessage}
      </p>`
    : "";

  const errorClass = hasError ? " govuk-form-group--error" : "";

  const { yesLabel, noLabel } = getRadioLabels(result);
  const yesChecked = selected === "yes" ? " checked" : "";
  const noChecked = selected === "no" ? " checked" : "";

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Confirm Community Infrastructure Levy (CIL)</h1>

        ${renderPlanxInfo({ floorArea, result })}

        ${errorSummary}

        <div class="govuk-form-group${errorClass}">
          <fieldset class="govuk-fieldset">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              Is this application liable for CIL?
            </legend>
            ${fieldError}
            <div class="govuk-radios" data-module="govuk-radios">
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="cil-liable-yes" name="cil_liable" type="radio" value="true"${yesChecked}>
                <label class="govuk-label govuk-radios__label" for="cil-liable-yes">
                  ${yesLabel}
                </label>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="cil-liable-no" name="cil_liable" type="radio" value="false"${noChecked}>
                <label class="govuk-label govuk-radios__label" for="cil-liable-no">
                  ${noLabel}
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
  const { liable = true } = options;

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Confirm Community Infrastructure Levy (CIL)</h1>

        <dl class="govuk-summary-list">
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">Application liable for CIL</dt>
            <dd class="govuk-summary-list__value">${liable ? "Yes" : "No"}</dd>
          </div>
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

/** Initial view — PlanX data shows liable recommendation, Yes/No radios unanswered. */
export const InitialView = {
  render: () => renderForm(),
};

/** PlanX recommends exempt — "No" radio has the (recommended) label. */
export const RecommendedExempt = {
  render: () => renderForm({ result: "exempt.size" }),
};

/** No PlanX data — fallback message shown, plain Yes/No without recommendations. */
export const NoPlanxData = {
  render: () => renderForm({ floorArea: null, result: null }),
};

/** Yes selected — case officer confirms the application is liable for CIL. */
export const SelectedYes = {
  render: () => renderForm({ selected: "yes" }),
};

/** No selected — case officer confirms the application is not liable for CIL. */
export const SelectedNo = {
  render: () => renderForm({ selected: "no" }),
};

/** Error state — form submitted without selecting a CIL liability option. */
export const WithErrors = {
  render: () => renderForm({ hasError: true }),
};

/** Completed — read-only summary showing CIL is liable, with Edit button. */
export const Completed = {
  render: () => renderCompletedView({ liable: true }),
};
