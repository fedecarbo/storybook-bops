/**
 * Asking multiple things at once — a back-office pattern that groups related,
 * conditional questions onto a single high-density page rather than splitting
 * each question across its own page.
 *
 * The examples in this file use real BOPS forms:
 *   - Site Notice (Send site notice form, Stage 2 Consultation)
 *   - Press Notice (Statutory reasons, Stage 2 Consultation)
 *
 * Markup for the "after" examples mirrors the real Site Notice v4 / Press
 * Notice v4 stories so they read like the live application, not a mock.
 */
import { mockData } from "../../helpers";

const { siteNoticeV2: sn, people, pressNoticeReasons } = mockData;

export default {
  title: "Patterns/Asking multiple things at once",
  parameters: {
    layout: "padded",
  },
  decorators: [
    (story) =>
      `<div style="max-width: 1100px; margin: 0 auto; padding: 20px;">${story()}</div>`,
  ],
};

// ---------------------------------------------------------------------------
// Wireframe shell — same visual treatment as the sidebar-navigation pattern,
// so the example sits inside a clean header/content frame.
// ---------------------------------------------------------------------------

function renderShell(innerHtml, { caption } = {}) {
  return `
    <div class="amt-wireframe">
      <div class="amt-wireframe__header">
        <span class="amt-wireframe__logo">GOV.UK</span>
        <span class="amt-wireframe__service">Back Office Planning System</span>
      </div>
      <div class="amt-wireframe__bar">
        <span>${mockData.application.reference}</span>
        <span style="margin: 0 8px; opacity: 0.5;">|</span>
        <span>${mockData.application.address}</span>
      </div>
      <div class="amt-wireframe__body">
        ${innerHtml}
      </div>
      ${caption ? `<div class="amt-wireframe__caption">${caption}</div>` : ""}
    </div>

    <style>
      .amt-wireframe {
        border: 1px solid #b1b4b6;
        border-radius: 6px;
        overflow: hidden;
        font-family: "GDS Transport", arial, sans-serif;
        background: #fff;
      }
      .amt-wireframe__header {
        background: #0b0c0c;
        padding: 10px 20px;
        display: flex;
        align-items: baseline;
        gap: 12px;
      }
      .amt-wireframe__logo {
        color: #fff;
        font-weight: bold;
        font-size: 18px;
      }
      .amt-wireframe__service {
        color: #fff;
        font-size: 16px;
      }
      .amt-wireframe__bar {
        background: #f3f2f1;
        padding: 8px 20px;
        font-size: 14px;
        color: #0b0c0c;
        border-bottom: 1px solid #b1b4b6;
      }
      .amt-wireframe__body {
        padding: 30px 40px 40px;
      }
      .amt-wireframe__caption {
        background: #f3f2f1;
        border-top: 1px solid #b1b4b6;
        padding: 10px 20px;
        font-size: 13px;
        color: #505a5f;
      }
      .amt-pager {
        margin-top: 24px;
        padding-top: 16px;
        border-top: 1px solid #b1b4b6;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        color: #505a5f;
      }
    </style>`;
}

// ---------------------------------------------------------------------------
// Helpers shared with Site Notice v4
// ---------------------------------------------------------------------------

function renderDateInput(id, legend, hint) {
  return `
    <fieldset class="govuk-fieldset" role="group">
      <legend class="govuk-fieldset__legend govuk-fieldset__legend--s">${legend}</legend>
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

// ---------------------------------------------------------------------------
// Story 1 — "Before": one thing per page
//
// Real scenario: same Site Notice questions as the v4 form, but split into
// separate pages following the GDS one-thing-per-page default. This shows
// what an officer would have to click through to send a single site notice.
// ---------------------------------------------------------------------------

export const OneThingPerPage = {
  name: "Before — One thing per page (Site notice)",
  render: () =>
    renderShell(
      `
      <a href="#" class="govuk-back-link">Back</a>
      <h1 class="govuk-heading-l" style="margin-top: 16px;">Does this application require a site notice?</h1>

      <div class="govuk-form-group">
        <fieldset class="govuk-fieldset">
          <div class="govuk-radios" data-module="govuk-radios">
            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="required-yes" name="required" type="radio" value="true">
              <label class="govuk-label govuk-radios__label" for="required-yes">Yes</label>
            </div>
            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="required-no" name="required" type="radio" value="false">
              <label class="govuk-label govuk-radios__label" for="required-no">No</label>
            </div>
          </div>
        </fieldset>
      </div>

      <button class="govuk-button" data-module="govuk-button">Continue</button>

      <div class="amt-pager">
        <span>Page 1 of 5</span>
        <span>Next: How many notices?</span>
      </div>
    `,
      {
        caption:
          "Following GDS one thing per page: every question in the Send site notice flow becomes its own page. To send a single notice an officer clicks through Required → Quantity → Locations → Method (with conditional follow-ups) → Display date.",
      }
    ),
};

// ---------------------------------------------------------------------------
// Story 2 — "After": grouped on one page
//
// Real scenario: the actual Site Notice v4 "Send site notice" form. Markup
// matches SiteNoticeV4.stories.js → CreateForm so this is the live form,
// not a stand-in.
// ---------------------------------------------------------------------------

export const GroupedOnOnePage = {
  name: "After — Send site notice (real BOPS form)",
  render: () =>
    renderShell(
      `
      <a href="#" class="govuk-back-link">Back to site notices</a>

      <h1 class="govuk-heading-l">Send site notice</h1>

      <h2 class="govuk-heading-m">Notice details</h2>

      <div class="govuk-form-group">
        <label class="govuk-label govuk-label--s" for="quantity">
          Quantity
        </label>
        <div class="govuk-hint">How many site notices need to be displayed.</div>
        <input class="govuk-input govuk-input--width-4" id="quantity" name="quantity" type="number" value="2" min="1">
      </div>

      <div class="govuk-form-group">
        <label class="govuk-label govuk-label--s" for="location-instructions">
          Where should the notices be displayed?
        </label>
        <div class="govuk-hint">This will be shared with whoever displays them.</div>
        <textarea class="govuk-textarea" id="location-instructions" name="location_instructions" rows="4">${sn.locationInstructions}</textarea>
      </div>

      <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

      <h2 class="govuk-heading-m">How should the notice be arranged?</h2>

      <div class="govuk-form-group">
        <fieldset class="govuk-fieldset">
          <div class="govuk-radios" data-module="govuk-radios">
            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="method-team" name="method" type="radio" value="internal_team" checked data-aria-controls="conditional-method-team">
              <label class="govuk-label govuk-radios__label" for="method-team">Email an internal team to display it</label>
            </div>
            <div class="govuk-radios__conditional" id="conditional-method-team">
              <div class="govuk-form-group">
                <label class="govuk-label" for="team-email">Team email address</label>
                <input class="govuk-input" id="team-email" name="internal_team_email" type="email" value="${sn.internalTeamEmail}">
              </div>
            </div>
            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="method-applicant" name="method" type="radio" value="applicant" data-aria-controls="conditional-method-applicant">
              <label class="govuk-label govuk-radios__label" for="method-applicant">Email the applicant to display it</label>
            </div>
            <div class="govuk-radios__conditional" id="conditional-method-applicant" style="display: none;">
              <div class="govuk-inset-text">
                The notice will be emailed to <strong>${people.applicant.email}</strong> with instructions on how to print, protect, and display it.
              </div>
            </div>
            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="method-print" name="method" type="radio" value="print" data-aria-controls="conditional-method-print">
              <label class="govuk-label govuk-radios__label" for="method-print">I'll print and arrange it myself</label>
            </div>
            <div class="govuk-radios__conditional" id="conditional-method-print" style="display: none;">
              <div class="govuk-form-group">
                ${renderDateInput("display-date", "When will you display it?", null)}
              </div>
            </div>
          </div>
        </fieldset>
      </div>

      <div class="govuk-button-group govuk-!-margin-top-6">
        <button type="submit" class="govuk-button" data-module="govuk-button">
          Create and send notice
        </button>
        <a class="govuk-link" href="#">Cancel</a>
      </div>
    `,
      {
        caption:
          "The real Site Notice v4 form. Quantity, locations and method (with three conditional branches) are all on one page so the officer can complete the whole task in one pass.",
      }
    ),
};

// ---------------------------------------------------------------------------
// Story 3 — Conditional reveals (real Press Notice statutory reasons)
//
// Real scenario: Press Notice v4 "Statutory reasons" checkbox group with the
// "Other" option that reveals a free-text field inline. Same checkbox markup
// and same `pressNoticeReasons` mock data the live story uses.
// ---------------------------------------------------------------------------

function renderReasonCheckboxes(checked = []) {
  const standard = Object.entries(pressNoticeReasons).filter(
    ([key]) => key !== "other"
  );
  const items = standard
    .map(([key, label]) => {
      const id = `reason-${key}`;
      const isChecked = checked.includes(key) ? " checked" : "";
      return `
        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="${id}" name="reasons[]" type="checkbox" value="${key}"${isChecked}>
          <label class="govuk-label govuk-checkboxes__label" for="${id}">${label}</label>
        </div>`;
    })
    .join("\n");

  const otherChecked = checked.includes("other") ? " checked" : "";

  return `
    <div class="govuk-checkboxes" data-module="govuk-checkboxes">
      ${items}
      <div class="govuk-checkboxes__divider">or</div>
      <div class="govuk-checkboxes__item">
        <input class="govuk-checkboxes__input" id="reason-other" name="reasons[]" type="checkbox" value="other"${otherChecked} data-aria-controls="conditional-reason-other">
        <label class="govuk-label govuk-checkboxes__label" for="reason-other">Other</label>
      </div>
      <div class="govuk-checkboxes__conditional" id="conditional-reason-other">
        <div class="govuk-form-group">
          <label class="govuk-label" for="other-reason">
            Describe the other reason
          </label>
          <textarea class="govuk-textarea" id="other-reason" name="other_reason" rows="3">Site is adjacent to a Grade II listed terrace and the proposal alters the front elevation visible from the public highway.</textarea>
        </div>
      </div>
    </div>`;
}

export const WithConditionalReveals = {
  name: "Conditional reveals — Press notice reasons",
  render: () =>
    renderShell(
      `
      <a href="#" class="govuk-back-link">Back to press notices</a>

      <h1 class="govuk-heading-l">Create press notice</h1>

      <div class="govuk-form-group">
        <fieldset class="govuk-fieldset">
          <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
            Statutory reasons for the press notice
          </legend>
          <div class="govuk-hint">
            Select every reason that applies. If the case doesn't fit a listed reason, choose Other and explain.
          </div>
          ${renderReasonCheckboxes(["conservation_area", "listed_building", "other"])}
        </fieldset>
      </div>

      <div class="govuk-button-group govuk-!-margin-top-6">
        <button type="submit" class="govuk-button" data-module="govuk-button">
          Send request
        </button>
        <a class="govuk-link" href="#">Cancel</a>
      </div>
    `,
      {
        caption:
          "Real Press Notice v4 statutory reasons. The conditional 'Other' textarea is revealed inline beneath the checkbox that triggers it, so the officer never leaves the page to add a justification.",
      }
    ),
};
