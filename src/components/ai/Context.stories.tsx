import { defineMeta, defineStory } from "storybook";
import type { ReactNode } from "react";
import { useAdwaita } from "../../theme/adwaita";
import { Labeled, T } from "../common";
import { Row, Column } from "../Box";
import { Icon } from "../../components/icons";
import { Stage } from "../.storybook/story-helpers";
import { Context, ContextTrigger, ContextContent } from "./Context";

function ContextStage({
  caption,
  width,
  height,
  context,
}: {
  caption: string;
  width?: number;
  height?: number;
  context: ReactNode;
}) {
  return (
    <Stage width={width ?? 480} height={height ?? 400}>
      <Column gap={8} padding={16}>
        <Labeled caption={caption} />
        {context}
      </Column>
    </Stage>
  );
}

export default defineMeta({
  title: "Adwaita/Context",
  component: Context,
  parameters: { width: 528, height: 420 },
});

export const closedTrigger = defineStory({
  parameters: { width: 400, height: 140 },
  render: () => (
    <ContextStage
      caption="closed · percent pill"
      width={360}
      height={120}
      context={
        <Context usedTokens={84200} maxTokens={200000}>
          <ContextTrigger />
          <ContextContent />
        </Context>
      }
    />
  ),
});

export const openUsageCard = defineStory({
  parameters: { width: 528, height: 420 },
  render: () => (
    <ContextStage
      caption="open · usage breakdown"
      context={
        <Context
          usedTokens={132000}
          maxTokens={200000}
          usage={{ inputTokens: 118000, outputTokens: 14000 }}
          open
        >
          <ContextTrigger />
          <ContextContent />
        </Context>
      }
    />
  ),
});

export const emptyState = defineStory({
  parameters: { width: 528, height: 420 },
  render: () => (
    <ContextStage
      caption="empty · 0 tokens used"
      context={
        <Context usedTokens={0} maxTokens={200000} open>
          <ContextTrigger />
          <ContextContent />
        </Context>
      }
    />
  ),
});

export const highUsage = defineStory({
  parameters: { width: 528, height: 420 },
  render: () => (
    <ContextStage
      caption="95% used"
      context={
        <Context
          usedTokens={190000}
          maxTokens={200000}
          usage={{ inputTokens: 176000, outputTokens: 14000 }}
          open
        >
          <ContextTrigger />
          <ContextContent />
        </Context>
      }
    />
  ),
});

function CustomTriggerPill() {
  const t = useAdwaita();
  const { colors, radii } = t;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        minHeight: 28,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: radii.pill,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.button_bg,
        cursor: "pointer",
      }}
    >
      <Icon name="sparkles" size={14} color={colors.dim_fg} />
      <T size="caption" weight={600} color={colors.dim_fg}>
        132k / 200k tokens
      </T>
    </div>
  );
}

export const customTrigger = defineStory({
  parameters: { width: 480, height: 140 },
  render: () => (
    <ContextStage
      caption="custom trigger content"
      width={440}
      height={120}
      context={
        <Context usedTokens={132000} maxTokens={200000}>
          <ContextTrigger>
            <CustomTriggerPill />
          </ContextTrigger>
          <ContextContent />
        </Context>
      }
    />
  ),
});

export const anchorSides = defineStory({
  parameters: { width: 528, height: 420 },
  render: () => (
    <Stage width={528} height={420}>
      <Row gap={32} padding={16} style={{ height: "100%" }}>
        <Column gap={8} grow={1}>
          <Labeled caption={'side="bottom"'} />
          <Context usedTokens={84200} maxTokens={200000} open>
            <ContextTrigger />
            <ContextContent side="bottom" />
          </Context>
        </Column>
        <Column gap={8} grow={1}>
          <Labeled caption={'side="top"'} />
          <div style={{ flexGrow: 1 }} />
          <Context usedTokens={84200} maxTokens={200000} open>
            <ContextTrigger />
            <ContextContent side="top" />
          </Context>
        </Column>
      </Row>
    </Stage>
  ),
});
