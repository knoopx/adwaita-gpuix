import { type ReactNode, useRef } from "react";
import { type PublicInstance } from "@gpuix/react";
import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../../theme/adwaita";
import { Labeled, T } from "../text";
import { VirtualListPanel, VirtualListRow } from "./VirtualListPanel";
import {
  FILES_ROWS,
  MONITOR_ROWS,
  Stack,
} from "../../../.storybook/app-helpers";

const meta = defineMeta({
  title: "Adwaita/VirtualListPanel",
  component: VirtualListPanel,
  parameters: { width: 900, height: 520 },
});

export default meta;

const noop = () => {};

const VIEWPORT_HEIGHT = 400;

const VISIBLE_PROCESS_ROWS = 10;

function FilesRowsPanel() {
  const t = useAdwaita();
  const listRef = useRef<PublicInstance | null>(null);

  return (
    <VirtualListPanel
      listRef={listRef}
      estimatedItemHeight={t.control.listRowHeight}
      style={{ height: VIEWPORT_HEIGHT, flexGrow: 0, width: "100%" }}
    >
      {FILES_ROWS.map((file) => (
        <FilesRow key={file.name} file={file} />
      ))}
    </VirtualListPanel>
  );
}

function TrailingCells({ children }: { children: ReactNode }) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: t.control.listRowGap,
        flexGrow: 1,
        minWidth: 0,
      }}
    >
      {children}
    </div>
  );
}

function FilesRow({
  file,
}: {
  file: { name: string; items: string; modified: string };
}) {
  const t = useAdwaita();

  return (
    <VirtualListRow
      icon="folder"
      iconSize={t.control.listIconSize}
      iconColor={t.color.accent.base}
      label={file.name}
      selected={file.name === "Documents"}
      onClick={noop}
      trailing={
        <TrailingCells>
          <T
            size="list"
            color={t.color.text.dim}
            style={{ flexGrow: 0.88, flexShrink: 0, textAlign: "right" }}
          >
            {file.items}
          </T>
          <T
            size="list"
            color={t.color.text.dim}
            style={{ flexGrow: 1.56, flexShrink: 0, textAlign: "right" }}
          >
            {file.modified}
          </T>
        </TrailingCells>
      }
    />
  );
}

function ProcessRowsPanel() {
  const t = useAdwaita();
  const listRef = useRef<PublicInstance | null>(null);

  return (
    <VirtualListPanel
      listRef={listRef}
      estimatedItemHeight={t.control.statusBarHeight}
      style={{ height: VIEWPORT_HEIGHT, flexGrow: 0, width: "100%" }}
    >
      {MONITOR_ROWS.slice(0, VISIBLE_PROCESS_ROWS).map((proc, i) => (
        <ProcessRow key={proc.id} proc={proc} selected={i === 0} />
      ))}
    </VirtualListPanel>
  );
}

function ProcessRow({
  proc,
  selected,
}: {
  proc: (typeof MONITOR_ROWS)[number];
  selected: boolean;
}) {
  const t = useAdwaita();

  return (
    <VirtualListRow
      dense
      selectedStyle="band"
      selected={selected}
      label={proc.name}
      onClick={noop}
      trailing={
        <TrailingCells>
          <T
            size="body"
            color={t.color.text.primary}
            style={{ flexGrow: 0.5, flexShrink: 0, textAlign: "right" }}
          >
            {proc.cpu}
          </T>
          <T
            size="body"
            color={t.color.text.dim}
            style={{ flexGrow: 0.6, flexShrink: 0, textAlign: "right" }}
          >
            {proc.id}
          </T>
          <T
            size="body"
            color={t.color.text.primary}
            style={{ flexGrow: 0.8, flexShrink: 0, textAlign: "right" }}
          >
            {proc.memory}
          </T>
          <T
            size="body"
            color={t.color.text.primary}
            style={{ flexGrow: 0.8, flexShrink: 0, textAlign: "right" }}
          >
            {proc.diskRead}
          </T>
          <T
            size="body"
            color={t.color.text.primary}
            style={{ flexGrow: 0.8, flexShrink: 0, textAlign: "right" }}
          >
            {proc.diskWrite}
          </T>
          <T
            size="body"
            color={t.color.text.dim}
            style={{ flexGrow: 0.7, flexShrink: 0 }}
          >
            {proc.priority}
          </T>
        </TrailingCells>
      }
    />
  );
}

export const filesRows = defineStory({
  render: () => (
    <Stack>
      <Labeled caption="Files (Nautilus-2): rows in the panel, inset fill on the selected row">
        <FilesRowsPanel />
      </Labeled>
    </Stack>
  ),
});

function HeaderTruncationPanel() {
  const t = useAdwaita();
  const listRef = useRef<PublicInstance | null>(null);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 260,
        maxWidth: "100%",
        minWidth: 0,
        flexShrink: 1,
        overflow: "hidden",
      }}
    >
      <VirtualListPanel
        listRef={listRef}
        title="Working copy changes across every branch and remote"
        estimatedItemHeight={t.control.listRowHeight}
        style={{ height: 180, flexGrow: 0, width: "100%" }}
      >
        {FILES_ROWS.slice(0, 3).map((file) => (
          <FilesRow key={file.name} file={file} />
        ))}
      </VirtualListPanel>
    </div>
  );
}

export const headerTruncation = defineStory({
  render: () => (
    <Stack>
      <Labeled caption="panel header: a long title ellipsizes in the header row">
        <HeaderTruncationPanel />
      </Labeled>
    </Stack>
  ),
});

export const processRows = defineStory({
  render: () => (
    <Stack>
      <Labeled caption="System Monitor (SystemMonitor-1): dense rows, band selection">
        <ProcessRowsPanel />
      </Labeled>
    </Stack>
  ),
});
