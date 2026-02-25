/**
 * A yellow banner displayed at the top of non-production environments
 * to warn users they are not on the live system.
 */
export default {
  title: "Core/Environment Banner",
  argTypes: {
    environment: {
      control: "select",
      options: ["staging", "test", "development"],
    },
  },
};

export const Default = {
  args: { environment: "staging" },
  render: ({ environment }) => `
    <header class="environment-banner">
      <div class="govuk-width-container">
        <p class="govuk-!-margin-bottom-0">
          This is ${environment}. Only process test cases on this version of BOPS
        </p>
      </div>
    </header>
  `,
};

export const Test = {
  render: () => `
    <header class="environment-banner">
      <div class="govuk-width-container">
        <p class="govuk-!-margin-bottom-0">
          This is test. Only process test cases on this version of BOPS
        </p>
      </div>
    </header>
  `,
};
