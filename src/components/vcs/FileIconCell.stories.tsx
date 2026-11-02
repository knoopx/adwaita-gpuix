import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../text";
import { Column } from "../Box";
import { FileIconCell } from "./FileIconCell";

const PATHS = [
  "src/screens/ChangesView.tsx",
  "src/hooks/useListFollow.ts",
  "scripts/deploy.sh",
  "flake.nix",
  "bun.lock",
  "assets/logo.png",
  "README.md",
  "src/notes/",
];

const meta = defineMeta({
  title: "Adwaita/FileIconCell",
  component: FileIconCell,
  parameters: { width: 220, height: 260 },
});
export default meta;

export const fileIcons = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled
        caption="FileIconCell (Material Symbols file-type icons, accent-tinted)"
        style={{ width: "100%" }}
      >
        <Column gap={4} style={{ width: "100%" }}>
          {PATHS.map((path) => (
            <FileIconCell key={path} path={path} />
          ))}
        </Column>
      </Labeled>
    </Column>
  ),
});
