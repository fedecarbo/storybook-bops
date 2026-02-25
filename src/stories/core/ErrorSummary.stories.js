/**
 * The GOV.UK error summary panel, displayed at the top of a page when
 * form validation fails. Lists all errors with links to the relevant fields.
 */
export default {
  title: "Core/Error Summary",
};

export const SingleError = {
  render: () => `
    <div class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="govuk-error-summary">
      <h2 class="govuk-error-summary__title" id="error-summary-title">
        There is a problem
      </h2>
      <div class="govuk-error-summary__body">
        <ul class="govuk-list govuk-error-summary__list">
          <li><a href="#field-name">Enter the applicant's full name</a></li>
        </ul>
      </div>
    </div>
  `,
};

export const MultipleErrors = {
  render: () => `
    <div class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="govuk-error-summary">
      <h2 class="govuk-error-summary__title" id="error-summary-title">
        There is a problem
      </h2>
      <div class="govuk-error-summary__body">
        <ul class="govuk-list govuk-error-summary__list">
          <li><a href="#field-description">Enter a description of the proposed development</a></li>
          <li><a href="#field-address">Enter the site address</a></li>
          <li><a href="#field-decision">Select a decision</a></li>
        </ul>
      </div>
    </div>
  `,
};
