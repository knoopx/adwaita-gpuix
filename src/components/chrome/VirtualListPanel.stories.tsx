import { useRef } from "react";
import { defineMeta, defineStory } from "storybook";
import type { PublicInstance } from "@gpuix/react";
import { Labeled } from "../common";
import { Column } from "../Box";
import type { IconName } from "../icons";
import { VirtualListPanel, VirtualListRow } from "./VirtualListPanel";

interface RowData {
  label: string;
  icon?: IconName;
  subtitle?: string;
}

const FILES: RowData[] = [
  { label: "src/main.ts", icon: "code", subtitle: "2.1 KB" },
  { label: "src/theme/adwaita.ts", icon: "fileText", subtitle: "6.8 KB" },
  { label: "src/components/Button.tsx", icon: "fileText", subtitle: "3.4 KB" },
  { label: "src/components/Card.tsx", icon: "fileText", subtitle: "1.9 KB" },
  { label: "src/components/Dialog.tsx", icon: "fileText", subtitle: "5.2 KB" },
  { label: "src/components/Entry.tsx", icon: "fileText", subtitle: "2.7 KB" },
  { label: "src/components/Spinner.tsx", icon: "fileText", subtitle: "0.8 KB" },
  { label: "src/components/Switch.tsx", icon: "fileText", subtitle: "1.1 KB" },
  { label: "src/components/Tabs.tsx", icon: "fileText", subtitle: "2.3 KB" },
  { label: "src/components/Toast.tsx", icon: "fileText", subtitle: "1.4 KB" },
];

const LABELS = FILES.map((f) => f.label);
const LONG_LABELS = Array.from(
  { length: 30 },
  (_, i) => LABELS[i % LABELS.length],
);

function PanelDemo({
  rows,
  selected,
  title,
  height = 220,
}: {
  rows: RowData[];
  selected?: number;
  title?: string;
  height?: number;
}) {
  const listRef = useRef<PublicInstance | null>(null);
  return (
    <Column gap={0} style={{ height, width: "100%" }}>
      <VirtualListPanel
        listRef={listRef}
        estimatedItemHeight={40}
        title={title}
      >
        {rows.map((r, i) => (
          <div key={i}>
            <VirtualListRow
              label={r.label}
              icon={r.icon}
              subtitle={r.subtitle}
              selected={selected === i}
            />
          </div>
        ))}
      </VirtualListPanel>
    </Column>
  );
}

export default defineMeta({
  title: "Adwaita/VirtualListPanel",
  component: VirtualListPanel,
  parameters: { width: 528, height: 400 },
});

export const rows = defineStory({
  render: () => (
    <Labeled caption="many rows (scrollable virtual-list)">
      <PanelDemo rows={LONG_LABELS.map((label) => ({ label }))} />
    </Labeled>
  ),
});

export const selectedRow = defineStory({
  render: () => (
    <Labeled caption="with a selected row">
      <PanelDemo
        rows={LONG_LABELS.slice(0, 12).map((label) => ({ label }))}
        selected={2}
      />
    </Labeled>
  ),
});

export const withIcons = defineStory({
  render: () => (
    <Labeled caption="rows with leading icons">
      <PanelDemo
        rows={FILES.map(({ label, icon }) => ({ label, icon }))}
        selected={0}
      />
    </Labeled>
  ),
});

export const withSubtitles = defineStory({
  render: () => (
    <Labeled caption="rows with secondary text">
      <PanelDemo
        rows={FILES.map(({ label, subtitle }) => ({ label, subtitle }))}
        selected={4}
      />
    </Labeled>
  ),
});

export const withHeader = defineStory({
  render: () => (
    <Labeled caption="with a panel header">
      <PanelDemo
        rows={LONG_LABELS.slice(0, 12).map((label) => ({ label }))}
        title="Components"
      />
    </Labeled>
  ),
});
