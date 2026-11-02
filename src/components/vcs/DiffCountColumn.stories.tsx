import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../text";
import { Column } from "../Box";
import { DiffCountColumn } from "./DiffCountColumn";

const meta = defineMeta({
  title: "Adwaita/DiffCountColumn",
  component: DiffCountColumn,
  parameters: { width: 220, height: 150 },
});
export default meta;

export const diffCountColumn = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled
        caption="DiffCountColumn (add / del, zero is dim, fixed width)"
        style={{ width: "100%" }}
      >
        <Column gap={4} style={{ width: "100%" }}>
          <DiffCountColumn lines={42} sign="add" width={56} />
          <DiffCountColumn lines={0} sign="add" width={56} />
          <DiffCountColumn lines={128} sign="del" width={56} />
        </Column>
      </Labeled>
    </Column>
  ),
});
