import { defineMeta } from "storybook";
import { Labeled } from "./common";
import { Panel } from "./.storybook/story-helpers";
import { ColorPicker } from "./ColorPicker";

export default defineMeta({
  title: "Adwaita/ColorPicker",
  component: ColorPicker,
  parameters: { width: 320, height: 200 },
});

export function withValue() {
  return (
    <Panel>
      <Labeled caption="picker with value (#3584e4)" style={{ gap: 6 }}>
        <ColorPicker value="#3584e4" />
      </Labeled>
    </Panel>
  );
}

export function empty() {
  return (
    <Panel>
      <Labeled
        caption="picker without value (placeholder)"
        style={{ gap: 6 }}
      >
        <ColorPicker />
      </Labeled>
    </Panel>
  );
}
