/**
 * Site Notice — during consultation, the case officer decides whether
 * the application requires a site notice, specifies quantity and
 * delivery method (email to team, email to applicant, or print PDF),
 * and later confirms display with date and photo evidence.
 *
 * Stories show: the initial Yes/No form, the three delivery branches,
 * email previews, the confirm notice form, and the completed read-only view.
 */
import { mockData } from "../../../helpers";

export default {
  title: "Workflows/Planning Permission/2. Consultation/Site Notice",
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (story) =>
      `<div style="max-width: 1100px; margin: 0 auto; padding: 30px 20px;">${story()}</div>`,
  ],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const { siteNotice, application, dates, people } = mockData;

function renderDateInput(id, legend, hint) {
  return `
    <fieldset class="govuk-fieldset" role="group">
      <legend class="govuk-fieldset__legend govuk-fieldset__legend--s">
        ${legend}
      </legend>
      ${hint ? `<div class="govuk-hint">${hint}</div>` : ""}
      <div class="govuk-date-input" id="${id}">
        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label class="govuk-label govuk-date-input__label" for="${id}-day">Day</label>
            <input class="govuk-input govuk-date-input__input govuk-input--width-2" id="${id}-day" name="${id}[day]" type="text" inputmode="numeric">
          </div>
        </div>
        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label class="govuk-label govuk-date-input__label" for="${id}-month">Month</label>
            <input class="govuk-input govuk-date-input__input govuk-input--width-2" id="${id}-month" name="${id}[month]" type="text" inputmode="numeric">
          </div>
        </div>
        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label class="govuk-label govuk-date-input__label" for="${id}-year">Year</label>
            <input class="govuk-input govuk-date-input__input govuk-input--width-4" id="${id}-year" name="${id}[year]" type="text" inputmode="numeric">
          </div>
        </div>
      </div>
    </fieldset>`;
}

function renderStatusBar() {
  return `
    <hr class="govuk-section-break govuk-section-break--visible govuk-!-margin-top-7">
    <div class="flex-between govuk-!-margin-top-3 govuk-!-margin-bottom-3">
      <p class="govuk-!-margin-top-1">
        Site notice created and emailed to internal team<br>
        <a class="govuk-link" href="#">Download site notice PDF</a>
      </p>
      <div class="consultation-letter-status">
        <div>
          <strong class="govuk-tag govuk-tag--green">Complete</strong>
        </div>
        <p class="govuk-body-s govuk-!-margin-top-1 govuk-!-margin-bottom-0">
          on ${siteNotice.createdAt}
        </p>
      </div>
    </div>
    <hr class="govuk-section-break govuk-section-break--visible govuk-!-margin-bottom-7">`;
}

function renderSiteNoticeForm(options = {}) {
  const {
    yesSelected = false,
    noSelected = false,
    method = null,
    quantity = 1,
    locationInstructions = "",
    internalTeamEmail = "",
  } = options;

  const yesChecked = yesSelected ? " checked" : "";
  const noChecked = noSelected ? " checked" : "";

  // Method radio states
  const internalTeamChecked = method === "internal_team" ? " checked" : "";
  const applicantChecked = method === "applicant" ? " checked" : "";

  // Conditional email field for internal team
  const internalTeamEmailField =
    method === "internal_team"
      ? `
        <div class="govuk-radios__conditional" id="conditional-method-internal">
          <div class="govuk-form-group">
            <label class="govuk-label" for="internal-team-email">
              Internal team email
            </label>
            <input class="govuk-input" id="internal-team-email" name="internal_team_email" type="email" value="${internalTeamEmail}">
          </div>
        </div>`
      : "";

  const conditionalContent = yesSelected
    ? `
      <div class="govuk-radios__conditional" id="conditional-required-yes">
        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--s" for="quantity">
            Number of site notices
          </label>
          <input class="govuk-input govuk-input--width-4" id="quantity" name="quantity" type="number" value="${quantity}" min="1">
        </div>

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--s" for="location-instructions">
            Where should notices be displayed?
          </label>
          <div class="govuk-hint">
            Optional. Anything you add here may be shared with the recipient (including the applicant).
          </div>
          <textarea class="govuk-textarea" id="location-instructions" name="location_instructions" rows="5">${locationInstructions}</textarea>
        </div>

        <div class="grey-box" id="email-site-notice">
          <fieldset class="govuk-fieldset">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              Email the site notice
            </legend>
            <div class="govuk-hint">
              If you are printing the site notice yourself, you can skip this step.
            </div>
            <div class="govuk-radios" data-module="govuk-radios">
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="method-internal" name="method" type="radio" value="internal_team"${internalTeamChecked} data-aria-controls="conditional-method-internal">
                <label class="govuk-label govuk-radios__label" for="method-internal">Send it by email to internal team to post</label>
              </div>
              ${internalTeamEmailField}
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="method-applicant" name="method" type="radio" value="applicant"${applicantChecked}>
                <label class="govuk-label govuk-radios__label" for="method-applicant">Send it by email to applicant</label>
              </div>
            </div>
          </fieldset>

          <button type="submit" class="govuk-button govuk-button--primary govuk-!-margin-top-4 govuk-!-margin-bottom-0" data-module="govuk-button">
            Email site notice and mark as complete
          </button>
        </div>

        <h3 class="govuk-heading-s govuk-!-margin-top-4 govuk-!-margin-bottom-4">OR</h3>

        <div class="grey-box" id="print-site-notice">
          <div class="govuk-form-group">
            ${renderDateInput(
              "displayed-at",
              "Print the site notice",
              "Create and then download a PDF which you can print. Enter the date the site notice will be displayed."
            )}
          </div>

          <button type="submit" class="govuk-button govuk-button--primary govuk-!-margin-bottom-0" data-module="govuk-button">
            Create site notice
          </button>
        </div>

        <div class="govuk-button-group govuk-!-padding-top-7">
          <a class="govuk-link" href="#">Back</a>
        </div>
      </div>`
    : "";

  // When "No" is selected, show a different action area
  const noAction = noSelected
    ? `
      <div class="govuk-button-group govuk-!-padding-top-4">
        <button type="submit" class="govuk-button govuk-button--primary" data-module="govuk-button">
          Save and mark as complete
        </button>
        <a class="govuk-link" href="#">Back</a>
      </div>`
    : "";

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Send site notice</h1>

        <div class="govuk-form-group">
          <fieldset class="govuk-fieldset">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              Does this application require a site notice?
            </legend>
            <div class="govuk-radios" data-module="govuk-radios">
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="required-yes" name="required" type="radio" value="true"${yesChecked} data-aria-controls="conditional-required-yes">
                <label class="govuk-label govuk-radios__label" for="required-yes">Yes</label>
              </div>
              ${conditionalContent}
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="required-no" name="required" type="radio" value="false"${noChecked}>
                <label class="govuk-label govuk-radios__label" for="required-no">No</label>
              </div>
            </div>
          </fieldset>
        </div>

        ${noAction}
      </div>
    </div>`;
}

function renderConfirmNoticeForm() {
  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Confirm site notice is in place</h1>

        ${renderStatusBar()}

        <div class="govuk-form-group">
          ${renderDateInput(
            "displayed-at",
            "1. What date was the site notice displayed?",
            null
          )}
        </div>

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--m" for="evidence-upload">
            2. Upload evidence of site notice in place
          </label>
          <div class="govuk-hint">
            Add any photos of the site notice being displayed
          </div>
          <input class="govuk-file-upload" id="evidence-upload" name="documents[]" type="file" multiple>
        </div>

        <div class="govuk-button-group govuk-!-padding-top-7">
          <button type="submit" class="govuk-button" data-module="govuk-button">
            Save and mark as complete
          </button>
          <a class="govuk-link" href="#">Back</a>
        </div>
      </div>
    </div>`;
}

function renderCompletedView() {
  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Site notice</h1>

        ${renderStatusBar()}

        <table class="govuk-table govuk-!-margin-top-6">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header govuk-!-width-one-third">Document</th>
              <th scope="col" class="govuk-table__header govuk-!-width-one-third">Tags</th>
              <th scope="col" class="govuk-table__header govuk-!-width-one-third">Date displayed</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell govuk-!-width-one-third">
                <p class="govuk-!-margin-bottom-1">
                  <div class="document-thumbnail-placeholder" style="width: 120px; height: 85px;">
                    <span style="font-size: 11px;">${siteNotice.evidenceFilename}</span>
                  </div>
                </p>
                <p>
                  ${siteNotice.evidenceFilename}<br>
                  <a class="govuk-link" href="#">View in new window</a>
                </p>
              </td>
              <td class="govuk-table__cell govuk-!-width-one-third">
                <strong class="govuk-tag govuk-tag--turquoise">
                  Site notice evidence
                </strong>
              </td>
              <td class="govuk-table__cell govuk-!-width-one-third">
                <p class="govuk-!-margin-bottom-1">
                  ${siteNotice.displayedAt}
                </p>
              </td>
            </tr>
          </tbody>
        </table>

        <a class="govuk-link" href="#">Back</a>
      </div>
    </div>`;
}

function renderEmailPreview({ subject, to, body }) {
  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Email preview</h1>

        <table class="govuk-table">
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <th scope="row" class="govuk-table__header" style="width: 100px;">To</th>
              <td class="govuk-table__cell">${to}</td>
            </tr>
            <tr class="govuk-table__row">
              <th scope="row" class="govuk-table__header">Subject</th>
              <td class="govuk-table__cell">${subject}</td>
            </tr>
          </tbody>
        </table>

        <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">

        <div class="govuk-inset-text" style="white-space: pre-line;">${body}</div>
      </div>
    </div>`;
}

function renderApplicantEmail() {
  const body = `Dear ${people.applicant.name},

Application number ${application.reference}

As part of the application process, you must display a site notice in a public place for 21 days. We have a duty to inform neighbours and other residents about your proposed development and give them the opportunity to comment.

If a site notice is not displayed the Council will not be able to make a decision about your application.

What you need to do

1. Print the site notice
Download the site notice as a printable PDF at http://southwark.bops.services/planning_applications/${application.reference}/site_notice.pdf.

2. Protect the site notice with a waterproof covering
You can use a clear plastic bag or sticky polythene film to protect it from bad weather.

3. Display the site notice
Number of site notices requested: ${siteNotice.quantity}

Location instructions: ${siteNotice.locationInstructions}

4. Tell us when you put it up
Send an email to ${people.caseOfficer.email} including:

- a photo showing the location of the site notice
- the date you displayed the site notice
- description of where you put the site notice

Make sure that the text of the site notice is clear in the photo.

You can remove the site notice 21 days from the date you put it up.

If you are not able to print or display the site notice, contact me at ${people.caseOfficer.email}. This may delay our decision about your application.

Yours

${people.caseOfficer.name}`;

  return renderEmailPreview({
    subject: `Display site notice for your application ${application.reference}`,
    to: people.applicant.email,
    body,
  });
}

function renderInternalTeamEmail() {
  const body = `Application number ${application.reference}

Address: ${application.address.full}

Description: ${application.description}

The site notice for this application is ready for display.

Number of site notices requested: ${siteNotice.quantity}

Location instructions: ${siteNotice.locationInstructions}

To print the site notice, go to:
http://southwark.bops.services/planning_applications/${application.reference}/site_notice.pdf

Case officer: ${people.caseOfficer.name}`;

  return renderEmailPreview({
    subject: `Site notice for application number ${application.reference}`,
    to: siteNotice.internalTeamEmail,
    body,
  });
}

function renderConfirmationRequestEmail() {
  const body = `## Application reference number: ${application.reference}

Address: ${application.address.full}

Please use this link to upload evidence of a site notice in place for this application:

http://southwark.bops.services/planning_applications/${application.reference}/site_notices/1/edit

Case officer: ${people.caseOfficer.name}`;

  return renderEmailPreview({
    subject: `Request for confirmation of a site notice for ${application.reference}`,
    to: siteNotice.internalTeamEmail,
    body,
  });
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Initial form — Yes/No radio buttons, nothing selected yet. */
export const InitialView = {
  render: () => renderSiteNoticeForm(),
};

/** "No" selected — site notice not required, ready to save. */
export const NotRequired = {
  render: () => renderSiteNoticeForm({ noSelected: true }),
};

/** "Yes" selected, "Send to internal team" chosen — email field visible with pre-filled address. */
export const RequiredEmailToTeam = {
  render: () =>
    renderSiteNoticeForm({
      yesSelected: true,
      quantity: 2,
      locationInstructions: siteNotice.locationInstructions,
      method: "internal_team",
      internalTeamEmail: siteNotice.internalTeamEmail,
    }),
};

/** "Yes" selected, "Send to applicant" chosen. */
export const RequiredEmailToApplicant = {
  render: () =>
    renderSiteNoticeForm({
      yesSelected: true,
      quantity: 1,
      method: "applicant",
    }),
};

/** "Yes" selected, using the Print option with a date field for when the notice will be displayed. */
export const RequiredPrintNotice = {
  render: () =>
    renderSiteNoticeForm({
      yesSelected: true,
      quantity: 1,
    }),
};

/** Email preview — 4-step instructions sent to the applicant (print, protect, display, notify). */
export const EmailToApplicant = {
  render: () => renderApplicantEmail(),
};

/** Email preview — notice details sent to the internal team with PDF link. */
export const EmailToInternalTeam = {
  render: () => renderInternalTeamEmail(),
};

/** Confirm form — status bar showing previous creation, date field and file upload for evidence. */
export const ConfirmNotice = {
  render: () => renderConfirmNoticeForm(),
};

/** Follow-up email requesting the internal team upload evidence of display. */
export const ConfirmationRequestEmail = {
  render: () => renderConfirmationRequestEmail(),
};

/** Completed — read-only view with evidence table showing uploaded photo, turquoise tag, and display date. */
export const Completed = {
  render: () => renderCompletedView(),
};
