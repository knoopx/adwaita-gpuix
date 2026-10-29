import type { ReactNode } from "react";
import { defineMeta, defineStory } from "storybook";
import { useAdwaita } from "../../theme/adwaita";
import { Labeled } from "../common";
import { Panel } from "../../lib/panel";
import { Column } from "../Box";
import { DiffPanel, DiffSummary } from "./DiffPanel";
import type { TabularSides } from "../../lib/Tabular";
import { HP_MP_ROWS } from "../.storybook/story-helpers";

const PATCH = `diff --git a/src/main.ts b/src/main.ts
--- a/src/main.ts
+++ b/src/main.ts
@@ -1,3 +1,4 @@
 import { render } from "@gpuix/react";
-const x = 1;
+const x = 2;
+const y = 3;
 const z = 4;
`;

const ADDITIONS = `diff --git a/src/config.ts b/src/config.ts
--- a/src/config.ts
+++ b/src/config.ts
@@ -1,2 +1,5 @@
 export const name = "adwaita";
+export const accent = "blue";
+export const scheme = "light";
+export const radius = 12;
 export const version = 1;
`;

const DELETIONS = `diff --git a/src/legacy.ts b/src/legacy.ts
--- a/src/legacy.ts
+++ b/src/legacy.ts
@@ -1,5 +1,3 @@
 export const stable = 1;
-export const oldApi = false;
-export const deprecated = 0;
-export const unused = "x";
 export const kept = true;
`;

const TABULAR: TabularSides = {
  delim: "\t",
  old: HP_MP_ROWS,
  next: [
    ["name", "hp", "mp"],
    ["orc", "14", "0"],
    ["goblin", "6", "2"],
    ["elf", "8", "6"],
  ],
  hasHeader: true,
};

function Frame({
  children,
  height = 150,
}: {
  children: ReactNode;
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
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

export default defineMeta({
  title: "Adwaita/DiffPanel",
  component: DiffPanel,
  parameters: { width: 528, height: 480 },
});

export const diffs = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="unified text diff (flush inside a Panel)">
        <Frame>
          <DiffPanel patch={PATCH} />
        </Frame>
      </Labeled>
      <Labeled caption="standalone (framed + own header)">
        <Frame>
          <DiffPanel patch={PATCH} framed header />
        </Frame>
      </Labeled>
      <Labeled caption="tabular diff (DataTable)">
        <Frame height={130}>
          <DiffPanel patch="" tabular={TABULAR} />
        </Frame>
      </Labeled>
    </Column>
  ),
});

const SUMMARIES: [string, number, number][] = [
  ["mixed diff", 3, 2],
  ["additions only", 717, 0],
  ["deletions only", 0, 128],
  ["empty diff", 0, 0],
];

export const summary = defineStory({
  parameters: { height: 220 },
  render: () => (
    <Column gap={12} align="stretch" style={{ width: 480 }}>
      {SUMMARIES.map(([title, added, removed]) => (
        <Panel
          key={title}
          title={title}
          trailing={<DiffSummary added={added} removed={removed} />}
        >
          <></>
        </Panel>
      ))}
    </Column>
  ),
});

export const lineVariants = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="additions only">
        <Frame height={130}>
          <DiffPanel patch={ADDITIONS} />
        </Frame>
      </Labeled>
      <Labeled caption="deletions only">
        <Frame height={130}>
          <DiffPanel patch={DELETIONS} />
        </Frame>
      </Labeled>
    </Column>
  ),
});
