/**
 * Other Validation Requests — the catch-all mechanism for officers to flag
 * any validation issue not covered by specific request types (documents,
 * description, red line boundary, fee, etc.).
 *
 * The officer explains why the application is invalid and how the applicant
 * can fix it. The applicant responds with free text. This is the simplest
 * validation request lifecycle — a pure text exchange.
 *
 * Lifecycle: officer creates request → system emails applicant →
 * applicant responds via secure link → officer reviews response.
 */
import { mockData } from "../../../helpers";

export default {
  title:
    "Workflows/Planning Permission/1. Validation/Other Validation Requests",
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (story) =>
      `<div style="max-width: 1100px; margin: 0 auto; padding: 30px 20px;">${story()}</div>`,
  ],
};

const { application, people, otherChangeRequests } = mockData;

// ---------------------------------------------------------------------------
// Helper: render a single request in the GOV.UK task list format
// ---------------------------------------------------------------------------

function renderRequestItem(request) {
  const isOpen = request.state === "open";
  const statusTag = isOpen
    ? `<strong class="govuk-tag govuk-tag--yellow">Invalid</strong>`
    : `<strong class="govuk-tag govuk-tag--turquoise">Updated</strong>`;

  const linkText = `View other validation request #${request.sequence}`;
  const link = isOpen
    ? `<a class="govuk-link" href="#">${linkText}</a>`
    : `<span class="govuk-body">${linkText}</span>`;

  return `
    <li class="govuk-task-list__item govuk-task-list__item--with-link">
      <div class="govuk-task-list__name-and-hint">
        ${link}
      </div>
      <div class="govuk-task-list__status">
        ${statusTag}
      </div>
    </li>`;
}

// ---------------------------------------------------------------------------
// Helper: render the "Other validation issues" task list page
// ---------------------------------------------------------------------------

function renderTaskListPage(requests = []) {
  const hasRequests = requests.length > 0;

  const requestItems = hasRequests
    ? requests.map(renderRequestItem).join("\n")
    : "";

  const taskList = hasRequests
    ? `
      <ul class="govuk-task-list">
        ${requestItems}
        <li class="govuk-task-list__item govuk-task-list__item--with-link">
          <div class="govuk-task-list__name-and-hint">
            <a class="govuk-link" href="#">Add another validation request</a>
          </div>
        </li>
      </ul>`
    : `
      <p class="govuk-body">There are no other validation requests for this application.</p>
      <p class="govuk-body">
        <a class="govuk-link" href="#">Add another validation request</a>
      </p>`;

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Other validation requests</h1>

        <h2 class="govuk-heading-m">Other validation issues</h2>
        ${taskList}
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: render the "View other request" detail page (officer side)
// ---------------------------------------------------------------------------

function renderRequestDetail(request) {
  const isOpen = request.state === "open";
  const heading = isOpen
    ? "View other request"
    : "Check the response to other request";

  const officerSection = `
    <h2 class="govuk-heading-m">Officer request</h2>
    <div class="govuk-inset-text">
      <p class="govuk-body"><strong>Reason it is invalid:</strong> ${request.reason}</p>
      <p class="govuk-body"><strong>How it can be made valid:</strong> ${request.suggestion}</p>
      <p class="govuk-body govuk-!-margin-bottom-0" style="color: #505a5f;">${request.createdAt}</p>
    </div>`;

  const responseSection =
    !isOpen && request.response
      ? `
    <h2 class="govuk-heading-m">Applicant response</h2>
    <div class="govuk-inset-text">
      <p class="govuk-body">${request.response}</p>
      <p class="govuk-body govuk-!-margin-bottom-0" style="color: #505a5f;">${request.closedAt}</p>
    </div>`
      : "";

  const actions = isOpen
    ? `
    <div class="govuk-button-group govuk-!-margin-top-4">
      <a class="govuk-link" href="#">Cancel request</a>
      <a class="govuk-link" href="#">Edit request</a>
    </div>`
    : `
    <div class="govuk-button-group govuk-!-margin-top-4">
      <a class="govuk-button govuk-button--secondary" href="#">Back</a>
    </div>`;

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">${heading}</h1>
        ${officerSection}
        ${responseSection}
        ${actions}
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: render the create/edit request form (officer side)
// ---------------------------------------------------------------------------

function renderCreateForm(options = {}) {
  const { reason = "", suggestion = "" } = options;

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Add other validation request</h1>

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--m" for="reason">
            Tell the applicant another reason why the application is invalid
          </label>
          <textarea class="govuk-textarea" id="reason" name="reason" rows="5">${reason}</textarea>
        </div>

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--m" for="suggestion">
            Explain to the applicant how the application can be made valid
          </label>
          <div class="govuk-hint" id="suggestion-hint">
            Add all information that they will need to complete this action.
          </div>
          <textarea class="govuk-textarea" id="suggestion" name="suggestion" rows="5" aria-describedby="suggestion-hint">${suggestion}</textarea>
        </div>

        <p class="govuk-body">
          This request will be added to the application. The requests will not be sent until the application is marked as invalid.
        </p>

        <div class="govuk-button-group">
          <button type="submit" class="govuk-button" data-module="govuk-button">
            Save request
          </button>
          <a class="govuk-link" href="#">Back</a>
        </div>
      </div>
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
// Helper: render applicant landing page (validation requests index)
// ---------------------------------------------------------------------------

function renderApplicantLandingPage(requests) {
  const taskItems = requests
    .map((req) => {
      const isClosed = req.state === "closed";
      const statusTag = isClosed
        ? `<strong class="govuk-tag">Complete</strong>`
        : `<strong class="govuk-tag govuk-tag--blue">Not started</strong>`;

      const linkOrText = isClosed
        ? `<span class="govuk-body">View other request #${req.sequence}</span>`
        : `<a class="govuk-link" href="#">Respond to other request #${req.sequence}</a>`;

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
          <li>enter your response</li>
          <li>submit your response</li>
        </ul>

        <p class="govuk-body">
          Your response will be sent to your case officer immediately.
          You won't be able to make any further changes.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h3 class="govuk-heading-s">Respond to other requests</h3>

        <ul class="govuk-task-list">
          ${taskItems}
        </ul>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: render applicant response form
// ---------------------------------------------------------------------------

function renderApplicantResponseForm(request) {
  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Respond to other request</h1>

        <p class="govuk-body">
          The case officer working on your application has requested more information.
        </p>

        <h2 class="govuk-heading-m">What you need to do:</h2>

        <ul class="govuk-list govuk-list--bullet">
          <li>read the request from the case officer</li>
          <li>enter your response</li>
          <li>submit your response</li>
        </ul>

        <div class="govuk-inset-text">
          You must submit your response by <strong>${request.responseDue}</strong>.
          If we don't receive a response by this date we will return your application to you and refund any payment.
        </div>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <div id="other-change-reason">
          <h3 class="govuk-heading-s govuk-!-margin-bottom-1">Reason why case officer needs more information</h3>
          <p class="govuk-body">${request.reason}</p>
        </div>

        <div id="other-change-suggestion">
          <h3 class="govuk-heading-s govuk-!-margin-bottom-1">How you can make your application valid</h3>
          <p class="govuk-body">${request.suggestion}</p>
        </div>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--m" for="response">
            Respond to this request
          </label>
          <textarea class="govuk-textarea" id="response" name="response" rows="6"></textarea>
        </div>

        <div class="govuk-button-group">
          <button type="submit" class="govuk-button" data-module="govuk-button">Submit</button>
          <a class="govuk-button govuk-button--secondary" href="#">Back</a>
        </div>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: render applicant confirmation after submitting response
// ---------------------------------------------------------------------------

function renderApplicantConfirmation() {
  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <div class="govuk-panel govuk-panel--confirmation">
          <h1 class="govuk-panel__title">Response submitted</h1>
          <div class="govuk-panel__body">
            Your response has been sent to the case officer.
          </div>
        </div>

        <h2 class="govuk-heading-m govuk-!-margin-top-6">What happens next</h2>

        <p class="govuk-body">
          The case officer will review your response. You will be contacted if any further information is needed.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <a class="govuk-link" href="#">Return to your planning application</a>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Task page with no existing requests — just the heading and a link to add one. */
export const NoRequests = {
  render: () => renderTaskListPage([]),
};

/** Empty form — officer creates a new "other" validation request. */
export const CreateRequestForm = {
  render: () => renderCreateForm(),
};

/** Form filled in with realistic data — reason and suggestion completed. */
export const CreateRequestFormFilled = {
  render: () =>
    renderCreateForm({
      reason: otherChangeRequests[0].reason,
      suggestion: otherChangeRequests[0].suggestion,
    }),
};

/** One open request appears in the task list with a yellow "Invalid" tag. */
export const OneRequestOpen = {
  render: () => renderTaskListPage([otherChangeRequests[0]]),
};

/** Multiple open requests — officer has flagged two validation issues. */
export const MultipleRequests = {
  render: () =>
    renderTaskListPage([otherChangeRequests[0], otherChangeRequests[1]]),
};

/** Email sent to the applicant with a secure link to respond. */
export const EmailToApplicant = {
  render: () => {
    const body = `Dear ${people.applicant.name},

Householder planning permission reference number: ${application.reference}

Address: ${application.address.full}

Your case officer needs more information to process your householder planning permission. You need to review this request and send your response. We may not be able to continue with your householder planning permission until we receive your response.

To view the case officer's request, go to:

https://southwark.bops.services/validation_requests?planning_application_reference=${application.reference}&change_access_id=abc123

If we do not hear from you we may close your householder planning permission and send you a refund.

If you need help with your householder planning permission, contact us at planning@southwark.gov.uk.

Regards,

${application.councilName}`;

    return renderEmailPreview({
      subject: `Householder planning permission - ${application.reference} - further information needed`,
      to: people.applicant.email,
      body,
    });
  },
};

/** Applicant's landing page showing outstanding "other" requests to respond to. */
export const ApplicantLandingPage = {
  render: () =>
    renderApplicantLandingPage([
      otherChangeRequests[0],
      otherChangeRequests[1],
    ]),
};

/** Applicant sees the officer's reason and suggestion, with a textarea to respond and a deadline warning. */
export const ApplicantResponseForm = {
  render: () => renderApplicantResponseForm(otherChangeRequests[0]),
};

/** Confirmation panel after the applicant submits their response. */
export const ApplicantResponseSubmitted = {
  render: () => renderApplicantConfirmation(),
};

/** Officer view of a closed request — applicant's response is visible in the inset text. */
export const RequestClosed = {
  render: () => renderRequestDetail(otherChangeRequests[2]),
};

/** All requests resolved — all show "Updated" tag, task is complete. */
export const AllRequestsResolved = {
  render: () => {
    const closedRequests = otherChangeRequests.map((req) => ({
      ...req,
      state: "closed",
      response:
        req.response ||
        "I have addressed the issue as requested. Please see the updated information.",
      closedAt: req.closedAt || "29 Nov 2024 15:30",
    }));
    return renderTaskListPage(closedRequests);
  },
};
