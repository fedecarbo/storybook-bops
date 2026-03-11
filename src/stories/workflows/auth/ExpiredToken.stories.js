/**
 * Documents the current (broken) and ideal (improved) user journeys
 * when a password reset or email confirmation link has expired.
 *
 * Current: user sees the form, fills it in, then gets an unhelpful error.
 * Ideal: user is warned immediately with clear instructions on what to do next.
 */
export default {
  title: "Workflows/Authentication/Expired Token",
  parameters: { layout: "fullscreen" },
  decorators: [
    (story) =>
      `<div style="max-width: 960px; margin: 40px auto; padding: 0 30px; font-family: 'GDS Transport', arial, sans-serif;">${story()}</div>`,
  ],
};

// ---------------------------------------------------------------------------
// Shared markup helpers
// ---------------------------------------------------------------------------

function renderSignInPage({ banner = "" } = {}) {
  return `
    ${banner}
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Planning applications</h1>

        <form>
          <div class="govuk-form-group">
            <label class="govuk-label" for="email">Email</label>
            <input class="govuk-input govuk-input--width-30" id="email" type="text" autocomplete="email">
          </div>
          <div class="govuk-form-group">
            <label class="govuk-label" for="password">Password</label>
            <input class="govuk-input govuk-input--width-30" id="password" type="password" autocomplete="current-password">
          </div>
          <button type="submit" class="govuk-button" data-module="govuk-button">Log in</button>
        </form>

        <p class="govuk-body">
          <a class="govuk-link" href="#">Forgot your password?</a>
        </p>
      </div>
    </div>
  `;
}

function renderPasswordForm({ errorSummary = "" } = {}) {
  return `
    ${errorSummary}
    <h1 class="govuk-heading-l">Create your password</h1>

    <form>
      <div class="govuk-form-group govuk-!-margin-top-8">
        <label class="govuk-heading-s govuk-!-margin-bottom-1" for="new-password">New password</label>
        <span class="govuk-hint govuk-!-margin-bottom-1">Your password must have:</span>
        <ul class="govuk-!-margin-top-1">
          <li class="govuk-hint govuk-!-margin-bottom-1">at least 12 characters</li>
          <li class="govuk-hint govuk-!-margin-bottom-1">at least one symbol (for example, ?!£%)</li>
          <li class="govuk-hint govuk-!-margin-bottom-1">at least one capital letter and one lower case letter</li>
          <li class="govuk-hint govuk-!-margin-bottom-1">no dictionary words or other common passwords</li>
        </ul>
        <input class="govuk-input govuk-input--width-20" id="new-password" type="password" autocomplete="new-password">

        <label class="govuk-heading-s govuk-!-margin-top-6" for="confirm-password">Confirm new password</label>
        <input class="govuk-input govuk-input--width-20" id="confirm-password" type="password" autocomplete="new-password">

        <br>
        <button type="submit" class="govuk-button govuk-!-margin-top-7 govuk-!-margin-bottom-4" data-module="govuk-button">Change password</button>
      </div>
    </form>

    <p class="govuk-body govuk-!-margin-top-8">
      <a class="govuk-link" href="#">Log in</a>
    </p>
  `;
}

function renderForgotPasswordPage() {
  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Forgot your password?</h1>

        <form>
          <div class="govuk-form-group">
            <label class="govuk-label govuk-!-margin-top-8" for="reset-email">Email</label>
            <input class="govuk-input govuk-input--width-30" id="reset-email" type="email" autocomplete="email">
          </div>
          <button type="submit" class="govuk-button" data-module="govuk-button">Send me reset password instructions</button>
        </form>

        <p class="govuk-body govuk-!-margin-top-8">
          <a class="govuk-link" href="#">Log in</a>
        </p>
      </div>
    </div>
  `;
}

function renderEmail({ confirmed = true } = {}) {
  const greeting = "Hello Jane Smith.";
  const councilName = "Buckinghamshire Council";

  if (confirmed) {
    return `
      <div style="background: #f3f2f1; padding: 30px; border-left: 4px solid #1d70b8; font-family: arial, sans-serif; max-width: 580px;">
        <p style="margin-top: 0;">${greeting}</p>
        <p>Someone has requested a link to change your password. You can do this through the link below.</p>
        <p><a href="#" style="color: #1d70b8;">https://${councilName.toLowerCase().replace(/ /g, "")}.bops.services/users/password/edit?reset_password_token=abc123...</a></p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Your password won't change until you access the link above and create a new one.</p>
        <p style="margin-bottom: 0;">The link will expire after 6 hours.</p>
      </div>
    `;
  }

  return `
    <div style="background: #f3f2f1; padding: 30px; border-left: 4px solid #1d70b8; font-family: arial, sans-serif; max-width: 580px;">
      <p style="margin-top: 0;">${greeting}</p>
      <p>Welcome to the Back-office Planning System for ${councilName}.</p>
      <p>You can confirm your account and set a password through the link below:</p>
      <p><a href="#" style="color: #1d70b8;">https://${councilName.toLowerCase().replace(/ /g, "")}.bops.services/users/password/edit?reset_password_token=abc123...</a></p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Your password won't change until you access the link above and create a new one.</p>
      <p style="margin-bottom: 0;">The link will expire after 6 hours.</p>
    </div>
  `;
}

function renderAlertBanner(message) {
  return `
    <div class="govuk-notification-banner govuk-notification-banner--alert" role="alert" aria-labelledby="govuk-notification-banner-title" data-module="govuk-notification-banner">
      <div class="govuk-notification-banner__header">
        <h2 class="govuk-notification-banner__title" id="govuk-notification-banner-title">
          Important
        </h2>
      </div>
      <div class="govuk-notification-banner__content">
        <p class="govuk-notification-banner__heading">
          ${message}
        </p>
      </div>
    </div>
  `;
}

function renderErrorSummary(message) {
  return `
    <div class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="govuk-error-summary">
      <h2 class="govuk-error-summary__title" id="error-summary-title">
        There is a problem
      </h2>
      <div class="govuk-error-summary__body">
        <ul class="govuk-list govuk-error-summary__list">
          <li><a href="#new-password">${message}</a></li>
        </ul>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// CURRENT JOURNEY — Confirmed user (reset password)
// ---------------------------------------------------------------------------

export const CurrentEmail_Confirmed = {
  name: "Current: Reset password email",
  render: () => renderEmail({ confirmed: true }),
};

export const CurrentEmail_Unconfirmed = {
  name: "Current: Confirm account email",
  render: () => renderEmail({ confirmed: false }),
};

export const CurrentExpiredForm = {
  name: "Current: Expired link shows form (no warning)",
  render: () => renderPasswordForm(),
};

export const CurrentErrorAfterSubmit = {
  name: "Current: Error only appears after submitting",
  render: () =>
    renderPasswordForm({
      errorSummary: renderErrorSummary(
        "The reset password link you used no longer works. Please request a new link and try again."
      ),
    }),
};

export const CurrentForgotPasswordPage = {
  name: "Current: Forgot your password page",
  render: () => renderForgotPasswordPage(),
};

// ---------------------------------------------------------------------------
// IDEAL JOURNEY — Confirmed user (reset password)
// ---------------------------------------------------------------------------

export const IdealExpired_Confirmed = {
  name: "Ideal: Confirmed user sees immediate warning",
  render: () =>
    renderSignInPage({
      banner: renderAlertBanner(
        'Your password reset link has expired. Request a new one using the \'Forgot your password?\' link below.'
      ),
    }),
};

// ---------------------------------------------------------------------------
// IDEAL JOURNEY — Unconfirmed user (confirm email)
// ---------------------------------------------------------------------------

export const IdealExpired_Unconfirmed = {
  name: "Ideal: Unconfirmed user sees immediate warning",
  render: () =>
    renderSignInPage({
      banner: renderAlertBanner(
        "Your account confirmation link has expired. Contact your administrator to request a new one."
      ),
    }),
};
