import { defineMeta, defineStory } from "storybook";
import { Labeled } from "../common";
import { Column } from "../Box";
import { FileTree, type FileTreeNode } from "./FileTree";

const STORYBOOK_TREE: FileTreeNode[] = [
  {
    name: "src",
    type: "folder",
    children: [
      {
        name: "components",
        type: "folder",
        children: [
          { name: "Button.tsx", type: "file" },
          { name: "Badge.tsx", type: "file" },
        ],
      },
      {
        name: "ai",
        type: "folder",
        children: [{ name: "Chat.tsx", type: "file" }],
      },
      { name: "utils.ts", type: "file" },
    ],
  },
];

const DEEP_TREE: FileTreeNode[] = [
  {
    name: "repo",
    type: "folder",
    children: [
      {
        name: "src",
        type: "folder",
        children: [
          {
            name: "components",
            type: "folder",
            children: [
              {
                name: "ai",
                type: "folder",
                children: [
                  { name: "FileTree.tsx", type: "file" },
                  { name: "Chat.tsx", type: "file" },
                ],
              },
              { name: "Button.tsx", type: "file" },
            ],
          },
          { name: "utils.ts", type: "file" },
        ],
      },
      { name: "README.md", type: "file" },
    ],
  },
];

const ALL_EXPANDED_PATHS = ["src", "src/components", "src/ai"];

export default defineMeta({
  title: "Adwaita/FileTree",
  component: FileTree,
  parameters: { width: 528, height: 320 },
});

export const tree = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="src/components open, Button.tsx selected">
        <FileTree
          items={STORYBOOK_TREE}
          defaultExpandedPaths={["src", "src/components"]}
          selectedPath="src/components/Button.tsx"
          onSelect={() => {}}
        />
      </Labeled>
    </Column>
  ),
});

export const expanded = defineStory({
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="all folders expanded">
        <FileTree
          items={STORYBOOK_TREE}
          defaultExpandedPaths={ALL_EXPANDED_PATHS}
          onSelect={() => {}}
        />
      </Labeled>
    </Column>
  ),
});

export const collapsed = defineStory({
  parameters: { width: 528, height: 140 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="all folders collapsed">
        <FileTree items={STORYBOOK_TREE} onSelect={() => {}} />
      </Labeled>
    </Column>
  ),
});

export const deepNesting = defineStory({
  parameters: { width: 528, height: 360 },
  render: () => (
    <Column gap={16} align="center">
      <Labeled caption="five levels deep, repo/src/components/ai/FileTree.tsx selected">
        <FileTree
          items={DEEP_TREE}
          defaultExpandedPaths={[
            "repo",
            "repo/src",
            "repo/src/components",
            "repo/src/components/ai",
          ]}
          selectedPath="repo/src/components/ai/FileTree.tsx"
          onSelect={() => {}}
        />
      </Labeled>
    </Column>
  ),
});
