import { defineMeta, defineStory } from "storybook";
import { AdwaitaProvider, useAdwaita } from "../../theme/adwaita";
import { Labeled } from "../common";
import { Column } from "../Box";
import {
  FileChangeRow,
  DiffHistogram,
  fileRowStats,
  type FileRowData,
} from "./FileRow";

const FILES: FileRowData[] = [
  { status: "A", path: "src/components/Button.tsx", insertions: 42, deletions: 0 },
  { status: "M", path: "src/theme/adwaita.ts", insertions: 12, deletions: 30 },
  { status: "D", path: "src/legacy/old.ts", insertions: 0, deletions: 88 },
];

const UNMODIFIED: FileRowData[] = [
  { status: "M", path: "src/components/Slider.tsx", insertions: 0, deletions: 0 },
];

const RAGGED_COUNTS: FileRowData[] = [
  { status: "M", path: "src/screens/ChangesView.tsx", insertions: 239, deletions: 0 },
  { status: "M", path: "src/repo.ts", insertions: 27, deletions: 6 },
  { status: "A", path: "bun.lock", insertions: 3040, deletions: 128 },
  { status: "D", path: "src/legacy/old.ts", insertions: 0, deletions: 884 },
];

function RowList({
  files,
  selected,
  focused = true,
  bordered = true,
}: {
  files: FileRowData[];
  selected?: number;
  focused?: boolean;
  bordered?: boolean;
}) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        borderRadius: bordered ? t.radii.card : 0,
        borderWidth: bordered ? 1 : 0,
        borderColor: t.colors.border,
        backgroundColor: t.colors.view_bg,
        overflow: "hidden",
      }}
    >
      {files.map((f, i) => (
        <FileChangeRow
          key={f.path}
          file={f}
          stats={fileRowStats(files)}
          selected={i === selected}
          focused={focused}
        />
      ))}
    </div>
  );
}

export default defineMeta({
  title: "Adwaita/FileRow",
  component: FileChangeRow,
  parameters: { width: 528, height: 200 },
});

export const fileRows = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled
        caption="FileChangeRow (A / M / D, middle selected)"
        style={{ width: "100%" }}
      >
        <RowList files={FILES} selected={1} />
      </Labeled>
    </Column>
  ),
});

export const paneFocus = defineStory({
  parameters: { width: 528, height: 300 },
  render: () => (
    <AdwaitaProvider scheme="nightsky">
      <Column gap={16} align="center">
        <Labeled
          caption="nightsky — focused pane: full accent tint"
          style={{ width: "100%" }}
        >
          <RowList files={FILES} selected={1} bordered={false} />
        </Labeled>
        <Labeled
          caption="nightsky — unfocused pane: card surface, no accent"
          style={{ width: "100%" }}
        >
          <RowList files={FILES} selected={1} focused={false} bordered={false} />
        </Labeled>
      </Column>
    </AdwaitaProvider>
  ),
});

export const noChanges = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled
        caption="unmodified (no line changes — dim histogram)"
        style={{ width: "100%" }}
      >
        <RowList files={UNMODIFIED} />
      </Labeled>
    </Column>
  ),
});

const ICON_COVERAGE: FileRowData[] = [
  { status: "M", path: "src/screens/ChangesView.tsx", insertions: 18, deletions: 4 },
  { status: "A", path: "src/hooks/useListFollow.ts", insertions: 42, deletions: 0 },
  { status: "A", path: "scripts/deploy.sh", insertions: 12, deletions: 0 },
  { status: "M", path: "flake.nix", insertions: 6, deletions: 2 },
  { status: "M", path: "bun.lock", insertions: 148, deletions: 96 },
  { status: "A", path: "assets/logo.png", insertions: 0, deletions: 0 },
  { status: "M", path: "README.md", insertions: 9, deletions: 1 },
  { status: "D", path: "src/legacy/old.ts", insertions: 0, deletions: 312 },
  { status: "R", path: "src/theme.ts", insertions: 3, deletions: 3 },
  { status: "M", path: "src/notes/", insertions: 0, deletions: 0 },
];

export const fileIcons = defineStory({
  parameters: { width: 420, height: 330 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled
        caption="lucide file-type icons (accent-tinted) + lucide status icons"
        style={{ width: "100%" }}
      >
        <div style={{ width: 380 }}>
          <RowList files={ICON_COVERAGE} selected={4} />
        </div>
      </Labeled>
    </Column>
  ),
});

export const statsColumns = defineStory({
  parameters: { width: 420, height: 230 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled
        caption="stats columns hug the widest +/- count in the list (narrow panel)"
        style={{ width: "100%" }}
      >
        <div style={{ width: 360 }}>
          <RowList files={RAGGED_COUNTS} selected={2} />
        </div>
      </Labeled>
    </Column>
  ),
});

export function diffHistogram() {
  const t = useAdwaita();
  const { colors } = t;
  const histogramRow = (
    label: string,
    insertions: number,
    deletions: number,
  ) => (
    <Labeled caption={label} style={{ width: "100%" }}>
      <DiffHistogram insertions={insertions} deletions={deletions} colors={colors} />
    </Labeled>
  );
  return (
    <Column gap={16} align="center">
      <Labeled
        caption="DiffHistogram (additions / deletions / mixed / none)"
        style={{ width: "100%" }}
      >
        <Column gap={8} style={{ width: "100%" }}>
          {histogramRow("additions only", 20, 0)}
          {histogramRow("deletions only", 0, 20)}
          {histogramRow("mixed", 7, 13)}
          {histogramRow("no changes", 0, 0)}
        </Column>
      </Labeled>
    </Column>
  );
}
