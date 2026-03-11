/**
 * Email Consultees — after consultees have been assigned (Select Consultees),
 * the case officer sends consultation emails via GOV.UK Notify. The page has
 * a 3-step form: select recipients from a checkbox table, choose email type
 * and optionally customise the template, then set a response period and send.
 *
 * Stories show: the initial form, no recipients selected, expanded email
 * template, resend to failed, reconsultation type, emails sent confirmation,
 * and mixed delivery statuses.
 */
import { mockData, renderStatusTag } from "../../../helpers";

export default {
  title: "Workflows/Planning Permission/2. Consultation/Email Consultees",
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

const { consultees, application, consulteeEmailTemplate } = mockData;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderPageBreadcrumbs() {
  return `
    <nav class="govuk-breadcrumbs" aria-label="Breadcrumb">
      <ol class="govuk-breadcrumbs__list">
        <li class="govuk-breadcrumbs__list-item"><a class="govuk-breadcrumbs__link" href="#">Home</a></li>
        <li class="govuk-breadcrumbs__list-item"><a class="govuk-breadcrumbs__link" href="#">Application</a></li>
        <li class="govuk-breadcrumbs__list-item"><a class="govuk-breadcrumbs__link" href="#">Consultation</a></li>
        <li class="govuk-breadcrumbs__list-item" aria-current="page">Send emails to consultees</li>
      </ol>
    </nav>`;
}

function renderConsulteeRow(consultee, options = {}) {
  const { checked = true } = options;
  const checkedAttr = checked ? " checked" : "";
  const id = `consultee-${consultee.name.toLowerCase().replace(/\s+/g, "-")}`;

  const suffix =
    consultee.role && consultee.organisation
      ? `<br><span class="govuk-body-s govuk-!-margin-bottom-0" style="color: #505a5f;">${consultee.role}, ${consultee.organisation}</span>`
      : consultee.organisation
        ? `<br><span class="govuk-body-s govuk-!-margin-bottom-0" style="color: #505a5f;">${consultee.organisation}</span>`
        : "";

  const constraintText = consultee.constraints?.length
    ? consultee.constraints.join(", ")
    : "&ndash;";

  const dateText = consultee.sentAt || "&ndash;";

  return `
    <tr class="govuk-table__row">
      <td class="govuk-table__cell">
        <div class="govuk-checkboxes__item" style="min-height: auto; padding-left: 28px;">
          <input class="govuk-checkboxes__input" id="${id}" type="checkbox"${checkedAttr}>
          <label class="govuk-label govuk-checkboxes__label" for="${id}">
            <span class="govuk-visually-hidden">Select ${consultee.name}</span>
          </label>
        </div>
      </td>
      <td class="govuk-table__cell">${consultee.name}${suffix}</td>
      <td class="govuk-table__cell">${constraintText}</td>
      <td class="govuk-table__cell">${renderStatusTag(consultee.status)}</td>
      <td class="govuk-table__cell">${dateText}</td>
    </tr>`;
}

function renderConsulteeEmailTable(consulteeList, options = {}) {
  const { allChecked = true, checkedNames = [] } = options;

  const toggleChecked = allChecked ? " checked" : "";
  const rows = consulteeList
    .map((c) => {
      const isChecked = allChecked || checkedNames.includes(c.name);
      return renderConsulteeRow(c, { checked: isChecked });
    })
    .join("");

  return `
    <h2>
      <div class="govuk-hint govuk-!-margin-bottom-0">Step 1</div>
      Select consultees to email
    </h2>

    <table class="govuk-table">
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th class="govuk-table__header" scope="col" style="width: 40px;">
            <div class="govuk-checkboxes__item" style="min-height: auto; padding-left: 28px;">
              <input class="govuk-checkboxes__input" id="toggle-all" type="checkbox"${toggleChecked}>
              <label class="govuk-label govuk-checkboxes__label" for="toggle-all">
                <span class="govuk-visually-hidden">Select all</span>
              </label>
            </div>
          </th>
          <th class="govuk-table__header" scope="col">Consultee</th>
          <th class="govuk-table__header" scope="col">Constraint(s)</th>
          <th class="govuk-table__header" scope="col">Status</th>
          <th class="govuk-table__header" scope="col">Date consulted</th>
        </tr>
      </thead>
      <tbody class="govuk-table__body">
        ${rows}
      </tbody>
    </table>`;
}

function renderEmailTypeSelector(selected = "send") {
  const options = [
    { value: "send", label: "Initial consultation" },
    { value: "resend", label: "Resending to existing consultees" },
    { value: "reconsult", label: "Reconsultation" },
  ];

  const optionHtml = options
    .map(
      (o) =>
        `<option value="${o.value}"${o.value === selected ? " selected" : ""}>${o.label}</option>`,
    )
    .join("");

  return `
    <h2>
      <div class="govuk-hint govuk-!-margin-bottom-0">Step 2</div>
      Select consultation type
    </h2>

    <div class="govuk-form-group">
      <label class="govuk-label" for="email-reason">Email type</label>
      <select class="govuk-select" id="email-reason">
        ${optionHtml}
      </select>
    </div>`;
}

function renderEmailTemplateDetails(options = {}) {
  const {
    open = false,
    subject = consulteeEmailTemplate.subject,
    body = consulteeEmailTemplate.body,
  } = options;

  const openAttr = open ? " open" : "";

  return `
    <details class="govuk-details"${openAttr}>
      <summary class="govuk-details__summary">
        <span class="govuk-details__summary-text">View/edit email template</span>
      </summary>
      <div class="govuk-details__text">
        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--s" for="consultee-message-subject">Message subject</label>
          <input class="govuk-input" id="consultee-message-subject" type="text" value="${subject}" autocomplete="off">
        </div>

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--s" for="consultee-message-body">Message body</label>
          <textarea class="govuk-textarea" id="consultee-message-body" rows="25">${body}</textarea>
        </div>

        <p class="govuk-hint">
          The message is formatted using <a href="https://www.notifications.service.gov.uk/using-notify/formatting" class="govuk-link">GOV.UK Notify formatting rules</a>.
          Placeholders like <code>{{name}}</code> will be substituted when the email is sent.
        </p>

        <button class="govuk-button govuk-button--secondary" type="button">Reset message to default content</button>
      </div>
    </details>`;
}

function renderResponsePeriod(days = "") {
  return `
    <div class="govuk-form-group" id="response-period">
      <h2>
        <div class="govuk-hint govuk-!-margin-bottom-0">Step 3</div>
        <label class="govuk-label govuk-label--m" for="consultee-response-period">Set response period</label>
      </h2>

      <p class="govuk-hint">
        Enter the number of days that consultees have to respond.
      </p>

      <div class="govuk-input__wrapper">
        <input class="govuk-input govuk-input--width-4" id="consultee-response-period" type="text" value="${days}">
        <div class="govuk-input__suffix" aria-hidden="true">days</div>
      </div>
    </div>`;
}

function renderFormButtons() {
  return `
    <div class="govuk-button-group">
      <button class="govuk-button" type="submit">Send emails to consultees</button>
      <a class="govuk-button govuk-button--secondary" href="#">Back</a>
    </div>`;
}

function renderSuccessBanner(count) {
  return `
    <div class="govuk-notification-banner govuk-notification-banner--success" role="alert" aria-labelledby="govuk-notification-banner-title" data-module="govuk-notification-banner">
      <div class="govuk-notification-banner__header">
        <h2 class="govuk-notification-banner__title" id="govuk-notification-banner-title">Success</h2>
      </div>
      <div class="govuk-notification-banner__content">
        <p class="govuk-notification-banner__heading">Emails sent to ${count} consultees</p>
        <p class="govuk-body">Emails are being delivered via GOV.UK Notify. Delivery status will update automatically.</p>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Full 3-step form: all consultees checked, all "Not consulted", template collapsed, response period empty. */
export const InitialView = {
  render: () => {
    const freshConsultees = consultees.map((c) => ({
      ...c,
      status: "not_consulted",
      sentAt: null,
    }));

    return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Send emails to consultees</h1>

        ${renderConsulteeEmailTable(freshConsultees)}
        ${renderEmailTypeSelector("send")}
        ${renderEmailTemplateDetails()}
        ${renderResponsePeriod()}
        ${renderFormButtons()}
      </div>
    </div>`;
  },
};

/** All checkboxes unchecked — shows the selection mechanism before choosing recipients. */
export const NoneSelected = {
  render: () => {
    const freshConsultees = consultees.map((c) => ({
      ...c,
      status: "not_consulted",
      sentAt: null,
    }));

    return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Send emails to consultees</h1>

        ${renderConsulteeEmailTable(freshConsultees, { allChecked: false })}
        ${renderEmailTypeSelector("send")}
        ${renderEmailTemplateDetails()}
        ${renderResponsePeriod()}
        ${renderFormButtons()}
      </div>
    </div>`;
  },
};

/** Email template expanded showing subject, body with placeholders, formatting hint, and reset button. */
export const TemplateExpanded = {
  render: () => {
    const freshConsultees = consultees.map((c) => ({
      ...c,
      status: "not_consulted",
      sentAt: null,
    }));

    return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Send emails to consultees</h1>

        ${renderConsulteeEmailTable(freshConsultees)}
        ${renderEmailTypeSelector("send")}
        ${renderEmailTemplateDetails({ open: true })}
        ${renderResponsePeriod("21")}
        ${renderFormButtons()}
      </div>
    </div>`;
  },
};

/** Resending to a failed consultee — mixed statuses from prior send, only failed one checked. */
export const ResendToFailed = {
  render: () => {
    const resendConsultees = consultees.map((c) => {
      if (c.name === "Conservation Officer")
        return { ...c, status: "awaiting_response", sentAt: "25 Nov 2024" };
      if (c.name === "Tree Officer")
        return { ...c, status: "failed", sentAt: "25 Nov 2024" };
      if (c.name === "Highways Authority")
        return { ...c, status: "awaiting_response", sentAt: "25 Nov 2024" };
      if (c.name === "Environment Agency")
        return { ...c, status: "awaiting_response", sentAt: "25 Nov 2024" };
      if (c.name === "Thames Water")
        return { ...c, status: "awaiting_response", sentAt: "25 Nov 2024" };
      return { ...c, status: "awaiting_response", sentAt: "25 Nov 2024" };
    });

    return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Send emails to consultees</h1>

        ${renderConsulteeEmailTable(resendConsultees, { allChecked: false, checkedNames: ["Tree Officer"] })}
        ${renderEmailTypeSelector("resend")}
        ${renderEmailTemplateDetails()}
        ${renderResponsePeriod("21")}
        ${renderFormButtons()}
      </div>
    </div>`;
  },
};

/** Reconsultation — all responded or awaiting, template customised, shorter response period. */
export const ReconsultationType = {
  render: () => {
    const reconsultConsultees = consultees.map((c) => {
      if (c.name === "Conservation Officer")
        return {
          ...c,
          status: "complete",
          sentAt: "25 Nov 2024",
          respondedAt: "3 Dec 2024",
        };
      if (c.name === "Tree Officer")
        return {
          ...c,
          status: "complete",
          sentAt: "25 Nov 2024",
          respondedAt: "1 Dec 2024",
        };
      if (c.name === "Highways Authority")
        return {
          ...c,
          status: "complete",
          sentAt: "25 Nov 2024",
          respondedAt: "5 Dec 2024",
        };
      if (c.name === "Environment Agency")
        return { ...c, status: "awaiting_response", sentAt: "25 Nov 2024" };
      if (c.name === "Thames Water")
        return {
          ...c,
          status: "complete",
          sentAt: "25 Nov 2024",
          respondedAt: "2 Dec 2024",
        };
      return { ...c, status: "complete", sentAt: "25 Nov 2024" };
    });

    const customBody = `Dear {{name}}

RECONSULTATION: {{application_title_case}} number {{reference}}

We are writing to inform you that the applicant has submitted amended plans for the above application. We would welcome your further comments on the revised proposals.

## Proposal (amended)

{{description}}

## Site address

{{address}}

To view the amended documents, visit:
{{link}}.

## Comment on this {{application_short_case}}

Please submit your comments by {{closing_date}} by using the web form. You can include attachments. We may not be able to consider comments received after this date.

Yours


{{local_authority}}`;

    return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Send emails to consultees</h1>

        ${renderConsulteeEmailTable(reconsultConsultees)}
        ${renderEmailTypeSelector("reconsult")}
        ${renderEmailTemplateDetails({ open: true, subject: "Reconsultation: Comments requested for " + application.reference, body: customBody })}
        ${renderResponsePeriod("14")}
        ${renderFormButtons()}
      </div>
    </div>`;
  },
};

/** Success state — green banner shown, all consultees now "Sending". */
export const EmailsSentConfirmation = {
  render: () => {
    const sendingConsultees = consultees.map((c) => ({
      ...c,
      status: "sending",
      sentAt: "9 Dec 2024",
    }));

    return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Send emails to consultees</h1>

        ${renderSuccessBanner(5)}
        ${renderConsulteeEmailTable(sendingConsultees)}
        ${renderEmailTypeSelector("send")}
        ${renderEmailTemplateDetails()}
        ${renderResponsePeriod("21")}
        ${renderFormButtons()}
      </div>
    </div>`;
  },
};

/** Return visit — mixed delivery statuses: awaiting response, sending, failed. */
export const MixedDeliveryStatuses = {
  render: () => {
    const mixedConsultees = consultees.map((c) => {
      if (c.name === "Conservation Officer")
        return { ...c, status: "awaiting_response", sentAt: "9 Dec 2024" };
      if (c.name === "Tree Officer")
        return { ...c, status: "sending", sentAt: "9 Dec 2024" };
      if (c.name === "Highways Authority")
        return { ...c, status: "awaiting_response", sentAt: "9 Dec 2024" };
      if (c.name === "Environment Agency")
        return { ...c, status: "failed", sentAt: "9 Dec 2024" };
      if (c.name === "Thames Water")
        return { ...c, status: "awaiting_response", sentAt: "9 Dec 2024" };
      return { ...c, status: "awaiting_response", sentAt: "9 Dec 2024" };
    });

    return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Send emails to consultees</h1>

        ${renderConsulteeEmailTable(mixedConsultees, { allChecked: false, checkedNames: ["Environment Agency"] })}
        ${renderEmailTypeSelector("resend")}
        ${renderEmailTemplateDetails()}
        ${renderResponsePeriod("21")}
        ${renderFormButtons()}
      </div>
    </div>`;
  },
};
