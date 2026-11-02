import { type ReactNode } from "react";
import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../../theme/adwaita";
import { Icon } from "../../components/icons";
import { Stage } from "../../../.storybook/story-helpers";
import { RowLabel } from "./RowLabel";

function Row({ children, width }: { children: ReactNode; width: number }) {
  const t = useAdwaita();
  return (
    <Stage width={width} height={56} radius={8}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: t.space.sm,
          padding: 16,
          minWidth: 0,
        }}
      >
        <Icon
          name="article"
          size={14}
          color={t.color.text.dim}
          style={{ flexShrink: 0 }}
        />
        {children}
      </div>
    </Stage>
  );
}

export default defineMeta({
  title: "Adwaita/RowLabel",
  component: RowLabel,
  parameters: { width: 320, height: 56 },
});

export const label = defineStory({
  render: () => <Row width={320}>Read src/index.ts</Row>,
});

export const caption = defineStory({
  render: () => (
    <Row width={320}>
      <RowLabel size="caption">test/nested/deep/file.test.ts</RowLabel>
    </Row>
  ),
});

export const ellipsis = defineStory({
  parameters: { width: 200, height: 56 },
  render: () => (
    <Row width={200}>A label long enough to be cut off by the row</Row>
  ),
});
