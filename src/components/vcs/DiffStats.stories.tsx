import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../text";
import { Column } from "../Box";
import { DiffStats } from "./DiffStats";
import { fileRowStats, type FileRowData } from "./FileRowData";

const COUNTS: Array<[number, number]> = [
  [42, 0],
  [27, 6],
  [3040, 128],
  [0, 884],
];

const meta = defineMeta({
  title: "Adwaita/DiffStats",
  component: DiffStats,
  parameters: { width: 300, height: 190 },
});
export default meta;

export const diffStats = defineStory({
  render: () => {
    const files: FileRowData[] = COUNTS.map(([insertions, deletions], i) => ({
      status: "M",
      path: `file${i}.ts`,
      insertions,
      deletions,
    }));
    const stats = fileRowStats(files);
    return (
      <Column gap={16} align="center">
        <Labeled
          caption="DiffStats (columns align to the widest counts of the list)"
          style={{ width: "100%" }}
        >
          <Column gap={4} style={{ width: "100%" }}>
            {files.map((f, i) => (
              <DiffStats
                key={i}
                insertions={f.insertions}
                deletions={f.deletions}
                stats={stats}
              />
            ))}
          </Column>
        </Labeled>
      </Column>
    );
  },
});
