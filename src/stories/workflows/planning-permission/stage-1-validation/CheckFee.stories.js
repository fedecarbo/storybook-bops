/**
 * Check Fee — the case officer reviews whether the correct planning
 * application fee has been paid.
 *
 * The page shows the payment information (amount, reference, session ID)
 * and a fee calculation breakdown (application fee, exemptions, reductions,
 * discount, total). The officer selects "Yes" if the fee is valid, or "No"
 * if it is incorrect.
 *
 * Selecting "No" redirects to a fee change request form where the officer
 * explains why the fee is wrong and what the applicant needs to do. The
 * system emails the applicant, who can respond. Once the applicant responds,
 * the officer reviews and confirms the updated payment amount.
 *
 * This task appears in Stage 1 (Validation) under "Check application details".
 */
import { mockData } from "../../../helpers";

export default {
  title: "Workflows/Planning Permission/1. Validation/Check Fee",
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (story) =>
      `<div style="max-width: 1100px; margin: 0 auto; padding: 30px 20px;">${story()}</div>`,
  ],
};

const { application, people, fee, feeChangeRequest } = mockData;

// ---------------------------------------------------------------------------
// Helper: payment information table
// ---------------------------------------------------------------------------

function renderPaymentInfoTable(options = {}) {
  const {
    amount = fee.amount,
    reference = fee.paymentReference,
    sessionId = fee.sessionId,
    isExempt = fee.exempt,
  } = options;

  return `
    <h3 class="govuk-heading-m">Payment information</h3>
    <table class="govuk-table govuk-!-margin-bottom-2">
      <tbody class="govuk-table__body">
        <tr class="govuk-table__row">
          <th scope="row" class="govuk-table__header">Fee paid</th>
          <td class="govuk-table__cell">&pound;${amount}</td>
        </tr>
        <tr class="govuk-table__row">
          <th scope="row" class="govuk-table__header">Payment reference</th>
          <td class="govuk-table__cell">${isExempt ? "Exempt" : reference}</td>
        </tr>
        <tr class="govuk-table__row">
          <th scope="row" class="govuk-table__header">Session ID</th>
          <td class="govuk-table__cell">${sessionId}</td>
        </tr>
      </tbody>
    </table>`;
}

// ---------------------------------------------------------------------------
// Helper: fee calculation table
// ---------------------------------------------------------------------------

function renderFeeCalculationTable() {
  const calc = fee.calculation;
  const exemptionText =
    calc.exemptions.length > 0 ? calc.exemptions.join(", ") : "None";
  const reductionText =
    calc.reductions.length > 0 ? calc.reductions.join(", ") : "None";

  return `
    <h3 class="govuk-heading-m govuk-!-margin-top-8">Fee calculation</h3>
    <table class="govuk-table">
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th scope="col" class="govuk-table__header">Detail</th>
          <th scope="col" class="govuk-table__header govuk-table__header--numeric">Amount</th>
        </tr>
      </thead>
      <tbody class="govuk-table__body">
        <tr class="govuk-table__row">
          <th scope="row" class="govuk-table__header">Application Fee</th>
          <td class="govuk-table__cell govuk-table__cell--numeric">&pound;${calc.applicationFee}</td>
        </tr>
        <tr class="govuk-table__row">
          <th scope="row" class="govuk-table__header">Exemptions</th>
          <td class="govuk-table__cell govuk-table__cell--numeric">${exemptionText}</td>
        </tr>
        <tr class="govuk-table__row">
          <th scope="row" class="govuk-table__header">Reductions</th>
          <td class="govuk-table__cell govuk-table__cell--numeric">${reductionText}</td>
        </tr>
        <tr class="govuk-table__row">
          <th scope="row" class="govuk-table__header">Discount</th>
          <td class="govuk-table__cell govuk-table__cell--numeric">&minus;&pound;${calc.discount}</td>
        </tr>
        <tr class="govuk-table__row">
          <th scope="row" class="govuk-table__header">Total</th>
          <td class="govuk-table__cell govuk-table__cell--numeric">&pound;${calc.total}</td>
        </tr>
      </tbody>
    </table>`;
}

// ---------------------------------------------------------------------------
// Helper: officer check form (Yes/No radios)
// ---------------------------------------------------------------------------

function renderCheckForm(options = {}) {
  const {
    selectedValue = null,
    showCalculation = true,
    isExempt = false,
    hasError = false,
    errorMessage = "Select Yes or No to continue",
  } = options;

  const yesChecked = selectedValue === "yes" ? " checked" : "";
  const noChecked = selectedValue === "no" ? " checked" : "";

  const errorSummary = hasError
    ? `
      <div class="govuk-error-summary" data-module="govuk-error-summary">
        <div role="alert">
          <h2 class="govuk-error-summary__title">There is a problem</h2>
          <div class="govuk-error-summary__body">
            <ul class="govuk-list govuk-error-summary__list">
              <li><a href="#valid-fee">${errorMessage}</a></li>
            </ul>
          </div>
        </div>
      </div>`
    : "";

  const fieldError = hasError
    ? `<p id="valid-fee-error" class="govuk-error-message">
        <span class="govuk-visually-hidden">Error:</span> ${errorMessage}
      </p>`
    : "";

  const errorClass = hasError ? " govuk-form-group--error" : "";

  const paymentTable = isExempt
    ? renderPaymentInfoTable({ amount: "0.00", isExempt: true })
    : renderPaymentInfoTable();

  const calculationSection = showCalculation && !isExempt
    ? renderFeeCalculationTable()
    : "";

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Check fee</h1>

        ${errorSummary}

        ${paymentTable}

        ${calculationSection}

        <div class="govuk-form-group${errorClass} govuk-!-margin-top-6">
          <fieldset class="govuk-fieldset">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              Is the fee valid?
            </legend>
            ${fieldError}
            <p class="govuk-!-margin-top-0 govuk-!-margin-bottom-4">
              <a href="https://ecab.planningportal.co.uk/uploads/english_application_fees.pdf" class="govuk-link" target="_blank">
                A guide to the Fees for Planning Applications in England
              </a>
            </p>
            <div class="govuk-radios" data-module="govuk-radios">
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="valid-fee-yes" name="valid_fee" type="radio" value="true"${yesChecked}>
                <label class="govuk-label govuk-radios__label" for="valid-fee-yes">Yes</label>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="valid-fee-no" name="valid_fee" type="radio" value="false"${noChecked}>
                <label class="govuk-label govuk-radios__label" for="valid-fee-no">No</label>
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
// Helper: fee change request form
// ---------------------------------------------------------------------------

function renderFeeChangeRequestForm(options = {}) {
  const {
    reason = "",
    suggestion = "",
  } = options;

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Request other validation change (fee)</h1>

        ${renderPaymentInfoTable()}

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--m" for="fee-reason">
            Tell the applicant why the fee is incorrect
          </label>
          <div id="fee-reason-hint" class="govuk-hint">
            Use plain English to explain why the fee is wrong. This message will be shown to the applicant
          </div>
          <textarea class="govuk-textarea" id="fee-reason" name="reason" rows="5" aria-describedby="fee-reason-hint">${reason}</textarea>
        </div>

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--m" for="fee-suggestion">
            Tell the applicant what they need to do
          </label>
          <div id="fee-suggestion-hint" class="govuk-hint">
            If the applicant needs to provide evidence, give examples of what you can accept. If the fee exemption relates to disability, use the phrase &lsquo;documents to support your fee exemption&rsquo; rather than &lsquo;evidence of your disability&rsquo;.
          </div>
          <textarea class="govuk-textarea" id="fee-suggestion" name="suggestion" rows="5" aria-describedby="fee-suggestion-hint">${suggestion}</textarea>
        </div>

        <details class="govuk-details" data-module="govuk-details">
          <summary class="govuk-details__summary">
            <span class="govuk-details__summary-text">
              View guidance on supporting documents
            </span>
          </summary>
          <div class="govuk-details__text">
            <ul class="govuk-list govuk-list--bullet">
              <li>PIP award letters</li>
              <li>supporting statements, such as from a council or therapist</li>
              <li>NHS letters</li>
              <li>disabled person's bus pass, blue badges or related documents</li>
            </ul>
          </div>
        </details>

        <div class="govuk-button-group">
          <button type="submit" class="govuk-button" data-module="govuk-button">
            Send request
          </button>
          <a class="govuk-link" href="#">Back</a>
        </div>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: fee change request view (pending / applicant responded)
// ---------------------------------------------------------------------------

function renderFeeChangeRequestView(options = {}) {
  const { state = "pending" } = options;

  const heading =
    state === "responded"
      ? "Check applicant response and update fee paid"
      : "View fee change request";

  const applicantResponseSection =
    state === "responded"
      ? `
        <h2 class="govuk-heading-m">Applicant response</h2>
        <div class="govuk-inset-text">
          <p>${feeChangeRequest.response}</p>
          <p>${feeChangeRequest.respondedAt}</p>
        </div>

        <div class="govuk-form-group">
          <h2 class="govuk-heading-m">Confirm total fee paid</h2>
          <ul class="govuk-list govuk-list--bullet">
            <li>check that the correct fee has been received</li>
            <li>update the total fee paid</li>
            <li>if the fee has been refunded, enter 0</li>
          </ul>
          <div class="govuk-input__wrapper">
            <div class="govuk-input__prefix" aria-hidden="true">&pound;</div>
            <input class="govuk-input govuk-input--width-10" id="payment-amount" name="payment_amount" type="text" value="258.00">
          </div>
        </div>

        <div class="govuk-button-group">
          <button type="submit" class="govuk-button" data-module="govuk-button">
            Mark as valid
          </button>
          <a class="govuk-link" href="#">Back</a>
        </div>`
      : `
        <div class="govuk-button-group">
          <a class="govuk-link" href="#">Cancel fee change request</a>
        </div>`;

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">${heading}</h1>

        <p class="govuk-body">
          Invalid fee previously paid: <strong>&pound;${feeChangeRequest.invalidAmount}</strong>
        </p>

        <h2 class="govuk-heading-m">Officer request</h2>
        <div class="govuk-inset-text govuk-!-margin-bottom-3">
          <p>
            <strong>Reason fee is invalid: </strong>${feeChangeRequest.reason}
          </p>
          <p>
            <strong>What the applicant needs to do: </strong>${feeChangeRequest.suggestion}
          </p>
          <p>${feeChangeRequest.createdAt}</p>
        </div>

        ${applicantResponseSection}
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: completed view
// ---------------------------------------------------------------------------

function renderCompletedView() {
  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Check fee</h1>

        ${renderPaymentInfoTable()}

        <p class="govuk-body">
          <strong class="govuk-tag govuk-tag--green">Valid</strong>
          Fee was marked as valid
        </p>

        <div class="govuk-button-group">
          <button type="submit" class="govuk-button govuk-button--secondary" data-module="govuk-button">
            Edit
          </button>
        </div>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: email preview
// ---------------------------------------------------------------------------

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
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: applicant response form
// ---------------------------------------------------------------------------

function renderApplicantResponseForm() {
  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Respond to fee change request</h1>

        <p class="govuk-body">
          The case officer working on your application has flagged an issue with the fee you paid.
        </p>

        <h2 class="govuk-heading-m">What the case officer said</h2>

        <div class="govuk-inset-text">
          <p><strong>Why the fee is incorrect:</strong><br>${feeChangeRequest.reason}</p>
          <p><strong>What you need to do:</strong><br>${feeChangeRequest.suggestion}</p>
        </div>

        <p class="govuk-body">
          You must respond by <strong>${feeChangeRequest.responseDue}</strong>.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--m" for="applicant-response">
            Describe what you have done to resolve the fee issue
          </label>
          <div id="applicant-response-hint" class="govuk-hint">
            For example, explain if you have made an additional payment or if you believe the fee is correct.
          </div>
          <textarea class="govuk-textarea" id="applicant-response" name="response" rows="5" aria-describedby="applicant-response-hint"></textarea>
        </div>

        <div class="govuk-button-group">
          <button type="submit" class="govuk-button" data-module="govuk-button">
            Submit response
          </button>
          <a class="govuk-link" href="#">Back</a>
        </div>
      </div>
    </div>`;
}

// ===========================================================================
// STORIES — Officer-side: Check Fee page
// ===========================================================================

/** Initial view — payment info, fee calculation, and Yes/No radio buttons with nothing selected. */
export const InitialView = {
  render: () => renderCheckForm(),
};

/** "Yes" selected — fee is valid, ready to save and mark as complete. */
export const SelectedYes = {
  render: () => renderCheckForm({ selectedValue: "yes" }),
};

/** "No" selected — fee is incorrect, officer will be redirected to the fee change request form. */
export const SelectedNo = {
  render: () => renderCheckForm({ selectedValue: "no" }),
};

/** Exempt fee variant — payment reference shows "Exempt", no fee calculation section, fee is zero. */
export const WithExemptFee = {
  render: () => renderCheckForm({ isExempt: true, showCalculation: false }),
};

/** Error state — form submitted without selecting Yes or No. */
export const WithErrors = {
  render: () => renderCheckForm({ hasError: true }),
};

// ===========================================================================
// STORIES — Officer-side: Fee Change Request
// ===========================================================================

/** Fee change request form — officer explains why the fee is incorrect and what the applicant needs to do. */
export const FeeChangeRequestForm = {
  render: () => renderFeeChangeRequestForm(),
};

/** Fee change request sent — pending state showing officer's request, awaiting applicant response. */
export const FeeChangeRequestSent = {
  render: () => renderFeeChangeRequestView({ state: "pending" }),
};

/** Applicant has responded — officer reviews response and confirms the updated payment amount. */
export const ApplicantResponded = {
  render: () => renderFeeChangeRequestView({ state: "responded" }),
};

// ===========================================================================
// STORIES — Email
// ===========================================================================

/** Email sent to applicant notifying them of the fee issue and requesting action. */
export const FeeChangeEmail = {
  render: () => {
    const body = `Dear ${people.applicant.name},

Application reference number: ${application.reference}

Address: ${application.address.full}

Your case officer has identified an issue with the fee paid for your ${application.type.toLowerCase()} application.

Reason the fee is incorrect:
${feeChangeRequest.reason}

What you need to do:
${feeChangeRequest.suggestion}

Please use the link below to respond to this request.

https://southwark.bops.services/validation_requests?planning_application_reference=${application.reference}&change_access_id=abc123

You must respond by ${feeChangeRequest.responseDue}. If we do not receive a response by this date, your application may be returned as invalid.

If you need help with your application, contact us at planning@southwark.gov.uk.

Regards,

${application.councilName}`;

    return renderEmailPreview({
      subject: `${application.type} application - fee issue - ${application.reference}`,
      to: people.applicant.email,
      body,
    });
  },
};

// ===========================================================================
// STORIES — Applicant-side
// ===========================================================================

/** Applicant's view — what they see when responding to the fee change request. */
export const ApplicantResponseForm = {
  render: () => renderApplicantResponseForm(),
};

// ===========================================================================
// STORIES — Completion
// ===========================================================================

/** Completed — fee has been marked as valid, showing payment info and green "Valid" tag. */
export const Completed = {
  render: () => renderCompletedView(),
};
