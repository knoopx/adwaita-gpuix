import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../text";
import { Column } from "../Box";
import { Stage } from "../../../.storybook/story-helpers";
import { DisclosureSection } from "./DisclosureSection";
import { OutputBox } from "./OutputBox";

function Lines({ items }: { items: string[] }) {
  const t = useAdwaita();
  return (
    <Column gap={2}>
      {items.map((item) => (
        <T key={item} size="caption" color={t.color.text.dim}>
          {item}
        </T>
      ))}
    </Column>
  );
}

export default defineMeta({
  title: "Adwaita/DisclosureSection",
  component: DisclosureSection,
  parameters: { width: 360, height: 160 },
});

export const list = defineStory({
  render: () => (
    <Stage width={360} height={120} radius={8}>
      <DisclosureSection title="Tools" style={{ padding: 16 }}>
        <Lines items={["read", "write", "bash"]} />
      </DisclosureSection>
    </Stage>
  ),
});

export const output = defineStory({
  render: () => (
    <Stage width={360} height={160} radius={8}>
      <DisclosureSection title="Output" style={{ padding: 16 }}>
        <OutputBox text={"compiled 24 modules\nbundled in 480ms"} />
      </DisclosureSection>
    </Stage>
  ),
});
