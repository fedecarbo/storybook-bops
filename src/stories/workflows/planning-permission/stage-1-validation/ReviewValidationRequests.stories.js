/**
 * Review Validation Requests — the consolidated summary table showing all
 * validation requests across every type (documents, description, boundary,
 * fee, ownership, other) in one place.
 *
 * The case officer uses this page to review the status of all outstanding
 * requests before sending the validation decision. Requests start as
 * "Not sent yet" and progress through "Sent", "Overdue", and "Responded".
 */
import { mockData } from "../../../helpers";

export default {
  title:
    "Workflows/Planning Permission/1. Validation/Review Validation Requests",
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (story) =>
      `<div style="max-width: 1100px; margin: 0 auto; padding: 30px 20px;">${story()}</div>`,
  ],
};

const { validationRequests, cancelledValidationRequests } = mockData;

// ---------------------------------------------------------------------------
// Helper: render a status tag for a validation request
// ---------------------------------------------------------------------------

function renderRequestStatusTag(request) {
  switch (request.state) {
    case "pending":
      return `<strong class="govuk-tag govuk-tag--yellow">Not sent yet</strong>`;
    case "open":
      return request.daysDue < 0
        ? `<strong class="govuk-tag govuk-tag--red">Overdue</strong>`
        : `<strong class="govuk-tag govuk-tag--green">Sent</strong>`;
    case "closed":
      return `<strong class="govuk-tag">Responded</strong>`;
    default:
      return "";
  }
}

// ---------------------------------------------------------------------------
// Helper: render the active validation requests table
// ---------------------------------------------------------------------------

function renderRequestsTable(requests, { showUpdateLink = true } = {}) {
  const actionHeader = showUpdateLink
    ? "View and update request"
    : "View request";

  const rows = requests
    .map(
      (req) => `
      <tr class="govuk-table__row">
        <td class="govuk-table__cell">${req.requestLabel}</td>
        <td class="govuk-table__cell">${req.detail}</td>
        <td class="govuk-table__cell">${renderRequestStatusTag(req)}</td>
        <td class="govuk-table__cell">
          <a class="govuk-link" href="#">${showUpdateLink ? "View and update request" : "View request"}</a>
        </td>
      </tr>`
    )
    .join("\n");

  return `
    <table class="govuk-table" style="table-layout: fixed;">
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th scope="col" class="govuk-table__header" style="width: 20%;">Request</th>
          <th scope="col" class="govuk-table__header" style="width: 40%;">Detail</th>
          <th scope="col" class="govuk-table__header" style="width: 15%;">Status</th>
          <th scope="col" class="govuk-table__header" style="width: 25%;">${actionHeader}</th>
        </tr>
      </thead>
      <tbody class="govuk-table__body">
        ${rows}
      </tbody>
    </table>`;
}

// ---------------------------------------------------------------------------
// Helper: render the cancelled requests table
// ---------------------------------------------------------------------------

function renderCancelledTable(requests) {
  const rows = requests
    .map(
      (req) => `
      <tr class="govuk-table__row">
        <td class="govuk-table__cell">${req.requestLabel}</td>
        <td class="govuk-table__cell">${req.detail}</td>
        <td class="govuk-table__cell">${req.cancelReason}</td>
        <td class="govuk-table__cell">${req.cancelledAt}</td>
      </tr>`
    )
    .join("\n");

  return `
    <table class="govuk-table" style="table-layout: fixed;">
      <caption class="govuk-table__caption govuk-table__caption--m">Cancelled requests</caption>
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th scope="col" class="govuk-table__header" style="width: 15%;">Request</th>
          <th scope="col" class="govuk-table__header" style="width: 30%;">Original reason for request</th>
          <th scope="col" class="govuk-table__header" style="width: 35%;">Reason for cancellation</th>
          <th scope="col" class="govuk-table__header" style="width: 20%;">Date cancelled</th>
        </tr>
      </thead>
      <tbody class="govuk-table__body">
        ${rows}
      </tbody>
    </table>`;
}

// ---------------------------------------------------------------------------
// Helper: render the full page content
// ---------------------------------------------------------------------------

function renderPage({
  requests = [],
  cancelled = [],
  notStarted = false,
  showUpdateLink = true,
} = {}) {
  const hasActive = requests.length > 0;

  const notStartedMessage = notStarted
    ? `<p class="govuk-body">The following requests will be sent when the application is invalidated.</p>`
    : "";

  const tableHtml = hasActive
    ? renderRequestsTable(requests, { showUpdateLink })
    : `<p class="govuk-body">There are no active validation requests.</p>`;

  const cancelledHtml =
    cancelled.length > 0 ? renderCancelledTable(cancelled) : "";

  const notStartedWarning = notStarted
    ? `
      <p class="govuk-body"><strong>The application has not been marked as valid or invalid yet.</strong></p>
      <p class="govuk-body">When all parts of the application have been checked and are correct, mark the application as valid.</p>`
    : "";

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        <h1 class="govuk-heading-l">Review validation requests</h1>

        ${notStartedMessage}
        ${tableHtml}
        ${cancelledHtml}
        ${notStartedWarning}

        <a class="govuk-button govuk-button--secondary" href="#">Back</a>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** All requests pending — before the application has been invalidated. Requests are queued but not yet sent. */
export const AllPending = {
  render: () => {
    const pendingRequests = validationRequests.map((req) => ({
      ...req,
      state: "pending",
    }));
    return renderPage({
      requests: pendingRequests,
      notStarted: true,
    });
  },
};

/** Mixed statuses — after invalidation, responses are coming in. Shows all 4 status tag colours. */
export const MixedStatuses = {
  render: () => renderPage({ requests: validationRequests }),
};

/** All requests resolved — every request has been responded to by the applicant. */
export const AllResolved = {
  render: () => {
    const closedRequests = validationRequests.map((req) => ({
      ...req,
      state: "closed",
      closedAt: req.closedAt || "28 Nov 2024",
    }));
    return renderPage({
      requests: closedRequests,
      showUpdateLink: false,
    });
  },
};

/** Mixed statuses with cancelled requests section visible below the active table. */
export const WithCancelledRequests = {
  render: () =>
    renderPage({
      requests: validationRequests,
      cancelled: cancelledValidationRequests,
    }),
};

/** Empty state — no active validation requests exist. */
export const NoActiveRequests = {
  render: () => renderPage(),
};
