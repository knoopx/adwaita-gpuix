import { defineMeta, defineStory } from "storybook";
import { Labeled, T } from "./text";
import { Column } from "./Box";
import { Divider, DividerGroup, DividerPanel } from "./Divider";
import { VirtualListPanel as VirtualListPanel } from "./chrome/VirtualListPanel";
import { Stage } from "../../.storybook/story-helpers";

export default defineMeta({
  title: "Adwaita/Divider",
  component: Divider,
  parameters: { width: 528, height: 320 },
});

export const anatomy = defineStory({
  render: () => (
    <Column gap={16} style={{ width: 440, padding: 16 }}>
      <Labeled caption="faint · default · strong">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Divider tone="faint" />
          <Divider />
          <Divider tone="strong" />
        </div>
      </Labeled>
      <Labeled caption="adjustable weight (1 / 2 / 3 px)">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Divider thickness={1} />
          <Divider thickness={2} />
          <Divider thickness={3} />
        </div>
      </Labeled>
      <Labeled caption="adjustable length and inset">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Divider length={120} />
          <Divider length={120} inset={24} />
          <Divider length="full" />
        </div>
      </Labeled>
      <Labeled caption="vertical, between boxes">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            gap: 12,
            height: 72,
          }}
        >
          <div
            style={{
              flexGrow: 1,
              backgroundColor: "rgba(255,255,255,0.06)",
              borderRadius: 6,
            }}
          />
          <Divider orientation="vertical" />
          <div
            style={{
              flexGrow: 1,
              backgroundColor: "rgba(255,255,255,0.06)",
              borderRadius: 6,
            }}
          />
        </div>
      </Labeled>
    </Column>
  ),
});

function Pane({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: 12,
        gap: 8,
      }}
    >
      <T size="caption" color="rgba(255,255,255,0.5)">
        {label}
      </T>
      <VirtualListPanel listRef={{ current: null }} estimatedItemHeight={28}>
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              height: 28,
              alignItems: "center",
              paddingLeft: 8,
              backgroundColor:
                i % 2 === 0 ? "rgba(255,255,255,0.04)" : "transparent",
              borderRadius: 6,
            }}
          >
            <T size="body" color="rgba(255,255,255,0.85)">
              {`${label} ${i + 1}`}
            </T>
          </div>
        ))}
      </VirtualListPanel>
    </div>
  );
}

export const adjustablePanes = defineStory({
  parameters: { width: 640, height: 320 },
  render: () => (
    <Labeled caption="drag the rule — the left pane follows, clamped to its min/max">
      <Stage width={560} height={240} radius={8}>
        <DividerGroup
          orientation="horizontal"
          style={{ width: "100%", height: "100%" }}
        >
          <DividerPanel min={120} max={360} defaultSize={200}>
            <Pane label="Sidebar" />
          </DividerPanel>
          <Divider orientation="vertical" resize={0} />
          <DividerPanel>
            <Pane label="Content" />
          </DividerPanel>
        </DividerGroup>
      </Stage>
    </Labeled>
  ),
});

export const adjustableRows = defineStory({
  parameters: { width: 640, height: 320 },
  render: () => (
    <Labeled caption="stacked panes — the horizontal rule between them is one line">
      <Stage width={560} height={240} radius={8}>
        <DividerGroup
          orientation="vertical"
          style={{ width: "100%", height: "100%" }}
        >
          <DividerPanel min={80} max={160} defaultSize={110}>
            <Pane label="Detail" />
          </DividerPanel>
          <Divider orientation="horizontal" resize={0} />
          <DividerPanel>
            <Pane label="Content" />
          </DividerPanel>
        </DividerGroup>
      </Stage>
    </Labeled>
  ),
});

export const stackedRows = defineStory({
  parameters: { width: 420, height: 240 },
  render: () => (
    <Labeled caption="row rhythm inside one continuous list">
      <div style={{ display: "flex", flexDirection: "column", width: 340 }}>
        {["Browse", "Search", "Integrity"].map((label, i) => (
          <div key={label}>
            {i > 0 ? <Divider tone="faint" /> : null}
            <div
              style={{
                display: "flex",
                height: 36,
                alignItems: "center",
                paddingLeft: 4,
              }}
            >
              <T size="body" color="rgba(255,255,255,0.85)">
                {label}
              </T>
            </div>
          </div>
        ))}
      </div>
    </Labeled>
  ),
});

export const inHeader = defineStory({
  parameters: { width: 360, height: 120 },
  render: () => (
    <Labeled caption="short rule between header control groups">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          height: 47,
          padding: 8,
        }}
      >
        <div
          style={{
            width: 40,
            height: 30,
            backgroundColor: "rgba(255,255,255,0.08)",
            borderRadius: 6,
          }}
        />
        <Divider orientation="vertical" tone="faint" length={34} />
        <div
          style={{
            width: 40,
            height: 30,
            backgroundColor: "rgba(255,255,255,0.08)",
            borderRadius: 6,
          }}
        />
      </div>
    </Labeled>
  ),
});
