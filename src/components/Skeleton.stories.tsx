import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { Labeled } from "./common";
import { Row, Column } from "./Box";
import { Skeleton } from "./Skeleton";

export default defineMeta({
  title: "Adwaita/Skeleton",
  component: Skeleton,
  parameters: { width: 528, height: 320 },
});

export const roundedBlocks = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="text line (120×16)">
        <Skeleton width={120} height={16} />
      </Labeled>
      <Labeled caption="wide block (240×32)">
        <Skeleton width={240} height={32} />
      </Labeled>
    </Column>
  ),
});

export const circle = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="48px">
        <Skeleton variant="circle" width={48} />
      </Labeled>
      <Labeled caption="32px">
        <Skeleton variant="circle" width={32} />
      </Labeled>
      <Labeled caption="24px">
        <Skeleton variant="circle" width={24} />
      </Labeled>
    </Row>
  ),
});

function CardPlaceholder() {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        width: 288,
        padding: 16,
        borderRadius: t.radii.card,
        borderWidth: 1,
        borderColor: t.colors.border,
        backgroundColor: t.colors.view_bg,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 12,
          alignItems: "center",
        }}
      >
        <Skeleton variant="circle" width={40} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            flexGrow: 1,
          }}
        >
          <Skeleton width={204} height={12} />
          <Skeleton width={140} height={12} />
        </div>
      </div>
      <Skeleton width={256} height={64} />
    </div>
  );
}

export const composed = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled
        caption="card placeholder (avatar + lines + block)"
        style={{ width: 288 }}
      >
        <CardPlaceholder />
      </Labeled>
    </Column>
  ),
});
