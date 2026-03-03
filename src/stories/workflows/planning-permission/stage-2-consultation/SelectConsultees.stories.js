/**
 * Select Consultees — during consultation, the case officer reviews
 * planning constraints, selects which require consultation, and assigns
 * consultees to each constraint. Consultees can also be added manually
 * via an autocomplete search.
 *
 * Stories show: the initial page with auto-suggested consultees, empty
 * state, constraint toggling, manual add with autocomplete, a just-added
 * consultee, all assigned, and the completed state.
 */
import { mockData, renderStatusTag } from "../../../helpers";

export default {
  title: "Workflows/Planning Permission/2. Consultation/Select Consultees",
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

const { constraints, consultees, availableConsultees } = mockData;

// Map constraint types to their assigned consultees
const constraintConsulteeMap = [
  {
    constraint: "Conservation area",
    consultees: consultees.filter((c) =>
      c.constraints.includes("Conservation area"),
    ),
  },
  {
    constraint: "Listed building",
    consultees: consultees.filter((c) =>
      c.constraints.includes("Listed building"),
    ),
  },
  {
    constraint: "Article 4 direction",
    consultees: [],
  },
  {
    constraint: "Tree preservation order",
    consultees: consultees.filter((c) =>
      c.constraints.includes("Tree preservation order"),
    ),
  },
  {
    constraint: "Flood zone",
    consultees: consultees.filter((c) => c.constraints.includes("Flood zone")),
  },
  {
    constraint: "Archaeological priority area",
    consultees: [],
  },
];

// Consultees not assigned to any constraint
const unassignedConsultees = consultees.filter(
  (c) => c.constraints.length === 0,
);

// ---------------------------------------------------------------------------
// Status tag helpers
// ---------------------------------------------------------------------------

const consulteeStatusMap = {
  not_consulted: { colour: "grey", label: "Not consulted" },
  not_assigned: { colour: "grey", label: "Not assigned" },
  not_required: { colour: "grey", label: "Not required" },
  sending: { colour: "grey", label: "Sending" },
  awaiting_response: { colour: "grey", label: "Awaiting response" },
  failed: { colour: "red", label: "Failed" },
  responded: { colour: "blue", label: "Responded" },
  complete: { colour: "blue", label: "Responded" },
  no_response: { colour: "grey", label: "Awaiting response" },
};

function renderConsulteeStatus(status) {
  const mapping = consulteeStatusMap[status] || {
    colour: "grey",
    label: status,
  };
  return `<span class="govuk-tag govuk-tag--${mapping.colour}">${mapping.label}</span>`;
}

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
        <li class="govuk-breadcrumbs__list-item" aria-current="page">Add and assign consultees</li>
      </ol>
    </nav>`;
}

function renderConstraintCheckboxes(checkedTypes = [], options = {}) {
  const { disabled = false } = options;
  const disabledAttr = disabled ? " disabled" : "";

  const items = constraints
    .map((c) => {
      const checked = checkedTypes.includes(c.type) ? " checked" : "";
      const id = `constraint-${c.type.toLowerCase().replace(/\s+/g, "-")}`;
      return `
      <div class="govuk-checkboxes__item">
        <input class="govuk-checkboxes__input" id="${id}" type="checkbox"${checked}${disabledAttr}>
        <label class="govuk-label govuk-checkboxes__label" for="${id}">${c.type}</label>
      </div>`;
    })
    .join("");

  return `
    <section class="govuk-!-margin-top-6">
      <h2 class="govuk-heading-m">Select constraints that require consultation</h2>
      <p class="govuk-body">Review the planning constraints and select which ones require consultation.</p>
      <div class="govuk-checkboxes" data-module="govuk-checkboxes">
        ${items}
      </div>
    </section>`;
}

function renderConsulteeRow(constraint, consulteeList, options = {}) {
  const { showActions = true, notRequired = false } = options;

  const consulteeNames = consulteeList.length
    ? `<ul class="govuk-list" style="margin-bottom: 0;">
        ${consulteeList.map((c) => `<li><span>${c.name}</span></li>`).join("")}
       </ul>`
    : "";

  const statusCells = consulteeList.length
    ? `<ul class="govuk-list" style="margin-bottom: 0;">
        ${consulteeList.map((c) => `<li>${renderConsulteeStatus(c.status || "not_consulted")}</li>`).join("")}
       </ul>`
    : `<ul class="govuk-list" style="margin-bottom: 0;">
        <li>${renderConsulteeStatus("not_assigned")}</li>
       </ul>`;

  const notRequiredTag = notRequired
    ? `<div class="govuk-!-margin-top-1">${renderConsulteeStatus("not_required")}</div>`
    : "";

  let actionCell;
  if (!showActions) {
    actionCell = "&ndash;";
  } else if (consulteeList.length) {
    actionCell = `<ul class="govuk-list" style="margin-bottom: 0;">
      ${consulteeList.map(() => `<li><a class="govuk-link" href="#">Remove</a></li>`).join("")}
    </ul>
    <div class="govuk-!-margin-top-1"><a class="govuk-link" href="#">Assign another consultee</a></div>`;
  } else {
    actionCell = `<a class="govuk-link" href="#">Assign consultee</a>`;
  }

  return `
    <tr class="govuk-table__row">
      <td class="govuk-table__cell">${constraint}</td>
      <td class="govuk-table__cell">${consulteeNames || "&ndash;"}</td>
      <td class="govuk-table__cell">${statusCells}${notRequiredTag}</td>
      <td class="govuk-table__cell">${actionCell}</td>
    </tr>`;
}

function renderConsulteesTable(
  constraintMap,
  unassigned = [],
  options = {},
) {
  const { showActions = true, uncheckedConstraints = [] } = options;

  const constraintRows = constraintMap
    .map((entry) => {
      const notRequired = uncheckedConstraints.includes(entry.constraint);
      return renderConsulteeRow(entry.constraint, entry.consultees, {
        showActions,
        notRequired,
      });
    })
    .join("");

  const unassignedRows = unassigned
    .map(
      (c) => `
    <tr class="govuk-table__row">
      <td class="govuk-table__cell">Other</td>
      <td class="govuk-table__cell"><span>${c.name}</span></td>
      <td class="govuk-table__cell">${renderConsulteeStatus(c.status || "not_consulted")}</td>
      <td class="govuk-table__cell">${showActions ? `<a class="govuk-link" href="#">Remove</a>` : "&ndash;"}</td>
    </tr>`,
    )
    .join("");

  return `
    <section class="govuk-!-margin-top-7">
      <h2 class="govuk-heading-m">Assign consultees to each constraint</h2>
      <table class="govuk-table">
        <thead class="govuk-table__head">
          <tr class="govuk-table__row">
            <th class="govuk-table__header" scope="col">Constraint</th>
            <th class="govuk-table__header" scope="col">Consultee</th>
            <th class="govuk-table__header" scope="col">Status</th>
            <th class="govuk-table__header" scope="col">Action</th>
          </tr>
        </thead>
        <tbody class="govuk-table__body">
          ${constraintRows}
          ${unassignedRows}
        </tbody>
      </table>
    </section>`;
}

function renderEmptyTable() {
  return `
    <section class="govuk-!-margin-top-7">
      <h2 class="govuk-heading-m">Assign consultees to each constraint</h2>
      <table class="govuk-table">
        <thead class="govuk-table__head">
          <tr class="govuk-table__row">
            <th class="govuk-table__header" scope="col">Constraint</th>
            <th class="govuk-table__header" scope="col">Consultee</th>
            <th class="govuk-table__header" scope="col">Status</th>
            <th class="govuk-table__header" scope="col">Action</th>
          </tr>
        </thead>
        <tbody class="govuk-table__body">
          <tr class="govuk-table__row">
            <td class="govuk-table__cell" colspan="4">
              <strong>No reasons or constraints have been identified, so there are no suggested consultees.</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </section>`;
}

function renderAddConsulteeSection(options = {}) {
  const { expanded = false, searchQuery = "", showSuggestions = false } =
    options;
  const openAttr = expanded ? " open" : "";

  const suggestionsHtml = showSuggestions
    ? `
      <ul role="listbox" style="border: 1px solid #b1b4b6; list-style: none; padding: 0; margin-top: -1px; background: #fff; max-height: 200px; overflow-y: auto; position: absolute; width: 100%; z-index: 10; box-shadow: 0 2px 6px rgba(0,0,0,.15);">
        ${availableConsultees
          .map(
            (c, i) =>
              `<li style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f3f2f1;${i === 0 ? " background: #1d70b8; color: #fff;" : ""}">${c.name} (${c.role}, ${c.organisation})</li>`,
          )
          .join("")}
      </ul>`
    : "";

  return `
    <details class="govuk-details govuk-!-margin-top-4"${openAttr}>
      <summary class="govuk-details__summary">
        <span class="govuk-details__summary-text">Manually add a consultee</span>
      </summary>
      <div class="govuk-details__text">
        <div class="govuk-form-group">
          <label class="govuk-label govuk-label--s" for="consultee-search">
            Search for consultees
          </label>
          <span id="consultee-search-hint" class="govuk-hint">
            Start typing name, organisation or role
          </span>
          <div style="position: relative;">
            <input class="govuk-input" id="consultee-search" type="text" value="${searchQuery}" autocomplete="off" aria-describedby="consultee-search-hint">
            ${suggestionsHtml}
          </div>
        </div>
        <button class="govuk-button govuk-button--secondary" type="button">Add consultee</button>
      </div>
    </details>`;
}

function renderFormButtons(options = {}) {
  const { saveLabel = "Save" } = options;
  return `
    <div class="govuk-button-group govuk-!-margin-top-6">
      <button class="govuk-button" type="submit">${saveLabel}</button>
      <a class="govuk-button govuk-button--secondary" href="#">Back</a>
    </div>`;
}

// ---------------------------------------------------------------------------
// Default checked constraints (4 of 6 — Article 4 and Archaeological not checked)
// ---------------------------------------------------------------------------

const defaultChecked = [
  "Conservation area",
  "Listed building",
  "Tree preservation order",
  "Flood zone",
];

const allChecked = [
  "Conservation area",
  "Listed building",
  "Article 4 direction",
  "Tree preservation order",
  "Flood zone",
  "Archaeological priority area",
];

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Full page with auto-suggested consultees grouped by constraint. 4 of 6 constraints checked. */
export const InitialView = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Add and assign consultees</h1>

        ${renderConstraintCheckboxes(defaultChecked)}
        ${renderConsulteesTable(constraintConsulteeMap, unassignedConsultees)}
        ${renderAddConsulteeSection()}
        ${renderFormButtons()}
      </div>
    </div>`,
};

/** Empty state — no constraints identified, no suggested consultees. */
export const NoConstraintsIdentified = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Add and assign consultees</h1>

        <section class="govuk-!-margin-top-6">
          <h2 class="govuk-heading-m">Select constraints that require consultation</h2>
          <p class="govuk-body">Review the planning constraints and select which ones require consultation.</p>
          <p class="govuk-body govuk-!-color-secondary">No planning constraints have been identified for this application.</p>
        </section>

        ${renderEmptyTable()}
        ${renderAddConsulteeSection({ expanded: true })}
        ${renderFormButtons()}
      </div>
    </div>`,
};

/** 2 constraints unchecked — their rows show "Not required" status. */
export const SomeConstraintsUnchecked = {
  render: () => {
    const checked = [
      "Conservation area",
      "Listed building",
      "Tree preservation order",
      "Flood zone",
    ];
    const unchecked = ["Article 4 direction", "Archaeological priority area"];

    return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Add and assign consultees</h1>

        ${renderConstraintCheckboxes(checked)}
        ${renderConsulteesTable(constraintConsulteeMap, unassignedConsultees, { uncheckedConstraints: unchecked })}
        ${renderAddConsulteeSection()}
        ${renderFormButtons()}
      </div>
    </div>`;
  },
};

/** "Manually add a consultee" expanded with autocomplete search showing suggestions. */
export const AddConsulteeExpanded = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Add and assign consultees</h1>

        ${renderConstraintCheckboxes(defaultChecked)}
        ${renderConsulteesTable(constraintConsulteeMap, unassignedConsultees)}
        ${renderAddConsulteeSection({ expanded: true, searchQuery: "Hist", showSuggestions: true })}
        ${renderFormButtons()}
      </div>
    </div>`,
};

/** A consultee has just been added manually — appears in the "Other" row. */
export const ConsulteeJustAdded = {
  render: () => {
    const justAdded = {
      name: "Historic England",
      organisation: "Historic England",
      status: "not_consulted",
      origin: "external",
    };
    const updatedUnassigned = [...unassignedConsultees, justAdded];

    return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Add and assign consultees</h1>

        ${renderConstraintCheckboxes(defaultChecked)}
        ${renderConsulteesTable(constraintConsulteeMap, updatedUnassigned)}
        ${renderAddConsulteeSection()}
        ${renderFormButtons()}
      </div>
    </div>`;
  },
};

/** All constraints checked and all have consultees assigned. Ready to save. */
export const AllAssigned = {
  render: () => {
    // Fill in the two empty constraint slots
    const fullMap = constraintConsulteeMap.map((entry) => {
      if (entry.constraint === "Article 4 direction") {
        return {
          ...entry,
          consultees: [
            {
              name: "Conservation Officer",
              organisation: "Southwark Council",
              status: "not_consulted",
            },
          ],
        };
      }
      if (entry.constraint === "Archaeological priority area") {
        return {
          ...entry,
          consultees: [
            {
              name: "Historic England",
              organisation: "Historic England",
              status: "not_consulted",
            },
          ],
        };
      }
      return entry;
    });

    return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Add and assign consultees</h1>

        ${renderConstraintCheckboxes(allChecked)}
        ${renderConsulteesTable(fullMap, unassignedConsultees)}
        ${renderAddConsulteeSection()}
        ${renderFormButtons()}
      </div>
    </div>`;
  },
};

/** Task complete — consultees saved, status tag shown. */
export const Completed = {
  render: () => {
    const fullMap = constraintConsulteeMap.map((entry) => {
      if (entry.constraint === "Article 4 direction") {
        return {
          ...entry,
          consultees: [
            {
              name: "Conservation Officer",
              organisation: "Southwark Council",
              status: "not_consulted",
            },
          ],
        };
      }
      if (entry.constraint === "Archaeological priority area") {
        return {
          ...entry,
          consultees: [
            {
              name: "Historic England",
              organisation: "Historic England",
              status: "not_consulted",
            },
          ],
        };
      }
      return entry;
    });

    return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Add and assign consultees</h1>
        <p class="govuk-!-margin-bottom-4">${renderStatusTag("complete")}</p>

        ${renderConstraintCheckboxes(allChecked, { disabled: true })}
        ${renderConsulteesTable(fullMap, unassignedConsultees, { showActions: false })}
        ${renderAddConsulteeSection()}
        ${renderFormButtons()}
      </div>
    </div>`;
  },
};
