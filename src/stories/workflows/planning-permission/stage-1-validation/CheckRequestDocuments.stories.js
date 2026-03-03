/**
 * Check and Request Documents — the case officer checks submitted documents
 * for missing items and creates requests for additional documents.
 *
 * The lifecycle: officer identifies missing doc → creates request → system
 * emails applicant → applicant uploads → officer reviews response.
 *
 * Two request types exist: additional documents (new/missing) and replacement
 * documents (invalid ones). This task focuses on additional document requests.
 */
import { mockData, renderStatusTag } from "../../../helpers";

export default {
  title:
    "Workflows/Planning Permission/1. Validation/Check and Request Documents",
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (story) =>
      `<div style="max-width: 1100px; margin: 0 auto; padding: 30px 20px;">${story()}</div>`,
  ],
};

const { application, people, documents, documentRequests, documentTagLabels } =
  mockData;

// ---------------------------------------------------------------------------
// Helper: render document tags
// ---------------------------------------------------------------------------

function renderDocumentTag(tagKey) {
  const label = documentTagLabels[tagKey] || tagKey;
  return `<strong class="govuk-tag govuk-tag--turquoise document-tag">${label}</strong>`;
}

function renderDocumentTags(tags) {
  if (!tags || tags.length === 0) {
    return `<span class="govuk-body-s" style="color: #505a5f;"><em>No tags added</em></span>`;
  }
  return tags.map(renderDocumentTag).join(" ");
}

// ---------------------------------------------------------------------------
// Helper: render a document table row (simplified from ReviewDocuments)
// ---------------------------------------------------------------------------

function renderDocumentRow(doc) {
  return `
    <tr class="govuk-table__row">
      <td class="govuk-table__cell">
        <p class="govuk-body govuk-!-margin-bottom-1">
          <a class="govuk-link" href="#">${doc.name}</a>
        </p>
        ${renderDocumentTags(doc.tags)}
      </td>
      <td class="govuk-table__cell">${doc.uploadedAt}</td>
      <td class="govuk-table__cell">${renderStatusTag(doc.status)}</td>
    </tr>`;
}

// ---------------------------------------------------------------------------
// Helper: render documents table
// ---------------------------------------------------------------------------

function renderDocumentsTable(docs) {
  if (!docs || docs.length === 0) {
    return `<p class="govuk-body">There are no active documents</p>`;
  }

  const rows = docs.map(renderDocumentRow).join("\n");
  return `
    <table class="govuk-table">
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th scope="col" class="govuk-table__header">Document</th>
          <th scope="col" class="govuk-table__header">Date received</th>
          <th scope="col" class="govuk-table__header">Status</th>
        </tr>
      </thead>
      <tbody class="govuk-table__body">
        ${rows}
      </tbody>
    </table>`;
}

// ---------------------------------------------------------------------------
// Helper: render a single request table row
// ---------------------------------------------------------------------------

function renderRequestRow(request) {
  const cancelLink =
    request.state === "open"
      ? `<a class="govuk-link" href="#">Cancel request</a>`
      : "";

  const stateTag =
    request.state === "closed"
      ? `<strong class="govuk-tag govuk-tag--green">Closed</strong>`
      : `<strong class="govuk-tag govuk-tag--yellow">Open</strong>`;

  return `
    <tr class="govuk-table__row">
      <td class="govuk-table__cell govuk-!-width-one-third" style="vertical-align: top;">
        <div class="document-thumbnail-placeholder" style="width: 160px; height: 200px;">
          <span style="font-size: 11px; color: #505a5f;">No document</span>
        </div>
      </td>
      <td class="govuk-table__cell govuk-!-width-one-half" style="vertical-align: top;">
        <p class="govuk-body">
          <strong>New document requested</strong>
        </p>
        <p class="govuk-body">
          Document requested: ${request.documentRequestType}
        </p>
        <p class="govuk-body">
          Reason: ${request.reason}
        </p>
        <p class="govuk-body">
          Requested at: ${request.createdAt}
        </p>
        <p class="govuk-body">${stateTag}</p>
      </td>
      <td class="govuk-table__cell govuk-!-width-one-sixth" style="vertical-align: top;">
        ${cancelLink}
      </td>
    </tr>`;
}

// ---------------------------------------------------------------------------
// Helper: render the requests table
// ---------------------------------------------------------------------------

function renderRequestsTable(requests) {
  if (!requests || requests.length === 0) return "";

  const rows = requests.map(renderRequestRow).join("\n");
  return `
    <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
    <table class="govuk-table" id="additional-document-validation-requests-table">
      <tbody class="govuk-table__body">
        ${rows}
      </tbody>
    </table>`;
}

// ---------------------------------------------------------------------------
// Helper: render the main "Check and request documents" page
// ---------------------------------------------------------------------------

function renderMainPage(options = {}) {
  const {
    docs = documents,
    requests = [],
    showWarning = false,
  } = options;

  const warningHtml = showWarning
    ? `
      <div class="govuk-warning-text">
        <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
        <strong class="govuk-warning-text__text">
          <span class="govuk-visually-hidden">Warning</span>
          One or more documents that the applicant submitted are not available due to a security issue. Ask the applicant or agent for replacements.
        </strong>
      </div>`
    : "";

  const requestsHtml = renderRequestsTable(requests);

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        <h1 class="govuk-heading-l">Check and request documents</h1>

        <h2 class="govuk-heading-m">Check for missing documents</h2>
        <p class="govuk-body">
          Check all necessary documents have been provided and add requests for any missing documents.
        </p>

        ${warningHtml}

        <h3 class="govuk-heading-s">Submitted documents</h3>

        ${renderDocumentsTable(docs)}

        ${requestsHtml}

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <p class="govuk-body govuk-!-margin-top-0">
          <a class="govuk-link govuk-body" href="#">Add a request for a missing document</a>
        </p>

        <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: render the "Request a new document" form
// ---------------------------------------------------------------------------

function renderCreateRequestForm(options = {}) {
  const { documentType = "", reason = "" } = options;

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Request a new document</h1>

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--m" for="document-request-type">
            Please specify the new document type:
          </label>
          <div class="govuk-hint" id="document-request-type-hint">
            Eg. Existing floor plans
          </div>
          <input class="govuk-input" id="document-request-type" name="document_request_type" type="text" value="${documentType}" aria-describedby="document-request-type-hint">
        </div>

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--m" for="reason">
            Please specify the reason you have requested this document?
          </label>
          <textarea class="govuk-textarea" id="reason" name="reason" rows="5">${reason}</textarea>
        </div>

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
// Helper: render email preview (same pattern as PressNotice)
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
    .map((req, i) => {
      const statusTag =
        req.state === "closed"
          ? `<strong class="govuk-tag">Complete</strong>`
          : `<strong class="govuk-tag govuk-tag--blue">Not started</strong>`;

      const linkOrText =
        req.state === "closed"
          ? `<span class="govuk-body">${req.documentRequestType}</span>`
          : `<a class="govuk-link" href="#">Upload new document</a>`;

      return `
        <li class="app-task-list__item" style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #b1b4b6;">
          <span>
            ${i + 1}. ${linkOrText}
            <span class="govuk-body-s" style="display: block; color: #505a5f; margin-top: 4px;">
              ${req.documentRequestType}
            </span>
          </span>
          ${statusTag}
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
          The case officer working on your application has requested some more information.
        </p>

        <h2 class="govuk-heading-m">What you need to do:</h2>

        <p class="govuk-body">
          View the requests from your case officer below, then:
        </p>

        <ul class="govuk-list govuk-list--bullet">
          <li>follow the link in each section to respond to each request</li>
          <li>once you've responded, the status for that task will show as 'Complete'</li>
        </ul>

        <p class="govuk-body">
          Your response will be sent to your case officer immediately.
          You won't be able to make any further changes.
        </p>

        <p class="govuk-body">
          You need to respond to all requests before your case officer
          can proceed with your planning application.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h3 class="govuk-heading-s">Provide new or missing documents</h3>

        <ul class="govuk-list" style="list-style: none; padding: 0;">
          ${taskItems}
        </ul>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: render applicant upload form
// ---------------------------------------------------------------------------

function renderApplicantUploadForm(request) {
  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Provide a new document</h1>

        <p class="govuk-body">
          The case officer working on your application has requested a new document.
        </p>

        <h2 class="govuk-heading-m">What you need to do:</h2>

        <ul class="govuk-list govuk-list--bullet">
          <li>read the information about how to prepare plans</li>
          <li>read the request from the case officer</li>
          <li>select 'Choose file' to upload a document from your device — the file must be smaller than 30MB</li>
          <li>submit your response</li>
        </ul>

        <div class="govuk-inset-text">
          You must submit your response by <strong>${request.responseDue}</strong>.
          If we don't receive a response by this date we will return your application to you and refund any payment.
        </div>

        <p class="govuk-body">
          <a class="govuk-link" href="#" target="_blank" rel="noopener noreferrer">
            Read guidance on how to prepare plans correctly
          </a>
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <div id="additional-document-requested">
          <h3 class="govuk-heading-s govuk-!-margin-bottom-1">Document requested:</h3>
          <p class="govuk-body">${request.documentRequestType}</p>
        </div>

        <div id="additional-document-comment">
          <h3 class="govuk-heading-s govuk-!-margin-bottom-1">Comment from case officer:</h3>
          <p class="govuk-body">${request.reason}</p>
        </div>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--s" for="file-upload">
            Upload additional document(s)
          </label>
          <input class="govuk-file-upload" id="file-upload" name="files[]" type="file" multiple accept=".png,.jpeg,.jpg,.pdf">
        </div>

        <div class="govuk-button-group">
          <button type="submit" class="govuk-button" data-module="govuk-button">Submit</button>
          <a class="govuk-button govuk-button--secondary" href="#">Back</a>
        </div>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: render applicant confirmation after upload
// ---------------------------------------------------------------------------

function renderApplicantConfirmation(request) {
  const uploadedDoc = request.responseDocuments[0];

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <div class="govuk-panel govuk-panel--confirmation">
          <h1 class="govuk-panel__title">Document uploaded</h1>
          <div class="govuk-panel__body">
            Your response has been sent to the case officer.
          </div>
        </div>

        <h2 class="govuk-heading-m govuk-!-margin-top-6">What happens next</h2>

        <p class="govuk-body">
          The case officer will review the document you uploaded. You will be contacted if any further information is needed.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h3 class="govuk-heading-s">Document requested:</h3>
        <p class="govuk-body">${request.documentRequestType}</p>

        <h3 class="govuk-heading-s">Comment from case officer:</h3>
        <p class="govuk-body">${request.reason}</p>

        <h3 class="govuk-heading-s">Document you uploaded in response:</h3>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="document-thumbnail-placeholder" style="width: 60px; height: 75px;">
            <span style="font-size: 9px;">${uploadedDoc.filename}</span>
          </div>
          <a class="govuk-link" href="#">${uploadedDoc.name}</a>
        </div>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <a class="govuk-link" href="#">Return to your planning application</a>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Main page — all documents present, no active requests. Officer can add a request if needed. */
export const InitialView = {
  render: () => renderMainPage({ docs: documents, requests: [] }),
};

/** Warning banner shown when one or more documents have a security issue and are unavailable. */
export const WithMissingDocumentWarning = {
  render: () =>
    renderMainPage({ docs: documents, requests: [], showWarning: true }),
};

/** Empty form to create a new additional document request. */
export const CreateRequestForm = {
  render: () => renderCreateRequestForm(),
};

/** Form filled in — officer has specified the document type and reason. */
export const CreateRequestFormFilled = {
  render: () =>
    renderCreateRequestForm({
      documentType: documentRequests[0].documentRequestType,
      reason: documentRequests[0].reason,
    }),
};

/** One request has been created and appears in the requests table below the documents. */
export const OneRequestPending = {
  render: () =>
    renderMainPage({
      docs: documents,
      requests: [documentRequests[0]],
    }),
};

/** Multiple requests created — officer has identified several missing documents. */
export const MultipleRequestsPending = {
  render: () =>
    renderMainPage({
      docs: documents,
      requests: [documentRequests[0], documentRequests[1]],
    }),
};

/** Email sent to the applicant informing them that more information is needed. */
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

/** What the applicant sees after clicking the email link — list of outstanding requests. */
export const ApplicantLandingPage = {
  render: () =>
    renderApplicantLandingPage([documentRequests[0], documentRequests[1]]),
};

/** Applicant's upload page — shows the officer's request details and a file upload field. */
export const ApplicantUploadForm = {
  render: () => renderApplicantUploadForm(documentRequests[0]),
};

/** Confirmation page the applicant sees after successfully uploading a document. */
export const ApplicantUploaded = {
  render: () => renderApplicantConfirmation(documentRequests[2]),
};

/** All requests resolved — applicant has uploaded all requested documents. New docs appear in the table. */
export const AllRequestsResolved = {
  render: () => {
    // All requests are now closed
    const closedRequests = documentRequests.map((req) => ({
      ...req,
      state: "closed",
    }));

    // The uploaded documents now appear alongside the original ones
    const newDocs = [
      {
        name: "Existing roof plan",
        filename: "existing-roof-plan.pdf",
        tags: [],
        uploadedAt: "25 Nov 2024",
        status: "not_started",
      },
      {
        name: "Structural survey report",
        filename: "structural-survey-report.pdf",
        tags: [],
        uploadedAt: "26 Nov 2024",
        status: "not_started",
      },
      {
        name: "Arboricultural impact assessment",
        filename: "arboricultural-impact-assessment.pdf",
        tags: [],
        uploadedAt: "25 Nov 2024",
        status: "not_started",
      },
    ];

    return renderMainPage({
      docs: [...documents, ...newDocs],
      requests: closedRequests,
    });
  },
};
