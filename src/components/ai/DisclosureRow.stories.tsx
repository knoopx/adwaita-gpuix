import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../text";
import { Badge } from "../Badge";
import { Icon } from "../../components/icons";
import { Stage } from "../../../.storybook/story-helpers";
import { DisclosureRow } from "./DisclosureRow";
import { RowChevron } from "./RowChevron";
import { StatusGlyph } from "./StatusGlyph";

function Glyph() {
  const t = useAdwaita();
  return <Icon name="accountCircle" size={14} color={t.color.accent.base} />;
}

function Trailing({ model }: { model?: string }) {
  const t = useAdwaita();
  return (
    <>
      <StatusGlyph status="complete" />
      {model ? (
        <Badge
          variant="secondary"
          style={{ fontFamily: t.type.fontFamilyMono }}
        >
          {model}
        </Badge>
      ) : null}
      <RowChevron open={false} />
    </>
  );
}

function Count() {
  const t = useAdwaita();
  return (
    <T size="caption" color={t.color.text.dim}>
      4
    </T>
  );
}

export default defineMeta({
  title: "Adwaita/DisclosureRow",
  component: DisclosureRow,
  parameters: { width: 400, height: 150 },
});

export const label = defineStory({
  render: () => (
    <Stage width={400} height={70} radius={8}>
      <DisclosureRow label="Just a label" style={{ padding: 16 }} />
    </Stage>
  ),
});

export const glyph = defineStory({
  render: () => (
    <Stage width={400} height={70} radius={8}>
      <DisclosureRow
        label="Ran the build agent"
        icon={<Glyph />}
        style={{ padding: 16 }}
      />
    </Stage>
  ),
});

export const trailing = defineStory({
  render: () => (
    <Stage width={400} height={70} radius={8}>
      <DisclosureRow
        label="Ran the build agent"
        icon={<Glyph />}
        spacer
        trailing={<Trailing model="opus" />}
        style={{ padding: 16 }}
      />
    </Stage>
  ),
});

export const counts = defineStory({
  render: () => (
    <Stage width={400} height={70} radius={8}>
      <DisclosureRow
        label="Sources"
        gap={6}
        icon={<Glyph />}
        trailing={<Count />}
        style={{ padding: 16 }}
      />
    </Stage>
  ),
});

export const ellipsis = defineStory({
  render: () => (
    <Stage width={240} height={70} radius={8}>
      <DisclosureRow
        label="A disclosure label long enough to be cut off"
        icon={<Glyph />}
        spacer
        trailing={<Trailing />}
        style={{ padding: 16 }}
      />
    </Stage>
  ),
});
