/**
 * Check Constraints — the case officer reviews planning constraints
 * affecting the site and confirms they have been considered.
 *
 * Constraints are automatically identified by PlanX / Planning Data when
 * the application is submitted. The officer can also search for and add
 * additional constraints manually, or remove manually-added ones.
 *
 * This task appears in Stage 1 (Validation) under "Check application details".
 */
import { mockData } from "../../../helpers";

export default {
  title: "Workflows/Planning Permission/1. Validation/Check Constraints",
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (story) =>
      `<div style="max-width: 1100px; margin: 0 auto; padding: 30px 20px;">${story()}</div>`,
  ],
};

const { constraints, availableConstraints } = mockData;

// ---------------------------------------------------------------------------
// Helper: render a constraint table row
// ---------------------------------------------------------------------------

function renderConstraintRow(constraint, options = {}) {
  const { showSource = false, showAction = true, actionType = null } = options;

  const entityList =
    constraint.entities && constraint.entities.length > 0
      ? `<ul class="govuk-list">
          ${constraint.entities.map((e) => `<li><a class="govuk-link" href="#">${e.name}</a></li>`).join("")}
        </ul>`
      : "";

  const sourceCell = showSource
    ? `<td class="govuk-table__cell">${constraint.identifiedBy || ""}</td>`
    : "";

  let actionCell = "";
  if (showAction) {
    if (actionType === "add") {
      actionCell = `<td class="govuk-table__cell govuk-table__cell--numeric"><a class="govuk-link" href="#">Add</a></td>`;
    } else if (actionType === "remove") {
      actionCell = `<td class="govuk-table__cell govuk-table__cell--numeric"><a class="govuk-link" href="#">Remove</a></td>`;
    } else {
      // Identified constraint — cannot be removed
      actionCell = `<td class="govuk-table__cell govuk-table__cell--numeric">-</td>`;
    }
  }

  return `
    <tr class="govuk-table__row">
      <td class="govuk-table__cell">
        <strong class="govuk-tag govuk-tag--grey">${constraint.category}</strong>
      </td>
      <td class="govuk-table__cell">
        ${constraint.type}
        ${entityList}
      </td>
      ${sourceCell}
      ${actionCell}
    </tr>`;
}

// ---------------------------------------------------------------------------
// Helper: render the identified constraints table
// ---------------------------------------------------------------------------

function renderIdentifiedTable(constraintList, options = {}) {
  const { extraRows = "" } = options;

  if (constraintList.length === 0 && !extraRows) {
    return `
      <div style="background: #f3f2f1; padding: 24px;">
        <p class="govuk-body govuk-!-margin-bottom-0"><strong>No constraints have been added or identified</strong></p>
      </div>`;
  }

  const rows = constraintList
    .map((c) => renderConstraintRow(c, { showSource: true, actionType: null }))
    .join("");

  return `
    <table class="govuk-table identified-constraints-table">
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th scope="col" class="govuk-table__header govuk-!-width-one-third">Category</th>
          <th scope="col" class="govuk-table__header">Constraint</th>
          <th scope="col" class="govuk-table__header">Source</th>
          <th scope="col" class="govuk-table__header govuk-table__header--numeric">Action</th>
        </tr>
      </thead>
      <tbody class="govuk-table__body">
        ${rows}
        ${extraRows}
      </tbody>
    </table>`;
}

// ---------------------------------------------------------------------------
// Helper: render the search/add constraints section
// ---------------------------------------------------------------------------

function renderSearchSection(options = {}) {
  const { open = false, searchValue = "", results = [] } = options;

  const resultsTable =
    results.length > 0
      ? `<table class="govuk-table other-constraints-table govuk-!-margin-top-4">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header govuk-!-width-one-third">Category</th>
              <th scope="col" class="govuk-table__header">Constraint</th>
              <th scope="col" class="govuk-table__header govuk-table__header--numeric">Action</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            ${results.map((c) => renderConstraintRow(c, { showSource: false, actionType: "add" })).join("")}
          </tbody>
        </table>`
      : "";

  return `
    <details class="govuk-details"${open ? " open" : ""}>
      <summary class="govuk-details__summary">
        <span class="govuk-details__summary-text">Add constraints</span>
      </summary>
      <div>
        <div class="govuk-form-group govuk-!-margin-top-3">
          <label class="govuk-label govuk-label--m" for="constraint-search">
            Find a constraint
          </label>
          <div id="constraint-search-hint" class="govuk-hint">Search by name or category</div>
          <div style="display: flex; gap: 12px; align-items: flex-end;">
            <input class="govuk-input govuk-!-width-two-thirds" id="constraint-search" name="q" type="text" value="${searchValue}" aria-describedby="constraint-search-hint">
            <button type="submit" class="govuk-button govuk-button--secondary govuk-!-margin-bottom-0">Search</button>
          </div>
        </div>
        ${resultsTable}
      </div>
    </details>`;
}

// ---------------------------------------------------------------------------
// Helper: render the full page content
// ---------------------------------------------------------------------------

function renderPage(options = {}) {
  const {
    constraintList = constraints,
    extraRows = "",
    searchOpen = false,
    searchValue = "",
    searchResults = [],
    showEmpty = false,
  } = options;

  const tableContent = showEmpty
    ? renderIdentifiedTable([])
    : renderIdentifiedTable(constraintList, { extraRows });

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        <h1 class="govuk-heading-l">Check the constraints</h1>
      </div>
    </div>

    <div class="govuk-grid-row govuk-!-margin-top-6 govuk-!-margin-bottom-6">
      <div class="govuk-grid-column-two-thirds">
        <h2 class="govuk-heading-m">Add, remove and save constraints</h2>
        <p class="govuk-body">
          Check the constraints for this application. Add any constraints that are relevant.
          When all relevant constraints have been added, save and mark as complete.
        </p>
      </div>
    </div>

    <div class="govuk-grid-row govuk-!-margin-top-6 govuk-!-margin-bottom-6">
      <div class="govuk-grid-column-full">
        <h2 class="govuk-heading-m">Identified constraints</h2>
        <p class="govuk-body">
          <a class="govuk-link" href="#" target="_blank">View map on Planning Data</a>
        </p>
        ${tableContent}
      </div>
    </div>

    <div class="govuk-grid-row govuk-!-margin-top-6 govuk-!-margin-bottom-6">
      <div class="govuk-grid-column-full">
        ${renderSearchSection({ open: searchOpen, searchValue, results: searchResults })}
      </div>
    </div>

    <div class="govuk-grid-row govuk-!-margin-top-6">
      <div class="govuk-grid-column-two-thirds">
        <div class="govuk-button-group">
          <button type="submit" class="govuk-button" data-module="govuk-button">
            Save and mark as complete
          </button>
          <a class="govuk-button govuk-button--secondary" href="#">Back</a>
        </div>
      </div>
    </div>`;
}

// ===========================================================================
// STORIES
// ===========================================================================

/** Initial view — identified constraints from PlanX with search closed. */
export const InitialView = {
  render: () => renderPage(),
};

/** No constraints — empty state when no constraints have been identified. */
export const NoConstraints = {
  render: () => renderPage({ showEmpty: true }),
};

/** Search expanded — officer has opened "Add constraints" and searched. */
export const SearchExpanded = {
  render: () =>
    renderPage({
      searchOpen: true,
      searchValue: "smoke",
      searchResults: availableConstraints,
    }),
};

/** Constraint added — a manually-added constraint appears with a "Remove" link. */
export const ConstraintAdded = {
  render: () => {
    const manualConstraint = {
      type: "Smoke control area",
      category: "General policy",
      identifiedBy: "Sarah Johnson",
      entities: [],
    };
    const manualRow = renderConstraintRow(manualConstraint, {
      showSource: true,
      actionType: "remove",
    });

    return renderPage({ extraRows: manualRow });
  },
};

/** Constraint removed — back to original identified set after removing a manual constraint. */
export const ConstraintRemoved = {
  render: () => renderPage(),
};

/** Completed — all constraints reviewed, task marked as complete. */
export const Completed = {
  render: () => renderPage(),
};
