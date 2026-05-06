/**
 * Sign-off Recommendation (Task 42) — the dedicated page reached from the
 * Review task list when every accordion section has been agreed. This is the
 * one Review-stage screen that lives on its own URL
 * (/planning_applications/:id/review/recommendation/edit). The reviewer
 * verifies the assessor's recommendation, reads the audit trail of past
 * submissions, and either accepts (sending the application to determination)
 * or returns the recommendation with comments.
 */
import {
  mockData,
  renderBreadcrumbs,
  renderStatusTag,
} from "../../../helpers";

export default {
  title: "Workflows/Planning Permission/4. Review/Sign-off Recommendation",
  parameters: { layout: "fullscreen" },
  decorators: [
    (story) =>
      `<div style="max-width: 1100px; margin: 0 auto; padding: 30px 20px;">${story()}</div>`,
  ],
};

const { application, documents, people, review } = mockData;

// ---------------------------------------------------------------------------
// Page chrome
// ---------------------------------------------------------------------------

function renderPageBreadcrumbs(currentPage) {
  return renderBreadcrumbs([
    { text: "Home", href: "#" },
    { text: application.reference, href: "#" },
    { text: "Review", href: "#" },
    { text: currentPage },
  ]);
}

function renderRecommendationPanel(headingLabel) {
  return `
    <h2 class="govuk-heading-m">${headingLabel}</h2>
    <p>${renderStatusTag(review.recommendation.decisionStatus)}</p>
    <div class="govuk-warning-text">
      <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
      <strong class="govuk-warning-text__text">
        <span class="govuk-visually-hidden">Warning</span>
        This information will appear on the decision notice and the officer report.
      </strong>
    </div>
    <p class="govuk-body">${review.recommendation.publicComment}</p>
    <p><a class="govuk-link govuk-body" href="#">Edit information on the decision notice</a></p>
    <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">`;
}

function renderDocumentsTable() {
  const referenced = documents.slice(0, 4);
  const rows = referenced
    .map(
      (d) => `
        <tr class="govuk-table__row">
          <td class="govuk-table__cell">${d.name}</td>
          <td class="govuk-table__cell">${(d.tags || []).join(", ") || "—"}</td>
        </tr>`,
    )
    .join("");
  return `
    <h2 class="govuk-heading-m">Documents included in the decision notice</h2>
    <table class="govuk-table">
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th scope="col" class="govuk-table__header">Document</th>
          <th scope="col" class="govuk-table__header">Tags</th>
        </tr>
      </thead>
      <tbody class="govuk-table__body">${rows}</tbody>
    </table>
    <p><a class="govuk-link govuk-body" href="#">Add and edit documents</a></p>`;
}

function renderAuditTrail(events) {
  const eventsHtml = events
    .map(
      (e) => `
        <div class="recommendation-event">
          <p>
            <span class="govuk-!-font-weight-bold">${e.action}</span><br>
            by ${e.name}, ${e.date} at ${e.time}
          </p>
          <p>${e.comment}</p>
        </div>`,
    )
    .join("");
  return `
    <h2 class="govuk-heading-m">Assessor and reviewer audit</h2>
    <div class="recommendations govuk-inset-text">
      ${eventsHtml}
    </div>`;
}

function renderConsultationStillOpenBanner() {
  return `
    <div class="govuk-warning-text">
      <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
      <strong class="govuk-warning-text__text">
        <span class="govuk-visually-hidden">Warning</span>
        The consultation is still ongoing. It will end on ${mockData.dates.consultationEnd}. Are you sure you still want to make the recommendation?
      </strong>
    </div>`;
}

// ---------------------------------------------------------------------------
// Form variants
// ---------------------------------------------------------------------------

function renderNonCommitteeForm({ verdict = null, comment = "" } = {}) {
  const yesChecked = verdict === "yes" ? " checked" : "";
  const noChecked = verdict === "no" ? " checked" : "";
  const conditionalHidden =
    verdict === "no" ? "" : " govuk-radios__conditional--hidden";

  return `
    <form>
      <div class="govuk-form-group">
        <fieldset class="govuk-fieldset">
          <legend class="govuk-fieldset__legend govuk-fieldset__legend--s">
            Do you agree with the recommendation?
          </legend>
          <div class="govuk-radios govuk-radios--small govuk-radios--conditional" data-module="govuk-radios">
            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="challenged-yes" name="challenged" type="radio" value="false"${yesChecked}>
              <label class="govuk-label govuk-radios__label" for="challenged-yes">Yes (decision is ready to be published)</label>
            </div>
            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="challenged-no" name="challenged" type="radio" value="true" aria-controls="challenged-no-conditional" aria-expanded="${verdict === "no" ? "true" : "false"}"${noChecked}>
              <label class="govuk-label govuk-radios__label" for="challenged-no">No (return the case for assessment)</label>
            </div>
            <div class="govuk-radios__conditional${conditionalHidden}" id="challenged-no-conditional">
              <p class="govuk-body">
                Case currently assigned to: <span class="govuk-!-font-weight-bold">${people.caseOfficer.name}</span>
              </p>
              <div class="govuk-form-group">
                <label class="govuk-label" for="reviewer-comment">Reviewer comment</label>
                <textarea class="govuk-textarea" id="reviewer-comment" name="reviewer_comment" rows="5">${comment}</textarea>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      ${renderSubmitButtons()}
    </form>`;
}

function renderCommitteeForm({ verdict = null, comment = "" } = {}) {
  const yesChecked = verdict === "yes" ? " checked" : "";
  const yesAmendChecked = verdict === "yes_with_amendments" ? " checked" : "";
  const noChecked = verdict === "no" ? " checked" : "";
  const conditionalHidden =
    verdict === "yes_with_amendments"
      ? ""
      : " govuk-radios__conditional--hidden";

  return `
    <form>
      <div class="govuk-form-group">
        <fieldset class="govuk-fieldset">
          <legend class="govuk-fieldset__legend govuk-fieldset__legend--s">
            Did the committee agree with the recommendation?
          </legend>
          <div class="govuk-radios govuk-radios--conditional" data-module="govuk-radios">
            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="committee-yes" name="challenged" type="radio" value="false"${yesChecked}>
              <label class="govuk-label govuk-radios__label" for="committee-yes">Yes</label>
            </div>
            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="committee-amend" name="challenged" type="radio" value="true" aria-controls="committee-amend-conditional" aria-expanded="${verdict === "yes_with_amendments" ? "true" : "false"}"${yesAmendChecked}>
              <label class="govuk-label govuk-radios__label" for="committee-amend">Yes, with amendments (return to case officer)</label>
            </div>
            <div class="govuk-radios__conditional${conditionalHidden}" id="committee-amend-conditional">
              <p class="govuk-body">
                Case currently assigned to: <span class="govuk-!-font-weight-bold">${people.caseOfficer.name}</span>
              </p>
              <div class="govuk-form-group">
                <label class="govuk-label" for="committee-comment">Reviewer comment</label>
                <textarea class="govuk-textarea" id="committee-comment" name="reviewer_comment" rows="5">${comment}</textarea>
              </div>
            </div>
            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="committee-no" name="challenged" type="radio" value="committee_overturned"${noChecked}>
              <label class="govuk-label govuk-radios__label" for="committee-no">No</label>
            </div>
          </div>
        </fieldset>
      </div>
      <p class="govuk-body">If the committee did not agree, you can add details of their decision in the next step.</p>
      ${renderSubmitButtons()}
    </form>`;
}

function renderSubmitButtons() {
  return `
    <div class="govuk-button-group">
      <button type="submit" class="govuk-button" data-module="govuk-button">Save and mark as complete</button>
      <button type="submit" class="govuk-button govuk-button--secondary" data-module="govuk-button">Save and come back later</button>
      <a class="govuk-link" href="#">Back</a>
    </div>`;
}

// ---------------------------------------------------------------------------
// Page renderer
// ---------------------------------------------------------------------------

function renderSignOffPage({
  variant = "non_committee",
  verdict = null,
  comment = "",
  showConsultationOpenBanner = false,
  hasSuggestedChanges = false,
  audit = review.audit,
} = {}) {
  const isCommittee = variant === "committee";
  const heading = isCommittee
    ? "Update decision notice after committee"
    : "Sign off recommendation";
  const recommendationLabel = isCommittee
    ? "Committee recommendation"
    : "Assessor recommendation";

  const suggestedNote = hasSuggestedChanges
    ? `<p class="govuk-body">You have suggested changes to be made by the officer.</p>
       <p><a class="govuk-link govuk-body" href="#">Review changes</a></p>`
    : `<p class="govuk-body">You haven't suggested changes to be made by the officer.</p>`;

  const form = isCommittee
    ? renderCommitteeForm({ verdict, comment })
    : renderNonCommitteeForm({ verdict, comment });

  return `
    ${renderPageBreadcrumbs(heading)}
    <h1 class="govuk-heading-l">${heading}</h1>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds application">
        ${renderRecommendationPanel(recommendationLabel)}
        ${renderDocumentsTable()}
        ${renderAuditTrail(audit)}
        ${suggestedNote}
        ${showConsultationOpenBanner ? renderConsultationStillOpenBanner() : ""}
        ${form}
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Initial view — the form is rendered with no radio selected. The reviewer is reading the assessor's recommendation, the documents list, and the audit trail. */
export const InitialView = {
  render: () => renderSignOffPage(),
};

/** "Yes (decision is ready to be published)" selected. The conditional No-panel stays hidden. Submitting will send the application to determination. */
export const AcceptingRecommendation = {
  render: () => renderSignOffPage({ verdict: "yes" }),
};

/** "No (return the case for assessment)" selected. The conditional panel is revealed showing the case officer's name and a populated reviewer comment. Submitting returns the recommendation to the assessor. */
export const ReturningWithComments = {
  render: () =>
    renderSignOffPage({
      verdict: "no",
      comment: review.reviewerComment,
      hasSuggestedChanges: true,
      audit: review.auditAfterChallenge,
    }),
};

/** Initial view + the consultation-still-open warning banner. Mirrors the edit.html.erb branch when consultation.publicity_active? returns true. */
export const WithConsultationStillOpen = {
  render: () =>
    renderSignOffPage({ showConsultationOpenBanner: true }),
};

/** Committee variant — three radios ("Yes", "Yes, with amendments", "No"); the middle one reveals a conditional comment panel. The page heading and the recommendation panel heading both swap to committee phrasing. */
export const CommitteeVariant = {
  render: () =>
    renderSignOffPage({ variant: "committee", verdict: "yes_with_amendments", comment: review.reviewerComment }),
};
