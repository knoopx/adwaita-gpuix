import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../theme/adwaita";
import { Labeled } from "./common";
import { Column } from "./Box";
import { DataTable } from "./DataTable";
import type { TabularSides } from "../lib/Tabular";
import { HP_MP_ROWS } from "./.storybook/story-helpers";

const SIDES: TabularSides = {
  delim: "\t",
  old: [
    ["name", "hp", "mp"],
    ["orc", "12", "0"],
    ["elf", "8", "4"],
    ["golem", "20", "0"],
  ],
  next: [
    ["name", "hp", "mp"],
    ["orc", "14", "0"],
    ["elf", "8", "6"],
    ["goblin", "6", "2"],
  ],
  hasHeader: true,
};

const SIDES_NO_HEADER: TabularSides = {
  delim: ",",
  old: [
    ["1", "alpha", "yes"],
    ["2", "beta", "no"],
  ],
  next: [
    ["1", "alpha", "no"],
    ["3", "gamma", "yes"],
  ],
  hasHeader: false,
};

const SIDES_UNCHANGED: TabularSides = {
  delim: "\t",
  old: HP_MP_ROWS,
  next: HP_MP_ROWS,
  hasHeader: true,
};

const SIDES_ALL_ADDED: TabularSides = {
  delim: "\t",
  old: [],
  next: HP_MP_ROWS,
  hasHeader: true,
};

const SIDES_ALL_REMOVED: TabularSides = {
  delim: "\t",
  old: HP_MP_ROWS,
  next: [],
  hasHeader: true,
};

const SIDES_SEMICOLON: TabularSides = {
  delim: ";",
  old: [
    ["city", "pop", "region"],
    ["london", "9.7", "uk"],
    ["paris", "9.5", "fr"],
  ],
  next: [
    ["city", "pop", "region"],
    ["london", "9.7", "uk"],
    ["berlin", "3.7", "de"],
  ],
  hasHeader: true,
};

function manySides(): TabularSides {
  const n = 620;
  const old: string[][] = [["id", "name", "value"]];
  const next: string[][] = [["id", "name", "value"]];
  for (let i = 1; i <= n; i++) {
    const id = String(i);
    const name = `item-${String(i).padStart(4, "0")}`;
    const value = String(i * 3);
    old.push([id, name, value]);
    next.push([id, name, i % 5 === 0 ? String(i * 5) : value]);
  }
  return { delim: "\t", old, next, hasHeader: true };
}

function DataTableDemo({
  sides,
  height = 150,
}: {
  sides: TabularSides;
  height?: number;
}) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height,
        borderRadius: t.radii.card,
        borderWidth: 1,
        borderColor: t.colors.border,
        overflow: "hidden",
      }}
    >
      <DataTable sides={sides} />
    </div>
  );
}

export default defineMeta({
  title: "Adwaita/DataTable",
  component: DataTable,
  parameters: { width: 528, height: 360 },
});

export const alignedDiff = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="aligned diff — added / removed / changed cells">
        <DataTableDemo sides={SIDES} />
      </Labeled>
    </Column>
  ),
});

export const noHeaderRow = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="no header row">
        <DataTableDemo sides={SIDES_NO_HEADER} height={110} />
      </Labeled>
    </Column>
  ),
});

export const unchangedRows = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="identical sides — no changes (neutral state)">
        <DataTableDemo sides={SIDES_UNCHANGED} height={130} />
      </Labeled>
    </Column>
  ),
});

export const allAdded = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="new file — every row added (success tint)">
        <DataTableDemo sides={SIDES_ALL_ADDED} height={130} />
      </Labeled>
    </Column>
  ),
});

export const allRemoved = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="deleted file — every row removed (destructive tint)">
        <DataTableDemo sides={SIDES_ALL_REMOVED} height={130} />
      </Labeled>
    </Column>
  ),
});

export const semicolonDelimiter = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="semicolon delimiter — shown in the summary bar">
        <DataTableDemo sides={SIDES_SEMICOLON} height={130} />
      </Labeled>
    </Column>
  ),
});

export const manyRows = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="620 rows — capped at 500 with a truncation notice">
        <DataTableDemo sides={manySides()} height={180} />
      </Labeled>
    </Column>
  ),
});
