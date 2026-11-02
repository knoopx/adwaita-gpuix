import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../text";
import { Column } from "../Box";
import { FileStatusCell } from "./FileStatusCell";

const STATUSES = ["A", "M", "D", "R"];

const meta = defineMeta({
  title: "Adwaita/FileStatusCell",
  component: FileStatusCell,
  parameters: { width: 220, height: 170 },
});
export default meta;

export const fileStatuses = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled
        caption="FileStatusCell (added / modified / deleted / renamed)"
        style={{ width: "100%" }}
      >
        <Column gap={4} style={{ width: "100%" }}>
          {STATUSES.map((status) => (
            <FileStatusCell key={status} status={status} />
          ))}
        </Column>
      </Labeled>
    </Column>
  ),
});
