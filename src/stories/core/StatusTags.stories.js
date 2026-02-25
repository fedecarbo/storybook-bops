/**
 * Status tags indicate the current state of tasks, applications, and workflow items.
 * Built on the GOV.UK tag component with BOPS-specific colour mappings.
 *
 * Colour mapping:
 * - **Green**: approved, valid, complies, complete
 * - **Blue**: not_started, new, no_response
 * - **Light blue**: in_progress, awaiting_response
 * - **Yellow**: updated, amendments_needed, submitted
 * - **Red**: refused, invalid, rejected, cancelled
 * - **Grey**: optional, not_required
 */
import { renderStatusTag, statusColourMap } from "../helpers";

export default {
  title: "Core/Status Tags",
  argTypes: {
    status: {
      control: "select",
      options: Object.keys(statusColourMap),
    },
  },
};

export const Interactive = {
  args: { status: "not_started" },
  render: ({ status }) => renderStatusTag(status),
};

export const AllStatuses = {
  render: () => {
    const groups = {
      "Green (approved/positive)": ["approved", "valid", "complies", "complete", "checked", "review_complete"],
      "Blue (new/not started)": ["not_started", "new", "no_response", "review_not_started", "not_consulted"],
      "Light blue (in progress)": ["in_progress", "awaiting_response", "to_be_determined"],
      "Yellow (needs attention)": ["updated", "to_be_reviewed", "submitted", "neutral", "amendments_needed", "awaiting_changes"],
      "Red (negative/refused)": ["refused", "invalid", "rejected", "objection", "cancelled", "does_not_comply"],
      "Grey (optional/inactive)": ["optional", "not_required", "cannot_start_yet"],
    };

    let html = "";
    for (const [groupName, statuses] of Object.entries(groups)) {
      html += `<h3 class="govuk-heading-s">${groupName}</h3>`;
      html += `<div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px;">`;
      for (const status of statuses) {
        html += renderStatusTag(status);
      }
      html += `</div>`;
    }
    return html;
  },
};
