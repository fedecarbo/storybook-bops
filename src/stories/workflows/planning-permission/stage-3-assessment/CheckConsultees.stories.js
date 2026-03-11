/**
 * Check Consultees Consulted (Assessment) — the case officer confirms
 * that all statutory consultees have been consulted during assessment.
 *
 * Unlike Stage 2 consultation tasks (select, email, view responses),
 * this is a confirmation/review step. The page shows:
 * - A consultees table grouped by constraint (Constraint, Consultee, Status, Action)
 * - "Confirm as checked" button + "Add consultees" link + "Back" button
 * - After confirmation: success banner and read-only table
 *
 * This task appears in Stage 3 (Assessment) under "Check application".
 */
import { mockData } from "../../../helpers";

export default {
  title: "Workflows/Planning Permission/3. Assessment/Check Consultees",
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

const { constraints, consultees, consulteeResponses } = mockData;

// Map constraints to their assigned consultees (same structure as SelectConsultees)
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
    constraint: "Tree preservation order",
    consultees: consultees.filter((c) =>
      c.constraints.includes("Tree preservation order"),
    ),
  },
  {
    constraint: "Flood zone",
    consultees: consultees.filter((c) => c.constraints.includes("Flood zone")),
  },
];

const unassignedConsultees = consultees.filter(
  (c) => c.constraints.length === 0,
);

// ---------------------------------------------------------------------------
// Status tag helpers
// ---------------------------------------------------------------------------

const consulteeStatusMap = {
  not_consulted: { colour: "grey", label: "Not consulted" },
  not_assigned: { colour: "grey", label: "Not assigned" },
  sending: { colour: "grey", label: "Sending" },
  awaiting_response: { colour: "yellow", label: "Awaiting response" },
  no_response: { colour: "yellow", label: "Awaiting response" },
  failed: { colour: "red", label: "Failed" },
  responded: { colour: "green", label: "Responded" },
  complete: { colour: "green", label: "Responded" },
};

const responseSummaryMap = {
  approved: { colour: "green", label: "No objection" },
  amendments_needed: { colour: "yellow", label: "Amendments needed" },
  objected: { colour: "red", label: "Objection" },
};

function renderConsulteeStatus(status, summaryTag) {
  if (summaryTag && responseSummaryMap[summaryTag]) {
    const entry = responseSummaryMap[summaryTag];
    return `<span class="govuk-tag govuk-tag--${entry.colour}">${entry.label}</span>`;
  }
  const mapping = consulteeStatusMap[status] || {
    colour: "grey",
    label: status,
  };
  return `<span class="govuk-tag govuk-tag--${mapping.colour}">${mapping.label}</span>`;
}

// ---------------------------------------------------------------------------
// Table helpers
// ---------------------------------------------------------------------------

function renderConsulteeRow(constraint, consulteeList, options = {}) {
  const { showActions = true } = options;

  let consulteeCell;
  if (consulteeList.length) {
    const names = `<ul class="govuk-list" style="margin-bottom: 0;">
        ${consulteeList.map((c) => `<li><span>${c.name}</span></li>`).join("")}
       </ul>`;
    const assignLink = showActions
      ? `<div><a class="govuk-link" href="#">Assign another consultee</a></div>`
      : "";
    consulteeCell = names + assignLink;
  } else if (showActions) {
    consulteeCell = `<a class="govuk-link" href="#">Assign consultee</a>`;
  } else {
    consulteeCell = "&ndash;";
  }

  const statusCells = consulteeList.length
    ? `<ul class="govuk-list" style="margin-bottom: 0;">
        ${consulteeList.map((c) => `<li>${renderConsulteeStatus(c.status, c.summaryTag)}</li>`).join("")}
       </ul>`
    : `<ul class="govuk-list" style="margin-bottom: 0;">
        <li>${renderConsulteeStatus("not_assigned")}</li>
       </ul>`;

  let actionCell;
  if (!showActions) {
    actionCell = "&ndash;";
  } else if (consulteeList.length) {
    actionCell = `<ul class="govuk-list" style="margin-bottom: 0;">
      ${consulteeList.map(() => `<li><a class="govuk-link" href="#">Remove</a></li>`).join("")}
    </ul>`;
  } else {
    actionCell = "&ndash;";
  }

  return `
    <tr class="govuk-table__row">
      <td class="govuk-table__cell">${constraint}</td>
      <td class="govuk-table__cell">${consulteeCell}</td>
      <td class="govuk-table__cell">${statusCells}</td>
      <td class="govuk-table__cell">${actionCell}</td>
    </tr>`;
}

function renderConsulteesTable(constraintMap, unassigned = [], options = {}) {
  const { showActions = true } = options;

  const constraintRows = constraintMap
    .map((entry) =>
      renderConsulteeRow(entry.constraint, entry.consultees, { showActions }),
    )
    .join("");

  const unassignedRows = unassigned
    .map(
      (c) => `
    <tr class="govuk-table__row">
      <td class="govuk-table__cell">Other</td>
      <td class="govuk-table__cell"><span>${c.name}</span></td>
      <td class="govuk-table__cell">${renderConsulteeStatus(c.status, c.summaryTag)}</td>
      <td class="govuk-table__cell">&ndash;</td>
    </tr>`,
    )
    .join("");

  return `
    <h3 class="govuk-body">Assign consultees to each constraint</h3>
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
    </table>`;
}

function renderEmptyTable() {
  return `
    <h3 class="govuk-body">Assign consultees to each constraint</h3>
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
    </table>`;
}

// ---------------------------------------------------------------------------
// Main page renderer
// ---------------------------------------------------------------------------

function renderCheckConsulteesPage(options = {}) {
  const {
    constraintMap = constraintConsulteeMap,
    unassigned = unassignedConsultees,
    showActions = true,
    showForm = true,
    showCompletedBanner = false,
    isEmpty = false,
  } = options;

  const banner = showCompletedBanner
    ? `
      <div class="govuk-notification-banner govuk-notification-banner--success" role="alert"
           aria-labelledby="govuk-notification-banner-title" data-module="govuk-notification-banner">
        <div class="govuk-notification-banner__header">
          <h2 class="govuk-notification-banner__title" id="govuk-notification-banner-title">Success</h2>
        </div>
        <div class="govuk-notification-banner__content">
          <p class="govuk-notification-banner__heading">Check consultees consulted completed</p>
        </div>
      </div>`
    : "";

  const table = isEmpty
    ? renderEmptyTable()
    : renderConsulteesTable(constraintMap, unassigned, { showActions });

  const formButtons = showForm
    ? `
      <div class="govuk-button-group">
        <button class="govuk-button" type="submit" data-module="govuk-button">Confirm as checked</button>
        <a class="govuk-button govuk-button--secondary" href="#">Add consultees</a>
        <a class="govuk-button govuk-button--secondary" href="#">Back</a>
      </div>`
    : `
      <a class="govuk-button govuk-button--secondary" href="#">Back</a>`;

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${banner}
        <h1 class="govuk-heading-l">Confirm all consultees have been consulted</h1>
        ${table}
        ${formButtons}
      </div>
    </div>`;
}

// ===========================================================================
// STORIES
// ===========================================================================

/** Initial view — mixed consultation statuses. Some consultees awaiting response, some responded. Action links visible. */
export const InitialView = {
  render: () => renderCheckConsulteesPage(),
};

/** All responded — every consultee has a response with summary tags (No objection / Amendments needed / Objection). Ready to confirm. */
export const AllResponded = {
  render: () => {
    const respondedMap = constraintConsulteeMap.map((entry) => ({
      ...entry,
      consultees: entry.consultees.map((c) => {
        const response = consulteeResponses.find(
          (r) => r.consultee === c.name,
        );
        return {
          ...c,
          status: "responded",
          summaryTag: response ? response.summaryTag : "approved",
        };
      }),
    }));

    const respondedUnassigned = unassignedConsultees.map((c) => {
      const response = consulteeResponses.find((r) => r.consultee === c.name);
      return {
        ...c,
        status: "responded",
        summaryTag: response ? response.summaryTag : "approved",
      };
    });

    return renderCheckConsulteesPage({
      constraintMap: respondedMap,
      unassigned: respondedUnassigned,
    });
  },
};

/** Failed email — Environment Agency has "Failed" delivery status (red tag). Officer must resolve before confirming. */
export const WithFailedEmail = {
  render: () => {
    const failedMap = constraintConsulteeMap.map((entry) => ({
      ...entry,
      consultees: entry.consultees.map((c) => {
        if (c.name === "Environment Agency") {
          return { ...c, status: "failed" };
        }
        return c;
      }),
    }));

    return renderCheckConsulteesPage({ constraintMap: failedMap });
  },
};

/** Confirmed — success banner, read-only table (no action links), only "Back" button. */
export const Confirmed = {
  render: () => {
    const respondedMap = constraintConsulteeMap.map((entry) => ({
      ...entry,
      consultees: entry.consultees.map((c) => {
        const response = consulteeResponses.find(
          (r) => r.consultee === c.name,
        );
        return {
          ...c,
          status: "responded",
          summaryTag: response ? response.summaryTag : "approved",
        };
      }),
    }));

    const respondedUnassigned = unassignedConsultees.map((c) => {
      const response = consulteeResponses.find((r) => r.consultee === c.name);
      return {
        ...c,
        status: "responded",
        summaryTag: response ? response.summaryTag : "approved",
      };
    });

    return renderCheckConsulteesPage({
      constraintMap: respondedMap,
      unassigned: respondedUnassigned,
      showActions: false,
      showForm: false,
      showCompletedBanner: true,
    });
  },
};

/** No consultees — empty table when no constraints were identified. Only "Back" button. */
export const NoConsultees = {
  render: () =>
    renderCheckConsulteesPage({
      isEmpty: true,
      showForm: false,
    }),
};
