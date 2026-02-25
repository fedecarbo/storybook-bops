/**
 * Review Documents — the case officer reviews all submitted documents,
 * tags them by category (Drawings / Evidence / Supporting), checks visibility,
 * and validates each one. This is the first task in validation.
 *
 * The list view shows a GOV.UK table of all documents with their tags,
 * date received, visibility, redaction status, and review status.
 *
 * The edit view shows a single document with thumbnail, metadata, tag editing
 * (GOV.UK tabs with checkboxes), privacy radios, and validation radios.
 */
import {
  mockData,
  renderStatusTag,
  wrapInPage,
} from "../../../helpers";

export default {
  title: "Workflows/Planning Permission/1. Validation/Review Documents",
  parameters: {
    layout: "fullscreen",
  },
};

// ---------------------------------------------------------------------------
// Helper: render a single turquoise document tag
// ---------------------------------------------------------------------------

function renderDocumentTag(tagKey) {
  const label = mockData.documentTagLabels[tagKey] || tagKey;
  return `<strong class="govuk-tag govuk-tag--turquoise document-tag">${label}</strong>`;
}

// ---------------------------------------------------------------------------
// Helper: render all tags for a document, or "No tags added"
// ---------------------------------------------------------------------------

function renderDocumentTags(tags) {
  if (!tags || tags.length === 0) {
    return `<p class="govuk-body govuk-!-margin-bottom-1"><em>No tags added</em></p>`;
  }
  return tags.map(renderDocumentTag).join("\n");
}

// ---------------------------------------------------------------------------
// Helper: render a single document table row
// ---------------------------------------------------------------------------

function renderDocumentRow(doc) {
  return `
    <tr class="govuk-table__row">
      <td class="govuk-table__cell">
        <p><a class="govuk-link" href="#">${doc.name}</a></p>
        ${renderDocumentTags(doc.tags)}
      </td>
      <td class="govuk-table__cell">${doc.uploadedAt}</td>
      <td class="govuk-table__cell">${doc.publishable ? "Public" : "-"}</td>
      <td class="govuk-table__cell">${doc.redacted ? "Redacted" : "-"}</td>
      <td class="govuk-table__cell">${renderStatusTag(doc.status)}</td>
    </tr>`;
}

// ---------------------------------------------------------------------------
// Helper: render the full document table
// ---------------------------------------------------------------------------

function renderDocumentTable(documents) {
  const rows = documents.map(renderDocumentRow).join("\n");
  return `
    <table class="govuk-table govuk-!-margin-top-4">
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th scope="col" class="govuk-table__header">Document name</th>
          <th scope="col" class="govuk-table__header">Date received</th>
          <th scope="col" class="govuk-table__header">Visibility</th>
          <th scope="col" class="govuk-table__header">Redacted</th>
          <th scope="col" class="govuk-table__header">Status</th>
        </tr>
      </thead>
      <tbody class="govuk-table__body">
        ${rows}
      </tbody>
    </table>`;
}

// ---------------------------------------------------------------------------
// Helper: render the document list page
// ---------------------------------------------------------------------------

function renderDocumentListPage(documents) {
  const isEmpty = !documents || documents.length === 0;

  const downloadButton = isEmpty
    ? ""
    : `<div class="display-flex">
        <a href="#" role="button" draggable="false" class="govuk-button govuk-button--secondary" data-module="govuk-button">
          Download all documents
        </a>
      </div>`;

  const tableOrEmpty = isEmpty
    ? `<ul class="app-task-list__items govuk-!-padding-left-0">
        <li class="app-task-list__item">
          <span class="app-task-list__task-name">There are no active documents</span>
        </li>
      </ul>`
    : renderDocumentTable(documents);

  // When the header bar is shown, the proposal_header partial hides
  // address/reference/description (they're already in the bar).
  // It only shows the h1 heading and status tags.
  const content = `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds" id="planning-application-details">
        <h1 class="govuk-heading-l">Review documents</h1>
        <div id="planning-application-statuses-tags">
          <p>${renderStatusTag("in_progress")}</p>
        </div>
      </div>
    </div>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        <div id="check-tag-documents-tasks">
          <h2 class="app-task-list__section">Submitted documents</h2>
          <div>
            ${downloadButton}
            ${tableOrEmpty}
          </div>
        </div>
        <a href="#" role="button" draggable="false" class="govuk-button govuk-button--secondary" data-module="govuk-button">Back</a>
      </div>
    </div>`;

  return wrapInPage(content, {
    showHeaderBar: true,
    withSidebar: {
      subsections: mockData.validationTasks.subsections,
      activeTaskSlug: "review-documents",
    },
  });
}

// ---------------------------------------------------------------------------
// Helper: render tag checkboxes for one group
// ---------------------------------------------------------------------------

function renderTagCheckboxes(group, checkedTags = []) {
  const checkboxes = group.tags
    .map((tag) => {
      const id = `tag-${tag.key.replace(/\./g, "-")}`;
      const checked = checkedTags.includes(tag.key) ? " checked" : "";
      return `
          <div class="govuk-checkboxes__item">
            <input class="govuk-checkboxes__input" id="${id}" name="tags[]" type="checkbox" value="${tag.key}"${checked}>
            <label class="govuk-label govuk-checkboxes__label" for="${id}">${tag.label}</label>
          </div>`;
    })
    .join("\n");

  return `
      <fieldset class="govuk-fieldset">
        <legend class="govuk-fieldset__legend">${group.label}</legend>
        <span class="govuk-hint">${group.hint}</span>
        <div class="govuk-checkboxes govuk-checkboxes--small">
          <div class="govuk-!-column-count-2">
            ${checkboxes}
          </div>
        </div>
      </fieldset>`;
}

// ---------------------------------------------------------------------------
// Helper: render GOV.UK tabs for tag categories
// ---------------------------------------------------------------------------

function renderTagTabs(documentTags = [], activeTab = "drawings") {
  const groups = mockData.documentTagGroups;
  const tabEntries = [
    { key: "drawings", id: "drawings-tags" },
    { key: "evidence", id: "evidence-tags" },
    { key: "supportingDocuments", id: "supporting-documents-tags" },
  ];

  const tabItems = tabEntries
    .map(({ key, id }) => {
      const group = groups[key];
      const selected = key === activeTab ? " govuk-tabs__list-item--selected" : "";
      return `
          <li class="govuk-tabs__list-item${selected}">
            <a class="govuk-tabs__tab" href="#${id}">${group.label}</a>
          </li>`;
    })
    .join("\n");

  const tabPanels = tabEntries
    .map(({ key, id }) => {
      const group = groups[key];
      const hidden = key !== activeTab ? " govuk-tabs__panel--hidden" : "";
      return `
        <div class="govuk-tabs__panel${hidden}" id="${id}">
          ${renderTagCheckboxes(group, documentTags)}
        </div>`;
    })
    .join("\n");

  return `
    <div class="govuk-tabs" data-module="govuk-tabs">
      <h2 class="govuk-tabs__title">Tag categories</h2>
      <ul class="govuk-tabs__list">
        ${tabItems}
      </ul>
      ${tabPanels}
    </div>`;
}

// ---------------------------------------------------------------------------
// Helper: render the document edit page
// Matches: tasks/check-and-validate/.../review-documents/edit.html.erb
// ---------------------------------------------------------------------------

function renderDocumentEditPage(document, options = {}) {
  const {
    tagsExpanded = false,
    publishableSelected = null,
    validSelected = null,
    consulteeSelected = null,
    numbersValue = "",
  } = options;

  const currentTags = renderDocumentTags(document.tags);
  const detailsOpen = tagsExpanded ? " open" : "";
  const tagTabsHtml = renderTagTabs(document.tags, "drawings");

  function checked(selectedValue, value) {
    return selectedValue === value ? " checked" : "";
  }

  // The "No" conditional textarea for invalid documents
  const invalidReasonHtml = validSelected === "false"
    ? `
              <div class="govuk-radios__conditional" id="conditional-validated-no">
                <div class="govuk-form-group">
                  <label class="govuk-label govuk-label--s" for="invalidated-document-reason">
                    List all issues with the document
                  </label>
                  <div class="govuk-hint">
                    Use plain English to explain what is wrong with this document. This message will be shown to the applicant.
                  </div>
                  <textarea class="govuk-textarea" id="invalidated-document-reason" name="invalidated_document_reason" rows="5"></textarea>
                </div>
              </div>`
    : "";

  // When the header bar is visible, the proposal_header only shows
  // the h1 heading + status tags (no address/reference/description).
  const content = `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds" id="planning-application-details">
        <h1 class="govuk-heading-l">Check supplied document</h1>
        <div id="planning-application-statuses-tags">
          <p>${renderStatusTag("in_progress")}</p>
        </div>
      </div>
    </div>

    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <div class="document-thumbnail-placeholder">
          <span>${document.filename}</span>
        </div>
        <p class="govuk-body govuk-!-margin-top-2">
          <a class="govuk-link" href="#">View in new tab</a>
        </p>
      </div>
      <div class="govuk-grid-column-one-half">
        <p class="govuk-body govuk-!-margin-bottom-0">
          <strong>File name:</strong> ${document.filename}
        </p>
        <p class="govuk-body govuk-!-margin-bottom-0">
          <strong>Date received:</strong> ${document.uploadedAt}
        </p>
        <p class="govuk-body govuk-!-margin-bottom-0">
          <strong>Applicant reason for submitting document:</strong>
          ${document.applicantDescription || "No reason submitted"}
        </p>
        <p class="govuk-body">
          Uploaded by applicant via PlanX
        </p>
      </div>
    </div>

    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">

        <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">

        <div class="govuk-form-group">
          <fieldset class="govuk-fieldset govuk-!-margin-top-4">
            <legend class="govuk-fieldset__legend">
              <h2 class="govuk-heading-m">Check document tags</h2>
            </legend>
            <div class="govuk-!-width-two-thirds">
              ${currentTags}
            </div>
            <details class="govuk-details"${detailsOpen}>
              <summary class="govuk-details__summary">
                <span class="govuk-details__summary-text">Edit tags</span>
              </summary>
              <div class="govuk-details__text">
                ${tagTabsHtml}
              </div>
            </details>
          </fieldset>
        </div>

        <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">

        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--s" for="document-numbers">
            Document references
          </label>
          <div class="govuk-hint">
            Where documents contain drawing numbers or other references, add them here
          </div>
          <input class="govuk-input govuk-input--width-20" id="document-numbers" name="numbers" type="text" value="${numbersValue}">
        </div>

        <div class="govuk-form-group govuk-!-margin-top-3">
          <fieldset class="govuk-fieldset">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--s">
              Should this document be made publicly available?
            </legend>
            <div id="publishable-hint" class="govuk-hint">
              Indicate whether this document should be made available for public viewing on the planning register or via the public API. Select "No" if the document contains any sensitive personal information.
            </div>
            <div class="govuk-radios govuk-radios--inline" data-module="govuk-radios">
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="publishable-yes" name="publishable" type="radio" value="true"${checked(publishableSelected, "true")}>
                <label class="govuk-label govuk-radios__label" for="publishable-yes">Yes</label>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="publishable-no" name="publishable" type="radio" value="false"${checked(publishableSelected, "false")}>
                <label class="govuk-label govuk-radios__label" for="publishable-no">No</label>
              </div>
            </div>
          </fieldset>
        </div>

        <div class="govuk-form-group govuk-!-margin-top-3">
          <fieldset class="govuk-fieldset">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--s">
              Should this document be shared with consultees?
            </legend>
            <div class="govuk-radios govuk-radios--inline" data-module="govuk-radios">
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="consultees-yes" name="available_to_consultees" type="radio" value="true"${checked(consulteeSelected, "true")}>
                <label class="govuk-label govuk-radios__label" for="consultees-yes">Yes</label>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="consultees-no" name="available_to_consultees" type="radio" value="false"${checked(consulteeSelected, "false")}>
                <label class="govuk-label govuk-radios__label" for="consultees-no">No</label>
              </div>
            </div>
          </fieldset>
        </div>

        <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">

        <div class="govuk-form-group" id="validate-document">
          <fieldset class="govuk-fieldset">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              Is the document valid?
            </legend>
            <div class="govuk-radios govuk-radios--inline" data-module="govuk-radios">
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="validated-yes" name="validated" type="radio" value="true"${checked(validSelected, "true")}>
                <label class="govuk-label govuk-radios__label" for="validated-yes">Yes</label>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="validated-no" name="validated" type="radio" value="false"${checked(validSelected, "false")}>
                <label class="govuk-label govuk-radios__label" for="validated-no">No</label>
              </div>
            </div>
            ${invalidReasonHtml}
          </fieldset>
        </div>

        <div class="govuk-button-group">
          <button type="submit" class="govuk-button" data-module="govuk-button">Save</button>
        </div>

      </div>
    </div>`;

  return wrapInPage(content, {
    showHeaderBar: true,
    breadcrumbs: [
      { text: "Home", href: "#" },
      { text: "Application", href: "#" },
      { text: "Review documents", href: "#" },
      { text: "Check supplied document" },
    ],
  });
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Main page showing all 8 submitted documents — mix of tagged and untagged, all not yet reviewed. */
export const DocumentList = {
  render: () => renderDocumentListPage(mockData.documents),
};

/** Empty state when no documents have been submitted. */
export const EmptyDocumentList = {
  render: () => renderDocumentListPage([]),
};

/** Mid-progress — officer has checked 3 documents, 5 remain. */
export const SomeDocumentsChecked = {
  render: () => {
    const docs = mockData.documents.map((doc, i) => ({
      ...doc,
      status: i < 3 ? "checked" : "not_started",
    }));
    return renderDocumentListPage(docs);
  },
};

/** All documents checked and tagged — task ready to be marked complete. */
export const AllDocumentsChecked = {
  render: () => {
    const docs = mockData.documents.map((doc) => ({
      ...doc,
      status: "checked",
      tags: doc.tags.length > 0 ? doc.tags : ["otherDocument"],
    }));
    return renderDocumentListPage(docs);
  },
};

/** Edit view for an untagged document — tags collapsed, radios unselected. */
export const EditingDocumentNoTags = {
  render: () =>
    renderDocumentEditPage(mockData.documents[0], {
      tagsExpanded: false,
    }),
};

/** Edit view for a tagged document — tags expanded, Drawings tab active, radios selected. */
export const EditingDocumentWithTags = {
  render: () =>
    renderDocumentEditPage(mockData.documents[3], {
      tagsExpanded: true,
      publishableSelected: "true",
      validSelected: "true",
      consulteeSelected: "true",
      numbersValue: "DWG-001",
    }),
};

/** Edit view showing an invalid document — "No" selected with reason textarea visible. */
export const EditingDocumentInvalid = {
  render: () =>
    renderDocumentEditPage(mockData.documents[4], {
      tagsExpanded: false,
      publishableSelected: "true",
      validSelected: "false",
      consulteeSelected: "true",
    }),
};
