/**
 * GOV.UK summary lists display key-value information in a structured format.
 * Commonly used in BOPS for application details, site information, and case summaries.
 */
export default {
  title: "Content/Summary List",
};

export const ApplicationDetails = {
  render: () => `
    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">Reference</dt>
        <dd class="govuk-summary-list__value">BPS-24-00123-FUL</dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">Application type</dt>
        <dd class="govuk-summary-list__value">Full planning permission</dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">Site address</dt>
        <dd class="govuk-summary-list__value">12 High Street, London, SE1 1AA</dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">Ward</dt>
        <dd class="govuk-summary-list__value">Borough and Bankside</dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">Case officer</dt>
        <dd class="govuk-summary-list__value">Sarah Johnson</dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">Status</dt>
        <dd class="govuk-summary-list__value">
          <strong class="govuk-tag govuk-tag--light-blue govuk-tag--status-in_progress">In progress</strong>
        </dd>
      </div>
    </dl>
  `,
};

export const WithActions = {
  render: () => `
    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">Applicant name</dt>
        <dd class="govuk-summary-list__value">John Smith</dd>
        <dd class="govuk-summary-list__actions">
          <a class="govuk-link" href="#">Change<span class="govuk-visually-hidden"> applicant name</span></a>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">Agent name</dt>
        <dd class="govuk-summary-list__value">ABC Architecture Ltd</dd>
        <dd class="govuk-summary-list__actions">
          <a class="govuk-link" href="#">Change<span class="govuk-visually-hidden"> agent name</span></a>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">Contact email</dt>
        <dd class="govuk-summary-list__value">john.smith@example.com</dd>
        <dd class="govuk-summary-list__actions">
          <a class="govuk-link" href="#">Change<span class="govuk-visually-hidden"> contact email</span></a>
        </dd>
      </div>
    </dl>
  `,
};
