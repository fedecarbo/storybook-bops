/**
 * Review Assessment Summaries (Task 41) — focused view of the "Review
 * assessment summaries" bops-task-accordion in isolation. Demonstrates the
 * inline-review form pattern across the six summary categories: site
 * description, summary of works, consultation summary, neighbour summary,
 * amenity, additional evidence.
 *
 * Each section shows what the assessor wrote (in a bops-summary block) and a
 * footer form where the reviewer chooses Agree or Return-with-comments. This
 * is the pattern that runs through every Review accordion section across the
 * stage.
 *
 * Appears on the Review task list page within the third top-level accordion.
 */
import {
  mockData,
  renderBopsSummary,
  renderBopsTaskAccordion,
  renderInlineReviewForm,
  renderStatusTag,
} from "../../../helpers";

export default {
  title: "Workflows/Planning Permission/4. Review/Review Assessment Summaries",
  parameters: { layout: "fullscreen" },
  decorators: [
    (story) =>
      `<div style="max-width: 1100px; margin: 0 auto; padding: 30px 20px;">${story()}</div>`,
  ],
};

const { review } = mockData;

// ---------------------------------------------------------------------------
// Section block content per summary category — mirrors the per-category
// extras in _review_assessment_summaries.html.erb (lines 21-44):
//   • consultation_summary adds a small consultee list before the entry
//   • amenity / neighbour_summary add a "View neighbour responses" link
// ---------------------------------------------------------------------------

function renderConsulteeList() {
  return `
    <div class="govuk-!-margin-bottom-4">
      <h3 class="govuk-heading-s">Consultees</h3>
      <ul class="govuk-list govuk-list--bullet">
        <li>Conservation Officer — Responded (no objection)</li>
        <li>Highways — No comment</li>
        <li>Trees Officer — No comment</li>
      </ul>
      <h3 class="govuk-heading-s">Summary of consultee responses</h3>
    </div>`;
}

function renderNeighbourResponsesLink() {
  return `
    <p class='govuk-body'>
      View neighbour responses: 6 responses (2 objection, 2 supportive, 2 neutral)
    </p>
    <p class='govuk-body'>
      <a class='govuk-link' href='#' target='_blank' rel='noopener'>View neighbour responses</a>
    </p>`;
}

function blocksFor(summary) {
  const extras =
    summary.category === "consultation_summary"
      ? renderConsulteeList()
      : summary.category === "amenity" || summary.category === "neighbour_summary"
        ? renderNeighbourResponsesLink()
        : "";
  return [
    renderBopsSummary(`
      ${extras}
      <p class='govuk-body'>${summary.entry}</p>
      <p class='govuk-body'><a class='govuk-link' href='#'>Edit</a></p>
    `),
  ];
}

// ---------------------------------------------------------------------------
// Section + accordion builders. `state` is keyed by category and accepts:
//   { expanded?: boolean, verdict?: "accepted"|"rejected", status?: <statusKey>, comment?: string }
// ---------------------------------------------------------------------------

function renderSummariesAccordion(state = {}) {
  const sections = review.assessmentSummaries.map((summary) => {
    const s = state[summary.category] || {};
    const status =
      s.status ||
      (s.verdict === "accepted"
        ? "complete"
        : s.verdict === "rejected"
          ? "awaiting_changes"
          : "not_started");
    return {
      id: `${summary.category}_section`,
      heading: summary.heading,
      expanded: s.expanded === true,
      statusTag: renderStatusTag(status),
      blocks: blocksFor(summary),
      footer: renderInlineReviewForm({
        id: summary.category,
        verdict: s.verdict || null,
        comment: s.comment || "",
      }),
    };
  });

  return renderBopsTaskAccordion({
    id: "review-assessment-summaries",
    heading: "Review assessment summaries",
    sections,
  });
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** All six summary sections rendered, all collapsed, "Not started" status tags. The reviewer hasn't opened any yet. */
export const AllSectionsCollapsed = {
  render: () => renderSummariesAccordion(),
};

/** Site description expanded — assessor's content visible in the grey-bordered block, footer form awaiting a verdict. */
export const OneSectionExpandedAwaitingVerdict = {
  render: () =>
    renderSummariesAccordion({
      site_description: { expanded: true },
    }),
};

/** Neighbour summary expanded — reviewer selected "Return with comments", the conditional comment textarea is revealed and pre-populated, status tag is "Awaiting changes". */
export const OneSectionExpandedReturnedWithComments = {
  render: () =>
    renderSummariesAccordion({
      neighbour_summary: {
        expanded: true,
        verdict: "rejected",
        comment: review.reviewerComment,
      },
    }),
};

/** All six sections expanded with mixed verdicts — first two are Agreed (Completed), consultation summary returned with comments (Awaiting changes), the remaining three not yet decided. */
export const MixedVerdicts = {
  render: () =>
    renderSummariesAccordion({
      site_description: { expanded: true, verdict: "accepted" },
      summary_of_works: { expanded: true, verdict: "accepted" },
      consultation_summary: {
        expanded: true,
        verdict: "rejected",
        comment:
          "Please add the Highways response received on 12 December 2024.",
      },
      neighbour_summary: { expanded: true },
      amenity: { expanded: true },
      additional_evidence: { expanded: true },
    }),
};
