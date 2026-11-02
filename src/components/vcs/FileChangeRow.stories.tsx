import { defineMeta, defineStory } from "storybook";
import { AdwaitaProvider, useAdwaita } from "../../theme/adwaita";
import { Labeled } from "../text";
import { Column } from "../Box";
import { FileChangeRow } from "./FileChangeRow";
import { fileRowStats, type FileRowData } from "./FileRowData";

const FILES: FileRowData[] = [
  {
    status: "A",
    path: "src/components/Button.tsx",
    insertions: 42,
    deletions: 0,
  },
  { status: "M", path: "src/theme/adwaita.ts", insertions: 12, deletions: 30 },
  { status: "D", path: "src/legacy/old.ts", insertions: 0, deletions: 88 },
];

const RAGGED_COUNTS: FileRowData[] = [
  {
    status: "M",
    path: "src/screens/ChangesView.tsx",
    insertions: 239,
    deletions: 0,
  },
  { status: "M", path: "src/repo.ts", insertions: 27, deletions: 6 },
  { status: "A", path: "bun.lock", insertions: 3040, deletions: 128 },
  { status: "D", path: "src/legacy/old.ts", insertions: 0, deletions: 884 },
];

const UNMODIFIED: FileRowData[] = [
  {
    status: "M",
    path: "src/components/Slider.tsx",
    insertions: 0,
    deletions: 0,
  },
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
        borderRadius: bordered ? t.radius.sm : 0,
        borderWidth: bordered ? 1 : 0,
        borderColor: t.color.border.default,
        backgroundColor: t.color.surface.view,
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

const meta = defineMeta({
  title: "Adwaita/FileChangeRow",
  component: FileChangeRow,
  parameters: { width: 528, height: 200 },
});
export default meta;

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
          <RowList
            files={FILES}
            selected={1}
            focused={false}
            bordered={false}
          />
        </Labeled>
      </Column>
    </AdwaitaProvider>
  ),
});

export const noChanges = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled
        caption="unmodified (no line changes — dim counts, dim histogram)"
        style={{ width: "100%" }}
      >
        <RowList files={UNMODIFIED} />
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
