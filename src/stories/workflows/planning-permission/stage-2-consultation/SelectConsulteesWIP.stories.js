/**
 * Select Consultees (WIP) — Redesigned with GOV.UK Summary Cards.
 *
 * Each "reason for consultation" (usually a planning constraint) is a Summary
 * Card. Card content uses Summary Lists: 2 rows per consultee (name + type),
 * with "Change | Remove" row actions and an "Add another consultee" link at
 * the bottom. Card-level action is "Mark as not required" only.
 *
 * Design informed by GOV.UK Summary Card conventions and the BOPS
 * Requirements assessment pattern.
 */
import { mockData, renderStatusTag } from "../../../helpers";

export default {
  title:
    "Workflows/Planning Permission/2. Consultation/Select Consultees (WIP)",
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

const { consultationReasons, availableConstraints } = mockData;

// ---------------------------------------------------------------------------
// Shared helpers
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

function renderFormButtons(options = {}) {
  const { saveLabel = "Save and continue", showBack = true } = options;
  return `
    <div class="govuk-button-group govuk-!-margin-top-6">
      <button class="govuk-button" type="submit">${saveLabel}</button>
      ${showBack ? `<a class="govuk-button govuk-button--secondary" href="#">Back</a>` : ""}
    </div>`;
}

function renderOriginTag(origin) {
  const colour = origin === "internal" ? "blue" : "purple";
  const label = origin === "internal" ? "Internal" : "External";
  return `<strong class="govuk-tag govuk-tag--${colour}">${label}</strong>`;
}

// ---------------------------------------------------------------------------
// Card content — assigned (name + type per consultee, "Add another" at bottom)
// ---------------------------------------------------------------------------

function renderAssignedContent(reason, options = {}) {
  const { readOnly = false } = options;
  const multiple = reason.consultees.length > 1;

  const blocks = reason.consultees
    .map((c, i) => {
      const label = multiple ? `Consultee ${i + 1}` : "Consultee";
      const actions = readOnly
        ? ""
        : `<dd class="govuk-summary-list__actions">
            <ul class="govuk-summary-list__actions-list">
              <li class="govuk-summary-list__actions-list-item">
                <a class="govuk-link" href="#">Change<span class="govuk-visually-hidden"> ${c.name}</span></a>
              </li>
              <li class="govuk-summary-list__actions-list-item">
                <a class="govuk-link" href="#">Remove<span class="govuk-visually-hidden"> ${c.name}</span></a>
              </li>
            </ul>
           </dd>`;

      return `
        <dl class="govuk-summary-list">
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key govuk-!-width-one-third">${label}</dt>
            <dd class="govuk-summary-list__value">${c.name}</dd>
            ${actions}
          </div>
        </dl>`;
    })
    .join(
      `<hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">`,
    );

  const addLink = readOnly
    ? ""
    : `<p class="govuk-body govuk-!-margin-top-4">
        <a class="govuk-link" href="#">Add another consultee<span class="govuk-visually-hidden"> for ${reason.title}</span></a>
       </p>`;

  return `${blocks}${addLink}`;
}

// ---------------------------------------------------------------------------
// Card content — unassigned (GDS "missing value" link pattern)
// ---------------------------------------------------------------------------

function renderUnassignedContent(reason, options = {}) {
  const { readOnly = false } = options;
  const val = readOnly
    ? `<span class="govuk-hint govuk-!-margin-bottom-0">Not assigned</span>`
    : `<a class="govuk-link" href="#">Assign consultee<span class="govuk-visually-hidden"> for ${reason.title}</span></a>`;

  return `
    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key govuk-!-width-one-third">Consultee</dt>
        <dd class="govuk-summary-list__value">${val}</dd>
      </div>
    </dl>`;
}

// ---------------------------------------------------------------------------
// Card rendering
// ---------------------------------------------------------------------------

function renderNotRequiredCard(reason, options = {}) {
  const { readOnly = false } = options;
  return `
    <div class="govuk-summary-card" style="opacity: 0.6;">
      <div class="govuk-summary-card__title-wrapper">
        <h2 class="govuk-summary-card__title">
          ${reason.title}
          <strong class="govuk-tag govuk-tag--grey govuk-!-margin-left-2">Not required</strong>
        </h2>
        ${
          readOnly
            ? ""
            : `<ul class="govuk-summary-card__actions">
            <li class="govuk-summary-card__action">
              <a class="govuk-link" href="#">Undo<span class="govuk-visually-hidden"> not required for ${reason.title}</span></a>
            </li>
          </ul>`
        }
      </div>
      <div class="govuk-summary-card__content">
        <dl class="govuk-summary-list">
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key govuk-!-width-one-third">Consultee</dt>
            <dd class="govuk-summary-list__value"><span class="govuk-hint govuk-!-margin-bottom-0">Not required</span></dd>
          </div>
        </dl>
      </div>
    </div>`;
}

function renderReasonCard(reason, options = {}) {
  const { readOnly = false } = options;

  if (reason.status === "not_required") {
    return renderNotRequiredCard(reason, options);
  }

  const cardAction = readOnly
    ? ""
    : `<ul class="govuk-summary-card__actions">
        <li class="govuk-summary-card__action">
          <a class="govuk-link" href="#">Mark as not required<span class="govuk-visually-hidden"> for ${reason.title}</span></a>
        </li>
      </ul>`;

  const content =
    reason.status === "assigned" && reason.consultees.length > 0
      ? renderAssignedContent(reason, options)
      : renderUnassignedContent(reason, options);

  return `
    <div class="govuk-summary-card">
      <div class="govuk-summary-card__title-wrapper">
        <h2 class="govuk-summary-card__title">${reason.title}</h2>
        ${cardAction}
      </div>
      <div class="govuk-summary-card__content">
        ${content}
      </div>
    </div>`;
}

function renderCardList(reasons, options = {}) {
  return reasons.map((r) => renderReasonCard(r, options)).join("");
}

// ---------------------------------------------------------------------------
// Add a reason section
// ---------------------------------------------------------------------------

function renderAddReasonSection(options = {}) {
  const { expanded = false, searchQuery = "", showSuggestions = false } =
    options;

  if (!expanded) {
    return `
      <div class="govuk-!-margin-top-6">
        <button class="govuk-button govuk-button--secondary" type="button">Add a reason for consultation</button>
      </div>`;
  }

  const suggestionsHtml = showSuggestions
    ? `<ul role="listbox" style="border: 1px solid #b1b4b6; list-style: none; padding: 0; margin-top: -1px; background: #fff; max-height: 200px; overflow-y: auto; position: absolute; width: 100%; z-index: 10; box-shadow: 0 2px 6px rgba(0,0,0,.15);">
        ${availableConstraints
          .filter((c) =>
            c.type.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .map(
            (c, i) =>
              `<li style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f3f2f1;${i === 0 ? " background: #1d70b8; color: #fff;" : ""}">${c.type} <span style="color: ${i === 0 ? "#fff" : "#505a5f"}; font-size: 14px;">(${c.category})</span></li>`,
          )
          .join("")}
       </ul>`
    : "";

  return `
    <div class="govuk-!-margin-top-6">
      <h2 class="govuk-heading-m">Add a reason for consultation</h2>
      <div class="govuk-form-group">
        <label class="govuk-label" for="add-reason">
          Reason for consultation
        </label>
        <div id="add-reason-hint" class="govuk-hint">
          Search for a planning constraint or enter a custom reason
        </div>
        <div style="position: relative;">
          <input class="govuk-input" id="add-reason" type="text" value="${searchQuery}" autocomplete="off" aria-describedby="add-reason-hint">
          ${suggestionsHtml}
        </div>
      </div>
      <div class="govuk-button-group">
        <button class="govuk-button govuk-button--secondary" type="button">Add reason</button>
        <a class="govuk-link" href="#">Cancel</a>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Pre-populated cards for 6 detected constraints. 4 assigned, 2 unassigned. */
export const InitialView = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Add and assign consultees</h1>
        <p class="govuk-body">Review the reasons for consultation below. Each reason has been automatically identified from the application's planning constraints. Assign a consultee to each reason, or mark it as not required.</p>

        ${renderCardList(consultationReasons)}
        ${renderAddReasonSection()}
        ${renderFormButtons()}
      </div>
    </div>`,
};

/** No constraints detected — empty state with guidance. */
export const NoConstraintsIdentified = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Add and assign consultees</h1>

        <div class="govuk-inset-text">
          No planning constraints have been automatically identified for this application. You can still add reasons for consultation manually using the button below.
        </div>

        ${renderAddReasonSection({ expanded: true })}
        ${renderFormButtons()}
      </div>
    </div>`,
};

/** Two reasons marked as not required — greyed out with "Undo" option. */
export const ReasonMarkedNotRequired = {
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

    return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Add and assign consultees</h1>
        <p class="govuk-body">Review the reasons for consultation below. Each reason has been automatically identified from the application's planning constraints. Assign a consultee to each reason, or mark it as not required.</p>

        ${renderCardList(reasons)}
        ${renderAddReasonSection()}
        ${renderFormButtons()}
      </div>
    </div>`;
  },
};

/** "Add a reason" form expanded with search query and suggestions. */
export const AddReasonExpanded = {
  render: () => `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Add and assign consultees</h1>
        <p class="govuk-body">Review the reasons for consultation below. Each reason has been automatically identified from the application's planning constraints. Assign a consultee to each reason, or mark it as not required.</p>

        ${renderCardList(consultationReasons)}
        ${renderAddReasonSection({ expanded: true, searchQuery: "Eco", showSuggestions: true })}
        ${renderFormButtons()}
      </div>
    </div>`,
};

/** Previously-unassigned card now has a consultee assigned. */
export const ConsulteeAssigned = {
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

    return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Add and assign consultees</h1>
        <p class="govuk-body">Review the reasons for consultation below. Each reason has been automatically identified from the application's planning constraints. Assign a consultee to each reason, or mark it as not required.</p>

        <div class="govuk-notification-banner govuk-notification-banner--success" role="alert" aria-labelledby="govuk-notification-banner-title" data-module="govuk-notification-banner">
          <div class="govuk-notification-banner__header">
            <h2 class="govuk-notification-banner__title" id="govuk-notification-banner-title">Success</h2>
          </div>
          <div class="govuk-notification-banner__content">
            <p class="govuk-notification-banner__heading">Conservation Officer has been assigned to Article 4 direction.</p>
          </div>
        </div>

        ${renderCardList(reasons)}
        ${renderAddReasonSection()}
        ${renderFormButtons()}
      </div>
    </div>`;
  },
};

/** All cards have consultees assigned or are marked not required. */
export const AllAssigned = {
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

    return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Add and assign consultees</h1>
        <p class="govuk-body">Review the reasons for consultation below. Each reason has been automatically identified from the application's planning constraints. Assign a consultee to each reason, or mark it as not required.</p>

        ${renderCardList(reasons)}
        ${renderAddReasonSection()}
        ${renderFormButtons()}
      </div>
    </div>`;
  },
};

/** Task complete — read-only view with status tag. */
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

    return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        ${renderPageBreadcrumbs()}
        <h1 class="govuk-heading-l">Add and assign consultees</h1>
        <p class="govuk-!-margin-bottom-4">${renderStatusTag("complete")}</p>

        ${renderCardList(reasons, { readOnly: true })}

        <div class="govuk-!-margin-top-6">
          <a class="govuk-link" href="#">Back to task list</a>
        </div>
      </div>
    </div>`;
  },
};
