/**
 * Validation Task List — the main page a case officer sees when validating
 * a planning application. Shows all validation tasks grouped into 5 sections,
 * each with a status tag. This page appears at: /planning_applications/:id/validation/tasks
 */
import {
  mockData,
  renderProposalHeader,
  renderAssignmentBar,
  renderItemsCounter,
  renderGovukTaskListSection,
  renderHeader,
  renderHeaderBar,
} from "../../../helpers";

export default {
  title: "Workflows/Planning Permission/1. Validation/Validation Task List",
  parameters: {
    layout: "fullscreen",
  },
};

// ---------------------------------------------------------------------------
// Task definitions — each section mirrors the source Rails partials
// ---------------------------------------------------------------------------

const documentTasks = [
  { name: "Review documents", slug: "review-documents" },
  { name: "Check and request documents", slug: "check-and-request-documents" },
];

const applicationDetailTasks = [
  { name: "Check red line boundary", slug: "check-red-line-boundary" },
  { name: "Check constraints", slug: "check-constraints" },
  { name: "Check description", slug: "check-description" },
  { name: "Check fee", slug: "check-fee" },
  { name: "Add reporting details", slug: "add-reporting-details" },
];

const requirementTasks = [
  { name: "Confirm Community Infrastructure Levy (CIL)", slug: "confirm-cil" },
  { name: "Check Environment Impact Assessment", slug: "check-eia" },
  { name: "Check ownership certificate", slug: "check-ownership-certificate" },
];

const otherTasks = [
  { name: "Other validation requests", slug: "other-validation-requests" },
];

const reviewTasks = [
  { name: "Review validation requests", slug: "review-validation-requests" },
  { name: "Send validation decision", slug: "send-validation-decision" },
];

// ---------------------------------------------------------------------------
// Helper to apply statuses to task arrays
// ---------------------------------------------------------------------------

function applyStatuses(tasks, statusMap) {
  return tasks.map((task) => ({
    ...task,
    status: statusMap[task.slug] || "not_started",
    href: statusMap[task.slug] === "cannot_start_yet" ? undefined : "#",
  }));
}

// ---------------------------------------------------------------------------
// Full page renderer
// ---------------------------------------------------------------------------

function renderValidationTaskList(statusMap, { invalidCount = 0, updatedCount = 0, showValidateButton = false } = {}) {
  const sections = [
    { title: "Check, tag and confirm documents", tasks: applyStatuses(documentTasks, statusMap) },
    { title: "Check application details", tasks: applyStatuses(applicationDetailTasks, statusMap) },
    { title: "Confirm application requirements", tasks: applyStatuses(requirementTasks, statusMap) },
    { title: "Other validation issues", tasks: applyStatuses(otherTasks, statusMap) },
    { title: "Review", tasks: applyStatuses(reviewTasks, statusMap) },
  ];

  const taskListHtml = sections
    .map((s) => renderGovukTaskListSection(s.title, s.tasks))
    .join("");

  const validateButton = showValidateButton
    ? `<button type="submit" class="govuk-button" data-module="govuk-button">Validate application</button>`
    : "";

  const backButton = `<a href="#" role="button" draggable="false" class="govuk-button govuk-button--secondary" data-module="govuk-button">Back</a>`;

  return `
    ${renderHeader()}
    ${renderHeaderBar()}
    <div class="govuk-width-container">
      <main class="govuk-main-wrapper" id="main-content" role="main">
        ${renderProposalHeader({ heading: "Check the application" })}
        ${renderAssignmentBar()}
        <div class="govuk-grid-row">
          <div class="govuk-grid-column-two-thirds">
            ${renderItemsCounter(invalidCount, updatedCount)}
            ${taskListHtml}
            ${validateButton}
            ${backButton}
          </div>
        </div>
      </main>
    </div>`;
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Fresh application — no tasks started yet. */
export const AllNotStarted = {
  render: () => renderValidationTaskList({
    "review-documents": "not_started",
    "check-and-request-documents": "not_started",
    "check-red-line-boundary": "not_started",
    "check-constraints": "not_started",
    "check-description": "not_started",
    "check-fee": "not_started",
    "add-reporting-details": "not_started",
    "confirm-cil": "not_started",
    "check-eia": "not_started",
    "check-ownership-certificate": "not_started",
    "other-validation-requests": "not_started",
    "review-validation-requests": "cannot_start_yet",
    "send-validation-decision": "cannot_start_yet",
  }),
};

/** Mid-validation — officer has completed some tasks, others in progress. */
export const InProgress = {
  render: () => renderValidationTaskList({
    "review-documents": "complete",
    "check-and-request-documents": "complete",
    "check-red-line-boundary": "in_progress",
    "check-constraints": "complete",
    "check-description": "not_started",
    "check-fee": "not_started",
    "add-reporting-details": "not_started",
    "confirm-cil": "not_started",
    "check-eia": "not_started",
    "check-ownership-certificate": "not_started",
    "other-validation-requests": "not_started",
    "review-validation-requests": "cannot_start_yet",
    "send-validation-decision": "cannot_start_yet",
  }, { invalidCount: 0, updatedCount: 0 }),
};

/** Change requests sent — several tasks marked invalid, awaiting applicant response. */
export const HasInvalidItems = {
  render: () => renderValidationTaskList({
    "review-documents": "complete",
    "check-and-request-documents": "complete",
    "check-red-line-boundary": "invalid",
    "check-constraints": "complete",
    "check-description": "invalid",
    "check-fee": "complete",
    "add-reporting-details": "complete",
    "confirm-cil": "complete",
    "check-eia": "complete",
    "check-ownership-certificate": "invalid",
    "other-validation-requests": "not_started",
    "review-validation-requests": "cannot_start_yet",
    "send-validation-decision": "cannot_start_yet",
  }, { invalidCount: 3, updatedCount: 0 }),
};

/** Applicant has responded — previously invalid items now show as updated. */
export const UpdatedItemsReturned = {
  render: () => renderValidationTaskList({
    "review-documents": "complete",
    "check-and-request-documents": "complete",
    "check-red-line-boundary": "updated",
    "check-constraints": "complete",
    "check-description": "updated",
    "check-fee": "complete",
    "add-reporting-details": "complete",
    "confirm-cil": "complete",
    "check-eia": "complete",
    "check-ownership-certificate": "updated",
    "other-validation-requests": "not_started",
    "review-validation-requests": "cannot_start_yet",
    "send-validation-decision": "cannot_start_yet",
  }, { invalidCount: 0, updatedCount: 3 }),
};

/** All tasks completed — ready for validation decision. */
export const AllComplete = {
  render: () => renderValidationTaskList({
    "review-documents": "complete",
    "check-and-request-documents": "complete",
    "check-red-line-boundary": "complete",
    "check-constraints": "complete",
    "check-description": "complete",
    "check-fee": "complete",
    "add-reporting-details": "complete",
    "confirm-cil": "complete",
    "check-eia": "complete",
    "check-ownership-certificate": "complete",
    "other-validation-requests": "complete",
    "review-validation-requests": "complete",
    "send-validation-decision": "complete",
  }),
};

/** All tasks complete with a prominent "Validate application" button. */
export const ReadyToValidate = {
  render: () => renderValidationTaskList({
    "review-documents": "complete",
    "check-and-request-documents": "complete",
    "check-red-line-boundary": "complete",
    "check-constraints": "complete",
    "check-description": "complete",
    "check-fee": "complete",
    "add-reporting-details": "complete",
    "confirm-cil": "complete",
    "check-eia": "complete",
    "check-ownership-certificate": "complete",
    "other-validation-requests": "complete",
    "review-validation-requests": "complete",
    "send-validation-decision": "not_started",
  }, { showValidateButton: true }),
};
