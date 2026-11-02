import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../text";
import { Column } from "../Box";
import { DiffHistogram } from "./DiffHistogram";

const PAIRS: Array<[string, number, number]> = [
  ["additions only", 20, 0],
  ["deletions only", 0, 20],
  ["mixed", 7, 13],
  ["no changes", 0, 0],
];

const meta = defineMeta({
  title: "Adwaita/DiffHistogram",
  component: DiffHistogram,
  parameters: { width: 260, height: 160 },
});
export default meta;

export const diffHistogram = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled
        caption="DiffHistogram (additions / deletions / mixed / none)"
        style={{ width: "100%" }}
      >
        <Column gap={8} style={{ width: "100%" }}>
          {PAIRS.map(([label, ins, del]) => (
            <Labeled key={label} caption={label} style={{ width: "100%" }}>
              <DiffHistogram insertions={ins} deletions={del} />
            </Labeled>
          ))}
        </Column>
      </Labeled>
    </Column>
  ),
});
