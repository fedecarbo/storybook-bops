/**
 * Consultation Task List — the main page a case officer sees when managing
 * consultation for a planning application. Shows up to three conditional
 * sections (Neighbours, Manage consultees, Publicity) depending on the
 * application type. Appears at: /planning_applications/:id/consultation
 */
import {
  mockData,
  renderAssignmentBar,
  renderGovukTaskListSection,
  renderStatusTag,
} from "../../../helpers";

export default {
  title:
    "Workflows/Planning Permission/2. Consultation/Consultation Task List",
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (story) =>
      `<div style="max-width: 1100px; margin: 0 auto; padding: 30px 20px;">${story()}</div>`,
  ],
};

// ---------------------------------------------------------------------------
// Task definitions — each section mirrors the source Rails view
// ---------------------------------------------------------------------------

const { consultationTasks, dates } = mockData;

const neighbourTasks = consultationTasks.neighbourTasks;
const consulteeTasks = consultationTasks.consulteeTasks;
const publicityTasksAll = consultationTasks.publicityTasks;

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
// Consultation dates bar
// ---------------------------------------------------------------------------

function renderConsultationDatesBar() {
  return `
    <div class="status-bar-container govuk-!-margin-bottom-6" id="dates-details">
      <div class="status-bar">
        <div class="status-panel" id="validation-date">
          <p>Valid from</p>
          <h3>${dates.validated}</h3>
        </div>
        <div class="status-panel" id="consultation-end-date">
          <p>Consultation end</p>
          <h3>${dates.consultationEnd}</h3>
          <p><a class="govuk-link" href="#">Change</a></p>
        </div>
        <div class="status-panel" id="expiry-date">
          <p>Target decision date</p>
          <h3>${dates.targetDecision}</h3>
          <p><a class="govuk-link" href="#">Request extension</a></p>
        </div>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Details accordion
// ---------------------------------------------------------------------------

function renderDetailsAccordion() {
  return `
    <h2 class="govuk-heading-m govuk-!-margin-top-6">Details</h2>
    <div class="govuk-accordion" data-module="govuk-accordion" id="accordion-consultation">
      <div class="govuk-accordion__section">
        <div class="govuk-accordion__section-header">
          <h2 class="govuk-accordion__section-heading">
            <span class="govuk-accordion__section-button" id="accordion-consultation-heading-1">
              Consultation audit log
            </span>
          </h2>
        </div>
        <div id="accordion-consultation-content-1" class="govuk-accordion__section-content">
          <p class="govuk-body">
            <a class="govuk-link" href="#">View copy of neighbour letters</a>
          </p>
        </div>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Page renderer
// ---------------------------------------------------------------------------

function renderConsultationTaskList(
  statusMap,
  {
    showNeighbours = true,
    showConsultees = true,
    showPublicity = true,
    showConfirmSiteNotice = false,
    showConfirmPressNotice = false,
    showNoConsultationMessage = false,
  } = {},
) {
  // Filter publicity tasks based on confirm flags
  const filteredPublicityTasks = publicityTasksAll.filter((task) => {
    if (task.slug === "confirm-site-notice") return showConfirmSiteNotice;
    if (task.slug === "confirm-press-notice") return showConfirmPressNotice;
    return true;
  });

  const sections = [];

  if (showNeighbours) {
    sections.push({
      title: "Neighbours",
      tasks: applyStatuses(neighbourTasks, statusMap),
    });
  }

  if (showConsultees) {
    sections.push({
      title: "Manage consultees",
      tasks: applyStatuses(consulteeTasks, statusMap),
    });
  }

  if (showPublicity) {
    sections.push({
      title: "Publicity",
      tasks: applyStatuses(filteredPublicityTasks, statusMap),
    });
  }

  const taskListHtml = sections
    .map((s) => renderGovukTaskListSection(s.title, s.tasks))
    .join("");

  const noConsultationHtml = showNoConsultationMessage
    ? `<div class="govuk-inset-text">No consultation is required for this application type.</div>`
    : "";

  const backButton = `<a href="#" role="button" draggable="false" class="govuk-button govuk-button--secondary" data-module="govuk-button">Back</a>`;

  return `
    <h1 class="govuk-heading-l">Consultation</h1>
    <div id="planning-application-statuses-tags">
      <p>${renderStatusTag("in_progress")}</p>
    </div>
    ${renderAssignmentBar()}
    ${renderConsultationDatesBar()}
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        ${noConsultationHtml}
        ${taskListHtml}
        ${sections.length > 0 ? renderDetailsAccordion() : ""}
        ${backButton}
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Full consultation — all 3 sections, no tasks started yet. */
export const FullAllNotStarted = {
  render: () =>
    renderConsultationTaskList({
      "select-neighbours": "not_started",
      "send-letters-to-neighbours": "cannot_start_yet",
      "view-neighbour-responses": "cannot_start_yet",
      "select-consultees": "not_started",
      "email-consultees": "cannot_start_yet",
      "view-consultee-responses": "cannot_start_yet",
      "site-notice": "not_started",
      "press-notice": "not_started",
    }),
};

/** Full consultation — mid-progress with mixed statuses. */
export const FullInProgress = {
  render: () =>
    renderConsultationTaskList({
      "select-neighbours": "complete",
      "send-letters-to-neighbours": "complete",
      "view-neighbour-responses": "in_progress",
      "select-consultees": "complete",
      "email-consultees": "in_progress",
      "view-consultee-responses": "not_started",
      "site-notice": "not_started",
      "press-notice": "not_started",
    }),
};

/** Full consultation — letters and emails sent, awaiting responses from neighbours and consultees. */
export const FullAwaitingResponses = {
  render: () =>
    renderConsultationTaskList({
      "select-neighbours": "complete",
      "send-letters-to-neighbours": "complete",
      "view-neighbour-responses": "awaiting_response",
      "select-consultees": "complete",
      "email-consultees": "complete",
      "view-consultee-responses": "awaiting_response",
      "site-notice": "complete",
      "press-notice": "complete",
    }),
};

/** Full consultation — all tasks complete including confirm tasks. */
export const FullAllComplete = {
  render: () =>
    renderConsultationTaskList(
      {
        "select-neighbours": "complete",
        "send-letters-to-neighbours": "complete",
        "view-neighbour-responses": "complete",
        "select-consultees": "complete",
        "email-consultees": "complete",
        "view-consultee-responses": "complete",
        "site-notice": "complete",
        "confirm-site-notice": "complete",
        "press-notice": "complete",
        "confirm-press-notice": "complete",
      },
      {
        showConfirmSiteNotice: true,
        showConfirmPressNotice: true,
      },
    ),
};

/** Consultees only — simpler application type with no neighbours or publicity. */
export const ConsulteesOnly = {
  render: () =>
    renderConsultationTaskList(
      {
        "select-consultees": "not_started",
        "email-consultees": "cannot_start_yet",
        "view-consultee-responses": "cannot_start_yet",
      },
      {
        showNeighbours: false,
        showPublicity: false,
      },
    ),
};

/** Consultees only — all tasks complete. */
export const ConsulteesOnlyComplete = {
  render: () =>
    renderConsultationTaskList(
      {
        "select-consultees": "complete",
        "email-consultees": "complete",
        "view-consultee-responses": "complete",
      },
      {
        showNeighbours: false,
        showPublicity: false,
      },
    ),
};

/** No consultation required — only shows an inset message and back button. */
export const NoConsultation = {
  render: () =>
    renderConsultationTaskList(
      {},
      {
        showNeighbours: false,
        showConsultees: false,
        showPublicity: false,
        showNoConsultationMessage: true,
      },
    ),
};

/** Full consultation with confirm tasks visible — site and press notices marked as required, so their confirmation tasks appear. */
export const WithNoticeConfirmations = {
  render: () =>
    renderConsultationTaskList(
      {
        "select-neighbours": "complete",
        "send-letters-to-neighbours": "complete",
        "view-neighbour-responses": "awaiting_response",
        "select-consultees": "complete",
        "email-consultees": "complete",
        "view-consultee-responses": "awaiting_response",
        "site-notice": "complete",
        "confirm-site-notice": "not_started",
        "press-notice": "complete",
        "confirm-press-notice": "not_started",
      },
      {
        showConfirmSiteNotice: true,
        showConfirmPressNotice: true,
      },
    ),
};
