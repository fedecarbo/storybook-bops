import "../src/styles/main.scss";

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
