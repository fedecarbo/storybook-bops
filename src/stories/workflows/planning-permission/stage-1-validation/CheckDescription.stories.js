/**
 * Check Description — the case officer reviews whether the application
 * description accurately matches the proposed development shown in the plans.
 *
 * If the description is correct, the officer selects "Yes" and marks the task
 * complete. If incorrect, the officer enters an amended description and chooses
 * whether to require the applicant's agreement or update immediately.
 *
 * When applicant agreement is required, the system sends an email with a 5-day
 * deadline. If the applicant does not respond, the change is auto-accepted.
 *
 * This task appears in Stage 1 (Validation) under "Check application details".
 */
import { mockData } from "../../../helpers";

export default {
  title: "Workflows/Planning Permission/1. Validation/Check Description",
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (story) =>
      `<div style="max-width: 1100px; margin: 0 auto; padding: 30px 20px;">${story()}</div>`,
  ],
};

const { application, people, descriptionChange } = mockData;
const { changeRequest } = descriptionChange;

// ---------------------------------------------------------------------------
// Helper: description inset block
// ---------------------------------------------------------------------------

function renderDescriptionInset(text, label = "Existing description") {
  return `
    <div class="govuk-inset-text">
      <h3>${label}</h3>
      ${text}
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: officer check form (Yes/No with conditional reveal)
// ---------------------------------------------------------------------------

function renderCheckForm(options = {}) {
  const {
    selectedValue = null,
    showAmendedField = false,
    amendedDescription = application.description,
    approvalRequired = null,
    hasError = false,
    errorMessage = "Select whether the description matches the development or use in the plans",
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
              <li><a href="#valid-description">${errorMessage}</a></li>
            </ul>
          </div>
        </div>
      </div>`
    : "";

  const fieldError = hasError
    ? `<p id="valid-description-error" class="govuk-error-message">
        <span class="govuk-visually-hidden">Error:</span> ${errorMessage}
      </p>`
    : "";

  const errorClass = hasError ? " govuk-form-group--error" : "";

  // Sub-radio: approval required?
  const approvalYesChecked = approvalRequired === "yes" ? " checked" : "";
  const approvalNoChecked = approvalRequired === "no" ? " checked" : "";

  const conditionalNo = showAmendedField
    ? `
      <div class="govuk-radios__conditional" id="conditional-valid-no">
        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--s" for="proposed-description">
            Enter an amended description
          </label>
          <textarea class="govuk-textarea" id="proposed-description" name="proposed_description" rows="5">${amendedDescription}</textarea>
        </div>

        <div class="govuk-form-group">
          <fieldset class="govuk-fieldset">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              Does this description change require applicant's agreement?
            </legend>
            <div class="govuk-radios" data-module="govuk-radios">
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="approval-yes" name="skip_applicant_approval" type="radio" value="false"${approvalYesChecked}
                  data-aria-controls="conditional-approval-yes">
                <label class="govuk-label govuk-radios__label" for="approval-yes">
                  Yes, applicant agreement needed
                </label>
              </div>
              ${
                approvalRequired === "yes"
                  ? `<div class="govuk-radios__conditional" id="conditional-approval-yes">
                      <p class="govuk-body">
                        The new description will be sent to the applicant to approve. If
                        the applicant does not respond within 5 days, the amended
                        description will be automatically accepted.
                      </p>
                    </div>`
                  : ""
              }
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="approval-no" name="skip_applicant_approval" type="radio" value="true"${approvalNoChecked}
                  data-aria-controls="conditional-approval-no">
                <label class="govuk-label govuk-radios__label" for="approval-no">
                  No, update description immediately
                </label>
              </div>
              ${
                approvalRequired === "no"
                  ? `<div class="govuk-radios__conditional" id="conditional-approval-no">
                      <p class="govuk-body">The applicant will be notified of the new description.</p>
                    </div>`
                  : ""
              }
            </div>
          </fieldset>
        </div>
      </div>`
    : "";

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Check description</h1>

        ${errorSummary}

        ${renderDescriptionInset(application.description)}

        <div class="govuk-form-group${errorClass}">
          <fieldset class="govuk-fieldset">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              Does the description match the development or use in the plans?
            </legend>
            ${fieldError}
            <div class="govuk-radios" data-module="govuk-radios">
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="valid-yes" name="valid_description" type="radio" value="true"${yesChecked}>
                <label class="govuk-label govuk-radios__label" for="valid-yes">Yes</label>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="valid-no" name="valid_description" type="radio" value="false"${noChecked}
                  data-aria-controls="conditional-valid-no">
                <label class="govuk-label govuk-radios__label" for="valid-no">No</label>
              </div>
              ${conditionalNo}
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
// Helper: change request view (pending / approved / rejected)
// ---------------------------------------------------------------------------

function renderChangeRequestView(options = {}) {
  const { state = "open", statusDate = changeRequest.createdAt } = options;

  let statusText = "";
  if (state === "open") {
    statusText = `Sent on ${statusDate}. Agent or applicant has not yet responded.`;
  } else if (state === "approved") {
    statusText = `Approved on ${statusDate}`;
  } else if (state === "rejected") {
    statusText = `Rejected on ${statusDate}`;
  }

  const actionLink =
    state === "open"
      ? `<p><a class="govuk-link" href="#">Cancel description change request</a></p>`
      : `<p><a class="govuk-link" href="#">Request a new description change</a></p>`;

  const showComplete = state === "approved";

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Check description</h1>

        <h2 class="govuk-heading-m">Description change request</h2>
        <div class="govuk-inset-text govuk-!-margin-bottom-3">
          <p>
            <strong>Previous description:</strong><br>
            ${changeRequest.previousDescription}
          </p>
          <p>
            <strong>Proposed description:</strong><br>
            ${changeRequest.proposedDescription}
          </p>
          <p>${statusText}</p>
        </div>

        ${actionLink}

        <div class="govuk-button-group">
          <button type="submit" class="govuk-button" data-module="govuk-button">
            ${showComplete ? "Save and mark as complete" : "Save and come back later"}
          </button>
        </div>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: completed view
// ---------------------------------------------------------------------------

function renderCompletedView(options = {}) {
  const { wasUpdated = false, isValid = true } = options;

  const description = wasUpdated
    ? changeRequest.proposedDescription
    : application.description;

  const statusText = wasUpdated
    ? `Description was updated and marked as ${isValid ? "valid" : "invalid"}`
    : `Description was marked as ${isValid ? "valid" : "invalid"}`;

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Check description</h1>

        ${renderDescriptionInset(description)}

        <p class="govuk-body">${statusText}</p>

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
// Helper: applicant review form
// ---------------------------------------------------------------------------

function renderApplicantForm(options = {}) {
  const { selectedValue = null, showRejectionField = false } = options;

  const agreeChecked = selectedValue === "agree" ? " checked" : "";
  const disagreeChecked = selectedValue === "disagree" ? " checked" : "";

  const conditionalDisagree = showRejectionField
    ? `
      <div class="govuk-radios__conditional" id="conditional-disagree">
        <div class="govuk-form-group">
          <label class="govuk-label" for="rejection-reason">
            Tell us why you disagree. Enter your suggested wording for the description.
          </label>
          <textarea class="govuk-textarea" id="rejection-reason" name="rejection_reason" rows="5"></textarea>
        </div>
      </div>`
    : "";

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Confirm changes to your application description</h1>

        <p class="govuk-body">
          The case officer working on your application has suggested a change to your application's description.
        </p>

        <h2 class="govuk-heading-m">What you need to do</h2>
        <ol class="govuk-list govuk-list--number">
          <li>Read the new description</li>
          <li>Select whether you agree or disagree</li>
          <li>Submit your response</li>
        </ol>

        <div class="govuk-inset-text">
          You must submit your response by <strong>${changeRequest.responseDue}</strong>.
          If we do not receive a response by this date, the new description will be automatically accepted.
        </div>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Previous description</h2>
        <p class="govuk-body">${changeRequest.previousDescription}</p>

        <h2 class="govuk-heading-m">New description</h2>
        <p class="govuk-body">${changeRequest.proposedDescription}</p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <div class="govuk-form-group">
          <fieldset class="govuk-fieldset">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              Do you agree with the changes made to your application description?
            </legend>
            <div class="govuk-radios" data-module="govuk-radios">
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="agree" name="approved" type="radio" value="true"${agreeChecked}>
                <label class="govuk-label govuk-radios__label" for="agree">
                  Yes, I agree with the changes made
                </label>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="disagree" name="approved" type="radio" value="false"${disagreeChecked}
                  data-aria-controls="conditional-disagree">
                <label class="govuk-label govuk-radios__label" for="disagree">
                  No, I disagree with the changes made
                </label>
              </div>
              ${conditionalDisagree}
            </div>
          </fieldset>
        </div>

        <div class="govuk-button-group">
          <button type="submit" class="govuk-button" data-module="govuk-button">
            Submit
          </button>
          <a class="govuk-link" href="#">Back</a>
        </div>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: applicant confirmation (after responding)
// ---------------------------------------------------------------------------

function renderApplicantConfirmation(options = {}) {
  const { approved = true, rejectionReason = "" } = options;

  const tag = approved
    ? `<strong class="govuk-tag govuk-tag--green">Agreed</strong>`
    : `<strong class="govuk-tag govuk-tag--red">Disagreed</strong>`;

  const rejectionSection =
    !approved && rejectionReason
      ? `
        <h3 class="govuk-heading-s govuk-!-margin-top-4">My objection and suggested wording for description</h3>
        <div class="govuk-inset-text">${rejectionReason}</div>`
      : "";

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Confirm changes to your application description</h1>

        <p class="govuk-body">The following changes have been made to your application's description.</p>

        <h2 class="govuk-heading-m">Previous description</h2>
        <p class="govuk-body">${changeRequest.previousDescription}</p>

        <h2 class="govuk-heading-m">New description</h2>
        <p class="govuk-body">${changeRequest.proposedDescription}</p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Your response</h2>
        <p class="govuk-body">${tag} with suggested changes</p>
        ${rejectionSection}
      </div>
    </div>`;
}

// ===========================================================================
// STORIES — Officer-side
// ===========================================================================

/** Initial view — existing description shown with Yes/No radio buttons, nothing selected. */
export const InitialView = {
  render: () => renderCheckForm(),
};

/** "Yes" selected — description matches the plans, ready to save and complete. */
export const SelectedYes = {
  render: () => renderCheckForm({ selectedValue: "yes" }),
};

/** "No" selected — form expands with textarea for amended description and sub-question about applicant approval. */
export const SelectedNo = {
  render: () =>
    renderCheckForm({
      selectedValue: "no",
      showAmendedField: true,
      amendedDescription: descriptionChange.proposedDescription,
    }),
};

/** "No" + "Yes, applicant agreement needed" — shows explanation about 5-day approval deadline. */
export const SelectedNoWithApproval = {
  render: () =>
    renderCheckForm({
      selectedValue: "no",
      showAmendedField: true,
      amendedDescription: descriptionChange.proposedDescription,
      approvalRequired: "yes",
    }),
};

/** "No" + "No, update description immediately" — shows explanation that applicant will be notified. */
export const SelectedNoImmediateUpdate = {
  render: () =>
    renderCheckForm({
      selectedValue: "no",
      showAmendedField: true,
      amendedDescription: descriptionChange.proposedDescription,
      approvalRequired: "no",
    }),
};

/** Change request sent — awaiting applicant response, with cancel link. */
export const ChangeRequestSent = {
  render: () =>
    renderChangeRequestView({
      state: "open",
      statusDate: changeRequest.createdAt,
    }),
};

/** Change request approved — applicant agreed to the description change. */
export const ChangeRequestApproved = {
  render: () =>
    renderChangeRequestView({
      state: "approved",
      statusDate: changeRequest.updatedAt,
    }),
};

/** Change request rejected — applicant disagreed, officer can request a new change. */
export const ChangeRequestRejected = {
  render: () =>
    renderChangeRequestView({
      state: "rejected",
      statusDate: changeRequest.updatedAt,
    }),
};

/** Completed — description confirmed as valid without changes. */
export const Completed = {
  render: () => renderCompletedView({ wasUpdated: false, isValid: true }),
};

/** Completed with update — description was amended and marked as valid. */
export const CompletedWithUpdate = {
  render: () => renderCompletedView({ wasUpdated: true, isValid: true }),
};

/** Error state — form submitted without selecting Yes or No. */
export const WithErrors = {
  render: () => renderCheckForm({ hasError: true }),
};

// ===========================================================================
// STORIES — Emails
// ===========================================================================

/** Email sent to applicant requesting agreement to the description change. */
export const DescriptionChangeEmail = {
  render: () => {
    const body = `Dear ${people.applicant.name},

Application reference number: ${application.reference}

Address: ${application.address.full}

Your case officer has suggested changes to the project description for your ${application.type.toLowerCase()} application.

Please use the link below to review and accept or reject the changes.

https://southwark.bops.services/validation_requests?planning_application_reference=${application.reference}&change_access_id=abc123

You must respond by ${changeRequest.responseDue}. If we do not receive a response by this date, the changes will be automatically accepted. This is to avoid delays to your application.

If you need help with your application, contact us at planning@southwark.gov.uk.

Regards,

${application.councilName}`;

    return renderEmailPreview({
      subject: `${application.type} application - suggested changes - ${application.reference}`,
      to: people.applicant.email,
      body,
    });
  },
};

/** Notification email when description is updated immediately (no approval needed). */
export const DescriptionUpdateEmail = {
  render: () => {
    const body = `Application reference number: ${application.reference}
Address: ${application.address.full}

Dear ${people.applicant.name},

Your case officer has updated the description of development for your ${application.type.toLowerCase()} application. Descriptions are updated to provide consistent information and to remove any errors.

Your previous description:
${changeRequest.previousDescription}

Your new description:
${changeRequest.proposedDescription}

If you need help with your application, contact us at planning@southwark.gov.uk.

Regards,

${application.councilName}`;

    return renderEmailPreview({
      subject: `${application.type} application - description updated - ${application.reference}`,
      to: people.applicant.email,
      body,
    });
  },
};

// ===========================================================================
// STORIES — Applicant-side
// ===========================================================================

/** Applicant's view — review page with previous and new descriptions, agree/disagree radios. */
export const ApplicantReviewForm = {
  render: () => renderApplicantForm(),
};

/** Applicant disagreed — confirmation showing "Disagreed" tag with their objection and suggested wording. */
export const ApplicantDisagreed = {
  render: () =>
    renderApplicantConfirmation({
      approved: false,
      rejectionReason: changeRequest.rejectionReason,
    }),
};
