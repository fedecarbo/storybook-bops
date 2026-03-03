/**
 * Assessment Task List — the main page a case officer sees when assessing
 * a planning application. Shows an accordion of application details above
 * a multi-section task list. Sections shown depend on the application type
 * (e.g. policies/legislation sections are conditional).
 * Appears at: /planning_applications/:id/assessment/tasks
 */
import {
  mockData,
  renderAssignmentBar,
  renderGovukTaskListSection,
  renderStatusTag,
} from "../../../helpers";

export default {
  title:
    "Workflows/Planning Permission/3. Assessment/Assessment Task List",
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (story) =>
      `<div style="max-width: 1100px; margin: 0 auto; padding: 30px 20px;">${story()}</div>`,
  ],
};

// ---------------------------------------------------------------------------
// Task definitions — each section mirrors the source Rails partials
// ---------------------------------------------------------------------------

const { assessmentTasks, dates, application, constraints, documents, people } =
  mockData;

const checkApplicationTasks = assessmentTasks.checkApplicationTasks;
const assessmentSummariesTasks = assessmentTasks.assessmentSummariesTasks;
const policiesTasks = assessmentTasks.policiesTasks;
const legislationTasks = assessmentTasks.legislationTasks;
const completeAssessmentTasks = assessmentTasks.completeAssessmentTasks;

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
// Assessment dates bar
// ---------------------------------------------------------------------------

function renderAssessmentDatesBar() {
  return `
    <div class="status-bar-container govuk-!-margin-bottom-6" id="dates-details">
      <div class="status-bar">
        <div class="status-panel" id="validation-date">
          <p>Valid from</p>
          <h3>${dates.validated}</h3>
        </div>
        <div class="status-panel" id="consultation-end-date">
          <p>Consultation ended</p>
          <h3>${dates.consultationEnd}</h3>
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
// Application details accordion
// ---------------------------------------------------------------------------

function renderApplicationDetailsAccordion() {
  const constraintsList = constraints
    .map(
      (c) =>
        `<li>${c.name}${c.source ? ` <span class="govuk-body-s govuk-!-margin-left-1" style="color:#505a5f">(${c.source})</span>` : ""}</li>`,
    )
    .join("");

  const documentsList = documents
    .map((d) => `<li>${d.name}</li>`)
    .join("");

  return `
    <h2 class="govuk-heading-m govuk-!-margin-top-6">Application details</h2>
    <div class="govuk-accordion" data-module="govuk-accordion" id="accordion-assessment">

      <div class="govuk-accordion__section">
        <div class="govuk-accordion__section-header">
          <h2 class="govuk-accordion__section-heading">
            <span class="govuk-accordion__section-button" id="accordion-assessment-heading-1">
              Application information
            </span>
          </h2>
        </div>
        <div id="accordion-assessment-content-1" class="govuk-accordion__section-content">
          <dl class="govuk-summary-list govuk-summary-list--no-border">
            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">Reference</dt>
              <dd class="govuk-summary-list__value">${application.reference}</dd>
            </div>
            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">Application type</dt>
              <dd class="govuk-summary-list__value">${application.type}</dd>
            </div>
            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">Address</dt>
              <dd class="govuk-summary-list__value">${application.address.full}</dd>
            </div>
            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">Ward</dt>
              <dd class="govuk-summary-list__value">${application.ward}</dd>
            </div>
            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">Case officer</dt>
              <dd class="govuk-summary-list__value">${people.caseOfficer.name}</dd>
            </div>
            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">Payment</dt>
              <dd class="govuk-summary-list__value">£${mockData.fee.amount} — ${mockData.fee.paymentMethod}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div class="govuk-accordion__section">
        <div class="govuk-accordion__section-header">
          <h2 class="govuk-accordion__section-heading">
            <span class="govuk-accordion__section-button" id="accordion-assessment-heading-2">
              Site map
            </span>
          </h2>
        </div>
        <div id="accordion-assessment-content-2" class="govuk-accordion__section-content">
          <div style="background: #f3f2f1; border: 2px dashed #b1b4b6; padding: 40px; text-align: center; color: #505a5f;">
            <p class="govuk-body">[Map view — site boundary on OS map]</p>
          </div>
        </div>
      </div>

      <div class="govuk-accordion__section">
        <div class="govuk-accordion__section-header">
          <h2 class="govuk-accordion__section-heading">
            <span class="govuk-accordion__section-button" id="accordion-assessment-heading-3">
              Constraints
            </span>
          </h2>
        </div>
        <div id="accordion-assessment-content-3" class="govuk-accordion__section-content">
          <ul class="govuk-list govuk-list--bullet">
            ${constraintsList}
          </ul>
        </div>
      </div>

      <div class="govuk-accordion__section">
        <div class="govuk-accordion__section-header">
          <h2 class="govuk-accordion__section-heading">
            <span class="govuk-accordion__section-button" id="accordion-assessment-heading-4">
              Pre-assessment outcome
            </span>
          </h2>
        </div>
        <div id="accordion-assessment-content-4" class="govuk-accordion__section-content">
          <dl class="govuk-summary-list govuk-summary-list--no-border">
            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">Validation outcome</dt>
              <dd class="govuk-summary-list__value">${renderStatusTag("complete")}</dd>
            </div>
            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">Consultation outcome</dt>
              <dd class="govuk-summary-list__value">${renderStatusTag("complete")}</dd>
            </div>
            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">Neighbour responses</dt>
              <dd class="govuk-summary-list__value">6 responses (2 objections, 2 supportive, 2 neutral)</dd>
            </div>
            <div class="govuk-summary-list__row">
              <dt class="govuk-summary-list__key">Consultee responses</dt>
              <dd class="govuk-summary-list__value">4 of 5 consultees responded</dd>
            </div>
          </dl>
        </div>
      </div>

      <div class="govuk-accordion__section">
        <div class="govuk-accordion__section-header">
          <h2 class="govuk-accordion__section-heading">
            <span class="govuk-accordion__section-button" id="accordion-assessment-heading-5">
              Proposal details
            </span>
          </h2>
        </div>
        <div id="accordion-assessment-content-5" class="govuk-accordion__section-content">
          <p class="govuk-body">${application.description}</p>
        </div>
      </div>

      <div class="govuk-accordion__section">
        <div class="govuk-accordion__section-header">
          <h2 class="govuk-accordion__section-heading">
            <span class="govuk-accordion__section-button" id="accordion-assessment-heading-6">
              Documents
            </span>
          </h2>
        </div>
        <div id="accordion-assessment-content-6" class="govuk-accordion__section-content">
          <ul class="govuk-list govuk-list--bullet">
            ${documentsList}
          </ul>
        </div>
      </div>

    </div>`;
}

// ---------------------------------------------------------------------------
// Page renderer
// ---------------------------------------------------------------------------

function renderAssessmentTaskList(
  statusMap,
  {
    showPolicies = true,
    showLegislation = true,
  } = {},
) {
  const sections = [];

  sections.push({
    title: "Check application",
    tasks: applyStatuses(checkApplicationTasks, statusMap),
  });

  sections.push({
    title: "Assessment summaries",
    tasks: applyStatuses(assessmentSummariesTasks, statusMap),
  });

  if (showPolicies) {
    sections.push({
      title: "Assess against policies and guidance",
      tasks: applyStatuses(policiesTasks, statusMap),
    });
  }

  if (showLegislation) {
    sections.push({
      title: "Assess against legislation",
      tasks: applyStatuses(legislationTasks, statusMap),
    });
  }

  sections.push({
    title: "Complete assessment",
    tasks: applyStatuses(completeAssessmentTasks, statusMap),
  });

  const taskListHtml = sections
    .map((s) => renderGovukTaskListSection(s.title, s.tasks))
    .join("");

  const backButton = `<a href="#" role="button" draggable="false" class="govuk-button govuk-button--secondary" data-module="govuk-button">Back</a>`;

  return `
    <h1 class="govuk-heading-l">Assess the application</h1>
    <div id="planning-application-statuses-tags">
      <p>${renderStatusTag("in_progress")}</p>
    </div>
    ${renderAssignmentBar()}
    ${renderAssessmentDatesBar()}
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        ${renderApplicationDetailsAccordion()}
        ${taskListHtml}
        ${backButton}
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Full assessment — all sections visible, all tasks not started. Recommendation and submit are locked. */
export const AllNotStarted = {
  render: () =>
    renderAssessmentTaskList({
      "check-consistency": "not_started",
      "check-publicity": "not_started",
      "check-ownership-certificate-assessment": "not_started",
      "check-consultees-consulted": "not_started",
      "check-site-history": "not_started",
      "permitted-development-rights": "not_started",
      "site-description": "not_started",
      "summary-of-works": "not_started",
      "site-visits": "not_started",
      "considerations": "not_started",
      "development-type": "not_started",
      "policy-class-1a": "not_started",
      "policy-class-1b": "not_started",
      "review-assessment-documents": "not_started",
      "make-draft-recommendation": "cannot_start_yet",
      "standard-conditions": "cannot_start_yet",
      "pre-commencement-conditions": "cannot_start_yet",
      "informatives": "cannot_start_yet",
      "submit-recommendation": "cannot_start_yet",
    }),
};

/** Mid-assessment — check application tasks mostly complete, summaries in progress. */
export const InProgress = {
  render: () =>
    renderAssessmentTaskList({
      "check-consistency": "complete",
      "check-publicity": "complete",
      "check-ownership-certificate-assessment": "complete",
      "check-consultees-consulted": "complete",
      "check-site-history": "in_progress",
      "permitted-development-rights": "not_started",
      "site-description": "in_progress",
      "summary-of-works": "not_started",
      "site-visits": "not_started",
      "considerations": "not_started",
      "development-type": "not_started",
      "policy-class-1a": "not_started",
      "policy-class-1b": "not_started",
      "review-assessment-documents": "not_started",
      "make-draft-recommendation": "cannot_start_yet",
      "standard-conditions": "cannot_start_yet",
      "pre-commencement-conditions": "cannot_start_yet",
      "informatives": "cannot_start_yet",
      "submit-recommendation": "cannot_start_yet",
    }),
};

/** All checks complete — summaries in progress, starting policies and legislation. */
export const ChecksComplete = {
  render: () =>
    renderAssessmentTaskList({
      "check-consistency": "complete",
      "check-publicity": "complete",
      "check-ownership-certificate-assessment": "complete",
      "check-consultees-consulted": "complete",
      "check-site-history": "complete",
      "permitted-development-rights": "complete",
      "site-description": "complete",
      "summary-of-works": "in_progress",
      "site-visits": "complete",
      "considerations": "in_progress",
      "development-type": "not_started",
      "policy-class-1a": "not_started",
      "policy-class-1b": "not_started",
      "review-assessment-documents": "not_started",
      "make-draft-recommendation": "cannot_start_yet",
      "standard-conditions": "cannot_start_yet",
      "pre-commencement-conditions": "cannot_start_yet",
      "informatives": "cannot_start_yet",
      "submit-recommendation": "cannot_start_yet",
    }),
};

/** All tasks complete — recommendation submitted, ready for review stage. */
export const AllComplete = {
  render: () =>
    renderAssessmentTaskList({
      "check-consistency": "complete",
      "check-publicity": "complete",
      "check-ownership-certificate-assessment": "complete",
      "check-consultees-consulted": "complete",
      "check-site-history": "complete",
      "permitted-development-rights": "complete",
      "site-description": "complete",
      "summary-of-works": "complete",
      "site-visits": "complete",
      "considerations": "complete",
      "development-type": "complete",
      "policy-class-1a": "complete",
      "policy-class-1b": "complete",
      "review-assessment-documents": "complete",
      "make-draft-recommendation": "complete",
      "standard-conditions": "complete",
      "pre-commencement-conditions": "complete",
      "informatives": "complete",
      "submit-recommendation": "complete",
    }),
};

/** Simpler application type — no policies or legislation sections. */
export const WithoutPoliciesOrLegislation = {
  render: () =>
    renderAssessmentTaskList(
      {
        "check-consistency": "not_started",
        "check-publicity": "not_started",
        "check-ownership-certificate-assessment": "not_started",
        "check-consultees-consulted": "not_started",
        "check-site-history": "not_started",
        "permitted-development-rights": "not_started",
        "site-description": "not_started",
        "summary-of-works": "not_started",
        "site-visits": "not_started",
        "review-assessment-documents": "not_started",
        "make-draft-recommendation": "cannot_start_yet",
        "standard-conditions": "cannot_start_yet",
        "pre-commencement-conditions": "cannot_start_yet",
        "informatives": "cannot_start_yet",
        "submit-recommendation": "cannot_start_yet",
      },
      {
        showPolicies: false,
        showLegislation: false,
      },
    ),
};

/** All tasks complete except submit — officer has made recommendation and is ready to submit. */
export const ReadyToSubmit = {
  render: () =>
    renderAssessmentTaskList({
      "check-consistency": "complete",
      "check-publicity": "complete",
      "check-ownership-certificate-assessment": "complete",
      "check-consultees-consulted": "complete",
      "check-site-history": "complete",
      "permitted-development-rights": "complete",
      "site-description": "complete",
      "summary-of-works": "complete",
      "site-visits": "complete",
      "considerations": "complete",
      "development-type": "complete",
      "policy-class-1a": "complete",
      "policy-class-1b": "complete",
      "review-assessment-documents": "complete",
      "make-draft-recommendation": "complete",
      "standard-conditions": "complete",
      "pre-commencement-conditions": "complete",
      "informatives": "complete",
      "submit-recommendation": "not_started",
    }),
};
