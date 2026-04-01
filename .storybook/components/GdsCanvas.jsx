import React from "react";
import { Canvas, useOf } from "@storybook/addon-docs/blocks";

export function GdsCanvas({ of, ...rest }) {
  const resolved = useOf(of, ["story"]);
  const storyId = resolved.story.id;
  const storyUrl = `?path=/story/${storyId}`;

  return (
    <Canvas
      of={of}
      additionalActions={[
        {
          title: "Open this state in a new tab",
          onClick: () => window.open(storyUrl, "_blank"),
        },
      ]}
      {...rest}
    />
  );
}
