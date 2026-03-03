/**
 * View Consultee Responses — during consultation, the case officer
 * monitors incoming responses from statutory consultees (internal and
 * external). Responses are grouped using GOV.UK Tabs filtered by
 * summary tag: No objection, Amendments needed, Objection. Each
 * consultee is shown in a panel card with their name, role, type
 * badge, status, a response snippet, and action links.
 *
 * Stories show: no responses yet, mixed awaiting/responded, all
 * responded with tab filtering, individual consultee detail, the
 * upload form, and the post-upload confirmation.
 */
import { mockData, renderStatusTag } from "../../../helpers";

export default {
  title:
    "Workflows/Planning Permission/2. Consultation/View Consultee Responses",
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

const { consultees, consulteeResponses, application, people, dates } = mockData;

// Build enriched consultee objects by merging base data with response data
function buildConsulteeWithResponse(consultee, response) {
  return {
    ...consultee,
    response: response || null,
    summaryTag: response ? response.summaryTag : null,
    respondedAt: response ? response.receivedAt : null,
    lastEmail: response ? response.email : null,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderPageBreadcrumbs(currentPage = "View consultee responses") {
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

function truncateText(text, length = 200) {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + "...";
}

/** Consultee-specific status tag — uses planning terminology */
function renderConsulteeStatusTag(summaryTag) {
  const map = {
    approved: { colour: "green", label: "No objection" },
    amendments_needed: { colour: "yellow", label: "Amendments needed" },
    objected: { colour: "red", label: "Objection" },
  };
  const entry = map[summaryTag];
  if (!entry) return "";
  return `<span class="govuk-tag govuk-tag--${entry.colour}">${entry.label}</span>`;
}

/** Awaiting / sending / failed status tags for consultees without responses */
function renderConsulteeWaitingTag(status) {
  const map = {
    awaiting_response: { colour: "yellow", label: "Awaiting response" },
    sending: { colour: "grey", label: "Sending" },
    failed: { colour: "red", label: "Delivery failed" },
    no_response: { colour: "yellow", label: "Awaiting response" },
    not_consulted: { colour: "grey", label: "Not consulted" },
  };
  const entry = map[status] || { colour: "grey", label: status };
  return `<span class="govuk-tag govuk-tag--${entry.colour}">${entry.label}</span>`;
}

/** Published status tag */
function renderPublishedTag(published) {
  return published
    ? `<span class="govuk-tag govuk-tag--green">Published</span>`
    : `<span class="govuk-tag govuk-tag--grey">Private</span>`;
}

/** Internal / External type badge */
function renderTypeTag(origin) {
  const label = origin === "internal" ? "Internal" : "External";
  return `<span class="govuk-tag govuk-tag--grey">${label}</span>`;
}

/** Single consultee panel card */
function renderConsulteePanel(c) {
  const hasResponse = c.response !== null;

  const statusHtml = hasResponse
    ? renderConsulteeStatusTag(c.summaryTag)
    : renderConsulteeWaitingTag(c.status);

  const hintText = hasResponse
    ? `Last received on ${c.respondedAt} from ${c.lastEmail}`
    : `Last contacted on ${c.sentAt}`;

  const snippetText = hasResponse
    ? truncateText(c.response.response)
    : "No responses received yet.";

  const responseCount = hasResponse ? 1 : 0;
  const viewLink = hasResponse
    ? `<a class="govuk-link" href="#">View all responses (${responseCount})</a>`
    : "";

  return `
    <article class="consultee-panel">
      <div class="consultee-panel__heading">
        <div class="consultee-panel__title">
          <h4 class="govuk-heading-s govuk-!-margin-bottom-1">${c.name}</h4>
          <p class="govuk-body-s govuk-!-margin-bottom-0">${c.role}, ${c.organisation}</p>
        </div>
        <div class="consultee-panel__type">
          ${renderTypeTag(c.origin)}
        </div>
      </div>
      <p class="govuk-hint govuk-!-margin-bottom-3">${hintText}</p>
      <div class="consultee-panel__status">
        ${statusHtml}
      </div>
      <p class="govuk-body">${snippetText}</p>
      <div class="consultee-panel__actions">
        ${viewLink}
        <a class="govuk-link" href="#">Upload new response</a>
      </div>
    </article>
    <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">`;
}

/** Group consultees into External and Internal sections */
function renderGroupedPanels(consulteeList) {
  const external = consulteeList.filter((c) => c.origin === "external");
  const internal = consulteeList.filter((c) => c.origin === "internal");

  let html = "";

  if (internal.length > 0) {
    html += `<h3 class="govuk-heading-m">Internal consultees (${internal.length})</h3>`;
    html += internal.map((c) => renderConsulteePanel(c)).join("");
  }

  if (external.length > 0) {
    html += `<h3 class="govuk-heading-m">External consultees (${external.length})</h3>`;
    html += external.map((c) => renderConsulteePanel(c)).join("");
  }

  if (consulteeList.length === 0) {
    html += `<p class="govuk-body">No consultee responses yet.</p>`;
  }

  return html;
}

/** GOV.UK Tabs component for filtering responses by summary tag */
function renderTabs(enrichedConsultees, activeTab = "all") {
  const responded = enrichedConsultees.filter((c) => c.response !== null);
  const approved = responded.filter((c) => c.summaryTag === "approved");
  const amendmentsNeeded = responded.filter(
    (c) => c.summaryTag === "amendments_needed",
  );
  const objected = responded.filter((c) => c.summaryTag === "objected");

  const tabs = [{ key: "all", label: "All", count: enrichedConsultees.length }];
  if (approved.length > 0)
    tabs.push({ key: "approved", label: "No objection", count: approved.length });
  if (amendmentsNeeded.length > 0)
    tabs.push({
      key: "amendments_needed",
      label: "Amendments needed",
      count: amendmentsNeeded.length,
    });
  if (objected.length > 0)
    tabs.push({ key: "objected", label: "Objection", count: objected.length });

  const tabListItems = tabs
    .map((tab) => {
      const selected =
        tab.key === activeTab ? " govuk-tabs__list-item--selected" : "";
      return `<li class="govuk-tabs__list-item${selected}">
        <a class="govuk-tabs__tab" href="#consultee-tab-${tab.key}">${tab.label} (${tab.count})</a>
      </li>`;
    })
    .join("");

  const filterMap = {
    all: enrichedConsultees,
    approved,
    amendments_needed: amendmentsNeeded,
    objected,
  };

  const panelHeadings = {
    all: "All responses",
    approved: "Responses with no objections",
    amendments_needed: "Responses requesting amendments",
    objected: "Objections received",
  };

  const tabPanels = tabs
    .map((tab) => {
      const hidden =
        tab.key !== activeTab ? " govuk-tabs__panel--hidden" : "";
      const panelContent = renderGroupedPanels(filterMap[tab.key] || []);
      return `<div class="govuk-tabs__panel${hidden}" id="consultee-tab-${tab.key}">
        <h2 class="govuk-heading-l">${panelHeadings[tab.key]}</h2>
        ${panelContent}
      </div>`;
    })
    .join("");

  return `
    <div class="govuk-tabs" data-module="govuk-tabs">
      <h2 class="govuk-tabs__title">Responses</h2>
      <ul class="govuk-tabs__list">
        ${tabListItems}
      </ul>
      ${tabPanels}
    </div>`;
}

/** Main index page layout */
function renderIndexPage({
  enrichedConsultees,
  activeTab = "all",
  bannerHtml = "",
}) {
  return `
    ${renderPageBreadcrumbs()}
    ${bannerHtml}
    <h1 class="govuk-heading-l govuk-!-margin-top-5">View consultee responses</h1>
    ${renderTabs(enrichedConsultees, activeTab)}
    <div class="govuk-button-group">
      <a class="govuk-button govuk-button--secondary govuk-!-margin-top-5" href="#">Back</a>
    </div>`;
}

/** Single response item in the detail view */
function renderResponseItem(response) {
  const documentsHtml =
    response.documents.length > 0
      ? `<ul class="govuk-list govuk-body-s">${response.documents.map((d) => `<li><a class="govuk-link" href="#">${d}</a></li>`).join("")}</ul>`
      : "";

  return `
    <div class="consultee-response">
      <div class="govuk-inset-text">
        <p class="govuk-body-s govuk-!-margin-bottom-2">Received on ${response.receivedAt}</p>
        <p>
          ${renderConsulteeStatusTag(response.summaryTag)}
          ${renderPublishedTag(response.published)}
        </p>
        <p class="govuk-body">${response.response}</p>
        ${documentsHtml}
      </div>
      <p class="govuk-!-margin-top-2">
        <a class="govuk-link" href="#">Redact and publish</a>
      </p>
      <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
    </div>`;
}

// ---------------------------------------------------------------------------
// Scenario builders
// ---------------------------------------------------------------------------

/** All consultees awaiting — no responses */
function buildNoResponses() {
  return consultees.map((c) => buildConsulteeWithResponse(c, null));
}

/** 3 responded (Conservation, Highways, Thames Water), 2 still awaiting */
function buildPartialResponses() {
  return consultees.map((c) => {
    const response = consulteeResponses.find((r) => r.consultee === c.name);
    // Only Conservation Officer, Highways Authority, Thames Water have responded
    const hasResponded = [
      "Conservation Officer",
      "Highways Authority",
      "Thames Water",
    ].includes(c.name);
    return buildConsulteeWithResponse(c, hasResponded ? response : null);
  });
}

/** All 5 consultees responded */
function buildAllResponded() {
  return consultees.map((c) => {
    const response = consulteeResponses.find((r) => r.consultee === c.name);
    return buildConsulteeWithResponse(c, response);
  });
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/**
 * Empty state — consultation emails have been sent but no responses
 * have been received. All consultees show "Awaiting response" tag.
 * Only the "All" tab appears (no filter tabs yet).
 */
export const NoResponses = {
  name: "No Responses",
  render: () =>
    renderIndexPage({
      enrichedConsultees: buildNoResponses(),
    }),
};

/**
 * Three of five consultees have responded — Conservation Officer
 * (no objection), Highways Authority (no objection), Thames Water
 * (no objection). Tree Officer and Environment Agency are still
 * awaiting. The "No objection" filter tab appears.
 */
export const AwaitingResponses = {
  name: "Awaiting Responses",
  render: () =>
    renderIndexPage({
      enrichedConsultees: buildPartialResponses(),
    }),
};

/**
 * All five consultees have responded with a mix of outcomes:
 * 3 no objection, 1 amendments needed, 1 objection. All four
 * tabs are visible. Panels show truncated response snippets.
 */
export const AllResponded = {
  name: "All Responded",
  render: () =>
    renderIndexPage({
      enrichedConsultees: buildAllResponded(),
    }),
};

/**
 * Same data as AllResponded but the "Objection" tab is active,
 * showing only the Environment Agency panel. Demonstrates
 * the tab filtering UX.
 */
export const FilteredByObjection = {
  name: "Filtered by Objection",
  render: () =>
    renderIndexPage({
      enrichedConsultees: buildAllResponded(),
      activeTab: "objected",
    }),
};

/**
 * Individual consultee detail page — shows the Environment Agency
 * (which has an objection). Displays a summary list with consultee
 * details, followed by all responses in chronological order with
 * full text, status tags, documents, and redaction links.
 */
export const IndividualConsulteeDetail = {
  name: "Individual Consultee Detail",
  render: () => {
    const ea = consultees.find((c) => c.name === "Environment Agency");
    const response = consulteeResponses.find(
      (r) => r.consultee === "Environment Agency",
    );

    return `
      ${renderPageBreadcrumbs("View consultee response")}
      <h1 class="govuk-heading-l govuk-!-margin-top-5">${ea.name}</h1>

      <h2 class="govuk-heading-m">Consultee details</h2>
      <dl class="govuk-summary-list govuk-summary-list--no-actions">
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">Name</dt>
          <dd class="govuk-summary-list__value">${ea.name}</dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">Role</dt>
          <dd class="govuk-summary-list__value">${ea.role}</dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">Organisation</dt>
          <dd class="govuk-summary-list__value">${ea.organisation}</dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">Email address</dt>
          <dd class="govuk-summary-list__value">${ea.email}</dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">Consulted on</dt>
          <dd class="govuk-summary-list__value">${ea.sentAt}</dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">Last received on</dt>
          <dd class="govuk-summary-list__value">${response.receivedAt}</dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">Status</dt>
          <dd class="govuk-summary-list__value">${renderConsulteeStatusTag(response.summaryTag)}</dd>
        </div>
      </dl>

      <h2 class="govuk-heading-m govuk-!-margin-top-7">Responses</h2>
      <div class="consultee-responses">
        ${renderResponseItem(response)}
      </div>

      <p><a class="govuk-link" href="#">Upload new response</a></p>

      <div class="govuk-button-group">
        <a class="govuk-button govuk-button--secondary govuk-!-margin-top-5" href="#">Back</a>
      </div>`;
  },
};

/**
 * The form for manually uploading a consultee response received
 * offline (by letter, email, or phone). Fields match the source
 * app's new response form: name, email, date, summary tag radios,
 * response text, redacted text, and document upload.
 */
export const UploadingResponse = {
  name: "Upload New Response",
  render: () => {
    return `
      ${renderPageBreadcrumbs("Upload consultee response")}
      <h1 class="govuk-heading-l govuk-!-margin-top-5">Upload consultee response</h1>

      <h2 class="govuk-heading-m">Add a new response</h2>

      <form class="govuk-!-margin-top-5">
        <div class="govuk-form-group">
          <label class="govuk-label" for="resp-name">Name</label>
          <input class="govuk-input" id="resp-name" name="name" type="text">
        </div>

        <div class="govuk-form-group">
          <label class="govuk-label" for="resp-email">Email</label>
          <input class="govuk-input" id="resp-email" name="email" type="text">
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
              <input class="govuk-radios__input" id="summary-tag-1" name="summary_tag" type="radio" value="approved">
              <label class="govuk-label govuk-radios__label" for="summary-tag-1">No objection</label>
            </div>
            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="summary-tag-2" name="summary_tag" type="radio" value="amendments_needed">
              <label class="govuk-label govuk-radios__label" for="summary-tag-2">Amendments needed</label>
            </div>
            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="summary-tag-3" name="summary_tag" type="radio" value="objected">
              <label class="govuk-label govuk-radios__label" for="summary-tag-3">Objection</label>
            </div>
          </div>
        </fieldset>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <div class="govuk-form-group">
          <label class="govuk-label" for="response-text">Response</label>
          <div class="govuk-hint">This won't be made public</div>
          <textarea class="govuk-textarea" id="response-text" name="response" rows="5"></textarea>
        </div>

        <div class="govuk-form-group">
          <label class="govuk-label" for="redacted-response">Redacted response</label>
          <div class="govuk-hint">This will be made public</div>
          <textarea class="govuk-textarea" id="redacted-response" name="redacted_response" rows="5"></textarea>
        </div>

        <div class="govuk-form-group">
          <label class="govuk-label" for="files">Upload documents</label>
          <div class="govuk-hint">Add any documents that the consultee sent.</div>
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
 * After uploading a response — success banner displayed above the
 * tab view, which now reflects the updated response counts.
 */
export const ResponseUploaded = {
  name: "Response Uploaded",
  render: () => {
    const banner = `
      <div class="govuk-notification-banner govuk-notification-banner--success" role="alert" aria-labelledby="govuk-notification-banner-title" data-module="govuk-notification-banner">
        <div class="govuk-notification-banner__header">
          <h2 class="govuk-notification-banner__title" id="govuk-notification-banner-title">Success</h2>
        </div>
        <div class="govuk-notification-banner__content">
          <p class="govuk-notification-banner__heading">Consultee response saved</p>
        </div>
      </div>`;

    return renderIndexPage({
      enrichedConsultees: buildAllResponded(),
      bannerHtml: banner,
    });
  },
};
