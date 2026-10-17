import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { T, Labeled } from "./common";
import { Row } from "./Box";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "./HoverCard";
import { Button } from "./Button";
import { Icon } from "./icons";
import { LabeledStage, SidesShowcase } from "./.storybook/story-helpers";

function SideHoverCard({
  side,
  text,
}: {
  side: "top" | "right" | "bottom" | "left";
  text: string;
}) {
  return (
    <HoverCard open={true} onOpenChange={() => {}}>
      <HoverCardTrigger>
        <Button label={side} onClick={() => {}} />
      </HoverCardTrigger>
      <HoverCardContent side={side} style={{ minWidth: 0 }}>
        <T size="caption">{text}</T>
      </HoverCardContent>
    </HoverCard>
  );
}

function HoverCardRichBody() {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
      }}
    >
      <Icon name="user" size={20} color={t.colors.dim_fg} />
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <T size="body" weight={600}>
          Ada Lovelace
        </T>
        <T size="caption" color={t.colors.dim_fg}>
          Hover card with icon + title + text.
        </T>
      </div>
    </div>
  );
}

const PREVIEW_ROWS = [
  { icon: "clock" as const, label: "Edited", value: "2h ago" },
  { icon: "user" as const, label: "Owner", value: "Ada" },
  { icon: "fileText" as const, label: "Size", value: "1.2 MB" },
];

function PreviewListBody() {
  const t = useAdwaita();
  const { colors, radii } = t;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 8,
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: radii.button,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.button_bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            pointerEvents: "none",
          }}
        >
          <Icon name="image" size={18} color={colors.dim_fg} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <T size="body" weight={600}>
            Quarterly report
          </T>
          <T size="caption" color={colors.dim_fg}>
            PDF preview with metadata.
          </T>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {PREVIEW_ROWS.map((row) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Icon
              name={row.icon}
              size={14}
              color={colors.dim_fg}
              style={{ pointerEvents: "none" }}
            />
            <T size="caption">{row.label}</T>
            <div style={{ flexGrow: 1 }} />
            <T size="caption" color={colors.dim_fg}>
              {row.value}
            </T>
          </div>
        ))}
      </div>
    </div>
  );
}

export default defineMeta({
  title: "Adwaita/HoverCard",
  component: HoverCard,
  parameters: { width: 528, height: 960 },
});

export const closedTrigger = defineStory({
  render: () => (
    <Row gap={16} align="center">
      <Labeled caption="closed trigger (panel hidden)">
        <HoverCard open={false} onOpenChange={() => {}}>
          <HoverCardTrigger>
            <Button label="Hover" onClick={() => {}} />
          </HoverCardTrigger>
          <HoverCardContent>
            <T size="caption">Never rendered while closed.</T>
          </HoverCardContent>
        </HoverCard>
      </Labeled>
    </Row>
  ),
});

export const openSides = defineStory({
  render: () => (
    <SidesShowcase
      caption="open · sides (side prop, anchored to the trigger)"
      Side={SideHoverCard}
      texts={[
        "Above the trigger",
        "Right of the trigger",
        "Below the trigger",
        "Left of the trigger",
      ]}
      stage={{ width: 480, height: 120 }}
    />
  ),
});

export const richContent = defineStory({
  render: () => (
    <LabeledStage
      caption="open · icon + title + text"
      width={480}
      height={180}
      center
    >
      <HoverCard open={true} onOpenChange={() => {}}>
        <HoverCardTrigger>
          <Button label="Hover card" onClick={() => {}} />
        </HoverCardTrigger>
        <HoverCardContent>
          <HoverCardRichBody />
        </HoverCardContent>
      </HoverCard>
    </LabeledStage>
  ),
});

export const listPreview = defineStory({
  render: () => (
    <LabeledStage
      caption="open · rich content (image placeholder + list)"
      width={480}
      height={260}
      center
    >
      <HoverCard open={true} onOpenChange={() => {}}>
        <HoverCardTrigger>
          <Button label="Hover card" onClick={() => {}} />
        </HoverCardTrigger>
        <HoverCardContent>
          <PreviewListBody />
        </HoverCardContent>
      </HoverCard>
    </LabeledStage>
  ),
});
