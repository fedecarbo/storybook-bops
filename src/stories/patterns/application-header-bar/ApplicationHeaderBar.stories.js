/**
 * Application Header Bar — a persistent context bar shown below the GOV.UK
 * header on every planning application page, giving case officers instant
 * access to the key application facts without taking up task-form space.
 */
import { mockData } from "../../helpers";

export default {
  title: "Patterns/Application Header Bar",
  parameters: {
    layout: "padded",
  },
  decorators: [
    (story) =>
      `<div style="max-width: 1100px; margin: 0 auto; padding: 20px;">${story()}</div>`,
  ],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderHeaderBar({
  reference = mockData.application.reference,
  address = mockData.application.address.full,
  description = mockData.application.description,
  showApplicationInfoLink = true,
  descriptionExpanded = false,
} = {}) {
  const togglePanelClass = descriptionExpanded
    ? "bops-header-bar__toggle-panel"
    : "bops-header-bar__toggle-panel govuk-!-display-none";

  const toggleButtonText = descriptionExpanded
    ? "Hide proposal description"
    : "Show proposal description";

  const ariaExpanded = descriptionExpanded ? "true" : "false";

  const rightItems = showApplicationInfoLink
    ? `<div class="bops-header-bar__list--right">
        <li class="bops-header-bar__item">
          <a href="#" class="govuk-link govuk-link--no-visited-state" target="_blank" rel="noopener noreferrer">Application information</a>
        </li>
      </div>`
    : `<div class="bops-header-bar__list--right"></div>`;

  return `
    <div class="bops-header-bar"
      data-controller="toggle"
      data-toggle-class-name-value="govuk-!-display-none"
      data-toggle-condensed-text-value="Show proposal description"
      data-toggle-expanded-text-value="Hide proposal description">
      <ul class="bops-header-bar__list">
        <li class="bops-header-bar__item">
          <strong><a href="#" class="govuk-link govuk-link--no-visited-state">${reference}</a></strong>
        </li>
        <li class="bops-header-bar__item">${address}</li>
        <li class="bops-header-bar__item--toggle">
          <button
            type="button"
            class="button-as-link govuk-link govuk-link--no-visited-state"
            data-toggle-target="button"
            data-action="toggle#click"
            aria-expanded="${ariaExpanded}">
            ${toggleButtonText}
          </button>
        </li>
        ${rightItems}
      </ul>
      <div class="${togglePanelClass}" data-toggle-target="content" aria-live="polite">
        <p class="govuk-!-margin-0">${description}</p>
      </div>
    </div>`;
}

function renderInLayout(headerBarHtml) {
  return `
    <div class="pattern-wireframe">
      <div class="pattern-wireframe__header">
        <span class="pattern-wireframe__logo">GOV.UK</span>
        <span class="pattern-wireframe__service">Back Office Planning System</span>
      </div>
      ${headerBarHtml}
      <div class="pattern-wireframe__content" style="padding: 30px; background: #fff; min-height: 300px;">
        <h1 class="govuk-heading-l">Check description</h1>
        <div style="margin-top: 20px;">
          <div class="pattern-wireframe__placeholder-line" style="width: 90%; height: 12px; background: #dee0e2; border-radius: 3px; margin-bottom: 10px;"></div>
          <div class="pattern-wireframe__placeholder-line" style="width: 70%; height: 12px; background: #dee0e2; border-radius: 3px; margin-bottom: 10px;"></div>
          <div class="pattern-wireframe__placeholder-line" style="width: 55%; height: 12px; background: #dee0e2; border-radius: 3px; margin-bottom: 24px;"></div>
          <div style="height: 80px; background: #f3f2f1; border: 1px solid #dee0e2; border-radius: 4px; margin-bottom: 20px;"></div>
          <div style="width: 200px; height: 40px; background: #00703c; border-radius: 4px;"></div>
        </div>
      </div>
    </div>

    <style>
      .pattern-wireframe {
        border: 1px solid #b1b4b6;
        border-radius: 6px;
        overflow: hidden;
        font-family: "GDS Transport", arial, sans-serif;
      }
      .pattern-wireframe__header {
        background: #0b0c0c;
        padding: 10px 20px;
        display: flex;
        align-items: baseline;
        gap: 12px;
      }
      .pattern-wireframe__logo {
        color: #fff;
        font-weight: bold;
        font-size: 18px;
      }
      .pattern-wireframe__service {
        color: #fff;
        font-size: 16px;
      }
    </style>`;
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default = {
  name: "Default",
  render: () => renderHeaderBar(),
};

export const DescriptionExpanded = {
  name: "Description expanded",
  render: () => renderHeaderBar({ descriptionExpanded: true }),
};

export const WithoutApplicationInfoLink = {
  name: "Without application info link",
  render: () => renderHeaderBar({ showApplicationInfoLink: false }),
};

export const InContext = {
  name: "In context",
  render: () => renderInLayout(renderHeaderBar()),
};
