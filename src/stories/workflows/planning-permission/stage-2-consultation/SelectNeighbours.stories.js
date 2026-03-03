/**
 * Select Neighbours — during consultation, the case officer selects
 * neighbouring addresses for notification via a map polygon tool
 * and/or manual address search.
 *
 * Stories show: the initial empty page, polygon-drawn results,
 * manual address search, combined address list, editing existing
 * neighbours, validation errors, and the completed state.
 */
import { mockData, renderStatusTag } from "../../../helpers";

export default {
  title: "Workflows/Planning Permission/2. Consultation/Select Neighbours",
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

const { neighbours, application } = mockData;

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
        <li class="govuk-breadcrumbs__list-item" aria-current="page">Select and add neighbours</li>
      </ol>
    </nav>`;
}

function renderMapPlaceholder(label, options = {}) {
  const { height = 600, showPolygon = false } = options;
  const polygonNote = showPolygon
    ? `<p style="margin: 4px 0 0; font-size: 13px; color: #6b5e00;">Purple area indicates drawn polygon selection</p>`
    : "";

  return `
    <div style="width: 100%; height: ${height}px; background: #f0f4f5; border: 2px solid #1d70b8;
         display: flex; align-items: center; justify-content: center; border-radius: 4px; margin-bottom: 16px;">
      <div style="text-align: center; color: #505a5f;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#505a5f" stroke-width="1.5">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5"/>
        </svg>
        <p style="margin: 8px 0 0; font-family: 'GDS Transport', arial, sans-serif; font-size: 16px;">
          ${label}
        </p>
        ${polygonNote}
      </div>
    </div>`;
}

function renderMapLegend() {
  return `
    <div id="map-legend" class="govuk-!-padding-top-2 govuk-!-margin-bottom-4">
      <svg width="100%" height="50" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="30" height="30" stroke="red" fill="none" stroke-width="2" />
        <text x="50" y="30" font-size="16" class="govuk-body-s">Red line boundary</text>
        <rect x="250" y="10" width="30" height="30" stroke="#d870fc" fill="none" stroke-width="2" />
        <text x="290" y="30" font-size="16" class="govuk-body-s">Area of selected neighbours</text>
      </svg>
    </div>`;
}

function renderInstructions() {
  return `
    <details class="govuk-details">
      <summary class="govuk-details__summary">
        <span class="govuk-details__summary-text">View more instructions</span>
      </summary>
      <div class="govuk-details__text">
        <p>You can select neighbours by:</p>
        <ul class="govuk-list govuk-list--bullet">
          <li>using the map to draw a boundary</li>
          <li>searching by address</li>
        </ul>
        <p>Selected addresses will appear in a list in the next step. You can check the list before sending letters.</p>
        <h3 class="govuk-heading-s">Use the map</h3>
        <p>Click and drag your cursor to draw a line around all the neighbours you want to select. Draw around a whole property to select it.</p>
        <p>If you want to change your selection, use the reset button to start again.</p>
      </div>
    </details>`;
}

function renderAddressEntry(address, index) {
  return `
    <div class="address-entry" id="neighbour-addresses-${index}">
      <hr class="govuk-section-break govuk-section-break--visible govuk-!-margin-top-2 govuk-!-margin-bottom-2">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <p class="govuk-body" style="margin-bottom: 0;">${address}</p>
        <a class="govuk-link" href="#">Remove</a>
      </div>
    </div>`;
}

function renderManualAddressSection(options = {}) {
  const { expanded = false, searchQuery = "", showSuggestions = false } =
    options;
  const openAttr = expanded ? " open" : "";

  const suggestionsHtml = showSuggestions
    ? `
      <ul role="listbox" style="border: 1px solid #b1b4b6; list-style: none; padding: 0; margin-top: -1px; background: #fff; max-height: 200px; overflow-y: auto;">
        <li style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f3f2f1; background: #1d70b8; color: #fff;">18 Elm Grove, London, SE15 5DE</li>
        <li style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f3f2f1;">18A Elm Grove, London, SE15 5DE</li>
        <li style="padding: 8px 12px; cursor: pointer;">18B Elm Grove, London, SE15 5DE</li>
      </ul>`
    : "";

  return `
    <details class="govuk-details govuk-!-margin-top-4"${openAttr}>
      <summary class="govuk-details__summary">
        <span class="govuk-details__summary-text">Manually add addresses</span>
      </summary>
      <div class="govuk-details__text">
        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--s" for="neighbour-address">
            Search neighbours by address
          </label>
          <span id="neighbour-address-hint" class="govuk-hint">
            Start typing address or postcode
          </span>
          <div style="position: relative;">
            <input class="govuk-input" id="neighbour-address" type="text" value="${searchQuery}" autocomplete="off" aria-describedby="neighbour-address-hint">
            ${suggestionsHtml}
          </div>
        </div>
      </div>
    </details>`;
}

function renderSelectedNeighboursAccordion(neighbourList, options = {}) {
  const { editingIndex = -1 } = options;

  const entries = neighbourList
    .map((n, i) => {
      const isEditing = i === editingIndex;

      const displayBlock = isEditing
        ? ""
        : `
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div class="govuk-!-width-three-quarters">
            <p class="govuk-body" style="margin-bottom: 0;">${n.address}</p>
          </div>
          <div style="display: flex; gap: 12px; white-space: nowrap;">
            <a class="govuk-link" href="#">Edit</a>
            <a class="govuk-link" href="#">Remove</a>
          </div>
        </div>`;

      const editBlock = isEditing
        ? `
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div class="govuk-!-width-three-quarters">
            <div class="govuk-form-group">
              <label class="govuk-label" for="neighbour-edit-${i}">Address</label>
              <input class="govuk-input" id="neighbour-edit-${i}" type="text" value="${n.address}">
            </div>
            <button class="govuk-button govuk-button--secondary" style="margin-bottom: 0;">Save</button>
          </div>
          <div style="display: flex; gap: 12px; white-space: nowrap;">
            <a class="govuk-link" href="#">Cancel</a>
            <a class="govuk-link" href="#">Remove</a>
          </div>
        </div>`
        : "";

      return `
      <hr class="govuk-section-break govuk-section-break--visible govuk-!-margin-top-2 govuk-!-margin-bottom-2">
      ${displayBlock}${editBlock}`;
    })
    .join("");

  return `
    <div class="govuk-!-margin-top-6 govuk-!-margin-bottom-6">
      <div class="govuk-accordion" data-module="govuk-accordion" id="accordion-neighbours">
        <div class="govuk-accordion__section govuk-accordion__section--expanded">
          <div class="govuk-accordion__section-header">
            <h2 class="govuk-accordion__section-heading">
              <span class="govuk-accordion__section-button" id="accordion-neighbours-heading-1">
                Neighbours already selected (${neighbourList.length})
              </span>
            </h2>
          </div>
          <div id="accordion-neighbours-content-1" class="govuk-accordion__section-content">
            ${entries}
          </div>
        </div>
      </div>
    </div>`;
}

function renderErrorSummary(errors) {
  const items = errors
    .map((e) => `<li><a href="${e.href}">${e.message}</a></li>`)
    .join("");
  return `
    <div class="govuk-error-summary" data-module="govuk-error-summary">
      <div role="alert">
        <h2 class="govuk-error-summary__title">There is a problem</h2>
        <div class="govuk-error-summary__body">
          <ul class="govuk-list govuk-error-summary__list">
            ${items}
          </ul>
        </div>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Empty page — no addresses selected yet. Map ready for polygon drawing. */
export const InitialView = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Select and add neighbours</h1>

        <p class="govuk-hint govuk-!-margin-bottom-0 govuk-!-margin-top-6">Step 1</p>
        <h2 class="govuk-heading-m">Select neighbours using the map</h2>
        ${renderInstructions()}
        ${renderMapPlaceholder(`Draw a polygon on the map to select neighbours — ${application.address.full}`)}
        ${renderMapLegend()}

        ${renderManualAddressSection()}

        <div style="display: flex; gap: 12px; margin-top: 30px;">
          <a class="govuk-button govuk-button--secondary" href="#">Back</a>
        </div>
      </div>
    </div>`,
};

/** Polygon drawn on the map — 8 addresses returned from OS Places API. */
export const MapPolygonDrawn = {
  render: () => {
    const addressEntries = neighbours
      .map((n, i) => renderAddressEntry(n.address, i))
      .join("");

    return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Select and add neighbours</h1>

        <p class="govuk-hint govuk-!-margin-bottom-0 govuk-!-margin-top-6">Step 1</p>
        <h2 class="govuk-heading-m">Select neighbours using the map</h2>
        ${renderInstructions()}
        ${renderMapPlaceholder(`Polygon drawn — ${neighbours.length} properties selected around ${application.address.full}`, { showPolygon: true })}
        ${renderMapLegend()}

        ${renderManualAddressSection()}

        <div id="address-container" class="govuk-!-margin-top-4">
          <p class="govuk-body govuk-!-font-weight-bold">
            Your search has returned ${neighbours.length} results. The site address is not included in these results.
          </p>
          ${addressEntries}
        </div>

        <div style="display: flex; gap: 12px; margin-top: 30px;">
          <button class="govuk-button">Continue to sending letters</button>
          <a class="govuk-button govuk-button--secondary" href="#">Back</a>
        </div>
      </div>
    </div>`;
  },
};

/** Manual "Manually add addresses" section expanded with autocomplete suggestions. */
export const ManualAddressSearch = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Select and add neighbours</h1>

        <p class="govuk-hint govuk-!-margin-bottom-0 govuk-!-margin-top-6">Step 1</p>
        <h2 class="govuk-heading-m">Select neighbours using the map</h2>
        ${renderInstructions()}
        ${renderMapPlaceholder(`Draw a polygon on the map to select neighbours — ${application.address.full}`)}
        ${renderMapLegend()}

        ${renderManualAddressSection({ expanded: true, searchQuery: "18 Elm", showSuggestions: true })}

        <div style="display: flex; gap: 12px; margin-top: 30px;">
          <a class="govuk-button govuk-button--secondary" href="#">Back</a>
        </div>
      </div>
    </div>`,
};

/** Combined view: 6 addresses from map selection and 2 manually added. */
export const AddressesSelected = {
  render: () => {
    const mapAddresses = neighbours.slice(0, 6);
    const manualAddresses = [
      { address: "18 Elm Grove, London, SE15 5DE" },
      { address: "20 Elm Grove, London, SE15 5DE" },
    ];

    const mapEntries = mapAddresses
      .map((n, i) => renderAddressEntry(n.address, i))
      .join("");
    const manualEntries = manualAddresses
      .map(
        (n, i) => `
      <div class="manual-address-entry" id="neighbour-address-${i}">
        <hr class="govuk-section-break govuk-section-break--visible govuk-!-margin-top-2 govuk-!-margin-bottom-2">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <p class="govuk-body" style="margin-bottom: 0;">${n.address}</p>
          <a class="govuk-link" href="#">Remove</a>
        </div>
      </div>`,
      )
      .join("");

    return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Select and add neighbours</h1>

        <p class="govuk-hint govuk-!-margin-bottom-0 govuk-!-margin-top-6">Step 1</p>
        <h2 class="govuk-heading-m">Select neighbours using the map</h2>
        ${renderInstructions()}
        ${renderMapPlaceholder(`Polygon drawn — ${mapAddresses.length} properties selected around ${application.address.full}`, { showPolygon: true })}
        ${renderMapLegend()}

        ${renderManualAddressSection()}

        <div id="address-container" class="govuk-!-margin-top-4">
          <p class="govuk-body govuk-!-font-weight-bold">
            Your search has returned ${mapAddresses.length} results. The site address is not included in these results.
          </p>
          ${mapEntries}
        </div>

        <div id="manual-address-container" class="govuk-!-margin-top-4">
          <h3 class="govuk-heading-s">Manually added addresses</h3>
          ${manualEntries}
        </div>

        <div style="display: flex; gap: 12px; margin-top: 30px;">
          <button class="govuk-button">Continue to sending letters</button>
          <a class="govuk-button govuk-button--secondary" href="#">Back</a>
        </div>
      </div>
    </div>`;
  },
};

/** Return visit — accordion of already-selected neighbours, one entry in edit mode. */
export const ExistingNeighboursEditing = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Select and add neighbours</h1>

        <p class="govuk-hint govuk-!-margin-bottom-0 govuk-!-margin-top-6">Step 1</p>
        <h2 class="govuk-heading-m">Select neighbours using the map</h2>
        ${renderInstructions()}
        ${renderMapPlaceholder(`Draw a polygon on the map to select more neighbours — ${application.address.full}`)}
        ${renderMapLegend()}

        ${renderManualAddressSection()}

        ${renderSelectedNeighboursAccordion(neighbours, { editingIndex: 2 })}

        <div style="display: flex; gap: 12px; margin-top: 30px;">
          <button class="govuk-button">Continue to sending letters</button>
          <a class="govuk-button govuk-button--secondary" href="#">Back</a>
        </div>
      </div>
    </div>`,
};

/** Validation error — invalid address format (needs at least 2 comma-separated parts). */
export const WithValidationErrors = {
  render: () => {
    const invalidAddress = "Flat 5 Elm Grove";
    const errorMsg = `'${invalidAddress}' is invalid — Enter the property name or number, followed by a comma. Enter the street name, followed by a comma. Enter a postcode, like AA11AA.`;

    return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}

        ${renderErrorSummary([{ href: "#neighbour-addresses-0", message: errorMsg }])}

        <h1 class="govuk-heading-l">Select and add neighbours</h1>

        <p class="govuk-hint govuk-!-margin-bottom-0 govuk-!-margin-top-6">Step 1</p>
        <h2 class="govuk-heading-m">Select neighbours using the map</h2>
        ${renderInstructions()}
        ${renderMapPlaceholder("Polygon drawn — 1 property selected", { showPolygon: true })}
        ${renderMapLegend()}

        ${renderManualAddressSection()}

        <div id="address-container" class="govuk-!-margin-top-4">
          <p class="govuk-body govuk-!-font-weight-bold">
            Your search has returned 1 results. The site address is not included in these results.
          </p>
          <div class="address-entry" id="neighbour-addresses-0">
            <hr class="govuk-section-break govuk-section-break--visible govuk-!-margin-top-2 govuk-!-margin-bottom-2">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <p class="govuk-body" style="margin-bottom: 0;">${invalidAddress}</p>
                <span class="govuk-error-message">
                  <span class="govuk-visually-hidden">Error:</span> ${errorMsg}
                </span>
              </div>
              <a class="govuk-link" href="#">Remove</a>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 12px; margin-top: 30px;">
          <button class="govuk-button">Continue to sending letters</button>
          <a class="govuk-button govuk-button--secondary" href="#">Back</a>
        </div>
      </div>
    </div>`;
  },
};

/** All neighbours selected and saved — task marked as complete. */
export const Completed = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Select and add neighbours</h1>

        <p class="govuk-!-margin-bottom-4">${renderStatusTag("complete")}</p>

        <p class="govuk-hint govuk-!-margin-bottom-0 govuk-!-margin-top-6">Step 1</p>
        <h2 class="govuk-heading-m">Select neighbours using the map</h2>
        ${renderInstructions()}
        ${renderMapPlaceholder(`${neighbours.length} neighbours selected — ${application.address.full}`, { showPolygon: true })}
        ${renderMapLegend()}

        ${renderManualAddressSection()}

        ${renderSelectedNeighboursAccordion(neighbours)}

        <div style="display: flex; gap: 12px; margin-top: 30px;">
          <button class="govuk-button">Continue to sending letters</button>
          <a class="govuk-button govuk-button--secondary" href="#">Back</a>
        </div>
      </div>
    </div>`,
};
