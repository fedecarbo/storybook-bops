/**
 * Press Notice — during consultation, the case officer decides whether
 * the application requires a press notice, selects the statutory reasons,
 * and later confirms publication with evidence.
 *
 * Stories show: the initial Yes/No form, reason selection, confirmation
 * of publication (date + evidence upload), and the completed read-only view.
 */
import { mockData } from "../../../helpers";

export default {
  title: "Workflows/Planning Permission/2. Consultation/Press Notice",
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

const { pressNoticeReasons, pressNotice, application, dates, people } = mockData;

function reasonLabel(key) {
  return pressNoticeReasons[key] || key;
}

function renderReasonCheckboxes(checkedReasons = [], showOtherTextarea = false) {
  const standardReasons = Object.entries(pressNoticeReasons).filter(
    ([key]) => key !== "other"
  );

  const checkboxes = standardReasons
    .map(([key, label]) => {
      const id = `reason-${key}`;
      const checked = checkedReasons.includes(key) ? " checked" : "";
      return `
        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="${id}" name="reasons[]" type="checkbox" value="${key}"${checked}>
          <label class="govuk-label govuk-checkboxes__label" for="${id}">${label}</label>
        </div>`;
    })
    .join("\n");

  const otherChecked = checkedReasons.includes("other") ? " checked" : "";
  const otherConditional = showOtherTextarea
    ? `
        <div class="govuk-checkboxes__conditional" id="conditional-reason-other">
          <div class="govuk-form-group">
            <label class="govuk-label" for="other-reason">
              Provide another reason why this application requires a press notice
            </label>
            <textarea class="govuk-textarea" id="other-reason" name="other_reason" rows="3"></textarea>
          </div>
        </div>`
    : "";

  return `
    <div class="govuk-checkboxes" data-module="govuk-checkboxes">
      ${checkboxes}
      <div class="govuk-checkboxes__divider">or</div>
      <div class="govuk-checkboxes__item">
        <input class="govuk-checkboxes__input" id="reason-other" name="reasons[]" type="checkbox" value="other"${otherChecked}>
        <label class="govuk-label govuk-checkboxes__label" for="reason-other">Other</label>
      </div>
      ${otherConditional}
    </div>`;
}

function renderPressNoticeForm(options = {}) {
  const { yesSelected = false, noSelected = false, checkedReasons = [], showOther = false } = options;

  const yesChecked = yesSelected ? " checked" : "";
  const noChecked = noSelected ? " checked" : "";

  const conditionalContent = yesSelected
    ? `
      <div class="govuk-radios__conditional" id="conditional-required-yes">
        <div class="govuk-form-group">
          <fieldset class="govuk-fieldset">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--s">
              Select the reasons for the press notice
            </legend>
            ${renderReasonCheckboxes(checkedReasons, showOther)}
          </fieldset>
        </div>
        <div class="govuk-inset-text">
          An email notification will be sent to <strong>${pressNotice.notificationEmail}</strong> if a press notice is required.
        </div>
      </div>`
    : "";

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Press notice</h1>

        <div class="govuk-form-group">
          <fieldset class="govuk-fieldset">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              Does this application require a press notice?
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

        <div class="govuk-button-group">
          <button type="submit" class="govuk-button" data-module="govuk-button">
            Save and mark as complete
          </button>
        </div>
      </div>
    </div>`;
}

function renderReasonsSummary(reasons) {
  const items = reasons
    .map((key) => `<li>${reasonLabel(key)}</li>`)
    .join("\n");

  return `
    <div class="govuk-inset-text" style="background-color: #f3f2f1; border-left-color: #b1b4b6;">
      <p class="govuk-body govuk-!-font-weight-bold">Reasons selected:</p>
      <ul class="govuk-list govuk-list--bullet">
        ${items}
      </ul>
    </div>`;
}

function renderConfirmPublicationForm() {
  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Confirm press notice</h1>

        <div class="govuk-inset-text">
          Press notice requested on <strong>${pressNotice.requestedAt}</strong>
          <strong class="govuk-tag govuk-tag--purple govuk-!-margin-left-2">Emailed</strong>
        </div>

        ${renderReasonsSummary(pressNotice.reasons)}

        <div class="govuk-form-group">
          <fieldset class="govuk-fieldset" role="group">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--s">
              What date was the press notice published?
            </legend>
            <div class="govuk-hint">
              Must be between ${dates.consultationStart} and ${dates.consultationEnd}
            </div>
            <div class="govuk-date-input" id="published-at">
              <div class="govuk-date-input__item">
                <div class="govuk-form-group">
                  <label class="govuk-label govuk-date-input__label" for="published-at-day">Day</label>
                  <input class="govuk-input govuk-date-input__input govuk-input--width-2" id="published-at-day" name="published_at[day]" type="text" inputmode="numeric">
                </div>
              </div>
              <div class="govuk-date-input__item">
                <div class="govuk-form-group">
                  <label class="govuk-label govuk-date-input__label" for="published-at-month">Month</label>
                  <input class="govuk-input govuk-date-input__input govuk-input--width-2" id="published-at-month" name="published_at[month]" type="text" inputmode="numeric">
                </div>
              </div>
              <div class="govuk-date-input__item">
                <div class="govuk-form-group">
                  <label class="govuk-label govuk-date-input__label" for="published-at-year">Year</label>
                  <input class="govuk-input govuk-date-input__input govuk-input--width-4" id="published-at-year" name="published_at[year]" type="text" inputmode="numeric">
                </div>
              </div>
            </div>
          </fieldset>
        </div>

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--s" for="evidence-upload">
            Upload photo(s)
          </label>
          <div class="govuk-hint">
            Provide documentary evidence of the press notice being published
          </div>
          <input class="govuk-file-upload" id="evidence-upload" name="documents[]" type="file" multiple>
        </div>

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--s" for="comment">
            Optional comment
          </label>
          <textarea class="govuk-textarea" id="comment" name="comment" rows="3"></textarea>
        </div>

        <div class="govuk-button-group">
          <button type="submit" class="govuk-button" data-module="govuk-button">Save</button>
          <a class="govuk-link" href="#">Back</a>
        </div>
      </div>
    </div>`;
}

function renderCompletedView() {
  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Confirm press notice</h1>

        <h2 class="govuk-heading-m">Confirm press notice publication</h2>

        ${renderReasonsSummary(pressNotice.reasons)}

        <p class="govuk-body">
          Date requested: <strong>${pressNotice.requestedAt}</strong>
        </p>
        <p class="govuk-body">
          Date published: <strong>${pressNotice.publishedAt}</strong>
        </p>
        <p class="govuk-body">
          Comments: ${pressNotice.comment}
        </p>

        <table class="govuk-table govuk-!-margin-top-6">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header">Document</th>
              <th scope="col" class="govuk-table__header">Status</th>
              <th scope="col" class="govuk-table__header">Date requested</th>
              <th scope="col" class="govuk-table__header">Date published</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">
                <div class="document-thumbnail-placeholder" style="width: 80px; height: 80px;">
                  <span style="font-size: 11px;">${pressNotice.evidenceFilename}</span>
                </div>
              </td>
              <td class="govuk-table__cell">
                <strong class="govuk-tag govuk-tag--green">Published</strong>
              </td>
              <td class="govuk-table__cell">${pressNotice.requestedAt}</td>
              <td class="govuk-table__cell">${pressNotice.publishedAt}</td>
            </tr>
          </tbody>
        </table>

        <p class="govuk-body">
          <a class="govuk-link" href="#">Edit publication details</a>
        </p>
        <p class="govuk-body">
          <a class="govuk-link" href="#">Add a new press notice response</a>
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

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

function renderPressNoticeRequestEmail() {
  const reasonsList = pressNotice.reasons
    .map((key) => `- ${reasonLabel(key)}`)
    .join("\n");

  const body = `Application reference number: ${application.reference}

Address: ${application.address.full}

Description: ${application.description}

This application requires a press notice with the following reasons:

${reasonsList}

You can view the application at http://southwark.bops.services/planning_applications/${application.reference}/press_notice/confirmation.

`;

  return renderEmailPreview({
    subject: "Request for press notice",
    to: pressNotice.notificationEmail,
    body,
  });
}

function renderConfirmationRequestEmail() {
  const body = `Application reference number: ${application.reference}

Address: ${application.address.full}

Please use this link to upload evidence of a press notice for this application:

http://southwark.bops.services/planning_applications/${application.reference}/press_notice/confirmation

Case officer: ${people.caseOfficer.name}`;

  return renderEmailPreview({
    subject: `Request for confirmation of a press notice for ${application.reference}`,
    to: pressNotice.notificationEmail,
    body,
  });
}

function renderAwaitingConfirmation() {
  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Confirm press notice</h1>

        <h2 class="govuk-heading-m">Confirm press notice publication</h2>

        ${renderReasonsSummary(pressNotice.reasons)}

        <p class="govuk-body">
          Date requested: <strong>${pressNotice.requestedAt}</strong>
        </p>

        <p class="govuk-body">Press notice has not been requested</p>

        <p class="govuk-body">Upload evidence of the press notice publication.</p>

        <a href="#" role="button" draggable="false" class="govuk-button" data-module="govuk-button">
          Confirm publication
        </a>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <a class="govuk-link" href="#">Back</a>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Initial form — Yes/No radio buttons, nothing selected yet. */
export const InitialView = {
  render: () => renderPressNoticeForm(),
};

/** "No" selected — press notice not required, ready to save. */
export const NotRequired = {
  render: () =>
    renderPressNoticeForm({
      noSelected: true,
    }),
};

/** "Yes" selected — reason checkboxes visible, two reasons checked (Conservation Area, Listed Building). */
export const RequiredWithReasons = {
  render: () =>
    renderPressNoticeForm({
      yesSelected: true,
      checkedReasons: ["conservation_area", "listed_building"],
    }),
};

/** "Yes" selected with "Other" checked — custom reason textarea visible. */
export const RequiredWithOther = {
  render: () =>
    renderPressNoticeForm({
      yesSelected: true,
      checkedReasons: ["conservation_area", "other"],
      showOther: true,
    }),
};

/** Email sent to the press team requesting a press notice — includes reference, address, description, and reasons. */
export const EmailToPress = {
  render: () => renderPressNoticeRequestEmail(),
};

/** Follow-up email asking the press team to upload evidence of publication. */
export const ConfirmationRequestEmail = {
  render: () => renderConfirmationRequestEmail(),
};

/** Awaiting confirmation — press notice requested but not yet published, "Confirm publication" button shown. */
export const AwaitingConfirmation = {
  render: () => renderAwaitingConfirmation(),
};

/** Confirmation form — officer or press team enters publication date, uploads evidence photo, adds optional comment. */
export const ConfirmPublication = {
  render: () => renderConfirmPublicationForm(),
};

/** Completed — read-only view showing reasons, dates, uploaded evidence, and edit links. */
export const Completed = {
  render: () => renderCompletedView(),
};
