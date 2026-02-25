/**
 * Reusable HTML-string helpers for BOPS Storybook page layouts.
 *
 * Every function returns a plain HTML string (template literal).
 * Import what you need:
 *   import { wrapInPage, renderStatusTag, mockData } from '../helpers';
 */
import { mockData } from "./mockData.js";

// ---------------------------------------------------------------------------
// Status colour and label maps (canonical source — also used by StatusTags story)
// ---------------------------------------------------------------------------

export const statusColourMap = {
  approved: "green",
  auto_approved: "green",
  valid: "green",
  complies: "green",
  complete: "green",
  supportive: "green",
  not_started: "blue",
  new: "blue",
  no_response: "blue",
  review_not_started: "blue",
  not_consulted: "blue",
  none: "blue",
  in_progress: "light-blue",
  awaiting_response: "light-blue",
  to_be_determined: "light-blue",
  updated: "yellow",
  to_be_reviewed: "yellow",
  submitted: "yellow",
  neutral: "yellow",
  amendments_needed: "yellow",
  awaiting_changes: "yellow",
  refused: "red",
  removed: "red",
  invalid: "red",
  rejected: "red",
  objection: "red",
  failed: "red",
  cancelled: "red",
  does_not_comply: "red",
  optional: "grey",
  not_required: "grey",
  cannot_start_yet: "grey",
  checked: "green",
  review_complete: "green",
};

export const statusLabelMap = {
  approved: "Approved",
  auto_approved: "Auto approved",
  valid: "Valid",
  complies: "Complies",
  complete: "Complete",
  supportive: "Supportive",
  not_started: "Not started",
  new: "New",
  no_response: "No response",
  review_not_started: "Not started",
  not_consulted: "Not consulted",
  none: "None",
  in_progress: "In progress",
  awaiting_response: "Awaiting response",
  to_be_determined: "To be determined",
  updated: "Updated",
  to_be_reviewed: "To be reviewed",
  submitted: "Submitted",
  neutral: "Neutral",
  amendments_needed: "Amendments needed",
  awaiting_changes: "Awaiting changes",
  refused: "Refused",
  removed: "Removed",
  invalid: "Invalid",
  rejected: "Rejected",
  objection: "Objection",
  failed: "Failed",
  cancelled: "Cancelled",
  does_not_comply: "Does not comply",
  optional: "Optional",
  not_required: "Not required",
  cannot_start_yet: "Cannot start yet",
  checked: "Checked",
  review_complete: "Review complete",
};

// ---------------------------------------------------------------------------
// renderStatusTag
// ---------------------------------------------------------------------------

/**
 * Renders a GOV.UK status tag with the correct colour mapping.
 * @param {string} status
 * @returns {string} HTML
 */
export function renderStatusTag(status) {
  const colour = statusColourMap[status] || "grey";
  const label =
    statusLabelMap[status] || status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return `<strong class="govuk-tag govuk-tag--${colour} govuk-tag--status-${status}">${label}</strong>`;
}

// ---------------------------------------------------------------------------
// renderStatusIcon — inline SVGs for sidebar task icons
// ---------------------------------------------------------------------------

const statusIcons = {
  not_started: `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Not started"><circle cx="12" cy="12" r="12" fill="#bbd4ea"/></svg>`,
  in_progress: `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="In progress"><circle cx="12" cy="12" r="12" fill="#dbe6f4"/><path d="M7 12 H16" fill="none" stroke="#1f4d7a" stroke-width="3" stroke-linecap="round"/><path d="M13 8 L17 12 L13 16" fill="none" stroke="#1f4d7a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  complete: `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Completed"><circle cx="12" cy="12" r="12" fill="#1d70b8"/><path d="M8 12.5 L10.5 15 L16 9.5" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  cannot_start_yet: `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cannot start"><circle cx="12" cy="12" r="11" fill="none" stroke="#AAAAAA" stroke-width="2" stroke-dasharray="4 3"/><rect x="8" y="12" width="8" height="6" rx="1" fill="#888888"/><path d="M9.5 12 C9.5 9 10.5 8 12 8 C13.5 8 14.5 9 14.5 12" stroke="#888888" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
  action_required: `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Action required"><circle cx="12" cy="12" r="12" fill="#fff5c7"/><rect x="10.5" y="5" width="3" height="10" rx="1.5" fill="#6b5e00"/><circle cx="12" cy="18" r="1.5" fill="#6b5e00"/></svg>`,
};

/**
 * Renders an inline SVG icon for a task status (used in the sidebar).
 * @param {string} status
 * @returns {string} HTML
 */
export function renderStatusIcon(status) {
  const svg = statusIcons[status] || statusIcons.not_started;
  return `<span class="bops-sidebar__task-icon" aria-hidden="true">${svg}</span>`;
}

// ---------------------------------------------------------------------------
// renderBreadcrumbs
// ---------------------------------------------------------------------------

/**
 * Renders GOV.UK breadcrumbs. The last item renders as text (current page).
 * @param {Array<{text: string, href?: string}>} items
 * @returns {string} HTML
 */
export function renderBreadcrumbs(items) {
  if (!items || items.length === 0) return "";
  const lis = items
    .map((item, i) => {
      const isLast = i === items.length - 1;
      if (isLast || !item.href) {
        return `<li class="govuk-breadcrumbs__list-item" aria-current="page">${item.text}</li>`;
      }
      return `<li class="govuk-breadcrumbs__list-item"><a class="govuk-breadcrumbs__link" href="${item.href}">${item.text}</a></li>`;
    })
    .join("\n        ");
  return `
    <nav class="govuk-breadcrumbs" aria-label="Breadcrumb">
      <ol class="govuk-breadcrumbs__list">
        ${lis}
      </ol>
    </nav>`;
}

// ---------------------------------------------------------------------------
// renderHeader
// ---------------------------------------------------------------------------

/**
 * Renders the GOV.UK application header with service name and user info.
 * @param {object} [options]
 * @param {string} [options.councilName]
 * @param {string} [options.userName]
 * @param {boolean} [options.showUser=true]
 * @returns {string} HTML
 */
export function renderHeader(options = {}) {
  const {
    councilName = mockData.application.councilName,
    userName = mockData.people.caseOfficer.name,
    showUser = true,
  } = options;

  const userHtml = showUser
    ? `
      <div class="header-session-info">
        <div class="govuk-header__navigation-item">
          <strong>${userName}</strong>
        </div>
        <div class="govuk-header__navigation-item">
          <a href="#" class="govuk-header__link">Log out</a>
        </div>
      </div>`
    : "";

  return `
    <header class="govuk-header" role="banner" data-module="govuk-header">
      <div class="govuk-header__container">
        <div class="govuk-width-container">
          <a href="#" class="govuk-header__link govuk-header__link--homepage">
            <span class="govuk-header__service-name">${councilName}</span>
            <span class="govuk-header__product-name">Back Office Planning System</span>
          </a>
          ${userHtml}
        </div>
      </div>
    </header>`;
}

// ---------------------------------------------------------------------------
// renderHeaderBar
// ---------------------------------------------------------------------------

/**
 * Renders the BOPS header bar with application reference, address, and info link.
 * @param {object} [options]
 * @param {string} [options.reference]
 * @param {string} [options.address]
 * @param {boolean} [options.showInfoLink=true]
 * @returns {string} HTML
 */
export function renderHeaderBar(options = {}) {
  const {
    reference = mockData.application.reference,
    address = mockData.application.address.full,
    showInfoLink = true,
  } = options;

  const infoLink = showInfoLink
    ? `
      <div class="bops-header-bar__list--right">
        <li class="bops-header-bar__item">
          <a class="govuk-link" href="#">Application information</a>
        </li>
      </div>`
    : "";

  return `
    <div class="bops-header-bar">
      <ul class="bops-header-bar__list">
        <li class="bops-header-bar__item">
          <strong><a class="govuk-link" href="#">${reference}</a></strong>
        </li>
        <li class="bops-header-bar__item">${address}</li>
        ${infoLink}
      </ul>
    </div>`;
}

// ---------------------------------------------------------------------------
// renderProposalHeader
// ---------------------------------------------------------------------------

/**
 * Renders the proposal header section shown at the top of task pages.
 * @param {object} [options]
 * @param {string} [options.heading] - Page heading (e.g. task name)
 * @param {string} [options.caption] - Caption above heading
 * @param {string} [options.address]
 * @param {string} [options.reference]
 * @param {string} [options.status] - Application status for tag
 * @param {string} [options.description]
 * @returns {string} HTML
 */
export function renderProposalHeader(options = {}) {
  const {
    heading,
    caption,
    address = mockData.application.address.full,
    reference = mockData.application.reference,
    status,
    description = mockData.application.descriptionShort,
  } = options;

  const captionHtml = caption
    ? `<span class="govuk-caption-l">${caption}</span>`
    : "";
  const headingHtml = heading
    ? `<h1 class="govuk-heading-l">${captionHtml}${heading}</h1>`
    : "";
  const statusHtml = status
    ? `<p>${renderStatusTag(status)}</p>`
    : "";

  return `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        ${headingHtml}
        <p>
          <strong>${address}</strong><br>
          Application number: <strong>${reference}</strong>
        </p>
        ${statusHtml}
        <p>${description}</p>
      </div>
    </div>`;
}

// ---------------------------------------------------------------------------
// renderTaskListSection
// ---------------------------------------------------------------------------

/**
 * Renders a task list section with heading and task items.
 * Uses the app-task-list pattern from the source app.
 * @param {string} title - Section heading
 * @param {Array<{name: string, href?: string, status: string, hint?: string}>} tasks
 * @returns {string} HTML
 */
export function renderTaskListSection(title, tasks) {
  const items = tasks
    .map((task) => {
      const nameHtml = task.href
        ? `<a class="govuk-link" href="${task.href}">${task.name}</a>`
        : task.name;
      const hintHtml = task.hint
        ? `<div class="app-task-list__hint">${task.hint}</div>`
        : "";
      return `
      <li class="app-task-list__item">
        <span class="app-task-list__task-name">${nameHtml}${hintHtml}</span>
        <span class="app-task-list__task-tag">${renderStatusTag(task.status)}</span>
      </li>`;
    })
    .join("");

  return `
    <h2 class="app-task-list__section">${title}</h2>
    <ul class="app-task-list__items">
      ${items}
    </ul>`;
}

// ---------------------------------------------------------------------------
// renderSidebar
// ---------------------------------------------------------------------------

/**
 * Renders the sidebar navigation with task sections and status icons.
 * @param {Array<{title: string, tasks: Array<{name: string, slug: string, status: string}>}>} subsections
 * @param {string|null} [activeTaskSlug=null] - Slug of the currently active task
 * @returns {string} HTML
 */
export function renderSidebar(subsections, activeTaskSlug = null) {
  const sections = subsections
    .map((section) => {
      const items = section.tasks
        .map((task) => {
          const isActive = task.slug === activeTaskSlug;
          const activeClass = isActive ? " bops-sidebar__task--active" : "";
          const ariaCurrent = isActive ? ' aria-current="page"' : "";
          return `
          <li class="bops-sidebar__task${activeClass}">
            ${renderStatusIcon(task.status)}
            <a class="govuk-link" href="#"${ariaCurrent}>${task.name}</a>
          </li>`;
        })
        .join("");

      return `
        <h3>${section.title}</h3>
        <ul class="govuk-list govuk-list--spaced bops-sidebar__list">
          ${items}
        </ul>`;
    })
    .join("");

  return `
    <nav aria-label="Application tasks" class="bops-sidebar">
      ${sections}
    </nav>`;
}

// ---------------------------------------------------------------------------
// wrapInPage
// ---------------------------------------------------------------------------

/**
 * Wraps content in a full page layout with optional header, header bar,
 * breadcrumbs, heading, and sidebar.
 *
 * @param {string} content - The main content HTML
 * @param {object} [options]
 * @param {Array<{text: string, href?: string}>} [options.breadcrumbs]
 * @param {string} [options.heading] - Page heading (<h1>)
 * @param {string} [options.caption] - Caption above heading
 * @param {boolean} [options.showHeader=true]
 * @param {boolean|object} [options.showHeaderBar=false] - true or options for renderHeaderBar
 * @param {boolean|object} [options.withSidebar=false] - { subsections, activeTaskSlug } or false
 * @returns {string} HTML
 */
export function wrapInPage(content, options = {}) {
  const {
    breadcrumbs,
    heading,
    caption,
    showHeader = true,
    showHeaderBar = false,
    withSidebar = false,
  } = options;

  const headerHtml = showHeader ? renderHeader() : "";
  const headerBarHtml = showHeaderBar
    ? renderHeaderBar(typeof showHeaderBar === "object" ? showHeaderBar : {})
    : "";

  const breadcrumbsHtml = breadcrumbs ? renderBreadcrumbs(breadcrumbs) : "";

  const captionHtml = caption
    ? `<span class="govuk-caption-l">${caption}</span>`
    : "";
  const headingHtml = heading
    ? `<h1 class="govuk-heading-l">${captionHtml}${heading}</h1>`
    : "";

  const mainContent = `
        ${breadcrumbsHtml}
        ${headingHtml}
        ${content}`;

  if (withSidebar) {
    const sidebarOpts =
      typeof withSidebar === "object" ? withSidebar : {};
    const sidebarHtml = renderSidebar(
      sidebarOpts.subsections || mockData.validationTasks.subsections,
      sidebarOpts.activeTaskSlug || null
    );

    return `
      <div class="bops-headers bops-headers--sticky">
        ${headerHtml}
        ${headerBarHtml}
      </div>
      <div class="bops-fullwidth-container">
        ${sidebarHtml}
        <main class="govuk-main-wrapper" id="main-content" role="main">
          <div class="govuk-width-container">
            ${mainContent}
          </div>
        </main>
      </div>`;
  }

  return `
    <div class="bops-headers">
      ${headerHtml}
      ${headerBarHtml}
    </div>
    <div class="govuk-width-container">
      <main class="govuk-main-wrapper" id="main-content" role="main">
        ${mainContent}
      </main>
    </div>`;
}
