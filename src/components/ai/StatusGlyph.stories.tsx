import { defineMeta, defineStory } from "storybook";
import { Column } from "../Box";
import { Stage } from "../../../.storybook/story-helpers";
import { DisclosureRow } from "./DisclosureRow";
import { StatusGlyph, type GlyphStatus } from "./StatusGlyph";

const STATES: GlyphStatus[] = ["pending", "running", "complete", "error"];

function StateRows({ status }: { status: GlyphStatus }) {
  return (
    <Stage width={360} height={64} radius={8}>
      <Column gap={8} padding={16} style={{ width: "100%", minWidth: 0 }}>
        <DisclosureRow
          icon={<StatusGlyph status={status} />}
          label={`Ran the build (${status})`}
        />
      </Column>
    </Stage>
  );
}

export default defineMeta({
  title: "Adwaita/StatusGlyph",
  component: StatusGlyph,
  parameters: { width: 360, height: 64 },
});

export const states = defineStory({
  parameters: { width: 360, height: 216 },
  render: () => (
    <Stage width={360} height={216} radius={8}>
      <Column gap={8} padding={16} style={{ width: "100%", minWidth: 0 }}>
        {STATES.map((status) => (
          <DisclosureRow
            key={status}
            icon={<StatusGlyph status={status} />}
            label={`Ran the build (${status})`}
          />
        ))}
      </Column>
    </Stage>
  ),
});

export const pending = defineStory({
  render: () => <StateRows status="pending" />,
});

export const running = defineStory({
  render: () => <StateRows status="running" />,
});

export const complete = defineStory({
  render: () => <StateRows status="complete" />,
});

export const error = defineStory({
  render: () => <StateRows status="error" />,
});

export const customIcon = defineStory({
  render: () => (
    <Stage width={360} height={64} radius={8}>
      <Column gap={8} padding={16} style={{ width: "100%", minWidth: 0 }}>
        <DisclosureRow
          icon={<StatusGlyph status="complete" icon="terminal" />}
          label="Completed with a custom glyph"
        />
      </Column>
    </Stage>
  ),
});
