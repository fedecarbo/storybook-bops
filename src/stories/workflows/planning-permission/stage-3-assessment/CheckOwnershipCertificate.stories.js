/**
 * Check Ownership Certificate (Assessment) — the case officer reviews
 * the ownership certificate during the assessment stage.
 *
 * Unlike the validation-stage check (Task 11), this is a post-validation
 * review. The page shows:
 * - The certificate table (type + land owners)
 * - An activity log of validation-stage requests and responses
 * - A collapsible section to request a new certificate if issues are found
 * - A "Save and mark complete" button
 *
 * If the certificate is incorrect post-validation, the officer can send
 * a request directly to the applicant (unlike validation, where requests
 * are batched until the application is invalidated).
 *
 * This task appears in Stage 3 (Assessment) under "Check application".
 */
import { mockData } from "../../../helpers";

export default {
  title:
    "Workflows/Planning Permission/3. Assessment/Check Ownership Certificate",
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (story) =>
      `<div style="max-width: 1100px; margin: 0 auto; padding: 30px 20px;">${story()}</div>`,
  ],
};

const { ownershipCertificate } = mockData;

// ---------------------------------------------------------------------------
// Helper: certificate table
// ---------------------------------------------------------------------------

function renderCertificateTable(options = {}) {
  const {
    certificateType = ownershipCertificate.certificateType,
    landOwners = ownershipCertificate.landOwners,
  } = options;

  let ownerRows = "";

  if (landOwners && landOwners.length > 0) {
    landOwners.forEach((owner, i) => {
      ownerRows += `
        <tr class="govuk-table__row">
          <th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Owner ${i + 1}</th>
          <td class="govuk-table__cell">&nbsp;</td>
        </tr>
        <tr class="govuk-table__row">
          <th scope="row" class="govuk-table__header">Name</th>
          <td class="govuk-table__cell">${owner.name}</td>
        </tr>
        <tr class="govuk-table__row">
          <th scope="row" class="govuk-table__header">Address</th>
          <td class="govuk-table__cell">${owner.address}</td>
        </tr>
        <tr class="govuk-table__row">
          <th scope="row" class="govuk-table__header">Notice given</th>
          <td class="govuk-table__cell">${owner.noticeGiven ? "Yes" : "No"}</td>
        </tr>`;

      if (owner.noticeGiven) {
        ownerRows += `
        <tr class="govuk-table__row">
          <th scope="row" class="govuk-table__header">Notice date</th>
          <td class="govuk-table__cell">${owner.noticeGivenAt}</td>
        </tr>`;
      } else {
        ownerRows += `
        <tr class="govuk-table__row">
          <th scope="row" class="govuk-table__header">Reason no notice given</th>
          <td class="govuk-table__cell">${owner.noticeReason || ""}</td>
        </tr>`;
      }
    });
  }

  return `
    <table class="govuk-table">
      <tbody class="govuk-table__body">
        <tr class="govuk-table__row">
          <th scope="row" class="govuk-table__header">Certificate type</th>
          <td class="govuk-table__cell">${certificateType.toUpperCase()}</td>
        </tr>
        ${ownerRows}
      </tbody>
    </table>`;
}

// ---------------------------------------------------------------------------
// Helper: activity log
// ---------------------------------------------------------------------------

function renderActivityLog(requests = []) {
  let rows = "";

  if (requests.length > 0) {
    requests.forEach((req) => {
      rows += `
        <tr class="govuk-table__row">
          <td class="govuk-table__cell">${req.action}</td>
          <td class="govuk-table__cell">${req.status}</td>
          <td class="govuk-table__cell">${req.user}</td>
          <td class="govuk-table__cell">${req.date}</td>
        </tr>`;
    });
  } else {
    rows = `
      <tr class="govuk-table__row">
        <td class="govuk-table__cell">No validation requests were made</td>
        <td class="govuk-table__cell">&nbsp;</td>
        <td class="govuk-table__cell">&nbsp;</td>
        <td class="govuk-table__cell">&nbsp;</td>
      </tr>`;
  }

  return `
    <div class="activity-log govuk-!-margin-bottom-6">
      <table class="govuk-table govuk-!-margin-bottom-0">
        <caption class="govuk-table__caption govuk-table__caption--m">Activity log</caption>
        <tbody class="govuk-table__body">
          <tr class="govuk-table__row">
            <td class="govuk-table__header">Completed actions</td>
            <td class="govuk-table__header">Status</td>
            <td class="govuk-table__header">User</td>
            <td class="govuk-table__header">Date</td>
          </tr>
          ${rows}
        </tbody>
      </table>
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: assessment page
// ---------------------------------------------------------------------------

function renderAssessmentPage(options = {}) {
  const {
    requests = ownershipCertificate.activityLogRequests,
    showRequestSection = true,
    detailsOpen = false,
    reasonText = "",
    showCompletedBanner = false,
  } = options;

  const banner = showCompletedBanner
    ? `
      <div class="govuk-notification-banner govuk-notification-banner--success" role="alert"
           aria-labelledby="govuk-notification-banner-title" data-module="govuk-notification-banner">
        <div class="govuk-notification-banner__header">
          <h2 class="govuk-notification-banner__title" id="govuk-notification-banner-title">Success</h2>
        </div>
        <div class="govuk-notification-banner__content">
          <p class="govuk-notification-banner__heading">Check ownership certificate completed</p>
        </div>
      </div>`
    : "";

  const requestSection = showRequestSection
    ? `
      <p class="govuk-body">
        If the ownership certificate is incorrect, send a request to the applicant for more information.
      </p>
      <details class="govuk-details"${detailsOpen ? " open" : ""}>
        <summary class="govuk-details__summary">
          <span class="govuk-details__summary-text">
            Request new ownership certificate
          </span>
        </summary>
        <div class="govuk-details__text">
          <div class="govuk-form-group">
            <label class="govuk-label govuk-label--s" for="post-validation-reason">
              Tell the applicant why their ownership certificate type is wrong
            </label>
            <div id="post-validation-reason-hint" class="govuk-hint">
              This request will be sent to the applicant.
            </div>
            <textarea class="govuk-textarea" id="post-validation-reason" name="ownership_certificate_post_validation_reason" rows="5">${reasonText}</textarea>
          </div>
        </div>
      </details>`
    : "";

  const saveButton = !showCompletedBanner
    ? `
      <button type="submit" class="govuk-button" data-module="govuk-button">
        Save and mark complete
      </button>`
    : "";

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        ${banner}

        <h1 class="govuk-heading-l">Check ownership certificate</h1>

        ${renderCertificateTable()}

        ${renderActivityLog(requests)}

        ${requestSection}

        ${saveButton}
      </div>
    </div>`;
}

// ===========================================================================
// STORIES
// ===========================================================================

/** Initial view — no validation requests were made. Empty activity log, request section visible. */
export const InitialView = {
  render: () => renderAssessmentPage({ requests: [] }),
};

/** With validation history — activity log shows a closed request cycle from validation (most common scenario). */
export const WithValidationHistory = {
  render: () =>
    renderAssessmentPage({
      requests: ownershipCertificate.activityLogRequests,
    }),
};

/** Request expanded — officer is creating a post-validation request. Details section open with pre-filled reason. */
export const RequestExpanded = {
  render: () =>
    renderAssessmentPage({
      requests: ownershipCertificate.activityLogRequests,
      detailsOpen: true,
      reasonText:
        "The updated certificate submitted during validation still lists only two owners. Land Registry records obtained during assessment confirm that a third party (Southwark Estates Ltd) holds a registered interest in a strip of land within the application boundary.",
    }),
};

/** Request pending — an open request exists, so the request section is hidden. Activity log shows the open request. */
export const RequestPending = {
  render: () =>
    renderAssessmentPage({
      requests: [
        {
          action: "Applicant has not responded",
          status: "",
          user: "",
          date: "",
        },
        {
          action: "New ownership certificate requested",
          status: "Open",
          user: "Sarah Johnson",
          date: "15/01/2025",
        },
        {
          action: "Certificate submitted by applicant",
          status: "Submitted",
          user: "Applicant",
          date: "28/11/2024",
        },
        {
          action: "New ownership certificate requested",
          status: "Closed",
          user: "Sarah Johnson",
          date: "20/11/2024",
        },
      ],
      showRequestSection: false,
    }),
};

/** Applicant responded to post-validation request — both validation and assessment request cycles complete. */
export const ApplicantRespondedToPostValidation = {
  render: () =>
    renderAssessmentPage({
      requests: [
        {
          action: "Certificate submitted by applicant",
          status: "Submitted",
          user: "Applicant",
          date: "22/01/2025",
        },
        {
          action: "New ownership certificate requested",
          status: "Closed",
          user: "Sarah Johnson",
          date: "15/01/2025",
        },
        {
          action: "Certificate submitted by applicant",
          status: "Submitted",
          user: "Applicant",
          date: "28/11/2024",
        },
        {
          action: "New ownership certificate requested",
          status: "Closed",
          user: "Sarah Johnson",
          date: "20/11/2024",
        },
      ],
      showRequestSection: true,
    }),
};

/** Completed — task marked complete with success banner. No form controls visible. */
export const Completed = {
  render: () =>
    renderAssessmentPage({
      requests: ownershipCertificate.activityLogRequests,
      showRequestSection: false,
      showCompletedBanner: true,
    }),
};
