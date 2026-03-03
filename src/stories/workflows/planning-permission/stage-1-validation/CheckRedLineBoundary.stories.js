/**
 * Check Red Line Boundary — the case officer checks whether the applicant's
 * submitted site boundary (red line) is correct.
 *
 * If incorrect, the officer proposes a new boundary and sends a change request
 * to the applicant. The applicant can agree or disagree with the proposal.
 * If they disagree, the officer can accept the original or propose again.
 *
 * This task appears in Stage 1 (Validation) under "Check application details".
 */
import { mockData, renderStatusTag } from "../../../helpers";

export default {
  title: "Workflows/Planning Permission/1. Validation/Check Red Line Boundary",
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (story) =>
      `<div style="max-width: 1100px; margin: 0 auto; padding: 30px 20px;">${story()}</div>`,
  ],
};

const { application, people, redLineBoundary } = mockData;
const { changeRequest } = redLineBoundary;

// ---------------------------------------------------------------------------
// Helper: map placeholder (no real map tiles in Storybook)
// ---------------------------------------------------------------------------

function renderMapPlaceholder(label, options = {}) {
  const { height = 300, invalid = false } = options;
  const borderColor = invalid ? "#515151" : "#1d70b8";
  const borderStyle = invalid ? "dashed" : "solid";

  return `
    <div style="width: 100%; height: ${height}px; background: #f0f4f5; border: 2px ${borderStyle} ${borderColor};
         display: flex; align-items: center; justify-content: center; border-radius: 4px; margin-bottom: 16px;">
      <div style="text-align: center; color: #505a5f;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#505a5f" stroke-width="1.5">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5"/>
        </svg>
        <p style="margin: 8px 0 0; font-family: 'GDS Transport', arial, sans-serif; font-size: 16px;">
          ${label}
        </p>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: boundary legend (submitted vs proposed lines)
// ---------------------------------------------------------------------------

function renderBoundaryLegend() {
  return `
    <h3 class="govuk-heading-s govuk-!-padding-top-6">
      Red line drawings shown on map
    </h3>
    <div class="govuk-grid-row govuk-!-padding-bottom-2">
      <p class="govuk-body govuk-!-margin-left-3" style="display: flex; align-items: center; gap: 12px;">
        <span style="display: inline-block; width: 40px; height: 40px; border: 3px solid #1d70b8; background: rgba(29, 112, 184, 0.1);"></span>
        Submitted red line boundary
      </p>
    </div>
    <div class="govuk-grid-row govuk-!-padding-bottom-4">
      <p class="govuk-body govuk-!-margin-left-3" style="display: flex; align-items: center; gap: 12px;">
        <span style="display: inline-block; width: 40px; height: 40px; border: 3px dashed #d4351c; background: rgba(212, 53, 28, 0.1);"></span>
        Proposed red line boundary
      </p>
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: email preview (same pattern as CheckRequestDocuments)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Helper: initial check page (with optional pre-selected radio)
// ---------------------------------------------------------------------------

function renderInitialCheckPage(options = {}) {
  const { selectedValue = null } = options;
  const yesChecked = selectedValue === "yes" ? " checked" : "";
  const noChecked = selectedValue === "no" ? " checked" : "";

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        <h1 class="govuk-heading-l">Check the digital red line boundary</h1>

        <p class="govuk-body">This digital red line boundary was submitted by the applicant.</p>

        ${renderMapPlaceholder("Submitted red line boundary — 12 Elm Grove, SE15 5DE")}

        <div class="govuk-form-group">
          <fieldset class="govuk-fieldset">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              Is the red line boundary correct?
            </legend>
            <div class="govuk-radios" data-module="govuk-radios">
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="valid-yes" name="valid_red_line_boundary" type="radio" value="true"${yesChecked}>
                <label class="govuk-label govuk-radios__label" for="valid-yes">
                  Yes
                </label>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="valid-no" name="valid_red_line_boundary" type="radio" value="false"${noChecked}>
                <label class="govuk-label govuk-radios__label" for="valid-no">
                  No
                </label>
              </div>
            </div>
          </fieldset>
        </div>

        <div class="govuk-button-group">
          <button type="submit" class="govuk-button" data-module="govuk-button">
            Save and mark as complete
          </button>
          <a class="govuk-link" href="#">Back</a>
        </div>
      </div>
    </div>`;
}

// ===========================================================================
// OFFICER-SIDE STORIES
// ===========================================================================

/** Initial view — submitted boundary map with Yes/No radio buttons. */
export const InitialView = {
  render: () => renderInitialCheckPage(),
};

/** Officer has selected "Yes" — boundary is correct. Ready to save. */
export const SelectedYes = {
  render: () => renderInitialCheckPage({ selectedValue: "yes" }),
};

/** Officer has selected "No" — boundary is incorrect. Will be redirected to propose change form. */
export const SelectedNo = {
  render: () => renderInitialCheckPage({ selectedValue: "no" }),
};

/** Propose change form — officer draws a new boundary and explains why. */
export const ProposeChangeForm = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        <h1 class="govuk-heading-l">Proposed red line boundary change</h1>

        <label class="govuk-label govuk-label--s govuk-!-padding-bottom-4">
          Applicant's existing red line boundary
        </label>
        ${renderMapPlaceholder("Existing red line boundary (grey) — click to draw proposed boundary", { height: 400, invalid: true })}

        ${renderBoundaryLegend()}

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--s" for="reason">
            Explain to the applicant why changes are proposed to the red line boundary
          </label>
          <textarea class="govuk-textarea" id="reason" name="reason" rows="5"></textarea>
        </div>

        <div class="govuk-button-group">
          <button type="submit" class="govuk-button" data-module="govuk-button">
            Send request
          </button>
          <a class="govuk-link" href="#">Back</a>
        </div>
      </div>
    </div>`,
};

/** Propose change form filled — reason text entered, ready to send. */
export const ProposeChangeFormFilled = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        <h1 class="govuk-heading-l">Proposed red line boundary change</h1>

        <label class="govuk-label govuk-label--s govuk-!-padding-bottom-4">
          Applicant's existing red line boundary
        </label>
        ${renderMapPlaceholder("Existing boundary (grey) with proposed boundary drawn (red dashed)", { height: 400, invalid: true })}

        ${renderBoundaryLegend()}

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--s" for="reason">
            Explain to the applicant why changes are proposed to the red line boundary
          </label>
          <textarea class="govuk-textarea" id="reason" name="reason" rows="5">${changeRequest.reason}</textarea>
        </div>

        <div class="govuk-button-group">
          <button type="submit" class="govuk-button" data-module="govuk-button">
            Send request
          </button>
          <a class="govuk-link" href="#">Back</a>
        </div>
      </div>
    </div>`,
};

/** Change request has been sent — waiting for applicant response. */
export const ChangeRequestPending = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        <h1 class="govuk-heading-l">Check the digital red line boundary</h1>

        <h2 class="govuk-heading-m">Red line boundary change request sent</h2>

        <h3 class="govuk-heading-s">Current red line boundary</h3>
        ${renderMapPlaceholder("Current red line boundary — 12 Elm Grove, SE15 5DE")}

        <div class="govuk-inset-text govuk-!-margin-bottom-3 govuk-!-margin-top-6">
          <p>
            <strong>Reason change is requested:</strong><br>
            ${changeRequest.reason}
          </p>
          <p>${changeRequest.createdAt}</p>
        </div>

        <h3 class="govuk-heading-s">Proposed red line boundary</h3>
        ${renderMapPlaceholder("Proposed red line boundary")}

        <p class="govuk-body govuk-!-margin-top-4">Waiting for applicant response.</p>

        <button type="submit" class="govuk-button govuk-button--secondary" data-module="govuk-button">
          Delete request
        </button>
      </div>
    </div>`,
};

/** Applicant approved the proposed boundary — officer can mark as complete. */
export const ApplicantApproved = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        <h1 class="govuk-heading-l">Check the digital red line boundary</h1>

        <h2 class="govuk-heading-m">Red line boundary change approved</h2>

        <h3 class="govuk-heading-s">Approved red line boundary</h3>
        ${renderMapPlaceholder("Approved red line boundary")}

        <div class="govuk-inset-text govuk-!-margin-top-6">
          <strong>Change to red line boundary has been approved by the applicant</strong>
          <p>${changeRequest.updatedAt}</p>
        </div>

        <div class="govuk-button-group">
          <button type="submit" class="govuk-button" data-module="govuk-button">
            Save and mark as complete
          </button>
        </div>
      </div>
    </div>`,
};

/** Request auto-closed after 5 business days without response — treated as approved. */
export const AutoClosed = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        <h1 class="govuk-heading-l">Check the digital red line boundary</h1>

        <h2 class="govuk-heading-m">Red line boundary change approved</h2>

        <h3 class="govuk-heading-s">Approved red line boundary</h3>
        ${renderMapPlaceholder("Approved red line boundary")}

        <div class="govuk-inset-text govuk-!-margin-top-6">
          <strong>Change to red line boundary was auto closed and approved after being open for more than 5 business days</strong>
          <p>${changeRequest.updatedAt}</p>
        </div>

        <div class="govuk-button-group">
          <button type="submit" class="govuk-button" data-module="govuk-button">
            Save and mark as complete
          </button>
        </div>
      </div>
    </div>`,
};

/** Applicant rejected the proposed boundary — officer sees rejection reason and can decide again. */
export const ApplicantRejected = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        <h1 class="govuk-heading-l">Check the digital red line boundary</h1>

        <h2 class="govuk-heading-m">Red line boundary change rejected</h2>

        <h3 class="govuk-heading-s">Proposed red line boundary</h3>
        ${renderMapPlaceholder("Proposed red line boundary (rejected)")}

        <div class="govuk-inset-text govuk-!-margin-top-6">
          <p>
            <strong>Applicant rejected this proposed red line boundary</strong><br>
            <strong>Reason:</strong> ${changeRequest.rejectionReason}
          </p>
          <p>${changeRequest.updatedAt}</p>
        </div>

        <h3 class="govuk-heading-s">Current red line boundary</h3>
        <div class="govuk-!-margin-bottom-6">
          ${renderMapPlaceholder("Current red line boundary — 12 Elm Grove, SE15 5DE")}
        </div>

        <div class="govuk-form-group">
          <fieldset class="govuk-fieldset">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              Is the red line boundary correct?
            </legend>
            <div class="govuk-radios" data-module="govuk-radios">
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="valid-yes-2" name="valid_red_line_boundary" type="radio" value="true">
                <label class="govuk-label govuk-radios__label" for="valid-yes-2">
                  Yes
                </label>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="valid-no-2" name="valid_red_line_boundary" type="radio" value="false">
                <label class="govuk-label govuk-radios__label" for="valid-no-2">
                  No
                </label>
              </div>
            </div>
          </fieldset>
        </div>

        <div class="govuk-button-group">
          <button type="submit" class="govuk-button" data-module="govuk-button">
            Save and mark as complete
          </button>
          <a class="govuk-link" href="#">Back</a>
        </div>
      </div>
    </div>`,
};

// ===========================================================================
// EMAIL STORY
// ===========================================================================

/** Email sent to applicant informing them of the proposed boundary change. */
export const EmailToApplicant = {
  render: () => {
    const body = `Dear ${people.applicant.name},

Householder planning permission reference number: ${application.reference}

Address: ${application.address.full}

Your case officer has proposed a change to your application's red line boundary. You need to review this change and send your response.

To view the proposed change and respond, go to:

https://southwark.bops.services/validation_requests?planning_application_reference=${application.reference}&change_access_id=abc123

You must respond by ${changeRequest.responseDue}. If we do not hear from you by this date, the change will be automatically approved.

If you need help with your planning application, contact us at planning@southwark.gov.uk.

Regards,

${application.councilName}`;

    return renderEmailPreview({
      subject: `Householder planning permission - ${application.reference} - red line boundary change proposed`,
      to: people.applicant.email,
      body,
    });
  },
};

// ===========================================================================
// APPLICANT-SIDE STORIES
// ===========================================================================

/** Applicant's view — review proposed boundary change and agree or disagree. */
export const ApplicantLandingPage = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Confirm changes to your application's red line boundary</h1>

        <p class="govuk-body">
          The following changes have been made to your application's red line boundary.
        </p>

        <h2 class="govuk-heading-m">What you need to do:</h2>

        <ul class="govuk-list govuk-list--bullet">
          <li>agree or disagree with the proposed changes</li>
          <li>if you disagree, enter a reason to explain why you disagree</li>
          <li>submit your response</li>
        </ul>

        <div class="govuk-inset-text">
          If your response is not received by <strong>${changeRequest.responseDue}</strong>
          your application will be returned to you and your payment refunded.
        </div>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <div id="red-line-boundary-change-reason">
          <h3 class="govuk-heading-s govuk-!-margin-bottom-1">Reason change is requested</h3>
          <p class="govuk-body">${changeRequest.reason}</p>
        </div>

        <h3 class="govuk-heading-s govuk-!-margin-bottom-2">Your original red line boundary</h3>
        ${renderMapPlaceholder("Original red line boundary — 12 Elm Grove, SE15 5DE")}

        <h3 class="govuk-heading-s govuk-!-margin-bottom-2">Proposed red line boundary</h3>
        ${renderMapPlaceholder("Proposed red line boundary")}

        <p class="govuk-body">
          If you need this information in an alternative format, contact your case officer on
          planning@southwark.gov.uk or by telephone at
          <span style="white-space: nowrap;">020 7525 5403</span>.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <div class="govuk-form-group">
          <fieldset class="govuk-fieldset">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              Do you agree with the proposed changes to your red line boundary?
            </legend>
            <div class="govuk-radios" data-module="govuk-radios">
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="approved-yes" name="approved" type="radio" value="true"
                       data-aria-controls="conditional-approved-yes">
                <label class="govuk-label govuk-radios__label" for="approved-yes">
                  Yes, I agree with the proposed red line boundary
                </label>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="approved-no" name="approved" type="radio" value="false"
                       data-aria-controls="conditional-approved-no">
                <label class="govuk-label govuk-radios__label" for="approved-no">
                  No, I disagree with the proposed red line boundary
                </label>
              </div>
              <div class="govuk-radios__conditional govuk-radios__conditional--hidden" id="conditional-approved-no">
                <div class="govuk-form-group">
                  <label class="govuk-label" for="rejection-reason">
                    Indicate why you disagree with the proposed red line boundary.
                  </label>
                  <textarea class="govuk-textarea" id="rejection-reason" name="rejection_reason" rows="6"></textarea>
                </div>
              </div>
            </div>
          </fieldset>
        </div>

        <div class="govuk-button-group">
          <button type="submit" class="govuk-button" data-module="govuk-button">Submit</button>
          <a class="govuk-button govuk-button--secondary" href="#">Back</a>
        </div>
      </div>
    </div>`,
};

/** Applicant agreed with the proposed boundary change. */
export const ApplicantAgreed = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Confirm changes to your red line boundary</h1>

        <p class="govuk-body">
          The following changes have been made to your application's red line boundary.
        </p>

        <h3 class="govuk-heading-s govuk-!-margin-bottom-2">Your original red line boundary</h3>
        ${renderMapPlaceholder("Original red line boundary — 12 Elm Grove, SE15 5DE")}

        <h3 class="govuk-heading-s govuk-!-margin-bottom-2">Proposed red line boundary</h3>
        ${renderMapPlaceholder("Proposed red line boundary")}

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <div id="red-line-boundary-change-response">
          <h2 class="govuk-heading-s">Your response</h2>
          <p class="govuk-body">
            <strong class="govuk-tag govuk-tag--green">Agreed</strong>
            with suggested boundary changes
          </p>
        </div>
      </div>
    </div>`,
};

/** Applicant disagreed with the proposed boundary change and provided a reason. */
export const ApplicantDisagreed = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Confirm changes to your red line boundary</h1>

        <p class="govuk-body">
          The following changes have been made to your application's red line boundary.
        </p>

        <h3 class="govuk-heading-s govuk-!-margin-bottom-2">Your original red line boundary</h3>
        ${renderMapPlaceholder("Original red line boundary — 12 Elm Grove, SE15 5DE")}

        <h3 class="govuk-heading-s govuk-!-margin-bottom-2">Proposed red line boundary</h3>
        ${renderMapPlaceholder("Proposed red line boundary")}

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <div id="red-line-boundary-change-response">
          <h2 class="govuk-heading-s">Your response</h2>
          <p class="govuk-body">
            <strong class="govuk-tag govuk-tag--red">Disagreed</strong>
            with suggested boundary changes
          </p>

          <h3 class="govuk-heading-s govuk-!-margin-bottom-1">My reason for objecting to the boundary changes:</h3>
          <p class="govuk-body">${changeRequest.rejectionReason}</p>
        </div>
      </div>
    </div>`,
};
