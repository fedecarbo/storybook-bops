import "../src/styles/main.scss";
import { initAll } from "govuk-frontend";
// The source Rails app sets class="govuk-template" on <html> and
// class="govuk-template__body" on <body>. The sidebar CSS relies on
// .govuk-template:has(.bops-fullwidth-container) to lock the html
// scroll. Add these classes to Storybook's iframe so sidebar pages
// scroll correctly (sidebar and main scroll independently).
if (typeof document !== "undefined") {
  document.documentElement.classList.add("govuk-template");
  document.body.classList.add("govuk-template__body");
  document.body.classList.add("govuk-frontend-supported");

  // Watch for story content changes and initialise GOV.UK Frontend JS
  // (accordions, tabs, etc.) once the DOM is updated.
  const root = document.getElementById("storybook-root");
  if (root) {
    new MutationObserver(() => {
      try {
        initAll();
      } catch (e) {
        // Ignore re-init errors for already-initialised components
      }
    }).observe(root, { childList: true, subtree: true });
  } else {
    // Root not available yet — wait for it
    new MutationObserver((_mutations, observer) => {
      const el = document.getElementById("storybook-root");
      if (el) {
        observer.disconnect();
        new MutationObserver(() => {
          try {
            initAll();
          } catch (e) {
            // Ignore re-init errors
          }
        }).observe(el, { childList: true, subtree: true });
      }
    }).observe(document.body, { childList: true, subtree: true });
  }
}

export default {
  parameters: {
    layout: "padded",
    controls: { expanded: true },
    backgrounds: {
      options: {
        "GOV.UK": { name: "GOV.UK", value: "#ffffff" },
        light_grey: { name: "Light grey", value: "#f3f2f1" }
      }
    },
  },

  initialGlobals: {
    backgrounds: {
      value: "gov.uk"
    }
  }
};
