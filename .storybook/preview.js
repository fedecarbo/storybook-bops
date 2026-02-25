import "../src/styles/main.scss";

// The source Rails app sets class="govuk-template" on <html> and
// class="govuk-template__body" on <body>. The sidebar CSS relies on
// .govuk-template:has(.bops-fullwidth-container) to lock the html
// scroll. Add these classes to Storybook's iframe so sidebar pages
// scroll correctly (sidebar and main scroll independently).
if (typeof document !== "undefined") {
  document.documentElement.classList.add("govuk-template");
  document.body.classList.add("govuk-template__body");
}

export default {
  parameters: {
    layout: "padded",
    controls: { expanded: true },
    backgrounds: {
      default: "GOV.UK",
      values: [
        { name: "GOV.UK", value: "#ffffff" },
        { name: "Light grey", value: "#f3f2f1" },
      ],
    },
  },
};
