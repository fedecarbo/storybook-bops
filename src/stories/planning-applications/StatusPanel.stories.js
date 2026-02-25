/**
 * Status panels provide an at-a-glance overview of an application's current state.
 * Displayed as a horizontal bar of status cards, optionally on a blue background.
 */
export default {
  title: "Planning Applications/Status Panel",
};

export const Default = {
  render: () => `
    <div class="status-bar-container status-bar-container--colored">
      <h2 class="govuk-heading-m">Application progress</h2>
      <div class="status-bar">
        <div class="status-panel">
          <h3 class="govuk-heading-s govuk-!-margin-bottom-0">Validation</h3>
          <p class="govuk-body-s">
            <strong class="govuk-tag govuk-tag--green govuk-tag--status-complete">Complete</strong>
          </p>
        </div>
        <div class="status-panel status-panel--highlighted">
          <h3 class="govuk-heading-s govuk-!-margin-bottom-0">Assessment</h3>
          <p class="govuk-body-s">
            <strong class="govuk-tag govuk-tag--light-blue govuk-tag--status-in_progress">In progress</strong>
          </p>
        </div>
        <div class="status-panel">
          <h3 class="govuk-heading-s govuk-!-margin-bottom-0">Review</h3>
          <p class="govuk-body-s">
            <strong class="govuk-tag govuk-tag--blue govuk-tag--status-not_started">Not started</strong>
          </p>
        </div>
        <div class="status-panel">
          <h3 class="govuk-heading-s govuk-!-margin-bottom-0">Decision</h3>
          <p class="govuk-body-s">
            <strong class="govuk-tag govuk-tag--blue govuk-tag--status-not_started">Not started</strong>
          </p>
        </div>
      </div>
    </div>
  `,
};

export const AllComplete = {
  render: () => `
    <div class="status-bar-container status-bar-container--colored">
      <h2 class="govuk-heading-m">Application progress</h2>
      <div class="status-bar">
        <div class="status-panel">
          <h3 class="govuk-heading-s govuk-!-margin-bottom-0">Validation</h3>
          <p class="govuk-body-s">
            <strong class="govuk-tag govuk-tag--green govuk-tag--status-complete">Complete</strong>
          </p>
        </div>
        <div class="status-panel">
          <h3 class="govuk-heading-s govuk-!-margin-bottom-0">Assessment</h3>
          <p class="govuk-body-s">
            <strong class="govuk-tag govuk-tag--green govuk-tag--status-complete">Complete</strong>
          </p>
        </div>
        <div class="status-panel">
          <h3 class="govuk-heading-s govuk-!-margin-bottom-0">Review</h3>
          <p class="govuk-body-s">
            <strong class="govuk-tag govuk-tag--green govuk-tag--status-complete">Complete</strong>
          </p>
        </div>
        <div class="status-panel status-panel--highlighted">
          <h3 class="govuk-heading-s govuk-!-margin-bottom-0">Decision</h3>
          <p class="govuk-body-s">
            <strong class="govuk-tag govuk-tag--green govuk-tag--status-approved">Approved</strong>
          </p>
        </div>
      </div>
    </div>
  `,
};
