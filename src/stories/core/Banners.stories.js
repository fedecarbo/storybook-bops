/**
 * BOPS uses coloured banners to communicate different types of messages.
 * Each variant has a distinct border colour to convey urgency or status.
 */
export default {
  title: "Core/Banners",
};

export const SuccessBanner = {
  render: () => `
    <div class="flash-archive">
      <h2 class="govuk-heading-m govuk-!-margin-bottom-0">Application successfully archived</h2>
      <p class="govuk-body">The application has been moved to the archive.</p>
    </div>
  `,
};

export const CorrectionsBanner = {
  render: () => `
    <div class="corrections-banner">
      <h2 class="govuk-heading-m govuk-!-margin-bottom-0">Corrections needed</h2>
      <p class="govuk-body">There are 3 items that need to be corrected before the application can proceed.</p>
    </div>
  `,
};

export const ResponseBanner = {
  render: () => `
    <div class="response-banner">
      <h2 class="govuk-heading-m govuk-!-margin-bottom-0">New consultee response received</h2>
      <p class="govuk-body">A response has been submitted for this application.</p>
    </div>
  `,
};

export const NotificationBannerSuccess = {
  render: () => `
    <div class="govuk-notification-banner govuk-notification-banner--success" role="alert" aria-labelledby="govuk-notification-banner-title" data-module="govuk-notification-banner">
      <div class="govuk-notification-banner__header">
        <h2 class="govuk-notification-banner__title" id="govuk-notification-banner-title">
          Success
        </h2>
      </div>
      <div class="govuk-notification-banner__content">
        <p class="govuk-notification-banner__heading">
          Decision notice has been sent
        </p>
      </div>
    </div>
  `,
};

export const NotificationBannerDefault = {
  render: () => `
    <div class="govuk-notification-banner" role="region" aria-labelledby="govuk-notification-banner-title" data-module="govuk-notification-banner">
      <div class="govuk-notification-banner__header">
        <h2 class="govuk-notification-banner__title" id="govuk-notification-banner-title">
          Important
        </h2>
      </div>
      <div class="govuk-notification-banner__content">
        <p class="govuk-notification-banner__heading">
          This application has been updated since your last review.
          <a class="govuk-notification-banner__link" href="#">View the changes</a>
        </p>
      </div>
    </div>
  `,
};
