/**
 * View Neighbour Responses — during consultation, the case officer
 * views, uploads, and manages incoming neighbour comments about the
 * planning application. Responses are grouped by type (objection,
 * supportive, neutral) in an accordion. Each response shows the
 * respondent's details, concern tags, and a truncated comment with
 * links to redact & publish or edit.
 *
 * Stories show: empty state, responses coming in, all responded,
 * individual response detail, the add-new-response form, the
 * redaction interface, and the completed state.
 */
import { mockData, renderStatusTag } from "../../../helpers";

export default {
  title:
    "Workflows/Planning Permission/2. Consultation/View Neighbour Responses",
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

const { neighbours, neighbourResponses, application, people, dates, redactionGuidelines } = mockData;

const TAGS = ["use", "privacy", "light", "access", "noise", "traffic", "design", "other"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderPageBreadcrumbs(currentPage = "View neighbour responses") {
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

function truncateText(text, length = 100) {
  if (text.length <= length) return text;
  return text.substring(0, length) + "…";
}

function renderResponseCard(response) {
  const displayComment = response.redactedResponse || response.response;
  const truncated = truncateText(displayComment);
  const showMore = displayComment.length > 100
    ? `<a class="govuk-link" href="#">View more</a>`
    : "";

  const emailHtml = response.email
    ? `<span class="govuk-hint">${response.email}</span>`
    : "";

  const adjoiningBadge = response.neighbourSelected
    ? `<strong class="govuk-tag app-task-list__task-tag govuk-!-margin-left-1">Adjoining neighbour</strong>`
    : "";

  const tagsHtml = response.tags.length > 0
    ? response.tags
        .map(
          (tag) =>
            `<div class="govuk-!-margin-bottom-3"><strong class="govuk-tag govuk-tag--grey">${tag.toUpperCase()}</strong></div>`
        )
        .join("")
    : "";

  const redactionAttr = response.redactedBy
    ? ` (Redacted by: ${response.redactedBy})`
    : "";

  return `
    <div class="neighbour-response-section">
      <div class="govuk-inset-text">
        <div class="neighbour-response-top-section">
          <div class="neighbour-response-content">
            ${renderStatusTag(response.summaryTag)}
            ${adjoiningBadge}
            <br><br>
            <ul class="govuk-list">
              <li>
                <strong>${response.name}</strong> ${emailHtml}
              </li>
              <li class="govuk-hint">
                ${response.address}
              </li>
              <li class="govuk-hint">
                Received on ${response.receivedAt}
              </li>
            </ul>
            <p>${truncated}</p>
            ${showMore}
          </div>
          <div class="neighbour-tags">
            ${tagsHtml}
          </div>
        </div>
        <br>
        <p>
          <a class="govuk-link" href="#">Redact and publish</a>${redactionAttr}
        </p>
        <a class="govuk-link" href="#">Edit</a>
      </div>
    </div>`;
}

function renderResponseAccordion(responses) {
  // Group by summaryTag, order: objection, supportive, neutral
  const order = ["objection", "supportive", "neutral"];
  const grouped = {};
  responses.forEach((r) => {
    if (!grouped[r.summaryTag]) grouped[r.summaryTag] = [];
    grouped[r.summaryTag].push(r);
  });

  const sections = order
    .filter((tag) => grouped[tag])
    .map((tag, index) => {
      const tagResponses = grouped[tag];
      const label = tag.charAt(0).toUpperCase() + tag.slice(1);
      const cards = tagResponses.map((r) => renderResponseCard(r)).join("");
      return `
        <div class="govuk-accordion__section govuk-accordion__section--expanded">
          <div class="govuk-accordion__section-header">
            <h2 class="govuk-accordion__section-heading">
              <span class="govuk-accordion__section-button" id="accordion-heading-${index}">
                ${label} responses (${tagResponses.length})
              </span>
            </h2>
          </div>
          <div class="govuk-accordion__section-content" id="accordion-content-${index}" aria-labelledby="accordion-heading-${index}">
            ${cards}
          </div>
        </div>`;
    })
    .join("");

  return `
    <div class="govuk-accordion" data-module="govuk-accordion" id="neighbour-response-accordion">
      ${sections}
    </div>`;
}

function renderIndexPage({ responseCount, responsesHtml, consultationEndDate, showAddLink = true }) {
  const endDateHtml = consultationEndDate
    ? `<h2 class="govuk-!-margin-top-7">Date consultation will end</h2>
       <p>${consultationEndDate}</p>`
    : "";

  const addLinkHtml = showAddLink
    ? `<p><a class="govuk-link" href="#">Add a new neighbour response</a></p>`
    : "";

  return `
    ${renderPageBreadcrumbs()}
    <h1 class="govuk-heading-l govuk-!-margin-top-5">View neighbour responses</h1>
    ${endDateHtml}
    <h2 class="govuk-!-margin-top-7">Responses (${responseCount})</h2>
    ${responsesHtml}
    ${addLinkHtml}
    <div class="govuk-button-group">
      <a class="govuk-button govuk-button--secondary govuk-!-margin-top-5" href="#">Back</a>
    </div>`;
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/**
 * Empty state — consultation end date is set but no responses have been
 * received yet. Shows "No neighbour responses yet" with a link to add one.
 */
export const NoResponsesYet = {
  name: "No Responses Yet",
  render: () =>
    renderIndexPage({
      responseCount: 0,
      responsesHtml: `<p>No neighbour responses yet</p>`,
      consultationEndDate: dates.consultationEnd,
    }),
};

/**
 * Three responses have come in — one of each type. The accordion
 * groups them by objection, supportive, and neutral.
 */
export const ResponsesComingIn = {
  name: "Responses Coming In",
  render: () => {
    const threeResponses = [
      neighbourResponses[0], // objection
      neighbourResponses[2], // supportive
      neighbourResponses[4], // neutral
    ];
    return renderIndexPage({
      responseCount: threeResponses.length,
      responsesHtml: renderResponseAccordion(threeResponses),
      consultationEndDate: dates.consultationEnd,
    });
  },
};

/**
 * All six neighbours have responded — 2 objections, 2 supportive,
 * 2 neutral. Some have redaction attribution showing they've been
 * reviewed and published.
 */
export const AllResponded = {
  name: "All Responded",
  render: () =>
    renderIndexPage({
      responseCount: neighbourResponses.length,
      responsesHtml: renderResponseAccordion(neighbourResponses),
      consultationEndDate: dates.consultationEnd,
    }),
};

/**
 * Individual response detail — shows the full comment text (not
 * truncated) with an attached document thumbnail placeholder.
 */
export const ResponseDetail = {
  name: "Response Detail",
  render: () => {
    const response = neighbourResponses[0]; // S. O'Brien's objection
    const displayComment = response.redactedResponse || response.response;

    const tagsHtml = response.tags
      .map(
        (tag) =>
          `<div class="govuk-!-margin-bottom-3"><strong class="govuk-tag govuk-tag--grey">${tag.toUpperCase()}</strong></div>`
      )
      .join("");

    return `
      ${renderPageBreadcrumbs("Neighbour response")}
      <h1 class="govuk-heading-l govuk-!-margin-top-5">Neighbour response</h1>

      <div class="govuk-inset-text">
        <div class="neighbour-response-top-section">
          <div class="neighbour-response-content">
            ${renderStatusTag(response.summaryTag)}
            <strong class="govuk-tag app-task-list__task-tag govuk-!-margin-left-1">Adjoining neighbour</strong>
            <br><br>
            <ul class="govuk-list">
              <li>
                <strong>${response.name}</strong> <span class="govuk-hint">${response.email}</span>
              </li>
              <li class="govuk-hint">${response.address}</li>
              <li class="govuk-hint">Received on ${response.receivedAt}</li>
            </ul>
            <p>${displayComment}</p>
          </div>
          <div class="neighbour-tags">
            ${tagsHtml}
          </div>
        </div>

        <h3 class="govuk-heading-s govuk-!-margin-top-4">Attached documents</h3>
        <table class="govuk-table">
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell govuk-!-width-one-third">
                <div class="document-thumbnail-placeholder" style="min-height: 150px;">
                  PDF thumbnail
                </div>
                <p class="govuk-!-margin-top-2">
                  neighbour-letter-obrien.pdf<br>
                  <a class="govuk-link" href="#">View in new window</a>
                </p>
              </td>
              <td class="govuk-table__cell govuk-!-width-one-third">
                <strong class="govuk-tag govuk-tag--turquoise">Neighbour response</strong>
              </td>
              <td class="govuk-table__cell govuk-!-width-one-third">
                <p>2 December 2024</p>
              </td>
            </tr>
          </tbody>
        </table>

        <br>
        <p>
          <a class="govuk-link" href="#">Redact and publish</a> (Redacted by: ${response.redactedBy})
        </p>
        <a class="govuk-link" href="#">Edit</a>
      </div>

      <div class="govuk-button-group">
        <a class="govuk-button govuk-button--secondary govuk-!-margin-top-5" href="#">Back</a>
      </div>`;
  },
};

/**
 * The form to upload a new neighbour response received by post or email.
 * Shows all fields: name, email, address selector, date, type radios,
 * tag checkboxes, response text, redacted response text, file upload.
 */
export const AddNewResponse = {
  name: "Add New Response",
  render: () => {
    const addressOptions = neighbours
      .map((n) => `<option value="${n.address}">${n.address}</option>`)
      .join("");

    const tagCheckboxes = TAGS
      .map(
        (tag, i) => `
        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="tags-${i}" name="tags[]" type="checkbox" value="${tag}">
          <label class="govuk-label govuk-checkboxes__label" for="tags-${i}">${tag.charAt(0).toUpperCase() + tag.slice(1)}</label>
        </div>`
      )
      .join("");

    return `
      ${renderPageBreadcrumbs("Upload neighbour responses")}
      <h1 class="govuk-heading-l govuk-!-margin-top-5">Upload neighbour responses</h1>

      <h2 class="govuk-!-margin-top-7">Add a new response</h2>

      <form class="govuk-!-margin-top-5">
        <div class="govuk-form-group">
          <label class="govuk-label" for="name">Name</label>
          <input class="govuk-input" id="name" name="name" type="text">
        </div>

        <div class="govuk-form-group">
          <label class="govuk-label" for="email">Email</label>
          <input class="govuk-input" id="email" name="email" type="text">
        </div>

        <div class="govuk-form-group">
          <label class="govuk-label" for="address">Select an existing neighbour address</label>
          <select class="govuk-select" id="address" name="address">
            <option value=""></option>
            ${addressOptions}
          </select>
        </div>

        <div class="govuk-form-group">
          <label class="govuk-label" for="new-address">Or add a new neighbour address</label>
          <input class="govuk-input" id="new-address" name="new_address" type="text">
        </div>

        <fieldset class="govuk-fieldset">
          <legend class="govuk-fieldset__legend govuk-fieldset__legend--s">
            <p>Response received on</p>
          </legend>
          <div class="govuk-date-input" id="received-at">
            <div class="govuk-date-input__item">
              <div class="govuk-form-group">
                <label class="govuk-label govuk-date-input__label" for="received-at-day">Day</label>
                <input class="govuk-input govuk-date-input__input govuk-input--width-2" id="received-at-day" name="received_at[day]" type="text" inputmode="numeric">
              </div>
            </div>
            <div class="govuk-date-input__item">
              <div class="govuk-form-group">
                <label class="govuk-label govuk-date-input__label" for="received-at-month">Month</label>
                <input class="govuk-input govuk-date-input__input govuk-input--width-2" id="received-at-month" name="received_at[month]" type="text" inputmode="numeric">
              </div>
            </div>
            <div class="govuk-date-input__item">
              <div class="govuk-form-group">
                <label class="govuk-label govuk-date-input__label" for="received-at-year">Year</label>
                <input class="govuk-input govuk-date-input__input govuk-input--width-4" id="received-at-year" name="received_at[year]" type="text" inputmode="numeric">
              </div>
            </div>
          </div>
        </fieldset>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <fieldset class="govuk-fieldset">
          <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
            Is the response
          </legend>
          <div class="govuk-radios" data-module="govuk-radios">
            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="summary-tag-1" name="summary_tag" type="radio" value="supportive">
              <label class="govuk-label govuk-radios__label" for="summary-tag-1">Supportive</label>
            </div>
            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="summary-tag-2" name="summary_tag" type="radio" value="neutral">
              <label class="govuk-label govuk-radios__label" for="summary-tag-2">Neutral</label>
            </div>
            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="summary-tag-3" name="summary_tag" type="radio" value="objection">
              <label class="govuk-label govuk-radios__label" for="summary-tag-3">An objection</label>
            </div>
          </div>
        </fieldset>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <fieldset class="govuk-fieldset">
          <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
            Tags
          </legend>
          <div class="govuk-checkboxes" data-module="govuk-checkboxes">
            ${tagCheckboxes}
          </div>
        </fieldset>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <div class="govuk-form-group">
          <label class="govuk-label" for="response">Response</label>
          <div class="govuk-hint">This won't be made public</div>
          <textarea class="govuk-textarea" id="response" name="response" rows="5"></textarea>
        </div>

        <div class="govuk-form-group">
          <label class="govuk-label" for="redacted-response">Redacted response</label>
          <div class="govuk-hint">This will be made public</div>
          <textarea class="govuk-textarea" id="redacted-response" name="redacted_response" rows="5"></textarea>
        </div>

        <div class="govuk-form-group">
          <label class="govuk-label" for="files">Upload documents</label>
          <div class="govuk-hint">Add any documents that the respondent sent.</div>
          <input class="govuk-file-upload" id="files" name="files" type="file" multiple>
        </div>

        <div class="govuk-button-group">
          <button class="govuk-button govuk-button--primary govuk-!-margin-top-5" type="submit">Save response</button>
          <a class="govuk-button govuk-button--secondary govuk-!-margin-top-5" href="#">Back</a>
        </div>
      </form>`;
  },
};

/**
 * The redaction interface — case officer reviews a response and replaces
 * sensitive content with [redacted] before publishing. Shows the full
 * original comment (read-only), collapsible redaction guidelines, and
 * an editable textarea for the redacted version.
 */
export const RedactAndPublish = {
  name: "Redact and Publish",
  render: () => {
    const response = neighbourResponses[1]; // C. Evans objection

    return `
      ${renderPageBreadcrumbs("Redact comment")}
      <h1 class="govuk-heading-l govuk-!-margin-top-5">Redact comment</h1>

      <h2 class="govuk-!-margin-top-5">Comment submitted by</h2>
      <hr class="govuk-section-break govuk-section-break--visible">

      <ul class="govuk-list">
        <li>
          <strong>${response.name}</strong> <span class="govuk-hint">${response.email}</span>
        </li>
        <li class="govuk-hint">${response.address}</li>
        <li class="govuk-hint">Received on ${response.receivedAt}</li>
      </ul>

      <details class="govuk-details" data-module="govuk-details">
        <summary class="govuk-details__summary">
          <span class="govuk-details__summary-text">What you need to redact</span>
        </summary>
        <div class="govuk-details__text">
          ${redactionGuidelines}
        </div>
      </details>

      <form class="govuk-!-margin-top-5">
        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--l" for="full-comment">Full comment</label>
          <textarea class="govuk-textarea" id="full-comment" rows="8" readonly>${response.response}</textarea>
        </div>

        <label class="govuk-label govuk-label--l" for="redacted-comment">Redacted comment</label>
        <span class="govuk-hint">Replace text you want to redact with [redacted] then save to publish the comment.</span>
        <button type="button" class="button-as-link govuk-!-margin-bottom-3">Reset comment</button>
        <textarea class="govuk-textarea" id="redacted-comment" rows="8">${response.redactedResponse || response.response}</textarea>

        <div class="govuk-button-group">
          <button class="govuk-button govuk-button--primary govuk-!-margin-top-5" type="submit">Save and publish</button>
          <a class="govuk-button govuk-button--secondary govuk-!-margin-top-5" href="#">Back</a>
        </div>
      </form>`;
  },
};

/**
 * All responses received and redacted — consultation end date has passed,
 * task is complete. All responses show redaction attribution.
 */
export const Completed = {
  name: "Completed",
  render: () => {
    // Mark all responses as redacted for the completed state
    const completedResponses = neighbourResponses.map((r) => ({
      ...r,
      redactedBy: r.redactedBy || people.caseOfficer.name,
      redactedResponse: r.redactedResponse || r.response,
    }));

    return renderIndexPage({
      responseCount: completedResponses.length,
      responsesHtml: renderResponseAccordion(completedResponses),
      consultationEndDate: dates.consultationEnd,
      showAddLink: false,
    });
  },
};
