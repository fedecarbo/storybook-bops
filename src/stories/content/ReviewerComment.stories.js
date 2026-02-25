/**
 * Displays a reviewer's comment in a blue-bordered inset box.
 * Shows the comment text, who sent it, and when.
 */
export default {
  title: "Content/Reviewer Comment",
  argTypes: {
    reviewerName: { control: "text" },
    date: { control: "text" },
    comment: { control: "text" },
  },
};

export const Default = {
  args: {
    reviewerName: "Sarah Johnson",
    date: "15 January 2025",
    comment:
      "The proposed development appears to comply with the local plan policies. However, I would recommend additional conditions regarding the hours of construction to protect neighbouring amenity.",
  },
  render: ({ reviewerName, date, comment }) => `
    <div class="govuk-inset-text comment-component">
      <p class="govuk-!-font-weight-bold govuk-!-margin-bottom-0">
        Reviewer comment
      </p>
      <p class="govuk-hint govuk-!-font-size-16 govuk-!-margin-top-1">Sent on ${date} by ${reviewerName}</p>
      <p class="govuk-body">${comment}</p>
    </div>
  `,
};

export const ShortComment = {
  render: () => `
    <div class="govuk-inset-text comment-component">
      <p class="govuk-!-font-weight-bold govuk-!-margin-bottom-0">
        Reviewer comment
      </p>
      <p class="govuk-hint govuk-!-font-size-16 govuk-!-margin-top-1">Sent on 3 February 2025 by Mark Thompson</p>
      <p class="govuk-body">Approved with no further comments.</p>
    </div>
  `,
};
