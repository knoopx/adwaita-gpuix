import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../text";
import { Column } from "../Box";
import { FilePathCell } from "./FilePathCell";

const PATHS = [
  "src/components/vcs/FilePathCell.tsx",
  "src/plugins/core/components/composer/Composer.tsx",
  "a/very/deeply/nested/path/that/does/not/fit/the/panel.ts",
];

const meta = defineMeta({
  title: "Adwaita/FilePathCell",
  component: FilePathCell,
  parameters: { width: 320, height: 140 },
});
export default meta;

export const filePaths = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled
        caption="FilePathCell (grows, ellipsizes at the panel edge)"
        style={{ width: "100%" }}
      >
        <Column gap={4} style={{ width: 280 }}>
          {PATHS.map((path) => (
            <FilePathCell key={path} path={path} />
          ))}
        </Column>
      </Labeled>
    </Column>
  ),
});
