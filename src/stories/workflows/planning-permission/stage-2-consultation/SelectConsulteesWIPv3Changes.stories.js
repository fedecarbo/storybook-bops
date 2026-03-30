/**
 * Select Consultees (WIPv3 changes) — Fixes from thorough UX review.
 *
 * Changes from WIPv3:
 * 1. Button: "Confirm consultees" (not "Confirm and send emails" — separate task)
 * 2. Heading: "Add and assign consultees" (matches task list name)
 * 3. Not-needed cards: no content rows, just tag in title — less redundancy
 * 4. Detail page: removed opacity:0.5 on not-needed state
 * 5. AddNew: simplified to just consultee search (no reason search — can't add constraints)
 * 6. Manually-added consultees shown under "Other" card on overview
 * 7. New story: overview with success banner after returning from detail page
 * 8. Detail page: "Add another consultee" heading when consultees already exist
 * 9. Empty state: no submit button when there's nothing to confirm
 * 10. Removed dead cardStyle variable
 * 11. renderSuccessBanner now used in a story
 * 12. Breadcrumb matches heading
 * 13. "Add a consultee" link (not "Add another consultation" — can't add constraints)
 */
import { mockData, renderStatusTag } from "../../../helpers";

export default {
  title:
    "Workflows/Planning Permission/2. Consultation/Select Consultees (WIPv3 changes)",
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

const { consultationReasons, availableConsultees } = mockData;

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function renderPageBreadcrumbs(
  current = "Add and assign consultees",
) {
  return `
    <nav class="govuk-breadcrumbs" aria-label="Breadcrumb">
      <ol class="govuk-breadcrumbs__list">
        <li class="govuk-breadcrumbs__list-item"><a class="govuk-breadcrumbs__link" href="#">Home</a></li>
        <li class="govuk-breadcrumbs__list-item"><a class="govuk-breadcrumbs__link" href="#">Application</a></li>
        <li class="govuk-breadcrumbs__list-item"><a class="govuk-breadcrumbs__link" href="#">Consultation</a></li>
        <li class="govuk-breadcrumbs__list-item" aria-current="page">${current}</li>
      </ol>
    </nav>`;
}

function renderBackLink(text = "Back") {
  return `<a class="govuk-back-link" href="#">${text}</a>`;
}

function renderFormButtons(options = {}) {
  const {
    primaryLabel = "Confirm consultees",
    showBack = true,
  } = options;
  return `
    <div class="govuk-button-group govuk-!-margin-top-6">
      <button class="govuk-button" type="submit">${primaryLabel}</button>
      ${showBack ? `<a class="govuk-button govuk-button--secondary" href="#">Back</a>` : ""}
    </div>`;
}

function renderSuccessBanner(message) {
  return `
    <div class="govuk-notification-banner govuk-notification-banner--success" role="alert" aria-labelledby="govuk-notification-banner-title" data-module="govuk-notification-banner">
      <div class="govuk-notification-banner__header">
        <h2 class="govuk-notification-banner__title" id="govuk-notification-banner-title">Success</h2>
      </div>
      <div class="govuk-notification-banner__content">
        <p class="govuk-notification-banner__heading">${message}</p>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Page 1: Overview — Summary Cards
// ---------------------------------------------------------------------------

function renderReasonCard(reason, options = {}) {
  const { readOnly = false } = options;

  // Card-level action
  const cardAction = readOnly
    ? ""
    : `<ul class="govuk-summary-card__actions">
        <li class="govuk-summary-card__action">
          <a class="govuk-link" href="#">Change<span class="govuk-visually-hidden"> ${reason.title}</span></a>
        </li>
      </ul>`;

  // "Not needed" — tag in title, no content rows needed
  if (reason.status === "not_required") {
    return `
    <div class="govuk-summary-card">
      <div class="govuk-summary-card__title-wrapper">
        <h2 class="govuk-summary-card__title">
          ${reason.title}
          <strong class="govuk-tag govuk-tag--grey govuk-!-margin-left-2">Not needed</strong>
        </h2>
        ${cardAction}
      </div>
    </div>`;
  }

  // Build summary list rows
  let consulteeRows = "";

  if (!reason.consultees || reason.consultees.length === 0) {
    // Unassigned — GDS: missing value = link to provide it
    const assignLink = readOnly
      ? `<span class="govuk-hint govuk-!-margin-bottom-0">Not assigned</span>`
      : `<a class="govuk-link" href="#">Assign consultee<span class="govuk-visually-hidden"> for ${reason.title}</span></a>`;
    consulteeRows = `
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">Consultee</dt>
        <dd class="govuk-summary-list__value">${assignLink}</dd>
      </div>`;
  } else {
    // Assigned — numbered labels if multiple
    consulteeRows = reason.consultees
      .map((c, i) => {
        const label =
          reason.consultees.length > 1 ? `Consultee ${i + 1}` : "Consultee";
        return `
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">${label}</dt>
        <dd class="govuk-summary-list__value">${c.name}, ${c.organisation}</dd>
      </div>`;
      })
      .join("");
  }

  return `
    <div class="govuk-summary-card">
      <div class="govuk-summary-card__title-wrapper">
        <h2 class="govuk-summary-card__title">${reason.title}</h2>
        ${cardAction}
      </div>
      <div class="govuk-summary-card__content">
        <dl class="govuk-summary-list">
          ${consulteeRows}
        </dl>
      </div>
    </div>`;
}

function renderOtherCard(otherConsultees, options = {}) {
  const { readOnly = false } = options;
  if (!otherConsultees || otherConsultees.length === 0) return "";

  const consulteeRows = otherConsultees
    .map((c, i) => {
      const label =
        otherConsultees.length > 1 ? `Consultee ${i + 1}` : "Consultee";
      return `
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">${label}</dt>
        <dd class="govuk-summary-list__value">${c.name}, ${c.organisation}</dd>
      </div>`;
    })
    .join("");

  const cardAction = readOnly
    ? ""
    : `<ul class="govuk-summary-card__actions">
        <li class="govuk-summary-card__action">
          <a class="govuk-link" href="#">Change<span class="govuk-visually-hidden"> other consultees</span></a>
        </li>
      </ul>`;

  return `
    <div class="govuk-summary-card">
      <div class="govuk-summary-card__title-wrapper">
        <h2 class="govuk-summary-card__title">Other</h2>
        ${cardAction}
      </div>
      <div class="govuk-summary-card__content">
        <dl class="govuk-summary-list">
          ${consulteeRows}
        </dl>
      </div>
    </div>`;
}

function renderOverviewPage(reasons, options = {}) {
  const { readOnly = false, banner = "", otherConsultees = [] } = options;

  const statusTag = readOnly
    ? `<p class="govuk-!-margin-bottom-4">${renderStatusTag("complete")}</p>`
    : "";

  const intro = readOnly
    ? ""
    : `<p class="govuk-body">Consultees have been automatically matched to this application's planning constraints. Check the assignments are correct, make any changes, then confirm.</p>`;

  const cards = reasons.map((r) => renderReasonCard(r, options)).join("");
  const otherCardHtml = renderOtherCard(otherConsultees, options);

  const addLink = readOnly
    ? ""
    : `<p class="govuk-body govuk-!-margin-top-4">
        <a class="govuk-link" href="#">Add a consultee</a>
      </p>`;

  const formButtons = readOnly
    ? `<div class="govuk-!-margin-top-6"><a class="govuk-link" href="#">Back to task list</a></div>`
    : renderFormButtons();

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Add and assign consultees</h1>
        ${banner}
        ${statusTag}
        ${intro}
        ${cards}
        ${otherCardHtml}
        ${addLink}
        ${formButtons}
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Page 2: Detail page
// ---------------------------------------------------------------------------

function renderConsulteeDetails(consultee) {
  return `
    <dl class="govuk-summary-list govuk-!-margin-bottom-4">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">Name</dt>
        <dd class="govuk-summary-list__value">${consultee.name}</dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">Organisation</dt>
        <dd class="govuk-summary-list__value">${consultee.organisation}</dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">Email</dt>
        <dd class="govuk-summary-list__value">${consultee.email}</dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">Type</dt>
        <dd class="govuk-summary-list__value">
          <strong class="govuk-tag govuk-tag--${consultee.origin === "internal" ? "blue" : "purple"}">${consultee.origin === "internal" ? "Internal" : "External"}</strong>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">Role</dt>
        <dd class="govuk-summary-list__value">${consultee.role}</dd>
      </div>
    </dl>
    <p class="govuk-body">
      <a class="govuk-link" href="#">Remove<span class="govuk-visually-hidden"> ${consultee.name}</span></a>
    </p>`;
}

function renderSearchSection(options = {}) {
  const { searchQuery = "", showSuggestions = false, hasExisting = false } =
    options;

  const heading = hasExisting
    ? "Add another consultee"
    : "Assign a consultee";

  const suggestionsHtml = showSuggestions
    ? `<ul role="listbox" style="border: 1px solid #b1b4b6; list-style: none; padding: 0; margin-top: -1px; background: #fff; max-height: 200px; overflow-y: auto; position: absolute; width: 100%; z-index: 10; box-shadow: 0 2px 6px rgba(0,0,0,.15);">
        ${availableConsultees
          .map(
            (c, i) =>
              `<li style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f3f2f1;${i === 0 ? " background: #1d70b8; color: #fff;" : ""}">
                <strong>${c.name}</strong><br>
                <span style="font-size: 14px; color: ${i === 0 ? "#fff" : "#505a5f"};">${c.role}, ${c.organisation}</span>
              </li>`,
          )
          .join("")}
       </ul>`
    : "";

  return `
    <h2 class="govuk-heading-m">${heading}</h2>
    <div class="govuk-form-group">
      <label class="govuk-label" for="consultee-search">
        Search for a consultee
      </label>
      <div id="consultee-search-hint" class="govuk-hint">
        Search by name, organisation or role
      </div>
      <div style="position: relative;">
        <input class="govuk-input" id="consultee-search" type="text" value="${searchQuery}" autocomplete="off" aria-describedby="consultee-search-hint">
        ${suggestionsHtml}
      </div>
    </div>
    <button class="govuk-button govuk-button--secondary" type="button">Assign</button>`;
}

function renderNotNeededCheckbox(checked = false) {
  return `
    <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
    <div class="govuk-checkboxes" data-module="govuk-checkboxes">
      <div class="govuk-checkboxes__item">
        <input class="govuk-checkboxes__input" id="not-needed" name="not-needed" type="checkbox" value="true"${checked ? " checked" : ""}>
        <label class="govuk-label govuk-checkboxes__label" for="not-needed">
          Consultation is not needed for this constraint
        </label>
      </div>
    </div>`;
}

function renderDetailPage(reason, options = {}) {
  const {
    showSearch = true,
    searchQuery = "",
    showSuggestions = false,
    notNeededChecked = false,
    banner = "",
  } = options;

  // Add a consultee (not tied to a constraint — goes under "Other")
  if (!reason) {
    return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        ${renderBackLink()}
        <h1 class="govuk-heading-l">Add a consultee</h1>
        <p class="govuk-body">Search for a consultee to add. They will not be linked to a specific constraint.</p>

        ${renderSearchSection({ searchQuery, showSuggestions })}

        <div class="govuk-button-group govuk-!-margin-top-6">
          <button class="govuk-button" type="submit">Save and return</button>
        </div>
      </div>
    </div>`;
  }

  // Existing constraint
  const hasExisting = reason.consultees && reason.consultees.length > 0;

  const consulteeBlocks = hasExisting
    ? `<h2 class="govuk-heading-m">Assigned consultees</h2>
       ${reason.consultees.map((c) => renderConsulteeDetails(c)).join('<hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">')}`
    : `<div class="govuk-inset-text">No consultees have been assigned to this constraint. Use the search below to find and assign one.</div>`;

  const searchHtml =
    showSearch && !notNeededChecked
      ? renderSearchSection({ searchQuery, showSuggestions, hasExisting })
      : "";

  const disabledNote = notNeededChecked
    ? `<div class="govuk-inset-text govuk-!-margin-top-4">Consultation is not needed for this constraint. Uncheck the box above to assign consultees.</div>`
    : "";

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        ${renderBackLink()}
        ${banner}
        <h1 class="govuk-heading-l">${reason.title}</h1>
        <p class="govuk-body">${reason.subtitle}</p>
        <p class="govuk-hint">Automatically identified from planning constraints</p>

        ${consulteeBlocks}

        ${searchHtml}

        ${renderNotNeededCheckbox(notNeededChecked)}
        ${disabledNote}

        <div class="govuk-button-group govuk-!-margin-top-6">
          <button class="govuk-button" type="submit">Save and return</button>
        </div>
      </div>
    </div>`;
}

// ===========================================================================
// Stories — Page 1: Overview
// ===========================================================================

/** Pre-populated Summary Cards for 6 detected constraints. 4 assigned, 2 unassigned. */
export const InitialView = {
  render: () => renderOverviewPage(consultationReasons),
};

/** Two constraints marked as not needed — clean cards with tag, no content rows. */
export const SomeNotNeeded = {
  render: () => {
    const reasons = consultationReasons.map((r) => {
      if (
        r.id === "article-4-direction" ||
        r.id === "archaeological-priority-area"
      ) {
        return { ...r, status: "not_required" };
      }
      return r;
    });
    return renderOverviewPage(reasons);
  },
};

/** All constraints either assigned or marked as not needed. */
export const AllCovered = {
  render: () => {
    const reasons = consultationReasons.map((r) => {
      if (r.id === "article-4-direction") {
        return {
          ...r,
          status: "assigned",
          consultees: [
            {
              name: "Conservation Officer",
              organisation: "Southwark Council",
              email: "conservation@southwark.gov.uk",
              origin: "internal",
              role: "Conservation and design",
            },
          ],
        };
      }
      if (r.id === "archaeological-priority-area") {
        return {
          ...r,
          status: "assigned",
          consultees: [
            {
              name: "Historic England",
              organisation: "Historic England",
              email: "london@historicengland.org.uk",
              origin: "external",
              role: "Statutory consultee",
            },
          ],
        };
      }
      return r;
    });
    return renderOverviewPage(reasons);
  },
};

/** Returning from detail page after assigning a consultee — success banner shown. */
export const AfterAssignment = {
  render: () => {
    const reasons = consultationReasons.map((r) => {
      if (r.id === "article-4-direction") {
        return {
          ...r,
          status: "assigned",
          consultees: [
            {
              name: "Conservation Officer",
              organisation: "Southwark Council",
              email: "conservation@southwark.gov.uk",
              origin: "internal",
              role: "Conservation and design",
            },
          ],
        };
      }
      return r;
    });
    return renderOverviewPage(reasons, {
      banner: renderSuccessBanner(
        "Conservation Officer has been assigned to Article 4 direction.",
      ),
    });
  },
};

/** Task complete — read-only view, no actions. */
export const Completed = {
  render: () => {
    const reasons = consultationReasons.map((r) => {
      if (r.id === "article-4-direction") {
        return { ...r, status: "not_required" };
      }
      if (r.id === "archaeological-priority-area") {
        return {
          ...r,
          status: "assigned",
          consultees: [
            {
              name: "Historic England",
              organisation: "Historic England",
              email: "london@historicengland.org.uk",
              origin: "external",
              role: "Statutory consultee",
            },
          ],
        };
      }
      return r;
    });
    return renderOverviewPage(reasons, { readOnly: true });
  },
};

/** Overview with a manually-added consultee under "Other". */
export const WithOtherConsultee = {
  render: () => {
    return renderOverviewPage(consultationReasons, {
      otherConsultees: [
        {
          name: "Highways Authority",
          organisation: "Transport for London",
          email: "highways@tfl.gov.uk",
          origin: "external",
          role: "Highways",
        },
      ],
    });
  },
};

/** No constraints identified — empty state with add link, no confirm button. */
export const NoConstraintsIdentified = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Add and assign consultees</h1>

        <div class="govuk-inset-text">
          No planning constraints have been identified for this application. You can still add consultees manually.
        </div>

        <p class="govuk-body">
          <a class="govuk-link" href="#">Add a consultee</a>
        </p>

        <div class="govuk-button-group govuk-!-margin-top-6">
          <a class="govuk-button govuk-button--secondary" href="#">Back</a>
        </div>
      </div>
    </div>`,
};

// ===========================================================================
// Stories — Page 2: Detail page (edit existing or add new)
// ===========================================================================

/** Existing constraint with one consultee — heading says "Add another consultee". */
export const ManageAssigned = {
  render: () => {
    const reason = consultationReasons.find(
      (r) => r.id === "conservation-area",
    );
    return renderDetailPage(reason);
  },
};

/** Existing constraint with no consultee — heading says "Assign a consultee". */
export const ManageUnassigned = {
  render: () => {
    const reason = consultationReasons.find(
      (r) => r.id === "article-4-direction",
    );
    return renderDetailPage(reason);
  },
};

/** Existing constraint with search results dropdown visible. */
export const ManageSearchExpanded = {
  render: () => {
    const reason = consultationReasons.find(
      (r) => r.id === "article-4-direction",
    );
    return renderDetailPage(reason, {
      searchQuery: "Hist",
      showSuggestions: true,
    });
  },
};

/** Existing constraint with two consultees (Flood zone). */
export const ManageMultipleConsultees = {
  render: () => {
    const reason = consultationReasons.find((r) => r.id === "flood-zone");
    return renderDetailPage(reason);
  },
};

/** Existing constraint marked as "consultation not needed" — no opacity, just inset text. */
export const ManageNotNeeded = {
  render: () => {
    const reason = consultationReasons.find(
      (r) => r.id === "article-4-direction",
    );
    return renderDetailPage(reason, { notNeededChecked: true });
  },
};

/** Add a consultee (not tied to a constraint) — empty search. */
export const AddConsultee = {
  render: () => renderDetailPage(null),
};

/** Add a consultee — search with results showing. */
export const AddConsulteeWithSearch = {
  render: () =>
    renderDetailPage(null, { searchQuery: "Hist", showSuggestions: true }),
};
