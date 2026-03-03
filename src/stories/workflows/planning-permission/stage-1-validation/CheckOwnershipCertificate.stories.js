/**
 * Check Ownership Certificate — the case officer reviews whether the
 * ownership certificate submitted with the application is correct.
 *
 * The certificate declares who owns the land (Type A = sole owner,
 * B = all owners known, C = some known, D = none known). For types
 * B/C/D, land owners are listed with notice-served details.
 *
 * If the certificate is incorrect, the officer creates a change request
 * explaining why. This request is not sent until the application is
 * marked as invalid. Once sent, the applicant can agree (and submit a
 * new certificate) or disagree (with reasons).
 *
 * An activity log tracks the history of all requests and responses.
 *
 * This task appears in Stage 1 (Validation) under "Confirm application
 * requirements".
 */
import { mockData } from "../../../helpers";

export default {
  title: "Workflows/Planning Permission/1. Validation/Check Ownership Certificate",
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (story) =>
      `<div style="max-width: 1100px; margin: 0 auto; padding: 30px 20px;">${story()}</div>`,
  ],
};

const { application, people, ownershipCertificate } = mockData;
const { changeRequest } = ownershipCertificate;

// ---------------------------------------------------------------------------
// Helper: certificate table
// ---------------------------------------------------------------------------

function renderCertificateTable(options = {}) {
  const {
    certificateType = ownershipCertificate.certificateType,
    landOwners = ownershipCertificate.landOwners,
  } = options;

  let ownerRows = "";

  if (landOwners && landOwners.length > 0) {
    landOwners.forEach((owner, i) => {
      ownerRows += `
        <tr class="govuk-table__row">
          <th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Owner ${i + 1}</th>
          <td class="govuk-table__cell">&nbsp;</td>
        </tr>
        <tr class="govuk-table__row">
          <th scope="row" class="govuk-table__header">Name</th>
          <td class="govuk-table__cell">${owner.name}</td>
        </tr>
        <tr class="govuk-table__row">
          <th scope="row" class="govuk-table__header">Address</th>
          <td class="govuk-table__cell">${owner.address}</td>
        </tr>
        <tr class="govuk-table__row">
          <th scope="row" class="govuk-table__header">Notice given</th>
          <td class="govuk-table__cell">${owner.noticeGiven ? "Yes" : "No"}</td>
        </tr>`;

      if (owner.noticeGiven) {
        ownerRows += `
        <tr class="govuk-table__row">
          <th scope="row" class="govuk-table__header">Notice date</th>
          <td class="govuk-table__cell">${owner.noticeGivenAt}</td>
        </tr>`;
      } else {
        ownerRows += `
        <tr class="govuk-table__row">
          <th scope="row" class="govuk-table__header">Reason no notice given</th>
          <td class="govuk-table__cell">${owner.noticeReason || ""}</td>
        </tr>`;
      }
    });
  }

  return `
    <table class="govuk-table">
      <tbody class="govuk-table__body">
        <tr class="govuk-table__row">
          <th scope="row" class="govuk-table__header">Certificate type</th>
          <td class="govuk-table__cell">${certificateType.toUpperCase()}</td>
        </tr>
        ${ownerRows}
      </tbody>
    </table>`;
}

// ---------------------------------------------------------------------------
// Helper: officer check form (Yes/No with conditional reveal)
// ---------------------------------------------------------------------------

function renderCheckForm(options = {}) {
  const {
    selectedValue = null,
    showReasonField = false,
    reason = changeRequest.reason,
    hasError = false,
    errorMessage = "Select whether the ownership certificate declaration is correct",
    certificateType = ownershipCertificate.certificateType,
    landOwners = ownershipCertificate.landOwners,
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
              <li><a href="#valid-ownership-certificate">${errorMessage}</a></li>
            </ul>
          </div>
        </div>
      </div>`
    : "";

  const fieldError = hasError
    ? `<p id="valid-ownership-certificate-error" class="govuk-error-message">
        <span class="govuk-visually-hidden">Error:</span> ${errorMessage}
      </p>`
    : "";

  const errorClass = hasError ? " govuk-form-group--error" : "";

  const conditionalNo = showReasonField
    ? `
      <div class="govuk-radios__conditional" id="conditional-valid-no">
        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--s" for="invalidated-ownership-reason">
            Tell the applicant why their ownership certificate type is wrong
          </label>
          <div id="invalidated-ownership-reason-hint" class="govuk-hint">
            This request will be added to the application. The requests will not be sent until the application is marked as invalid.
          </div>
          <textarea class="govuk-textarea" id="invalidated-ownership-reason" name="invalidated_ownership_reason" rows="5">${reason}</textarea>
        </div>
      </div>`
    : "";

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Check ownership certificate</h1>

        ${errorSummary}

        ${renderCertificateTable({ certificateType, landOwners })}

        <div class="govuk-form-group${errorClass}">
          <fieldset class="govuk-fieldset">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              Is this declaration correct?
            </legend>
            ${fieldError}
            <div class="govuk-radios" data-module="govuk-radios">
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="valid-yes" name="valid_ownership_certificate" type="radio" value="true"${yesChecked}>
                <label class="govuk-label govuk-radios__label" for="valid-yes">Yes</label>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="valid-no" name="valid_ownership_certificate" type="radio" value="false"${noChecked}
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
// Helper: change request view (created / sent)
// ---------------------------------------------------------------------------

function renderChangeRequestView(options = {}) {
  const {
    state = "pending",
    reason = changeRequest.reason,
    createdAt = changeRequest.createdAt,
  } = options;

  const heading =
    state === "open"
      ? "Ownership certificate change request sent"
      : "Ownership certificate change request created";

  const actions =
    state === "open"
      ? `<p><a class="govuk-link" href="#">Cancel request</a></p>`
      : `
        <div class="govuk-button-group">
          <button type="submit" class="govuk-button govuk-button--secondary" data-module="govuk-button">
            Delete request
          </button>
        </div>
        <p><a class="govuk-link" href="#">Edit request</a></p>`;

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Check ownership certificate</h1>

        ${renderCertificateTable()}

        <h2 class="govuk-heading-m">${heading}</h2>
        <div class="govuk-inset-text govuk-!-margin-bottom-3">
          <p>
            <strong>Reason ownership certificate is invalid:</strong>
            ${reason}
          </p>
          <p>${createdAt}</p>
        </div>

        ${actions}
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: edit request form
// ---------------------------------------------------------------------------

function renderEditRequestForm(options = {}) {
  const { reason = changeRequest.reason } = options;

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Edit ownership certificate change request</h1>

        ${renderCertificateTable()}

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--m" for="reason">
            Tell the applicant why the ownership certificate is incorrect
          </label>
          <div id="reason-hint" class="govuk-hint">
            Use plain English to explain why the ownership certificate is wrong. This message will be shown to the applicant.
          </div>
          <textarea class="govuk-textarea" id="reason" name="reason" rows="5">${reason}</textarea>
        </div>

        <div class="govuk-button-group">
          <button type="submit" class="govuk-button" data-module="govuk-button">
            Update request
          </button>
          <a class="govuk-link" href="#">Back</a>
        </div>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: response review (officer reviews applicant's response)
// ---------------------------------------------------------------------------

function renderResponseReview(options = {}) {
  const {
    state = "approved",
    reason = changeRequest.reason,
    createdAt = changeRequest.createdAt,
    newCertificate = ownershipCertificate.updatedCertificate,
    rejectionReason = ownershipCertificate.rejectionReason,
  } = options;

  const heading =
    state === "not_responded"
      ? "View ownership certificate request"
      : "Check the response to ownership certificate request";

  const certTypeDisplay = ownershipCertificate.certificateType.toUpperCase();

  let responseSection = "";

  if (state === "approved") {
    responseSection = `
      <h2 class="govuk-heading-m">Applicant response</h2>
      <p class="govuk-body">The applicant provided this information:</p>
      ${renderCertificateTable({
        certificateType: newCertificate.certificateType,
        landOwners: newCertificate.landOwners,
      })}
      <p class="govuk-body">
        If this is incorrect, <a class="govuk-link" href="#">create another ownership certificate validation request</a>
      </p>`;
  } else if (state === "rejected") {
    responseSection = `
      <h2 class="govuk-heading-m">Applicant response</h2>
      <p class="govuk-body">Applicant rejected this ownership certificate change</p>
      <p class="govuk-body">Reason: ${rejectionReason}</p>`;
  } else {
    responseSection = `
      <h2 class="govuk-heading-m">Applicant has not responded yet</h2>`;
  }

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">${heading}</h1>

        <p class="govuk-body">Certificate type: ${certTypeDisplay}</p>

        <h2 class="govuk-heading-m">Officer request</h2>
        <div class="govuk-inset-text">
          <p>
            <strong>Reason it is invalid: </strong>${reason}
          </p>
          <p>${createdAt}</p>
        </div>

        ${responseSection}
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: activity log
// ---------------------------------------------------------------------------

function renderActivityLog(requests = []) {
  let rows = "";

  if (requests.length > 0) {
    requests.forEach((req) => {
      rows += `
        <tr class="govuk-table__row">
          <td class="govuk-table__cell">${req.action}</td>
          <td class="govuk-table__cell">${req.status}</td>
          <td class="govuk-table__cell">${req.user}</td>
          <td class="govuk-table__cell">${req.date}</td>
        </tr>`;
    });
  } else {
    rows = `
      <tr class="govuk-table__row">
        <td class="govuk-table__cell">No validation requests were made</td>
        <td class="govuk-table__cell">&nbsp;</td>
        <td class="govuk-table__cell">&nbsp;</td>
        <td class="govuk-table__cell">&nbsp;</td>
      </tr>`;
  }

  return `
    <div class="activity-log govuk-!-margin-bottom-6">
      <table class="govuk-table govuk-!-margin-bottom-0">
        <caption class="govuk-table__caption govuk-table__caption--m">Activity log</caption>
        <tbody class="govuk-table__body">
          <tr class="govuk-table__row">
            <td class="govuk-table__header">Completed actions</td>
            <td class="govuk-table__header">Status</td>
            <td class="govuk-table__header">User</td>
            <td class="govuk-table__header">Date</td>
          </tr>
          ${rows}
        </tbody>
      </table>
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: assessment view
// ---------------------------------------------------------------------------

function renderAssessmentView(options = {}) {
  const {
    requests = ownershipCertificate.activityLogRequests,
    showRequestSection = true,
  } = options;

  const requestSection = showRequestSection
    ? `
      <p class="govuk-body">
        If the ownership certificate is incorrect, send a request to the applicant for more information.
      </p>
      <details class="govuk-details">
        <summary class="govuk-details__summary">
          <span class="govuk-details__summary-text">
            Request new ownership certificate
          </span>
        </summary>
        <div class="govuk-details__text">
          <div class="govuk-form-group">
            <label class="govuk-label govuk-label--s" for="post-validation-reason">
              Tell the applicant why their ownership certificate type is wrong
            </label>
            <div id="post-validation-reason-hint" class="govuk-hint">
              This request will be sent to the applicant.
            </div>
            <textarea class="govuk-textarea" id="post-validation-reason" name="ownership_certificate_post_validation_reason" rows="5"></textarea>
          </div>
        </div>
      </details>`
    : "";

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Check ownership certificate</h1>

        ${renderCertificateTable()}

        ${renderActivityLog(requests)}

        ${requestSection}

        <button type="submit" class="govuk-button" data-module="govuk-button">
          Save and mark complete
        </button>
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
  const {
    selectedValue = null,
    showRejectionField = false,
    reason = changeRequest.reason,
  } = options;

  const agreeChecked = selectedValue === "agree" ? " checked" : "";
  const disagreeChecked = selectedValue === "disagree" ? " checked" : "";

  const conditionalDisagree = showRejectionField
    ? `
      <div class="govuk-radios__conditional" id="conditional-disagree">
        <div class="govuk-form-group">
          <label class="govuk-label" for="rejection-reason">
            Tell us why you don't agree. Include any information that will help the case officer understand your reasons.
          </label>
          <textarea class="govuk-textarea" id="rejection-reason" name="rejection_reason" rows="5"></textarea>
        </div>
      </div>`
    : "";

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Ownership certificate change request</h1>

        <p class="govuk-body">
          Your case officer has reviewed the ownership certificate submitted with your application and has identified an issue.
        </p>

        <h2 class="govuk-heading-m">What you need to do</h2>
        <ol class="govuk-list govuk-list--number">
          <li>Read the case officer's statement below</li>
          <li>Select whether you agree or disagree</li>
          <li>Submit your response</li>
        </ol>

        <div class="govuk-inset-text">
          You must submit your response by <strong>${changeRequest.responseDue}</strong>.
        </div>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Case officer's statement</h2>
        <div class="govuk-inset-text">${reason}</div>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <div class="govuk-form-group">
          <fieldset class="govuk-fieldset">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              Do you agree with this statement from the case officer?
            </legend>
            <div class="govuk-radios" data-module="govuk-radios">
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="agree" name="approved" type="radio" value="true"${agreeChecked}>
                <label class="govuk-label govuk-radios__label" for="agree">
                  Yes, I agree
                </label>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="disagree" name="approved" type="radio" value="false"${disagreeChecked}
                  data-aria-controls="conditional-disagree">
                <label class="govuk-label govuk-radios__label" for="disagree">
                  No, I don't agree
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
  const {
    approved = true,
    rejectionReason = ownershipCertificate.rejectionReason,
  } = options;

  const tag = approved
    ? `<strong class="govuk-tag govuk-tag--green">Agreed</strong>`
    : `<strong class="govuk-tag govuk-tag--red">Disagreed</strong>`;

  const rejectionSection =
    !approved && rejectionReason
      ? `
        <h3 class="govuk-heading-s govuk-!-margin-top-4">My reason for disagreeing</h3>
        <div class="govuk-inset-text">${rejectionReason}</div>`
      : "";

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Ownership certificate change request</h1>

        <p class="govuk-body">Your response to the ownership certificate change request has been submitted.</p>

        <h2 class="govuk-heading-m">Case officer's statement</h2>
        <div class="govuk-inset-text">${changeRequest.reason}</div>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Your response</h2>
        <p class="govuk-body">${tag} with the case officer's statement</p>
        ${rejectionSection}
      </div>
    </div>`;
}

// ===========================================================================
// STORIES — Officer-side: Validation
// ===========================================================================

/** Initial view — certificate table showing Type B with 2 land owners, Yes/No radios unselected. */
export const InitialView = {
  render: () => renderCheckForm(),
};

/** "Yes" selected — declaration is correct, ready to save and complete. */
export const SelectedYes = {
  render: () => renderCheckForm({ selectedValue: "yes" }),
};

/** "No" selected — form expands with textarea for the reason the certificate is wrong. */
export const SelectedNo = {
  render: () =>
    renderCheckForm({
      selectedValue: "no",
      showReasonField: true,
      reason: changeRequest.reason,
    }),
};

/** Change request created — inset showing reason and date, with Delete and Edit options (pre-invalidation). */
export const ChangeRequestCreated = {
  render: () =>
    renderChangeRequestView({
      state: "pending",
      reason: changeRequest.reason,
      createdAt: changeRequest.createdAt,
    }),
};

/** Change request sent — request has been sent to applicant after invalidation, with Cancel link. */
export const ChangeRequestSent = {
  render: () =>
    renderChangeRequestView({
      state: "open",
      reason: changeRequest.reason,
      createdAt: changeRequest.createdAt,
    }),
};

/** Edit request form — officer edits the reason on an existing request. */
export const EditRequest = {
  render: () => renderEditRequestForm({ reason: changeRequest.reason }),
};

/** Error state — form submitted without selecting Yes or No. */
export const WithErrors = {
  render: () => renderCheckForm({ hasError: true }),
};

// ===========================================================================
// STORIES — Officer-side: Response review
// ===========================================================================

/** Applicant responded — approved: submitted a new certificate (Type C with 3 owners). */
export const ApplicantRespondedApproved = {
  render: () =>
    renderResponseReview({
      state: "approved",
      newCertificate: ownershipCertificate.updatedCertificate,
    }),
};

/** Applicant responded — rejected: disagreed with the change request and provided reasons. */
export const ApplicantRespondedRejected = {
  render: () =>
    renderResponseReview({
      state: "rejected",
      rejectionReason: ownershipCertificate.rejectionReason,
    }),
};

/** Applicant has not responded yet — request is still open. */
export const ApplicantNotResponded = {
  render: () => renderResponseReview({ state: "not_responded" }),
};

// ===========================================================================
// STORIES — Assessment stage
// ===========================================================================

/** Assessment view — certificate table, activity log with one closed request, and collapsible section to create a new request. */
export const AssessmentView = {
  render: () =>
    renderAssessmentView({
      requests: ownershipCertificate.activityLogRequests,
      showRequestSection: true,
    }),
};

/** Activity log with multiple entries — including an open (pending) request. */
export const ActivityLogWithRequests = {
  render: () =>
    renderAssessmentView({
      requests: [
        {
          action: "Applicant has not responded",
          status: "",
          user: "",
          date: "",
        },
        {
          action: "New ownership certificate requested",
          status: "Open",
          user: "Sarah Johnson",
          date: "02/12/2024",
        },
        {
          action: "Certificate submitted by applicant",
          status: "Submitted",
          user: "Applicant",
          date: "28/11/2024",
        },
        {
          action: "New ownership certificate requested",
          status: "Closed",
          user: "Sarah Johnson",
          date: "20/11/2024",
        },
      ],
      showRequestSection: false,
    }),
};

// ===========================================================================
// STORIES — Email
// ===========================================================================

/** Email sent to applicant requesting review of ownership certificate. */
export const EmailToApplicant = {
  render: () => {
    const body = `Dear ${people.applicant.name},

Application reference number: ${application.reference}

Address: ${application.address.full}

Your case officer has identified an issue with the ownership certificate submitted with your ${application.type.toLowerCase()} application.

Your case officer has made the following statement:

"${changeRequest.reason}"

Please use the link below to respond to this request.

https://southwark.bops.services/validation_requests?planning_application_reference=${application.reference}&change_access_id=abc123

You must respond by ${changeRequest.responseDue}. This is to avoid delays to your application.

If you need help with your application, contact us at planning@southwark.gov.uk.

Regards,

${application.councilName}`;

    return renderEmailPreview({
      subject: `${application.type} application - ownership certificate issue - ${application.reference}`,
      to: people.applicant.email,
      body,
    });
  },
};

// ===========================================================================
// STORIES — Applicant-side
// ===========================================================================

/** Applicant's view — review page with officer's statement, agree/disagree radios. */
export const ApplicantReviewForm = {
  render: () => renderApplicantForm(),
};

/** Applicant disagreed — confirmation showing "Disagreed" tag with their reason. */
export const ApplicantDisagreed = {
  render: () =>
    renderApplicantConfirmation({
      approved: false,
      rejectionReason: ownershipCertificate.rejectionReason,
    }),
};

// ===========================================================================
// STORIES — Certificate type variations
// ===========================================================================

/** Certificate Type A — sole owner, no land owners listed. */
export const CertificateTypeA = {
  render: () =>
    renderCheckForm({
      certificateType: ownershipCertificate.certificateTypeA.certificateType,
      landOwners: ownershipCertificate.certificateTypeA.landOwners,
    }),
};

/** Certificate Type D — unknown owners, notice not given with explanation. */
export const CertificateTypeD = {
  render: () =>
    renderCheckForm({
      certificateType: ownershipCertificate.certificateTypeD.certificateType,
      landOwners: ownershipCertificate.certificateTypeD.landOwners,
    }),
};
