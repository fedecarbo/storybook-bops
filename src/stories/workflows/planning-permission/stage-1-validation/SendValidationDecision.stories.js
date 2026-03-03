/**
 * Send Validation Decision — the final step in validation where the case
 * officer either validates (marks as valid) or invalidates (returns to
 * applicant) the planning application.
 *
 * This is the key gate between validation and consultation/assessment.
 * The page has 4 states depending on the application status and whether
 * there are outstanding validation requests.
 *
 * Source: engines/bops_core/app/views/bops_core/tasks/check-and-validate/
 *         review/send-validation-decision/show.html.erb
 */
import { mockData } from "../../../helpers";

export default {
  title:
    "Workflows/Planning Permission/1. Validation/Send Validation Decision",
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (story) =>
      `<div style="max-width: 1100px; margin: 0 auto; padding: 30px 20px;">${story()}</div>`,
  ],
};

const { application, people, dates, validationDecision } = mockData;

// ---------------------------------------------------------------------------
// Helper: render the publish radio fieldset
// ---------------------------------------------------------------------------

function renderPublishRadio(validFromDate) {
  return `
    <div class="govuk-form-group">
      <fieldset class="govuk-fieldset">
        <legend class="govuk-fieldset__legend">
          Publish application on BOPS Public Portal?
        </legend>
        <div class="govuk-hint">
          Will be marked as valid from ${validFromDate}
        </div>
        <div class="govuk-radios" data-module="govuk-radios">
          <div class="govuk-radios__item">
            <input class="govuk-radios__input" id="make-public-yes" name="make_public" type="radio" value="true">
            <label class="govuk-label govuk-radios__label" for="make-public-yes">
              Yes
            </label>
          </div>
          <div class="govuk-radios__item">
            <input class="govuk-radios__input" id="make-public-no" name="make_public" type="radio" value="false">
            <label class="govuk-label govuk-radios__label" for="make-public-no">
              No
            </label>
          </div>
        </div>
      </fieldset>
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: render email preview
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
// Stories: Officer-side states
// ---------------------------------------------------------------------------

/**
 * State 1: Application not started, no pending validation requests.
 * All checks are complete and correct — officer can validate.
 * Shows publish radio and green "Mark the application as valid" button.
 */
export const ReadyToValidate = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Send validation decision</h1>

        <p class="govuk-body">
          <strong>
            The application has not been marked as valid or invalid yet.
          </strong>
        </p>
        <p class="govuk-body">
          When all parts of the application have been checked and are correct, mark the application as valid.
        </p>

        ${renderPublishRadio(validationDecision.validFromDate)}

        <div class="govuk-button-group">
          <button type="submit" class="govuk-button" data-module="govuk-button">
            Mark the application as valid
          </button>
        </div>
      </div>
    </div>`,
};

/**
 * State 2: Application not started, but there ARE pending validation requests.
 * Officer has flagged issues — cannot validate, can only invalidate.
 * Shows warning and "Mark the application as invalid" button.
 */
export const CannotValidate = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Send validation decision</h1>

        <h2 class="govuk-heading-m">You have marked items as invalid, so you cannot validate this application.</h2>
        <p class="govuk-body">
          If you mark the application as invalid then the applicant or agent will be sent an invalid notification.
          This notification will contain a link to allow the applicant or agent to view all validation requests and to accept and reject requests.
        </p>
        <div class="govuk-button-group">
          <button type="submit" class="govuk-button govuk-button--warning" data-module="govuk-button">
            Mark the application as invalid
          </button>
        </div>
      </div>
    </div>`,
};

/**
 * State 3: Application invalidated, unresolved requests remain.
 * Applicant was notified but hasn't resolved all requests yet.
 * Shows request summary and a warning — no action button available.
 */
export const Invalidated = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Send validation decision</h1>

        <p class="govuk-body">
          <strong>
            The application is marked as invalid. The applicant was notified on ${validationDecision.invalidatedAt}
          </strong>
        </p>
        <h2 class="govuk-heading-m">
          Validation requests
        </h2>
        <p class="govuk-body">
          This application has ${validationDecision.unresolvedRequestCount} unresolved validation requests and ${validationDecision.resolvedRequestCount} resolved validation requests<br>
          <a class="govuk-link" href="#">View existing requests</a>
        </p>
        <p class="govuk-body">
          There are ${validationDecision.unresolvedRequestCount} unresolved validation requests. All validation requests must be resolved or cancelled before the application can be marked as valid.
        </p>
      </div>
    </div>`,
};

/**
 * State 3b: Application invalidated, but ALL requests are now resolved.
 * Officer can proceed to validate. Publish radio and button reappear.
 */
export const InvalidatedRequestsResolved = {
  render: () => {
    const totalResolved =
      validationDecision.unresolvedRequestCount +
      validationDecision.resolvedRequestCount;

    return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Send validation decision</h1>

        <p class="govuk-body">
          <strong>
            The application is marked as invalid. The applicant was notified on ${validationDecision.invalidatedAt}
          </strong>
        </p>
        <h2 class="govuk-heading-m">
          Validation requests
        </h2>
        <p class="govuk-body">
          This application has ${totalResolved} resolved validation requests<br>
          <a class="govuk-link" href="#">View existing requests</a>
        </p>
        <p class="govuk-body">
          Once the application has been checked and all validation requests resolved, mark the application as valid.
        </p>

        ${renderPublishRadio(validationDecision.validFromDateAfterRequests)}

        <div class="govuk-button-group">
          <button type="submit" class="govuk-button" data-module="govuk-button">
            Mark the application as valid
          </button>
        </div>
      </div>
    </div>`;
  },
};

/**
 * State 4: Application validated — read-only view.
 * Shows confirmation with notification date, link to view the formal notice,
 * and a summary of validation requests.
 */
export const Validated = {
  render: () => {
    const totalResolved =
      validationDecision.unresolvedRequestCount +
      validationDecision.resolvedRequestCount;

    return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Send validation decision</h1>

        <p class="govuk-body">
          <strong>
            The application is marked as valid and cannot be marked as invalid.<br>
            The applicant was notified on ${validationDecision.validatedAt}
          </strong>
        </p>
        <p class="govuk-body">
          <a class="govuk-link" href="#">View notification</a>
        </p>
        <h2 class="govuk-heading-m">
          Validation requests
        </h2>
        <p class="govuk-body">
          This application has ${totalResolved} resolved validation requests
        </p>
      </div>
    </div>`;
  },
};

// ---------------------------------------------------------------------------
// Stories: Validation notice (formal letter)
// ---------------------------------------------------------------------------

/**
 * The formal validation notice displayed when the officer clicks
 * "View notification" after validating. This is a letter-format document
 * with legislation reference, applicant details, appeal rights, and signatory.
 */
export const ValidationNotice = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <div class="validation-notice">
          <span class="govuk-caption-xl">
            ${application.councilName}
          </span>
          <h3>
            ${application.legislationTitle} <br><br>
          </h3>
          <p class="govuk-body">
            Dear ${people.agent.contactName},
          </p>
          <p class="govuk-body">
            <strong>Reference No.:</strong> ${application.reference}<br>
            <strong>Proposal:</strong> ${application.description}<br>
            <strong>Site Address:</strong> ${application.address.full}
          </p>
          <p class="govuk-body">
            Your application is now valid and has been started from ${validationDecision.validatedAt}.
            The description of your development given in the title block above may be different from the one on your application form.
            Contact us if you would like the description to be amended.
          </p>
          <p class="govuk-body">
            Please quote the planning reference number ${application.reference} when contacting us.
          </p>
          <p class="govuk-body">
            We may request additional information and/or revisions before deciding whether the application should be recommended for permission or refusal.
          </p>
          <p class="govuk-body">
            We aim to issue a decision by ${dates.expiryDate}.
            However, if your application has not been determined by ${dates.expiryDate},
            you have the right to appeal to the Secretary of State, either online at
            <a class="govuk-link" href="https://www.gov.uk/government/organisations/planning-inspectorate" target="_blank" rel="noopener noreferrer">https://www.gov.uk/government/organisations/planning-inspectorate</a>,
            or by post to Temple Quay House, 2 The Square, Temple Quay, Bristol BS1 6PN.
          </p>
          <p class="govuk-body">
            An appeal in this situation assumes the refusal of the application,
            even if it had intended to be granted. It is therefore recommended that you consult your case officer before taking such action.
            If you wish to appeal, use the Planning Inspectorate's online appeals service. To find out more, follow the link below.
            The Planning Inspectorate will publish your appeal details on its website,
            including the documents you submitted as part of your planning application,
            along with your completed appeal form and any other information required.
            Ensure any personal information provided belongs to you and that its publication is not an issue.
            If you provide information belonging to someone else make sure you have their permission.
          </p>
          <p class="govuk-body">
            Signed: Director of Planning <br>
            Head of Development Management
          </p>
          <p class="govuk-body">
            Your attention is drawn to the notes accompanying this document.
            Any enquiries regarding this document should quote the Application Number and be sent to
            the Head of Development Management,
            ${application.councilName}.
          </p>
          <p class="govuk-body">
            or by email to <a class="govuk-link" href="mailto:planning@southwark.gov.uk">planning@southwark.gov.uk</a>
          </p>
        </div>
        <br>
        <a class="govuk-button govuk-button--secondary" href="#">Back</a>
      </div>
    </div>`,
};

// ---------------------------------------------------------------------------
// Stories: Success confirmation
// ---------------------------------------------------------------------------

/**
 * Confirmation shown after the officer clicks "Mark the application as valid".
 * Uses the GOV.UK confirmation panel pattern.
 */
export const SuccessConfirmation = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <div class="govuk-panel govuk-panel--confirmation">
          <h1 class="govuk-panel__title">Validation decision sent</h1>
          <div class="govuk-panel__body">
            An email notification has been sent to the applicant.<br>
            The application is now ready for consultation and assessment.
          </div>
        </div>

        <h2 class="govuk-heading-m govuk-!-margin-top-6">What happens next</h2>

        <p class="govuk-body">
          The application has been marked as valid and will move to the consultation and assessment stages.
          The applicant has been notified by email.
        </p>

        <p class="govuk-body">
          <a class="govuk-link" href="#">Return to application</a>
        </p>
      </div>
    </div>`,
};

// ---------------------------------------------------------------------------
// Stories: Email previews
// ---------------------------------------------------------------------------

/**
 * Email sent to the applicant/agent when the application is validated.
 * Confirms the application is error-free and provides a target decision date.
 */
export const ValidationEmail = {
  render: () => {
    const body = `Dear ${people.agent.contactName},

Application reference number: ${application.reference}

Address: ${application.address.full}

Your application for a ${application.type.toLowerCase()} contains no errors or missing information. We can now start assessing your application against the relevant planning policies and legislation.

We aim to reach a decision about your application by ${dates.expiryDate}. If we need more time, we will contact you.
If you have not heard back from us by then, you have the right to appeal to the Secretary of State.

You can find advice about your rights of appeal at https://www.gov.uk/topic/planning-development/planning-permission-appeals.

If you need help with your application, contact us at planning@southwark.gov.uk.

Regards,

${application.councilName}`;

    return renderEmailPreview({
      subject: `${application.type} - ${application.reference} - application validated`,
      to: people.agent.email,
      body,
    });
  },
};

/**
 * Email sent to the applicant/agent when the application is invalidated.
 * Contains a secure link to view and respond to validation requests,
 * and a 15 business day deadline.
 */
export const InvalidationEmail = {
  render: () => {
    const body = `Dear ${people.agent.contactName},

Application reference number: ${application.reference}

Address: ${application.address.full}

We need some more information to process your ${application.type.toLowerCase()}.

Use this link to view requests from your case officer and update your application:

https://southwark.bops.services/validation_requests?planning_application_reference=${application.reference}&change_access_id=abc123

If we don't receive the information we need by ${validationDecision.invalidationResponseDue}, we may close your application and send you a refund.

If you need help with your application, contact us at planning@southwark.gov.uk.

Regards,

${application.councilName}`;

    return renderEmailPreview({
      subject: `${application.type} - ${application.reference} - further information needed`,
      to: people.agent.email,
      body,
    });
  },
};
