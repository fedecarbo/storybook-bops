/**
 * Send Letters to Neighbours — during consultation, the case officer
 * sends physical letters to selected neighbours via GOV.UK Notify.
 * The page is a multi-step form: review the neighbour table with
 * checkboxes, choose notification or renotification, preview/edit
 * the letter template, set a response period, and confirm sending.
 *
 * Stories show: the initial form, selective sending, letter template
 * expanded, renotification flow, reviewer feedback, success state
 * with delivery statuses, letter batch history, email copy to
 * applicant, and the empty state.
 */
import { mockData, renderStatusTag } from "../../../helpers";

export default {
  title:
    "Workflows/Planning Permission/2. Consultation/Send Letters to Neighbours",
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (story) =>
      `<div style="max-width: 1100px; margin: 0 auto; padding: 30px 20px;">${story()}</div>`,
  ],
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const { neighbours, application, people, dates } = mockData;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderPageBreadcrumbs(currentPage = "Send letters to neighbours") {
  return `
    <nav class="govuk-breadcrumbs" aria-label="Breadcrumb">
      <ol class="govuk-breadcrumbs__list">
        <li class="govuk-breadcrumbs__list-item"><a class="govuk-breadcrumbs__link" href="#">Home</a></li>
        <li class="govuk-breadcrumbs__list-item"><a class="govuk-breadcrumbs__link" href="#">Application</a></li>
        <li class="govuk-breadcrumbs__list-item"><a class="govuk-breadcrumbs__link" href="#">Consultation</a></li>
        <li class="govuk-breadcrumbs__list-item" aria-current="page">${currentPage}</li>
      </ol>
    </nav>`;
}

function renderSuccessBanner() {
  return `
    <div class="govuk-notification-banner govuk-notification-banner--success" role="alert"
      aria-labelledby="govuk-notification-banner-title"
      data-module="govuk-notification-banner">
      <div class="govuk-notification-banner__header">
        <h2 class="govuk-notification-banner__title" id="govuk-notification-banner-title">
          Success
        </h2>
      </div>
      <div class="govuk-notification-banner__content">
        <h3 class="govuk-notification-banner__heading">
          Letters have been sent to neighbours and a copy of the letter has been sent to the applicant.
        </h3>
        <p>Contact <a class="govuk-notification-banner__link" href="https://www.notifications.service.gov.uk/support">GOV.UK Notify</a> if you think there's a problem.</p>
      </div>
    </div>`;
}

function renderReviewerFeedback(comment) {
  return `
    <div class="govuk-inset-text">
      <h3>Reviewer requested changes</h3>
      <p>${comment}</p>
    </div>`;
}

function humanizeSource(source) {
  return source
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function renderNeighbourTable(neighbourList) {
  const rows = neighbourList
    .map(
      (n) => `
        <tr class="govuk-table__row">
          <td class="govuk-table__cell govuk-!-padding-0">
            <div class="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
              <div class="govuk-checkboxes__item">
                <input class="govuk-checkboxes__input" id="neighbour-${neighbourList.indexOf(n)}" type="checkbox"${n.selected !== false ? " checked" : ""}>
                <label class="govuk-label govuk-checkboxes__label" for="neighbour-${neighbourList.indexOf(n)}">
                  <span class="govuk-visually-hidden">Select ${n.address}</span>
                </label>
              </div>
            </div>
          </td>
          <td class="govuk-table__cell govuk-!-width-one-third">${n.address.toUpperCase()}</td>
          <td class="govuk-table__cell">${humanizeSource(n.source)}</td>
          <td class="govuk-table__cell">${renderStatusTag(n.letterStatus)}</td>
          <td class="govuk-table__cell govuk-table__cell--numeric govuk-!-width-one-quarter">${n.lastContacted || "-"}</td>
        </tr>`,
    )
    .join("");

  return `
    <a class="govuk-body govuk-link" href="#">&lt; Back to add neighbours</a>

    <div class="govuk-hint govuk-!-margin-bottom-0 govuk-!-margin-top-4">Step 2</div>
    <h2 class="govuk-!-margin-top-1">Review neighbours to send letters to</h2>
    <p>Review the list and check the addresses you want to send</p>

    <table class="govuk-table" id="selected-neighbours-table">
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th scope="col" class="govuk-table__header govuk-!-padding-0">
            <div class="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
              <div class="govuk-checkboxes__item">
                <input class="govuk-checkboxes__input" id="toggle-all" type="checkbox" checked>
                <label class="govuk-label govuk-checkboxes__label" for="toggle-all">
                  <span class="govuk-visually-hidden">Select all neighbours</span>
                </label>
              </div>
            </div>
          </th>
          <th scope="col" class="govuk-table__header govuk-!-width-one-half">Address list</th>
          <th scope="col" class="govuk-table__header govuk-!-width-one-quarter">Source</th>
          <th scope="col" class="govuk-table__header">Status</th>
          <th scope="col" class="govuk-table__header govuk-table__header--numeric">Last contacted</th>
        </tr>
      </thead>
      <tbody class="govuk-table__body">
        ${rows}
      </tbody>
    </table>`;
}

function renderLetterTypeSelector(options = {}) {
  const { selected = "Notification", showResendReason = false, resendReason = "" } = options;

  const notificationSelected = selected === "Notification" ? " selected" : "";
  const renotificationSelected = selected === "Renotification" ? " selected" : "";

  const resendReasonBlock = showResendReason
    ? `
      <div class="govuk-form-group govuk-!-margin-top-4">
        <label class="govuk-label" for="resend-reason">Resend reason</label>
        <span class="govuk-hint">Enter a reason for renotification. This text will appear at the beginning of the letter.</span>
        <textarea class="govuk-textarea" id="resend-reason" rows="3">${resendReason}</textarea>
      </div>`
    : "";

  return `
    <div class="govuk-hint govuk-!-margin-bottom-0 govuk-!-margin-top-8">Step 3</div>
    <div class="govuk-form-group">
      <label class="govuk-label govuk-label--m" for="letter-type">Choose which letter to send</label>
      <select class="govuk-select" id="letter-type">
        <option value="Notification"${notificationSelected}>Notification</option>
        <option value="Renotification"${renotificationSelected}>Renotification</option>
      </select>
    </div>
    ${resendReasonBlock}`;
}

function renderLetterTemplateDetails(options = {}) {
  const { open = false, templateText = mockData.neighbourLetterTemplate } = options;
  const openAttr = open ? " open" : "";

  return `
    <details class="govuk-details"${openAttr}>
      <summary class="govuk-details__summary">
        <span class="govuk-details__summary-text">View/edit letter template</span>
      </summary>
      <div class="govuk-details__text">
        <div class="govuk-inset-text">
          <p>Text marked with a # (hashtag) will appear as a header in the printed letter.</p>
          <p>Text marked with a * (asterisk) will appear as a bullet point in the printed letter.</p>
        </div>
        <textarea class="govuk-textarea" rows="25" style="font-family: monospace; font-size: 14px;">${templateText}</textarea>
      </div>
    </details>`;
}

function renderResponsePeriod(days = 21) {
  return `
    <div class="govuk-hint govuk-!-margin-bottom-0 govuk-!-margin-top-8">Step 4</div>
    <div class="govuk-form-group">
      <label class="govuk-label govuk-label--m" for="response-period">Set response period</label>
      <p class="govuk-hint">Enter the number of days that neighbours have to respond.</p>
      <div class="govuk-input__wrapper">
        <input class="govuk-input govuk-input--width-3" id="response-period" type="text" value="${days}">
        <div class="govuk-input__suffix" aria-hidden="true">days</div>
      </div>
    </div>`;
}

function renderFormButtons() {
  return `
    <div class="govuk-button-group govuk-!-margin-top-5">
      <button class="govuk-button govuk-button--primary" style="margin-inline-end: 1rem;">Confirm and send letters</button>
    </div>
    <div class="govuk-button-group">
      <button class="govuk-button govuk-button--secondary">Save and come back later</button>
      <a class="govuk-button govuk-button--secondary" href="#">Back</a>
    </div>`;
}

function renderSendLettersPage(options = {}) {
  const {
    showSuccessBanner = false,
    reviewerComment = null,
    neighbourOverrides = null,
    letterType = "Notification",
    showResendReason = false,
    resendReason = "",
    templateExpanded = false,
    responsePeriodDays = 21,
  } = options;

  const neighbourList = neighbourOverrides || neighbours;

  const successBannerHtml = showSuccessBanner ? renderSuccessBanner() : "";
  const reviewerHtml = reviewerComment
    ? renderReviewerFeedback(reviewerComment)
    : "";

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Send letters to neighbours</h1>

        ${successBannerHtml}
        ${reviewerHtml}

        ${renderNeighbourTable(neighbourList)}

        ${renderLetterTypeSelector({ selected: letterType, showResendReason, resendReason })}

        ${renderLetterTemplateDetails({ open: templateExpanded })}

        ${renderResponsePeriod(responsePeriodDays)}

        ${renderFormButtons()}
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Full page with all 8 neighbours selected, all with "New" status. */
export const InitialView = {
  render: () => renderSendLettersPage(),
};

/** Three neighbours deselected — showing selective sending. */
export const SomeDeselected = {
  render: () => {
    const modified = neighbours.map((n, i) => ({
      ...n,
      selected: ![2, 5, 7].includes(i),
    }));
    return renderSendLettersPage({ neighbourOverrides: modified });
  },
};

/** Letter template details expanded showing the full letter text. */
export const LetterTemplateExpanded = {
  render: () => renderSendLettersPage({ templateExpanded: true }),
};

/** Renotification selected — resend reason visible, some neighbours already contacted. */
export const RenotificationSelected = {
  render: () => {
    const modified = neighbours.map((n) => ({
      ...n,
      letterStatus: "posted",
      lastContacted: "25/11/2024",
    }));
    return renderSendLettersPage({
      neighbourOverrides: modified,
      letterType: "Renotification",
      showResendReason: true,
      resendReason:
        "The application description has been amended following discussions with the applicant. The rear extension depth has been reduced from 4 metres to 3.5 metres.",
    });
  },
};

/** Reviewer requested changes — inset text alert above the form. */
export const ReviewerRequestedChanges = {
  render: () =>
    renderSendLettersPage({
      reviewerComment:
        "The neighbour notification letters need to include a reference to the conservation area status of the site. Please update the letter template and resend.",
    }),
};

/** Success state — letters sent, mixed delivery statuses from GOV.UK Notify. */
export const LettersSent = {
  render: () => {
    const statuses = [
      "posted",
      "posted",
      "posted",
      "printing",
      "posted",
      "posting",
      "submitted",
      "posted",
    ];
    // Fix typo: "posting" should be "printing"
    const correctedStatuses = [
      "posted",
      "posted",
      "posted",
      "printing",
      "posted",
      "printing",
      "submitted",
      "posted",
    ];
    const modified = neighbours.map((n, i) => ({
      ...n,
      letterStatus: correctedStatuses[i],
      lastContacted: "25/11/2024",
    }));
    return renderSendLettersPage({
      showSuccessBanner: true,
      neighbourOverrides: modified,
    });
  },
};

/** Letter batch history — archive of sent letters with accordion. */
export const LetterBatchHistory = {
  render: () => {
    const batches = mockData.neighbourLetterBatches;

    const batchSections = batches
      .map((batch, i) => {
        const recipientRows = batch.recipients
          .map(
            (addr) => `
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">${addr}</td>
              <td class="govuk-table__cell govuk-table__cell--numeric">
                <strong class="govuk-tag govuk-tag--orange">post</strong>
              </td>
            </tr>`,
          )
          .join("");

        return `
          <div class="govuk-accordion__section govuk-accordion__section--expanded">
            <div class="govuk-accordion__section-header">
              <h2 class="govuk-accordion__section-heading">
                <span class="govuk-accordion__section-button" id="batch-heading-${i + 1}">
                  Neighbour letter ${i + 1}
                </span>
              </h2>
              <div class="govuk-accordion__section-summary govuk-body" id="batch-summary-${i + 1}">
                Date sent: ${batch.dateSent}
              </div>
            </div>
            <div id="batch-content-${i + 1}" class="govuk-accordion__section-content">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <p class="govuk-body" style="margin-bottom: 0;">Response period: ${batch.responsePeriod} days</p>
                <a class="govuk-link" href="#">Download letter</a>
              </div>

              <table class="govuk-table">
                <thead class="govuk-table__head">
                  <tr class="govuk-table__row">
                    <th scope="col" class="govuk-table__header">Address</th>
                    <th scope="col" class="govuk-table__header govuk-table__header--numeric">Sent by</th>
                  </tr>
                </thead>
                <tbody class="govuk-table__body">
                  ${recipientRows}
                </tbody>
              </table>
            </div>
          </div>`;
      })
      .join("");

    return `
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-full">
          ${renderPageBreadcrumbs("Copy of neighbour letters")}
          <h1 class="govuk-heading-l">Copy of neighbour letters</h1>

          <h3>Letters sent to neighbours</h3>
          <p class="govuk-!-margin-bottom-6">
            <a class="govuk-link" href="#">Download all as CSV</a>
          </p>

          <div class="govuk-accordion" data-module="govuk-accordion" id="neighbour-letter-batches">
            ${batchSections}
          </div>
        </div>
      </div>`;
  },
};

/** Email copy sent to applicant/agent after letters are dispatched. */
export const EmailCopyToApplicant = {
  render: () => {
    const emailBody = `Application reference number: ${application.reference}

Application received: ${dates.received}

At: ${application.address.full}

Dear ${people.agent.contactName},

This is a copy of your neighbour consultation letter.

Town and Country Planning Act 1990

Dear Resident

A planning application has been made for the development described below:

Site address: ${application.address.full}

Proposal: ${application.descriptionShort}

Name of applicant: ${people.applicant.name}

Application number: ${application.reference}

You can comment on this planning application until ${dates.consultationEnd}. If we receive your comments after this date, we may not be able to take them into consideration if a decision has already been made.

If you are not the owner or landlord of this property, please forward this letter to the person who is.

Yours

${people.caseOfficer.name}
Planning officer`;

    return `
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">
          <h1 class="govuk-heading-l">Email preview</h1>
          <p class="govuk-body">This email is sent to the applicant and their agent as a copy of the neighbour consultation letter.</p>

          <table class="govuk-table">
            <tbody class="govuk-table__body">
              <tr class="govuk-table__row">
                <th scope="row" class="govuk-table__header" style="width: 120px;">To</th>
                <td class="govuk-table__cell">${people.agent.email}</td>
              </tr>
              <tr class="govuk-table__row">
                <th scope="row" class="govuk-table__header">CC</th>
                <td class="govuk-table__cell">${people.applicant.email}</td>
              </tr>
              <tr class="govuk-table__row">
                <th scope="row" class="govuk-table__header">Subject</th>
                <td class="govuk-table__cell">Copy of neighbour consultation letter — ${application.reference}</td>
              </tr>
            </tbody>
          </table>

          <div class="govuk-inset-text" style="white-space: pre-line;">${emailBody}</div>
        </div>
      </div>`;
  },
};

/** Empty state — no neighbours have been selected yet. */
export const NoNeighboursAdded = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Send letters to neighbours</h1>

        <div class="govuk-hint govuk-!-margin-bottom-0 govuk-!-margin-top-4">Step 2</div>
        <h2 class="govuk-!-margin-top-1">Review neighbours to send letters to</h2>

        <p>You have not selected any neighbours. <a class="govuk-link" href="#">Go back to select and add neighbours</a></p>
      </div>
    </div>`,
};
