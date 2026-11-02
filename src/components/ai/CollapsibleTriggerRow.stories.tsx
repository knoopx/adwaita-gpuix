import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../text";
import { Column } from "../Box";
import { Icon } from "../../components/icons";
import { Stage } from "../../../.storybook/story-helpers";
import { CollapsibleTriggerRow } from "./CollapsibleTriggerRow";

function Row({ open }: { open: boolean }) {
  const t = useAdwaita();
  return (
    <CollapsibleTriggerRow
      icon={<Icon name="globe" size={14} color={t.color.text.dim} />}
      title={
        <T
          size="body"
          color={t.color.text.primary}
          style={{ flexShrink: 1, textOverflow: "ellipsis" }}
        >
          {open ? "Open row" : "Closed row"}
        </T>
      }
      open={open}
      onToggle={() => {}}
    />
  );
}

export default defineMeta({
  title: "Adwaita/CollapsibleTriggerRow",
  component: CollapsibleTriggerRow,
  parameters: { width: 400, height: 80 },
});

function RowStage({ open }: { open: boolean }) {
  return (
    <Stage width={400} height={80} radius={8}>
      <Column gap={8} padding={16} style={{ width: "100%", minWidth: 0 }}>
        <Row open={open} />
      </Column>
    </Stage>
  );
}

export const open = defineStory({
  parameters: { width: 400, height: 80 },
  render: () => <RowStage open={true} />,
});

export const closed = defineStory({
  parameters: { width: 400, height: 80 },
  render: () => <RowStage open={false} />,
});
