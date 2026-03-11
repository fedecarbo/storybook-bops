/**
 * Sidebar Navigation — a persistent sidebar showing all tasks with status icons,
 * replacing the GOV.UK task list pattern for back-office workflows.
 *
 * Stories show the real sidebar component inside a self-contained wireframe
 * layout that mirrors the actual application structure.
 */
import {
  renderSidebar,
  renderGovukTaskListSection,
  mockData,
} from "../../helpers";

export default {
  title: "Patterns/Sidebar Navigation",
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

function makeSubsections(statusOverrides = {}) {
  return mockData.validationTasks.subsections.map((section) => ({
    ...section,
    tasks: section.tasks.map((task) => ({
      ...task,
      status: statusOverrides[task.slug] || task.status,
    })),
  }));
}

/**
 * Renders the sidebar inside a self-contained wireframe that looks like
 * the real application layout without triggering the fullscreen body styles.
 */
function renderInLayout(sidebarHtml, options = {}) {
  const { activeLabel = "Check description" } = options;

  return `
    <div class="pattern-wireframe">
      <div class="pattern-wireframe__header">
        <span class="pattern-wireframe__logo">GOV.UK</span>
        <span class="pattern-wireframe__service">Back Office Planning System</span>
      </div>
      <div class="pattern-wireframe__bar">
        <span>${mockData.application.reference}</span>
        <span style="margin: 0 8px; opacity: 0.5;">|</span>
        <span>${mockData.application.address}</span>
      </div>
      <div class="pattern-wireframe__body">
        <div class="pattern-wireframe__sidebar">
          ${sidebarHtml}
        </div>
        <div class="pattern-wireframe__content">
          <h1 class="govuk-heading-l">${activeLabel}</h1>
          <div class="pattern-wireframe__placeholder">
            <div class="pattern-wireframe__placeholder-line" style="width: 85%"></div>
            <div class="pattern-wireframe__placeholder-line" style="width: 60%"></div>
            <div class="pattern-wireframe__placeholder-line" style="width: 72%"></div>
            <div style="height: 16px"></div>
            <div class="pattern-wireframe__placeholder-block"></div>
            <div style="height: 16px"></div>
            <div class="pattern-wireframe__placeholder-line" style="width: 45%"></div>
            <div class="pattern-wireframe__placeholder-line" style="width: 55%"></div>
            <div style="height: 20px"></div>
            <div class="pattern-wireframe__placeholder-btn"></div>
          </div>
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
      .pattern-wireframe__bar {
        background: #f3f2f1;
        padding: 8px 20px;
        font-size: 14px;
        color: #0b0c0c;
        border-bottom: 1px solid #b1b4b6;
      }
      .pattern-wireframe__body {
        display: grid;
        grid-template-columns: 300px 1fr;
        min-height: 520px;
      }
      .pattern-wireframe__sidebar {
        border-right: 1px solid #8eb8dc;
        background: #f4f8fb;
      }
      .pattern-wireframe__sidebar .bops-sidebar {
        padding: 16px;
        background: transparent;
        border-right: none;
      }
      .pattern-wireframe__content {
        padding: 30px;
        background: #fff;
      }
      .pattern-wireframe__placeholder-line {
        height: 12px;
        background: #dee0e2;
        border-radius: 3px;
        margin-bottom: 10px;
      }
      .pattern-wireframe__placeholder-block {
        height: 80px;
        background: #f3f2f1;
        border: 1px solid #dee0e2;
        border-radius: 4px;
      }
      .pattern-wireframe__placeholder-btn {
        width: 200px;
        height: 40px;
        background: #00703c;
        border-radius: 4px;
      }
    </style>`;
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const AllNotStarted = {
  name: "All not started",
  render: () => {
    const sidebar = renderSidebar(
      mockData.validationTasks.subsections,
      "check-description"
    );
    return renderInLayout(sidebar);
  },
};

export const MixedProgress = {
  name: "Mixed progress",
  render: () => {
    const subsections = makeSubsections({
      "review-documents": "complete",
      "check-and-request-documents": "complete",
      "check-red-line-boundary": "complete",
      "check-constraints": "complete",
      "check-description": "in_progress",
      "review-validation-requests": "cannot_start_yet",
      "send-validation-decision": "cannot_start_yet",
    });
    const sidebar = renderSidebar(subsections, "check-description");
    return renderInLayout(sidebar);
  },
};

export const AllComplete = {
  name: "All complete",
  render: () => {
    const allComplete = {};
    mockData.validationTasks.subsections.forEach((section) => {
      section.tasks.forEach((task) => {
        allComplete[task.slug] = "complete";
      });
    });
    const subsections = makeSubsections(allComplete);
    const sidebar = renderSidebar(subsections, "send-validation-decision");
    return renderInLayout(sidebar, { activeLabel: "Send validation decision" });
  },
};

export const WithActionRequired = {
  name: "With action required",
  render: () => {
    const subsections = makeSubsections({
      "review-documents": "complete",
      "check-and-request-documents": "action_required",
      "check-red-line-boundary": "complete",
      "check-constraints": "complete",
      "check-description": "complete",
      "check-fee": "in_progress",
      "review-validation-requests": "cannot_start_yet",
      "send-validation-decision": "cannot_start_yet",
    });
    const sidebar = renderSidebar(subsections, "check-fee");
    return renderInLayout(sidebar, { activeLabel: "Check fee" });
  },
};

export const WithCannotStartYet = {
  name: "With cannot start yet",
  render: () => {
    const subsections = makeSubsections({
      "confirm-cil": "cannot_start_yet",
      "check-eia": "cannot_start_yet",
      "check-ownership-certificate": "cannot_start_yet",
      "other-validation-requests": "cannot_start_yet",
      "review-validation-requests": "cannot_start_yet",
      "send-validation-decision": "cannot_start_yet",
    });
    const sidebar = renderSidebar(subsections, "check-description");
    return renderInLayout(sidebar);
  },
};

export const ComparisonWithTaskList = {
  name: "Comparison with GOV.UK task list",
  render: () => {
    const govukTaskList = mockData.validationTasks.subsections
      .map((section) => {
        const tasks = section.tasks.map((task) => ({
          name: task.name,
          href: "#",
          status:
            task.slug === "check-description" ? "in_progress" : "not_started",
        }));
        return renderGovukTaskListSection(section.title, tasks);
      })
      .join("");

    const sidebar = renderSidebar(
      mockData.validationTasks.subsections,
      "check-description"
    );

    return `
      <h2 class="govuk-heading-m">Pattern comparison</h2>
      <p class="govuk-body">The GOV.UK task list (left) sends users to a new page per task. The BOPS sidebar (right) keeps all tasks visible alongside the content.</p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 20px;">
        <div>
          <h3 class="govuk-heading-s" style="border-bottom: 3px solid #1d70b8; padding-bottom: 6px;">GOV.UK task list</h3>
          <div style="border: 1px solid #b1b4b6; padding: 20px; border-radius: 4px;">
            ${govukTaskList}
          </div>
        </div>
        <div>
          <h3 class="govuk-heading-s" style="border-bottom: 3px solid #1d70b8; padding-bottom: 6px;">BOPS sidebar</h3>
          <div style="border: 1px solid #b1b4b6; border-radius: 4px; background: #f4f8fb;">
            ${sidebar}
          </div>
        </div>
      </div>`;
  },
};
