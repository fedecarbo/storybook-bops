/**
 * Letter template reset — proposed pattern for reverting a customised
 * letter/message template back to the service default in an honest way.
 *
 * The current BOPS implementation persists customisations on send (and on
 * draft save for neighbour letters), but the "Reset to default" button is
 * client-side only — it overwrites form fields without clearing the persisted
 * value. The next page load reloads the customised text from the database,
 * so the reset action visibly does nothing.
 *
 * These stories illustrate the proposed corrected behaviour using the
 * consultee email editor as the visual exemplar (subject + body), but the
 * pattern applies equally to neighbour letters and to any other editable
 * template. The three states are:
 *
 *   1. DefaultContent     — the form loads the default; provenance label
 *                           confirms no customisation is saved.
 *   2. CustomisedContent  — a previous edit is persisted; provenance label
 *                           names who customised and when, and Reset is offered.
 *   3. ResetSuccess       — after Reset round-trips to the server, the success
 *                           banner names what changed and the form shows the
 *                           default again.
 */
import { mockData } from "../../helpers";

const { application, consulteeEmailTemplate, people } = mockData;

export default {
  title: "Patterns/Letter template reset",
  parameters: {
    layout: "padded",
  },
  decorators: [
    (story) =>
      `<div style="max-width: 1100px; margin: 0 auto; padding: 20px;">${story()}</div>`,
  ],
};

// ---------------------------------------------------------------------------
// Wireframe shell — matches the Saving-pattern previews so all pattern
// canvases share the same chrome.
// ---------------------------------------------------------------------------

function renderShell(innerHtml, { caption } = {}) {
  return `
    <div class="ltr-wireframe">
      <div class="ltr-wireframe__header">
        <span class="ltr-wireframe__logo">GOV.UK</span>
        <span class="ltr-wireframe__service">Back Office Planning System</span>
      </div>
      <div class="ltr-wireframe__bar">
        <span>${application.reference}</span>
        <span style="margin: 0 8px; opacity: 0.5;">|</span>
        <span>${application.address.full}</span>
      </div>
      <div class="ltr-wireframe__body">
        ${innerHtml}
      </div>
      ${caption ? `<div class="ltr-wireframe__caption">${caption}</div>` : ""}
    </div>

    <style>
      .ltr-wireframe {
        border: 1px solid #b1b4b6;
        border-radius: 6px;
        overflow: hidden;
        font-family: "GDS Transport", arial, sans-serif;
        background: #fff;
      }
      .ltr-wireframe__header {
        background: #0b0c0c;
        padding: 10px 20px;
        display: flex;
        align-items: baseline;
        gap: 12px;
      }
      .ltr-wireframe__logo {
        color: #fff;
        font-weight: bold;
        font-size: 18px;
      }
      .ltr-wireframe__service {
        color: #fff;
        font-size: 16px;
      }
      .ltr-wireframe__bar {
        background: #f3f2f1;
        padding: 8px 20px;
        font-size: 14px;
        color: #0b0c0c;
        border-bottom: 1px solid #b1b4b6;
      }
      .ltr-wireframe__body {
        padding: 30px 40px 40px;
      }
      .ltr-wireframe__caption {
        background: #f3f2f1;
        border-top: 1px solid #b1b4b6;
        padding: 10px 20px;
        font-size: 13px;
        color: #505a5f;
      }
      .ltr-provenance {
        display: inline-block;
        margin: 0 0 12px;
        padding: 6px 10px;
        font-size: 14px;
        line-height: 1.3;
        border-left: 4px solid #b1b4b6;
        background: #f3f2f1;
        color: #0b0c0c;
      }
      .ltr-provenance--default { border-left-color: #00703c; }
      .ltr-provenance--custom { border-left-color: #1d70b8; }
    </style>`;
}

// ---------------------------------------------------------------------------
// Form fragment — consultee email editor, used as the worked example.
// Markup mirrors the live "Send emails to consultees" task so the previews
// read like the real BOPS form, not an abstract demo.
// ---------------------------------------------------------------------------

const customisedSubject = `Camberwell Conservation Area — comments requested for ${application.reference}`;

const customisedBody = `Dear {{name}}

We are consulting you on a planning application within the Camberwell Green Conservation Area. Given the heritage sensitivities, we would particularly welcome your views on the proposed materials and the impact on the setting of the Grade II listed building at the application site.

## Proposal

${application.descriptionShort}

## Site address

${application.address.full}

To view the application documents, visit:
{{link}}.

## Comment on this application

Please submit your comments by {{closing_date}}. Given the conservation area sensitivities, we would appreciate a response within 14 days where possible.

Yours

${people.caseOfficer.name}
Southwark Council`;

function renderProvenance({ kind, text }) {
  const klass = kind === "default" ? "ltr-provenance--default" : "ltr-provenance--custom";
  return `<p class="ltr-provenance ${klass}">${text}</p>`;
}

function renderTemplateEditor({ subject, body, provenance, showResetButton }) {
  const provenanceHtml = provenance ? renderProvenance(provenance) : "";

  const resetButtonHtml = showResetButton
    ? `<button class="govuk-button govuk-button--secondary" type="submit" name="reset" value="true">
         Reset to default
       </button>`
    : "";

  return `
    <h1 class="govuk-heading-l">Send emails to consultees</h1>

    <details class="govuk-details" open>
      <summary class="govuk-details__summary">
        <span class="govuk-details__summary-text">View/edit email template</span>
      </summary>
      <div class="govuk-details__text">

        ${provenanceHtml}

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--s" for="consultee-message-subject">Message subject</label>
          <input class="govuk-input" id="consultee-message-subject" type="text" value="${subject}" autocomplete="off">
        </div>

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--s" for="consultee-message-body">Message body</label>
          <textarea class="govuk-textarea" id="consultee-message-body" rows="18">${body}</textarea>
        </div>

        <p class="govuk-hint">
          The message is formatted using <a href="https://www.notifications.service.gov.uk/using-notify/formatting" class="govuk-link">GOV.UK Notify formatting rules</a>.
          Placeholders like <code>{{name}}</code> will be substituted when the email is sent.
        </p>

        <div class="govuk-button-group">
          <button class="govuk-button" type="submit">Save changes</button>
          ${resetButtonHtml}
        </div>
      </div>
    </details>`;
}

function renderSuccessBanner(message) {
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
        <h3 class="govuk-notification-banner__heading">${message}</h3>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Story 1 — Default content (no customisation persisted)
// ---------------------------------------------------------------------------

export const DefaultContent = {
  name: "1. Default content (no customisation saved)",
  render: () =>
    renderShell(
      `
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">
          ${renderTemplateEditor({
            subject: consulteeEmailTemplate.subject,
            body: consulteeEmailTemplate.body,
            provenance: {
              kind: "default",
              text: "This is the default content. Edits will be saved against this application only.",
            },
            showResetButton: false,
          })}
        </div>
      </div>
    `,
      {
        caption:
          "When no customisation is saved against the application, the form loads the service default. A short provenance label confirms this so the user knows that whatever they see is what will be sent. There is nothing to reset, so the Reset button is hidden — a button that does nothing is worse than no button.",
      }
    ),
};

// ---------------------------------------------------------------------------
// Story 2 — Customised content (a saved custom version exists)
// ---------------------------------------------------------------------------

export const CustomisedContent = {
  name: "2. Customised content (saved custom version)",
  render: () =>
    renderShell(
      `
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">
          ${renderTemplateEditor({
            subject: customisedSubject,
            body: customisedBody,
            provenance: {
              kind: "custom",
              text: `This content was customised on 5 May 2026 by ${people.caseOfficer.name}. <a class="govuk-link" href="#">Reset to default</a> to revert.`,
            },
            showResetButton: true,
          })}
        </div>
      </div>
    `,
      {
        caption:
          "When the application has a saved custom version, the form loads that — and the provenance label names who saved it and when. Reset to default is now a real action: it submits a request that clears the persisted custom text on the server. Until that round-trip happens, customisations stay saved.",
      }
    ),
};

// ---------------------------------------------------------------------------
// Story 3 — Reset success (round-trip completed, default restored)
// ---------------------------------------------------------------------------

export const ResetSuccess = {
  name: "3. Reset success (default restored)",
  render: () =>
    renderShell(
      `
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">
          ${renderSuccessBanner("Email content has been reset to the default.")}

          ${renderTemplateEditor({
            subject: consulteeEmailTemplate.subject,
            body: consulteeEmailTemplate.body,
            provenance: {
              kind: "default",
              text: "This is the default content. Edits will be saved against this application only.",
            },
            showResetButton: false,
          })}
        </div>
      </div>
    `,
      {
        caption:
          "After Reset to default, a success banner names exactly what changed. The form now shows the default content and the provenance label has flipped back to default. The next visit to this page — and the next sent email — will use the default until the user customises again.",
      }
    ),
};
