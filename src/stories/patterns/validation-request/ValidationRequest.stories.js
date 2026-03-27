/**
 * Validation Request Pattern — the common skeleton shared across all 10
 * validation request types in BOPS.
 *
 * All validation requests follow the same lifecycle:
 * Officer creates request -> System emails applicant -> Applicant responds ->
 * Officer reviews -> Complete.
 *
 * The 10 types use only 3 distinct response mechanisms:
 * 1. Agree/Disagree (radio buttons + optional rejection reason)
 * 2. Free text (textarea response)
 * 3. Document upload (file upload with preview)
 *
 * This pattern documents the reusable skeleton, not the full detail of each
 * type — see individual task stories for type-specific implementations.
 */
import { mockData, renderStatusTag } from "../../helpers";

export default {
  title: "Patterns/Validation Request",
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (story) =>
      `<div style="max-width: 1100px; margin: 0 auto; padding: 30px 20px;">${story()}</div>`,
  ],
};

const { application, people, validationRequests, otherChangeRequests, descriptionChange, documentRequests } = mockData;

// ---------------------------------------------------------------------------
// Helper: annotation box — grey callout listing which types use a mechanism
// ---------------------------------------------------------------------------

function renderAnnotationBox(heading, items) {
  return `
    <div style="margin-top: 30px; padding: 16px 20px; background: #f3f2f1; border-left: 4px solid #505a5f;">
      <p style="margin: 0 0 8px; font-family: 'GDS Transport', arial, sans-serif; font-size: 16px; font-weight: 700;">${heading}</p>
      <ul style="margin: 0; padding-left: 20px; font-family: 'GDS Transport', arial, sans-serif; font-size: 14px; color: #505a5f;">
        ${items.map((item) => `<li style="margin-bottom: 4px;">${item}</li>`).join("\n")}
      </ul>
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: lifecycle step indicator
// ---------------------------------------------------------------------------

function renderLifecycleSteps() {
  const steps = [
    { label: "Officer creates request", colour: "#f47738", icon: "1" },
    { label: "System sends email", colour: "#505a5f", icon: "2" },
    { label: "Applicant responds", colour: "#1d70b8", icon: "3" },
    { label: "Officer reviews", colour: "#1d70b8", icon: "4" },
    { label: "Complete", colour: "#00703c", icon: "\u2713" },
  ];

  const stepItems = steps
    .map(
      (step, i) => `
      <div style="display: flex; flex-direction: column; align-items: center; flex: 1; position: relative;">
        <div style="width: 40px; height: 40px; border-radius: 50%; background: ${step.colour}; color: #fff;
             display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px;
             font-family: 'GDS Transport', arial, sans-serif; z-index: 1;">
          ${step.icon}
        </div>
        <p style="margin: 8px 0 0; text-align: center; font-family: 'GDS Transport', arial, sans-serif;
           font-size: 14px; line-height: 1.3; max-width: 120px;">
          ${step.label}
        </p>
      </div>
      ${i < steps.length - 1 ? `<div style="flex: 0.5; height: 2px; background: #b1b4b6; margin-top: 20px;"></div>` : ""}`
    )
    .join("\n");

  return `
    <div style="display: flex; align-items: flex-start; justify-content: center; padding: 24px 0 16px;">
      ${stepItems}
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: status summary list
// ---------------------------------------------------------------------------

function renderStatusSummary() {
  const statuses = [
    { tag: `<strong class="govuk-tag govuk-tag--yellow">Not sent yet</strong>`, description: "Request created but not yet sent to the applicant. The officer can still edit or cancel." },
    { tag: `<strong class="govuk-tag govuk-tag--green">Sent</strong>`, description: "Request sent to the applicant via email. The deadline clock is ticking." },
    { tag: `<strong class="govuk-tag govuk-tag--red">Overdue</strong>`, description: "The response deadline has passed with no reply from the applicant." },
    { tag: `<strong class="govuk-tag">Responded</strong>`, description: "The applicant has submitted their response. The officer can now review it." },
    { tag: `<strong class="govuk-tag govuk-tag--blue">Complete</strong>`, description: "The officer has reviewed the response and marked the request as resolved." },
  ];

  const rows = statuses
    .map(
      (s) => `
      <tr class="govuk-table__row">
        <td class="govuk-table__cell" style="width: 160px;">${s.tag}</td>
        <td class="govuk-table__cell">${s.description}</td>
      </tr>`
    )
    .join("\n");

  return `
    <table class="govuk-table">
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th scope="col" class="govuk-table__header">Status</th>
          <th scope="col" class="govuk-table__header">When it applies</th>
        </tr>
      </thead>
      <tbody class="govuk-table__body">
        ${rows}
      </tbody>
    </table>`;
}

// ---------------------------------------------------------------------------
// Helper: wireframe placeholder block
// ---------------------------------------------------------------------------

function renderPlaceholderBlock(label, options = {}) {
  const { height = 80, colour = "#b1b4b6" } = options;
  return `
    <div style="width: 100%; min-height: ${height}px; border: 2px dashed ${colour}; border-radius: 4px;
         display: flex; align-items: center; justify-content: center; padding: 16px; margin: 16px 0;
         background: #f8f8f8;">
      <p style="margin: 0; font-family: 'GDS Transport', arial, sans-serif; font-size: 14px;
         color: #505a5f; font-style: italic; text-align: center;">
        ${label}
      </p>
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: officer form skeleton
// ---------------------------------------------------------------------------

function renderOfficerFormSkeleton() {
  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">[Request type] validation request</h1>

        <p class="govuk-body">
          Review the applicant's submission and create a request if changes are needed.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        ${renderPlaceholderBlock("Context block: shows what the applicant submitted (e.g. current description, boundary map, existing documents)", { height: 100, colour: "#1d70b8" })}

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--m" for="reason">
            Reason for request
          </label>
          <div class="govuk-hint">
            Explain to the applicant why this request is being made.
          </div>
          <textarea class="govuk-textarea" id="reason" name="reason" rows="5"></textarea>
        </div>

        ${renderPlaceholderBlock("Type-specific fields (e.g. proposed description, new boundary, document type selector)", { height: 80, colour: "#f47738" })}

        <div class="govuk-button-group">
          <button type="submit" class="govuk-button" data-module="govuk-button">Send request</button>
          <a class="govuk-link" href="#">Cancel</a>
        </div>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: officer review/waiting view
// ---------------------------------------------------------------------------

function renderOfficerReviewSkeleton() {
  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">[Request type] validation request</h1>

        <dl class="govuk-summary-list">
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">Status</dt>
            <dd class="govuk-summary-list__value">
              <strong class="govuk-tag govuk-tag--green">Sent</strong>
            </dd>
          </div>
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">Sent to</dt>
            <dd class="govuk-summary-list__value">${people.applicant.name} (${people.applicant.email})</dd>
          </div>
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">Sent on</dt>
            <dd class="govuk-summary-list__value">20 November 2024</dd>
          </div>
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key">Response due</dt>
            <dd class="govuk-summary-list__value">11 December 2024</dd>
          </div>
        </dl>

        <h2 class="govuk-heading-m">Request details</h2>

        <div class="govuk-inset-text">
          The officer's reason and any type-specific details are shown here.
        </div>

        ${renderPlaceholderBlock("Applicant's response will appear here once submitted", { height: 60, colour: "#00703c" })}

        <div class="govuk-button-group">
          <a class="govuk-link" href="#">Cancel request</a>
        </div>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: generic email notification
// ---------------------------------------------------------------------------

function renderGenericEmail() {
  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Email notification</h1>

        <p class="govuk-body">
          When a validation request is sent, the system emails the applicant with a secure link
          to respond. All request types use the same email template structure.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <table class="govuk-table" style="table-layout: fixed;">
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <th scope="row" class="govuk-table__header" style="width: 100px;">To</th>
              <td class="govuk-table__cell">${people.applicant.email}</td>
            </tr>
            <tr class="govuk-table__row">
              <th scope="row" class="govuk-table__header">Subject</th>
              <td class="govuk-table__cell">Changes needed: your planning application ${application.reference}</td>
            </tr>
          </tbody>
        </table>

        <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">

        <div class="govuk-inset-text" style="white-space: pre-line;">Dear ${people.applicant.name},

Your planning application ${application.reference} at ${application.address.full} requires your attention.

${application.councilName} has reviewed your application and needs you to respond to one or more requests before the application can be validated.

Please follow the link below to view and respond to the requests:

<a class="govuk-link" href="#">https://bops.${application.councilName.toLowerCase().replace(/ /g, "")}.gov.uk/validation_requests?planning_application_id=...</a>

You must respond by <strong>11 December 2024</strong>. If we do not receive a response by this date, we may return your application.

Regards,
${application.councilName} Planning Team</div>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: applicant landing page
// ---------------------------------------------------------------------------

function renderGenericLandingPage() {
  const requests = validationRequests;

  const taskItems = requests
    .map((req) => {
      const isClosed = req.state === "closed";
      const isPending = req.state === "pending";

      let statusTag;
      if (isClosed) {
        statusTag = `<strong class="govuk-tag">Complete</strong>`;
      } else if (isPending) {
        statusTag = `<strong class="govuk-tag govuk-tag--yellow">Not sent yet</strong>`;
      } else {
        statusTag = `<strong class="govuk-tag govuk-tag--blue">Not started</strong>`;
      }

      const linkOrText = isClosed
        ? `<span class="govuk-body">${req.requestLabel}: ${req.detail.substring(0, 60)}${req.detail.length > 60 ? "..." : ""}</span>`
        : `<a class="govuk-link" href="#">${req.requestLabel}: ${req.detail.substring(0, 60)}${req.detail.length > 60 ? "..." : ""}</a>`;

      return `
        <li class="govuk-task-list__item govuk-task-list__item--with-link">
          <div class="govuk-task-list__name-and-hint">
            ${linkOrText}
          </div>
          <div class="govuk-task-list__status">
            ${statusTag}
          </div>
        </li>`;
    })
    .join("\n");

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Your planning application</h1>

        <p class="govuk-body">
          <strong>At:</strong> ${application.address.full}<br>
          <strong>Date received:</strong> ${mockData.dates.received}<br>
          <strong>Application number:</strong> ${application.reference}
        </p>

        <hr class="govuk-section-break govuk-section-break--m">

        <p class="govuk-body">
          The case officer working on your application has requested more information.
        </p>

        <h2 class="govuk-heading-m">What you need to do:</h2>

        <p class="govuk-body">
          View the requests from your case officer below, then:
        </p>

        <ul class="govuk-list govuk-list--bullet">
          <li>read the request from the case officer</li>
          <li>enter your response or upload the requested documents</li>
          <li>submit your response</li>
        </ul>

        <p class="govuk-body">
          Your response will be sent to your case officer immediately.
          You won't be able to make any further changes.
        </p>

        <div class="govuk-inset-text">
          You must respond by <strong>11 December 2024</strong>.
          If we don't receive a response by this date we will return your application to you and refund any payment.
        </div>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h3 class="govuk-heading-s">Respond to requests</h3>

        <ul class="govuk-task-list">
          ${taskItems}
        </ul>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: agree/disagree response form
// ---------------------------------------------------------------------------

function renderAgreeDisagreeForm() {
  const { changeRequest } = descriptionChange;

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Do you agree with the proposed change?</h1>

        <p class="govuk-body">
          The case officer working on your application has proposed a change and needs your agreement to proceed.
        </p>

        <div class="govuk-inset-text">
          You must submit your response by <strong>${changeRequest.responseDue}</strong>.
          If we don't receive a response by this date, the change will be accepted automatically.
        </div>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">What was submitted</h2>
        <div class="govuk-inset-text">
          ${changeRequest.previousDescription}
        </div>

        <h2 class="govuk-heading-m">What is proposed</h2>
        <div class="govuk-inset-text" style="border-left-color: #f47738;">
          ${changeRequest.proposedDescription}
        </div>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <div class="govuk-form-group">
          <fieldset class="govuk-fieldset">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              Do you agree with this change?
            </legend>
            <div class="govuk-radios" data-module="govuk-radios">
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="agree" name="response" type="radio" value="agree">
                <label class="govuk-label govuk-radios__label" for="agree">
                  Yes, I agree
                </label>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="disagree" name="response" type="radio" value="disagree"
                  data-aria-controls="conditional-disagree">
                <label class="govuk-label govuk-radios__label" for="disagree">
                  No, I disagree
                </label>
              </div>
              <div class="govuk-radios__conditional govuk-radios__conditional--hidden" id="conditional-disagree">
                <div class="govuk-form-group">
                  <label class="govuk-label" for="rejection-reason">
                    Tell us why you disagree
                  </label>
                  <textarea class="govuk-textarea" id="rejection-reason" name="rejection_reason" rows="4"></textarea>
                </div>
              </div>
            </div>
          </fieldset>
        </div>

        <div class="govuk-button-group">
          <button type="submit" class="govuk-button" data-module="govuk-button">Submit</button>
          <a class="govuk-button govuk-button--secondary" href="#">Back</a>
        </div>
      </div>
    </div>

    ${renderAnnotationBox("Request types using agree/disagree", [
      "Description change \u2014 agree/disagree with proposed new description",
      "Red line boundary change \u2014 agree/disagree with proposed new boundary",
      "Ownership certificate \u2014 confirm or dispute ownership finding",
      "Time extension \u2014 agree/disagree with extended decision deadline",
      "Pre-commencement conditions \u2014 accept or reject proposed conditions",
      "Heads of terms \u2014 agree/disagree with proposed planning obligations",
    ])}`;
}

// ---------------------------------------------------------------------------
// Helper: text response form
// ---------------------------------------------------------------------------

function renderTextResponseForm() {
  const request = otherChangeRequests[0];

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Respond to request</h1>

        <p class="govuk-body">
          The case officer working on your application has requested more information.
        </p>

        <div class="govuk-inset-text">
          You must submit your response by <strong>${request.responseDue}</strong>.
          If we don't receive a response by this date we will return your application to you and refund any payment.
        </div>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <div>
          <h3 class="govuk-heading-s govuk-!-margin-bottom-1">Why the case officer needs more information</h3>
          <p class="govuk-body">${request.reason}</p>
        </div>

        <div>
          <h3 class="govuk-heading-s govuk-!-margin-bottom-1">How you can make your application valid</h3>
          <p class="govuk-body">${request.suggestion}</p>
        </div>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--m" for="response">
            Your response
          </label>
          <div class="govuk-hint">
            Provide the information requested by the case officer. Be as specific as possible.
          </div>
          <textarea class="govuk-textarea" id="response" name="response" rows="6"></textarea>
        </div>

        <div class="govuk-button-group">
          <button type="submit" class="govuk-button" data-module="govuk-button">Submit</button>
          <a class="govuk-button govuk-button--secondary" href="#">Back</a>
        </div>
      </div>
    </div>

    ${renderAnnotationBox("Request types using free text response", [
      "Other change \u2014 catch-all for issues not covered by specific types",
      "Fee change \u2014 respond to fee calculation discrepancies",
    ])}`;
}

// ---------------------------------------------------------------------------
// Helper: document upload response form
// ---------------------------------------------------------------------------

function renderDocumentUploadForm() {
  const request = documentRequests[0];

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Upload requested document</h1>

        <p class="govuk-body">
          The case officer working on your application has requested a document.
        </p>

        <div class="govuk-inset-text">
          You must upload the document by <strong>${request.responseDue}</strong>.
          If we don't receive a response by this date we will return your application to you and refund any payment.
        </div>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <div>
          <h3 class="govuk-heading-s govuk-!-margin-bottom-1">Document requested</h3>
          <p class="govuk-body"><strong>${request.documentRequestType}</strong></p>
        </div>

        <div>
          <h3 class="govuk-heading-s govuk-!-margin-bottom-1">Why this document is needed</h3>
          <p class="govuk-body">${request.reason}</p>
        </div>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--m" for="file-upload">
            Upload file
          </label>
          <div class="govuk-hint">
            You can upload PDF, JPG, or PNG files up to 30MB.
          </div>
          <input class="govuk-file-upload" id="file-upload" name="file-upload" type="file">
        </div>

        <div class="govuk-button-group">
          <button type="submit" class="govuk-button" data-module="govuk-button">Upload and submit</button>
          <a class="govuk-button govuk-button--secondary" href="#">Back</a>
        </div>
      </div>
    </div>

    ${renderAnnotationBox("Request types using document upload", [
      "Additional document \u2014 upload a new document not in the original submission",
      "Replacement document \u2014 upload a corrected version of an existing document",
    ])}`;
}

// ---------------------------------------------------------------------------
// Helper: confirmation page
// ---------------------------------------------------------------------------

function renderGenericConfirmation() {
  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <div class="govuk-panel govuk-panel--confirmation">
          <h1 class="govuk-panel__title">Response submitted</h1>
          <div class="govuk-panel__body">
            Your response has been sent to ${application.councilName}
          </div>
        </div>

        <h2 class="govuk-heading-m">What happens next</h2>

        <p class="govuk-body">
          Your case officer will review your response and may contact you if further information is needed.
        </p>

        <p class="govuk-body">
          If you have more requests to respond to, you can return to
          <a class="govuk-link" href="#">your planning application</a>.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Need help?</h2>

        <p class="govuk-body">
          If you have questions about your application, contact ${application.councilName} planning department.
        </p>
      </div>
    </div>`;
}

// ===========================================================================
// Stories
// ===========================================================================

/**
 * The common lifecycle shared by all validation request types.
 * Shows the 5 stages every request passes through, from creation to completion.
 */
export const LifecycleOverview = {
  render: () => `
    <h1 class="govuk-heading-l">Validation request lifecycle</h1>

    <p class="govuk-body">
      All validation requests follow the same 5-stage lifecycle, regardless of type.
      The officer creates a request, the system notifies the applicant, the applicant
      responds, and the officer reviews the response.
    </p>

    ${renderLifecycleSteps()}

    <hr class="govuk-section-break govuk-section-break--xl govuk-section-break--visible">

    <h2 class="govuk-heading-m">The 3 response mechanisms</h2>

    <p class="govuk-body">
      While all 10 request types share this lifecycle, the applicant's response mechanism
      falls into one of 3 categories:
    </p>

    <table class="govuk-table">
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th scope="col" class="govuk-table__header" style="width: 30%;">Response type</th>
          <th scope="col" class="govuk-table__header">Used by</th>
        </tr>
      </thead>
      <tbody class="govuk-table__body">
        <tr class="govuk-table__row">
          <td class="govuk-table__cell"><strong>Agree / Disagree</strong></td>
          <td class="govuk-table__cell">Description change, Red line boundary, Ownership certificate, Time extension, Pre-commencement conditions, Heads of terms</td>
        </tr>
        <tr class="govuk-table__row">
          <td class="govuk-table__cell"><strong>Free text</strong></td>
          <td class="govuk-table__cell">Other change, Fee change</td>
        </tr>
        <tr class="govuk-table__row">
          <td class="govuk-table__cell"><strong>Document upload</strong></td>
          <td class="govuk-table__cell">Additional document, Replacement document</td>
        </tr>
      </tbody>
    </table>
  `,
};

/**
 * The 5 status tags used across all validation request types,
 * showing when each applies in the lifecycle.
 */
export const StatusProgression = {
  render: () => `
    <h1 class="govuk-heading-l">Status tag progression</h1>

    <p class="govuk-body">
      Every validation request uses the same set of status tags as it moves through
      the lifecycle. These are displayed in the review table and on individual request pages.
    </p>

    ${renderStatusSummary()}
  `,
};

/**
 * The generic form structure used by officers to create any validation request.
 * Type-specific fields are shown as wireframe placeholders.
 */
export const OfficerFormSkeleton = {
  render: () => renderOfficerFormSkeleton(),
};

/**
 * What an officer sees after a request has been sent — the waiting/review state
 * with request details and response status.
 */
export const OfficerReviewView = {
  render: () => renderOfficerReviewSkeleton(),
};

/**
 * The shared landing page an applicant sees after clicking the email link.
 * Lists all open requests as a task list regardless of type.
 */
export const ApplicantLandingPage = {
  render: () => renderGenericLandingPage(),
};

/**
 * The generic email notification sent to applicants when a validation request
 * is created. All types use the same template structure.
 */
export const EmailNotification = {
  render: () => renderGenericEmail(),
};

/**
 * The agree/disagree response pattern — used when the officer proposes a change
 * and needs the applicant's agreement to proceed.
 */
export const ResponseAgreeDisagree = {
  render: () => renderAgreeDisagreeForm(),
};

/**
 * The free text response pattern — used when the officer needs the applicant
 * to provide information in their own words.
 */
export const ResponseTextInput = {
  render: () => renderTextResponseForm(),
};

/**
 * The document upload response pattern — used when the officer needs the
 * applicant to provide new or replacement documents.
 */
export const ResponseDocumentUpload = {
  render: () => renderDocumentUploadForm(),
};

/**
 * The confirmation page shown after any response is submitted.
 * Identical across all validation request types.
 */
export const ApplicantConfirmation = {
  render: () => renderGenericConfirmation(),
};
