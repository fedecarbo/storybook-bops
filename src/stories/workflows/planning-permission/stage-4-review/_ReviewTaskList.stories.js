/**
 * Review Task List (Task 40) — the page a senior reviewer sees after the
 * case officer has submitted a recommendation. Stacks four bops-task-accordion
 * blocks (Review consultation / Review assessment / Review assessment summaries
 * / Review conditions), shows the assessor recommendation banner, and the
 * sign-off button group at the bottom.
 *
 * Reviewers work top-down through each accordion section and either Agree or
 * Return-with-comments inline — they never leave this page until they reach
 * the dedicated Sign-off Recommendation page (Task 42).
 *
 * Appears at: /planning_applications/:id/review/tasks
 */
import {
  mockData,
  renderAssignmentBar,
  renderAfterSignOffNotice,
  renderBopsSummary,
  renderBopsTaskAccordion,
  renderInlineReviewForm,
  renderStatusTag,
} from "../../../helpers";

export default {
  title: "Workflows/Planning Permission/4. Review/Review Task List",
  parameters: { layout: "fullscreen" },
  decorators: [
    (story) =>
      `<div style="max-width: 1100px; margin: 0 auto; padding: 30px 20px;">${story()}</div>`,
  ],
};

const { dates, people, review } = mockData;

// ---------------------------------------------------------------------------
// Page-level chrome
// ---------------------------------------------------------------------------

function renderAssessorRecommendationBanner() {
  return `
    <div class="govuk-notification-banner" role="region" aria-labelledby="assessor-recommendation-title" data-module="govuk-notification-banner">
      <div class="govuk-notification-banner__header">
        <h2 class="govuk-notification-banner__title" id="assessor-recommendation-title">Assessor recommendation</h2>
      </div>
      <div class="govuk-notification-banner__content">
        <p class="govuk-notification-banner__heading"><strong>${review.recommendation.decision}</strong></p>
      </div>
    </div>`;
}

function renderReviewDatesBar() {
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
        <div class="status-panel" id="recommendation-date">
          <p>Recommendation submitted</p>
          <h3>${review.recommendation.submittedAt}</h3>
        </div>
        <div class="status-panel" id="expiry-date">
          <p>Target decision date</p>
          <h3>${dates.targetDecision}</h3>
        </div>
      </div>
    </div>`;
}

function renderSiteMapPlaceholder() {
  return `
    <div class="govuk-!-margin-bottom-6" style="background: #f3f2f1; border: 2px dashed #b1b4b6; padding: 40px; text-align: center; color: #505a5f;">
      <p class="govuk-body">[Map view — site boundary on OS map]</p>
    </div>`;
}

// ---------------------------------------------------------------------------
// Section builders
//
// Each accordion section follows the same shape: a heading, a status tag, a
// placeholder block summarising what the assessor produced, and the inline
// Agree / Return-with-comments form. Task 40 keeps section content concise;
// the focused Review Assessment Summaries (Task 41) and Review Conditions
// (Task 43) stories show the full structured content.
// ---------------------------------------------------------------------------

function statusFor(slug, statusMap) {
  return statusMap[slug] || "not_started";
}

function reviewSection(slug, heading, summaryHtml, statusMap) {
  const status = statusFor(slug, statusMap);
  return {
    id: slug,
    heading,
    expanded: false,
    statusTag: renderStatusTag(status),
    blocks: [renderBopsSummary(summaryHtml)],
    footer: renderInlineReviewForm({
      id: slug,
      verdict: status === "complete" ? "accepted" : status === "awaiting_changes" ? "rejected" : null,
      comment: status === "awaiting_changes" ? review.reviewerComment : "",
    }),
  };
}

function buildConsultationAccordion(statusMap) {
  return renderBopsTaskAccordion({
    id: "review-consultation",
    heading: "Review consultation",
    sections: [
      reviewSection(
        "check-neighbour-notifications",
        "Check neighbour notifications",
        "<p class='govuk-body'>Eight neighbouring properties were notified by letter on 25 November 2024. Two objections received.</p>",
        statusMap,
      ),
      reviewSection(
        "check-publicity",
        "Check publicity",
        "<p class='govuk-body'>Site notice displayed at the property between 25 November and 16 December 2024. Press notice published in the Southwark News on 28 November 2024.</p>",
        statusMap,
      ),
    ],
  });
}

function buildAssessmentAccordion(statusMap) {
  return renderBopsTaskAccordion({
    id: "review-assessment",
    heading: "Review assessment",
    sections: [
      reviewSection(
        "check-cil-liability",
        "Check Community Infrastructure Levy (CIL)",
        "<p class='govuk-body'>The development is below the CIL liability threshold. No CIL is payable.</p>",
        statusMap,
      ),
    ],
  });
}

function buildAssessmentSummariesAccordion(statusMap) {
  return renderBopsTaskAccordion({
    id: "review-assessment-summaries",
    heading: "Review assessment summaries",
    sections: review.assessmentSummaries.map((s) =>
      reviewSection(
        `${s.category}-section`,
        s.heading,
        `<p class='govuk-body'>${s.entry}</p>`,
        statusMap,
      ),
    ),
  });
}

function buildConditionsAccordion(statusMap) {
  const considerationsList = review.considerations
    .map(
      (c) =>
        `<li class='govuk-!-margin-bottom-3'><strong>Consideration ${c.position}:</strong> ${c.policyArea}</li>`,
    )
    .join("");
  const conditionsList = review.conditions
    .map((c) => `<li class='govuk-!-margin-bottom-3'><strong>${c.position}.</strong> ${c.title}</li>`)
    .join("");
  const informativesList = review.informatives
    .map((i) => `<li class='govuk-!-margin-bottom-3'><strong>${i.position}.</strong> ${i.title}</li>`)
    .join("");

  return renderBopsTaskAccordion({
    id: "review-conditions",
    heading: "Review conditions",
    sections: [
      reviewSection(
        "review-considerations",
        "Review assessment against policies and guidance",
        `<ol class='govuk-list'>${considerationsList}</ol>`,
        statusMap,
      ),
      reviewSection(
        "review-pre-commencement-conditions",
        "Review pre-commencement conditions",
        "<p class='govuk-body'>No pre-commencement conditions have been added.</p>",
        statusMap,
      ),
      reviewSection(
        "review-conditions",
        "Review conditions",
        `<ol class='govuk-list'>${conditionsList}</ol>`,
        statusMap,
      ),
      reviewSection(
        "review-informatives",
        "Review informatives",
        `<ol class='govuk-list'>${informativesList}</ol>`,
        statusMap,
      ),
    ],
  });
}

// ---------------------------------------------------------------------------
// Bottom task list — "Review assessment against legislation" + sign-off row
// (mirrors the <ul class="app-task-list__items"> at the bottom of
// _review_conditions.html.erb and the _sign_off_recommendation partial)
// ---------------------------------------------------------------------------

function renderBottomTaskList(signOffStatus) {
  const signOffLink =
    signOffStatus === "cannot_start_yet"
      ? `<span class="app-task-list__task-name">Sign off recommendation</span>`
      : `<span class="app-task-list__task-name"><a class="govuk-link" href="#">Sign off recommendation</a></span>`;

  return `
    <ul class="app-task-list__items govuk-!-margin-top-6">
      <li class="app-task-list__item">
        <span class="app-task-list__task-name">
          <a class="govuk-link" href="#">Review assessment against legislation</a>
        </span>
      </li>
      <li class="app-task-list__item">
        ${signOffLink}
        <div class="govuk-task-list__status app-task-list__task-tag">${renderStatusTag(signOffStatus)}</div>
      </li>
    </ul>`;
}

// ---------------------------------------------------------------------------
// Page renderer
// ---------------------------------------------------------------------------

function renderReviewTaskListPage(
  statusMap,
  {
    showConsultation = true,
    signOffStatus = "cannot_start_yet",
    afterSignOff = false,
    showPublishButton = false,
  } = {},
) {
  const accordions = [];
  if (showConsultation) accordions.push(buildConsultationAccordion(statusMap));
  accordions.push(buildAssessmentAccordion(statusMap));
  accordions.push(buildAssessmentSummariesAccordion(statusMap));
  accordions.push(buildConditionsAccordion(statusMap));

  const afterSignOffBlock = afterSignOff
    ? `<div class="govuk-inset-text govuk-!-margin-top-6">${renderAfterSignOffNotice({ assessorName: people.caseOfficer.name })}</div>`
    : "";

  const publishButton = showPublishButton
    ? `<button type="button" class="govuk-button" data-module="govuk-button">Review and publish decision</button>`
    : "";

  return `
    <h1 class="govuk-heading-l">Review and sign-off</h1>
    <div id="planning-application-statuses-tags">
      <p>${renderStatusTag("awaiting_determination")}</p>
    </div>
    ${renderAssignmentBar()}
    ${renderReviewDatesBar()}
    ${renderAssessorRecommendationBanner()}
    ${renderSiteMapPlaceholder()}
    ${accordions.join("")}
    ${renderBottomTaskList(signOffStatus)}
    ${afterSignOffBlock}
    <div class="govuk-button-group govuk-!-margin-top-6">
      ${publishButton}
      <a href="#" class="govuk-link">Back</a>
    </div>`;
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Initial state — assessor has just submitted "Granted". Every accordion section is not_started; sign-off is locked. */
export const AssessorRecommendationReceived = {
  render: () => renderReviewTaskListPage({}),
};

/** Mid-review — consultation and assessment sections complete; first three summaries complete, others not started; conditions not yet reviewed. Sign-off still locked. */
export const InProgress = {
  render: () =>
    renderReviewTaskListPage({
      "check-neighbour-notifications": "complete",
      "check-publicity": "complete",
      "check-cil-liability": "complete",
      "site_description-section": "complete",
      "summary_of_works-section": "complete",
      "consultation_summary-section": "complete",
    }),
};

/** Every accordion section is complete. The Sign-off row links to the Sign-off page (Task 42); the publish button is still hidden until sign-off is accepted. */
export const AllReviewedReadyToSignOff = {
  render: () =>
    renderReviewTaskListPage(
      {
        "check-neighbour-notifications": "complete",
        "check-publicity": "complete",
        "check-cil-liability": "complete",
        "site_description-section": "complete",
        "summary_of_works-section": "complete",
        "consultation_summary-section": "complete",
        "neighbour_summary-section": "complete",
        "amenity-section": "complete",
        "additional_evidence-section": "complete",
        "review-considerations": "complete",
        "review-pre-commencement-conditions": "complete",
        "review-conditions": "complete",
        "review-informatives": "complete",
      },
      { signOffStatus: "not_started" },
    ),
};

/** Reviewer challenged the recommendation — application returned to the assessor. The after-sign-off inset notice surfaces the new owner of the application. */
export const ChangesRequested = {
  render: () =>
    renderReviewTaskListPage(
      {
        "check-neighbour-notifications": "complete",
        "check-publicity": "complete",
        "check-cil-liability": "complete",
        "site_description-section": "awaiting_changes",
        "summary_of_works-section": "complete",
        "consultation_summary-section": "complete",
        "neighbour_summary-section": "complete",
        "amenity-section": "complete",
        "additional_evidence-section": "complete",
        "review-considerations": "complete",
        "review-pre-commencement-conditions": "complete",
        "review-conditions": "complete",
        "review-informatives": "complete",
      },
      { signOffStatus: "complete", afterSignOff: true },
    ),
};

/** Variant: an application type without consultation (e.g. some prior approval types) — the Review consultation accordion is omitted entirely. */
export const WithoutConsultation = {
  render: () => renderReviewTaskListPage({}, { showConsultation: false }),
};
