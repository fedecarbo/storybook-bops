/**
 * Review Conditions (Task 43) — focused view of the "Review conditions"
 * bops-task-accordion in isolation. This accordion contains a variable
 * number of sub-sections depending on the application type — considerations
 * (always when started), pre-commencement conditions, conditions,
 * informatives, and (rarer) immunity / permitted-development-rights blocks.
 *
 * Each sub-section shows the assessor's content (a list of items wrapped in
 * bops-summary blocks with per-item Edit links) and an inline footer form
 * for the reviewer to Agree or Return-with-comments.
 *
 * Appears on the Review task list page within the fourth top-level
 * accordion. Stories here cover the four most common sub-sections.
 */
import {
  mockData,
  renderBopsSummary,
  renderBopsTaskAccordion,
  renderInlineReviewForm,
  renderStatusTag,
} from "../../../helpers";

export default {
  title: "Workflows/Planning Permission/4. Review/Review Conditions",
  parameters: { layout: "fullscreen" },
  decorators: [
    (story) =>
      `<div style="max-width: 1100px; margin: 0 auto; padding: 30px 20px;">${story()}</div>`,
  ],
};

const { review } = mockData;

// ---------------------------------------------------------------------------
// Sub-section block builders — each mirrors the corresponding partial in
// app/views/planning_applications/review/tasks/summaries/.
// ---------------------------------------------------------------------------

function renderConsiderationItem(c) {
  return renderBopsSummary(`
    <span class="govuk-caption-m">Consideration ${c.position}</span>
    <h2 class="govuk-heading-m govuk-!-margin-bottom-3">${c.policyArea}</h2>
    <h3 class="govuk-heading-s">Policy</h3>
    <p class="govuk-body">${c.policyReferences}</p>
    ${c.policyGuidance ? `<h3 class='govuk-heading-s'>Guidance</h3><p class='govuk-body'>${c.policyGuidance}</p>` : ""}
    <h3 class="govuk-heading-s">Assessment</h3>
    <p class="govuk-body">${c.assessment}</p>
    <h3 class="govuk-heading-s">Conclusion</h3>
    <p class="govuk-body">${c.conclusion}</p>
    <p class="govuk-body"><a class="govuk-link" href="#">Edit to accept</a></p>
  `);
}

function renderConsiderationsBlock() {
  const items = review.considerations.map(renderConsiderationItem).join("");
  return `
    <p class="govuk-body">
      <a class="govuk-link" href="#" target="_blank" rel="noopener">Check your local policies and guidance</a>
    </p>
    <ol class="govuk-list">
      ${review.considerations.map((c) => `<li id="consideration-${c.position}">${renderConsiderationItem(c)}</li>`).join("")}
    </ol>
    <p class="govuk-body-s govuk-!-margin-bottom-0">
      <a class="govuk-link" href="#">Rearrange assessments against policies and guidance</a>
    </p>`;
}

function renderConditionItem(c) {
  return renderBopsSummary(`
    <span class="govuk-caption-m">Condition ${c.position}</span>
    <h2 class="govuk-heading-m govuk-!-margin-bottom-3">${c.title}</h2>
    <h3 class="govuk-heading-s">Text</h3>
    <p class="govuk-body">${c.text}</p>
    <h3 class="govuk-heading-s">Reason</h3>
    <p class="govuk-body">${c.reason}</p>
    <p class="govuk-body"><a class="govuk-link" href="#">Edit to accept</a></p>
  `);
}

function renderConditionsBlock() {
  return `
    <ol class="govuk-list">
      ${review.conditions.map((c) => `<li id="condition-${c.position}">${renderConditionItem(c)}</li>`).join("")}
    </ol>
    <p class="govuk-body-s govuk-!-margin-bottom-0">
      <a class="govuk-link" href="#">Rearrange conditions</a>
    </p>`;
}

function renderInformativeItem(i) {
  return renderBopsSummary(`
    <span class="govuk-caption-m">Informative ${i.position}</span>
    <h2 class="govuk-heading-m govuk-!-margin-bottom-3">${i.title}</h2>
    <p class="govuk-body">${i.text}</p>
    <p class="govuk-body"><a class="govuk-link" href="#">Edit to accept</a></p>
  `);
}

function renderInformativesBlock() {
  return `
    <ol class="govuk-list">
      ${review.informatives.map((i) => `<li id="informative-${i.position}">${renderInformativeItem(i)}</li>`).join("")}
    </ol>
    <p class="govuk-body-s govuk-!-margin-bottom-0">
      <a class="govuk-link" href="#">Rearrange informatives</a>
    </p>`;
}

function renderEmptyBlock(message) {
  return renderBopsSummary(`<p class='govuk-body'>${message}</p>`);
}

// ---------------------------------------------------------------------------
// Section + accordion builder. State keys match the section ids:
//   review-considerations / review-pre-commencement-conditions /
//   review-conditions / review-informatives
// Each value: { expanded?, verdict?, status?, comment? }
// ---------------------------------------------------------------------------

function statusFromVerdict(verdict) {
  if (verdict === "accepted") return "complete";
  if (verdict === "rejected") return "awaiting_changes";
  return "not_started";
}

function buildSection({ id, heading, blocks, state = {} }) {
  const status = state.status || statusFromVerdict(state.verdict);
  return {
    id,
    heading,
    expanded: state.expanded === true,
    statusTag: renderStatusTag(status),
    blocks,
    footer: renderInlineReviewForm({
      id,
      verdict: state.verdict || null,
      comment: state.comment || "",
    }),
  };
}

function renderConditionsAccordion(state = {}) {
  return renderBopsTaskAccordion({
    id: "review-conditions-section",
    heading: "Review conditions",
    sections: [
      buildSection({
        id: "review-considerations",
        heading: "Review assessment against policies and guidance",
        blocks: [renderConsiderationsBlock()],
        state: state["review-considerations"],
      }),
      buildSection({
        id: "review-pre-commencement-conditions",
        heading: "Review pre-commencement conditions",
        blocks: [renderEmptyBlock("There are no pre-commencement conditions for this application.")],
        state: state["review-pre-commencement-conditions"],
      }),
      buildSection({
        id: "review-conditions",
        heading: "Review conditions",
        blocks: [renderConditionsBlock()],
        state: state["review-conditions"],
      }),
      buildSection({
        id: "review-informatives",
        heading: "Review informatives",
        blocks: [renderInformativesBlock()],
        state: state["review-informatives"],
      }),
    ],
  });
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** All four sub-sections collapsed, "Not started" status tags. */
export const AllSectionsCollapsed = {
  render: () => renderConditionsAccordion(),
};

/** "Review assessment against policies and guidance" expanded. The reviewer sees the full content for both considerations (policy / assessment / conclusion) with an "Edit to accept" link per item, plus the form footer awaiting a verdict. */
export const ConsiderationsExpanded = {
  render: () =>
    renderConditionsAccordion({
      "review-considerations": { expanded: true },
    }),
};

/** "Review conditions" expanded with both conditions visible, "Agree" radio selected, status tag is "Completed". */
export const ConditionsExpandedAgreed = {
  render: () =>
    renderConditionsAccordion({
      "review-conditions": { expanded: true, verdict: "accepted" },
    }),
};

/** "Review conditions" expanded, "Return with comments" selected with a comment explaining what needs to change. Status tag is "Awaiting changes". */
export const ConditionsExpandedReturnedWithComments = {
  render: () =>
    renderConditionsAccordion({
      "review-conditions": {
        expanded: true,
        verdict: "rejected",
        comment:
          "Condition 2 should reference the most recent revision of the elevations drawing (24-LG-200 Rev B).",
      },
    }),
};
